"use server";

import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { examSessions, examSpecifications } from "@/db/schema";
import { getStudentId } from "@/lib/student";
import { LEVEL_SOURCE, LEVEL_SPEC_STATUS, parseBand } from "./cefr";
import { composeLevelTest } from "./compose";
import { levelPool } from "./queries";

// Bắt đầu một đề theo dải trình độ: ghép đề từ kho câu của dải, tạo "khung đề" riêng (ẩn khỏi danh sách đề
// thi thử) và một phiên làm bài dùng chung bộ làm bài của đề thi.
export async function startLevelTest(formData: FormData) {
  const band = parseBand(String(formData.get("band") ?? ""));
  if (!band) redirect("/levels?error=invalid");
  const userId = await getStudentId();

  const test = composeLevelTest(await levelPool(band.levels));
  if (test.ids.length === 0) redirect(`/levels?error=empty&band=${band.id}`);

  const specId = crypto.randomUUID();
  const startedAt = new Date();
  const minutes = Math.max(10, Math.ceil(test.ids.length * 1.25));
  await db.insert(examSpecifications).values({
    id: specId,
    yearLabel: `CEFR ${band.label}`,
    version: `level-${startedAt.toISOString()}`,
    status: LEVEL_SPEC_STATUS,
    source: LEVEL_SOURCE,
    questionCount: test.ids.length,
    durationMinutes: minutes,
    sections: [],
    // Dải và các phần của đề, để trang làm bài/kết quả dựng lại.
    notes: JSON.stringify({ band: band.id, sections: test.sections }),
    questionIds: null,
  });
  const sessionId = crypto.randomUUID();
  await db.insert(examSessions).values({
    id: sessionId,
    userId,
    specificationId: specId,
    questionIds: test.ids,
    startedAt,
    endsAt: new Date(startedAt.getTime() + minutes * 60 * 1000),
  });
  redirect(`/levels/${sessionId}`);
}
