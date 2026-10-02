import { describe, expect, it } from "vitest";
import { examScore, missingSections } from "./score";

describe("examScore", () => {
  it("adds 10 divided by the number of questions", () => {
    expect(examScore(6, 8)).toBe(7.5);
    expect(examScore(40, 40)).toBe(10);
    expect(examScore(0, 8)).toBe(0);
  });
});

describe("missingSections", () => {
  it("lists section types that do not have enough published questions", () => {
    const missing = missingSections(
      [
        { questionType: "reading", label: "Đọc hiểu", count: 4 },
        { questionType: "ordering", label: "Sắp xếp câu", count: 4 },
        { questionType: "gap_short", label: "Điền từ", count: 12 },
      ],
      [
        { questionType: "reading", available: 8 },
        { questionType: "ordering", available: 4 },
      ],
    );
    expect(missing.map((section) => section.questionType)).toEqual(["gap_short"]);
    expect(missing[0]?.available).toBe(0);
  });
});
