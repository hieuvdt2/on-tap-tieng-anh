"use server";

import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { examSessions, examSpecifications, practiceSessions, questions } from "@/db/schema";

export type GradedAnswer = {
  stem: string;
  selectedText: string;
  correctText: string;
  isCorrect: boolean;
  explanation: string;
};
import { levelLabel } from "@/lib/labels";
import { getStudentId } from "@/lib/student";
import { topicLabel } from "@/lib/topic-names";
import { getTopicProgress } from "@/modules/learning/profile";
import { focusTopics, overallLevel, topicToStudyFirst } from "@/modules/learning/recommend";
import { scoreAnswer } from "@/modules/questions/score";
import { createSession, listPublished, recordAttempt } from "@/modules/practice/session";
import { assembleExam, pickSpread } from "./assemble";
import { examScore } from "./score";
import { publishedForExam } from "./queries";

function collectExamAnswers(stored: Record<string, string> | null, formData: FormData) {
  const answers = { ...(stored ?? {}) };
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("answer-") && typeof value === "string") answers[key.slice("answer-".length)] = value.trim();
  }
  return answers;
}

export async function saveExamPart(formData: FormData) {
  const sessionId = String(formData.get("sessionId") ?? "");
  const part = Number(formData.get("part") ?? "1");
  const userId = await getStudentId();
  const rows = await db
    .select()
    .from(examSessions)
    .where(and(eq(examSessions.id, sessionId), eq(examSessions.userId, userId)))
    .limit(1);
  const session = rows[0];
  if (!session || session.submittedAt) redirect(`/mock-exam/${sessionId}`);
  await db
    .update(examSessions)
    .set({ answers: collectExamAnswers(session.answers, formData) })
    .where(eq(examSessions.id, sessionId));
  redirect(`/mock-exam/${sessionId}?part=${Number.isFinite(part) && part > 0 ? part : 1}`);
}

function optionText(options: { id: string; text: string }[], id: string) {
  return options.find((option) => option.id === id)?.text ?? id;
}

export async function scorePassage(
  _previous: GradedAnswer[] | null,
  formData: FormData,
): Promise<GradedAnswer[] | null> {
  const stimulusId = String(formData.get("stimulusId") ?? "");
  const rows = await db
    .select()
    .from(questions)
    .where(and(eq(questions.stimulusId, stimulusId), eq(questions.status, "published")));
  if (rows.length === 0) return null;
  rows.sort((left, right) => left.id.localeCompare(right.id, "en", { numeric: true }));

  const userId = await getStudentId();
  const sessionId = crypto.randomUUID();
  await createSession({
    id: sessionId,
    userId,
    topicId: null,
    mode: "reading",
    questionIds: rows.map((question) => question.id),
  });

  const graded = rows.map((question) => {
    const selected = String(formData.get(`answer-${question.id}`) ?? "");
    const correct = scoreAnswer(question.correctAnswer, selected);
    return {
      stem: question.stem,
      selectedText: optionText(question.options, selected) || "Chưa chọn",
      correctText: optionText(question.options, question.correctAnswer),
      isCorrect: correct,
      explanation: question.explanation,
    };
  });
  for (let index = 0; index < rows.length; index += 1) {
    const question = rows[index];
    const result = graded[index];
    await recordAttempt({
      sessionId,
      userId,
      questionId: question.id,
      topicId: question.topicId,
      selectedAnswer: String(formData.get(`answer-${question.id}`) ?? ""),
      isCorrect: result.isCorrect,
      errorType: result.isCorrect ? null : "READING_COMPREHENSION",
      responseTimeMs: null,
      questionCount: rows.length,
    });
  }
  return graded;
}

export async function scoreOrdering(
  _previous: GradedAnswer[] | null,
  formData: FormData,
): Promise<GradedAnswer[] | null> {
  const questionId = String(formData.get("questionId") ?? "");
  const selected = String(formData.get("answer") ?? "").trim();
  const rows = await db.select().from(questions).where(eq(questions.id, questionId)).limit(1);
  const question = rows[0];
  if (!question || question.type !== "ordering") return null;
  const labels = new Map(question.options.map((option) => [option.id, option.text]));
  const show = (value: string) =>
    value
      .split(",")
      .map((id) => labels.get(id) ?? id)
      .join(" → ");

  const isCorrect = scoreAnswer(question.correctAnswer, selected);
  const userId = await getStudentId();
  const sessionId = crypto.randomUUID();
  await createSession({
    id: sessionId,
    userId,
    topicId: question.topicId,
    mode: "ordering",
    questionIds: [question.id],
  });
  await recordAttempt({
    sessionId,
    userId,
    questionId: question.id,
    topicId: question.topicId,
    selectedAnswer: selected,
    isCorrect,
    errorType: isCorrect ? null : "ORDERING",
    responseTimeMs: null,
    questionCount: 1,
  });

  return [{
      stem: question.stem,
      selectedText: show(selected),
      correctText: show(question.correctAnswer),
      isCorrect,
      explanation: question.explanation,
  }];
}

