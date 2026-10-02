import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { attempts, grammarTopics, questions, teacherExplanations, topics } from "@/db/schema";
import { logAIRequest } from "./log";
import { resolveAIProvider } from "./settings";
import { teacherExplanationSchema } from "./questions";
import { TEACHER_PROMPT_VERSION, buildTeacherPrompt, normalizeErrorType } from "./prompts/teacher-explanation";
import { parseWithRepair } from "./structured";

export async function saveTeacherExplanation(input: {
  attemptId: string;
  questionId: string;
  selectedAnswer: string;
}) {
  const provider = await resolveAIProvider();
  if (!provider) return;

  const existing = await db
    .select({ id: teacherExplanations.id })
    .from(teacherExplanations)
    .where(eq(teacherExplanations.attemptId, input.attemptId))
    .limit(1);
  if (existing[0]) return;

  const questionRows = await db.select().from(questions).where(eq(questions.id, input.questionId)).limit(1);
  const question = questionRows[0];
  if (!question) return;
  const topicRows = await db.select().from(topics).where(eq(topics.id, question.topicId)).limit(1);
  const grammarRows = await db.select().from(grammarTopics).where(eq(grammarTopics.topicId, question.topicId)).limit(1);
  const topic = topicRows[0];
  const grammar = grammarRows[0];
  if (!topic || !grammar) return;

  try {
    const body = await parseWithRepair({
      schema: teacherExplanationSchema,
      prompt: buildTeacherPrompt({
        topicName: topic.name,
        structure: grammar.structure,
        stem: question.stem,
        options: question.options,
        correctAnswer: question.correctAnswer,
        selectedAnswer: input.selectedAnswer,
        builtInExplanation: question.explanation,
      }),
      request: async (prompt) => {
        const started = Date.now();
        try {
          const output = await provider.generateText({
            prompt,
            operation: "teacher-explanation",
            promptVersion: TEACHER_PROMPT_VERSION,
          });
          await logAIRequest({
            provider,
            operation: "teacher-explanation",
            promptVersion: TEACHER_PROMPT_VERSION,
            inputTokens: output.inputTokens,
            outputTokens: output.outputTokens,
            latencyMs: output.latencyMs,
            status: "ok",
          });
          return output.text;
        } catch (error) {
          await logAIRequest({
            provider,
            operation: "teacher-explanation",
            promptVersion: TEACHER_PROMPT_VERSION,
            inputTokens: null,
            outputTokens: null,
            latencyMs: Date.now() - started,
            status: "error",
            error: error instanceof Error ? error.message : "Không gọi được AI.",
          });
          throw error;
        }
      },
    });
    const explanationId = crypto.randomUUID();
    const errorType = normalizeErrorType(body.errorType);
    await db.insert(teacherExplanations).values({
      id: explanationId,
      attemptId: input.attemptId,
      questionId: question.id,
      body: { ...body, errorType },
      promptVersion: TEACHER_PROMPT_VERSION,
    });
    await db.update(attempts).set({ explanationId, errorType }).where(eq(attempts.id, input.attemptId));
  } catch {
    // Lời giải có sẵn trong câu vẫn hiện được.
  }
}
