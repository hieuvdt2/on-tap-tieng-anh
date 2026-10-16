// Tạo từ vựng hàng loạt bằng AI rồi ghi vào src/db/content/vocabulary/extra-words.json để DUYỆT trước
// khi dùng. File này được seed nạp vào DB (cả local lẫn Neon), nên từ đã duyệt dùng lại được ở mọi nơi.
//
//   npx tsx scripts/generate-vocab.ts                 # mỗi chủ đề thêm tới 22 từ
//   npx tsx scripts/generate-vocab.ts --per-topic 30  # đổi số từ mỗi chủ đề
//   npx tsx scripts/generate-vocab.ts --topic health  # chỉ một chủ đề
import { config } from "dotenv";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { asc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

config({ path: ".env.local" });

const FILE = path.join(process.cwd(), "src/db/content/vocabulary/extra-words.json");
const BATCH = 12;
const MAX_ROUNDS = 4;

function arg(name: string) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

type Entry = {
  topicSlug: string;
  word: string;
  wordClass: string;
  ipa: string | null;
  meaningVi: string;
  example: string;
  note: string;
};

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is missing");
  const { getAIProvider } = await import("../src/modules/ai/provider");
  const { buildVocabularyPrompt } = await import("../src/modules/ai/prompts/content-generation");
  const { parseWithRepair } = await import("../src/modules/ai/structured");
  const { generatedVocabularySchema } = await import("../src/modules/vocabulary/schema");
  const { headwordKey, wordIssues } = await import("../src/modules/vocabulary/validate");
  const { topics, vocabWords } = await import("../src/db/schema");

  const provider = getAIProvider(null);
  if (!provider) throw new Error("Chưa có nguồn AI: kiểm tra AI_PROVIDER và khoá trong .env.local");
  console.log(`Nguồn AI: ${provider.name} · ${provider.model}`);

  const perTopic = Number.parseInt(arg("per-topic") ?? "22", 10);
  const only = arg("topic");

  const sql = postgres(url, { max: 1 });
  const db = drizzle(sql);
  const topicRows = await db.select().from(topics).where(eq(topics.skill, "vocabulary")).orderBy(asc(topics.slug));
  const existing = await db.select({ key: vocabWords.headwordKey, topicId: vocabWords.topicId }).from(vocabWords);
  const taken = new Set(existing.map((row) => row.key));
  const keysByTopic = new Map<string, string[]>();
  for (const row of existing) keysByTopic.set(row.topicId ?? "", [...(keysByTopic.get(row.topicId ?? "") ?? []), row.key]);

  const entries: Entry[] = existsSync(FILE) ? (JSON.parse(readFileSync(FILE, "utf8")) as Entry[]) : [];
  for (const entry of entries) taken.add(headwordKey(entry.word));

  for (const topic of topicRows) {
    if (only && topic.slug !== only) continue;
    const have = entries.filter((entry) => entry.topicSlug === topic.slug).length;
    let need = perTopic - have;
    console.log(`\n[${topic.slug}] đã có ${have}, cần thêm ${Math.max(0, need)}`);
    for (let round = 1; round <= MAX_ROUNDS && need > 0; round += 1) {
      const count = Math.min(BATCH, need + 3);
      const prompt = buildVocabularyPrompt({
        topicName: topic.name,
        context: topic.summary,
        count,
        avoidWords: [
          ...(keysByTopic.get(topic.id) ?? []),
          ...entries.filter((entry) => entry.topicSlug === topic.slug).map((entry) => headwordKey(entry.word)),
        ],
      });
      try {
        const data = await parseWithRepair({
          schema: generatedVocabularySchema,
          prompt,
          request: async (text) => (await provider.generateText({ prompt: text, operation: "vocabulary-bulk", promptVersion: "vocab-bulk-v1" })).text,
        });
        let added = 0;
        for (const item of data.words) {
          const key = headwordKey(item.word);
          if (need <= 0) break;
          if (taken.has(key) || wordIssues(item).length > 0) continue;
          entries.push({
            topicSlug: topic.slug,
            word: item.word.trim(),
            wordClass: item.wordClass.trim(),
            ipa: item.ipa?.trim() || null,
            meaningVi: item.meaningVi.trim(),
            example: item.example.trim(),
            note: item.note?.trim() ?? "",
          });
          taken.add(key);
          added += 1;
          need -= 1;
        }
        console.log(`  lượt ${round}: +${added} (còn thiếu ${Math.max(0, need)})`);
        writeFileSync(FILE, `${JSON.stringify(entries, null, 2)}\n`);
      } catch (error) {
        console.log(`  lượt ${round}: lỗi — ${error instanceof Error ? error.message.slice(0, 160) : error}`);
      }
    }
  }

  writeFileSync(FILE, `${JSON.stringify(entries, null, 2)}\n`);
  console.log(`\nXong: ${entries.length} từ trong ${path.relative(process.cwd(), FILE)}`);
  await sql.end();
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
