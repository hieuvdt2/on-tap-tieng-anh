// Tạo câu theo trình độ CEFR bằng AI rồi ghi vào src/db/content/cefr/ai-generated.json để DUYỆT trước khi dùng.
// Seed nạp file này cùng questions.json, nên câu đã duyệt dùng được ở cả local lẫn Neon.
//
//   npx tsx scripts/generate-cefr.ts                         # mặc định: A1, C1, C2, mỗi mức 12 câu độc lập + 6 đoạn đọc ngắn + 6 đoạn nghe ngắn (1 câu/đoạn)
//   npx tsx scripts/generate-cefr.ts --level C1 --standalone 20 --clips 8 --passages 1 --listening 1
//   (--passages/--listening: bài dài nhiều câu, mặc định 0; --clips: đoạn ngắn một câu cho mỗi kỹ năng)
//   AI_PROVIDER=openai npx tsx scripts/generate-cefr.ts      # chọn nguồn AI bằng biến môi trường (.env.local)
import { config } from "dotenv";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { z } from "zod";

config({ path: ".env.local" });

const FILE = path.join(process.cwd(), "src/db/content/cefr/ai-generated.json");

function arg(name: string, fallback: string) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? (process.argv[index + 1] ?? fallback) : fallback;
}

type Stored = {
  questions: Record<string, unknown>[];
  groups: { id: string; kind: string; level: string; title: string; body: string; questions: unknown[] }[];
};

