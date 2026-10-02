export type MasteryLevel = "weak" | "learning" | "solid";

export type MasteryAttempt = {
  isCorrect: boolean;
  difficulty: "easy" | "medium" | "hard";
};

export const MASTERY_WEIGHTS = {
  recent: 0.4,
  historical: 0.25,
  difficulty: 0.2,
  consistency: 0.15,
} as const;

export const LEVEL_THRESHOLDS = {
  learning: 0.45,
  solid: 0.75,
} as const;

export function levelFor(score: number): MasteryLevel {
  if (score < LEVEL_THRESHOLDS.learning) return "weak";
  if (score < LEVEL_THRESHOLDS.solid) return "learning";
  return "solid";
}

function accuracy(attempts: readonly MasteryAttempt[]) {
  if (attempts.length === 0) return 0;
  const correct = attempts.filter((attempt) => attempt.isCorrect).length;
  return correct / attempts.length;
}

function difficultyPerformance(attempts: readonly MasteryAttempt[]) {
  const weighted = attempts.filter((attempt) => attempt.difficulty !== "easy");
  if (weighted.length === 0) return accuracy(attempts);

  let points = 0;
  let weight = 0;
  for (const attempt of weighted) {
    const attemptWeight = attempt.difficulty === "hard" ? 1.25 : 1;
    weight += attemptWeight;
    if (attempt.isCorrect) points += attemptWeight;
  }
  return weight === 0 ? 0 : points / weight;
}

function consistency(attempts: readonly MasteryAttempt[]) {
  if (attempts.length < 2) return 1;
  let alternations = 0;
  for (let index = 1; index < attempts.length; index += 1) {
    if (attempts[index]?.isCorrect !== attempts[index - 1]?.isCorrect) {
      alternations += 1;
    }
  }
  return 1 - alternations / (attempts.length - 1);
}

export function computeMastery(attempts: readonly MasteryAttempt[]) {
  if (attempts.length === 0) {
    return { score: 0, level: "weak" as const };
  }

  const recent = attempts.slice(-5);
  const score =
    accuracy(recent) * MASTERY_WEIGHTS.recent +
    accuracy(attempts) * MASTERY_WEIGHTS.historical +
    difficultyPerformance(attempts) * MASTERY_WEIGHTS.difficulty +
    consistency(attempts) * MASTERY_WEIGHTS.consistency;

  const clamped = Math.min(1, Math.max(0, score));
  return { score: clamped, level: levelFor(clamped) };
}
