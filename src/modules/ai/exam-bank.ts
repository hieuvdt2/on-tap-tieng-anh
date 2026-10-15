import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db/client";
import { attempts, examSessions, examSpecifications, questions, stimuli } from "@/db/schema";
import { notReported } from "@/modules/questions/reports";
import { hasVietnamese } from "./questions";
import { AI_EXAM_SOURCE, type EXAM_GENERATION_STEPS } from "./generator-spec";

type ExamStep = (typeof EXAM_GENERATION_STEPS)[number];

export type BankRow = {
  id: string;
  stimulusId: string | null;
  stem: string;
  createdAt: Date;
  body: string | null;
};

type Random = () => number;

function shuffle<T>(items: T[], random: Random) {
  const pool = [...items];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}

function blankNumber(stem: string) {
  const match = stem.match(/\((\d+)\)/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

function byCreation(left: BankRow, right: BankRow) {
  return left.createdAt.getTime() - right.createdAt.getTime() || left.id.localeCompare(right.id);
}

// Số chỗ trống được viết cứng trong đoạn văn ("(27)______"), nên một đoạn chỉ đặt được vào đúng
// vị trí nó được sinh ra cho, không đánh số lại được.
function hasBlanks(body: string, start: number, count: number) {
  for (let n = start; n < start + count; n += 1) {
    if (!new RegExp(`\\(${n}\\)\\s*_{3,}`).test(body)) return false;
  }
  return true;
}

function groupByStimulus(rows: BankRow[]) {
  const groups = new Map<string, BankRow[]>();
  for (const row of rows) {
    if (!row.stimulusId) continue;
    const group = groups.get(row.stimulusId) ?? [];
    group.push(row);
    groups.set(row.stimulusId, group);
  }
  return [...groups.entries()];
}

/**
 * Chọn câu cho một phần đề từ kho, bỏ các câu trong `seen`. Trả null nếu kho không đủ.
 * `rank` (nhỏ hơn = ưu tiên hơn) thay cho chọn ngẫu nhiên — dùng khi phải dùng lại câu đã gặp.
 */
export function chooseFromBank(input: {
  step: ExamStep;
  rows: BankRow[];
  seen: Set<string>;
  random?: Random;
  rank?: (id: string) => number;
}): { ids: string[]; stimulusIds: string[] } | null {
  const { step, seen, rank } = input;
  const random = input.random ?? Math.random;
  const groupRank = (group: BankRow[]) => Math.max(...group.map((row) => rank?.(row.id) ?? 0));
  const pickGroup = (pool: [string, BankRow[]][]) =>
    rank ? [...pool].sort((left, right) => groupRank(left[1]) - groupRank(right[1]))[0] : shuffle(pool, random)[0];

  if (step.kind === "ordering") {
    const candidates = input.rows.filter((row) => !seen.has(row.id));
    const ordered = rank ? [...candidates].sort((left, right) => rank(left.id) - rank(right.id)) : shuffle(candidates, random);
    const fresh = ordered.slice(0, step.count);
    if (fresh.length < step.count) return null;
    return { ids: fresh.map((row) => row.id), stimulusIds: fresh.flatMap((row) => (row.stimulusId ? [row.stimulusId] : [])) };
  }

  // Lấy nguyên một đoạn văn chưa gặp câu nào — nếu đã gặp một phần thì học sinh đã đọc đoạn đó rồi.
  const unseen = groupByStimulus(input.rows).filter(([, group]) => group.every((row) => !seen.has(row.id)));

  if (step.kind === "reading") {
    const fits = unseen.filter(([, group]) => group.length >= step.count);
    const exact = fits.filter(([, group]) => group.length === step.count);
    const pool = exact.length > 0 ? exact : fits;
    if (pool.length === 0) return null;
    const [stimulusId, group] = pickGroup(pool);
    return { ids: [...group].sort(byCreation).slice(0, step.count).map((row) => row.id), stimulusIds: [stimulusId] };
  }

  const fits = unseen.filter(
    ([, group]) => group.length === step.count && hasBlanks(group[0].body ?? "", step.sequenceStart, step.count),
  );
  if (fits.length === 0) return null;
  const [stimulusId, group] = pickGroup(fits);
  const ordered = [...group].sort((left, right) => blankNumber(left.stem) - blankNumber(right.stem) || byCreation(left, right));
  return { ids: ordered.map((row) => row.id), stimulusIds: [stimulusId] };
}

async function questionHistory(userId: string) {
  const [attemptRows, sessionRows] = await Promise.all([
    db
      .select({ questionId: attempts.questionId, isCorrect: attempts.isCorrect, createdAt: attempts.createdAt })
      .from(attempts)
      .where(eq(attempts.userId, userId)),
    db
      .select({ questionIds: examSessions.questionIds, startedAt: examSessions.startedAt })
      .from(examSessions)
      .where(eq(examSessions.userId, userId)),
  ]);
  const lastSeen = new Map<string, number>();
  const latestAttempt = new Map<string, { at: number; correct: boolean }>();
  const touch = (id: string, at: number) => lastSeen.set(id, Math.max(lastSeen.get(id) ?? 0, at));
  for (const row of attemptRows) {
    const at = row.createdAt.getTime();
    touch(row.questionId, at);
    const previous = latestAttempt.get(row.questionId);
    if (!previous || at > previous.at) latestAttempt.set(row.questionId, { at, correct: row.isCorrect });
  }
  for (const row of sessionRows) for (const id of row.questionIds) touch(id, row.startedAt.getTime());
  const latestWrong = [...latestAttempt].flatMap(([id, attempt]) => (attempt.correct ? [] : [id]));
  return { seen: new Set(lastSeen.keys()), lastSeen, latestWrong };
}

// Câu của mã đề cố định (A, B, ...) là bài đo chuẩn để học sinh so tiến bộ; nếu đề AI dùng trước
// thì lúc làm mã đề đó học sinh đã gặp câu, điểm không còn ý nghĩa so sánh.
async function fixedFormQuestionIds() {
  const rows = await db
    .select({ questionIds: examSpecifications.questionIds })
    .from(examSpecifications)
    .where(ne(examSpecifications.source, AI_EXAM_SOURCE));
  return rows.flatMap((row) => row.questionIds ?? []);
}

/**
 * Mặc định chỉ lấy câu học sinh chưa gặp. `reuseSeen`: phương án dự phòng khi kho hết câu mới và AI
 * cũng lỗi — cho dùng lại câu đã gặp, ưu tiên câu lâu nhất chưa gặp lại, bỏ câu lần gần nhất làm sai
 * (câu đó để dành cho Ôn lỗi). Vẫn luôn bỏ câu mã đề cố định, câu bị báo sai và câu đã có trong đề này.
 */
export async function pickExamStepFromBank(input: {
  step: ExamStep;
  userId: string;
  excludeIds: string[];
  reuseSeen?: boolean;
}) {
  const [history, reserved] = await Promise.all([questionHistory(input.userId), fixedFormQuestionIds()]);
  const excluded = new Set(input.reuseSeen ? history.latestWrong : history.seen);
  for (const id of [...input.excludeIds, ...reserved]) excluded.add(id);

  const { step } = input;
  const type = step.kind === "reading" ? "single_choice" : step.kind;
  const kind = step.kind === "reading" ? "passage" : step.kind === "ordering" ? "ordering_prompt" : "gap_text";
  const rows = await db
    .select({
      id: questions.id,
      stimulusId: questions.stimulusId,
      stem: questions.stem,
      createdAt: questions.createdAt,
      body: stimuli.body,
      title: stimuli.title,
      options: questions.options,
    })
    .from(questions)
    .innerJoin(stimuli, eq(questions.stimulusId, stimuli.id))
    .where(and(eq(questions.type, type), eq(questions.status, "published"), eq(stimuli.kind, kind), notReported()));

  // Kho có sẵn nhiều đoạn/bài do model yếu viết bằng tiếng Việt (từ trước khi có kiểm tra ngôn ngữ):
  // bỏ khỏi đề mới mà không sửa hay xoá dữ liệu. Đoạn nào có một câu lỗi thì bỏ cả đoạn.
  const badStimuli = new Set(
    rows
      .filter((row) => hasVietnamese([row.title, row.body ?? "", row.stem, ...row.options.map((option) => option.text)].join("\n")))
      .flatMap((row) => (row.stimulusId ? [row.stimulusId] : [])),
  );
  const englishRows = rows.filter((row) => !row.stimulusId || !badStimuli.has(row.stimulusId));

  return chooseFromBank({
    step,
    rows: englishRows,
    seen: excluded,
    rank: input.reuseSeen ? (id) => history.lastSeen.get(id) ?? 0 : undefined,
  });
}
