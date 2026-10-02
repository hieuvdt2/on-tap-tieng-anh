"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { AccountMenu } from "@/components/account-menu";
import { MobileNav } from "@/components/mobile-nav";
import { cn } from "@/lib/utils";
import type { AIChoice } from "@/modules/ai/provider";

const studyLinks = [
  { href: "/learn", label: "Bài học" },
  { href: "/practice", label: "Luyện" },
  { href: "/reading", label: "Đọc" },
  { href: "/ordering", label: "Sắp xếp" },
  { href: "/review", label: "Ôn lỗi" },
  { href: "/ai-generator", label: "Tạo đề AI" },
];

const examLinks = [
  { href: "/mock-exam", label: "Thi thử" },
  { href: "/mock-exam/history", label: "Lịch sử thi" },
  { href: "/diagnostic", label: "Chẩn đoán" },
];

function itemActive(pathname: string, href: string) {
  if (href === "/mock-exam" && pathname === "/mock-exam/history") return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavDropdown({
  label,
  items,
  pathname,
}: {
  label: string;
  items: { href: string; label: string }[];
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const active = items.some((item) => itemActive(pathname, item.href));

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
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm",
          active ? "bg-card text-foreground" : "text-muted hover:text-foreground",
        )}
      >
        {label}
        <span aria-hidden className={cn("text-[10px] leading-none", open && "rotate-180")}>
          ▼
        </span>
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute top-full left-0 z-20 mt-1 min-w-40 rounded-lg border border-line bg-card p-1 shadow-lg"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              className={cn(
                "block rounded-md px-3 py-2 text-sm",
                itemActive(pathname, item.href) ? "bg-background text-foreground" : "text-muted hover:text-foreground",
              )}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function SiteHeader({
  ai,
  user,
}: {
  ai: { choice: AIChoice; ready: boolean } | null;
  user: { displayName: string; username: string | null };
}) {
  const pathname = usePathname();
  const homeActive = pathname === "/";

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-background/95 backdrop-blur sm:static sm:bg-background">
      <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between gap-4 sm:items-end">
          <Link href="/" aria-label="Về trang tổng quan" className="block w-fit">
            <Image
              src="/assets/english-logo.png"
              alt="English"
              width={512}
              height={442}
              priority
              className="h-12 w-auto sm:h-20"
            />
          </Link>
          <MobileNav pathname={pathname} isActive={itemActive} ai={ai} user={user} />
          <nav className="hidden flex-wrap items-center gap-1 sm:flex">
            <Link
              href="/"
              className={cn(
                "rounded-lg px-3 py-2 text-sm",
                homeActive ? "bg-card text-foreground" : "text-muted hover:text-foreground",
              )}
            >
              Tổng quan
            </Link>
            <NavDropdown label="Học" items={studyLinks} pathname={pathname} />
            <NavDropdown label="Thi" items={examLinks} pathname={pathname} />
            <Link
              href="/progress"
              className={cn(
                "rounded-lg px-3 py-2 text-sm",
                itemActive(pathname, "/progress") ? "bg-card text-foreground" : "text-muted hover:text-foreground",
              )}
            >
              Tiến độ
            </Link>
            <AccountMenu ai={ai} user={user} />
          </nav>
        </div>
      </div>
    </header>
  );
}
