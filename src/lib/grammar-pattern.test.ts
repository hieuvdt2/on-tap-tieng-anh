import { describe, expect, it } from "vitest";
import { patternHasVerbS, tokenizePattern } from "./grammar-pattern";

describe("tokenizePattern", () => {
  it("colors the subject and both verb forms without splitting V-s", () => {
    const pieces = tokenizePattern("Chủ ngữ + V / V-s.");
    expect(pieces.filter((piece) => piece.term).map((piece) => piece.term?.key)).toEqual([
      "chủ ngữ",
      "v",
      "v-s",
    ]);
  });

  it("keeps do/does and not as separate roles", () => {
    const pieces = tokenizePattern("Chủ ngữ + do/does not + V.");
    expect(pieces.filter((piece) => piece.term).map((piece) => [piece.term?.role, piece.term?.key])).toEqual([
      ["subject", "chủ ngữ"],
      ["helper", "do/does"],
      ["negation", "not"],
      ["verb", "v"],
    ]);
  });

  it("colors both verbs in V/V-s", () => {
    const pieces = tokenizePattern("If + chủ ngữ + V/V-s, chủ ngữ + will + V.");
    expect(pieces.filter((piece) => piece.term).map((piece) => piece.term?.key)).toEqual([
      "if",
      "chủ ngữ",
      "v",
      "v-s",
      "chủ ngữ",
      "will",
      "v",
    ]);
  });

  it("colors a lone Do and have to", () => {
    const pieces = tokenizePattern("Do + chủ ngữ + have to + V?");
    expect(pieces.filter((piece) => piece.term).map((piece) => piece.term?.key)).toEqual([
      "do",
      "chủ ngữ",
      "have to",
      "v",
    ]);
  });

  it("detects when the -s rule should be shown", () => {
    expect(patternHasVerbS(["Chủ ngữ + V / V-s."])).toBe(true);
    expect(patternHasVerbS(["Did + chủ ngữ + V?"])).toBe(false);
  });
});
