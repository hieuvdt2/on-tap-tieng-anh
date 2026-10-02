"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { logoutAction } from "@/app/auth-actions";
import { cn } from "@/lib/utils";

const aiLabels = { gemini: "Gemini", groq: "Groq", openrouter: "OpenRouter" } as const;

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 19.2c1.3-2.7 3.5-4 6.5-4s5.2 1.3 6.5 4" strokeLinecap="round" />
    </svg>
  );
}

export function AccountMenu({
  ai,
  user,
}: {
  ai: { choice: keyof typeof aiLabels; ready: boolean } | null;
  user: { displayName: string; username: string | null };
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const active = pathname.startsWith("/account");
  const aiStatus = ai
    ? `${aiLabels[ai.choice]} · ${ai.ready ? "đã có khóa" : "chưa có khóa"}`
    : "Chưa chọn nguồn AI";

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="menu"
        aria-label={`Tài khoản của ${user.displayName}`}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "relative grid size-11 place-items-center rounded-full border",
          active || open
            ? "border-accent bg-card text-foreground"
            : "border-line text-muted hover:text-foreground",
        )}
      >
        <UserIcon />
        {ai?.ready ? <span className="absolute top-0 right-0 size-2 rounded-full bg-accent" /> : null}
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute top-full right-0 z-20 mt-2 w-[min(16rem,calc(100vw-2rem))] rounded-xl border border-line bg-card p-2 shadow-lg"
        >
          <div className="border-b border-line px-3 py-2">
            <p className="font-medium">{user.displayName}</p>
            {user.username ? <p className="text-sm text-muted">@{user.username}</p> : null}
            <p className={cn("mt-1 text-xs", ai?.ready ? "text-accent" : "text-muted")}>{aiStatus}</p>
          </div>
          <Link
            href="/account"
            role="menuitem"
            className="mt-1 flex min-h-11 items-center rounded-md px-3 text-sm hover:bg-background"
            onClick={() => setOpen(false)}
          >
            Thông tin tài khoản
          </Link>
          <Link
            href="/account/settings"
            role="menuitem"
            className="flex min-h-11 items-center rounded-md px-3 text-sm hover:bg-background"
            onClick={() => setOpen(false)}
          >
            Cấu hình AI
          </Link>
          <Link
            href="/account/api-key-guide"
            role="menuitem"
            className="flex min-h-11 items-center rounded-md px-3 text-sm hover:bg-background"
            onClick={() => setOpen(false)}
          >
            Hướng dẫn tạo khóa
          </Link>
          <form action={logoutAction} className="border-t border-line pt-1">
            <button type="submit" role="menuitem" className="min-h-11 w-full rounded-md px-3 text-left text-sm text-danger hover:bg-background">
              Đăng xuất
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
