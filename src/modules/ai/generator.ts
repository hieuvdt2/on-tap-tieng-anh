import { and, desc, eq, inArray, sql } from "drizzle-orm";
import type { ZodType } from "zod";
import { db } from "@/db/client";
import { contentHash } from "@/db/hash";
import {
  attempts,
  examSessions,
  examSpecifications,
  generationJobs,
  grammarTopics,
  practiceSessions,
  questions,
  stimuli,
  topics,
  vocabularyTopics,
  type ExamGenerationPage,
  type GenerationJobConfig,
} from "@/db/schema";
import {
  gapIssues,
  generatedBatchSchema,
  generatedGapSchema,
  generatedOrderingSchema,
  generatedReadingSchema,
  generatedTopicBatchSchema,
  orderingIssues,
  questionIssues,
  readingIssues,
  type GeneratedQuestion,
} from "./questions";
import { logAIRequest } from "./log";
import {
  buildGapPrompt,
  buildMixedQuestionsPrompt,
  buildOrderingPrompt,
  buildReadingPrompt,
  buildTopicQuestionsPrompt,
  CONTENT_PROMPT_VERSION,
} from "./prompts/content-generation";
import { resolveAIProvider } from "./settings";
import { parseWithRepair } from "./structured";
import { AI_EXAM_SECTIONS, EXAM_GENERATION_STEPS } from "./generator-spec";

export const GENERATION_KINDS = ["practice", "reading", "ordering", "review", "diagnostic", "exam"] as const;
export type GenerationKind = (typeof GENERATION_KINDS)[number];

const targets: Record<GenerationKind, number> = {
  practice: 10,
  reading: 4,
  ordering: 5,
  review: 10,
  diagnostic: 16,
  exam: 40,
};

type TopicContext = {
  id: string;
  slug: string;
  name: string;
  gradeFrom: number;
  skill: string;
  context: string;
};

async function topicContexts(): Promise<TopicContext[]> {
  const [topicRows, grammarRows, vocabularyRows] = await Promise.all([
    db.select().from(topics),
    db.select().from(grammarTopics),
    db.select().from(vocabularyTopics),
  ]);
  const grammar = new Map(grammarRows.map((row) => [row.topicId, row]));
  const vocabulary = new Map(vocabularyRows.map((row) => [row.topicId, row]));
  return topicRows.map((topic) => {
    const grammarTopic = grammar.get(topic.id);
    const vocabularyTopic = vocabulary.get(topic.id);
    const context = grammarTopic
      ? [grammarTopic.purpose, grammarTopic.usage, grammarTopic.structure].join(" ")
      : vocabularyTopic
        ? [
            vocabularyTopic.overview,
            vocabularyTopic.items.slice(0, 12).map((item) => `${item.word}: ${item.meaningVi}`).join("; "),
            vocabularyTopic.collocations.slice(0, 8).map((item) => item.phrase).join(", "),
          ].join(" ")
        : topic.summary;
    return { ...topic, context };
  });
}

async function requestStructured<T>(input: {
  schema: ZodType<T>;
  prompt: string;
  operation: string;
}) {
  const provider = await resolveAIProvider();
  if (!provider) throw new Error("Nguồn AI đang chọn chưa sẵn sàng. Hãy kiểm tra khóa trong trang Nguồn AI.");
  return {
    provider,
    data: await parseWithRepair({
      schema: input.schema,
      prompt: input.prompt,
      request: async (prompt) => {
        const started = Date.now();
        try {
          const output = await provider.generateText({
            prompt,
            operation: input.operation,
            promptVersion: CONTENT_PROMPT_VERSION,
          });
          await logAIRequest({
            provider,
            operation: input.operation,
            promptVersion: CONTENT_PROMPT_VERSION,
            inputTokens: output.inputTokens,
            outputTokens: output.outputTokens,
            latencyMs: output.latencyMs,
            status: "ok",
          });
          return output.text;
        } catch (error) {
          await logAIRequest({
            provider,
            operation: input.operation,
            promptVersion: CONTENT_PROMPT_VERSION,
            inputTokens: null,
            outputTokens: null,
            latencyMs: Date.now() - started,
            status: "error",
            error: error instanceof Error ? error.message : "Không gọi được AI.",
          });
          throw error;
        }
      },
    }),
  };
}

