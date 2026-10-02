"use client";

import { createPortal } from "react-dom";

export function LoadingNotice({
  label,
  portal = false,
}: {
  label: string;
  portal?: boolean;
}) {
  const notice = (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-6"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="size-6 shrink-0 animate-spin rounded-full border-2 border-line border-t-accent"
        />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );

  if (portal && typeof document !== "undefined") return createPortal(notice, document.body);
  return notice;
}
