import { AI_EXAM_SOURCE } from "@/modules/ai/generator-spec";

type SpecLike = { id: string; yearLabel: string; source: string };

export const OFFICIAL_2026_ID = "exam-2026-1116";

export function isOfficialExam(spec: { source: string }) {
  return spec.source.startsWith("Đề thi chính thức");
}

// Mọi nơi hiện tên đề đều dùng hàm này. Trước đây mỗi trang tự đặt tên và mọi đề cố định không phải
// Mã đề B đều bị gọi nhầm là "Mã đề A".
export function examTitle(spec: SpecLike) {
  if (spec.source === AI_EXAM_SOURCE) return "Đề AI trong app";
  if (spec.id === OFFICIAL_2026_ID) return "Đề thi chính thức 2026 · Mã đề 1116";
  if (spec.id === "exam-form-a") return "Mã đề A";
  if (spec.id === "exam-form-b") return "Mã đề B";
  if (spec.yearLabel === "practice") return "Đề luyện trong app";
  return `Khung ${spec.yearLabel}`;
}
