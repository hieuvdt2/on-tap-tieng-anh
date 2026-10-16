import { and, asc, eq, isNull, lte, notInArray, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { topics, vocabActivity, vocabMarks, vocabProgress, vocabReports, vocabWords } from "@/db/schema";
import { KNOWN_BOX } from "./srs";
import { computeStreak, vnDay } from "./streak";
import { OTHER_THEME, WORD_THEMES, type WordTheme } from "./themes";

export const DAILY_NEW_GOAL = 10;

export type VocabCard = {
  id: string;
  headword: string;
  wordClass: string;
  ipa: string | null;
  meaningVi: string;
  example: string;
  note: string;
  topicName: string | null;
  marked: boolean;
  /** Nghĩa nhập từ danh sách ngoài, chưa được người kiểm duyệt. */
  unverified: boolean;
  family: string | null;
};

const REPORTS_TO_HIDE = 2;

// Người báo sai thì từ ẩn ngay với riêng họ; đủ nhiều người báo thì ẩn với mọi người cho đến khi được sửa.
// Một lượt báo nhầm hay phá không làm mất từ của cả hệ thống.
function notReported(userId?: string) {
  const byThisUser = userId
    ? sql`exists(select 1 from ${vocabReports} where ${vocabReports.wordId} = ${vocabWords.id} and ${vocabReports.userId} = ${userId})`
    : sql`false`;
  return sql`not (${byThisUser} or (select count(*) from ${vocabReports} where ${vocabReports.wordId} = ${vocabWords.id}) >= ${REPORTS_TO_HIDE})`;
}

export type ThemeFilter = WordTheme | typeof OTHER_THEME | null;

// Lọc theo chủ đề: slug chủ đề, "other" = chưa có chủ đề, null = không lọc.
function themeCondition(theme: ThemeFilter) {
  if (!theme) return sql`true`;
  if (theme === OTHER_THEME) return isNull(vocabWords.theme);
  return eq(vocabWords.theme, theme);
}

function markedFlag(userId: string) {
  return sql<boolean>`exists(select 1 from ${vocabMarks} where ${vocabMarks.wordId} = ${vocabWords.id} and ${vocabMarks.userId} = ${userId})`;
}

function cardColumns(userId: string) {
  return {
    id: vocabWords.id,
    headword: vocabWords.headword,
    wordClass: vocabWords.wordClass,
    ipa: vocabWords.ipa,
    meaningVi: vocabWords.meaningVi,
    example: vocabWords.example,
    note: vocabWords.note,
    topicName: topics.name,
    marked: markedFlag(userId),
    unverified: sql<boolean>`${vocabWords.provenance} = 'imported'`,
    family: vocabWords.family,
  };
}

export async function getVocabStats(userId: string) {
  const [bank] = await db.select({ total: sql<number>`count(*)::int` }).from(vocabWords).where(notReported(userId));
  const rows = await db
    .select({
      learned: sql<number>`count(*)::int`,
      due: sql<number>`count(*) filter (where ${vocabProgress.dueAt} <= now())::int`,
      known: sql<number>`count(*) filter (where ${vocabProgress.box} >= ${KNOWN_BOX})::int`,
    })
    .from(vocabProgress)
    .where(eq(vocabProgress.userId, userId));
  const [marks] = await db
    .select({ marked: sql<number>`count(*)::int` })
    .from(vocabMarks)
    .where(eq(vocabMarks.userId, userId));
  const total = bank?.total ?? 0;
  const learned = rows[0]?.learned ?? 0;
  return {
    total,
    learned,
    // Đã xem nhưng chưa thuộc (còn phải ôn lại).
    learning: Math.max(0, learned - (rows[0]?.known ?? 0)),
    due: rows[0]?.due ?? 0,
    known: rows[0]?.known ?? 0,
    marked: marks?.marked ?? 0,
    unseen: Math.max(0, total - learned),
  };
}

/**
 * Từ chưa học của người này, ngẫu nhiên nhưng mỗi họ từ (amaze/amazed/amazing…) chỉ một dạng trong một
 * buổi để không học trùng; các dạng còn lại sẽ đến ở buổi sau.
 */
export async function nextNewWords(userId: string, limit: number, theme: ThemeFilter = null): Promise<VocabCard[]> {
  const seen = db.select({ id: vocabProgress.wordId }).from(vocabProgress).where(eq(vocabProgress.userId, userId));
  const rows = await db
    .select(cardColumns(userId))
    .from(vocabWords)
    .leftJoin(topics, eq(vocabWords.topicId, topics.id))
    .where(and(notInArray(vocabWords.id, seen), notReported(userId), themeCondition(theme)))
    .orderBy(sql`random()`)
    .limit(limit * 4);
  const families = new Set<string>();
  const picked: VocabCard[] = [];
  for (const row of rows) {
    const key = row.family ?? row.id;
    if (families.has(key)) continue;
    families.add(key);
    picked.push(row);
    if (picked.length >= limit) break;
  }
  return picked;
}

/** Các dạng cùng họ (chưa kể chính từ đó) để hiện khi học: id từ → danh sách từ cùng họ. */
export async function relativesOf(words: VocabCard[]): Promise<Record<string, string[]>> {
  const families = [...new Set(words.map((word) => word.family).filter((f): f is string => Boolean(f)))];
  if (families.length === 0) return {};
  const rows = await db
    .select({ id: vocabWords.id, headword: vocabWords.headword, family: vocabWords.family })
    .from(vocabWords)
    .where(sql`${vocabWords.family} in ${families}`);
  const result: Record<string, string[]> = {};
  for (const word of words) {
    result[word.id] = rows
      .filter((row) => row.family === word.family && row.id !== word.id)
      .map((row) => row.headword)
      .slice(0, 5);
  }
  return result;
}

export async function dueWords(userId: string, limit: number, theme: ThemeFilter = null): Promise<VocabCard[]> {
  return db
    .select(cardColumns(userId))
    .from(vocabProgress)
    .innerJoin(vocabWords, eq(vocabProgress.wordId, vocabWords.id))
    .leftJoin(topics, eq(vocabWords.topicId, topics.id))
    .where(and(eq(vocabProgress.userId, userId), lte(vocabProgress.dueAt, sql`now()`), notReported(userId), themeCondition(theme)))
    .orderBy(asc(vocabProgress.dueAt))
    .limit(limit);
}

/** Ba nghĩa sai cho mỗi từ, ưu tiên cùng loại từ để không lộ đáp án qua dạng từ. */
export async function distractorMeanings(words: VocabCard[]): Promise<Record<string, string[]>> {
  if (words.length === 0) return {};
  const ids = words.map((word) => word.id);
  const pool = await db
    .select({ id: vocabWords.id, meaningVi: vocabWords.meaningVi, wordClass: vocabWords.wordClass })
    .from(vocabWords)
    .where(and(notInArray(vocabWords.id, ids), notReported()))
    .orderBy(sql`random()`)
    .limit(80);
  const result: Record<string, string[]> = {};
  for (const word of words) {
    const same = pool.filter((item) => item.wordClass === word.wordClass && item.meaningVi !== word.meaningVi);
    const others = pool.filter((item) => item.wordClass !== word.wordClass && item.meaningVi !== word.meaningVi);
    const picked = [...same, ...others].slice(0, 3).map((item) => item.meaningVi);
    result[word.id] = picked;
  }
  return result;
}

export async function existingHeadwords(topicId: string | null) {
  const rows = await db
    .select({ key: vocabWords.headwordKey })
    .from(vocabWords)
    .where(topicId ? eq(vocabWords.topicId, topicId) : isNull(vocabWords.topicId));
  return rows.map((row) => row.key);
}

export async function markedWords(userId: string, limit = 200): Promise<VocabCard[]> {
  return db
    .select(cardColumns(userId))
    .from(vocabMarks)
    .innerJoin(vocabWords, eq(vocabMarks.wordId, vocabWords.id))
    .leftJoin(topics, eq(vocabWords.topicId, topics.id))
    .where(and(eq(vocabMarks.userId, userId), notReported(userId)))
    .orderBy(asc(vocabMarks.createdAt))
    .limit(limit);
}

/** Từ đã đánh dấu để luyện (kể cả chưa đến hạn ôn), xáo ngẫu nhiên. */
export async function markedForPractice(userId: string, limit: number): Promise<VocabCard[]> {
  return db
    .select(cardColumns(userId))
    .from(vocabMarks)
    .innerJoin(vocabWords, eq(vocabMarks.wordId, vocabWords.id))
    .leftJoin(topics, eq(vocabWords.topicId, topics.id))
    .where(and(eq(vocabMarks.userId, userId), notReported(userId)))
    .orderBy(sql`random()`)
    .limit(limit);
}

/** Từ đã học để luyện thêm, không cần đến hạn. `recent` lấy các từ học gần nhất, còn lại lấy ngẫu nhiên. */
export async function learnedForPractice(
  userId: string,
  limit: number,
  recent = false,
  theme: ThemeFilter = null,
): Promise<VocabCard[]> {
  return db
    .select(cardColumns(userId))
    .from(vocabProgress)
    .innerJoin(vocabWords, eq(vocabProgress.wordId, vocabWords.id))
    .leftJoin(topics, eq(vocabWords.topicId, topics.id))
    .where(and(eq(vocabProgress.userId, userId), notReported(userId), themeCondition(theme)))
    .orderBy(recent ? sql`${vocabProgress.createdAt} desc` : sql`random()`)
    .limit(limit);
}

/** Luyện tự do: ưu tiên từ đã học, chưa đủ thì lấy thêm từ ngẫu nhiên trong kho. */
export async function anyForPractice(userId: string, limit: number, theme: ThemeFilter = null): Promise<VocabCard[]> {
  const learned = await learnedForPractice(userId, limit, false, theme);
  if (learned.length >= limit) return learned;
  const rows = await db
    .select(cardColumns(userId))
    .from(vocabWords)
    .leftJoin(topics, eq(vocabWords.topicId, topics.id))
    .where(
      learned.length > 0
        ? and(notInArray(vocabWords.id, learned.map((word) => word.id)), notReported(userId), themeCondition(theme))
        : and(notReported(userId), themeCondition(theme)),
    )
    .orderBy(sql`random()`)
    .limit(limit - learned.length);
  return [...learned, ...rows];
}

export type ThemeStat = { slug: string; label: string; total: number; learned: number; known: number };

/** Số từ và số từ đã học của từng chủ đề (kể cả nhóm "khác"), bỏ qua từ đã bị báo sai. */
export async function getThemeStats(userId: string): Promise<ThemeStat[]> {
  const rows = await db
    .select({
      theme: vocabWords.theme,
      total: sql<number>`count(*)::int`,
      learned: sql<number>`count(${vocabProgress.wordId})::int`,
      known: sql<number>`count(*) filter (where ${vocabProgress.box} >= ${KNOWN_BOX})::int`,
    })
    .from(vocabWords)
    .leftJoin(vocabProgress, and(eq(vocabProgress.wordId, vocabWords.id), eq(vocabProgress.userId, userId)))
    .where(notReported(userId))
    .groupBy(vocabWords.theme);
  const byTheme = new Map(rows.map((row) => [row.theme ?? OTHER_THEME, row]));
  const ordered = [...WORD_THEMES.map((t) => ({ slug: t.slug as string, label: t.label })), { slug: OTHER_THEME, label: "Từ thông dụng khác" }];
  return ordered
    .map((t) => ({ ...t, total: byTheme.get(t.slug)?.total ?? 0, learned: byTheme.get(t.slug)?.learned ?? 0, known: byTheme.get(t.slug)?.known ?? 0 }))
    .filter((t) => t.total > 0);
}

export type TodaySummary = {
  newDone: number;
  reviewsDone: number;
  newGoal: number;
  due: number;
  unseen: number;
  streak: number;
  studiedToday: boolean;
};

export async function getTodaySummary(userId: string): Promise<TodaySummary> {
  const today = vnDay();
  const [activityRows, stats, due] = await Promise.all([
    db.select({ day: vocabActivity.day, newWords: vocabActivity.newWords, reviews: vocabActivity.reviews }).from(vocabActivity).where(eq(vocabActivity.userId, userId)),
    getVocabStats(userId),
    db
      .select({ n: sql<number>`count(*)::int` })
      .from(vocabProgress)
      .innerJoin(vocabWords, eq(vocabProgress.wordId, vocabWords.id))
      .where(and(eq(vocabProgress.userId, userId), lte(vocabProgress.dueAt, sql`now()`), notReported(userId))),
  ]);
  const todayRow = activityRows.find((row) => row.day === today);
  return {
    newDone: todayRow?.newWords ?? 0,
    reviewsDone: todayRow?.reviews ?? 0,
    newGoal: DAILY_NEW_GOAL,
    due: due[0]?.n ?? 0,
    unseen: stats.unseen,
    streak: computeStreak(activityRows.filter((row) => row.newWords + row.reviews > 0).map((row) => row.day), today),
    studiedToday: Boolean(todayRow && todayRow.newWords + todayRow.reviews > 0),
  };
}

export type DetailedStats = {
  forecast: { label: string; count: number }[];
  accuracy: number | null;
  answered: number;
  stages: { learning: number; known: number };
  hard: (VocabCard & { wrong: number; correct: number })[];
};

export async function getDetailedStats(userId: string): Promise<DetailedStats> {
  const dayExpr = sql<string>`to_char(${vocabProgress.dueAt} at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM-DD')`;
  const [dueByDay, totals, hardRows] = await Promise.all([
    db
      .select({ day: dayExpr, n: sql<number>`count(*)::int` })
      .from(vocabProgress)
      .innerJoin(vocabWords, eq(vocabProgress.wordId, vocabWords.id))
      .where(and(eq(vocabProgress.userId, userId), notReported(userId)))
      .groupBy(dayExpr),
    db
      .select({
        correct: sql<number>`coalesce(sum(${vocabProgress.correct}), 0)::int`,
        wrong: sql<number>`coalesce(sum(${vocabProgress.wrong}), 0)::int`,
        known: sql<number>`count(*) filter (where ${vocabProgress.box} >= ${KNOWN_BOX})::int`,
        learning: sql<number>`count(*) filter (where ${vocabProgress.box} < ${KNOWN_BOX})::int`,
      })
      .from(vocabProgress)
      .where(eq(vocabProgress.userId, userId)),
    db
      .select({ ...cardColumns(userId), wrong: vocabProgress.wrong, correct: vocabProgress.correct })
      .from(vocabProgress)
      .innerJoin(vocabWords, eq(vocabProgress.wordId, vocabWords.id))
      .leftJoin(topics, eq(vocabWords.topicId, topics.id))
      .where(and(eq(vocabProgress.userId, userId), notReported(userId), sql`${vocabProgress.wrong} >= 2`))
      .orderBy(sql`${vocabProgress.wrong} desc`, sql`${vocabProgress.correct} asc`)
      .limit(15),
  ]);
  const todayKey = vnDay();
  const counts = new Map<string, number>();
  for (const row of dueByDay) {
    // Từ quá hạn gộp vào hôm nay.
    const key = row.day < todayKey ? todayKey : row.day;
    counts.set(key, (counts.get(key) ?? 0) + row.n);
  }
  const forecast = Array.from({ length: 7 }, (_, offset) => {
    const date = new Date(Date.now() + offset * 24 * 60 * 60 * 1000);
    const key = vnDay(date);
    return { label: offset === 0 ? "Hôm nay" : offset === 1 ? "Ngày mai" : key.slice(5).replace("-", "/"), count: counts.get(key) ?? 0 };
  });
  const t = totals[0];
  const answered = (t?.correct ?? 0) + (t?.wrong ?? 0);
  return {
    forecast,
    accuracy: answered > 0 ? Math.round(((t?.correct ?? 0) / answered) * 100) : null,
    answered,
    stages: { learning: t?.learning ?? 0, known: t?.known ?? 0 },
    hard: hardRows,
  };
}

/** Từ hay sai (sai từ 2 lần trở lên), sai nhiều nhất trước, để luyện lại riêng. */
export async function hardForPractice(userId: string, limit: number): Promise<VocabCard[]> {
  return db
    .select(cardColumns(userId))
    .from(vocabProgress)
    .innerJoin(vocabWords, eq(vocabProgress.wordId, vocabWords.id))
    .leftJoin(topics, eq(vocabWords.topicId, topics.id))
    .where(and(eq(vocabProgress.userId, userId), notReported(userId), sql`${vocabProgress.wrong} >= 2`))
    .orderBy(sql`${vocabProgress.wrong} desc`, sql`random()`)
    .limit(limit);
}
