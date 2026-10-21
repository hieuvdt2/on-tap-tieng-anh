"use server";

import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { assessmentSessions, questions } from "@/db/schema";
import { getStudentId } from "@/lib/student";
import { isCefrLevel } from "@/modules/levels/cefr";
import { scoreAnswer } from "@/modules/questions/score";
import { estimateTheta, difficultyOf, pickNext, SKILLS, summarise, TEST_LENGTH, type Candidate, type Skill } from "./engine";
import { assessmentPool, getAssessmentSession, publicItem, recentlySeen, type PublicItem } from "./queries";

const MIN_POOL = 20;

function countsOf(items: { skill: string }[]): Record<Skill, number> {
  const counts = { grammar: 0, vocabulary: 0, reading: 0, listening: 0 } as Record<Skill, number>;
  for (const item of items) if (item.skill in counts) counts[item.skill as Skill] += 1;
  return counts;
}

// Ưu tiên câu chưa gặp ở các bài gần đây; thiếu thì dùng lại cả câu cũ.
async function chooseNext(userId: string, pool: Candidate[], usedIds: Set<string>, counts: Record<Skill, number>, theta: number) {
  const recent = await recentlySeen(userId);
  const fresh = pool.filter((candidate) => !recent.has(candidate.id));
  return pickNext(fresh, usedIds, counts, theta) ?? pickNext(pool, usedIds, counts, theta);
}

export async function startAssessment() {
  const userId = await getStudentId();
  const pool = await assessmentPool();
  // Mỗi kỹ năng cần có câu thì bài mới cân bằng; tổng quá ít thì kết quả vô nghĩa.
  const covered = SKILLS.every((skill) => pool.some((candidate) => candidate.skill === skill));
  if (pool.length < MIN_POOL || !covered) redirect("/assessment?error=pool");

  const first = await chooseNext(userId, pool, new Set(), countsOf([]), difficultyOf("B1"));
  if (!first) redirect("/assessment?error=pool");
  const id = crypto.randomUUID();
  await db.insert(assessmentSessions).values({
    id,
    userId,
    status: "in_progress",
    items: [],
    current: { questionId: first.id, skill: first.skill, level: first.level },
  });
  redirect(`/assessment/${id}`);
}

export type AnswerResponse = { done: false; item: PublicItem; index: number } | { done: true } | { error: string };

export async function answerAssessment(sessionId: string, questionId: string, answer: string): Promise<AnswerResponse> {
  const userId = await getStudentId();
  const session = await getAssessmentSession(sessionId, userId);
  if (!session || session.status !== "in_progress" || !session.current) return { error: "Phiên làm bài không còn hiệu lực." };
  if (session.current.questionId !== questionId) return { error: "Câu hỏi không khớp, hãy tải lại trang." };
  if (!isCefrLevel(session.current.level)) return { error: "Câu hỏi không hợp lệ." };

  const rows = await db.select({ correctAnswer: questions.correctAnswer }).from(questions).where(eq(questions.id, questionId)).limit(1);
  if (!rows[0]) return { error: "Không tìm thấy câu hỏi." };
  const correct = scoreAnswer(rows[0].correctAnswer, answer);
  const items = [
    ...session.items,
    { questionId, skill: session.current.skill, level: session.current.level, answer, correct },
  ];

  const finish = async () => {
    const result = summarise(items.map((item) => ({ skill: item.skill as Skill, level: item.level as never, correct: item.correct })));
    await db
      .update(assessmentSessions)
      .set({ status: "completed", items, current: null, score: result.score, level: result.level, result, finishedAt: new Date() })
      .where(and(eq(assessmentSessions.id, sessionId), eq(assessmentSessions.userId, userId)));
    return { done: true } as const;
  };

  if (items.length >= TEST_LENGTH) return finish();

  const { theta } = estimateTheta(items.map((item) => ({ difficulty: difficultyOf(item.level as never), correct: item.correct })));
  const pool = await assessmentPool();
  const next = await chooseNext(userId, pool, new Set(items.map((item) => item.questionId)), countsOf(items), theta);
  if (!next) return finish();
  const item = await publicItem(next.id, next.skill);
  if (!item) return finish();

  await db
    .update(assessmentSessions)
    .set({ items, current: { questionId: next.id, skill: next.skill, level: next.level } })
    .where(and(eq(assessmentSessions.id, sessionId), eq(assessmentSessions.userId, userId)));
  return { done: false, item, index: items.length + 1 };
}
