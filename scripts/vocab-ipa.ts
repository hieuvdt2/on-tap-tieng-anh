// Tạo phiên âm Mỹ (IPA) cho từ vựng từ từ điển CMU (cmu-pronouncing-dictionary, giấy phép ISC).
// Chạy: npx tsx scripts/vocab-ipa.ts  ->  ghi src/db/content/vocabulary/ipa.json (từ -> IPA, không có dấu /…/)
// Từ không có trong CMU (từ ghép có dấu gạch, viết tắt…) được bỏ qua; app hiện không có phiên âm cho từ đó.
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { dictionary } from "cmu-pronouncing-dictionary";
import { curriculum } from "../src/db/content";
import { isVocabularyTopic } from "../src/db/content/types";
import { arpabetToIpa } from "../src/modules/vocabulary/ipa";

const oxfordFile = path.join(process.cwd(), "src/db/content/vocabulary/oxford-3000.json");
const outFile = path.join(process.cwd(), "src/db/content/vocabulary/ipa.json");

const words = new Set<string>(JSON.parse(readFileSync(oxfordFile, "utf8")).map((item: { word: string }) => item.word));
for (const topic of curriculum) {
  if (isVocabularyTopic(topic)) for (const item of topic.items) words.add(item.word.toLowerCase());
}

// Chính tả Anh -> Mỹ cho những từ CMU không có (cùng cách đọc).
const US_SPELLING: Record<string, string> = {
  enrol: "enroll", flavour: "flavor", litre: "liter", jewellery: "jewelry", offence: "offense",
  skilful: "skillful", skilfully: "skillfully", behaviour: "behavior", colour: "color", centre: "center",
};

const result: Record<string, string> = {};
const missing: string[] = [];
for (const word of [...words].sort()) {
  const parts = word.split(/[\s-]+/);
  const ipaParts: string[] = [];
  for (const part of parts) {
    const arpabet = (dictionary as Record<string, string>)[part] ?? (dictionary as Record<string, string>)[US_SPELLING[part] ?? ""];
    if (!arpabet) break;
    ipaParts.push(arpabetToIpa(arpabet));
  }
  if (ipaParts.length === parts.length) result[word] = ipaParts.join(word.includes("-") ? "-" : " ");
  else missing.push(word);
}
writeFileSync(outFile, `${JSON.stringify(result, null, 1)}\n`);
console.log(`IPA: ${Object.keys(result).length}/${words.size} từ; thiếu ${missing.length}:`, missing.slice(0, 40).join(", "));
