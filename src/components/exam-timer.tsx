"use client";

import { useEffect, useState } from "react";

export function ExamTimer({
  endsAt,
  submitted,
}: {
  endsAt: string;
  submitted: boolean;
}) {
  const end = new Date(endsAt).getTime();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    if (submitted) return;
    const tick = () => setNow(Date.now());
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [submitted]);

  const remaining = submitted || now === null ? 0 : Math.max(0, end - now);
  const totalSeconds = Math.ceil(remaining / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const label = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <p className={`font-serif text-3xl ${submitted || (now !== null && remaining === 0) ? "text-danger" : "text-foreground"}`}>
      {submitted ? "Đã nộp" : now === null ? "…" : label}
    </p>
  );
}
