import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { headwordKey } from "../../../modules/vocabulary/validate";

type Item = { word: string; pos: string; meaningVi: string };
const items: Item[] = JSON.parse(readFileSync(path.join(__dirname, "oxford-3000.json"), "utf8"));
const VIETNAMESE = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;

// Danh sách nhập từ file ngoài: nghĩa chưa kiểm, nhưng ít nhất phải đúng dạng để app dùng được.
describe("oxford-3000.json", () => {
  it("has a few thousand entries", () => {
    expect(items.length).toBeGreaterThan(3000);
  });

  it("has unique lowercase English headwords and a valid part of speech", () => {
    const seen = new Set<string>();
    for (const item of items) {
      expect(item.word, item.word).toMatch(/^[a-z]+(-[a-z]+)?$/);
      expect(item.pos, item.word).toMatch(/^(n|v|adj|adv)(\/(n|v|adj|adv))*$/);
      const key = headwordKey(item.word);
      expect(seen.has(key), `trùng: ${item.word}`).toBe(false);
      seen.add(key);
    }
  });

  it("has a Vietnamese meaning that is not a leaked pronunciation", () => {
    const missing = items.filter((item) => !VIETNAMESE.test(item.meaningVi) && item.meaningVi.split(" ").length > 3);
    expect(missing.map((item) => item.word)).toEqual([]);
    for (const item of items) expect(item.meaningVi.length, item.word).toBeGreaterThan(1);
  });
});
