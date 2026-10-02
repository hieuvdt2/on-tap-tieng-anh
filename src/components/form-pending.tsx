"use client";

import { useFormStatus } from "react-dom";
import { LoadingNotice } from "@/components/loading-notice";

export function FormPending({ label }: { label: string }) {
  const { pending } = useFormStatus();
  if (!pending) return null;
  return <LoadingNotice label={label} portal />;
}
