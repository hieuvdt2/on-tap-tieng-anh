import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { curriculum } from "..";
import { isVocabularyTopic } from "../types";
import { headwordKey, wordIssues } from "../../../modules/vocabulary/validate";

const file = path.join(__dirname, "extra-words.json");

type Entry = { topicSlug: string; word: string; wordClass: string; ipa: string | null; meaningVi: string; example: string; note: string };

// Bảo vệ file từ vựng AI đã duyệt: mỗi mục phải hợp lệ, không trùng nhau hay trùng từ tự soạn.
describe.skipIf(!existsSync(file))("extra-words.json", () => {
  const entries: Entry[] = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : [];
  const vocabTopics = curriculum.filter(isVocabularyTopic);
  const own = new Set(vocabTopics.flatMap((topic) => topic.items.map((item) => headwordKey(item.word))));

  it("only uses vocabulary topics", () => {
    const slugs = new Set(vocabTopics.map((topic) => topic.slug));
    for (const entry of entries) expect(slugs.has(entry.topicSlug), entry.word).toBe(true);
  });

  it("has valid, unique words that do not duplicate the hand-written ones", () => {
    const seen = new Set<string>();
    for (const entry of entries) {
      const key = headwordKey(entry.word);
      expect(wordIssues(entry), entry.word).toEqual([]);
      expect(seen.has(key), `trùng: ${entry.word}`).toBe(false);
      expect(own.has(key), `trùng từ tự soạn: ${entry.word}`).toBe(false);
      seen.add(key);
    }
  });
});
