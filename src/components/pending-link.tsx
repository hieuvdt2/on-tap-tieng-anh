"use client";

import Link from "next/link";
import { useLinkStatus } from "next/link";
import { forwardRef } from "react";
import { LoadingNotice } from "@/components/loading-notice";

function LinkStatus({ label }: { label: string }) {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return <LoadingNotice label={label} portal />;
}

export const PendingLink = forwardRef<
  HTMLAnchorElement,
  {
    href: string;
    children: React.ReactNode;
    className?: string;
    label?: string;
  }
>(function PendingLink({ href, children, className, label = "Đang mở…" }, ref) {
  return (
    <Link ref={ref} href={href} className={className}>
      {children}
      <LinkStatus label={label} />
    </Link>
  );
});
