import { describe, expect, it } from "vitest";
import { checkTyped, hint, maskExample } from "./typing";

describe("typing", () => {
  it("ignores case, extra spaces and apostrophe style", () => {
    expect(checkTyped("  Run   OUT of ", "run out of")).toBe(true);
    expect(checkTyped("don’t", "don't")).toBe(true);
  });

  it("rejects different words and typos", () => {
    expect(checkTyped("drout", "drought")).toBe(false);
    expect(checkTyped("", "drought")).toBe(false);
  });

  it("builds a first-letter hint", () => {
    expect(hint("drought")).toBe("d______");
    expect(hint("run out of")).toBe("r__ ___ __");
    expect(hint("drought", 2)).toBe("dr_____");
  });

  it("masks the word and its inflections in the example", () => {
    expect(maskExample("Many students enrolled in the course.", "enrol")).toBe("Many students _____ in the course.");
    expect(maskExample("They run out of water.", "run out of")).toBe("They _____ water.");
    expect(maskExample("A long drought hit the region.", "drought")).toBe("A long _____ hit the region.");
  });
});
