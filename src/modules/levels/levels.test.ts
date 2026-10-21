import { describe, expect, it } from "vitest";
import { BANDS, estimateLevel, heuristicCefr, parseBand } from "./cefr";
import { composeLevelTest, type PoolQuestion } from "./compose";

const band = (id: string) => parseBand(id)!;

describe("cefr", () => {
  it("parses bands and maps difficulty roughly", () => {
    expect(parseBand("b")?.label).toBe("B1–B2");
    expect(parseBand("z")).toBeNull();
    expect(BANDS.map((b) => b.id)).toEqual(["a", "b", "c"]);
    expect(heuristicCefr("easy")).toBe("A2");
    expect(heuristicCefr("medium")).toBe("B1");
    expect(heuristicCefr("hard")).toBe("B2");
  });

  it("estimates a level from per-level results", () => {
    expect(estimateLevel(band("b"), { B1: { correct: 2, total: 10 }, B2: { correct: 1, total: 10 } }).level).toBe("Dưới B1");
    expect(estimateLevel(band("b"), { B1: { correct: 9, total: 10 }, B2: { correct: 3, total: 10 } }).level).toBe("B1");
    expect(estimateLevel(band("b"), { B1: { correct: 8, total: 10 }, B2: { correct: 6, total: 10 } }).level).toBe("B1+");
    const up = estimateLevel(band("b"), { B1: { correct: 10, total: 10 }, B2: { correct: 9, total: 10 } });
    expect(up.level).toBe("B2");
    expect(up.direction).toBe("up");
    expect(estimateLevel(band("a"), {}).level).toBe("Chưa đủ dữ liệu");
  });
});

function pool(): PoolQuestion[] {
  const items: PoolQuestion[] = [];
  for (let i = 0; i < 10; i += 1) items.push({ id: `b1-${i}`, type: "single_choice", cefr: "B1", stimulusId: null, stimulusKind: null });
  for (let i = 0; i < 10; i += 1) items.push({ id: `b2-${i}`, type: "single_choice", cefr: "B2", stimulusId: null, stimulusKind: null });
  for (let i = 0; i < 4; i += 1) items.push({ id: `long-${i}`, type: "single_choice", cefr: "B1", stimulusId: "long1", stimulusKind: "passage" });
  for (let i = 0; i < 4; i += 1) items.push({ id: `rc-${i}`, type: "single_choice", cefr: "B1", stimulusId: `rc${i}`, stimulusKind: "passage" });
  for (let i = 0; i < 6; i += 1) items.push({ id: `lc-${i}`, type: "single_choice", cefr: "B2", stimulusId: `lc${i}`, stimulusKind: "listening" });
  for (let i = 0; i < 4; i += 1) items.push({ id: `ll-${i}`, type: "single_choice", cefr: "B1", stimulusId: "ll1", stimulusKind: "listening" });
  return items;
}

describe("composeLevelTest", () => {
  it("builds grammar, reading and listening sections, listening led by one long passage", () => {
    const test = composeLevelTest(pool(), () => 0.3);
    expect(test.sections.map((s) => s.kind)).toEqual(["grammar", "reading", "listening"]);
    expect(test.sections[0]).toMatchObject({ from: 1, to: 12 });
    const listening = test.ids.filter((id) => id.startsWith("lc-") || id.startsWith("ll-"));
    expect(listening).toHaveLength(6);
    expect(test.ids.filter((id) => id.startsWith("ll-"))).toHaveLength(4);
    expect(test.ids.filter((id) => id.startsWith("lc-"))).toHaveLength(2);
    expect(test.ids.filter((id) => id.startsWith("long-"))).toHaveLength(4);
    expect(test.ids.filter((id) => id.startsWith("rc-"))).toHaveLength(3);
    expect(test.shortfall).toBe(false);
    expect(new Set(test.ids).size).toBe(test.ids.length);
  });

  it("balances levels and orders easy before hard among standalone questions", () => {
    const grammar = composeLevelTest(pool(), () => 0.5).ids.slice(0, 12);
    expect(grammar.filter((id) => id.startsWith("b1")).length).toBe(6);
    expect(grammar.slice(0, 6).every((id) => id.startsWith("b1"))).toBe(true);
  });

  it("uses only short clips when no long listening passage exists", () => {
    const noLongListening = pool().filter((q) => !q.id.startsWith("ll-"));
    const test = composeLevelTest(noLongListening, () => 0.2);
    expect(test.ids.filter((id) => id.startsWith("lc-"))).toHaveLength(2);
    expect(test.shortfall).toBe(true);
  });

  it("flags a shortfall when there is no listening and returns nothing when too little", () => {
    expect(composeLevelTest(pool().filter((q) => q.stimulusKind !== "listening"), () => 0.2).shortfall).toBe(true);
    expect(composeLevelTest(pool().slice(0, 3)).ids).toEqual([]);
  });
});
