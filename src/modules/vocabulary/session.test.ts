import { describe, expect, it } from "vitest";
import { computeStreak, vnDay } from "./streak";
import { buildFamilies } from "./family";
import { dropHead, requeueHead } from "./session";
import { typingVerdict } from "./typing";

describe("requeue", () => {
  it("moves a missed word a few places back", () => {
    expect(requeueHead(["a", "b", "c", "d", "e"])).toEqual(["b", "c", "d", "a", "e"]);
  });
  it("puts it at the end when the queue is short, and keeps a single word", () => {
    expect(requeueHead(["a", "b"])).toEqual(["b", "a"]);
    expect(requeueHead(["a"])).toEqual(["a"]);
    expect(requeueHead([])).toEqual([]);
  });
  it("drops the head", () => {
    expect(dropHead(["a", "b"])).toEqual(["b"]);
  });
});

describe("streak", () => {
  it("counts consecutive days ending today", () => {
    expect(computeStreak(["2026-01-03", "2026-01-02", "2026-01-01"], "2026-01-03")).toBe(3);
  });
  it("keeps the streak alive when only yesterday was studied", () => {
    expect(computeStreak(["2026-01-02", "2026-01-01"], "2026-01-03")).toBe(2);
  });
  it("breaks after a gap and is zero without recent activity", () => {
    expect(computeStreak(["2026-01-03", "2026-01-01"], "2026-01-03")).toBe(1);
    expect(computeStreak(["2025-12-20"], "2026-01-03")).toBe(0);
    expect(computeStreak([], "2026-01-03")).toBe(0);
  });
  it("formats the Vietnam calendar day", () => {
    expect(vnDay(new Date("2026-01-01T18:00:00Z"))).toBe("2026-01-02");
    expect(vnDay(new Date("2026-01-01T10:00:00Z"))).toBe("2026-01-01");
  });
});

describe("word families", () => {
  it("groups inflections with a base that exists in the list", () => {
    const f = buildFamilies(["amaze", "amazed", "amazing", "amazingly", "happy", "happily", "happiness", "stop", "stopped", "number", "numb"]);
    expect(f.get("amazed")).toBe("amaze");
    expect(f.get("amazing")).toBe("amaze");
    expect(f.get("happily")).toBe("happy");
    expect(f.get("stopped")).toBe("stop");
    expect(f.get("number")).toBe("number");
  });
  it("leaves unrelated words alone", () => {
    const f = buildFamilies(["bag", "baggage", "water"]);
    expect(f.get("water")).toBe("water");
    expect(f.get("bag")).toBe("bag");
  });
});

describe("typing verdict", () => {
  it("accepts British and American variants", () => {
    expect(typingVerdict("color", "colour")).toBe("correct");
    expect(typingVerdict("organize", "organise")).toBe("correct");
    expect(typingVerdict("center", "centre")).toBe("correct");
  });
  it("flags one-letter slips as close for longer words only", () => {
    expect(typingVerdict("enviroment", "environment")).toBe("close");
    expect(typingVerdict("drout", "drought")).toBe("wrong");
    expect(typingVerdict("cat", "cap")).toBe("wrong");
    expect(typingVerdict("", "cat")).toBe("wrong");
  });
});
