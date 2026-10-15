"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { reportQuestion, type ReportState } from "@/modules/questions/report-actions";

const reasons = [
  { value: "wrong_answer", label: "Đáp án sai" },
  { value: "unclear", label: "Câu hỏi khó hiểu hoặc có lỗi" },
  { value: "other", label: "Lý do khác" },
] as const;

// Không dùng <form>: ở trang xem lại đề thi, câu hỏi nằm trong form của ExamPaper và HTML không cho
// lồng form — trình duyệt sẽ gộp vào form ngoài và gửi nhầm action nộp bài.
export function ReportQuestion({ questionId, reported }: { questionId: string; reported: boolean }) {
  const [reason, setReason] = useState<(typeof reasons)[number]["value"]>("wrong_answer");
  const [note, setNote] = useState("");
  const [state, setState] = useState<ReportState>(reported ? { status: "done" } : null);
  const [pending, startTransition] = useTransition();

  if (state?.status === "done") {
    return (
      <p className="text-sm text-muted">
        Đã báo câu này. Câu sẽ không được đưa vào bài mới cho đến khi được xem lại.
      </p>
    );
  }

  function send() {
    const data = new FormData();
    data.set("questionId", questionId);
    data.set("reason", reason);
    data.set("note", note);
    startTransition(async () => setState(await reportQuestion(null, data)));
  }

  return (
    <details className="text-sm">
      <summary className="min-h-11 cursor-pointer py-2 text-muted hover:text-foreground">Báo câu sai</summary>
      <div className="grid gap-3 pt-2">
        <fieldset className="m-0 grid gap-1 border-0 p-0">
          <legend className="mb-1 p-0 font-medium">Câu này có vấn đề gì?</legend>
          {reasons.map((item) => (
            <label key={item.value} className="flex min-h-11 cursor-pointer items-center gap-2">
              <input
                type="radio"
                name={`report-reason-${questionId}`}
                checked={reason === item.value}
                onChange={() => setReason(item.value)}
                className="size-4 accent-accent"
              />
              {item.label}
            </label>
          ))}
        </fieldset>
        <label className="grid gap-1">
          Ghi chú (không bắt buộc)
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            maxLength={300}
            rows={2}
            className="rounded-lg border border-line bg-background px-3 py-2"
          />
        </label>
        {state?.status === "error" ? <p className="text-danger">Chưa gửi được. Hãy thử lại.</p> : null}
        <Button type="button" variant="outline" onClick={send} disabled={pending} className="w-fit">
          {pending ? "Đang gửi…" : "Gửi báo cáo"}
        </Button>
      </div>
    </details>
  );
}
