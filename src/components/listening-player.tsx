"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

// Đoạn nghe được đọc bằng giọng của trình duyệt (speechSynthesis). Văn bản bị ẩn khi làm bài để không
// thành bài đọc; xem lại sau khi nộp. Trình duyệt không hỗ trợ giọng đọc thì cho xem văn bản.
const SPEEDS = [
  { label: "Chậm", rate: 0.8 },
  { label: "Bình thường", rate: 1 },
] as const;

function supported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

type Turn = { speaker: string | null; text: string };

// Đoạn hội thoại viết dạng "A: ... B: ...": tách theo người nói để mỗi người được gán giọng riêng.
// Đoạn không có nhãn người nói (độc thoại) trả về nguyên một lượt, speaker null.
function splitTurns(text: string): Turn[] {
  const labels = [...text.matchAll(/(?:^|\s)([A-Z]):\s+/g)];
  if (labels.length < 2) return [{ speaker: null, text }];
  const turns: Turn[] = [];
  for (let i = 0; i < labels.length; i++) {
    const match = labels[i]!;
    const start = match.index! + match[0].length;
    const end = i + 1 < labels.length ? labels[i + 1]!.index! : text.length;
    const content = text.slice(start, end).trim();
    if (content) turns.push({ speaker: match[1]!, text: content });
  }
  return turns;
}

// Giọng máy mặc định của hệ điều hành (vd "eSpeak", "Compact") nghe đều đều, thiếu tự nhiên hơn hẳn giọng
// nền tảng (Google/Microsoft Natural/Online). Xếp hạng để tự động chọn giọng tốt nhất, không bắt học sinh
// phải tự chọn.
function rankVoice(voice: SpeechSynthesisVoice) {
  const name = voice.name.toLowerCase();
  let score = 0;
  if (/natural|online|neural|wavenet|premium|enhanced/.test(name)) score += 3;
  if (/google/.test(name)) score += 2;
  if (voice.lang.toLowerCase() === "en-us" || voice.lang.toLowerCase() === "en-gb") score += 1;
  if (/compact|espeak|robot/.test(name)) score -= 3;
  return score;
}

function englishVoices(voices: SpeechSynthesisVoice[]) {
  const en = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
  return [...(en.length ? en : voices)].sort((a, b) => rankVoice(b) - rankVoice(a));
}

// Khác giọng (pitch) theo thứ tự xuất hiện của người nói, để A/B nghe tách biệt kể cả khi trình duyệt
// chỉ có một giọng tiếng Anh. Có nhiều giọng thật thì ưu tiên đổi voice trước, pitch chỉ là lớp bổ sung.
const SPEAKER_PITCHES = [1, 1.3, 0.85, 1.15];
// Dừng ngắn giữa các câu, dừng lâu hơn khi đổi người nói: tránh nghe dồn dập như đọc liến thoắng.
const SENTENCE_PAUSE_MS = 220;
const TURN_PAUSE_MS = 500;

