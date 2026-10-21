import { CEFR_LEVELS, type CefrLevel } from "@/modules/levels/cefr";

// Bài đánh giá năng lực thích ứng: mỗi câu có một mức CEFR (A1..C2 -> độ khó 1..6). Sau mỗi câu, năng lực
// ước lượng (theta, cùng thang 1..6) được cập nhật theo mô hình logistic có yếu tố đoán mò (câu 4 lựa chọn),
// rồi chọn câu tiếp theo có mức gần theta nhất. Đây là mô hình đơn giản, chưa hiệu chuẩn bằng dữ liệu người
// làm thật, nên điểm chỉ mang tính ước lượng tham khảo.
export const SKILLS = ["grammar", "vocabulary", "reading", "listening"] as const;
export type Skill = (typeof SKILLS)[number];

export const SKILL_LABELS: Record<Skill, string> = {
  grammar: "Ngữ pháp",
  vocabulary: "Từ vựng",
  reading: "Đọc hiểu",
  listening: "Nghe",
};

export const TEST_LENGTH = 30;
export const SKILL_QUOTA: Record<Skill, number> = { grammar: 8, vocabulary: 7, reading: 7, listening: 8 };

const GUESS = 0.25;
const SLOPE = 1.2;
const PRIOR_MEAN = 3;
const PRIOR_SD = 1.8;
const THETA_MIN = 0.5;
const THETA_MAX = 6.5;

export function difficultyOf(level: CefrLevel) {
  return CEFR_LEVELS.indexOf(level) + 1;
}

export function probabilityCorrect(theta: number, difficulty: number) {
  return GUESS + (1 - GUESS) / (1 + Math.exp(-SLOPE * (theta - difficulty)));
}

export type Response = { difficulty: number; correct: boolean };

/** Ước lượng theta (MAP trên lưới) và độ lệch chuẩn của ước lượng. */
export function estimateTheta(responses: readonly Response[]): { theta: number; se: number } {
  const step = 0.02;
  let bestTheta = PRIOR_MEAN;
  let bestLog = -Infinity;
  const grid: { theta: number; weight: number }[] = [];
  const logs: number[] = [];
  for (let theta = THETA_MIN; theta <= THETA_MAX + 1e-9; theta += step) {
    let log = -((theta - PRIOR_MEAN) ** 2) / (2 * PRIOR_SD ** 2);
    for (const response of responses) {
      const p = probabilityCorrect(theta, response.difficulty);
      log += Math.log(response.correct ? p : 1 - p);
    }
    grid.push({ theta, weight: 0 });
    logs.push(log);
    if (log > bestLog) {
      bestLog = log;
      bestTheta = theta;
    }
  }
  let total = 0;
  for (let i = 0; i < grid.length; i += 1) {
    grid[i].weight = Math.exp(logs[i] - bestLog);
    total += grid[i].weight;
  }
  let mean = 0;
  for (const point of grid) mean += (point.theta * point.weight) / total;
  let variance = 0;
  for (const point of grid) variance += ((point.theta - mean) ** 2 * point.weight) / total;
  return { theta: Math.round(bestTheta * 100) / 100, se: Math.sqrt(variance) };
}

/** Điểm 0–599: mỗi 100 điểm ứng với một bậc CEFR (0–99 = A1 … 500–599 = C2). */
export function scoreFromTheta(theta: number) {
  return Math.max(0, Math.min(599, Math.round((theta - THETA_MIN) * 100)));
}

export function levelFromScore(score: number): CefrLevel {
  return CEFR_LEVELS[Math.min(CEFR_LEVELS.length - 1, Math.max(0, Math.floor(score / 100)))] as CefrLevel;
}

export type Candidate = { id: string; skill: Skill; level: CefrLevel };

/**
 * Chọn câu tiếp theo: kỹ năng đang "thiếu" nhiều nhất so với chỉ tiêu, rồi câu có mức gần theta nhất
 * (hòa thì chọn ngẫu nhiên). Hết câu của kỹ năng đó thì chuyển sang kỹ năng khác.
 */
export function pickNext(
  candidates: readonly Candidate[],
  used: ReadonlySet<string>,
  counts: Readonly<Record<Skill, number>>,
  theta: number,
  random: () => number = Math.random,
): Candidate | null {
  const free = candidates.filter((candidate) => !used.has(candidate.id));
  const order = [...SKILLS].sort((a, b) => SKILL_QUOTA[b] - counts[b] - (SKILL_QUOTA[a] - counts[a]));
  for (const skill of order) {
    if (counts[skill] >= SKILL_QUOTA[skill]) continue;
    const pool = free.filter((candidate) => candidate.skill === skill);
    if (pool.length === 0) continue;
    const distance = (candidate: Candidate) => Math.abs(difficultyOf(candidate.level) - theta);
    const best = Math.min(...pool.map(distance));
    const near = pool.filter((candidate) => distance(candidate) - best < 0.35);
    return near[Math.floor(random() * near.length)] ?? null;
  }
  return null;
}

export type SkillResult = { skill: Skill; label: string; correct: number; total: number; level: CefrLevel | null };

export type AssessmentResult = {
  theta: number;
  se: number;
  score: number;
  /** Khoảng sai số (± điểm) làm tròn tới 10. */
  margin: number;
  level: CefrLevel;
  answered: number;
  correct: number;
  skills: SkillResult[];
};

export type AnsweredItem = { skill: Skill; level: CefrLevel; correct: boolean };

export function summarise(items: readonly AnsweredItem[]): AssessmentResult {
  const overall = estimateTheta(items.map((item) => ({ difficulty: difficultyOf(item.level), correct: item.correct })));
  const score = scoreFromTheta(overall.theta);
  const skills: SkillResult[] = SKILLS.map((skill) => {
    const own = items.filter((item) => item.skill === skill);
    const level =
      own.length >= 4
        ? levelFromScore(scoreFromTheta(estimateTheta(own.map((item) => ({ difficulty: difficultyOf(item.level), correct: item.correct }))).theta))
        : null;
    return { skill, label: SKILL_LABELS[skill], correct: own.filter((item) => item.correct).length, total: own.length, level };
  });
  return {
    theta: overall.theta,
    se: Math.round(overall.se * 100) / 100,
    score,
    margin: Math.min(200, Math.max(10, Math.round((overall.se * 100) / 10) * 10)),
    level: levelFromScore(score),
    answered: items.length,
    correct: items.filter((item) => item.correct).length,
    skills,
  };
}
