import { describe, expect, it } from "vitest";
import { MockProvider } from "./mock-provider";
import { getAIProvider } from "./provider";
import { acceptQuestions, generatedBatchSchema, questionIssues, type GeneratedQuestion } from "./questions";
import { StructuredOutputError, parseWithRepair } from "./structured";

const valid: GeneratedQuestion = {
  stem: "She ____ in this city since 2019.",
  options: [
    { id: "a", text: "has lived" },
    { id: "b", text: "lived" },
    { id: "c", text: "is living" },
    { id: "d", text: "lives" },
  ],
  correctAnswer: "a",
  explanation: "since 2019 là mốc kéo dài tới hiện tại, nên dùng hiện tại hoàn thành.",
  wrongAnswerExplanations: [
    { optionId: "b", explanation: "lived là quá khứ đơn, dùng khi mốc đã khép, không đi với since." },
    { optionId: "c", explanation: "is living nói việc đang xảy ra lúc nói, không nói khoảng từ 2019 tới nay." },
    { optionId: "d", explanation: "lives là hiện tại đơn, không diễn tả khoảng thời gian bắt đầu trong quá khứ." },
  ],
  difficulty: "medium",
};

describe("parseWithRepair", () => {
  it("repairs invalid JSON once", async () => {
    const replies = ["không phải json", JSON.stringify({ questions: [valid] })];
    const parsed = await parseWithRepair({
      schema: generatedBatchSchema,
      prompt: "Sinh câu",
      request: async () => replies.shift() ?? "",
    });
    expect(parsed.questions).toHaveLength(1);
  });

  it("stops after two invalid replies", async () => {
    await expect(parseWithRepair({
      schema: generatedBatchSchema,
      prompt: "Sinh câu",
      request: async () => "vẫn hỏng",
    })).rejects.toBeInstanceOf(StructuredOutputError);
  });
});

describe("acceptQuestions", () => {
  it("rejects two answers that say the same thing", () => {
    const duplicated = {
      ...valid,
      options: valid.options.map((option) => option.id === "b" ? { ...option, text: "has lived" } : option),
    };
    expect(questionIssues(duplicated).length).toBeGreaterThan(0);
    expect(acceptQuestions([duplicated], new Set())).toEqual([]);
  });

  it("skips a stem that already exists", () => {
    const hash = acceptQuestions([valid], new Set())[0]?.contentHash;
    expect(hash).toBeTruthy();
    expect(acceptQuestions([valid], new Set([hash!]))).toEqual([]);
  });
});

describe("getAIProvider", () => {
  it("does not call Gemini when the key is missing", () => {
    const previousProvider = process.env.AI_PROVIDER;
    const previousKey = process.env.GEMINI_API_KEY;
    process.env.AI_PROVIDER = "gemini";
    delete process.env.GEMINI_API_KEY;
    expect(getAIProvider()).toBeNull();
    if (previousProvider === undefined) delete process.env.AI_PROVIDER;
    else process.env.AI_PROVIDER = previousProvider;
    if (previousKey !== undefined) process.env.GEMINI_API_KEY = previousKey;
  });
});

describe("MockProvider", () => {
  it("returns a published-ready Present Perfect question", async () => {
    const output = await new MockProvider().generateText({
      prompt: "Chủ đề: Present Perfect",
      operation: "question-generation",
      promptVersion: "question-generation-v1",
    });
    const batch = generatedBatchSchema.parse(JSON.parse(output.text));
    expect(batch.questions[0]?.stem).toContain("since 2019");
    expect(questionIssues(batch.questions[0]!)).toEqual([]);
  });
});
