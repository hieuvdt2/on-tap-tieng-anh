import type { ExamSection } from "@/db/schema";

export function examScore(correctCount: number, questionCount: number) {
  if (questionCount <= 0 || correctCount <= 0) return 0;
  return (correctCount * 10) / questionCount;
}

export function formatExamScore(score: number) {
  return score.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}

export type SectionStock = { questionType: string; available: number };

export function missingSections(sections: readonly ExamSection[], stock: readonly SectionStock[]) {
  const available = new Map(stock.map((item) => [item.questionType, item.available]));
  return sections
    .filter((section) => (available.get(section.questionType) ?? 0) < section.count)
    .map((section) => ({
      ...section,
      available: available.get(section.questionType) ?? 0,
    }));
}