async function main() {
  const { getAIProvider } = await import("../src/modules/ai/provider");
  const { parseWithRepair } = await import("../src/modules/ai/structured");
  const { generatedQuestionSchema, questionIssues, hasVietnamese } = await import("../src/modules/ai/questions");
  const { buildCefrPassagePrompt, buildCefrQuestionsPrompt } = await import("../src/modules/ai/prompts/cefr");
  const { curriculum } = await import("../src/db/content");
  const { isCefrLevel } = await import("../src/modules/levels/cefr");

  const provider = getAIProvider(null);
  if (!provider) throw new Error("Chưa có nguồn AI: kiểm tra AI_PROVIDER và khoá trong .env.local");
  console.log(`Nguồn AI: ${provider.name} · ${provider.model}`);

  const levels = arg("level", "A1,C1,C2").split(",").map((value) => value.trim().toUpperCase());
  for (const level of levels) if (!isCefrLevel(level)) throw new Error(`Mức CEFR không hợp lệ: ${level}`);
  const wantStandalone = Number.parseInt(arg("standalone", "12"), 10);
  const wantPassages = Number.parseInt(arg("passages", "0"), 10);
  const wantListening = Number.parseInt(arg("listening", "0"), 10);
  const wantClips = Number.parseInt(arg("clips", "6"), 10);

  const stored: Stored = existsSync(FILE) ? JSON.parse(readFileSync(FILE, "utf8")) : { questions: [], groups: [] };
  const save = () => writeFileSync(FILE, `${JSON.stringify(stored, null, 1)}\n`);
  const ask = (prompt: string) => async (text: string) =>
    (await provider.generateText({ prompt: text || prompt, operation: "cefr-bulk", promptVersion: "cefr-generation-v1" })).text;

  // A1/A2 chỉ dùng chủ đề đơn giản; hỏi cấu trúc cao (hoàn thành, điều kiện, bị động…) ở mức này sẽ sinh câu quá khó.
  const BASIC_TOPICS = new Set([
    "present-simple", "present-continuous", "past-simple", "articles", "quantifiers", "countable-uncountable-nouns",
    "comparatives-superlatives", "prepositions-time-place", "modals-can-could-should", "future-forms",
    "conjunctions-linking-words", "education", "community", "health", "careers", "culture", "media", "technology", "environment",
  ]);
  const allTopics = [...curriculum];
  const batchSchema = z.object({ questions: z.array(generatedQuestionSchema).min(1) });
  const groupSchema = z.object({ title: z.string().min(3), body: z.string().min(150), questions: z.array(generatedQuestionSchema).min(3).max(6) });
  const clipSchema = z.object({ title: z.string().min(3), body: z.string().min(40), questions: z.array(generatedQuestionSchema).min(1).max(2) });
  const sanitize = (item: z.infer<typeof generatedQuestionSchema>) => questionIssues(item).length === 0;
  const prune = (items: unknown) => items;

  for (const level of levels as import("../src/modules/levels/cefr").CefrLevel[]) {
    const lower = level.toLowerCase();
    // Câu độc lập: xoay vòng qua các chủ đề ngữ pháp/từ vựng để đa dạng.
    const have = stored.questions.filter((q) => q.level === level).length;
    let need = wantStandalone - have;
    let round = 0;
    while (need > 0 && round < 8) {
      const grammarTopics = level === "A1" || level === "A2" ? allTopics.filter((t) => BASIC_TOPICS.has(t.slug)) : allTopics;
      const topic = grammarTopics[(have + round) % grammarTopics.length]!;
      const context = topic.summary;
      const avoid = stored.questions.map((q) => String(q.stem));
      try {
        const prompt = buildCefrQuestionsPrompt({ level, topicName: topic.name, context, count: Math.min(5, need + 1), avoidStems: avoid });
        const data = await parseWithRepair({ schema: batchSchema, prompt, request: ask(prompt) });
        let added = 0;
        for (const item of data.questions) {
          if (need <= 0 || !sanitize(item)) continue;
          stored.questions.push({
            id: `cefr-ai-${lower}-${String(stored.questions.length + 1).padStart(3, "0")}`,
            level,
            topicSlug: topic.slug,
            ...item,
          });
          added += 1;
          need -= 1;
        }
        console.log(`[${level}] ${topic.slug}: +${added}`);
        save();
      } catch (error) {
        console.log(`[${level}] ${topic.slug}: lỗi — ${error instanceof Error ? error.message.slice(0, 140) : error}`);
      }
      round += 1;
    }
    // Đoạn ngắn một câu hỏi (đọc và nghe), mỗi đoạn một tình huống riêng.
    for (const kind of ["passage", "listening"] as const) {
      const prefix = kind === "passage" ? "rc" : "lc";
      const have3 = stored.groups.filter((g) => g.level === level && g.kind === kind && g.id.includes(`-${prefix}`)).length;
      for (let n = have3; n < wantClips; n += 1) {
        try {
          const hints = ["a shop", "a trip", "school", "the weather", "a phone call", "health", "sport", "work", "food", "technology", "a meeting", "family"];
          const prompt = buildCefrPassagePrompt({ level, kind, count: 1, topicHint: hints[(n * 5 + level.length) % hints.length]!, short: true });
          const data = await parseWithRepair({ schema: clipSchema, prompt, request: ask(prompt) });
          const clean = data.questions.filter(sanitize).slice(0, 1);
          if (hasVietnamese(`${data.title}\n${data.body}`) || clean.length < 1) throw new Error("văn bản có tiếng Việt hoặc câu hỏi không hợp lệ");
          const id = `cefr-ai-${lower}-${prefix}${n + 1}`;
          stored.groups.push({ id, kind, level, title: data.title, body: data.body, questions: [{ id: `${id}-1`, level, ...clean[0] }] });
          console.log(`[${level}] ${kind} clip #${n + 1}`);
          save();
        } catch (error) {
          console.log(`[${level}] ${kind} clip #${n + 1}: lỗi — ${error instanceof Error ? error.message.slice(0, 140) : error}`);
        }
      }
    }
    // Bài đọc và bài nghe dài (nhiều câu).
    for (const [kind, want] of [["passage", wantPassages], ["listening", wantListening]] as const) {
      const have2 = stored.groups.filter((g) => g.level === level && g.kind === kind).length;
      for (let n = have2; n < want; n += 1) {
        try {
          const hints = ["daily life", "technology", "travel", "health", "work", "environment", "education", "city life"];
          const prompt = buildCefrPassagePrompt({ level, kind, count: 4, topicHint: hints[(n + level.length) % hints.length]! });
          const data = await parseWithRepair({ schema: groupSchema, prompt, request: ask(prompt) });
          const clean = data.questions.filter(sanitize);
          if (hasVietnamese(`${data.title}\n${data.body}`) || clean.length < 3) throw new Error("văn bản có tiếng Việt hoặc ít hơn 3 câu hợp lệ");
          stored.groups.push({
            id: `cefr-ai-${lower}-${kind === "passage" ? "r" : "l"}${n + 1}`,
            kind,
            level,
            title: data.title,
            body: data.body,
            questions: prune(clean.map((item, index) => ({ id: `cefr-ai-${lower}-${kind === "passage" ? "r" : "l"}${n + 1}-${index + 1}`, level, ...item }))) as unknown[],
          });
          console.log(`[${level}] ${kind} #${n + 1}: ${clean.length} câu`);
          save();
        } catch (error) {
          console.log(`[${level}] ${kind} #${n + 1}: lỗi — ${error instanceof Error ? error.message.slice(0, 140) : error}`);
        }
      }
    }
  }
  save();
  console.log(`Xong: ${stored.questions.length} câu độc lập, ${stored.groups.length} đoạn trong ${path.relative(process.cwd(), FILE)}`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
