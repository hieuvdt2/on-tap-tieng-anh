import { and, eq, inArray, notExists } from "drizzle-orm";
import { db } from "@/db/client";
import { questionReports, questions } from "@/db/schema";

// Câu bị báo chỉ bị loại khi chọn câu cho bài MỚI. Không đổi questions.status: bài đang làm dở
// vẫn hiện câu đó, và submitMockExam chấm theo câu "published" — đổi status sẽ chấm sai oan.
export function notReported() {
  return notExists(
    db.select({ id: questionReports.id }).from(questionReports).where(eq(questionReports.questionId, questions.id)),
  );
}

export async function reportedByUser(userId: string, questionIds: string[]) {
  if (questionIds.length === 0) return new Set<string>();
  const rows = await db
    .select({ questionId: questionReports.questionId })
    .from(questionReports)
    .where(and(eq(questionReports.userId, userId), inArray(questionReports.questionId, questionIds)));
  return new Set(rows.map((row) => row.questionId));
}
