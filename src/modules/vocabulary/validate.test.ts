import { describe, expect, it } from "vitest";
import { headwordKey, wordIssues } from "./validate";

const good = {
  word: "renewable",
  wordClass: "adj",
  meaningVi: "có thể tái tạo",
  example: "Solar power is a renewable source of energy.",
};

describe("wordIssues", () => {
  it("accepts a well-formed word", () => {
    expect(wordIssues(good)).toEqual([]);
    expect(wordIssues({ ...good, word: "carbon footprint", meaningVi: "lượng khí thải các-bon" })).toEqual([]);
  });

  it("rejects an English meaning and a Vietnamese example", () => {
    expect(wordIssues({ ...good, meaningVi: "able to be renewed" })).toContain("nghĩa phải viết bằng tiếng Việt");
    expect(wordIssues({ ...good, example: "Năng lượng mặt trời là nguồn tái tạo tốt." })).toContain(
      "câu ví dụ phải là một câu tiếng Anh",
    );
  });

  it("rejects bad headwords", () => {
    expect(wordIssues({ ...good, word: "tái tạo" }).length).toBeGreaterThan(0);
    expect(wordIssues({ ...good, word: "a very long phrase with many words" }).length).toBeGreaterThan(0);
    expect(wordIssues({ ...good, word: "word123" }).length).toBeGreaterThan(0);
  });

  it("normalises the dedupe key", () => {
    expect(headwordKey("  Carbon   Footprint ")).toBe("carbon footprint");
  });
});
