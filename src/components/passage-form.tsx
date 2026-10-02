"use client";

import { useActionState } from "react";
import { AnswerMark } from "@/components/answer-mark";
import { CheckingNotice } from "@/components/checking-notice";
import { CompletionActions } from "@/components/completion-actions";
import { FinishedNotice } from "@/components/finished-notice";
import { PinnedPassage } from "@/components/pinned-passage";
import { Button } from "@/components/ui/button";
import type { GradedAnswer } from "@/modules/exam/actions";

type Choice = { id: string; text: string };
type Item = { id: string; stem: string; options: Choice[] };

export function PassageForm({
  stimulusId,
  passageTitle,
  passageBody,
  questions,
  action,
}: {
  stimulusId: string;
  passageTitle?: string;
  passageBody?: string;
  questions: Item[];
  action: (state: GradedAnswer[] | null, formData: FormData) => Promise<GradedAnswer[] | null>;
}) {
  const [result, submit, pending] = useActionState(action, null);

  if (result) {
    const correct = result.filter((item) => item.isCorrect).length;
    return (
      <div className="grid gap-4">
        <div className="grid justify-items-center gap-2 text-center">
          <FinishedNotice />
          <h2 className="font-serif text-3xl">Đúng {correct}/{result.length} câu</h2>
          <CompletionActions continueHref="/reading" continueLabel="Làm bài đọc khác" />
        </div>
        {result.map((item) => (
          <article key={item.stem} className="grid gap-2 rounded-xl border border-line bg-card px-4 py-3">
            <div className="flex items-start gap-3">
              <AnswerMark correct={item.isCorrect} />
              <p className="leading-6">{item.stem}</p>
            </div>
            <p className="text-sm text-muted">Bạn chọn: {item.selectedText}</p>
            <p className="text-sm">Đáp án đúng: {item.correctText}</p>
            <p className="text-sm leading-6 text-muted">{item.explanation}</p>
          </article>
        ))}
      </div>
    );
  }

  return (
    <form action={submit} className="grid gap-6">
      <input type="hidden" name="stimulusId" value={stimulusId} />
      {passageBody ? <PinnedPassage title={passageTitle}>{passageBody}</PinnedPassage> : null}
      {questions.map((question, index) => (
        <div key={question.id} className="rounded-xl border border-line bg-card p-3 sm:p-4">
          <fieldset className="m-0 min-w-0 border-0 p-0">
            <legend className="mb-2 w-full p-0 leading-6 font-medium">
              {index + 1}. {question.stem}
            </legend>
            <div className="grid gap-1">
              {question.options.map((option) => (
                <label key={option.id} className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg px-2 py-2 leading-6 has-[:checked]:bg-accent/10">
                  <input className="mt-1 size-4 shrink-0 accent-accent" type="radio" name={`answer-${question.id}`} value={option.id} required />
                  <span className="min-w-0">{option.text}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      ))}
      <div className="sticky bottom-3 z-10 rounded-xl border border-line bg-background/95 p-2 shadow-lg backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
        <Button type="submit" disabled={pending} className="w-full sm:w-fit">
          {pending ? "Đang kiểm tra…" : "Nộp bài đọc"}
        </Button>
      </div>
      {pending ? <CheckingNotice /> : null}
    </form>
  );
}
