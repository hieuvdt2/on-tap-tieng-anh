import type { CefrLevel } from "./cefr";

export type PoolQuestion = {
  id: string;
  type: string;
  cefr: CefrLevel;
  stimulusId: string | null;
  /** "passage" (đọc), "listening" (nghe) hoặc null (câu độc lập: ngữ pháp, từ vựng…). */
  stimulusKind: string | null;
};

export type LevelSection = { label: string; kind: "grammar" | "reading" | "listening"; from: number; to: number };

export type ComposedTest = {
  ids: string[];
  sections: LevelSection[];
  shortfall: boolean;
};

export const TARGET = {
  standalone: 12,
  longPassages: 1,
  longPassageMax: 4,
  readingClips: 3,
  listeningLongPassages: 1,
  listeningLongMax: 4,
  listeningClips: 2,
};
export const MIN_QUESTIONS = 8;

function shuffle<T>(items: readonly T[], random: () => number) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j] as T, copy[i] as T];
  }
  return copy;
}

const order = (level: CefrLevel) => ["A1", "A2", "B1", "B2", "C1", "C2"].indexOf(level);

/** Gom câu theo đoạn (stimulus) và lọc các đoạn theo loại và số câu hỏi của đoạn. */
function groupsOf(pool: readonly PoolQuestion[], kind: string, accept: (size: number) => boolean) {
  const byStimulus = new Map<string, PoolQuestion[]>();
  for (const question of pool) {
    if (question.stimulusKind !== kind || !question.stimulusId) continue;
    byStimulus.set(question.stimulusId, [...(byStimulus.get(question.stimulusId) ?? []), question]);
  }
  return [...byStimulus.values()].filter((items) => accept(items.length));
}

function takeGroups(groups: PoolQuestion[][], count: number, maxQuestions: number, random: () => number) {
  const chosen: PoolQuestion[] = [];
  for (const items of shuffle(groups, random).slice(0, count)) {
    for (const item of items) if (chosen.length < maxQuestions) chosen.push(item);
  }
  return chosen;
}

/**
 * Ghép một đề trình độ từ kho câu của dải. Phần đọc và phần nghe đều gồm một bài dài (nhiều câu, giống
 * bài thi thật) cộng thêm vài đoạn ngắn một câu để đa dạng tình huống.
 * Câu độc lập (ngữ pháp, từ vựng) cân bằng giữa các mức của dải rồi xếp từ dễ đến khó.
 * Thiếu nội dung thì đề ngắn hơn (shortfall = true); quá ít thì trả về đề rỗng.
 */
export function composeLevelTest(pool: readonly PoolQuestion[], random: () => number = Math.random): ComposedTest {
  const standalonePool = pool.filter((q) => !q.stimulusId && q.type !== "ordering");
  const levels = [...new Set(standalonePool.map((q) => q.cefr))].sort((a, b) => order(a) - order(b));
  const perLevel = Math.ceil(TARGET.standalone / Math.max(1, levels.length));
  const standalone: PoolQuestion[] = [];
  for (const level of levels) {
    standalone.push(...shuffle(standalonePool.filter((q) => q.cefr === level), random).slice(0, perLevel));
  }
  standalone.sort((a, b) => order(a.cefr) - order(b.cefr));
  const trimmed = standalone.slice(0, TARGET.standalone);

  const longReading = takeGroups(groupsOf(pool, "passage", (n) => n >= 3), TARGET.longPassages, TARGET.longPassageMax, random);
  const readingClips = takeGroups(groupsOf(pool, "passage", (n) => n === 1), TARGET.readingClips, TARGET.readingClips, random);
  const reading = [...longReading, ...readingClips];

  const longListening = takeGroups(groupsOf(pool, "listening", (n) => n >= 3), TARGET.listeningLongPassages, TARGET.listeningLongMax, random);
  const listeningClips = takeGroups(groupsOf(pool, "listening", (n) => n === 1), TARGET.listeningClips, TARGET.listeningClips, random);
  const listening = [...longListening, ...listeningClips];

  const ids = [...trimmed, ...reading, ...listening].map((q) => q.id);
  if (ids.length < MIN_QUESTIONS) return { ids: [], sections: [], shortfall: true };

  const sections: LevelSection[] = [];
  let cursor = 1;
  const add = (label: string, kind: LevelSection["kind"], count: number) => {
    if (count === 0) return;
    sections.push({ label, kind, from: cursor, to: cursor + count - 1 });
    cursor += count;
  };
  add("Ngữ pháp & từ vựng", "grammar", trimmed.length);
  add("Đọc hiểu", "reading", reading.length);
  add("Nghe", "listening", listening.length);
  const full =
    trimmed.length >= TARGET.standalone &&
    reading.length >= TARGET.readingClips + 2 &&
    listening.length >= TARGET.listeningClips + 2;
  return { ids, sections, shortfall: !full };
}
