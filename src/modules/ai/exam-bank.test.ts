import { describe, expect, it, vi } from "vitest";

vi.mock("@/db/client", () => ({ db: {} }));

import { chooseFromBank, type BankRow } from "./exam-bank";
import { EXAM_GENERATION_STEPS } from "./generator-spec";

const [gapLeaflet, ordering, gapLong, readingTen, gapAdvert] = EXAM_GENERATION_STEPS;
const firstPick = () => 0;

function gapRows(stimulusId: string, start: number, count: number, idPrefix = stimulusId): BankRow[] {
  const body = Array.from({ length: count }, (_, i) => `text (${start + i})______`).join(" ");
  return Array.from({ length: count }, (_, i) => ({
    id: `${idPrefix}-${start + count - 1 - i}`,
    stimulusId,
    stem: `Choose blank (${start + count - 1 - i}).`,
    createdAt: new Date(2026, 0, 1, 0, i),
    body,
  }));
}

function passageRows(stimulusId: string, count: number): BankRow[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${stimulusId}-q${i}`,
    stimulusId,
    stem: `Question ${i}`,
    createdAt: new Date(2026, 0, 1, 0, i),
    body: "passage",
  }));
}

describe("chooseFromBank", () => {
  it("only places a gap passage where its blank numbers match", () => {
    const rows = [...gapRows("late", 27, 6), ...gapRows("early", 1, 6)];
    expect(chooseFromBank({ step: gapLeaflet, rows, seen: new Set(), random: firstPick })?.stimulusIds).toEqual(["early"]);
    expect(chooseFromBank({ step: gapAdvert, rows, seen: new Set(), random: firstPick })?.stimulusIds).toEqual(["late"]);
  });

  it("orders gap questions by blank number", () => {
    const picked = chooseFromBank({ step: gapLong, rows: gapRows("p", 12, 5), seen: new Set(), random: firstPick });
    expect(picked?.ids).toEqual(["p-12", "p-13", "p-14", "p-15", "p-16"]);
  });

  it("skips a passage when the student has seen any of its questions", () => {
    const rows = gapRows("seen", 1, 6);
    expect(chooseFromBank({ step: gapLeaflet, rows, seen: new Set(["seen-3"]) })).toBeNull();
  });

  it("prefers a reading passage with exactly the needed questions", () => {
    const rows = [...passageRows("long", 10), ...passageRows("exact", 8)];
    const eight = EXAM_GENERATION_STEPS[5];
    expect(chooseFromBank({ step: eight, rows, seen: new Set(), random: firstPick })?.stimulusIds).toEqual(["exact"]);
    expect(chooseFromBank({ step: readingTen, rows: passageRows("short", 4), seen: new Set() })).toBeNull();
  });

  it("when reusing seen questions, prefers the ones not seen for the longest time", () => {
    const rows = passageRows("o", 6).map((row, i) => ({ ...row, stimulusId: `o${i}` }));
    const lastSeen = new Map([["o-q0", 600], ["o-q1", 100], ["o-q2", 500], ["o-q3", 200], ["o-q4", 400], ["o-q5", 300]]);
    const picked = chooseFromBank({
      step: ordering,
      rows,
      seen: new Set(),
      rank: (id) => lastSeen.get(id) ?? 0,
    });
    expect(picked?.ids).toEqual(["o-q1", "o-q3", "o-q5", "o-q4", "o-q2"]);
  });

  it("when reusing, picks the gap passage whose newest question is the oldest", () => {
    const rows = [...gapRows("recent", 1, 6), ...gapRows("old", 1, 6)];
    const lastSeen = new Map(rows.map((row) => [row.id, row.stimulusId === "old" ? 100 : 900]));
    const picked = chooseFromBank({ step: gapLeaflet, rows, seen: new Set(), rank: (id) => lastSeen.get(id) ?? 0 });
    expect(picked?.stimulusIds).toEqual(["old"]);
  });

  it("returns null when there are not enough unseen ordering items", () => {
    const rows = passageRows("o", 5).map((row, i) => ({ ...row, stimulusId: `o${i}` }));
    expect(chooseFromBank({ step: ordering, rows, seen: new Set() })?.ids).toHaveLength(5);
    expect(chooseFromBank({ step: ordering, rows, seen: new Set(["o-q0"]) })).toBeNull();
  });
});
