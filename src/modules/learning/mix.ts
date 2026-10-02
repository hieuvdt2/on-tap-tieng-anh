import type { MasteryLevel } from "./mastery";
import { pickQuestions, type PickableQuestion } from "@/modules/questions/pick";

export const MIX_WEIGHTS = {
  weak: 0.6,
  learning: 0.25,
  solid: 0.15,
} as const;

const levels = ["weak", "learning", "solid"] as const;

export function levelQuotas(count: number) {
  const raw = levels.map((level) => MIX_WEIGHTS[level] * count);
  const quotas = raw.map((value) => Math.floor(value));
  let left = count - quotas.reduce((sum, value) => sum + value, 0);
  const remainders = raw
    .map((value, index) => ({ index, remainder: value - Math.floor(value) }))
    .sort((leftItem, rightItem) => rightItem.remainder - leftItem.remainder || leftItem.index - rightItem.index);

  for (const item of remainders) {
    if (left <= 0) break;
    quotas[item.index] = (quotas[item.index] ?? 0) + 1;
    left -= 1;
  }

  return {
    weak: quotas[0] ?? 0,
    learning: quotas[1] ?? 0,
    solid: quotas[2] ?? 0,
  };
}

export function mixByLevel<T extends PickableQuestion>(input: {
  questions: readonly T[];
  topics: readonly { id: string; level: MasteryLevel | null }[];
  count: number;
  freshIds?: readonly string[];
  random?: () => number;
}) {
  const random = input.random ?? Math.random;
  const levelByTopic = new Map(input.topics.map((topic) => [topic.id, topic.level]));
  const quotas = levelQuotas(input.count);
  const freshIds = new Set(input.freshIds ?? []);
  const used = new Set<string>();
  const picked: T[] = [];

  function take(level: MasteryLevel, need: number) {
    if (need <= 0) return [];
    const available = input.questions.filter(
      (question) =>
        question.status === "published" &&
        levelByTopic.get(question.topicId) === level &&
        !used.has(question.id),
    );
    const fresh = pickQuestions({
      questions: available.filter((question) => freshIds.has(question.id)),
      count: need,
      random,
    });
    const saved = pickQuestions({
      questions: available.filter(
        (question) => !freshIds.has(question.id) && question.provenance === "ai_generated",
      ),
      count: need - fresh.length,
      random,
    });
    const original = pickQuestions({
      questions: available.filter(
        (question) => !freshIds.has(question.id) && question.provenance !== "ai_generated",
      ),
      count: need - fresh.length - saved.length,
      random,
    });
    const chosen = [...fresh, ...saved, ...original];
    for (const question of chosen) used.add(question.id);
    return chosen;
  }

  let carry = 0;
  for (const level of ["solid", "learning", "weak"] as const) {
    const need = quotas[level] + carry;
    const chosen = take(level, need);
    picked.push(...chosen);
    carry = need - chosen.length;
  }

  for (const level of ["learning", "solid"] as const) {
    if (carry <= 0) break;
    const chosen = take(level, carry);
    picked.push(...chosen);
    carry -= chosen.length;
  }

  return pickQuestions({ questions: picked, count: picked.length, random });
}
