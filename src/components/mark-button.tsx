"use client";

import { useState, useTransition } from "react";
import { toggleMark } from "@/modules/vocabulary/actions";

// Đánh dấu/bỏ đánh dấu một từ. Đổi giao diện ngay, hoàn lại nếu server không lưu được.
export function MarkButton({ wordId, initial }: { wordId: string; initial: boolean }) {
  const [marked, setMarked] = useState(initial);
  const [, startTransition] = useTransition();

  function toggle() {
    const next = !marked;
    setMarked(next);
    startTransition(async () => {
      const result = await toggleMark(wordId);
      setMarked(result.ok ? result.marked : !next);
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={marked}
      className={
        marked
          ? "inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-marked bg-marked px-3 text-sm font-medium text-marked-foreground"
          : "inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-line px-3 text-sm text-muted hover:text-foreground"
      }
    >
      <svg viewBox="0 0 24 24" aria-hidden className="size-4" fill={marked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
        <path d="M6 4h12v17l-6-4-6 4V4Z" />
      </svg>
      {marked ? "Đã đánh dấu" : "Đánh dấu"}
    </button>
  );
}