async function insertQuestion(input: {
  question: GeneratedQuestion;
  topic: TopicContext;
  providerModel: string;
  type?: string;
  stimulusId?: string | null;
  hashScope?: string;
}) {
  if (questionIssues(input.question).length > 0) return null;
  const id = crypto.randomUUID();
  const hash = contentHash(`${input.hashScope ? `${input.hashScope}\n` : ""}${input.question.stem}`);
  try {
    await db.insert(questions).values({
      id,
      type: input.type ?? "single_choice",
      stimulusId: input.stimulusId ?? null,
      stem: input.question.stem,
      options: input.question.options,
      correctAnswer: input.question.correctAnswer,
      explanation: input.question.explanation,
      wrongAnswerExplanations: input.question.wrongAnswerExplanations,
      difficulty: input.question.difficulty,
      topicId: input.topic.id,
      grade: input.topic.gradeFrom,
      status: "published",
      provenance: "ai_generated",
      contentHash: hash,
      duplicateOfId: null,
      generationModel: input.providerModel,
      promptVersion: CONTENT_PROMPT_VERSION,
      validationNotes: null,
    });
    return id;
  } catch {
    return null;
  }
}

async function saveTopicBatch(input: {
  topic: TopicContext;
  count: number;
  reviewNotes?: string[];
}) {
  const existing = await db
    .select({ stem: questions.stem })
    .from(questions)
    .where(eq(questions.topicId, input.topic.id));
  const result = await requestStructured({
    schema: generatedBatchSchema,
    prompt: buildTopicQuestionsPrompt({
      topicName: input.topic.name,
      context: input.topic.context,
      count: input.count,
      avoidStems: existing.map((row) => row.stem),
      reviewNotes: input.reviewNotes,
    }),
    operation: input.reviewNotes?.length ? "review-question-generation" : "practice-question-generation",
  });
  const ids: string[] = [];
  for (const question of result.data.questions.slice(0, input.count)) {
    const id = await insertQuestion({ question, topic: input.topic, providerModel: result.provider.model });
    if (id) ids.push(id);
  }
  return ids;
}

export async function generateTopicQuestions(topicId: string, count: number) {
  if (count < 1) return [];
  const context = (await topicContexts()).find((topic) => topic.id === topicId);
  if (!context || (context.skill !== "grammar" && context.skill !== "vocabulary")) return [];
  const ids: string[] = [];
  while (ids.length < count) {
    const batch = await saveTopicBatch({ topic: context, count: Math.min(5, count - ids.length) });
    if (batch.length === 0) break;
    ids.push(...batch);
  }
  return ids.slice(0, count);
}

async function saveMixedBatch(input: {
  availableTopics: TopicContext[];
  count: number;
  reviewNotes?: string[];
}) {
  const usable = input.availableTopics.filter((topic) => topic.skill === "grammar" || topic.skill === "vocabulary");
  const result = await requestStructured({
    schema: generatedTopicBatchSchema,
    prompt: buildMixedQuestionsPrompt({
      topics: usable.map((topic) => ({ slug: topic.slug, name: topic.name, context: topic.context })),
      count: input.count,
      reviewNotes: input.reviewNotes,
    }),
    operation: input.reviewNotes?.length ? "review-question-generation" : "diagnostic-question-generation",
  });
  const bySlug = new Map(usable.map((topic) => [topic.slug, topic]));
  const ids: string[] = [];
  for (const item of result.data.questions.slice(0, input.count)) {
    const topic = bySlug.get(item.topicSlug);
    if (!topic) continue;
    const { topicSlug: _, ...question } = item;
    void _;
    const id = await insertQuestion({ question, topic, providerModel: result.provider.model });
    if (id) ids.push(id);
  }
  return ids;
}

