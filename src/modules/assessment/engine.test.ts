import { describe, expect, it } from "vitest";
import {
  estimateTheta,
  levelFromScore,
  pickNext,
  probabilityCorrect,
  scoreFromTheta,
  SKILL_QUOTA,
  summarise,
  type AnsweredItem,
  type Candidate,
  type Skill,
} from "./engine";

describe("assessment engine", () => {
  it("has a probability that rises with ability and never falls below the guess rate", () => {
    expect(probabilityCorrect(1, 3)).toBeLessThan(probabilityCorrect(3, 3));
    expect(probabilityCorrect(3, 3)).toBeLessThan(probabilityCorrect(5, 3));
    expect(probabilityCorrect(-5, 3)).toBeGreaterThan(0.25);
  });

  it("estimates a higher ability from better results", () => {
    const low = estimateTheta([1, 2, 3, 4].map((difficulty) => ({ difficulty, correct: difficulty <= 1 })));
    const high = estimateTheta([1, 2, 3, 4, 5, 6].map((difficulty) => ({ difficulty, correct: difficulty <= 5 })));
    expect(high.theta).toBeGreaterThan(low.theta);
    expect(high.theta).toBeGreaterThan(4);
    expect(low.theta).toBeLessThan(2.5);
  });

  it("narrows the uncertainty as more answers arrive", () => {
    const few = estimateTheta([{ difficulty: 3, correct: true }]);
    const many = estimateTheta(Array.from({ length: 24 }, (_, i) => ({ difficulty: 2 + (i % 3), correct: i % 3 !== 2 })));
    expect(many.se).toBeLessThan(few.se);
  });

  it("maps score to CEFR in hundreds", () => {
    expect(scoreFromTheta(0.5)).toBe(0);
    expect(scoreFromTheta(3)).toBe(250);
    expect(scoreFromTheta(99)).toBe(599);
    expect(levelFromScore(0)).toBe("A1");
    expect(levelFromScore(99)).toBe("A1");
    expect(levelFromScore(250)).toBe("B1");
    expect(levelFromScore(599)).toBe("C2");
  });

  it("picks the skill that is furthest behind, then the item nearest the ability", () => {
    const candidates: Candidate[] = [];
    for (const skill of ["grammar", "vocabulary", "reading", "listening"] as Skill[]) {
      for (const level of ["A1", "A2", "B1", "B2", "C1", "C2"] as const) candidates.push({ id: `${skill}-${level}`, skill, level });
    }
    const counts = { grammar: 8, vocabulary: 7, reading: 7, listening: 0 };
    const next = pickNext(candidates, new Set(), counts, 4, () => 0);
    expect(next?.skill).toBe("listening");
    expect(["B1", "B2"]).toContain(next?.level);
    expect(pickNext(candidates, new Set(candidates.map((c) => c.id)), counts, 4)).toBeNull();
    expect(pickNext(candidates, new Set(), { ...SKILL_QUOTA }, 4)).toBeNull();
  });

  it("summarises an overall level and per-skill breakdown", () => {
    const items: AnsweredItem[] = [];
    for (const skill of ["grammar", "vocabulary", "reading", "listening"] as Skill[]) {
      for (const level of ["A2", "B1", "B2", "C1"] as const) items.push({ skill, level, correct: level !== "C1" });
    }
    const result = summarise(items);
    expect(result.answered).toBe(16);
    expect(result.correct).toBe(12);
    expect(["B1", "B2"]).toContain(result.level);
    expect(result.skills).toHaveLength(4);
    expect(result.skills[0].level).not.toBeNull();
    expect(result.margin).toBeGreaterThanOrEqual(10);
  });
});
