import { describe, expect, it } from "vitest";
import { fillBlank } from "./fill-blank";

describe("fillBlank", () => {
  it("returns the sentence split around the answer, flagged for highlighting", () => {
    expect(fillBlank("A car is ___ than a bicycle.", "faster")).toEqual([
      { text: "A car is ", isAnswer: false },
      { text: "faster", isAnswer: true },
      { text: " than a bicycle.", isAnswer: false },
    ]);
  });

  it("works when the blank starts the sentence", () => {
    expect(fillBlank("___ your brother live in Hue?", "Does")).toEqual([
      { text: "Does", isAnswer: true },
      { text: " your brother live in Hue?", isAnswer: false },
    ]);
  });

  it("returns null when the stem has no blank", () => {
    expect(fillBlank("Which word best completes the sentence?", "faster")).toBeNull();
  });

  it("replaces a longer run of underscores as a single blank (AI-generated stems vary in length)", () => {
    expect(fillBlank("My English professor _____ online classes on weekends.", "teaches")).toEqual([
      { text: "My English professor ", isAnswer: false },
      { text: "teaches", isAnswer: true },
      { text: " online classes on weekends.", isAnswer: false },
    ]);
  });

  it("fills multiple blanks when the answer lists one part per blank, comma-separated", () => {
    expect(fillBlank("____ your teacher usually ____ homework on Fridays?", "Does, give")).toEqual([
      { text: "Does", isAnswer: true },
      { text: " your teacher usually ", isAnswer: false },
      { text: "give", isAnswer: true },
      { text: " homework on Fridays?", isAnswer: false },
    ]);
  });

  it("fills multiple blanks when the answer lists one part per blank, slash-separated", () => {
    expect(fillBlank("I saw ___ dog outside. ___ dog looked friendly.", "a / The")).toEqual([
      { text: "I saw ", isAnswer: false },
      { text: "a", isAnswer: true },
      { text: " dog outside. ", isAnswer: false },
      { text: "The", isAnswer: true },
      { text: " dog looked friendly.", isAnswer: false },
    ]);
  });

  it("returns null for multiple blanks when the answer doesn't split into a matching number of parts", () => {
    expect(fillBlank("____ your teacher usually ____ homework?", "Does and give")).toBeNull();
  });
});
