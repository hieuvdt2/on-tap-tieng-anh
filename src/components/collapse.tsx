"use client";

import { useId, useState } from "react";
import { GuideAvatar } from "@/components/guide-message";
import { cn } from "@/lib/utils";

export function Collapse({
  title,
  defaultOpen = false,
  className,
  /** Thứ tự xuất hiện khi tải trang, để các phần hiện lần lượt thay vì cùng lúc. */
  index = 0,
  /** Tắt ở danh sách nhiều mục (vd xem lại đáp án hàng loạt) để tránh lặp mèo hướng dẫn liên tục. */
  avatar = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  className?: string;
  index?: number;
  avatar?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div
      className={cn("lesson-section-in", avatar ? "flex items-start gap-3" : undefined, className)}
      style={{ animationDelay: `${index * 90}ms` }}
    >
      {avatar ? <GuideAvatar /> : null}
      <div
        className={cn(
          "min-w-0 max-w-2xl grow overflow-hidden rounded-2xl border border-line bg-card",
          avatar && "rounded-tl-sm",
        )}
      >
        <button
          type="button"
          aria-expanded={open}
          aria-controls={contentId}
          onClick={() => setOpen((value) => !value)}
          className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3.5 text-left"
        >
          <h2 className={cn("text-xs font-medium tracking-[0.14em] uppercase transition-colors", open ? "text-foreground" : "text-muted")}>
            {title}
          </h2>
          <svg
            viewBox="0 0 20 20"
            aria-hidden
            className={cn("size-4 shrink-0 text-muted transition-transform duration-300 motion-reduce:transition-none", open && "rotate-180")}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div
          id={contentId}
          className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
          style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            <div className="px-4 pb-4 text-base leading-7">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
