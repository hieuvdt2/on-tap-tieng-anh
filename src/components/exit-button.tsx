"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDialog } from "@/components/confirm-dialog";
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

  if (!warning) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link href={href}>Thoát</Link>
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
        onConfirm={() => router.push(href)}
      />
    </>
  );
}
