import { levelFor, type MasteryLevel } from "./mastery";

export type RankedTopic = {
  order: number;
  attempts: number;
  level: MasteryLevel | null;
  score: number | null;
};

function rank(topic: RankedTopic) {
  if (topic.level === "weak") return 0;
  if (topic.level === null) return 1;
  if (topic.level === "learning") return 2;
  return 3;
}

export function focusTopics<T extends RankedTopic>(topics: readonly T[], limit = 3) {
  return [...topics]
    .sort((left, right) => {
      const byNeed = rank(left) - rank(right);
      if (byNeed !== 0) return byNeed;
      if (left.level === "weak" && right.level === "weak") {
        return (left.score ?? 1) - (right.score ?? 1) || left.order - right.order;
      }
      return left.order - right.order;
    })
    .slice(0, limit);
}

export function pickWeakTopic<T extends RankedTopic>(topics: readonly T[]) {
  if (topics.length === 0) return null;
  const weak = topics.filter((topic) => topic.level === "weak");
  if (weak.length > 0) {
    return [...weak].sort(
      (left, right) => (left.score ?? 1) - (right.score ?? 1) || left.order - right.order,
    )[0] ?? null;
  }
  return [...topics].sort(
    (left, right) => left.attempts - right.attempts || left.order - right.order,
  )[0] ?? null;
}

export function topicToStudyFirst<T extends RankedTopic & { gradeFrom: number }>(topics: readonly T[]) {
  if (topics.length === 0) return null;
  const weak = topics.filter((topic) => topic.level === "weak");
  const pool = weak.length > 0 ? weak : topics;
  return [...pool].sort(
    (left, right) => left.gradeFrom - right.gradeFrom || left.order - right.order,
  )[0] ?? null;
}

export function overallLevel(topics: readonly RankedTopic[]) {
  const practiced = topics.filter((topic) => topic.attempts > 0 && topic.score !== null);
  if (practiced.length === 0) return null;
  const average = practiced.reduce((sum, topic) => sum + (topic.score ?? 0), 0) / practiced.length;
  return levelFor(average);
}
