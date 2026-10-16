import { and, desc, eq, inArray, lt, or, sql } from "drizzle-orm";
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
  vocabWords,
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
import { existingHeadwords } from "@/modules/vocabulary/queries";
import { generatedVocabularySchema } from "@/modules/vocabulary/schema";
import { TOPIC_TO_THEME } from "@/modules/vocabulary/themes";
import { headwordKey, wordIssues } from "@/modules/vocabulary/validate";
import { logAIRequest } from "./log";
import {
  buildGapPrompt,
  buildMixedQuestionsPrompt,
  buildOrderingPrompt,
  buildReadingPrompt,
  buildReadingQuestionsPrompt,
  buildVocabularyPrompt,
  buildTopicQuestionsPrompt,
  CONTENT_PROMPT_VERSION,
} from "./prompts/content-generation";
import { resolveAIProvider } from "./settings";
import { parseWithRepair, StructuredOutputError } from "./structured";
import { pickExamStepFromBank } from "./exam-bank";
import { AI_EXAM_SECTIONS, AI_EXAM_SOURCE, EXAM_GENERATION_STEPS } from "./generator-spec";

export const GENERATION_KINDS = ["practice", "reading", "ordering", "review", "diagnostic", "vocabulary", "exam"] as const;
export type GenerationKind = (typeof GENERATION_KINDS)[number];

const targets: Record<GenerationKind, number> = {
  practice: 10,
  reading: 4,
  ordering: 5,
  review: 10,
  diagnostic: 16,
  // Với kind này, questionIds lưu id của TỪ VỰNG (bảng vocab_word), không phải câu hỏi.
  vocabulary: 20,
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

// Một bước sinh đề (đọc hiểu, điền khuyết) dùng chung một đoạn văn/stimulus cho nhiều câu, nên
// không thể "xin bù" từng câu lẻ như sắp xếp — phải sinh lại toàn bộ đoạn + câu hỏi. Giới hạn số
// lần thử để không gọi AI vô hạn khi model liên tục trả nội dung không đạt kiểm tra.
const MAX_SECTION_ATTEMPTS = 3;

async function withAttempts<T>(label: string, attempt: () => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (let i = 1; i <= MAX_SECTION_ATTEMPTS; i += 1) {
    try {
      return await attempt();
    } catch (error) {
      lastError = error;
    }
  }
  const reason = lastError instanceof Error ? lastError.message : "AI chưa tạo được nội dung đạt kiểm tra.";
  throw new Error(`${label} sau ${MAX_SECTION_ATTEMPTS} lần thử: ${reason}`);
}

async function insertQuestion(input: {
  question: GeneratedQuestion;
  topic: TopicContext;
  providerModel: string;
  createdBy: string;
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
      createdBy: input.createdBy,
    });
    return id;
  } catch (error) {
    console.warn("[ai-generator] bỏ qua một câu (trùng nội dung hoặc lỗi lưu):", error instanceof Error ? error.message : error);
    return null;
  }
}

async function saveTopicBatch(input: {
  topic: TopicContext;
  count: number;
  createdBy: string;
  reviewNotes?: string[];
  difficulty?: "easy" | "medium" | "hard";
}) {
  return withAttempts("Không tạo được câu luyện tập", async () => {
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
        difficulty: input.difficulty,
      }),
      operation: input.reviewNotes?.length ? "review-question-generation" : "practice-question-generation",
    });
    const ids: string[] = [];
    for (const question of result.data.questions.slice(0, input.count)) {
      const id = await insertQuestion({ question, topic: input.topic, providerModel: result.provider.model, createdBy: input.createdBy });
      if (id) ids.push(id);
    }
    if (ids.length === 0) throw new Error("không có câu nào đạt kiểm tra");
    return ids;
  });
}

export async function generateTopicQuestions(
  topicId: string,
  count: number,
  createdBy: string,
  difficulty?: "easy" | "medium" | "hard",
) {
  if (count < 1) return [];
  const context = (await topicContexts()).find((topic) => topic.id === topicId);
  if (!context || (context.skill !== "grammar" && context.skill !== "vocabulary")) return [];
  const ids: string[] = [];
  while (ids.length < count) {
    // saveTopicBatch tự thử lại 3 lần rồi mới throw; nếu vẫn hỏng thì dừng và trả về số câu đã
    // có, giữ đúng hành vi cũ (ưu tiên có câu dùng được hơn là làm hỏng cả lượt vì 1 mẻ lỗi).
    let batch: string[];
    try {
      batch = await saveTopicBatch({ topic: context, count: Math.min(5, count - ids.length), createdBy, difficulty });
    } catch {
      break;
    }
    if (batch.length === 0) break;
    ids.push(...batch);
  }
  return ids.slice(0, count);
}

