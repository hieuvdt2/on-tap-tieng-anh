"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { logoutAction } from "@/app/auth-actions";
import { FormPending } from "@/components/form-pending";
import { cn } from "@/lib/utils";
import type { AIChoice } from "@/modules/ai/provider";

type IconName =
  | "home"
  | "book"
  | "pencil"
  | "read"
  | "sort"
  | "redo"
  | "spark"
  | "exam"
  | "clock"
  | "target"
  | "chart"
  | "user"
  | "gear"
  | "key"
  | "logout";

const paths: Record<IconName, string> = {
  home: "M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1z",
  book: "M5 5.5A1.5 1.5 0 0 1 6.5 4H19v14H6.5A1.5 1.5 0 0 0 5 19.5zM5 19.5A1.5 1.5 0 0 0 6.5 21H19",
  pencil: "m14.5 5.5 4 4L9 19H5v-4zM12.5 7.5l4 4",
  read: "M3 6c3-1.5 6-1.5 9 0v13c-3-1.5-6-1.5-9 0zM21 6c-3-1.5-6-1.5-9 0v13c3-1.5 6-1.5 9 0z",
  sort: "M8 4v16M4.5 7.5 8 4l3.5 3.5M16 20V4M12.5 16.5 16 20l3.5-3.5",
  redo: "M19 8a8 8 0 1 0 1 6M19 3v5h-5",
  spark: "M12 3l2 5.5L19.5 10.5 14 12.5 12 18l-2-5.5-5.5-2L10 8.5zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z",
  exam: "M8 4h8v3H8zM6 6H5v15h14V6h-1M8.5 12l2 2 4-4M8.5 17.5h7",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7.5V12l3 2",
  target: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zM12 12h.01",
  chart: "M4 20h16M7 16v-5M12 16V7M17 16v-8",
  user: "M12 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM5 20c1.4-3 3.8-4.5 7-4.5s5.6 1.5 7 4.5",
  gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 13.5l1.6 1.2-2 3.4-1.9-.7a7 7 0 0 1-2 1.2L14.8 21h-4l-.3-2.4a7 7 0 0 1-2-1.2l-1.9.7-2-3.4 1.6-1.2a7 7 0 0 1 0-2.4L4.6 9.9l2-3.4 1.9.7a7 7 0 0 1 2-1.2L10.8 3h4l.3 2.4a7 7 0 0 1 2 1.2l1.9-.7 2 3.4-1.6 1.2a7 7 0 0 1 0 2.4z",
  key: "M8 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM11.5 12H21M17.5 12v3M20 12v2",
  logout: "M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 16l-4-4 4-4M6 12h9",
};

function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn("size-5 shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[name]} />
    </svg>
  );
}

const sections: { title: string; items: { href: string; label: string; icon: IconName }[] }[] = [
  {
    title: "Học",
    items: [
      { href: "/learn", label: "Bài học", icon: "book" },
      { href: "/practice", label: "Luyện", icon: "pencil" },
      { href: "/reading", label: "Đọc", icon: "read" },
      { href: "/ordering", label: "Sắp xếp", icon: "sort" },
      { href: "/review", label: "Ôn lỗi", icon: "redo" },
      { href: "/ai-generator", label: "Tạo đề AI", icon: "spark" },
    ],
  },
  {
    title: "Thi",
    items: [
      { href: "/mock-exam", label: "Thi thử", icon: "exam" },
      { href: "/mock-exam/history", label: "Lịch sử thi", icon: "clock" },
      { href: "/diagnostic", label: "Chẩn đoán", icon: "target" },
    ],
  },
];

const aiLabels: Record<AIChoice, string> = { gemini: "Gemini", groq: "Groq", openrouter: "OpenRouter" };

export function MobileNav({
  pathname,
  isActive,
  ai,
  user,
}: {
  pathname: string;
  isActive: (pathname: string, href: string) => boolean;
  ai: { choice: AIChoice; ready: boolean } | null;
  user: { displayName: string; username: string | null };
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const tile = (href: string, label: string, icon: IconName) => {
    const active = isActive(pathname, href);
    return (
      <Link
        key={href}
        href={href}
        onClick={close}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex min-h-12 items-center gap-3 rounded-xl border px-3 text-sm font-medium transition-colors",
          active
            ? "border-accent bg-accent text-accent-foreground"
            : "border-line bg-card text-foreground active:bg-background",
        )}
      >
        <Icon name={icon} className={active ? "text-accent-foreground" : "text-accent"} />
        {label}
      </Link>
    );
  };

  const row = (href: string, label: string, icon: IconName) => (
    <Link
      href={href}
      onClick={close}
      className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm active:bg-background"
    >
      <Icon name={icon} className="text-muted" />
      {label}
    </Link>
  );

  return (
    <div className="sm:hidden">
      <button
        type="button"
        aria-label="Mở menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="grid size-11 place-items-center rounded-xl border border-line bg-card text-foreground"
      >
        <span aria-hidden className="grid gap-[5px]">
          <span className="block h-0.5 w-5 rounded-full bg-current" />
          <span className="block h-0.5 w-3.5 rounded-full bg-current" />
          <span className="block h-0.5 w-5 rounded-full bg-current" />
        </span>
      </button>

      {open ? createPortal(
      <div className="fixed inset-0 z-50 sm:hidden">
      <div
        aria-hidden
        onClick={close}
        className="mobile-nav-fade absolute inset-0 bg-foreground/40"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="mobile-nav-slide absolute inset-y-0 right-0 flex w-[min(20rem,88vw)] flex-col bg-background shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <span className="font-serif text-xl font-medium">Menu</span>
          <button
            type="button"
            aria-label="Đóng menu"
            onClick={close}
            className="grid size-11 place-items-center rounded-xl text-muted active:bg-card"
          >
            <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div className="grid flex-1 content-start gap-5 overflow-y-auto px-4 py-4">
          <div className="flex items-center gap-3 rounded-xl border border-line bg-card p-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
              <Icon name="user" />
            </span>
            <span className="grid min-w-0">
              <span className="truncate font-medium">{user.displayName}</span>
              <span className={cn("truncate text-xs", ai?.ready ? "text-accent" : "text-muted")}>
                {ai ? `${aiLabels[ai.choice]} · ${ai.ready ? "đã có khóa" : "chưa có khóa"}` : "Chưa chọn nguồn AI"}
              </span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {tile("/", "Tổng quan", "home")}
            {tile("/progress", "Tiến độ", "chart")}
          </div>

          {sections.map((section) => (
            <section key={section.title} className="grid gap-2">
              <h2 className="px-1 text-xs font-semibold tracking-[0.14em] text-muted uppercase">{section.title}</h2>
              <div className="grid grid-cols-2 gap-2">
                {section.items.map((item) => tile(item.href, item.label, item.icon))}
              </div>
            </section>
          ))}

          <section className="grid gap-1">
            <h2 className="px-1 pb-1 text-xs font-semibold tracking-[0.14em] text-muted uppercase">Tài khoản</h2>
            {row("/account", "Thông tin tài khoản", "user")}
            {row("/account/settings", "Cấu hình AI", "gear")}
            {row("/account/api-key-guide", "Hướng dẫn tạo khóa", "key")}
          </section>
        </div>

        <form action={logoutAction} className="border-t border-line p-4">
          <button
            type="submit"
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-danger/30 text-sm font-medium text-danger active:bg-danger/5"
          >
            <Icon name="logout" />
            Đăng xuất
          </button>
          <FormPending label="Đang đăng xuất…" />
        </form>
      </aside>
      </div>,
      document.body,
      ) : null}
    </div>
  );
}
