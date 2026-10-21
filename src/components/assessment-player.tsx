"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ListeningPlayer } from "@/components/listening-player";
import { Button } from "@/components/ui/button";
import { answerAssessment } from "@/modules/assessment/actions";
import { SKILL_LABELS, TEST_LENGTH } from "@/modules/assessment/engine";
import type { PublicItem } from "@/modules/assessment/queries";

// Bài đánh giá hiện từng câu một: không quay lại câu trước, câu sau do máy chọn theo kết quả các câu đã làm.
export function AssessmentPlayer({ sessionId, initial, index: initialIndex }: { sessionId: string; initial: PublicItem; index: number }) {
  const router = useRouter();
  const [item, setItem] = useState(initial);
  const [index, setIndex] = useState(initialIndex);
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit() {
    if (!selected) return;
    setError(null);
    startTransition(async () => {
      const result = await answerAssessment(sessionId, item.questionId, selected);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      if (result.done) {
        router.refresh();
        return;
      }
      setItem(result.item);
      setIndex(result.index);
      setSelected(null);
    });
  }

  return (
    <section className="mx-auto grid w-full max-w-2xl gap-5 rounded-xl border border-line bg-card p-5 sm:p-6">
      <div className="grid gap-2">
        <div className="flex items-center justify-between text-sm text-muted">
          <span>
            Câu {index}/{TEST_LENGTH} · {SKILL_LABELS[item.skill]}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-background" aria-hidden>
          <div className="h-full rounded-full bg-accent" style={{ width: `${((index - 1) / TEST_LENGTH) * 100}%` }} />
        </div>
      </div>

      {item.stimulus ? (
        item.stimulus.kind === "listening" ? (
          <ListeningPlayer key={item.questionId} title={item.stimulus.title} text={item.stimulus.body} />
        ) : (
          <div className="grid gap-2 rounded-lg border border-line bg-background p-4">
            <h2 className="font-serif text-lg">{item.stimulus.title}</h2>
            <p className="leading-7">{item.stimulus.body}</p>
          </div>
        )
      ) : null}

      <h2 className="text-lg font-medium leading-7">{item.stem}</h2>
      <ul className="grid gap-2" aria-label="Các lựa chọn">
        {item.options.map((option) => (
          <li key={option.id}>
            <label
              className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 ${
                selected === option.id ? "border-accent bg-accent/10" : "border-line hover:border-accent/50"
              }`}
            >
              <input
                type="radio"
                name={`q-${item.questionId}`}
                value={option.id}
                checked={selected === option.id}
                onChange={() => setSelected(option.id)}
                className="sr-only"
              />
              <span className="grid size-7 shrink-0 place-items-center rounded-full border border-line text-sm font-semibold">
                {option.id.toUpperCase()}
              </span>
              <span>{option.text}</span>
            </label>
          </li>
        ))}
      </ul>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">Không thể quay lại câu trước. Chọn đáp án bạn thấy đúng nhất.</p>
        <Button type="button" disabled={!selected || pending} onClick={submit}>
          {pending ? "Đang lưu…" : index === TEST_LENGTH ? "Nộp bài" : "Câu tiếp theo →"}
        </Button>
      </div>
    </section>
  );
}
