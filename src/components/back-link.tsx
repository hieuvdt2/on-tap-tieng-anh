"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sessionRoutes = [/^\/practice\/[^/]+$/, /^\/reading\/[^/]+$/, /^\/ordering\/[^/]+$/, /^\/mock-exam\/(?!history$)[^/]+$/];

function backHref(pathname: string) {
  if (pathname === "/" || pathname === "/login" || pathname === "/register") return null;
  if (sessionRoutes.some((route) => route.test(pathname))) return null;
  if (pathname.startsWith("/learn/")) return { href: "/learn", label: "Danh sách bài học" };
  if (pathname.startsWith("/mock-exam/")) return { href: "/mock-exam", label: "Thi thử" };
  if (pathname.startsWith("/account/")) return { href: "/account", label: "Tài khoản" };
  return { href: "/", label: "Tổng quan" };
}

export function BackLink() {
  const back = backHref(usePathname());
  if (!back) return null;

  return (
    <Link
      href={back.href}
      className="mb-4 inline-flex min-h-11 items-center gap-1.5 text-sm text-muted hover:text-foreground sm:mb-5"
    >
      <span aria-hidden>←</span>
      {back.label}
    </Link>
  );
}
