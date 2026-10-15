import type { AIProvider, GenerateTextInput, GenerateTextOutput, SharedUse } from "./provider";
import { fetchWithRetry } from "./retry";

type OpenAIResponse = {
  choices?: { message?: { content?: string | null } }[];
  usage?: { prompt_tokens?: number; completion_tokens?: number };
  error?: { message?: string };
};

export class OpenAIProvider implements AIProvider {
  readonly name = "openai";
  readonly userId?: string;

  constructor(
    private readonly apiKey: string,
    readonly model: string,
    private readonly shared?: SharedUse,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {
    this.userId = shared?.userId;
  }

  async generateText(input: GenerateTextInput): Promise<GenerateTextOutput> {
    // Khóa này là của người vận hành nên kiểm tra hạn mức của người dùng TRƯỚC khi gọi.
    await this.shared?.guard();
    const started = Date.now();
    const response = await fetchWithRetry(this.fetchImpl, "https://api.openai.com/v1/chat/completions", () => ({
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${this.apiKey}`,
      },
      // Không đặt temperature: một số model OpenAI chỉ nhận giá trị mặc định.
      body: JSON.stringify({
        model: this.model,
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: input.prompt }],
      }),
      signal: AbortSignal.timeout(120_000),
    }));
    const payload = (await response.json()) as OpenAIResponse;
    if (!response.ok) throw new Error(payload.error?.message || "OpenAI không trả lời.");
    const text = payload.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("OpenAI không trả JSON.");
    return {
      text,
      inputTokens: payload.usage?.prompt_tokens ?? null,
      outputTokens: payload.usage?.completion_tokens ?? null,
      latencyMs: Date.now() - started,
    };
  }
}
