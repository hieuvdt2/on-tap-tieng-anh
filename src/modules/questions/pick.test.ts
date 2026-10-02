import { describe, expect, it } from "vitest";
import { mixPracticeQuestions, pickQuestions } from "./pick";

const questions = [
  { id: "a", status: "published", topicId: "present" },
  { id: "a", status: "published", topicId: "present" },
  { id: "b", status: "draft", topicId: "present" },
  { id: "c", status: "archived", topicId: "present" },
  { id: "d", status: "published", topicId: "past" },
  { id: "e", status: "published", topicId: "present" },
];

describe("pickQuestions", () => {
  it("keeps published questions and drops duplicates", () => {
    const picked = pickQuestions({
      questions,
      count: 10,
      random: () => 0,
    });

    expect(picked.map((question) => question.id).sort()).toEqual(["a", "d", "e"]);
  });

  it("filters by topic and respects the count", () => {
    const picked = pickQuestions({
      questions,
      count: 1,
      topicId: "present",
      random: () => 0,
    });

    expect(picked).toHaveLength(1);
    expect(["a", "e"]).toContain(picked[0]?.id);
    expect(picked.every((question) => question.status === "published")).toBe(true);
  });

  it("mixes new AI questions with ones saved earlier", () => {
    const mixed = mixPracticeQuestions({
      freshIds: ["new-1"],
      questions: [
        { id: "new-1", status: "published", topicId: "present", provenance: "ai_generated" },
        { id: "old-ai", status: "published", topicId: "present", provenance: "ai_generated" },
        { id: "bank", status: "published", topicId: "present", provenance: "original" },
        { id: "other", status: "published", topicId: "past", provenance: "ai_generated" },
      ],
      count: 3,
      topicId: "present",
      random: () => 0,
    });

    expect(mixed.map((question) => question.id).sort()).toEqual(["bank", "new-1", "old-ai"]);
  });

  it("returns nothing when the count is zero", () => {
    expect(pickQuestions({ questions, count: 0 })).toEqual([]);
  });
});
