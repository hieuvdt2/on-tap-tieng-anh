import { describe, expect, it } from "vitest";
import { quotaLeft, sharedDailyLimit } from "./shared-limit";

describe("shared quota", () => {
  it("reads the daily limit from env with a safe default", () => {
    expect(sharedDailyLimit("25")).toBe(25);
    expect(sharedDailyLimit(undefined)).toBe(60);
    expect(sharedDailyLimit("abc")).toBe(60);
    expect(sharedDailyLimit("0")).toBe(60);
    expect(sharedDailyLimit("-5")).toBe(60);
  });

  it("never reports negative remaining calls", () => {
    expect(quotaLeft(10, 60)).toBe(50);
    expect(quotaLeft(60, 60)).toBe(0);
    expect(quotaLeft(90, 60)).toBe(0);
  });
});
