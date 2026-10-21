import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { isCefrLevel } from "../../../modules/levels/cefr";
import { curriculum } from "..";

type Q = {
  id: string;
  level: string;
  difficulty: string;
  stem: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  wrongAnswerExplanations: { optionId: string; explanation: string }[];
  topicSlug?: string;
};
type Group = { id: string; kind: string; level: string; title: string; body: string; questions: Q[] };
function load(name: string): { questions: Q[]; groups: Group[] } {
  const file = path.join(__dirname, name);
  return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : { questions: [], groups: [] };
}
// Gồm cả file do AI tạo (ai-generated.json) nếu đã chạy scripts/generate-cefr.ts: phải qua cùng kiểm tra.
const docs = [load("questions.json"), load("ai-generated.json")];
const doc = { questions: docs.flatMap((d) => d.questions), groups: docs.flatMap((d) => d.groups) };
const all = [...doc.questions, ...doc.groups.flatMap((group) => group.questions)];
const VIETNAMESE = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
const slugs = new Set(curriculum.map((topic) => topic.slug));

describe("cefr questions content", () => {
  it("has unique ids and valid levels", () => {
    const ids = all.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const q of all) expect(isCefrLevel(q.level), q.id).toBe(true);
    for (const g of doc.groups) expect(isCefrLevel(g.level), g.id).toBe(true);
  });

  it("has 4 options a-d, one correct answer and explanations for each wrong option", () => {
    for (const q of all) {
      expect(q.options.map((o) => o.id), q.id).toEqual(["a", "b", "c", "d"]);
      expect(q.options.some((o) => o.id === q.correctAnswer), q.id).toBe(true);
      const wrong = q.options.filter((o) => o.id !== q.correctAnswer).map((o) => o.id).sort();
      expect(q.wrongAnswerExplanations.map((w) => w.optionId).sort(), q.id).toEqual(wrong);
      expect(new Set(q.options.map((o) => o.text)).size, q.id).toBe(4);
    }
  });

  it("keeps stems, options and passages in English and explanations in Vietnamese", () => {
    for (const q of all) {
      expect(VIETNAMESE.test(q.stem), q.id).toBe(false);
      for (const o of q.options) expect(VIETNAMESE.test(o.text), `${q.id}/${o.id}`).toBe(false);
      expect(VIETNAMESE.test(q.explanation), q.id).toBe(true);
    }
    for (const g of doc.groups) {
      expect(VIETNAMESE.test(g.body), g.id).toBe(false);
      expect(g.questions.length, g.id).toBeGreaterThanOrEqual(1);
      expect(["passage", "listening"]).toContain(g.kind);
    }
  });

  it("references real topics for standalone questions", () => {
    for (const q of doc.questions) expect(slugs.has(q.topicSlug ?? ""), `${q.id}: ${q.topicSlug}`).toBe(true);
  });

  it("covers every CEFR level with standalone items and one-question reading and listening clips for the assessment", () => {
    for (const level of ["A1", "A2", "B1", "B2", "C1", "C2"]) {
      const standalone = doc.questions.filter((q) => q.level === level).length;
      const clips = (kind: string) => doc.groups.filter((g) => g.level === level && g.kind === kind && g.questions.length === 1).length;
      expect(standalone, `${level} standalone`).toBeGreaterThanOrEqual(8);
      expect(clips("passage"), `${level} reading clips`).toBeGreaterThanOrEqual(4);
      expect(clips("listening"), `${level} listening clips`).toBeGreaterThanOrEqual(4);
    }
  });
});
