"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { LoadingNotice } from "@/components/loading-notice";
import { PendingLink } from "@/components/pending-link";
import { Button } from "@/components/ui/button";

export function ExitButton({
  href,
  warning,
}: {
  href: string;
  warning?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!warning) {
    return (
      <Button asChild variant="outline" size="sm">
        <PendingLink href={href} label="Đang thoát…">Thoát</PendingLink>
      </Button>
    );
  }

  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
        Thoát
      </Button>
      <ConfirmDialog
        open={open}
        title="Thoát bài này?"
        description={warning}
        confirmLabel="Thoát"
        cancelLabel="Ở lại"
        onCancel={() => setOpen(false)}
        onConfirm={() => startTransition(() => router.push(href))}
      />
      {pending ? <LoadingNotice label="Đang thoát…" portal /> : null}
    </>
  );
}
