import { describe, expect, it } from "vitest";
import { balanceByDifficulty, difficultyQuotas, mixForLevel, sortByDifficulty } from "./difficulty";

const q = (id: string, difficulty: string) => ({ id, difficulty });

describe("difficulty", () => {
  it("splits a count into quotas that always sum to the count", () => {
    for (const level of ["weak", "learning", "solid", null] as const) {
      for (const count of [5, 10, 16, 20]) {
        const quotas = difficultyQuotas(count, mixForLevel(level));
        expect(quotas.easy + quotas.medium + quotas.hard).toBe(count);
      }
    }
    expect(difficultyQuotas(10, mixForLevel("solid"))).toEqual({ easy: 1, medium: 4, hard: 5 });
  });

  it("orders easy before medium before hard and keeps order inside a level", () => {
    const sorted = sortByDifficulty([q("a", "hard"), q("b", "easy"), q("c", "medium"), q("d", "easy")]);
    expect(sorted.map((item) => item.id)).toEqual(["b", "d", "c", "a"]);
  });

  it("balances toward the requested mix and ends easy to hard", () => {
    const pool = [
      ...["e1", "e2", "e3", "e4", "e5"].map((id) => q(id, "easy")),
      ...["m1", "m2", "m3", "m4", "m5"].map((id) => q(id, "medium")),
      ...["h1", "h2", "h3", "h4", "h5"].map((id) => q(id, "hard")),
    ];
    const picked = balanceByDifficulty(pool, 10, mixForLevel("solid"));
    expect(picked).toHaveLength(10);
    expect(picked.filter((item) => item.difficulty === "hard")).toHaveLength(5);
    expect(picked.map((item) => item.difficulty)).toEqual([...picked.map((item) => item.difficulty)].sort(
      (a, b) => ["easy", "medium", "hard"].indexOf(a) - ["easy", "medium", "hard"].indexOf(b),
    ));
  });

  it("fills the shortfall when a level has too few questions", () => {
    const pool = [q("e1", "easy"), q("m1", "medium"), q("m2", "medium"), q("m3", "medium"), q("m4", "medium")];
    const picked = balanceByDifficulty(pool, 4, mixForLevel("solid"));
    expect(picked).toHaveLength(4);
    expect(picked.some((item) => item.difficulty === "hard")).toBe(false);
  });

  it("returns fewer than count only when candidates run out", () => {
    expect(balanceByDifficulty([q("a", "easy")], 5, mixForLevel(null))).toHaveLength(1);
  });
});

describe("difficulty choice", () => {
  it("falls back to the level mix on auto and focuses on a chosen level", async () => {
    const { mixForChoice } = await import("./difficulty");
    expect(mixForChoice("auto", "weak")).toEqual(mixForLevel("weak"));
    expect(mixForChoice("hard", "weak").hard).toBeGreaterThan(0.5);
    expect(mixForChoice("easy", "solid").hard).toBe(0);
    for (const choice of ["easy", "medium", "hard"] as const) {
      const mix = mixForChoice(choice, null);
      expect(mix.easy + mix.medium + mix.hard).toBeCloseTo(1);
    }
  });
});
