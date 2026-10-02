import type { AIProvider, GenerateTextInput, GenerateTextOutput } from "./provider";

type GroqResponse = {
  choices?: { message?: { content?: string | null } }[];
  usage?: { prompt_tokens?: number; completion_tokens?: number };
  error?: { message?: string };
};

export class GroqProvider implements AIProvider {
  readonly name = "groq";

  constructor(
    private readonly apiKey: string,
    readonly model: string,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  async generateText(input: GenerateTextInput): Promise<GenerateTextOutput> {
    const started = Date.now();
    const response = await this.fetchImpl("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: input.prompt }],
      }),
      signal: AbortSignal.timeout(120_000),
    });
    const payload = (await response.json()) as GroqResponse;
    if (!response.ok) {
      throw new Error(payload.error?.message || "Groq không trả lời.");
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
