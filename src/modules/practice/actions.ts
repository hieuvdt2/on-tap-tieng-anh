"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getStudentId } from "@/lib/student";
import { mixByLevel } from "@/modules/learning/mix";
import { getTopicProgress, pickWeakTopic } from "@/modules/learning/profile";
import { generatePublishedQuestions } from "@/modules/ai/generate-practice";
import { saveTeacherExplanation } from "@/modules/ai/explain-attempt";
import { mixPracticeQuestions } from "@/modules/questions/pick";
import { scoreAnswer } from "@/modules/questions/score";
import {
  createSession,
  getSessionBundle,
  isUniqueViolation,
  listPublished,
  recordAttempt,
} from "@/modules/practice/session";

const startSchema = z.object({
  mode: z.enum(["topic", "weakness", "quick"]),
  topicSlug: z.string().trim().min(1).optional(),
});

export async function startPractice(formData: FormData) {
  const slug = formData.get("topicSlug");
  const parsed = startSchema.safeParse({
    mode: formData.get("mode"),
    topicSlug: typeof slug === "string" && slug.trim() ? slug.trim() : undefined,
  });
  if (!parsed.success) redirect("/practice?error=invalid");

  const userId = await getStudentId();
  const progress = await getTopicProgress(userId);
  let topicId: string | null = null;

  if (parsed.data.mode === "topic") {
    const topic = progress.find((item) => item.slug === parsed.data.topicSlug);
    if (!topic) redirect("/practice?error=invalid");
    topicId = topic.id;
  }

  const weaknessHasLevels = parsed.data.mode === "weakness" && progress.some((topic) => topic.level);
  if (parsed.data.mode === "weakness" && !weaknessHasLevels) {
    const topic = pickWeakTopic(progress);
    if (!topic) redirect("/practice?error=empty");
    topicId = topic.id;
  }

  if (parsed.data.mode === "quick" && !topicId) {
    const topic = pickWeakTopic(progress) ?? progress[0];
    topicId = topic?.id ?? null;
  }

  const count = parsed.data.mode === "quick" ? 5 : parsed.data.mode === "weakness" ? 20 : 10;
  const freshTarget = Math.ceil(count / 2);
  const generationTopicId = weaknessHasLevels
    ? pickWeakTopic(progress.filter((topic) => topic.level === "weak"))?.id
      ?? pickWeakTopic(progress)?.id
      ?? null
    : topicId;
  let generatedIds: string[] = [];
  if (generationTopicId) {
    try {
      generatedIds = await generatePublishedQuestions(
        generationTopicId,
        weaknessHasLevels ? 10 : freshTarget,
      );
    } catch {
      generatedIds = [];
    }
  }
  const published = await listPublished();
  const questionIds = (weaknessHasLevels
    ? mixByLevel({
        questions: published,
        topics: progress.map((topic) => ({ id: topic.id, level: topic.level })),
        count,
        freshIds: generatedIds,
      })
    : mixPracticeQuestions({
        freshIds: generatedIds,
        questions: published,
        count,
        topicId: parsed.data.mode === "quick" ? undefined : topicId ?? undefined,
      })
  ).map((question) => question.id);
  if (questionIds.length === 0) redirect("/practice?error=empty");

  const id = crypto.randomUUID();
  await createSession({
    id,
    userId,
    topicId: parsed.data.mode === "quick" || weaknessHasLevels ? null : topicId,
    mode: parsed.data.mode,
    questionIds,
  });
  redirect(`/practice/${id}`);
}

const answerSchema = z.object({
  sessionId: z.string().min(1),
  questionId: z.string().min(1),
  selectedAnswer: z.string().min(1),
  responseTimeMs: z.string().optional(),
});

export async function submitAnswer(formData: FormData) {
  const parsed = answerSchema.safeParse({
    sessionId: formData.get("sessionId"),
    questionId: formData.get("questionId"),
    selectedAnswer: formData.get("selectedAnswer"),
    responseTimeMs: formData.get("responseTimeMs"),
  });
  if (!parsed.success) redirect("/practice?error=invalid");

  const userId = await getStudentId();
  const bundle = await getSessionBundle(parsed.data.sessionId, userId);
  if (!bundle) redirect("/practice?error=invalid");

  const reviewPath = `/practice/${parsed.data.sessionId}?review=${parsed.data.questionId}`;
  const question = bundle.questions.find((item) => item.id === parsed.data.questionId);
  if (!question) redirect(`/practice/${parsed.data.sessionId}`);
  if (bundle.attempts.some((attempt) => attempt.questionId === question.id)) {
    redirect(reviewPath);
  }
  if (!question.options.some((option) => option.id === parsed.data.selectedAnswer)) {
    redirect(`/practice/${parsed.data.sessionId}`);
  }

  const elapsed = Number(parsed.data.responseTimeMs);
  const responseTimeMs = Number.isInteger(elapsed) && elapsed >= 0 && elapsed <= 30 * 60 * 1000
    ? elapsed
    : null;
  const isCorrect = scoreAnswer(question.correctAnswer, parsed.data.selectedAnswer);
  const errorType = isCorrect
    ? null
    : bundle.session.mode === "quick"
      ? "UNKNOWN"
      : "GRAMMAR_RULE";

  try {
    const attemptId = await recordAttempt({
      sessionId: bundle.session.id,
      userId,
      questionId: question.id,
      topicId: question.topicId,
      selectedAnswer: parsed.data.selectedAnswer,
      isCorrect,
      errorType,
      responseTimeMs,
      questionCount: bundle.questions.length,
    });
    if (!isCorrect) {
      await saveTeacherExplanation({
        attemptId,
        questionId: question.id,
        selectedAnswer: parsed.data.selectedAnswer,
      });
    }
  } catch (error) {
    if (!isUniqueViolation(error)) throw error;
  }

  redirect(reviewPath);
}
