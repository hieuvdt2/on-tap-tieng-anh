import { describe, expect, it } from "vitest";
import { computeMastery, levelFor } from "./mastery";

describe("levelFor", () => {
  it("uses the configured cutoffs", () => {
    expect(levelFor(0.449)).toBe("weak");
    expect(levelFor(0.45)).toBe("learning");
    expect(levelFor(0.749)).toBe("learning");
    expect(levelFor(0.75)).toBe("solid");
  });
});

describe("computeMastery", () => {
  it("returns weak when there are no attempts", () => {
    expect(computeMastery([])).toEqual({ score: 0, level: "weak" });
  });

  it("stays weak when every answer is wrong", () => {
    const result = computeMastery([
      { isCorrect: false, difficulty: "easy" },
      { isCorrect: false, difficulty: "medium" },
      { isCorrect: false, difficulty: "hard" },
    ]);
    expect(result.level).toBe("weak");
    expect(result.score).toBeCloseTo(0.15, 5);
  });

  it("weights recent accuracy, hard items, and alternating results", () => {
    const result = computeMastery([
      { isCorrect: true, difficulty: "easy" },
      { isCorrect: false, difficulty: "easy" },
      { isCorrect: true, difficulty: "hard" },
      { isCorrect: true, difficulty: "medium" },
    ]);

    expect(result.score).toBeCloseTo(0.7375, 5);
    expect(result.level).toBe("learning");
  });

  it("reaches solid after a consistent run of correct answers", () => {
    const result = computeMastery([
      { isCorrect: true, difficulty: "easy" },
      { isCorrect: true, difficulty: "medium" },
      { isCorrect: true, difficulty: "hard" },
    ]);
    expect(result.level).toBe("solid");
    expect(result.score).toBeCloseTo(1, 5);
  });
});
