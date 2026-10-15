import { describe, expect, it } from "vitest";
import { examTitle, isOfficialExam } from "./labels";

const spec = (id: string, yearLabel: string, source: string) => ({ id, yearLabel, source });

describe("examTitle", () => {
  it("names every known paper distinctly", () => {
    expect(examTitle(spec("exam-form-a", "form-a", "Đề soạn trong app"))).toBe("Mã đề A");
    expect(examTitle(spec("exam-form-b", "form-b", "Đề soạn trong app"))).toBe("Mã đề B");
    expect(examTitle(spec("exam-2026-1116", "2026-1116", "Đề thi chính thức TN THPT 2026 của Bộ Giáo dục và Đào tạo"))).toBe(
      "Đề thi chính thức 2026 · Mã đề 1116",
    );
    expect(examTitle(spec("x", "AI", "Đề AI trong app"))).toBe("Đề AI trong app");
    expect(examTitle(spec("exam-practice-1", "practice", "Đề luyện trong app"))).toBe("Đề luyện trong app");
    expect(examTitle(spec("exam-2025-v1", "2025+", "Quyết định 764/QĐ-BGDĐT"))).toBe("Khung 2025+");
  });

  it("does not call an unknown fixed paper Mã đề A", () => {
    expect(examTitle(spec("exam-form-z", "form-z", "Đề soạn trong app"))).toBe("Khung form-z");
  });

  it("recognises official papers by source", () => {
    expect(isOfficialExam({ source: "Đề thi chính thức TN THPT 2026 của Bộ Giáo dục và Đào tạo" })).toBe(true);
    expect(isOfficialExam({ source: "Đề soạn trong app" })).toBe(false);
  });
});
