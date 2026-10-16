import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { isWordTheme, OTHER_THEME, parseThemeFilter, themeLabel, TOPIC_TO_THEME, WORD_THEMES } from "./themes";

const mapping: Record<string, string> = JSON.parse(
  readFileSync(path.join(process.cwd(), "src/db/content/vocabulary/themes.json"), "utf8"),
);
const oxford: { word: string }[] = JSON.parse(
  readFileSync(path.join(process.cwd(), "src/db/content/vocabulary/oxford-3000.json"), "utf8"),
);

describe("word themes", () => {
  it("has unique slugs and labels", () => {
    expect(new Set(WORD_THEMES.map((t) => t.slug)).size).toBe(WORD_THEMES.length);
    expect(new Set(WORD_THEMES.map((t) => t.label)).size).toBe(WORD_THEMES.length);
  });

  it("parses URL filters safely", () => {
    expect(parseThemeFilter("food-drink")).toBe("food-drink");
    expect(parseThemeFilter(OTHER_THEME)).toBe(OTHER_THEME);
    expect(parseThemeFilter("nope")).toBeNull();
    expect(parseThemeFilter(undefined)).toBeNull();
    expect(themeLabel(null)).toBe("Từ thông dụng khác");
    expect(themeLabel("education")).toBe("Học tập & giáo dục");
  });

  it("maps lesson topics to valid themes", () => {
    for (const theme of Object.values(TOPIC_TO_THEME)) expect(isWordTheme(theme)).toBe(true);
  });

  it("only assigns known words to valid themes, and covers a good share of the list", () => {
    const known = new Set(oxford.map((item) => item.word));
    for (const [word, theme] of Object.entries(mapping)) {
      expect(known.has(word), word).toBe(true);
      expect(isWordTheme(theme), `${word}: ${theme}`).toBe(true);
    }
    expect(Object.keys(mapping).length).toBeGreaterThan(1000);
  });
});