// Xáo rồi lấy một tập con chủ đề thay vì nhét ngữ cảnh của toàn bộ chủ đề (có thể hơn 30) vào
// mỗi prompt — lô nào cũng chỉ cần vài chủ đề, gửi hết phần còn lại chỉ làm prompt nặng hơn mà
// không ích gì, lại dễ làm model phản hồi chậm hơn.
function pickRandomTopics(topics: TopicContext[], count: number) {
  const pool = [...topics];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

async function saveMixedBatch(input: {
  availableTopics: TopicContext[];
  count: number;
  createdBy: string;
  reviewNotes?: string[];
  difficulty?: "easy" | "medium" | "hard";
}) {
  const usable = input.availableTopics.filter((topic) => topic.skill === "grammar" || topic.skill === "vocabulary");
  return withAttempts("Không tạo được câu", async () => {
    const promptTopics = pickRandomTopics(usable, Math.min(usable.length, Math.max(input.count + 2, 6)));
    const result = await requestStructured({
      schema: generatedTopicBatchSchema,
      prompt: buildMixedQuestionsPrompt({
        topics: promptTopics.map((topic) => ({ slug: topic.slug, name: topic.name, context: topic.context })),
        count: input.count,
        reviewNotes: input.reviewNotes,
        difficulty: input.difficulty,
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
      const id = await insertQuestion({ question, topic, providerModel: result.provider.model, createdBy: input.createdBy });
      if (id) ids.push(id);
    }
    if (ids.length === 0) throw new Error("không có câu nào đạt kiểm tra");
    return ids;
  });
}

// Lô câu đầu nhỏ hơn số câu cần (ví dụ 5 thay vì 10) để lệnh gọi AI đầu tiên (đoạn văn + câu hỏi)
// gọn và nhanh hơn, giảm nguy cơ timeout/vượt rate limit. Phần còn thiếu xin bù riêng, chỉ gửi
// lại đoạn văn làm ngữ cảnh chứ không bắt AI viết lại — vừa nhỏ vừa nhanh hơn nữa.
const READING_FIRST_BATCH = 5;
const TOPUP_MAX_ATTEMPTS = 3;

async function saveReading(count: number, contexts: TopicContext[], createdBy: string, difficulty?: "easy" | "medium" | "hard") {
  const readingTopic = contexts.find((topic) => topic.skill === "reading");
  if (!readingTopic) throw new Error("Thiếu chủ đề Đọc hiểu trong dữ liệu.");
  return withAttempts("Bài đọc AI chưa đạt kiểm tra", async () => {
    const firstBatch = Math.min(count, READING_FIRST_BATCH);
    const result = await requestStructured({
      schema: generatedReadingSchema,
      prompt: buildReadingPrompt(firstBatch, difficulty),
      operation: "reading-generation",
    });
    if (result.data.questions.length !== firstBatch || readingIssues(result.data).length > 0) {
      throw new Error("bài đọc hoặc câu hỏi không đạt kiểm tra");
    }
    const stimulusId = crypto.randomUUID();
    const body = result.data.body;
    await db.insert(stimuli).values({
      id: stimulusId,
      kind: "passage",
      title: result.data.title,
      body,
      topicId: readingTopic.id,
      wordCount: body.trim().split(/\s+/).length,
    });

    const ids: string[] = [];
    const usedStems: string[] = [];
    for (const question of result.data.questions) {
      const id = await insertQuestion({ question, topic: readingTopic, providerModel: result.provider.model, createdBy, stimulusId, hashScope: body });
      if (id) {
        ids.push(id);
        usedStems.push(question.stem);
      }
    }

    for (let attempt = 1; attempt <= TOPUP_MAX_ATTEMPTS && ids.length < count; attempt += 1) {
      const remaining = count - ids.length;
      const topup = await requestStructured({
        schema: generatedBatchSchema,
        prompt: buildReadingQuestionsPrompt({ body, count: Math.min(remaining, 5), avoidStems: usedStems, difficulty }),
        operation: "reading-generation",
      });
      for (const question of topup.data.questions.slice(0, remaining)) {
        if (questionIssues(question).length > 0) continue;
        if (usedStems.some((stem) => stem.toLowerCase() === question.stem.toLowerCase())) continue;
        const id = await insertQuestion({ question, topic: readingTopic, providerModel: topup.provider.model, createdBy, stimulusId, hashScope: body });
        if (id) {
          ids.push(id);
          usedStems.push(question.stem);
        }
      }
    }

    if (ids.length !== count) {
      if (ids.length > 0) await db.delete(questions).where(inArray(questions.id, ids));
      await db.delete(stimuli).where(eq(stimuli.id, stimulusId));
      throw new Error(`chỉ lưu được ${ids.length}/${count} câu sau khi xin bù, phần còn lại trùng nội dung đã có hoặc không đạt kiểm tra`);
    }
    return { ids, stimulusIds: [stimulusId] };
  });
}

async function saveVocabBatch(input: { topic: TopicContext; count: number; createdBy: string }) {
  return withAttempts("Không tạo được từ vựng", async () => {
    const avoid = await existingHeadwords(input.topic.id);
    const result = await requestStructured({
      schema: generatedVocabularySchema,
      prompt: buildVocabularyPrompt({
        topicName: input.topic.name,
        context: input.topic.context,
        count: input.count,
        avoidWords: avoid,
      }),
      operation: "vocabulary-generation",
    });
    const taken = new Set(avoid);
    const ids: string[] = [];
    for (const item of result.data.words.slice(0, input.count + 4)) {
      if (ids.length >= input.count) break;
      const key = headwordKey(item.word);
      if (taken.has(key) || wordIssues(item).length > 0) continue;
      const id = crypto.randomUUID();
      const inserted = await db
        .insert(vocabWords)
        .values({
          id,
          headword: item.word.trim(),
          headwordKey: key,
          wordClass: item.wordClass.trim(),
          ipa: item.ipa?.trim() || null,
          meaningVi: item.meaningVi.trim(),
          example: item.example.trim(),
          note: item.note?.trim() ?? "",
          topicId: input.topic.id,
          theme: TOPIC_TO_THEME[input.topic.slug] ?? null,
          provenance: "ai_generated",
          generationModel: result.provider.model,
          createdBy: input.createdBy,
        })
        .onConflictDoNothing()
        .returning({ id: vocabWords.id });
      if (inserted[0]) {
        ids.push(id);
        taken.add(key);
      }
    }
    if (ids.length === 0) throw new Error("không có từ nào đạt kiểm tra hoặc đều đã có trong kho");
    return ids;
  });
}

async function saveOrdering(count: number, contexts: TopicContext[], createdBy: string, difficulty?: "easy" | "medium" | "hard") {
  const orderingTopic = contexts.find((topic) => topic.skill === "ordering");
  if (!orderingTopic) throw new Error("Thiếu chủ đề Sắp xếp câu trong dữ liệu.");
  const ids: string[] = [];
  const stimulusIds: string[] = [];
  let lastModel = "";
  for (let attempt = 1; attempt <= MAX_SECTION_ATTEMPTS && ids.length < count; attempt += 1) {
    const remaining = count - ids.length;
    const result = await requestStructured({
      schema: generatedOrderingSchema,
      prompt: buildOrderingPrompt(remaining, difficulty),
      operation: "ordering-generation",
    });
    lastModel = result.provider.model;
    for (const item of result.data.items.slice(0, remaining)) {
      if (orderingIssues(item).length > 0) continue;
      const stimulusId = crypto.randomUUID();
      const id = crypto.randomUUID();
      try {
        await db.insert(stimuli).values({
          id: stimulusId,
          kind: "ordering_prompt",
          title: item.title,
          body: item.prompt,
          topicId: orderingTopic.id,
          wordCount: item.sentences.reduce((sum, sentence) => sum + sentence.text.split(/\s+/).length, 0),
        });
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
          createdBy,
        });
        ids.push(id);
        stimulusIds.push(stimulusId);
      } catch (error) {
        console.warn("[ai-generator] bỏ qua một bài sắp xếp (trùng nội dung hoặc lỗi lưu):", error instanceof Error ? error.message : error);
        await db.delete(stimuli).where(eq(stimuli.id, stimulusId));
      }
    }
  }
  if (ids.length !== count) {
    throw new Error(`Chỉ tạo được ${ids.length}/${count} bài sắp xếp sau ${MAX_SECTION_ATTEMPTS} lượt (model ${lastModel || "?"}).`);
  }
  return { ids, stimulusIds };
}

async function saveGap(input: {
  type: "gap_short" | "gap_long";
  count: number;
  contexts: TopicContext[];
  sequenceStart: number;
  createdBy: string;
  format?: "leaflet" | "advertisement" | "passage";
}) {
  const usable = input.contexts.filter((topic) => topic.skill === "grammar" || topic.skill === "vocabulary");
  const fallback = usable[0];
  if (!fallback) throw new Error("Không có chủ đề cho câu điền khuyết.");
  const bySlug = new Map(usable.map((topic) => [topic.slug, topic]));
  return withAttempts("Đoạn điền khuyết AI chưa đạt kiểm tra", async () => {
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
    if (gapIssues(result.data, input.count, input.sequenceStart).length > 0) {
      throw new Error("đoạn văn hoặc câu hỏi không đạt kiểm tra");
    }
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
        createdBy: input.createdBy,
        type: input.type,
        stimulusId,
        hashScope: result.data.body,
      });
      if (id) ids.push(id);
    }
    if (ids.length !== input.count) {
      if (ids.length > 0) await db.delete(questions).where(inArray(questions.id, ids));
      await db.delete(stimuli).where(eq(stimuli.id, stimulusId));
      throw new Error(`chỉ lưu được ${ids.length}/${input.count} câu, phần còn lại trùng nội dung đã có`);
    }
    return { ids, stimulusIds: [stimulusId] };
  });
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

