import type { AIProvider, GenerateTextInput, GenerateTextOutput } from "./provider";
import { fetchWithRetry } from "./retry";

type GroqResponse = {
  choices?: { message?: { content?: string | null } }[];
  usage?: { prompt_tokens?: number; completion_tokens?: number };
  error?: { message?: string; failed_generation?: string };
};

function reasoningOptions(model: string) {
  if (/gpt-oss/i.test(model)) return { reasoning_effort: "low", include_reasoning: false };
  if (/qwen/i.test(model)) return { reasoning_effort: "none", reasoning_format: "hidden" };
  return {};
}

export class GroqProvider implements AIProvider {
  readonly name = "groq";

  constructor(
    private readonly apiKey: string,
    readonly model: string,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  async generateText(input: GenerateTextInput): Promise<GenerateTextOutput> {
    const started = Date.now();
    const response = await fetchWithRetry(this.fetchImpl, "https://api.groq.com/openai/v1/chat/completions", () => ({
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        temperature: 0.3,
        max_completion_tokens: 8192,
        response_format: { type: "json_object" },
        ...reasoningOptions(this.model),
        messages: [
          { role: "system", content: "Reply with one valid JSON object only. No markdown." },
          { role: "user", content: input.prompt },
        ],
      }),
      signal: AbortSignal.timeout(120_000),
    }));
    const payload = (await response.json()) as GroqResponse;
    if (!response.ok) {
      const failed = payload.error?.failed_generation?.trim();
      if (failed?.includes("{")) {
        return {
          text: failed,
          inputTokens: payload.usage?.prompt_tokens ?? null,
          outputTokens: payload.usage?.completion_tokens ?? null,
          latencyMs: Date.now() - started,
        };
      }
      const message = payload.error?.message ?? "";
      if (/failed to generate json/i.test(message)) {
        throw new Error("Model Groq không tạo được JSON. Hãy bấm Tiếp tục tạo, hoặc chọn model khác trong Thiết lập AI.");
      }
      throw new Error(message || "Groq không trả lời.");
    }
    const text = payload.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("Groq không trả JSON.");
    return {
      text,
      inputTokens: payload.usage?.prompt_tokens ?? null,
      outputTokens: payload.usage?.completion_tokens ?? null,
      latencyMs: Date.now() - started,
    };
  }
}
