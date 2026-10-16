"use server";

import { and, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { vocabActivity, vocabMarks, vocabProgress, vocabReports, vocabWords } from "@/db/schema";
import { getStudentId } from "@/lib/student";
import { introduced, review } from "./srs";
import { vnDay } from "./streak";

const schema = z.object({ wordId: z.string().min(1).max(100), remembered: z.boolean().optional() });

// Ghi nhận hoạt động trong ngày (giờ Việt Nam) cho mục tiêu ngày và chuỗi ngày học.
async function recordActivity(userId: string, add: { newWords?: number; reviews?: number }) {
  const newWords = add.newWords ?? 0;
  const reviews = add.reviews ?? 0;
  if (newWords + reviews === 0) return;
  await db
    .insert(vocabActivity)
    .values({ userId, day: vnDay(), newWords, reviews })
    .onConflictDoUpdate({
      target: [vocabActivity.userId, vocabActivity.day],
      set: {
        newWords: sql`${vocabActivity.newWords} + ${newWords}`,
        reviews: sql`${vocabActivity.reviews} + ${reviews}`,
      },
    });
}

// Học xong một lượt từ mới: ghi vào tiến độ (hộp 1, ôn lại sau 1 ngày) và tính vào mục tiêu ngày.
// Từ đã có tiến độ thì giữ nguyên và không tính là từ mới.
export async function markWordsLearned(wordIds: string[]) {
  const ids = z.array(z.string().min(1).max(100)).max(50).safeParse(wordIds);
  if (!ids.success || ids.data.length === 0) return { ok: false, added: 0 };
  const userId = await getStudentId();
  const existing = await db.select({ id: vocabWords.id }).from(vocabWords).where(inArray(vocabWords.id, ids.data));
  const state = introduced(new Date());
  const inserted = await db
    .insert(vocabProgress)
    .values(existing.map((word) => ({ userId, wordId: word.id, box: state.box, dueAt: state.dueAt, lastReviewedAt: new Date() })))
    .onConflictDoNothing()
    .returning({ id: vocabProgress.wordId });
  await recordActivity(userId, { newWords: inserted.length });
  return { ok: true, added: inserted.length };
}

// Chế độ Ôn: cập nhật hộp và lịch ôn theo việc nhớ hay quên.
export async function gradeWord(wordId: string, remembered: boolean) {
  const parsed = schema.safeParse({ wordId, remembered });
  if (!parsed.success) return { ok: false };
  const userId = await getStudentId();
  const rows = await db
    .select()
    .from(vocabProgress)
    .where(and(eq(vocabProgress.userId, userId), eq(vocabProgress.wordId, parsed.data.wordId)))
    .limit(1);
  const current = rows[0];
  const now = new Date();
  if (!current) {
    // Luyện từ đã đánh dấu mà chưa từng học: tạo tiến độ ngay từ kết quả lần này.
    const exists = await db.select({ id: vocabWords.id }).from(vocabWords).where(eq(vocabWords.id, parsed.data.wordId)).limit(1);
    if (!exists[0]) return { ok: false };
    const first = review(0, remembered, now);
    await db
      .insert(vocabProgress)
      .values({
        userId,
        wordId: parsed.data.wordId,
        box: first.box,
        dueAt: first.dueAt,
        correct: remembered ? 1 : 0,
        wrong: remembered ? 0 : 1,
        lastReviewedAt: now,
      })
      .onConflictDoNothing();
    await recordActivity(userId, { reviews: 1 });
    return { ok: true };
  }
  const state = review(current.box, remembered, now);
  await db
    .update(vocabProgress)
    .set({
      box: state.box,
      dueAt: state.dueAt,
      correct: current.correct + (remembered ? 1 : 0),
      wrong: current.wrong + (remembered ? 0 : 1),
      lastReviewedAt: now,
    })
    .where(and(eq(vocabProgress.userId, userId), eq(vocabProgress.wordId, parsed.data.wordId)));
  await recordActivity(userId, { reviews: 1 });
  return { ok: true };
}

// Bật/tắt đánh dấu một từ; trả về trạng thái mới.
export async function toggleMark(wordId: string): Promise<{ ok: boolean; marked: boolean }> {
  const parsed = schema.safeParse({ wordId });
  if (!parsed.success) return { ok: false, marked: false };
  const userId = await getStudentId();
  const existing = await db
    .select({ id: vocabMarks.wordId })
    .from(vocabMarks)
    .where(and(eq(vocabMarks.userId, userId), eq(vocabMarks.wordId, parsed.data.wordId)))
    .limit(1);
  if (existing[0]) {
    await db.delete(vocabMarks).where(and(eq(vocabMarks.userId, userId), eq(vocabMarks.wordId, parsed.data.wordId)));
    return { ok: true, marked: false };
  }
  const word = await db.select({ id: vocabWords.id }).from(vocabWords).where(eq(vocabWords.id, parsed.data.wordId)).limit(1);
  if (!word[0]) return { ok: false, marked: false };
  await db.insert(vocabMarks).values({ userId, wordId: parsed.data.wordId }).onConflictDoNothing();
  return { ok: true, marked: true };
}

// Báo nghĩa/ví dụ của từ bị sai. Từ bị báo sẽ không xuất hiện trong các lượt học và luyện tiếp theo.
export async function reportWord(wordId: string): Promise<{ ok: boolean }> {
  const parsed = schema.safeParse({ wordId });
  if (!parsed.success) return { ok: false };
  const userId = await getStudentId();
  const word = await db.select({ id: vocabWords.id }).from(vocabWords).where(eq(vocabWords.id, parsed.data.wordId)).limit(1);
  if (!word[0]) return { ok: false };
  await db.insert(vocabReports).values({ userId, wordId: parsed.data.wordId }).onConflictDoNothing();
  return { ok: true };
}
