import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export type QuestionOption = { id: string; text: string };
export type WrongExplanation = { optionId: string; explanation: string };
export type GrammarExample = { sentence: string; note: string };
export type GrammarMistake = { wrong: string; right: string; why: string };
export type GrammarComparison = { with: string; note: string };
export type ExamSection = { questionType: string; label: string; count: number };
export type ExamGenerationPage = {
  questionIds: string[];
  instruction: string;
};

export type GenerationJobConfig = {
  topicId?: string;
  topicSlug?: string;
  sourceQuestionIds?: string[];
  examSessionId?: string;
  pages?: ExamGenerationPage[];
  /** Câu dùng lại (học sinh đã gặp) vì kho hết câu mới và AI lỗi — để báo cho học sinh biết. */
  reusedQuestionIds?: string[];
  /** Độ khó người học chọn khi tạo (bỏ trống = tự động). */
  difficulty?: "easy" | "medium" | "hard";
};

export const users = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  username: text("username"),
  passwordHash: text("password_hash"),
  aiProvider: text("ai_provider"),
  geminiApiKey: text("gemini_api_key"),
  groqApiKey: text("groq_api_key"),
  openrouterApiKey: text("openrouter_api_key"),
  aiModel: text("ai_model"),
  guideSeenAt: timestamp("guide_seen_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [uniqueIndex("user_username_unique").on(sql`lower(${table.username})`)]);

export const authSessions = pgTable("auth_session", {
  tokenHash: text("token_hash").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const generationJobs = pgTable("generation_job", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  kind: text("kind").notNull(),
  config: jsonb("config").$type<GenerationJobConfig>().notNull(),
  status: text("status").notNull(),
  step: integer("step").notNull().default(0),
  targetCount: integer("target_count").notNull(),
  questionIds: jsonb("question_ids").$type<string[]>().notNull(),
  stimulusIds: jsonb("stimulus_ids").$type<string[]>().notNull(),
  specificationId: text("specification_id"),
  error: text("error"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export const topics = pgTable("topic", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull(),
  name: text("name").notNull(),
  skill: text("skill").notNull(),
  gradeFrom: integer("grade_from").notNull(),
  gradeTo: integer("grade_to").notNull(),
  summary: text("summary").notNull(),
}, (table) => [uniqueIndex("topic_slug_unique").on(table.slug)]);

export type VocabularyItem = {
  word: string;
  meaningVi: string;
  wordClass: string;
  example: string;
  note: string;
};

export type VocabularyCollocation = {
  phrase: string;
  meaningVi: string;
  example: string;
};

export const vocabularyTopics = pgTable("vocabulary_topic", {
  topicId: text("topic_id").primaryKey().references(() => topics.id),
  overview: text("overview").notNull(),
  items: jsonb("items").$type<VocabularyItem[]>().notNull(),
  collocations: jsonb("collocations").$type<VocabularyCollocation[]>().notNull(),
  commonMistakes: jsonb("common_mistakes").$type<GrammarMistake[]>().notNull(),
  prerequisiteSlugs: jsonb("prerequisite_slugs").$type<string[]>().notNull(),
});

// Kho từ vựng dùng chung cho mọi người học; tiến độ học từng người nằm ở vocab_progress.
export const vocabWords = pgTable("vocab_word", {
  id: text("id").primaryKey(),
  headword: text("headword").notNull(),
  headwordKey: text("headword_key").notNull(),
  wordClass: text("word_class").notNull(),
  ipa: text("ipa"),
  meaningVi: text("meaning_vi").notNull(),
  example: text("example").notNull(),
  note: text("note").notNull().default(""),
  topicId: text("topic_id").references(() => topics.id),
  // Chủ đề từ vựng (slug trong modules/vocabulary/themes.ts); null = "Từ thông dụng khác".
  theme: text("theme"),
  // Từ gốc của họ từ (amaze cho amazed/amazing…), dùng để không học trùng họ từ trong một buổi.
  family: text("family"),
  provenance: text("provenance").notNull(),
  generationModel: text("generation_model"),
  createdBy: text("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [uniqueIndex("vocab_word_headword_key_unique").on(table.headwordKey)]);

export const vocabProgress = pgTable("vocab_progress", {
  userId: text("user_id").notNull().references(() => users.id),
  wordId: text("word_id").notNull().references(() => vocabWords.id),
  box: integer("box").notNull().default(0),
  dueAt: timestamp("due_at", { withTimezone: true }).notNull(),
  correct: integer("correct").notNull().default(0),
  wrong: integer("wrong").notNull().default(0),
  lastReviewedAt: timestamp("last_reviewed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  primaryKey({ columns: [table.userId, table.wordId] }),
  index("vocab_progress_user_due_idx").on(table.userId, table.dueAt),
]);

// Từ người học tự đánh dấu để xem lại/luyện riêng; tách khỏi vocab_progress vì có thể đánh dấu từ chưa học.
export const vocabMarks = pgTable("vocab_mark", {
  userId: text("user_id").notNull().references(() => users.id),
  wordId: text("word_id").notNull().references(() => vocabWords.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [primaryKey({ columns: [table.userId, table.wordId] })]);

// Báo nghĩa/ví dụ sai của một từ. Từ đã bị báo bị loại khỏi lượt học và luyện cho đến khi được sửa.
export const vocabReports = pgTable("vocab_report", {
  userId: text("user_id").notNull().references(() => users.id),
  wordId: text("word_id").notNull().references(() => vocabWords.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [primaryKey({ columns: [table.userId, table.wordId] })]);

// Hoạt động học từ vựng theo ngày (giờ Việt Nam) để tính mục tiêu ngày và chuỗi ngày học.
export const vocabActivity = pgTable("vocab_activity", {
  userId: text("user_id").notNull().references(() => users.id),
  day: text("day").notNull(),
  newWords: integer("new_words").notNull().default(0),
  reviews: integer("reviews").notNull().default(0),
}, (table) => [primaryKey({ columns: [table.userId, table.day] })]);

export type AssessmentItemRecord = {
  questionId: string;
  skill: string;
  level: string;
  answer: string;
  correct: boolean;
};

// Bài đánh giá năng lực (thích ứng, theo thang CEFR quốc tế). Mỗi lần làm là một phiên.
export const assessmentSessions = pgTable("assessment_session", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  status: text("status").notNull(),
  items: jsonb("items").$type<AssessmentItemRecord[]>().notNull(),
  // Câu đang chờ trả lời (để tải lại trang vẫn tiếp tục đúng câu).
  current: jsonb("current").$type<{ questionId: string; skill: string; level: string } | null>(),
  score: integer("score"),
  level: text("level"),
  result: jsonb("result").$type<Record<string, unknown> | null>(),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  finishedAt: timestamp("finished_at", { withTimezone: true }),
}, (table) => [index("assessment_session_user_idx").on(table.userId, table.startedAt)]);

export const grammarTopics = pgTable("grammar_topic", {
  topicId: text("topic_id").primaryKey().references(() => topics.id),
  purpose: text("purpose").notNull(),
  usage: text("usage").notNull(),
  structure: text("structure").notNull(),
  affirmativePattern: text("affirmative_pattern").notNull(),
  negativePattern: text("negative_pattern").notNull(),
  questionPattern: text("question_pattern").notNull(),
  signalWords: jsonb("signal_words").$type<string[]>().notNull(),
  examples: jsonb("examples").$type<GrammarExample[]>().notNull(),
  commonMistakes: jsonb("common_mistakes").$type<GrammarMistake[]>().notNull(),
  comparisons: jsonb("comparisons").$type<GrammarComparison[]>().notNull(),
  prerequisiteSlugs: jsonb("prerequisite_slugs").$type<string[]>().notNull(),
});

export const questions = pgTable("question", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  stimulusId: text("stimulus_id"),
  stem: text("stem").notNull(),
  options: jsonb("options").$type<QuestionOption[]>().notNull(),
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation").notNull(),
  wrongAnswerExplanations: jsonb("wrong_answer_explanations").$type<WrongExplanation[]>().notNull(),
  difficulty: text("difficulty").notNull(),
  // Trình độ CEFR (A1–C2). Câu cũ được ước lượng thô từ độ khó; null = chưa gán.
  cefr: text("cefr"),
  // Nguồn của nhãn CEFR: "authored" (soạn tay theo bậc), "ai" (AI tạo theo bậc) hoặc "heuristic" (ước lượng thô từ
  // độ khó). Bài đánh giá năng lực chỉ dùng câu authored/ai.
  cefrSource: text("cefr_source"),
  topicId: text("topic_id").notNull().references(() => topics.id),
  grade: integer("grade").notNull(),
  status: text("status").notNull(),
  provenance: text("provenance").notNull(),
  contentHash: text("content_hash").notNull(),
  duplicateOfId: text("duplicate_of_id"),
  generationModel: text("generation_model"),
  promptVersion: text("prompt_version"),
  validationNotes: text("validation_notes"),
  createdBy: text("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [uniqueIndex("question_content_hash_unique").on(table.contentHash)]);

export const QUESTION_REPORT_REASONS = ["wrong_answer", "unclear", "other"] as const;

export const questionReports = pgTable("question_report", {
  id: text("id").primaryKey(),
  questionId: text("question_id").notNull().references(() => questions.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  reason: text("reason").$type<(typeof QUESTION_REPORT_REASONS)[number]>().notNull(),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [uniqueIndex("question_report_question_user_unique").on(table.questionId, table.userId)]);

export const practiceSessions = pgTable("practice_session", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  topicId: text("topic_id").references(() => topics.id),
  mode: text("mode").notNull(),
  questionIds: jsonb("question_ids").$type<string[]>().notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  finishedAt: timestamp("finished_at", { withTimezone: true }),
  estimatedLevel: text("estimated_level"),
  summary: text("summary"),
});

export const attempts = pgTable("attempt", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull().references(() => practiceSessions.id),
  userId: text("user_id").notNull().references(() => users.id),
  questionId: text("question_id").notNull().references(() => questions.id),
  topicId: text("topic_id").notNull().references(() => topics.id),
  selectedAnswer: text("selected_answer").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  errorType: text("error_type"),
  explanationId: text("explanation_id"),
  responseTimeMs: integer("response_time_ms"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [uniqueIndex("attempt_session_question_unique").on(table.sessionId, table.questionId)]);

export const topicMastery = pgTable("topic_mastery", {
  userId: text("user_id").notNull().references(() => users.id),
  topicId: text("topic_id").notNull().references(() => topics.id),
  attempts: integer("attempts").notNull(),
  correct: integer("correct").notNull(),
  masteryScore: real("mastery_score").notNull(),
  level: text("level").notNull(),
  lastPracticedAt: timestamp("last_practiced_at", { withTimezone: true }).notNull(),
}, (table) => [primaryKey({ columns: [table.userId, table.topicId] })]);

export type TeacherExplanationBody = {
  errorType: string;
  correctAnswer: string;
  whyCorrect: string;
  whyWrong: string;
  rule: string;
  structure: string;
  signalWords: string;
  commonMistake: string;
  comparison: string;
  shortExample: string;
  practicePrompt: string;
};

export const aiRequestLogs = pgTable("ai_request_log", {
  id: text("id").primaryKey(),
  provider: text("provider").notNull(),
  model: text("model").notNull(),
  operation: text("operation").notNull(),
  promptVersion: text("prompt_version").notNull(),
  inputTokens: integer("input_tokens"),
  outputTokens: integer("output_tokens"),
  latencyMs: integer("latency_ms").notNull(),
  status: text("status").notNull(),
  error: text("error"),
  // Chủ yêu cầu; dùng để đếm lượt khi dài hạn dùng khóa AI chung. Nhật ký cũ để trống.
  userId: text("user_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index("ai_request_log_user_created_idx").on(table.userId, table.createdAt)]);

export const teacherExplanations = pgTable("teacher_explanation", {
  id: text("id").primaryKey(),
  attemptId: text("attempt_id").notNull().references(() => attempts.id),
  questionId: text("question_id").notNull().references(() => questions.id),
  body: jsonb("body").$type<TeacherExplanationBody>().notNull(),
  promptVersion: text("prompt_version").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [uniqueIndex("teacher_explanation_attempt_unique").on(table.attemptId)]);

export const stimuli = pgTable("stimulus", {
  id: text("id").primaryKey(),
  kind: text("kind").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  topicId: text("topic_id").references(() => topics.id),
  wordCount: integer("word_count").notNull(),
});

export const examSpecifications = pgTable("exam_specification", {
  id: text("id").primaryKey(),
  yearLabel: text("year_label").notNull(),
  version: text("version").notNull(),
  status: text("status").notNull(),
  source: text("source").notNull(),
  questionCount: integer("question_count").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  sections: jsonb("sections").$type<ExamSection[]>().notNull(),
  notes: text("notes").notNull(),
  questionIds: jsonb("question_ids").$type<string[]>(),
});

export const examSessions = pgTable("exam_session", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  specificationId: text("specification_id").notNull().references(() => examSpecifications.id),
  questionIds: jsonb("question_ids").$type<string[]>().notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
  submittedAt: timestamp("submitted_at", { withTimezone: true }),
  score: real("score"),
  answers: jsonb("answers").$type<Record<string, string>>(),
});
