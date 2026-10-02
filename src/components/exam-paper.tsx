"use client";

import { useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { CheckingNotice } from "@/components/checking-notice";
import { ExamTimer } from "@/components/exam-timer";
import { Button } from "@/components/ui/button";

function SubmitExamButton() {
  const { pending } = useFormStatus();
  return (
    <>
      <Button type="submit" className="w-full sm:w-fit" disabled={pending}>
        {pending ? "Đang kiểm tra…" : "Nộp bài"}
      </Button>
      {pending ? <CheckingNotice /> : null}
    </>
  );
}

export function ExamPaper({
  endsAt,
  submitted,
  action,
  hideSubmit = false,
  children,
}: {
  endsAt: string;
  submitted: boolean;
  action: (formData: FormData) => void | Promise<void>;
  hideSubmit?: boolean;
  children: React.ReactNode;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const sent = useRef(false);

  useEffect(() => {
    if (submitted) return;
    const end = new Date(endsAt).getTime();
    const timer = window.setInterval(() => {
      if (sent.current) return;
      if (Date.now() < end) return;
      sent.current = true;
      formRef.current?.requestSubmit();
    }, 1000);
    return () => window.clearInterval(timer);
  }, [endsAt, submitted]);

  return (
    <form ref={formRef} action={action} className="grid gap-6">
      <div className="sticky top-[65px] z-10 flex items-center justify-between gap-4 border-b border-line bg-background/95 py-2 backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:py-0">
        <ExamTimer endsAt={endsAt} submitted={submitted} />
        {submitted || hideSubmit ? null : <span className="hidden sm:block"><SubmitExamButton /></span>}
      </div>
      {children}
      {submitted || hideSubmit ? null : (
        <div className="sticky bottom-3 z-10 rounded-xl border border-line bg-background/95 p-2 shadow-lg backdrop-blur sm:hidden">
          <SubmitExamButton />
        </div>
      )}
    </form>
  );
}