// Mỗi lượt sinh đề (nhất là Đọc hiểu/Điền khuyết) có thể mất vài phút, kể cả khi lỗi. Thời gian
// đó không phải lỗi của thí sinh nên không được trừ vào 50 phút làm bài — cộng lại đúng số đó
// vào endsAt mỗi khi một lượt sinh (thành công hay thất bại) kết thúc cho một đề đã có phiên thi.
async function extendExamDeadline(sessionId: string | null | undefined, elapsedMs: number) {
  if (!sessionId || elapsedMs <= 0) return;
  const [row] = await db.select({ endsAt: examSessions.endsAt }).from(examSessions).where(eq(examSessions.id, sessionId)).limit(1);
  if (!row) return;
  await db.update(examSessions).set({ endsAt: new Date(row.endsAt.getTime() + elapsedMs) }).where(eq(examSessions.id, sessionId));
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
  } else if (job.kind === "vocabulary") {
    destination = "/vocabulary";
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
    source: AI_EXAM_SOURCE,
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
  // Khi schema không khớp cả sau khi đã xin sửa (parseWithRepair), message là nguyên văn lỗi Zod
  // (một mảng JSON kỹ thuật) — không nên đưa thẳng cho người dùng.
  if (error instanceof StructuredOutputError) {
    return "Model trả về nội dung sai định dạng. Hãy bấm Tiếp tục tạo để thử lại, hoặc chọn model khác trong Thiết lập AI.";
  }
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
  if (/failed to generate json/i.test(message)) {
    return "Model Groq không tạo được JSON. Hãy bấm Tiếp tục tạo, hoặc chọn model khác trong Thiết lập AI.";
  }
  if (/aborted due to timeout|timed out|TimeoutError/i.test(message)) {
    return "Phần này phản hồi quá lâu. Hãy bấm tiếp tục để tạo lại.";
  }
  return message;
}

