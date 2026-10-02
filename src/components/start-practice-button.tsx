"use client";

import { useFormStatus } from "react-dom";
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
    <Button type="submit" variant={variant} className={className} disabled={pending}>
      {pending ? "Đang tạo bài luyện…" : children}
    </Button>
  );
}
