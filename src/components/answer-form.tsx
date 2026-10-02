"use client";

import { useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { CheckingNotice } from "@/components/checking-notice";
import { Button } from "@/components/ui/button";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <>
      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Đang kiểm tra…" : "Nộp đáp án"}
      </Button>
      {pending ? <CheckingNotice /> : null}
    </>
  );
}

export function AnswerForm({
  action,
  sessionId,
  questionId,
  options,
}: {
  action: (formData: FormData) => void | Promise<void>;
  sessionId: string;
  questionId: string;
  options: { id: string; text: string }[];
}) {
  const started = useRef(0);
  useEffect(() => {
    started.current = Date.now();
  }, []);

  return (
    <form
      action={action}
      className="grid gap-3"
      onSubmit={(event) => {
        const field = event.currentTarget.elements.namedItem("responseTimeMs");
        if (field instanceof HTMLInputElement) {
          field.value = String(Date.now() - started.current);
        }
      }}
    >
      <input type="hidden" name="sessionId" value={sessionId} />
      <input type="hidden" name="questionId" value={questionId} />
      <input type="hidden" name="responseTimeMs" defaultValue="0" />
      {options.map((option) => (
        <label
          key={option.id}
          className="flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border border-line bg-card px-4 py-3 leading-6 has-[:checked]:border-accent"
        >
          <input className="mt-1 size-4 shrink-0 accent-accent" type="radio" name="selectedAnswer" value={option.id} required />
          <span>{option.text}</span>
        </label>
      ))}
      <div className="sticky bottom-3 z-10 rounded-xl border border-line bg-background/95 p-2 shadow-lg backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:p-0 sm:pt-2 sm:shadow-none">
        <SubmitButton />
      </div>
    </form>
  );
}
