"use client";

import { useState } from "react";

export function PinnedPassage({
  title,
  children,
  className = "top-[73px] sm:top-4",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(true);

  return (
    <article className={`sticky z-[5] overflow-hidden rounded-xl border border-line bg-card shadow-md ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2 sm:px-5">
        <h2 className="min-w-0 truncate font-serif text-lg">{title ?? "Đoạn văn"}</h2>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="min-h-9 shrink-0 rounded-lg border border-line px-3 text-xs font-medium hover:bg-background"
        >
          {open ? "Thu gọn" : "Xem đoạn văn"}
        </button>
      </div>
      {open ? (
        <div className="max-h-[30svh] overflow-y-auto overscroll-contain px-4 py-3 leading-7 whitespace-pre-wrap sm:max-h-[45vh] sm:px-5">
          {children}
        </div>
      ) : null}
    </article>
  );
}