async function saveReading(count: number, contexts: TopicContext[]) {
  const readingTopic = contexts.find((topic) => topic.skill === "reading");
  if (!readingTopic) throw new Error("Thiếu chủ đề Đọc hiểu trong dữ liệu.");
  const result = await requestStructured({
    schema: generatedReadingSchema,
    prompt: buildReadingPrompt(count),
    operation: "reading-generation",
  });
  if (result.data.questions.length !== count || readingIssues(result.data).length > 0) {
    throw new Error("Bài đọc AI chưa đạt kiểm tra.");
  }
  const stimulusId = crypto.randomUUID();
  await db.insert(stimuli).values({
    id: stimulusId,
    kind: "passage",
    title: result.data.title,
    body: result.data.body,
    topicId: readingTopic.id,
    wordCount: result.data.body.trim().split(/\s+/).length,
  });
  const ids: string[] = [];
  for (const question of result.data.questions) {
    const id = await insertQuestion({
      question,
      topic: readingTopic,
      providerModel: result.provider.model,
      stimulusId,
      hashScope: result.data.body,
    });
    if (id) ids.push(id);
  }
  if (ids.length !== count) throw new Error("Không lưu đủ câu đọc hiểu.");
  return { ids, stimulusIds: [stimulusId] };
}

async function saveOrdering(count: number, contexts: TopicContext[]) {
  const orderingTopic = contexts.find((topic) => topic.skill === "ordering");
  if (!orderingTopic) throw new Error("Thiếu chủ đề Sắp xếp câu trong dữ liệu.");
  const result = await requestStructured({
    schema: generatedOrderingSchema,
    prompt: buildOrderingPrompt(count),
    operation: "ordering-generation",
  });
  const ids: string[] = [];
  const stimulusIds: string[] = [];
  for (const item of result.data.items.slice(0, count)) {
    if (orderingIssues(item).length > 0) continue;
    const stimulusId = crypto.randomUUID();
    const id = crypto.randomUUID();
    await db.insert(stimuli).values({
      id: stimulusId,
      kind: "ordering_prompt",
      title: item.title,
      body: item.prompt,
      topicId: orderingTopic.id,
      wordCount: item.sentences.reduce((sum, sentence) => sum + sentence.text.split(/\s+/).length, 0),
    });
    try {
      await db.insert(questions).values({
        id,
        type: "ordering",
        stimulusId,
        stem: `${item.title}: ${item.prompt}`,
        options: item.sentences,
        correctAnswer: item.correctOrder.join(","),
        explanation: item.explanation,
        wrongAnswerExplanations: [],
        difficulty: item.difficulty,
        topicId: orderingTopic.id,
        grade: orderingTopic.gradeFrom,
        status: "published",
        provenance: "ai_generated",
        contentHash: contentHash(`${item.title}\n${item.sentences.map((sentence) => sentence.text).join("\n")}`),
        duplicateOfId: null,
        generationModel: result.provider.model,
        promptVersion: CONTENT_PROMPT_VERSION,
        validationNotes: null,
      });
      ids.push(id);
      stimulusIds.push(stimulusId);
    } catch {
      // Bỏ bundle trùng; job có thể tiếp tục để bù.
    }
  }
  if (ids.length !== count) throw new Error("Không lưu đủ bài sắp xếp.");
  return { ids, stimulusIds };
}

