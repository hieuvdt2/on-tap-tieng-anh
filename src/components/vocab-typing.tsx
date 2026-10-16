"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { AnswerMark } from "@/components/answer-mark";
import { IpaText, IpaToggle } from "@/components/ipa-toggle";
import { MarkButton } from "@/components/mark-button";
import { ReportWordButton } from "@/components/report-word-button";
import { SpeakButton } from "@/components/speak-button";
import { Button } from "@/components/ui/button";
import { gradeWord } from "@/modules/vocabulary/actions";
import type { VocabCard } from "@/modules/vocabulary/queries";
import { dropHead, requeueHead } from "@/modules/vocabulary/session";
import { hint, maskExample, typingVerdict } from "@/modules/vocabulary/typing";

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.85;
  window.speechSynthesis.speak(utterance);
}

// Luyện chủ động: thấy nghĩa tiếng Việt (mode "meaning") hoặc nghe đọc (mode "listen") rồi tự gõ từ
// tiếng Anh. Sai thì từ quay lại sau vài từ; chỉ lần đầu của mỗi từ được tính vào lịch ôn.
export function VocabTyping({ words: initialWords, mode = "meaning" }: { words: VocabCard[]; mode?: "meaning" | "listen" }) {
  const [words] = useState(initialWords);
  const [queue, setQueue] = useState(() => words.map((word) => word.id));
  const [first, setFirst] = useState<Record<string, boolean>>({});
  const [value, setValue] = useState("");
  const [result, setResult] = useState<boolean | null>(null);
  const [close, setClose] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const byId = new Map(words.map((word) => [word.id, word]));
  const current = queue[0] ? byId.get(queue[0]) : undefined;
  const currentId = current?.id;

  useEffect(() => {
    if (mode === "listen" && current) speak(current.headword);
    // Chỉ đọc khi sang từ mới (hoặc từ quay lại), không đọc lại mỗi lần gõ.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, currentId, queue.length]);

  if (!current) {
    const missed = words.filter((word) => first[word.id] === false);
    const right = words.length - missed.length;
    return (
      <section className="grid gap-4 rounded-xl border border-accent/40 bg-card p-5">
        <h2 className="font-serif text-2xl">
          Đúng ngay lần đầu {right}/{words.length} từ
        </h2>
        {missed.length > 0 ? (
          <div className="grid gap-2">
            <p className="text-sm font-medium">Từ gõ chưa đúng lần đầu:</p>
            <ul className="grid gap-1 text-sm">
              {missed.map((item) => (
                <li key={item.id}>
                  <strong>{item.headword}</strong>: {item.meaningVi}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-muted">Gõ đúng hết. Rất tốt.</p>
        )}
        <Button asChild className="w-fit">
          <Link href="/vocabulary">Về trang Từ vựng</Link>
        </Button>
      </section>
    );
  }

  const word = current;
  const hasHint = hintLevel > 0 || (mode === "meaning" && !word.example);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (result !== null || !value.trim()) return;
    const verdict = typingVerdict(value, word.headword);
    if (verdict === "close") {
      // Gần đúng: cho gõ lại một lần mà không tính sai.
      setClose(true);
      return;
    }
    const correct = verdict === "correct";
    setClose(false);
    setResult(correct);
    if (first[word.id] === undefined) {
      setFirst((prev) => ({ ...prev, [word.id]: correct }));
      startTransition(async () => {
        await gradeWord(word.id, correct);
      });
    }
  }

  function next() {
    const correct = result === true;
    setQueue((prev) => (correct ? dropHead(prev) : requeueHead(prev)));
    setValue("");
    setResult(null);
    setClose(false);
    setHintLevel(0);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  return (
    <section className="grid gap-5 rounded-xl border border-line bg-card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted">Còn {queue.length} lượt</p>
        <div className="flex flex-wrap gap-2">
          <IpaToggle />
          <MarkButton key={word.id} wordId={word.id} initial={word.marked} />
        </div>
      </div>
      {mode === "listen" ? (
        <div className="grid gap-2">
          <p className="text-sm text-muted">Nghe và gõ lại từ tiếng Anh:</p>
          <Button type="button" variant="outline" className="w-fit gap-2" onClick={() => speak(word.headword)}>
            <span aria-hidden>🔊</span> Nghe lại
          </Button>
          <p className="text-muted">{word.wordClass}</p>
        </div>
      ) : (
        <>
          <div className="grid gap-1">
            <p className="text-sm text-muted">Gõ từ tiếng Anh có nghĩa:</p>
            <h2 className="font-serif text-3xl font-medium">{word.meaningVi}</h2>
            <p className="text-muted">{word.wordClass}</p>
          </div>
          {word.example ? <p className="leading-7 text-muted">“{maskExample(word.example, word.headword)}”</p> : null}
        </>
      )}

      <form onSubmit={submit} className="grid gap-3">
        <label className="grid gap-1 text-sm">
          Từ tiếng Anh
          <input
            ref={inputRef}
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setClose(false);
            }}
            disabled={result !== null}
            autoFocus
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            autoComplete="off"
            placeholder={hasHint ? hint(word.headword, Math.max(1, hintLevel)) : "Gõ ở đây"}
            className="h-12 rounded-lg border border-line bg-background px-3 text-lg"
          />
        </label>
        {close ? <p className="text-sm text-warning">Gần đúng rồi, kiểm tra lại chính tả và gõ lại nhé.</p> : null}
        {result === null ? (
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={!value.trim()}>
              Kiểm tra
            </Button>
            <Button type="button" variant="outline" onClick={() => setHintLevel((level) => Math.min(level + 1, 3))}>
              Gợi ý
            </Button>
          </div>
        ) : null}
      </form>

      {result !== null ? (
        <div className="grid gap-3">
          <p className="flex items-center gap-2 text-lg font-medium">
            <AnswerMark correct={result} />
            {result ? "Đúng" : "Chưa đúng"}
          </p>
          <div className="flex items-center gap-3">
            <p className="text-2xl font-semibold text-accent">
              {word.headword}
              <span className="text-base font-normal text-muted">
                <IpaText ipa={word.ipa} />
              </span>
            </p>
            <SpeakButton text={word.headword} />
          </div>
          {mode === "listen" ? <p className="text-muted">{word.meaningVi}</p> : null}
          {!result ? <p className="text-sm text-muted">Từ này sẽ quay lại sau vài từ nữa.</p> : null}
          {word.example ? <p className="leading-7">“{word.example}”</p> : null}
          {word.note ? <p className="text-sm leading-6 text-muted">{word.note}</p> : null}
          {word.unverified ? <ReportWordButton key={word.id} wordId={word.id} /> : null}
          <Button type="button" className="w-fit" onClick={next}>
            {result && queue.length === 1 ? "Xem kết quả" : "Tiếp →"}
          </Button>
        </div>
      ) : null}
    </section>
  );
}
