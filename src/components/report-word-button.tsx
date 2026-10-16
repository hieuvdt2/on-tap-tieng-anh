"use client";

import { useState, useTransition } from "react";
import { reportWord } from "@/modules/vocabulary/actions";

// Báo nghĩa/ví dụ của từ bị sai. Báo xong từ sẽ không còn xuất hiện trong các lượt sau.
export function ReportWordButton({ wordId }: { wordId: string }) {
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  if (done) return <span className="text-sm text-muted">Đã báo. Từ này sẽ ẩn đến khi được sửa.</span>;
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await reportWord(wordId);
          if (result.ok) setDone(true);
        })
      }
      className="text-sm text-muted underline hover:text-foreground disabled:opacity-50"
    >
      {pending ? "Đang gửi…" : "Báo nghĩa sai"}
    </button>
  );
}
