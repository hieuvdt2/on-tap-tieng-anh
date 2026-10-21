export type ExamBlockQuestion = {
  id: string;
  type: string;
  stimulusId: string | null;
  stimulusTitle: string | null;
  stimulusBody: string | null;
  stimulusKind?: string | null;
};

export type ExamBlock<T extends ExamBlockQuestion> =
  | { kind: "ordering"; question: T }
  | { kind: "stimulus"; key: string; title: string; body: string; stimulusKind: string | null; items: T[] };

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
      stimulusKind: question.stimulusKind ?? null,
      items: [question],
    });
  }
  return blocks;
}
