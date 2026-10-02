export type ExamQuestion = {
  id: string;
  section: string;
  status: string;
};

export function assembleExam<T extends ExamQuestion>(input: {
  questions: readonly T[];
  sections: readonly { questionType: string; count: number }[];
  random?: () => number;
}) {
  const random = input.random ?? Math.random;
  const used = new Set<string>();
  const picked: T[] = [];

  for (const section of input.sections) {
    const pool = input.questions.filter(
      (question) =>
        question.status === "published" &&
        question.section === section.questionType &&
        !used.has(question.id),
    );
    const copy = [...pool];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(random() * (index + 1));
      const current = copy[index];
      copy[index] = copy[swapIndex] as T;
      copy[swapIndex] = current as T;
    }
    const chosen = copy.slice(0, section.count);
    if (chosen.length < section.count) return null;
    for (const question of chosen) used.add(question.id);
    picked.push(...chosen);
  }

  return picked;
}

export function pickSpread<T extends { id: string; topicId: string; status: string }>(input: {
  questions: readonly T[];
  count: number;
  random?: () => number;
}) {
  const random = input.random ?? Math.random;
  const published = input.questions.filter((question) => question.status === "published");
  const byTopic = new Map<string, T[]>();
  for (const question of published) {
    const list = byTopic.get(question.topicId) ?? [];
    list.push(question);
    byTopic.set(question.topicId, list);
  }

  const topicIds = [...byTopic.keys()];
  const used = new Set<string>();
  const picked: T[] = [];
  let moved = true;
  while (picked.length < input.count && moved) {
    moved = false;
    for (const topicId of topicIds) {
      if (picked.length >= input.count) break;
      const pool = (byTopic.get(topicId) ?? []).filter((question) => !used.has(question.id));
      if (pool.length === 0) continue;
      const choice = pool[Math.floor(random() * pool.length)];
      if (!choice) continue;
      used.add(choice.id);
      picked.push(choice);
      moved = true;
    }
  }
  return picked;
}
