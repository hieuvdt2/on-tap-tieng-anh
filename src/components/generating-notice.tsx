"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const MESSAGES = ["Đang soạn nội dung…", "Đang ghép các lựa chọn…", "Đang kiểm tra đáp án…", "Sắp xong rồi…"];
const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function GeneratingNotice({
  estimatedSeconds = 35,
  progressLabel,
}: {
  estimatedSeconds?: number;
  /** Tiến độ thật đã lưu được, ví dụ "16/40 câu · Phần 4/6" — khác với vòng tròn bên dưới, đây
   * không phải ước lượng mà là số liệu đã lưu trong lúc chờ phần tiếp theo. */
  progressLabel?: string;
}) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      setElapsed(Math.round((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  // Tiến trình chỉ là ước lượng (không biết chính xác AI còn bao lâu), nên tiệm cận dần và dừng ở
  // 96% để không bao giờ báo "xong" trước khi thực sự xong — khi dữ liệu về, cả overlay biến mất.
  const fraction = Math.min(0.96, 1 - Math.exp(-elapsed / estimatedSeconds));
  const percent = Math.round(fraction * 100);
  const messageIndex = Math.min(MESSAGES.length - 1, Math.floor(fraction * MESSAGES.length));

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-6"
    >
      <div className="grid max-w-xs justify-items-center gap-3 text-center">
        {progressLabel ? (
          <p className="rounded-full border border-accent/30 bg-card px-3 py-1 text-sm font-medium text-accent">
            Đã tạo {progressLabel}
          </p>
        ) : null}
        <div className="relative grid size-32 place-items-center generating-float">
          <svg width="128" height="128" viewBox="0 0 120 120" className="-rotate-90">
            <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="currentColor" strokeWidth="8" className="text-line" />
            <circle
              cx="60"
              cy="60"
              r={RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - fraction)}
              className="text-accent transition-[stroke-dashoffset] duration-700 ease-out"
            />
          </svg>
          <span className="absolute text-xl font-medium text-accent">{percent}%</span>
        </div>
        <Image
          src="/assets/generating.png"
          alt=""
          aria-hidden="true"
          width={1129}
          height={1452}
          className="h-auto max-h-20 w-auto opacity-80"
        />
        <p className="font-medium">{MESSAGES[messageIndex]}</p>
        <p className="text-xs text-muted">
          Đã chờ {elapsed}s · ước lượng khoảng {estimatedSeconds}s. Giờ làm bài không bị trừ trong lúc chờ.
        </p>
      </div>
    </div>,
    document.body,
  );
}
