"use client";

import Image from "next/image";
import { createPortal } from "react-dom";

export function GeneratingNotice() {
  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-6"
    >
      <Image
        src="/assets/generating.png"
        alt="Đang tạo đề. Vui lòng đợi."
        width={1129}
        height={1452}
        priority
        className="h-auto max-h-[calc(100svh-3rem)] w-auto max-w-full"
      />
    </div>,
    document.body,
  );
}
