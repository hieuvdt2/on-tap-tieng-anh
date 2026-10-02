import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { examSessions, examSpecifications, questions, stimuli } from "@/db/schema";

export function sectionOf(type: string, stimulusKind: string | null) {
  if (type === "ordering") return "ordering";
  if (stimulusKind === "passage") return "reading";
  if (stimulusKind === "gap_text" && type === "gap_short") return "gap_short";
  if (stimulusKind === "gap_text" && type === "gap_long") return "gap_long";
  return "other";
}

export async function listExamSpecs() {
  return db.select().from(examSpecifications);
}

function reservedIds(specs: readonly { questionIds: string[] | null }[]) {
  return new Set(specs.flatMap((spec) => spec.questionIds ?? []));
}

export async function sectionStock() {
  const [rows, specs] = await Promise.all([
    db
      .select({
        id: questions.id,
        type: questions.type,
        kind: stimuli.kind,
      })
      .from(questions)
      .leftJoin(stimuli, eq(questions.stimulusId, stimuli.id))
      .where(eq(questions.status, "published")),
    listExamSpecs(),
  ]);
  const reserved = reservedIds(specs);

  const counts = new Map<string, number>();
  for (const row of rows) {
    if (reserved.has(row.id)) continue;
    const section = sectionOf(row.type, row.kind);
    counts.set(section, (counts.get(section) ?? 0) + 1);
  }
  return [...counts.entries()].map(([questionType, available]) => ({ questionType, available }));
}

export async function publishedForExam() {
  const [rows, specs] = await Promise.all([
    db
      .select({
        id: questions.id,
        type: questions.type,
        status: questions.status,
        kind: stimuli.kind,
      })
      .from(questions)
      .leftJoin(stimuli, eq(questions.stimulusId, stimuli.id))
      .where(eq(questions.status, "published")),
    listExamSpecs(),
  ]);
  const reserved = reservedIds(specs);

  return rows.flatMap((row) => {
    if (reserved.has(row.id)) return [];
    return [{
      id: row.id,
      status: row.status,
      section: sectionOf(row.type, row.kind),
    }];
  });
}

export async function getExamSession(sessionId: string, userId: string) {
  const rows = await db
    .select({
      session: examSessions,
      spec: examSpecifications,
    })
    .from(examSessions)
    .innerJoin(examSpecifications, eq(examSessions.specificationId, examSpecifications.id))
    .where(and(eq(examSessions.id, sessionId), eq(examSessions.userId, userId)))
    .limit(1);
  const row = rows[0];
  if (!row) return null;

  const ids = row.session.questionIds;
  const questionRows = ids.length
    ? await db
        .select({
          id: questions.id,
          type: questions.type,
          stem: questions.stem,
          options: questions.options,
          correctAnswer: questions.correctAnswer,
          explanation: questions.explanation,
          stimulusId: questions.stimulusId,
          stimulusTitle: stimuli.title,
          stimulusBody: stimuli.body,
          stimulusKind: stimuli.kind,
        })
        .from(questions)
        .leftJoin(stimuli, eq(questions.stimulusId, stimuli.id))
        .where(inArray(questions.id, ids))
    : [];
  const byId = new Map(questionRows.map((question) => [question.id, question]));

  return {
    session: row.session,
    spec: row.spec,
    questions: ids.flatMap((id) => {
      const question = byId.get(id);
      return question ? [question] : [];
    }),
  };
}

export async function listExamHistory(userId: string) {
  return db
    .select({
      id: examSessions.id,
      startedAt: examSessions.startedAt,
      endsAt: examSessions.endsAt,
      submittedAt: examSessions.submittedAt,
      score: examSessions.score,
      expired: sql<boolean>`${examSessions.endsAt} <= now()`,
      questionCount: examSpecifications.questionCount,
      durationMinutes: examSpecifications.durationMinutes,
      yearLabel: examSpecifications.yearLabel,
      source: examSpecifications.source,
      specificationId: examSpecifications.id,
    })
    .from(examSessions)
    .innerJoin(examSpecifications, eq(examSessions.specificationId, examSpecifications.id))
    .where(eq(examSessions.userId, userId))
    .orderBy(desc(examSessions.startedAt))
    .limit(50);
}
