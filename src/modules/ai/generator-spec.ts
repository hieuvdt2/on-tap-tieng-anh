export const AI_EXAM_SECTIONS = [
  { questionType: "gap_short", label: "Điền khuyết ngắn", count: 12 },
  { questionType: "ordering", label: "Sắp xếp", count: 5 },
  { questionType: "gap_long", label: "Điền khuyết dài", count: 5 },
  { questionType: "reading", label: "Đọc hiểu", count: 18 },
] as const;

export const EXAM_GENERATION_STEPS = [
  {
    kind: "gap_short",
    count: 6,
    sequenceStart: 1,
    format: "leaflet",
    instruction: "Read the following leaflet and mark the letter A, B, C or D on your answer sheet to indicate the option that best fits each of the numbered blanks from 1 to 6.",
  },
  {
    kind: "ordering",
    count: 5,
    instruction: "Mark the letter A, B, C or D on your answer sheet to indicate the correct arrangement of the sentences to make a meaningful paragraph, email or conversation in each of the following questions from 7 to 11.",
  },
  {
    kind: "gap_long",
    count: 5,
    sequenceStart: 12,
    format: "passage",
    instruction: "Read the following passage and mark the letter A, B, C or D on your answer sheet to indicate the option that best fits each of the numbered blanks from 12 to 16.",
  },
  {
    kind: "reading",
    count: 10,
    instruction: "Read the following passage and mark the letter A, B, C or D on your answer sheet to indicate the correct answer to each of the questions from 17 to 26.",
  },
  {
    kind: "gap_short",
    count: 6,
    sequenceStart: 27,
    format: "advertisement",
    instruction: "Read the following advertisement and mark the letter A, B, C or D on your answer sheet to indicate the option that best fits each of the numbered blanks from 27 to 32.",
  },
  {
    kind: "reading",
    count: 8,
    instruction: "Read the following passage and mark the letter A, B, C or D on your answer sheet to indicate the correct answer to each of the questions from 33 to 40.",
  },
] as const;

export function examPageStart(pageIndex: number) {
  return EXAM_GENERATION_STEPS.slice(0, pageIndex).reduce((sum, step) => sum + step.count, 0) + 1;
}
