"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getStudentId } from "@/lib/student";
import { getTopicProgress } from "@/modules/learning/profile";
import {
  advanceGenerationJob,
  createGenerationJob,
  GENERATION_KINDS,
  getExamGenerationBySession,
  recentWrongQuestionIds,
} from "./generator";

const createSchema = z.object({
  kind: z.enum(GENERATION_KINDS),
  topicSlug: z.string().trim().min(1).optional(),
});

export async function startAIGeneration(formData: FormData) {
  const rawSlug = formData.get("topicSlug");
  const parsed = createSchema.safeParse({
    kind: formData.get("kind"),
    topicSlug: typeof rawSlug === "string" && rawSlug.trim() ? rawSlug : undefined,
  });
  if (!parsed.success) redirect("/ai-generator?error=invalid");
  const userId = await getStudentId();
  let config = {};

  if (parsed.data.kind === "practice") {
    const progress = await getTopicProgress(userId);
    const topic = progress.find((item) => item.slug === parsed.data.topicSlug);
    if (!topic) redirect("/ai-generator?error=topic");
    config = { topicId: topic.id, topicSlug: topic.slug };
  } else if (parsed.data.kind === "review") {
    const sourceQuestionIds = await recentWrongQuestionIds(userId);
    if (sourceQuestionIds.length === 0) redirect("/ai-generator?error=no-review");
    config = { sourceQuestionIds };
  }

  const id = await createGenerationJob({ kind: parsed.data.kind, config, userId });
  const result = await advanceGenerationJob(id, userId);
  if (result.destination) redirect(result.destination);
  redirect(`/ai-generator?job=${id}`);
}

export async function continueAIGeneration(formData: FormData) {
  const id = z.string().uuid().safeParse(formData.get("jobId"));
  if (!id.success) redirect("/ai-generator?error=invalid");
  const userId = await getStudentId();
  const result = await advanceGenerationJob(id.data, userId);
  if (result.destination) redirect(result.destination);
  redirect(`/ai-generator?job=${id.data}`);
}

export async function pumpExamGeneration(sessionId: string, retry = false) {
  const userId = await getStudentId();
  const job = await getExamGenerationBySession(sessionId, userId);
  const pageCount = job?.config.pages?.length ?? 0;
  if (!job || job.status === "completed") return { done: true, error: null, busy: false, pageCount };
  if (job.error && !retry) return { done: false, error: job.error, busy: false, pageCount };
  const result = await advanceGenerationJob(job.id, userId);
  const next = result.job;
  return {
    done: next?.status === "completed",
    error: next?.error ?? null,
    busy: next?.status === "running" && !next.error,
    pageCount: next?.config.pages?.length ?? pageCount,
  };
}

export async function retryExamGeneration(formData: FormData) {
  const sessionId = z.string().uuid().safeParse(formData.get("sessionId"));
  const part = z.coerce.number().int().min(1).safeParse(formData.get("part"));
  if (!sessionId.success) redirect("/mock-exam");
  await pumpExamGeneration(sessionId.data, true);
  redirect(`/mock-exam/${sessionId.data}?part=${part.success ? part.data : 1}`);
}
