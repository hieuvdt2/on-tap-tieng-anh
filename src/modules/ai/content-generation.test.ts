import { describe, expect, it } from "vitest";
import {
  gapIssues,
  generatedGapSchema,
  generatedOrderingSchema,
  generatedReadingSchema,
  generatedTopicBatchSchema,
  orderingIssues,
  readingIssues,
} from "./questions";
import { AI_EXAM_SECTIONS, EXAM_GENERATION_STEPS, examPageStart } from "./generator-spec";
import { buildMixedQuestionsPrompt } from "./prompts/content-generation";
import { MockProvider } from "./mock-provider";

const question = {
  stem: "Which option best completes the sentence?",
  options: [
    { id: "a" as const, text: "Option A" },
    { id: "b" as const, text: "Option B" },
    { id: "c" as const, text: "Option C" },
    { id: "d" as const, text: "Option D" },
  ],
  correctAnswer: "a" as const,
  explanation: "Đáp án A phù hợp với ngữ cảnh của câu.",
  wrongAnswerExplanations: [
    { optionId: "b" as const, explanation: "B không phù hợp với ngữ cảnh." },
    { optionId: "c" as const, explanation: "C không phù hợp với ngữ cảnh." },
    { optionId: "d" as const, explanation: "D không phù hợp với ngữ cảnh." },
  ],
  difficulty: "medium" as const,
};

describe("AI content schemas", () => {
  it("rejects an ordering item that repeats an id", () => {
    const parsed = generatedOrderingSchema.parse({
      items: [{
        title: "A school event",
        prompt: "Put the sentences in the correct order.",
        sentences: [
          { id: "a", text: "First sentence." },
          { id: "b", text: "Second sentence." },
          { id: "c", text: "Third sentence." },
          { id: "d", text: "Fourth sentence." },
        ],
        correctOrder: ["a", "a", "c", "d"],
        explanation: "Các câu nối với nhau theo trình tự thời gian.",
        difficulty: "medium",
      }],
    });
    expect(orderingIssues(parsed.items[0]!)).not.toEqual([]);
  });

  it("requires every numbered gap marker", () => {
    const parsed = generatedGapSchema.parse({
      title: "A short notice",
      body: `This is a sufficiently long original notice for students. (1)______ It contains enough words to pass the schema while deliberately omitting the second numbered marker required by the validator. ${"More context. ".repeat(8)}`,
      questions: [
        { ...question, topicSlug: "present-simple" },
        { ...question, stem: "Which phrase belongs in the second blank?", topicSlug: "articles" },
      ],
    });
    expect(gapIssues(parsed, 2)).toContain("Thiếu vị trí (2)______ trong đoạn văn.");
  });

  it("rejects repeated reading stems", () => {
    const input = {
      title: "A community library",
      body: "A local library introduced a weekend programme for teenagers. ".repeat(8),
      questions: [question, question, question, question],
    };
    expect(readingIssues(input)).toContain("Các câu đọc hiểu phải có stem khác nhau.");
  });

  it("keeps the AI paper at 40 questions with the required section counts", () => {
    expect(AI_EXAM_SECTIONS.reduce((sum, section) => sum + section.count, 0)).toBe(40);
    expect(Object.fromEntries(AI_EXAM_SECTIONS.map((section) => [section.questionType, section.count]))).toEqual({
      gap_short: 12,
      ordering: 5,
      gap_long: 5,
      reading: 18,
    });
    const totals = EXAM_GENERATION_STEPS.reduce<Record<string, number>>((counts, step) => {
      counts[step.kind] = (counts[step.kind] ?? 0) + step.count;
      return counts;
    }, {});
    expect(totals).toEqual({ gap_short: 12, ordering: 5, gap_long: 5, reading: 18 });
    expect(EXAM_GENERATION_STEPS.map((step) => step.count)).toEqual([6, 5, 5, 10, 6, 8]);
    expect(EXAM_GENERATION_STEPS[0]?.instruction).toContain("leaflet");
    expect(EXAM_GENERATION_STEPS.map((_, index) => examPageStart(index))).toEqual([1, 7, 12, 17, 27, 33]);
  });

  it("tells review generation not to copy the old stem", () => {
    const prompt = buildMixedQuestionsPrompt({
      count: 5,
      topics: [{ slug: "articles", name: "Articles", context: "a, an, the" }],
      reviewNotes: ["She bought a umbrella. — Dùng an trước âm nguyên âm."],
    });
    expect(prompt).toContain("không chép stem");
    expect(prompt).toContain("She bought a umbrella.");
  });

  it("provides valid fake responses for every new bundle type", async () => {
    const provider = new MockProvider();
    const request = async (operation: string, prompt: string) => JSON.parse((await provider.generateText({
      operation,
      prompt,
      promptVersion: "test",
    })).text);
    expect(generatedReadingSchema.parse(await request("reading-generation", "tạo đúng 4 câu đọc hiểu")).questions).toHaveLength(4);
    expect(generatedOrderingSchema.parse(await request("ordering-generation", "Tạo đúng 5 bài")).items).toHaveLength(5);
    expect(generatedGapSchema.parse(await request("gap_short-generation", "có đúng 6 chỗ trống, prefix \"AI 1 (n)\"")).questions).toHaveLength(6);
    expect(generatedTopicBatchSchema.parse(await request("diagnostic-question-generation", "Tạo 4 câu")).questions).toHaveLength(4);
  });
});
