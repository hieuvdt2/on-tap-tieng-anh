import { describe, expect, it } from "vitest";
import { optionTerms, toRichPieces } from "./rich-text";

const options = [
  { id: "a", text: "most" },
  { id: "b", text: "more" },
  { id: "c", text: "much" },
  { id: "d", text: "the most" },
];

describe("toRichPieces", () => {
  it("highlights quoted English words", () => {
    const pieces = toRichPieces("“interesting” là tính từ dài.");
    expect(pieces[0]).toEqual({ text: "interesting", tone: "term" });
  });

  it("prefers the longer option and keeps tones", () => {
    const terms = optionTerms({ options, correctAnswer: "b", selectedAnswer: "a" });
    const marked = toRichPieces("the most khác most và more.", terms).filter((piece) => piece.tone);
    expect(marked.map((piece) => [piece.text, piece.tone])).toEqual([
      ["the most", "term"],
      ["most", "wrong"],
      ["more", "correct"],
    ]);
  });

  it("does not match inside a longer word", () => {
    const terms = optionTerms({ options, correctAnswer: "b" });
    expect(toRichPieces("moreover", terms).every((piece) => piece.tone === null)).toBe(true);
  });
});
