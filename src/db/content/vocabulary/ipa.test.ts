import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ipa: Record<string, string> = JSON.parse(readFileSync(path.join(__dirname, "ipa.json"), "utf8"));
const words: { word: string }[] = JSON.parse(readFileSync(path.join(__dirname, "oxford-3000.json"), "utf8"));

describe("ipa.json", () => {
  it("covers nearly every word of the 3000 list", () => {
    const covered = words.filter((item) => ipa[item.word]).length;
    expect(covered / words.length).toBeGreaterThan(0.98);
  });

  it("uses plain IPA text without slashes or leftover ARPAbet", () => {
    for (const [word, value] of Object.entries(ipa)) {
      expect(value, word).not.toMatch(/[\/\d]/);
      expect(value, word).not.toMatch(/[A-Z]/);
      expect(value.length, word).toBeGreaterThan(0);
    }
  });
});
