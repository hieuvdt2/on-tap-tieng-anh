"use client";

import { useFormStatus } from "react-dom";
import { FormPending } from "@/components/form-pending";
import { Button } from "@/components/ui/button";

export function StartPracticeButton({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "outline";
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <>
      <Button type="submit" variant={variant} className={className} disabled={pending}>
        {pending ? "Đang mở bài luyện…" : children}
      </Button>
      <FormPending label="Đang mở bài luyện…" />
    </>
  );
}
