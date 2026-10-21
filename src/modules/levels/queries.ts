import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db/client";
import { examSessions, examSpecifications, questions, stimuli } from "@/db/schema";
import { notReported } from "@/modules/questions/reports";
import { BANDS, isCefrLevel, LEVEL_SOURCE, type Band } from "./cefr";
import { composeLevelTest, type PoolQuestion } from "./compose";

/** Kho câu đã xuất bản của một dải (bỏ câu bị báo sai và câu sắp xếp). */
export async function levelPool(levels: readonly string[]): Promise<PoolQuestion[]> {
  const rows = await db
    .select({
      id: questions.id,
      type: questions.type,
      cefr: questions.cefr,
      stimulusId: questions.stimulusId,
      stimulusKind: stimuli.kind,
    })
    .from(questions)
    .leftJoin(stimuli, eq(questions.stimulusId, stimuli.id))
    .where(and(eq(questions.status, "published"), inArray(questions.cefr, [...levels]), notReported()));
  return rows.flatMap((row) =>
    isCefrLevel(row.cefr) ? [{ id: row.id, type: row.type, cefr: row.cefr, stimulusId: row.stimulusId, stimulusKind: row.stimulusKind }] : [],
  );
}

export type BandAvailability = {
  band: Band;
  perLevel: Record<string, number>;
  total: number;
  readyQuestions: number;
  shortfall: boolean;
  hasListening: boolean;
};

export async function bandAvailability(): Promise<BandAvailability[]> {
  return Promise.all(
    BANDS.map(async (band) => {
      const pool = await levelPool(band.levels);
      const perLevel: Record<string, number> = {};
      for (const level of band.levels) perLevel[level] = pool.filter((q) => q.cefr === level).length;
      const test = composeLevelTest(pool);
      return {
        band,
        perLevel,
        total: pool.length,
        readyQuestions: test.ids.length,
        shortfall: test.shortfall,
        hasListening: test.sections.some((section) => section.kind === "listening"),
      };
    }),
  );
}

export async function listLevelHistory(userId: string) {
  return db
    .select({
      id: examSessions.id,
      startedAt: examSessions.startedAt,
      submittedAt: examSessions.submittedAt,
      score: examSessions.score,
      questionCount: examSpecifications.questionCount,
      yearLabel: examSpecifications.yearLabel,
    })
    .from(examSessions)
    .innerJoin(examSpecifications, eq(examSessions.specificationId, examSpecifications.id))
    .where(and(eq(examSessions.userId, userId), eq(examSpecifications.source, LEVEL_SOURCE)))
    .orderBy(desc(examSessions.startedAt))
    .limit(20);
}