export function ListeningPlayer({ text, title }: { text: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [plays, setPlays] = useState(0);
  const [showText, setShowText] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const stopped = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!supported()) return;
    // getVoices() có thể trả về mảng rỗng lúc đầu, danh sách thật chỉ có sau sự kiện voiceschanged.
    const update = () => setVoices(window.speechSynthesis.getVoices());
    update();
    window.speechSynthesis.addEventListener("voiceschanged", update);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", update);
      if (timer.current) clearTimeout(timer.current);
      window.speechSynthesis.cancel();
    };
  }, []);

  function stop() {
    stopped.current = true;
    if (timer.current) clearTimeout(timer.current);
    if (supported()) window.speechSynthesis.cancel();
    setPlaying(false);
  }

  function play() {
    if (!supported()) {
      setShowText(true);
      return;
    }
    window.speechSynthesis.cancel();
    stopped.current = false;

    const turns = splitTurns(text);
    const speakerIndex = new Map<string, number>();
    for (const turn of turns) {
      if (turn.speaker && !speakerIndex.has(turn.speaker)) speakerIndex.set(turn.speaker, speakerIndex.size);
    }
    const ranked = englishVoices(voices);
    const primary = ranked[0];
    // Người nói thứ hai dùng giọng tốt tiếp theo khác với giọng chính, nếu máy có; không thì dùng chung
    // giọng chính và chỉ khác ở pitch.
    const secondary = ranked.find((v) => v.voiceURI !== primary?.voiceURI) ?? primary;
    const voiceFor = (index: number) => (index === 0 ? primary : secondary);

    type Item = { text: string; voice: SpeechSynthesisVoice | undefined; pitch: number; pauseAfter: number };
    const queue: Item[] = [];
    turns.forEach((turn, turnIndex) => {
      const speakerPos = turn.speaker ? (speakerIndex.get(turn.speaker) ?? 0) : 0;
      const voice = voiceFor(speakerPos);
      const pitch = SPEAKER_PITCHES[speakerPos % SPEAKER_PITCHES.length]!;
      const sentences = turn.text.split(/(?<=[.!?])\s+/).filter(Boolean);
      sentences.forEach((sentence, sentenceIndex) => {
        const lastInTurn = sentenceIndex === sentences.length - 1;
        const lastTurn = turnIndex === turns.length - 1;
        const pauseAfter = lastInTurn && !lastTurn ? TURN_PAUSE_MS : SENTENCE_PAUSE_MS;
        queue.push({ text: sentence, voice, pitch, pauseAfter });
      });
    });
    if (queue.length === 0) return;
    setPlaying(true);
    setPlays((value) => value + 1);

    let i = 0;
    const playNext = () => {
      if (stopped.current || i >= queue.length) {
        setPlaying(false);
        return;
      }
      const item = queue[i++]!;
      const utterance = new SpeechSynthesisUtterance(item.text);
      utterance.lang = item.voice?.lang ?? "en-US";
      if (item.voice) utterance.voice = item.voice;
      utterance.pitch = item.pitch;
      utterance.rate = speed;
      const advance = () => {
        if (stopped.current) return;
        timer.current = setTimeout(playNext, item.pauseAfter);
      };
      utterance.onend = advance;
      utterance.onerror = advance;
      window.speechSynthesis.speak(utterance);
    };
    playNext();
  }

  return (
    <div className="grid gap-3">
      <h2 className="font-serif text-xl lg:text-2xl">{title}</h2>
      <p className="text-sm leading-6 text-muted">Nghe đoạn sau rồi trả lời các câu hỏi bên dưới. Bạn có thể nghe lại.</p>
      <div className="flex flex-wrap items-center gap-2">
        {playing ? (
          <Button type="button" variant="outline" onClick={stop}>
            ■ Dừng
          </Button>
        ) : (
          <Button type="button" onClick={play}>
            {plays === 0 ? "▶ Nghe" : "▶ Nghe lại"}
          </Button>
        )}
        {SPEEDS.map((item) => (
          <button
            key={item.rate}
            type="button"
            aria-pressed={speed === item.rate}
            onClick={() => setSpeed(item.rate)}
            className={
              speed === item.rate
                ? "min-h-10 rounded-lg border-2 border-accent bg-background px-3 text-sm font-medium"
                : "min-h-10 rounded-lg border border-line px-3 text-sm text-muted"
            }
          >
            {item.label}
          </button>
        ))}
        {plays > 0 ? <span className="text-sm text-muted">Đã nghe {plays} lần</span> : null}
      </div>
      {!supported() ? <p className="text-sm text-danger">Trình duyệt này không có giọng đọc, hãy xem văn bản bên dưới.</p> : null}
      <button
        type="button"
        onClick={() => setShowText((value) => !value)}
        className="w-fit text-sm text-muted underline hover:text-foreground"
      >
        {showText ? "Ẩn văn bản" : "Không nghe được? Xem văn bản"}
      </button>
      {showText ? <p className="whitespace-pre-line leading-7">{text}</p> : null}
    </div>
  );
}
