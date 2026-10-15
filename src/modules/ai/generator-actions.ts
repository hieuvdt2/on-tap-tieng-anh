"use server";

import { redirect } from "next/navigation";
import { after } from "next/server";
import { z } from "zod";
import { getStudentId } from "@/lib/student";
import { getTopicProgress } from "@/modules/learning/profile";
import {
  advanceGenerationJob,
  clearGenerationError,
  createGenerationJob,
  GENERATION_KINDS,
  getExamGenerationBySession,
  getGenerationJob,
  recentWrongQuestionIds,
} from "./generator";
import { apiKeyFor, isAIChoice } from "./provider";
import { readStoredAI, writeAIProvider } from "./settings";

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
  if (parsed.data.kind === "exam") continueExamInBackground(id, userId);
  if (result.destination) redirect(result.destination);
  redirect(`/ai-generator?job=${id}`);
}

// Đề AI: xong phần nào là server tự tạo tiếp phần sau ngay (sau khi đã trả trang), không phụ thuộc
// tab trình duyệt còn mở hay trang có lỗi. ExamGenerationPump trên trang chỉ còn theo dõi tiến độ và
// dự phòng; claim trong advanceGenerationJob bảo đảm hai bên không tạo trùng một phần.
function continueExamInBackground(jobId: string, userId: string) {
  after(async () => {
    for (let guard = 0; guard < 12; guard += 1) {
      const { job } = await advanceGenerationJob(jobId, userId);
      if (!job || job.status !== "paused" || job.error) return;
    }
  });
}

export async function continueAIGeneration(formData: FormData) {
  const id = z.string().uuid().safeParse(formData.get("jobId"));
  if (!id.success) redirect("/ai-generator?error=invalid");
  const userId = await getStudentId();
  const result = await advanceGenerationJob(id.data, userId);
  if (result.destination) redirect(result.destination);
  redirect(`/ai-generator?job=${id.data}`);
}

export async function pumpExamGeneration(sessionId: string) {
  const userId = await getStudentId();
  const job = await getExamGenerationBySession(sessionId, userId);
  const pageCount = job?.config.pages?.length ?? 0;
  if (!job || job.status === "completed") return { done: true, error: null, busy: false, pageCount };
  if (job.error) return { done: false, error: job.error, busy: false, pageCount };
  const result = await advanceGenerationJob(job.id, userId);
  const next = result.job;
  return {
    done: next?.status === "completed",
    error: next?.error ?? null,
    busy: next?.status === "running" && !next.error,
    pageCount: next?.config.pages?.length ?? pageCount,
  };
}

// Người dùng đồng ý chuyển sang một nguồn AI đã lưu khoá khi nguồn hiện tại lỗi (hết quota, timeout…).
// Chỉ nhận nguồn thật sự có khoá của chính người dùng; model dùng là model đã chọn cho nguồn đó
// (hoặc mặc định của nguồn). Đề thi thì tạo tiếp ở nền, loại khác tạo tiếp ngay như nút "Tiếp tục tạo".
export async function switchSourceAndContinue(formData: FormData) {
  const jobId = z.string().uuid().safeParse(formData.get("jobId"));
  const choice = String(formData.get("choice") ?? "");
  if (!jobId.success) redirect("/ai-generator?error=invalid");
  const userId = await getStudentId();
  const job = await getGenerationJob(jobId.data, userId);
  if (!job) redirect("/ai-generator?error=invalid");

  const stored = await readStoredAI(userId);
  const back = job.config.examSessionId ? `/mock-exam/${job.config.examSessionId}` : `/ai-generator?job=${job.id}`;
  if (!isAIChoice(choice) || !apiKeyFor(choice, stored)) redirect(back);

  await writeAIProvider(choice);
  await clearGenerationError(job.id, userId);
  if (job.kind === "exam" && job.config.examSessionId) {
    continueExamInBackground(job.id, userId);
    redirect(back);
  }
  const result = await advanceGenerationJob(job.id, userId);
  if (result.destination) redirect(result.destination);
  redirect(back);
}

export async function retryExamGeneration(formData: FormData) {
  const sessionId = z.string().uuid().safeParse(formData.get("sessionId"));
  if (!sessionId.success) redirect("/mock-exam");
  const userId = await getStudentId();
  const job = await getExamGenerationBySession(sessionId.data, userId);
  // Xoá lỗi ngay để trang quay lại trạng thái "đang tạo" (vòng theo dõi trên trang chạy lại),
  // còn việc tạo chạy ở nền thay vì bắt người dùng chờ cả lượt gọi AI.
  if (job && job.status !== "completed") {
    await clearGenerationError(job.id, userId);
    continueExamInBackground(job.id, userId);
  }
  redirect(`/mock-exam/${sessionId.data}`);
}
