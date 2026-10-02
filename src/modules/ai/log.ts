import { db } from "@/db/client";
import { aiRequestLogs } from "@/db/schema";
import type { AIProvider } from "./provider";

export async function logAIRequest(input: {
  provider: AIProvider;
  operation: string;
  promptVersion: string;
  inputTokens: number | null;
  outputTokens: number | null;
  latencyMs: number;
  status: "ok" | "error";
  error?: string;
}) {
  try {
    await db.insert(aiRequestLogs).values({
      id: crypto.randomUUID(),
      provider: input.provider.name,
      model: input.provider.model,
      operation: input.operation,
      promptVersion: input.promptVersion,
      inputTokens: input.inputTokens,
      outputTokens: input.outputTokens,
      latencyMs: input.latencyMs,
      status: input.status,
      error: input.error ?? null,
    });
  } catch {
    // Nhật ký không được làm hỏng phiên luyện.
  }
}
