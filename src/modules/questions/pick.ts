export type PickableQuestion = {
  id: string;
  status: string;
  topicId: string;
  provenance?: string;
};

function shuffle<T>(items: readonly T[], random: () => number) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    const current = copy[index];
    copy[index] = copy[swapIndex];
    copy[swapIndex] = current;
  }
  return copy;
}

export function pickQuestions<T extends PickableQuestion>(input: {
  questions: readonly T[];
  count: number;
  topicId?: string;
  random?: () => number;
}) {
  if (input.count <= 0) return [];

  const seen = new Set<string>();
  const pool: T[] = [];

  for (const question of input.questions) {
    if (question.status !== "published") continue;
    if (input.topicId && question.topicId !== input.topicId) continue;
    if (seen.has(question.id)) continue;
    seen.add(question.id);
    pool.push(question);
  }

  return shuffle(pool, input.random ?? Math.random).slice(0, input.count);
}

export function mixPracticeQuestions<T extends PickableQuestion>(input: {
  freshIds: readonly string[];
  questions: readonly T[];
  count: number;
  topicId?: string;
  random?: () => number;
}) {
  const freshIds = new Set(input.freshIds);
  const fresh = input.questions.filter((question) => freshIds.has(question.id));
  const older = input.questions.filter((question) => !freshIds.has(question.id));
  const room = Math.max(0, input.count - fresh.length);
  const saved = pickQuestions({
    questions: older.filter((question) => question.provenance === "ai_generated"),
    count: room,
    topicId: input.topicId,
    random: input.random,
  });
  const original = pickQuestions({
    questions: older.filter((question) => question.provenance !== "ai_generated"),
    count: room - saved.length,
    topicId: input.topicId,
    random: input.random,
  });

  return pickQuestions({
    questions: [...fresh, ...saved, ...original],
    count: input.count,
    topicId: input.topicId,
    random: input.random,
  });
}
