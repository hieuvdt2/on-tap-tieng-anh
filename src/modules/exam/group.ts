export type ExamBlockQuestion = {
  id: string;
  type: string;
  stimulusId: string | null;
  stimulusTitle: string | null;
  stimulusBody: string | null;
};

export type ExamBlock<T extends ExamBlockQuestion> =
  | { kind: "ordering"; question: T }
  | { kind: "stimulus"; key: string; title: string; body: string; items: T[] };

export function groupExamBlocks<T extends ExamBlockQuestion>(questions: readonly T[]): ExamBlock<T>[] {
  const blocks: ExamBlock<T>[] = [];
  for (const question of questions) {
    if (question.type === "ordering") {
      blocks.push({ kind: "ordering", question });
      continue;
    }
    const key = question.stimulusId;
    const last = blocks[blocks.length - 1];
    if (last?.kind === "stimulus" && last.key === key) {
      last.items.push(question);
      continue;
    }
    if (!key || !question.stimulusBody) continue;
    blocks.push({
      kind: "stimulus",
      key,
      title: question.stimulusTitle ?? "Đoạn đề",
      body: question.stimulusBody,
      items: [question],
    });
  }
  return blocks;
}

export function blocksForQuestions<T extends ExamBlockQuestion>(blocks: readonly ExamBlock<T>[], ids: ReadonlySet<string>) {
  const selected: ExamBlock<T>[] = [];
  for (const block of blocks) {
    if (block.kind === "ordering") {
      if (ids.has(block.question.id)) selected.push(block);
      continue;
    }
    const items = block.items.filter((item) => ids.has(item.id));
    if (items.length > 0) selected.push({ ...block, items });
  }
  return selected;
}