async function saveGap(input: {
  type: "gap_short" | "gap_long";
  count: number;
  contexts: TopicContext[];
  sequenceStart: number;
  format?: "leaflet" | "advertisement" | "passage";
}) {
  const usable = input.contexts.filter((topic) => topic.skill === "grammar" || topic.skill === "vocabulary");
  const result = await requestStructured({
    schema: generatedGapSchema,
    prompt: buildGapPrompt({
      type: input.type,
      count: input.count,
      topics: usable.map((topic) => ({ slug: topic.slug, name: topic.name })),
      sequenceStart: input.sequenceStart,
      format: input.format,
    }),
    operation: `${input.type}-generation`,
  });
  if (gapIssues(result.data, input.count, input.sequenceStart).length > 0) throw new Error("Đoạn điền khuyết AI chưa đạt kiểm tra.");
  const bySlug = new Map(usable.map((topic) => [topic.slug, topic]));
  const fallback = usable[0];
  if (!fallback) throw new Error("Không có chủ đề cho câu điền khuyết.");
  const stimulusId = crypto.randomUUID();
  await db.insert(stimuli).values({
    id: stimulusId,
    kind: "gap_text",
    title: result.data.title,
    body: result.data.body,
    topicId: null,
    wordCount: result.data.body.trim().split(/\s+/).length,
  });
  const ids: string[] = [];
  for (const item of result.data.questions) {
    const topic = bySlug.get(item.topicSlug) ?? fallback;
    const { topicSlug: _, ...question } = item;
    void _;
    const id = await insertQuestion({
      question,
      topic,
      providerModel: result.provider.model,
      type: input.type,
      stimulusId,
      hashScope: result.data.body,
    });
    if (id) ids.push(id);
  }
  if (ids.length !== input.count) throw new Error("Không lưu đủ câu điền khuyết.");
  return { ids, stimulusIds: [stimulusId] };
}

export async function createGenerationJob(input: {
  kind: GenerationKind;
  config?: GenerationJobConfig;
  userId: string;
}) {
  const id = crypto.randomUUID();
  await db.insert(generationJobs).values({
    id,
    userId: input.userId,
    kind: input.kind,
    config: input.config ?? {},
    status: "pending",
    targetCount: targets[input.kind],
    questionIds: [],
    stimulusIds: [],
  });
  return id;
}

export async function getGenerationJob(id: string, userId: string) {
  const rows = await db
    .select()
    .from(generationJobs)
    .where(and(eq(generationJobs.id, id), eq(generationJobs.userId, userId)))
    .limit(1);
  return rows[0] ?? null;
}

export async function listGenerationJobs(userId: string) {
  return db
    .select()
    .from(generationJobs)
    .where(eq(generationJobs.userId, userId))
    .orderBy(desc(generationJobs.createdAt))
    .limit(6);
}

async function reviewContext(config: GenerationJobConfig) {
  if (!config.sourceQuestionIds?.length) return [];
  const rows = await db
    .select({ stem: questions.stem, explanation: questions.explanation, topicId: questions.topicId })
    .from(questions)
    .where(inArray(questions.id, config.sourceQuestionIds));
  return rows.map((row) => `${row.stem} — ${row.explanation}`);
}

