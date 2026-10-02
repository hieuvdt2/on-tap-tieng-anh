import { describe, expect, it } from "vitest";
import { assembleExam, pickSpread } from "./assemble";

describe("assembleExam", () => {
  it("returns null when a section is short", () => {
    const result = assembleExam({
      questions: [
        { id: "r1", section: "reading", status: "published" },
        { id: "o1", section: "ordering", status: "published" },
      ],
      sections: [
        { questionType: "reading", count: 1 },
        { questionType: "ordering", count: 2 },
      ],
      random: () => 0,
    });
    expect(result).toBeNull();
  });

  it("takes the requested count from each section", () => {
    const result = assembleExam({
      questions: [
        { id: "r1", section: "reading", status: "published" },
        { id: "r2", section: "reading", status: "published" },
        { id: "o1", section: "ordering", status: "published" },
      ],
      sections: [
        { questionType: "reading", count: 1 },
        { questionType: "ordering", count: 1 },
      ],
      random: () => 0,
    });
    expect(result?.map((question) => question.section)).toEqual(["reading", "ordering"]);
    expect(result).toHaveLength(2);
  });
});

describe("pickSpread", () => {
  it("does not take every question from one topic first", () => {
    const questions = [
      { id: "a1", topicId: "a", status: "published" },
      { id: "a2", topicId: "a", status: "published" },
      { id: "b1", topicId: "b", status: "published" },
      { id: "c1", topicId: "c", status: "published" },
    ];
    const picked = pickSpread({ questions, count: 3, random: () => 0 });
    expect(new Set(picked.map((question) => question.topicId)).size).toBe(3);
  });
});
