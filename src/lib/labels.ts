import type { MasteryLevel } from "@/modules/learning/mastery";

export const levelLabel: Record<MasteryLevel, string> = {
  weak: "Yếu",
  learning: "Đang học",
  solid: "Vững",
};

export const difficultyLabel = {
  easy: "Dễ",
  medium: "Vừa",
  hard: "Khó",
} as const;

export function resultLine(correct: number, attempts: number) {
  if (attempts === 0) return "Chưa làm";
  return `${correct}/${attempts} đúng`;
}
