"use client";

import { useRef, useState } from "react";
import { SentenceOrder } from "@/components/sentence-order";

type Sentence = { id: string; text: string };

export const EXAM_ANSWER_EVENT = "exam-answer";
export type ExamAnswerDetail = { name: string; answered: boolean };

function restoredOrder(sentences: Sentence[], saved: string | undefined) {
  const ids = sentences.map((sentence) => sentence.id);
  const order = saved?.split(",") ?? [];
  const valid = order.length === ids.length && ids.every((id) => order.includes(id));
  return valid ? order : ids;
}

export function OrderingField({
  name,
  sentences,
  saved,
}: {
  name: string;
  sentences: Sentence[];
  saved?: string;
}) {
  const [order, setOrder] = useState(() => restoredOrder(sentences, saved));
  const rootRef = useRef<HTMLDivElement>(null);

  // Ô ẩn luôn có giá trị (thứ tự ban đầu) nên không dựa vào "có giá trị" để biết đã làm hay chưa:
  // chỉ coi là đã làm khi thứ tự khác thứ tự hiển thị ban đầu.
  function changeOrder(next: string[]) {
    setOrder(next);
    const answered = next.join(",") !== sentences.map((sentence) => sentence.id).join(",");
    rootRef.current?.dispatchEvent(
      new CustomEvent<ExamAnswerDetail>(EXAM_ANSWER_EVENT, { bubbles: true, detail: { name, answered } }),
    );
  }

  return (
    <div ref={rootRef} className="grid gap-2">
      <input type="hidden" name={name} value={order.join(",")} />
      <SentenceOrder sentences={sentences} order={order} onOrder={changeOrder} />
    </div>
  );
}