async function completeJob(job: typeof generationJobs.$inferSelect, questionIds: string[], stimulusIds: string[]) {
  let destination = "/ai-generator";
  const specificationId: string | null = job.specificationId;
  if (job.kind === "practice" || job.kind === "review" || job.kind === "diagnostic") {
    const sessionId = crypto.randomUUID();
    await db.insert(practiceSessions).values({
      id: sessionId,
      userId: job.userId,
      topicId: job.kind === "practice" ? job.config.topicId ?? null : null,
      mode: job.kind === "diagnostic" ? "diagnostic" : job.kind === "review" ? "review_ai" : "topic",
      questionIds: questionIds.slice(0, job.targetCount),
    });
    destination = `/practice/${sessionId}`;
  } else if (job.kind === "reading") {
    destination = `/reading/${stimulusIds[0]}`;
  } else if (job.kind === "ordering") {
    destination = `/ordering/${questionIds[0]}`;
  }
  await db
    .update(generationJobs)
    .set({
      status: "completed",
      questionIds,
      stimulusIds,
      specificationId,
      error: null,
      completedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(generationJobs.id, job.id));
  return destination;
}

async function syncExamProgress(
  job: typeof generationJobs.$inferSelect,
  questionIds: string[],
) {
  if (job.specificationId && job.config.examSessionId) {
    await db.update(examSpecifications).set({ questionIds }).where(eq(examSpecifications.id, job.specificationId));
    await db.update(examSessions).set({ questionIds }).where(eq(examSessions.id, job.config.examSessionId));
    return {
      specificationId: job.specificationId,
      examSessionId: job.config.examSessionId,
      destination: `/mock-exam/${job.config.examSessionId}?part=1`,
    };
  }

  const specificationId = crypto.randomUUID();
  const examSessionId = crypto.randomUUID();
  const startedAt = new Date();
  await db.insert(examSpecifications).values({
    id: specificationId,
    yearLabel: "AI",
    version: `ai-${startedAt.toISOString()}`,
    status: "provisional",
    source: "Đề AI trong app",
    questionCount: 40,
    durationMinutes: 50,
    sections: [...AI_EXAM_SECTIONS],
    notes: "Đề do AI tạo trong app, không phải đề chính thức của Bộ Giáo dục và Đào tạo.",
    questionIds,
  });
  await db.insert(examSessions).values({
    id: examSessionId,
    userId: job.userId,
    specificationId,
    questionIds,
    startedAt,
    endsAt: new Date(startedAt.getTime() + 50 * 60 * 1000),
  });
  return {
    specificationId,
    examSessionId,
    destination: `/mock-exam/${examSessionId}?part=1`,
  };
}

export async function getExamGenerationBySession(sessionId: string, userId: string) {
  const rows = await db
    .select()
    .from(generationJobs)
    .where(and(
      eq(generationJobs.userId, userId),
      eq(generationJobs.kind, "exam"),
      sql`${generationJobs.config}->>'examSessionId' = ${sessionId}`,
    ))
    .limit(1);
  return rows[0] ?? null;
}

function readableGenerationError(error: unknown) {
  const message = error instanceof Error ? error.message : "Không tạo được nội dung AI.";
  if (/API key not valid|API_KEY_INVALID|invalid api key/i.test(message)) {
    return "Khóa AI không hợp lệ. Hãy vào Cấu hình AI, xóa khóa cũ và lưu lại một khóa mới.";
  }
  if (/high demand|overloaded|UNAVAILABLE|try again later/i.test(message)) {
    return "Model AI đang quá tải. Hãy thử lại sau ít phút, hoặc vào Thiết lập AI chọn model khác.";
  }
  if (/quota|RESOURCE_EXHAUSTED|rate limit|too many requests/i.test(message)) {
    return "Khóa AI đã hết lượt dùng tạm thời. Hãy chờ một lúc, hoặc đổi sang nguồn hay model khác trong Thiết lập AI.";
  }
  if (/aborted due to timeout|timed out|TimeoutError/i.test(message)) {
    return "Phần này phản hồi quá lâu. Hãy bấm tiếp tục để tạo lại.";
  }
  return message;
}

export async function advanceGenerationJob(id: string, userId: string) {
  const job = await getGenerationJob(id, userId);
  if (!job) throw new Error("Không tìm thấy lượt tạo đề.");
  if (job.status === "completed") return { job, destination: "/ai-generator" };
  const claimed = await db
    .update(generationJobs)
    .set({ status: "running", error: null, updatedAt: new Date() })
    .where(and(
      eq(generationJobs.id, id),
      eq(generationJobs.userId, userId),
      inArray(generationJobs.status, ["pending", "paused"]),
    ))
    .returning({ id: generationJobs.id });
  if (claimed.length === 0) return { job: await getGenerationJob(id, userId), destination: null };
  const contexts = await topicContexts();
  let added: { ids: string[]; stimulusIds?: string[] };
  try {

    if (job.kind === "practice") {
      const topic = contexts.find((item) => item.id === job.config.topicId);
      if (!topic) throw new Error("Chủ đề đã chọn không tồn tại.");
      added = { ids: await saveTopicBatch({ topic, count: Math.min(5, job.targetCount - job.questionIds.length) }) };
    } else if (job.kind === "review") {
      const notes = await reviewContext(job.config);
      if (notes.length === 0) throw new Error("Chưa có câu sai để tạo bài ôn lỗi.");
      added = {
        ids: await saveMixedBatch({
          availableTopics: contexts,
          count: Math.min(5, job.targetCount - job.questionIds.length),
          reviewNotes: notes,
        }),
      };
    } else if (job.kind === "diagnostic") {
      added = {
        ids: await saveMixedBatch({
          availableTopics: contexts,
          count: Math.min(4, job.targetCount - job.questionIds.length),
        }),
      };
    } else if (job.kind === "reading") {
      added = await saveReading(4, contexts);
    } else if (job.kind === "ordering") {
      added = await saveOrdering(5, contexts);
    } else {
      const step = EXAM_GENERATION_STEPS[job.step];
      if (!step) throw new Error("Đề đã đủ các phần nhưng chưa hoàn tất.");
      if (step.kind === "ordering") added = await saveOrdering(step.count, contexts);
      else if (step.kind === "reading") added = await saveReading(step.count, contexts);
      else {
        added = await saveGap({
          type: step.kind,
          count: step.count,
          contexts,
          sequenceStart: step.sequenceStart,
          format: step.format,
        });
      }
    }

    if (added.ids.length === 0) throw new Error("AI chưa tạo được câu nào đạt kiểm tra.");
    const questionIds = [...job.questionIds, ...added.ids];
    const stimulusIds = [...job.stimulusIds, ...(added.stimulusIds ?? [])];
    const nextStep = job.step + 1;
    if (job.kind === "exam") {
      const step = EXAM_GENERATION_STEPS[job.step];
      const pages: ExamGenerationPage[] = [
        ...(job.config.pages ?? []),
        { questionIds: added.ids, instruction: step?.instruction ?? "" },
      ];
      const opened = await syncExamProgress(job, questionIds);
      const finished = questionIds.length >= job.targetCount;
      await db
        .update(generationJobs)
        .set({
          status: finished ? "completed" : "paused",
          step: nextStep,
          questionIds,
          stimulusIds,
          specificationId: opened.specificationId,
          config: { ...job.config, examSessionId: opened.examSessionId, pages },
          error: null,
          completedAt: finished ? new Date() : null,
          updatedAt: new Date(),
        })
        .where(eq(generationJobs.id, id));
      return {
        job: await getGenerationJob(id, userId),
        destination: job.config.examSessionId ? null : opened.destination,
      };
    }
    if (questionIds.length >= job.targetCount) {
      const destination = await completeJob(job, questionIds, stimulusIds);
      return { job: await getGenerationJob(id, userId), destination };
    }
    await db
      .update(generationJobs)
      .set({
        status: "paused",
        step: nextStep,
        questionIds,
        stimulusIds,
        error: null,
        updatedAt: new Date(),
      })
      .where(eq(generationJobs.id, id));
    return { job: await getGenerationJob(id, userId), destination: null };
  } catch (error) {
    const message = readableGenerationError(error);
    await db
      .update(generationJobs)
      .set({ status: "paused", error: message.slice(0, 500), updatedAt: new Date() })
      .where(eq(generationJobs.id, id));
    return { job: await getGenerationJob(id, userId), destination: null };
  }
}

export async function recentWrongQuestionIds(userId: string) {
  const rows = await db
    .select({ questionId: attempts.questionId })
    .from(attempts)
    .where(and(eq(attempts.userId, userId), eq(attempts.isCorrect, false)))
    .orderBy(desc(attempts.createdAt))
    .limit(20);
  return [...new Set(rows.map((row) => row.questionId))];
}
