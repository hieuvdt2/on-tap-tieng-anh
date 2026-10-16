import type { MasteryLevel } from "@/modules/learning/mastery";

export type Difficulty = "easy" | "medium" | "hard";
export type DifficultyMix = Record<Difficulty, number>;

const ORDER: Difficulty[] = ["easy", "medium", "hard"];

// Tỉ lệ độ khó mong muốn theo mức học của chủ đề: yếu thì nhiều câu dễ để lấy lại nền, vững thì
// nhiều câu khó để không bị nhàm. Chủ đề chưa làm lần nào (level null) dùng mức giữa.
export const DIFFICULTY_MIX: Record<MasteryLevel | "new", DifficultyMix> = {
  weak: { easy: 0.4, medium: 0.4, hard: 0.2 },
  learning: { easy: 0.2, medium: 0.5, hard: 0.3 },
  solid: { easy: 0.1, medium: 0.4, hard: 0.5 },
  new: { easy: 0.3, medium: 0.5, hard: 0.2 },
};

export type DifficultyChoice = "auto" | Difficulty;
export const DIFFICULTY_CHOICES: DifficultyChoice[] = ["auto", "easy", "medium", "hard"];

// Người dùng chọn một mức: lấy chủ yếu mức đó, trộn thêm mức kề để bài không đơn điệu.
const FOCUS_MIX: Record<Difficulty, DifficultyMix> = {
  easy: { easy: 0.7, medium: 0.3, hard: 0 },
  medium: { easy: 0.15, medium: 0.7, hard: 0.15 },
  hard: { easy: 0, medium: 0.3, hard: 0.7 },
};

export function mixForChoice(choice: DifficultyChoice, level: MasteryLevel | null | undefined): DifficultyMix {
  return choice === "auto" ? mixForLevel(level) : FOCUS_MIX[choice];
}

export function mixForLevel(level: MasteryLevel | null | undefined): DifficultyMix {
  return DIFFICULTY_MIX[level ?? "new"];
}

function asDifficulty(value: string | undefined): Difficulty {
  return value === "hard" || value === "medium" ? value : "easy";
}

export function difficultyQuotas(count: number, mix: DifficultyMix): DifficultyMix {
  const raw = ORDER.map((key) => mix[key] * count);
  const quotas = raw.map((value) => Math.floor(value));
  let left = count - quotas.reduce((sum, value) => sum + value, 0);
  const byRemainder = raw
    .map((value, index) => ({ index, remainder: value - Math.floor(value) }))
    .sort((a, b) => b.remainder - a.remainder || a.index - b.index);
  for (const item of byRemainder) {
    if (left <= 0) break;
    quotas[item.index] += 1;
    left -= 1;
  }
  return { easy: quotas[0], medium: quotas[1], hard: quotas[2] };
}

/**
 * Chọn `count` câu từ danh sách ứng viên (đã xếp theo thứ tự ưu tiên) sao cho độ khó gần tỉ lệ `mix`.
 * Thiếu câu ở một độ khó thì bù từ độ khó kề nhất; kết quả xếp dễ → khó để bài tăng dần.
 */
export function balanceByDifficulty<T extends { difficulty?: string }>(
  candidates: readonly T[],
  count: number,
  mix: DifficultyMix,
): T[] {
  const buckets: Record<Difficulty, T[]> = { easy: [], medium: [], hard: [] };
  for (const item of candidates) buckets[asDifficulty(item.difficulty)].push(item);

  const quotas = difficultyQuotas(count, mix);
  const picked: Record<Difficulty, T[]> = { easy: [], medium: [], hard: [] };
  let shortfall = 0;
  for (const key of ORDER) {
    picked[key] = buckets[key].slice(0, quotas[key]);
    shortfall += quotas[key] - picked[key].length;
  }
  // Bù phần thiếu: ưu tiên mức giữa, rồi mức khó hơn, rồi mức dễ hơn.
  for (const key of ["medium", "hard", "easy"] as Difficulty[]) {
    if (shortfall <= 0) break;
    const extra = buckets[key].slice(picked[key].length, picked[key].length + shortfall);
    picked[key].push(...extra);
    shortfall -= extra.length;
  }
  return ORDER.flatMap((key) => picked[key]);
}

/** Sắp xếp ổn định dễ → khó (giữ nguyên thứ tự trong cùng độ khó). */
export function sortByDifficulty<T extends { difficulty?: string }>(items: readonly T[]): T[] {
  const rank = (item: T) => ORDER.indexOf(asDifficulty(item.difficulty));
  return items.map((item, index) => ({ item, index })).sort((a, b) => rank(a.item) - rank(b.item) || a.index - b.index).map((x) => x.item);
}
