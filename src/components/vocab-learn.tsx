"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { IpaText, IpaToggle } from "@/components/ipa-toggle";
import { MarkButton } from "@/components/mark-button";
import { ReportWordButton } from "@/components/report-word-button";
import { SpeakButton } from "@/components/speak-button";
import { Button } from "@/components/ui/button";
import { VocabReview, type ReviewItem } from "@/components/vocab-review";
import { markWordsLearned } from "@/modules/vocabulary/actions";

// Hai pha: xem lần lượt từng từ, rồi kiểm tra ngay chính những từ vừa xem (trắc nghiệm, sai thì hỏi lại).
// Từ vào lịch ôn khi sang pha kiểm tra; từ sai ngay lúc kiểm tra thì được hẹn ôn sớm hơn.
export function VocabLearn({
  items,
  relatives,
  theme = null,
}: {
  items: ReviewItem[];
  relatives: Record<string, string[]>;
  theme?: string | null;
}) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [phase, setPhase] = useState<"study" | "quiz">("study");
  const [pending, startTransition] = useTransition();
  const themeQuery = theme ? `&theme=${theme}` : "";
  const word = items[index]?.word;

  if (phase === "quiz") {
    return (
      <div className="grid gap-3">
        <p className="rounded-lg border border-line bg-card p-3 text-sm">
          Kiểm tra nhanh {items.length} từ vừa xem. Từ nào sai sẽ được hỏi lại.
        </p>
        <VocabReview
          items={items}
          gradeMode="wrong-only"
          footer={
            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <Link href={`/vocabulary/review?scope=recent&mode=type${themeQuery}`}>Gõ lại {items.length} từ vừa học</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={theme ? `/vocabulary/learn?theme=${theme}` : "/vocabulary/learn"}>Học thêm 10 từ</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/vocabulary">Về trang Từ vựng</Link>
              </Button>
            </div>
          }
        />
      </div>
    );
  }

  if (!word) return null;
  const last = index + 1 === items.length;
  const family = relatives[word.id] ?? [];

  function next() {
    if (!last) {
      setRevealed(false);
      setIndex((value) => value + 1);
      return;
    }
    startTransition(async () => {
      await markWordsLearned(items.map((item) => item.word.id));
      setPhase("quiz");
    });
  }

  return (
    <section className="grid gap-5 rounded-xl border border-line bg-card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted">
          Xem từ {index + 1}/{items.length}
          {word.topicName ? ` · ${word.topicName}` : ""}
        </p>
        <div className="flex flex-wrap gap-2">
          <IpaToggle />
          <MarkButton key={word.id} wordId={word.id} initial={word.marked} />
        </div>
      </div>
      <div className="grid gap-2">
        <div className="flex items-center gap-3">
          <h2 className="font-serif text-4xl font-medium">{word.headword}</h2>
          <SpeakButton text={word.headword} />
        </div>
        <p className="text-muted">
          {word.wordClass}
          <IpaText ipa={word.ipa} />
        </p>
      </div>
      {revealed ? (
        <div className="grid gap-3">
          <p className="text-xl font-medium text-accent">{word.meaningVi}</p>
          {word.example ? <p className="leading-7">“{word.example}”</p> : null}
          {word.note ? <p className="text-sm leading-6 text-muted">{word.note}</p> : null}
          {family.length > 0 ? <p className="text-sm text-muted">Cùng họ từ: {family.join(", ")}</p> : null}
          {word.unverified ? (
            <p className="flex flex-wrap items-center gap-2 text-sm text-muted">
              Nghĩa chưa được kiểm duyệt. <ReportWordButton key={word.id} wordId={word.id} />
            </p>
          ) : null}
        </div>
      ) : (
        <p className="text-sm text-muted">Thử đoán nghĩa trước rồi bấm để xem.</p>
      )}
      <div className="flex flex-wrap gap-2">
        {revealed ? (
          <Button type="button" disabled={pending} onClick={next}>
            {pending ? "Đang lưu…" : last ? "Bắt đầu kiểm tra →" : "Từ tiếp theo →"}
          </Button>
        ) : (
          <Button type="button" onClick={() => setRevealed(true)}>
            Xem nghĩa
          </Button>
        )}
      </div>
    </section>
  );
}
