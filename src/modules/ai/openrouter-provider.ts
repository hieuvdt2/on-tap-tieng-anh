import type { AIProvider, GenerateTextInput, GenerateTextOutput } from "./provider";
import { fetchWithRetry } from "./retry";

type OpenRouterResponse = {
  choices?: { message?: { content?: string | null } }[];
  usage?: { prompt_tokens?: number; completion_tokens?: number };
  error?: { message?: string };
};

export class OpenRouterProvider implements AIProvider {
  readonly name = "openrouter";

  constructor(
    private readonly apiKey: string,
    readonly model: string,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  async generateText(input: GenerateTextInput): Promise<GenerateTextOutput> {
    const started = Date.now();
    const response = await fetchWithRetry(this.fetchImpl, "https://openrouter.ai/api/v1/chat/completions", () => ({
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${this.apiKey}`,
        "x-title": "On Tap English",
      },
      body: JSON.stringify({
        model: this.model,
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: input.prompt }],
      }),
      signal: AbortSignal.timeout(120_000),
    }));
    const payload = (await response.json()) as OpenRouterResponse;
    if (!response.ok) {
      throw new Error(payload.error?.message || "OpenRouter không trả lời.");
    }
    const text = payload.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("OpenRouter không trả JSON.");
    return {
      text,
      inputTokens: payload.usage?.prompt_tokens ?? null,
      outputTokens: payload.usage?.completion_tokens ?? null,
      latencyMs: Date.now() - started,
    };
  }
}