// Job "running" quá mức này thì coi như tiến trình cũ đã chết (crash, restart, mất kết nối DB, hoặc
// Vercel cắt hàm ở maxDuration = 300 giây) và cho bên khác nhận lại. 6 phút: lớn hơn giới hạn 300 giây
// của hàm nên không cướp việc đang chạy thật, nhưng đủ ngắn để đề không bị treo lâu khi hàm bị cắt.
const STALE_RUNNING_MS = 6 * 60 * 1000;

export async function clearGenerationError(id: string, userId: string) {
  await db
    .update(generationJobs)
    .set({ error: null, updatedAt: new Date() })
    .where(and(eq(generationJobs.id, id), eq(generationJobs.userId, userId), eq(generationJobs.status, "paused")));
}

export async function advanceGenerationJob(id: string, userId: string) {
  const callStartedAt = Date.now();
  const job = await getGenerationJob(id, userId);
  if (!job) throw new Error("Không tìm thấy lượt tạo đề.");
  if (job.status === "completed") return { job, destination: "/ai-generator" };
  // Chụp trước khi gọi AI: nếu đề đã có phiên thi (từ bước trước), lượt này chỉ gia hạn giờ chứ
  // không tạo phiên mới.
  const sessionIdBeforeCall = job.kind === "exam" ? job.config.examSessionId ?? null : null;
  const staleCutoff = new Date(Date.now() - STALE_RUNNING_MS);
  const claimed = await db
    .update(generationJobs)
    .set({ status: "running", error: null, updatedAt: new Date() })
    .where(and(
      eq(generationJobs.id, id),
      eq(generationJobs.userId, userId),
      or(
        inArray(generationJobs.status, ["pending", "paused"]),
        and(eq(generationJobs.status, "running"), lt(generationJobs.updatedAt, staleCutoff)),
      ),
    ))
    .returning({ id: generationJobs.id });
  if (claimed.length === 0) return { job: await getGenerationJob(id, userId), destination: null };
  const contexts = await topicContexts();
  let added: { ids: string[]; stimulusIds?: string[] };
  let reusedIds: string[] = [];
  try {

    if (job.kind === "practice") {
      const topic = contexts.find((item) => item.id === job.config.topicId);
      if (!topic) throw new Error("Chủ đề đã chọn không tồn tại.");
      added = { ids: await saveTopicBatch({ topic, count: Math.min(5, job.targetCount - job.questionIds.length), createdBy: userId, difficulty: job.config.difficulty }) };
    } else if (job.kind === "review") {
      const notes = await reviewContext(job.config);
      if (notes.length === 0) throw new Error("Chưa có câu sai để tạo bài ôn lỗi.");
      added = {
        ids: await saveMixedBatch({
          availableTopics: contexts,
          count: Math.min(5, job.targetCount - job.questionIds.length),
          createdBy: userId,
          reviewNotes: notes,
          difficulty: job.config.difficulty,
        }),
      };
    } else if (job.kind === "diagnostic") {
      added = {
        ids: await saveMixedBatch({
          availableTopics: contexts,
          count: Math.min(4, job.targetCount - job.questionIds.length),
          createdBy: userId,
        }),
      };
    } else if (job.kind === "vocabulary") {
      const topic = contexts.find((item) => item.id === job.config.topicId);
      if (!topic) throw new Error("Chủ đề đã chọn không tồn tại.");
      added = { ids: await saveVocabBatch({ topic, count: Math.min(10, job.targetCount - job.questionIds.length), createdBy: userId }) };
    } else if (job.kind === "reading") {
      added = await saveReading(4, contexts, userId, job.config.difficulty);
    } else if (job.kind === "ordering") {
      added = await saveOrdering(5, contexts, userId, job.config.difficulty);
    } else {
      const step = EXAM_GENERATION_STEPS[job.step];
      if (!step) throw new Error("Đề đã đủ các phần nhưng chưa hoàn tất.");
      const fromBank = await pickExamStepFromBank({ step, userId, excludeIds: job.questionIds });
      if (fromBank) added = fromBank;
      else {
        try {
          if (step.kind === "ordering") added = await saveOrdering(step.count, contexts, userId);
          else if (step.kind === "reading") added = await saveReading(step.count, contexts, userId);
          else {
            added = await saveGap({
              type: step.kind,
              count: step.count,
              contexts,
              sequenceStart: step.sequenceStart,
              createdBy: userId,
              format: step.format,
            });
          }
        } catch (error) {
          // Kho hết câu mới và AI cũng lỗi (hết quota, timeout, sai khoá…): dùng lại câu đã gặp để đề
          // vẫn đủ. Không có cả câu cũ phù hợp thì mới báo lỗi như trước.
          const reused = await pickExamStepFromBank({ step, userId, excludeIds: job.questionIds, reuseSeen: true });
          if (!reused) throw error;
          added = reused;
          reusedIds = reused.ids;
        }
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
      await extendExamDeadline(sessionIdBeforeCall, Date.now() - callStartedAt);
      const finished = questionIds.length >= job.targetCount;
      await db
        .update(generationJobs)
        .set({
          status: finished ? "completed" : "paused",
          step: nextStep,
          questionIds,
          stimulusIds,
          specificationId: opened.specificationId,
          config: {
            ...job.config,
            examSessionId: opened.examSessionId,
            pages,
            ...(reusedIds.length ? { reusedQuestionIds: [...(job.config.reusedQuestionIds ?? []), ...reusedIds] } : {}),
          },
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
    await extendExamDeadline(sessionIdBeforeCall, Date.now() - callStartedAt);
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
