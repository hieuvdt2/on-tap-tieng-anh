"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { QUESTION_REPORT_REASONS, questionReports, questions } from "@/db/schema";
import { getStudentId } from "@/lib/student";

export type ReportState = { status: "done" | "error" } | null;

const reportSchema = z.object({
  questionId: z.string().min(1),
  reason: z.enum(QUESTION_REPORT_REASONS),
  note: z.string().trim().max(300).optional(),
});

export async function reportQuestion(_previous: ReportState, formData: FormData): Promise<ReportState> {
  const parsed = reportSchema.safeParse({
    questionId: formData.get("questionId"),
    reason: formData.get("reason"),
    note: formData.get("note") || undefined,
  });
  if (!parsed.success) return { status: "error" };

  const userId = await getStudentId();
  const found = await db.select({ id: questions.id }).from(questions).where(eq(questions.id, parsed.data.questionId)).limit(1);
  if (!found[0]) return { status: "error" };

  await db
    .insert(questionReports)
    .values({
      id: crypto.randomUUID(),
      questionId: parsed.data.questionId,
      userId,
      reason: parsed.data.reason,
      note: parsed.data.note || null,
    })
    .onConflictDoNothing();
  return { status: "done" };
}
