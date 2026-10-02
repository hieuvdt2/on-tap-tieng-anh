"use client";

import { useActionState, useState } from "react";
import { AnswerMark } from "@/components/answer-mark";
import { CheckingNotice } from "@/components/checking-notice";
import { CompletionActions } from "@/components/completion-actions";
import { FinishedNotice } from "@/components/finished-notice";
import { SentenceOrder } from "@/components/sentence-order";
import { Button } from "@/components/ui/button";
import type { GradedAnswer } from "@/modules/exam/actions";

type Sentence = { id: string; text: string };

export function OrderingPractice({
  questionId,
  sentences,
  action,
}: {
  questionId: string;
  sentences: Sentence[];
  action: (state: GradedAnswer[] | null, formData: FormData) => Promise<GradedAnswer[] | null>;
}) {
  const [order, setOrder] = useState(sentences.map((sentence) => sentence.id));
  const [result, submit, pending] = useActionState(action, null);

  if (result?.[0]) {
    const item = result[0];
    return (
      <div className="grid gap-4">
      <FinishedNotice />
      <article className="grid gap-2 rounded-xl border border-line bg-card px-4 py-4">
        <div className="flex items-center justify-center gap-3">
          <AnswerMark correct={item.isCorrect} />
          <h2 className="font-serif text-2xl">{item.isCorrect ? "Đúng thứ tự" : "Chưa đúng thứ tự"}</h2>
        </div>
        <p className="text-sm text-muted">Thứ tự bạn chọn: {item.selectedText}</p>
        <p className="text-sm">Thứ tự đúng: {item.correctText}</p>
        <p className="leading-6 text-muted">{item.explanation}</p>
      </article>
      <CompletionActions continueHref="/ordering" continueLabel="Làm câu khác" />
      </div>
    );
  }

  return (
    <form action={submit} className="grid gap-3">
      <input type="hidden" name="questionId" value={questionId} />
      <input type="hidden" name="answer" value={order.join(",")} />
      <SentenceOrder sentences={sentences} order={order} onOrder={setOrder} />
      <div className="sticky bottom-3 z-10 rounded-xl border border-line bg-background/95 p-2 shadow-lg backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
        <Button type="submit" disabled={pending} className="w-full sm:w-fit">
          {pending ? "Đang kiểm tra…" : "Chấm thứ tự"}
        </Button>
      </div>
      {pending ? <CheckingNotice /> : null}
    </form>
  );
}
