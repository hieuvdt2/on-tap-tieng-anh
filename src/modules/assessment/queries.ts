import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db/client";
import { assessmentSessions, questions, stimuli, topics } from "@/db/schema";
import { isCefrLevel } from "@/modules/levels/cefr";
import { notReported } from "@/modules/questions/reports";
import type { Candidate, Skill } from "./engine";

export type PublicItem = {
  questionId: string;
  skill: Skill;
  stem: string;
  options: { id: string; text: string }[];
  stimulus: { kind: "passage" | "listening"; title: string; body: string } | null;
};

/**
 * Kho câu cho bài đánh giá: chỉ câu có nhãn CEFR do soạn tay hoặc AI tạo theo bậc (không dùng nhãn ước lượng
 * thô của câu THPT), mỗi câu đứng độc lập: câu ngữ pháp/từ vựng, đoạn đọc ngắn một câu, đoạn nghe ngắn một câu.
 */
export async function assessmentPool(): Promise<Candidate[]> {
  const rows = await db
    .select({
      id: questions.id,
      cefr: questions.cefr,
      stimulusId: questions.stimulusId,
      stimulusKind: stimuli.kind,
      topicSkill: topics.skill,
    })
    .from(questions)
    .innerJoin(topics, eq(questions.topicId, topics.id))
    .leftJoin(stimuli, eq(questions.stimulusId, stimuli.id))
    .where(
      and(
        eq(questions.status, "published"),
        eq(questions.type, "single_choice"),
        inArray(questions.cefrSource, ["authored", "ai"]),
        notReported(),
      ),
    );
  const groupSize = new Map<string, number>();
  for (const row of rows) if (row.stimulusId) groupSize.set(row.stimulusId, (groupSize.get(row.stimulusId) ?? 0) + 1);

  const result: Candidate[] = [];
  for (const row of rows) {
    if (!isCefrLevel(row.cefr)) continue;
    if (row.stimulusId) {
      if (groupSize.get(row.stimulusId) !== 1) continue; // đoạn nhiều câu không dùng trong bài thích ứng
      if (row.stimulusKind === "listening") result.push({ id: row.id, skill: "listening", level: row.cefr });
      else if (row.stimulusKind === "passage") result.push({ id: row.id, skill: "reading", level: row.cefr });
      continue;
    }
    if (row.topicSkill === "vocabulary") result.push({ id: row.id, skill: "vocabulary", level: row.cefr });
    else if (row.topicSkill === "grammar") result.push({ id: row.id, skill: "grammar", level: row.cefr });
  }
  return result;
}

export async function publicItem(questionId: string, skill: Skill): Promise<PublicItem | null> {
  const rows = await db
    .select({
      stem: questions.stem,
      options: questions.options,
      stimulusKind: stimuli.kind,
      stimulusTitle: stimuli.title,
      stimulusBody: stimuli.body,
    })
    .from(questions)
    .leftJoin(stimuli, eq(questions.stimulusId, stimuli.id))
    .where(eq(questions.id, questionId))
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  const kind = row.stimulusKind === "listening" ? "listening" : row.stimulusKind === "passage" ? "passage" : null;
  return {
    questionId,
    skill,
    stem: row.stem,
    options: row.options.map((option) => ({ id: option.id, text: option.text })),
    stimulus: kind && row.stimulusBody ? { kind, title: row.stimulusTitle ?? "", body: row.stimulusBody } : null,
  };
}

export async function getAssessmentSession(sessionId: string, userId: string) {
  const rows = await db
    .select()
    .from(assessmentSessions)
    .where(and(eq(assessmentSessions.id, sessionId), eq(assessmentSessions.userId, userId)))
    .limit(1);
  return rows[0] ?? null;
}

export async function listAssessments(userId: string) {
  return db
    .select({
      id: assessmentSessions.id,
      status: assessmentSessions.status,
      score: assessmentSessions.score,
      level: assessmentSessions.level,
      startedAt: assessmentSessions.startedAt,
      finishedAt: assessmentSessions.finishedAt,
      answered: assessmentSessions.items,
    })
    .from(assessmentSessions)
    .where(eq(assessmentSessions.userId, userId))
    .orderBy(desc(assessmentSessions.startedAt))
    .limit(20);
}

/** Câu đã gặp trong 2 bài đánh giá gần nhất, để lần sau ưu tiên câu mới. */
export async function recentlySeen(userId: string): Promise<Set<string>> {
  const rows = await db
    .select({ items: assessmentSessions.items })
    .from(assessmentSessions)
    .where(eq(assessmentSessions.userId, userId))
    .orderBy(desc(assessmentSessions.startedAt))
    .limit(2);
  return new Set(rows.flatMap((row) => row.items.map((item) => item.questionId)));
}
