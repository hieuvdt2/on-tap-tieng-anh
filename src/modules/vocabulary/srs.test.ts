import { describe, expect, it } from "vitest";
import { introduced, MAX_BOX, review, stageOf } from "./srs";

const now = new Date("2026-01-01T00:00:00Z");
const day = 24 * 60 * 60 * 1000;

describe("srs", () => {
  it("schedules a newly learned word for tomorrow in box 1", () => {
    const state = introduced(now);
    expect(state.box).toBe(1);
    expect(state.dueAt.getTime() - now.getTime()).toBe(day);
  });

  it("moves up one box and waits longer after a correct answer", () => {
    expect(review(1, true, now)).toEqual({ box: 2, dueAt: new Date(now.getTime() + 2 * day) });
    expect(review(2, true, now).dueAt.getTime() - now.getTime()).toBe(4 * day);
    expect(review(3, true, now).dueAt.getTime() - now.getTime()).toBe(8 * day);
  });

  it("caps at the last box", () => {
    expect(review(MAX_BOX, true, now).box).toBe(MAX_BOX);
    expect(review(MAX_BOX, true, now).dueAt.getTime() - now.getTime()).toBe(16 * day);
  });

  it("resets to box 0 and retries in ten minutes after a wrong answer", () => {
    const state = review(4, false, now);
    expect(state.box).toBe(0);
    expect(state.dueAt.getTime() - now.getTime()).toBe(10 * 60 * 1000);
  });

  it("maps boxes to stages", () => {
    expect(stageOf(null)).toBe("new");
    expect(stageOf(0)).toBe("learning");
    expect(stageOf(3)).toBe("learning");
    expect(stageOf(4)).toBe("known");
  });
});