export async function startMockExam(formData: FormData) {
  const specificationId = String(formData.get("specificationId") ?? "");
  const userId = await getStudentId();
  const specs = await db
    .select()
    .from(examSpecifications)
    .where(eq(examSpecifications.id, specificationId))
    .limit(1);
  const spec = specs[0];
  if (!spec || (spec.status !== "provisional" && spec.status !== "confirmed")) {
    redirect("/mock-exam?error=locked");
  }

  const fixed = spec.questionIds?.length === spec.questionCount ? spec.questionIds : null;
  const picked = fixed
    ? null
    : assembleExam({
        questions: await publishedForExam(),
        sections: spec.sections,
      });
  if (!fixed && (!picked || picked.length !== spec.questionCount)) redirect("/mock-exam?error=locked");

  const id = crypto.randomUUID();
  const startedAt = new Date();
  const endsAt = new Date(startedAt.getTime() + spec.durationMinutes * 60 * 1000);
  await db.insert(examSessions).values({
    id,
    userId,
    specificationId: spec.id,
    questionIds: fixed ?? picked?.map((question) => question.id) ?? [],
    startedAt,
    endsAt,
  });
  redirect(`/mock-exam/${id}`);
}

export async function submitMockExam(formData: FormData) {
  const sessionId = String(formData.get("sessionId") ?? "");
  const userId = await getStudentId();
  const rows = await db
    .select()
    .from(examSessions)
    .where(and(eq(examSessions.id, sessionId), eq(examSessions.userId, userId)))
    .limit(1);
  const session = rows[0];
  if (!session) redirect("/mock-exam");
  if (session.submittedAt) redirect(`/mock-exam/${sessionId}`);

  const questionRows = await db
    .select({ id: questions.id, correctAnswer: questions.correctAnswer })
    .from(questions)
    .where(eq(questions.status, "published"));
  const correctById = new Map(questionRows.map((question) => [question.id, question.correctAnswer]));
  const answers = collectExamAnswers(session.answers, formData);
  let correctCount = 0;
  for (const questionId of session.questionIds) {
    const selected = answers[questionId] ?? "";
    const correct = correctById.get(questionId);
    if (correct && scoreAnswer(correct, selected)) correctCount += 1;
  }

  await db
    .update(examSessions)
    .set({
      answers,
      score: examScore(correctCount, session.questionIds.length),
      submittedAt: new Date(),
    })
    .where(eq(examSessions.id, sessionId));
  redirect(`/mock-exam/${sessionId}`);
}

export async function startDiagnostic() {
  const userId = await getStudentId();
  const published = await listPublished();
  const progress = await getTopicProgress(userId);
  const allowed = new Set(progress.map((topic) => topic.id));
  const pool = published.filter((question) => allowed.has(question.topicId));
  const picked = pickSpread({ questions: pool, count: 16 });
  if (picked.length < 8) redirect("/diagnostic?error=empty");

  const id = crypto.randomUUID();
  await db.insert(practiceSessions).values({
    id,
    userId,
    topicId: null,
    mode: "diagnostic",
    questionIds: picked.map((question) => question.id),
  });
  redirect(`/practice/${id}`);
}

export async function saveDiagnosticSummary(sessionId: string, userId: string) {
  const rows = await db
    .select()
    .from(practiceSessions)
    .where(and(eq(practiceSessions.id, sessionId), eq(practiceSessions.userId, userId)))
    .limit(1);
  const session = rows[0];
  if (!session || session.mode !== "diagnostic" || session.summary) return session?.summary ?? null;

  const progress = await getTopicProgress(userId);
  const level = overallLevel(progress);
  const weakest = focusTopics(progress, 3);
  const first = topicToStudyFirst(progress);
  const levelText = level ? levelLabel[level] : "chưa đủ dữ liệu";
  const weakText = weakest.map((topic) => topicLabel(topic.name)).join(", ");
  const firstText = first ? topicLabel(first.name) : "chưa chọn được";
  const hasWeak = progress.some((topic) => topic.level === "weak");
  const summary = [
    `Mức sẵn sàng ước lượng: ${levelText}.`,
    "Đây là ước lượng từ các câu trong app, không phải điểm thi.",
    `Ba chủ đề cần xem trước: ${weakText}.`,
    hasWeak
      ? `Nên học trước: ${firstText}, vì đây là chủ đề yếu có lớp thấp nhất.`
      : `Nên học trước: ${firstText}, vì đây là chủ đề nền có lớp thấp nhất.`,
  ].join(" ");

  await db
    .update(practiceSessions)
    .set({ estimatedLevel: level, summary })
    .where(eq(practiceSessions.id, sessionId));
  return summary;
}
