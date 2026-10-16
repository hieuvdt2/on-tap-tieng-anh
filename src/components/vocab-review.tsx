"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { AnswerMark } from "@/components/answer-mark";
import { IpaText, IpaToggle } from "@/components/ipa-toggle";
import { MarkButton } from "@/components/mark-button";
import { ReportWordButton } from "@/components/report-word-button";
import { SpeakButton } from "@/components/speak-button";
import { Button } from "@/components/ui/button";
import { gradeWord } from "@/modules/vocabulary/actions";
import type { VocabCard } from "@/modules/vocabulary/queries";
import { dropHead, requeueHead } from "@/modules/vocabulary/session";

export type ReviewItem = { word: VocabCard; options: string[] };

// Trắc nghiệm chọn nghĩa. Từ trả lời sai quay lại sau vài từ cho đến khi đúng; chỉ lần trả lời ĐẦU
// tiên của mỗi từ được tính vào lịch ôn (làm lại cho đến đúng là để nhớ, không phải để gỡ điểm).
// gradeMode "wrong-only": dùng ngay sau khi học từ mới, chỉ ghi nhận từ sai (từ đúng giữ lịch ôn ban đầu).
export function VocabReview({
  items: initialItems,
  gradeMode = "all",
  footer,
}: {
  items: ReviewItem[];
  gradeMode?: "all" | "wrong-only";
  footer?: React.ReactNode;
}) {
  // Giữ nguyên bộ từ của buổi này trong state: nếu trang bị server render lại giữa chừng (từ ngẫu nhiên mới)
  // thì buổi đang làm không bị lệch hàng đợi.
  const [items] = useState(initialItems);
  const [queue, setQueue] = useState(() => items.map((item) => item.word.id));
  const [first, setFirst] = useState<Record<string, boolean>>({});
  const [picked, setPicked] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const byId = new Map(items.map((item) => [item.word.id, item]));
  const current = queue[0] ? byId.get(queue[0]) : undefined;

  if (!current) {
    const missed = items.filter((item) => first[item.word.id] === false).map((item) => item.word);
    const right = items.length - missed.length;
    return (
      <section className="grid gap-4 rounded-xl border border-accent/40 bg-card p-5">
        <h2 className="font-serif text-2xl">
          Đúng ngay lần đầu {right}/{items.length} từ
        </h2>
        {missed.length > 0 ? (
          <div className="grid gap-2">
            <p className="text-sm font-medium">Từ cần chú ý (sẽ hiện lại sớm trong phần ôn):</p>
            <ul className="grid gap-1 text-sm">
              {missed.map((word) => (
                <li key={word.id}>
                  <strong>{word.headword}</strong>: {word.meaningVi}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-muted">Nhớ hết rồi. Những từ này sẽ hiện lại sau nhiều ngày hơn.</p>
        )}
        {footer ?? (
          <Button asChild className="w-fit">
            <Link href="/vocabulary">Về trang Từ vựng</Link>
          </Button>
        )}
      </section>
    );
  }

  const { word, options } = current;
  const answered = picked !== null;
  const wasRight = picked === word.meaningVi;

  function choose(option: string) {
    if (answered) return;
    setPicked(option);
    const correct = option === word.meaningVi;
    if (first[word.id] === undefined) {
      setFirst((value) => ({ ...value, [word.id]: correct }));
      if (gradeMode === "all" || !correct) {
        startTransition(async () => {
          await gradeWord(word.id, correct);
        });
      }
    }
  }

  function next() {
    setQueue((value) => (wasRight ? dropHead(value) : requeueHead(value)));
    setPicked(null);
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
      <div className="flex items-center gap-3">
        <h2 className="font-serif text-4xl font-medium">{word.headword}</h2>
        <SpeakButton text={word.headword} />
      </div>
      <p className="-mt-3 text-muted">
        {word.wordClass}
        <IpaText ipa={word.ipa} />
      </p>
      <ul className="grid gap-2" aria-label="Chọn nghĩa đúng">
        {options.map((option) => {
          const isRight = option === word.meaningVi;
          const chosen = picked === option;
          const tone = !answered
            ? "border-line hover:border-accent/50"
            : isRight
              ? "border-accent bg-accent/10"
              : chosen
                ? "border-danger bg-danger/5"
                : "border-line opacity-70";
          return (
            <li key={option}>
              <button
                type="button"
                disabled={answered}
                onClick={() => choose(option)}
                className={`flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left ${tone}`}
              >
                <span>{option}</span>
                {answered && (isRight || chosen) ? <AnswerMark correct={isRight} /> : null}
              </button>
            </li>
          );
        })}
      </ul>
      {answered ? (
        <div className="grid gap-2">
          {!wasRight ? <p className="text-sm text-muted">Từ này sẽ quay lại sau vài từ nữa.</p> : null}
          {word.example ? <p className="leading-7">“{word.example}”</p> : null}
          {word.note ? <p className="text-sm leading-6 text-muted">{word.note}</p> : null}
          {word.unverified ? <ReportWordButton key={word.id} wordId={word.id} /> : null}
          <Button type="button" className="w-fit" onClick={next}>
            {wasRight && queue.length === 1 ? "Xem kết quả" : "Tiếp →"}
          </Button>
        </div>
      ) : null}
    </section>
  );
}
