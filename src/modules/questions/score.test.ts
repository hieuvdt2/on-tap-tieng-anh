import { describe, expect, it } from "vitest";
import { scoreAnswer } from "./score";

describe("scoreAnswer", () => {
  it("accepts the stored option id", () => {
    expect(scoreAnswer("b", "b")).toBe(true);
  });

  it("rejects a different option", () => {
    expect(scoreAnswer("b", "a")).toBe(false);
  });

  it("rejects an unknown answer", () => {
    expect(scoreAnswer("b", "z")).toBe(false);
    expect(scoreAnswer("b", "")).toBe(false);
  });
});
