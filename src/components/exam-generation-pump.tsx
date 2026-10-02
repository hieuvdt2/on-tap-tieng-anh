"use client";

import { useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { CheckingNotice } from "@/components/checking-notice";
import { GeneratingNotice } from "@/components/generating-notice";
import { Button } from "@/components/ui/button";
import { pumpExamGeneration } from "@/modules/ai/generator-actions";

export function ExamNextButton({
  children,
  pendingText,
  checking = false,
}: {
  children: React.ReactNode;
  pendingText: string;
  checking?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <>
      <Button type="submit" className="w-full sm:w-fit" disabled={pending}>
        {pending ? pendingText : children}
      </Button>
      {pending ? (checking ? <CheckingNotice /> : <GeneratingNotice />) : null}
    </>
  );
}

export function ExamGenerationPump({
  sessionId,
  enabled,
}: {
  sessionId: string;
  enabled: boolean;
}) {
  const started = useRef(false);

  useEffect(() => {
    if (!enabled || started.current) return;
    started.current = true;
    let cancelled = false;

    async function run() {
      while (!cancelled) {
        const result = await pumpExamGeneration(sessionId);
        if (cancelled || result.done || result.error) break;
        if (result.busy) await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [enabled, sessionId]);

  return null;
}

export function ExamPartRefresh({ active }: { active: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (!active) return;
    const timer = window.setInterval(() => router.refresh(), 3000);
    return () => window.clearInterval(timer);
  }, [active, router]);

  return null;
}
