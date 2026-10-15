import { describe, expect, it } from "vitest";
import { firstWords, matchedPositions, splitOrder } from "./ordering";

describe("ordering helpers", () => {
  it("splits an order string and ignores blanks", () => {
    expect(splitOrder("d, c,b,,a")).toEqual(["d", "c", "b", "a"]);
    expect(splitOrder("")).toEqual([]);
    expect(splitOrder(null)).toEqual([]);
  });

  it("counts positions placed correctly", () => {
    expect(matchedPositions("d,c,b,a,e", "d,c,b,a,e")).toBe(5);
    expect(matchedPositions("a,b,c,d,e", "d,c,b,a,e")).toBe(1);
    expect(matchedPositions("a,c,b", "a,c,b")).toBe(3);
    expect(matchedPositions("", "a,c,b")).toBe(0);
    expect(matchedPositions(undefined, "a,c,b")).toBe(0);
  });

  it("shortens long sentences to their first words", () => {
    const sentence = "Inhabitants of coastal regions housing large-scale facilities have reported that the low hum impairs sleep.";
    expect(firstWords(sentence)).toBe("Inhabitants of coastal regions housing large-scale facilities have reported…");
    expect(firstWords(sentence, 3)).toBe("Inhabitants of coastal…");
    expect(firstWords("Thank you.")).toBe("Thank you.");
  });
});
