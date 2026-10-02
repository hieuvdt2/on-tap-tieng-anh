import { describe, expect, it } from "vitest";
import { levelQuotas, mixByLevel } from "./mix";

function bank(level: "weak" | "learning" | "solid", count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: `${level}-${index}`,
    status: "published",
    topicId: level,
  }));
}

const topics = [
  { id: "weak", level: "weak" as const },
  { id: "learning", level: "learning" as const },
  { id: "solid", level: "solid" as const },
];

function counts(questions: { topicId: string }[]) {
  return {
    weak: questions.filter((question) => question.topicId === "weak").length,
    learning: questions.filter((question) => question.topicId === "learning").length,
    solid: questions.filter((question) => question.topicId === "solid").length,
  };
}

describe("levelQuotas", () => {
  it("splits 10 questions into 6 weak, 3 learning, and 1 solid", () => {
    expect(levelQuotas(10)).toEqual({ weak: 6, learning: 3, solid: 1 });
  });

  it("splits 20 questions into 12 weak, 5 learning, and 3 solid", () => {
    expect(levelQuotas(20)).toEqual({ weak: 12, learning: 5, solid: 3 });
  });
});

describe("mixByLevel", () => {
  it("keeps the ratio when every group has questions", () => {
    const picked = mixByLevel({
      questions: [...bank("weak", 24), ...bank("learning", 24), ...bank("solid", 24)],
      topics,
      count: 20,
      random: () => 0,
    });
    expect(picked).toHaveLength(20);
    expect(counts(picked)).toEqual({ weak: 12, learning: 5, solid: 3 });
    expect(new Set(picked.map((question) => question.id)).size).toBe(20);
  });

  it("gives a missing solid share to learning", () => {
    const picked = mixByLevel({
      questions: [...bank("weak", 12), ...bank("learning", 12)],
      topics,
      count: 10,
      random: () => 0,
    });
    expect(counts(picked)).toEqual({ weak: 6, learning: 4, solid: 0 });
  });

  it("gives a missing learning share to weak", () => {
    const picked = mixByLevel({
      questions: [...bank("weak", 12), ...bank("solid", 12)],
      topics,
      count: 10,
      random: () => 0,
    });
    expect(counts(picked)).toEqual({ weak: 9, learning: 0, solid: 1 });
  });

  it("fills from the other groups when weak has no questions", () => {
    const picked = mixByLevel({
      questions: [...bank("learning", 12), ...bank("solid", 12)],
      topics,
      count: 10,
      random: () => 0,
    });
    expect(picked).toHaveLength(10);
    expect(counts(picked).weak).toBe(0);
    expect(counts(picked).learning + counts(picked).solid).toBe(10);
  });
});
