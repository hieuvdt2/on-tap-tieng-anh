"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { pumpExamGeneration } from "@/modules/ai/generator-actions";

// Chạy nền việc tạo các phần còn lại của đề AI. Mỗi khi có thêm phần (hoặc tạo xong / lỗi) thì làm
// mới trang để câu mới hiện lên ô khoá, trong khi đáp án đang chọn vẫn giữ nguyên (đã tự lưu).
export function ExamGenerationPump({
  sessionId,
  enabled,
}: {
  sessionId: string;
  enabled: boolean;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    async function run() {
      let pages = -1;
      while (!cancelled) {
        let result: Awaited<ReturnType<typeof pumpExamGeneration>>;
        try {
          result = await pumpExamGeneration(sessionId);
        } catch {
          // Lỗi mạng/server thoáng qua: chờ rồi thử lại thay vì để vòng theo dõi chết hẳn.
          await new Promise((resolve) => setTimeout(resolve, 5000));
          continue;
        }
        if (cancelled) return;
        if (pages !== -1 && result.pageCount !== pages) router.refresh();
        pages = result.pageCount;
        if (result.done || result.error) {
          router.refresh();
          return;
        }
        if (result.busy) await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [enabled, sessionId, router]);

  return null;
}
