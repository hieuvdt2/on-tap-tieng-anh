"use client";

import { useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { GeneratingNotice } from "@/components/generating-notice";
import { Button } from "@/components/ui/button";

export function GenerationSubmitButton({
  children,
  pendingText = "Đang gọi AI…",
  variant = "default",
  autoKey,
}: {
  children: React.ReactNode;
  pendingText?: string;
  variant?: "default" | "outline";
  autoKey?: string;
}) {
  const { pending } = useFormStatus();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!autoKey || pending) return;
    const storageKey = `ai-generation:${autoKey}`;
    if (window.sessionStorage.getItem(storageKey)) return;
    window.sessionStorage.setItem(storageKey, "1");
    buttonRef.current?.click();
  }, [autoKey, pending]);

  return (
    <>
      <Button ref={buttonRef} type="submit" variant={variant} disabled={pending}>
        {pending ? pendingText : children}
      </Button>
      {pending ? <GeneratingNotice /> : null}
    </>
  );
}
