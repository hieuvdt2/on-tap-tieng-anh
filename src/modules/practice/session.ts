import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db/client";
import {
  attempts,
  practiceSessions,
  questions,
  teacherExplanations,
  topicMastery,
  topics,
} from "@/db/schema";
import { computeMastery } from "@/modules/learning/mastery";

export async function listPublished() {
  return db
    .select({
      id: questions.id,
      status: questions.status,
      topicId: questions.topicId,
      provenance: questions.provenance,
    })
    .from(questions)
    .where(eq(questions.status, "published"));
}

export async function createSession(input: {
  id: string;
  userId: string;
  topicId: string | null;
  mode: "topic" | "weakness" | "quick" | "diagnostic" | "reading" | "ordering";
  questionIds: string[];
}) {
  await db.insert(practiceSessions).values({
    id: input.id,
    userId: input.userId,
    topicId: input.topicId,
    mode: input.mode,
    questionIds: input.questionIds,
  });
}

export async function getSessionBundle(sessionId: string, userId: string) {
  const sessionRows = await db
    .select()
    .from(practiceSessions)
    .where(and(eq(practiceSessions.id, sessionId), eq(practiceSessions.userId, userId)))
    .limit(1);
  const session = sessionRows[0];
  if (!session) return null;

  const ids = session.questionIds;
  const questionRows = ids.length
    ? await db
        .select({
          id: questions.id,
          stem: questions.stem,
          options: questions.options,
          correctAnswer: questions.correctAnswer,
          explanation: questions.explanation,
          wrongAnswerExplanations: questions.wrongAnswerExplanations,
          difficulty: questions.difficulty,
          topicId: questions.topicId,
          topicName: topics.name,
          provenance: questions.provenance,
        })
        .from(questions)
        .innerJoin(topics, eq(questions.topicId, topics.id))
        .where(inArray(questions.id, ids))
    : [];

  const byId = new Map(questionRows.map((row) => [row.id, row]));
  const ordered = ids.flatMap((id) => {
    const question = byId.get(id);
    return question ? [question] : [];
  });

  const attemptRows = await db
    .select()
    .from(attempts)
    .where(eq(attempts.sessionId, sessionId))
    .orderBy(asc(attempts.createdAt));
  const explanationRows = attemptRows.length
    ? await db
        .select()
        .from(teacherExplanations)
        .where(inArray(teacherExplanations.attemptId, attemptRows.map((attempt) => attempt.id)))
    : [];

  return {
    session,
    questions: ordered,
    attempts: attemptRows,
    explanations: explanationRows,
  };
}

function asDifficulty(value: string): "easy" | "medium" | "hard" {
  if (value === "medium" || value === "hard") return value;
  return "easy";
}

export function isUniqueViolation(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  if ("code" in error && (error as { code?: string }).code === "23505") return true;
  if ("cause" in error) return isUniqueViolation((error as { cause?: unknown }).cause);
  return false;
}

export async function recordAttempt(input: {
  sessionId: string;
  userId: string;
  questionId: string;
  topicId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  errorType: string | null;
  responseTimeMs: number | null;
  questionCount: number;
}) {
  const attemptId = crypto.randomUUID();
  await db.transaction(async (tx) => {
    await tx.insert(attempts).values({
      id: attemptId,
      sessionId: input.sessionId,
      userId: input.userId,
      questionId: input.questionId,
      topicId: input.topicId,
      selectedAnswer: input.selectedAnswer,
      isCorrect: input.isCorrect,
      errorType: input.errorType,
      responseTimeMs: input.responseTimeMs,
    });

    const history = await tx
      .select({
        isCorrect: attempts.isCorrect,
        difficulty: questions.difficulty,
      })
      .from(attempts)
      .innerJoin(questions, eq(attempts.questionId, questions.id))
      .where(and(eq(attempts.userId, input.userId), eq(attempts.topicId, input.topicId)))
      .orderBy(asc(attempts.createdAt));

    const mastery = computeMastery(
      history.map((row) => ({
        isCorrect: row.isCorrect,
        difficulty: asDifficulty(row.difficulty),
      })),
    );
    const correct = history.filter((row) => row.isCorrect).length;
    const masteryRow = {
      userId: input.userId,
      topicId: input.topicId,
      attempts: history.length,
      correct,
      masteryScore: mastery.score,
      level: mastery.level,
      lastPracticedAt: new Date(),
    };

    await tx
      .insert(topicMastery)
      .values(masteryRow)
      .onConflictDoUpdate({
        target: [topicMastery.userId, topicMastery.topicId],
        set: {
          attempts: masteryRow.attempts,
          correct: masteryRow.correct,
          masteryScore: masteryRow.masteryScore,
          level: masteryRow.level,
          lastPracticedAt: masteryRow.lastPracticedAt,
        },
      });

    const answered = await tx
      .select({ id: attempts.id })
      .from(attempts)
      .where(eq(attempts.sessionId, input.sessionId));
    if (answered.length >= input.questionCount) {
      await tx
        .update(practiceSessions)
        .set({ finishedAt: new Date() })
        .where(eq(practiceSessions.id, input.sessionId));
    }
  });
  return attemptId;
}

export async function listMistakes(userId: string) {
  return db
    .select({
      id: attempts.id,
      selectedAnswer: attempts.selectedAnswer,
      createdAt: attempts.createdAt,
      stem: questions.stem,
      options: questions.options,
      correctAnswer: questions.correctAnswer,
      explanation: questions.explanation,
      wrongAnswerExplanations: questions.wrongAnswerExplanations,
      topicName: topics.name,
      topicSlug: topics.slug,
    })
    .from(attempts)
    .innerJoin(questions, eq(attempts.questionId, questions.id))
    .innerJoin(topics, eq(attempts.topicId, topics.id))
    .where(and(eq(attempts.userId, userId), eq(attempts.isCorrect, false)))
    .orderBy(desc(attempts.createdAt))
    .limit(40);
}
