import { z } from "zod";
import { contentHash } from "@/db/hash";

const optionId = z.enum(["a", "b", "c", "d"]);

export const generatedQuestionSchema = z.object({
  stem: z.string().trim().min(12),
  options: z.array(z.object({
    id: optionId,
    text: z.string().trim().min(1),
  })).length(4),
  correctAnswer: optionId,
  explanation: z.string().trim().min(12),
  wrongAnswerExplanations: z.array(z.object({
    optionId,
    explanation: z.string().trim().min(8),
  })).length(3),
  difficulty: z.enum(["easy", "medium", "hard"]),
});

export const generatedBatchSchema = z.object({
  questions: z.array(generatedQuestionSchema).min(1).max(5),
});

export const generatedTopicQuestionSchema = generatedQuestionSchema.extend({
  topicSlug: z.string().trim().min(1),
});

export const generatedTopicBatchSchema = z.object({
  questions: z.array(generatedTopicQuestionSchema).min(1).max(5),
});

export const generatedReadingSchema = z.object({
  title: z.string().trim().min(4),
  body: z.string().trim().min(180),
  questions: z.array(generatedQuestionSchema).min(1).max(10),
});

export const generatedOrderingSchema = z.object({
  items: z.array(z.object({
    title: z.string().trim().min(4),
    prompt: z.string().trim().min(8),
    sentences: z.array(z.object({
      id: optionId,
      text: z.string().trim().min(2),
    })).length(4),
    correctOrder: z.array(optionId).length(4),
    explanation: z.string().trim().min(8),
    difficulty: z.enum(["easy", "medium", "hard"]),
  })).min(1).max(5),
});

export const generatedGapSchema = z.object({
  title: z.string().trim().min(4),
  body: z.string().trim().min(120),
  questions: z.array(generatedTopicQuestionSchema).min(1).max(6),
});

export const teacherExplanationSchema = z.object({
  errorType: z.string(),
  correctAnswer: z.string().trim().min(1),
  whyCorrect: z.string().trim().min(8),
  whyWrong: z.string().trim().min(8),
  rule: z.string().trim().min(8),
  structure: z.string().trim().min(4),
  signalWords: z.string().trim().min(1),
  commonMistake: z.string().trim().min(4),
  comparison: z.string().trim().min(4),
  shortExample: z.string().trim().min(4),
  practicePrompt: z.string().trim().min(4),
});

export type GeneratedQuestion = z.infer<typeof generatedQuestionSchema>;
export type GeneratedOrdering = z.infer<typeof generatedOrderingSchema>;

export function orderingIssues(item: GeneratedOrdering["items"][number]) {
  const ids = item.sentences.map((sentence) => sentence.id);
  const order = item.correctOrder;
  const expected = ["a", "b", "c", "d"];
  if (new Set(ids).size !== 4 || expected.some((id) => !ids.includes(id as "a" | "b" | "c" | "d"))) {
    return ["Phải có đủ bốn câu a, b, c, d."];
  }
  if (new Set(order).size !== 4 || expected.some((id) => !order.includes(id as "a" | "b" | "c" | "d"))) {
    return ["Thứ tự đúng phải dùng đủ a, b, c, d đúng một lần."];
  }
  if (order.join(",") === ids.join(",")) {
    return ["Thứ tự hiển thị ban đầu không được là đáp án đúng."];
  }
  return [];
}

export function gapIssues(input: z.infer<typeof generatedGapSchema>, count: number, sequenceStart = 1) {
  const issues: string[] = [];
  if (input.questions.length !== count) issues.push(`Phải có đúng ${count} câu.`);
  for (let offset = 0; offset < count; offset += 1) {
    const number = sequenceStart + offset;
    if (!new RegExp(`\\(${number}\\)\\s*_{3,}`).test(input.body)) {
      issues.push(`Thiếu vị trí (${number})______ trong đoạn văn.`);
    }
  }
  if (input.questions.some((question) => questionIssues(question).length > 0)) {
    issues.push("Có câu hỏi không đạt kiểm tra.");
  }
  return issues;
}

export function readingIssues(input: z.infer<typeof generatedReadingSchema>) {
  const issues = input.questions.flatMap(questionIssues);
  if (new Set(input.questions.map((question) => question.stem.toLowerCase())).size !== input.questions.length) {
    issues.push("Các câu đọc hiểu phải có stem khác nhau.");
  }
  return issues;
}

export function questionIssues(question: GeneratedQuestion) {
  const issues: string[] = [];
  const ids = question.options.map((option) => option.id);
  const expectedIds = ["a", "b", "c", "d"] as const;
  if (new Set(ids).size !== 4 || expectedIds.some((id) => !ids.includes(id))) {
    issues.push("Phải có đủ bốn phương án a, b, c, d.");
  }
  const texts = new Set(question.options.map((option) => option.text.toLowerCase()));
  if (texts.size !== question.options.length) issues.push("Hai phương án trùng nhau.");

  const wrongIds = question.wrongAnswerExplanations.map((item) => item.optionId);
  const expectedWrong = expectedIds.filter((id) => id !== question.correctAnswer);
  const coversWrong = expectedWrong.every((id) => wrongIds.includes(id));
  if (wrongIds.includes(question.correctAnswer) || !coversWrong || new Set(wrongIds).size !== 3) {
    issues.push("Chỉ một đáp án đúng, và mỗi phương án sai có một lời giải.");
  }
  return issues;
}

export function acceptQuestions(questions: GeneratedQuestion[], existingHashes: Set<string>) {
  const accepted: Array<GeneratedQuestion & { contentHash: string }> = [];
  const hashes = new Set(existingHashes);
  for (const question of questions) {
    if (questionIssues(question).length > 0) continue;
    const hash = contentHash(question.stem);
    if (hashes.has(hash)) continue;
    hashes.add(hash);
    accepted.push({ ...question, contentHash: hash });
  }
  return accepted;
}
