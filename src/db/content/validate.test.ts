import { describe, expect, it } from "vitest";
import type { TopicSeed } from "./types";
import { validateCurriculum } from "./validate";

function topic(questionCount: number): TopicSeed {
  return {
    id: "topic-test",
    slug: "test",
    name: "Test",
    gradeFrom: 6,
    gradeTo: 12,
    summary: "Test",
    purpose: "Test",
    usage: "Test",
    structure: "Test",
    affirmativePattern: "Test",
    negativePattern: "Test",
    questionPattern: "Test",
    signalWords: ["one", "two", "three", "four"],
    examples: [
      { sentence: "One.", note: "One." },
      { sentence: "Two.", note: "Two." },
      { sentence: "Three.", note: "Three." },
    ],
    commonMistakes: [
      { wrong: "One", right: "One.", why: "One." },
      { wrong: "Two", right: "Two.", why: "Two." },
      { wrong: "Three", right: "Three.", why: "Three." },
    ],
    comparisons: [{ with: "Other", note: "Other." }],
    prerequisiteSlugs: [],
    questions: Array.from({ length: questionCount }, (_, index) => ({
      id: `q-${index}`,
      difficulty:
        index % 3 === 0 ? "easy" : index % 3 === 1 ? "medium" : "hard",
      stem: `Unique stem ${index}`,
      options: [
        { id: "a", text: "A" },
        { id: "b", text: "B" },
        { id: "c", text: "C" },
        { id: "d", text: "D" },
      ],
      correctAnswer: "a",
      explanation: "A is correct.",
      wrongAnswerExplanations: [
        { optionId: "b", explanation: "B is wrong." },
        { optionId: "c", explanation: "C is wrong." },
        { optionId: "d", explanation: "D is wrong." },
      ],
    })),
  };
}

describe("validateCurriculum", () => {
  it("accepts 12 balanced questions", () => {
    expect(validateCurriculum([topic(12)])).toEqual([]);
  });

  it("reports a topic with missing questions", () => {
    expect(validateCurriculum([topic(11)])).toContain(
      "test cần 12 câu, đang có 11.",
    );
  });
});
