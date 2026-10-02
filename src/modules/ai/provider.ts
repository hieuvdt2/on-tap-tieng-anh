import { GeminiProvider } from "./gemini-provider";
import { GroqProvider } from "./groq-provider";
import { MockProvider } from "./mock-provider";
import { OpenRouterProvider } from "./openrouter-provider";

export type GenerateTextInput = {
  prompt: string;
  operation: string;
  promptVersion: string;
};

export type GenerateTextOutput = {
  text: string;
  inputTokens: number | null;
  outputTokens: number | null;
  latencyMs: number;
};

export interface AIProvider {
  readonly name: string;
  readonly model: string;
  generateText(input: GenerateTextInput): Promise<GenerateTextOutput>;
}

export const AI_CHOICES = ["gemini", "groq", "openrouter"] as const;
export type AIChoice = (typeof AI_CHOICES)[number];

export type StoredAI = {
  provider: AIChoice | null;
  models?: Partial<Record<AIChoice, string>>;
  geminiApiKey: string | null;
  groqApiKey: string | null;
  openrouterApiKey: string | null;
};

export const MODEL_SUGGESTIONS: Record<AIChoice, { id: string; note: string }[]> = {
  gemini: [
    { id: "gemini-3.5-flash-lite", note: "Bản nhẹ. Google chưa công bố ngày tắt, hợp khi bản mới bị quá tải." },
    { id: "gemini-3.5-flash", note: "Bản ổn định. Google chưa công bố ngày tắt." },
    { id: "gemini-3.8-flash", note: "Bản mới nhất Google khuyến nghị. Đôi khi quá tải." },
  ],
  groq: [
    { id: "openai/gpt-oss-20b", note: "Nhanh. Groq khuyến nghị thay cho các model Llama đã tắt." },
    { id: "openai/gpt-oss-120b", note: "Viết chắc hơn. Groq khuyến nghị khi cần chất lượng." },
  ],
  openrouter: [
    { id: "openrouter/auto", note: "OpenRouter tự chọn model đang được dùng nhiều." },
    { id: "meta-llama/llama-3.3-70b-instruct", note: "Model mở, có nhiều nhà cung cấp dự phòng." },
  ],
};

export const DEFAULT_GEMINI_MODEL = "gemini-3.8-flash";
const DEFAULT_GROQ_MODEL = "openai/gpt-oss-120b";
const DEFAULT_OPENROUTER_MODEL = "openrouter/auto";

export function modelFits(choice: AIChoice, model: string) {
  if (choice === "gemini") return /^(gemini|gemma)-[A-Za-z0-9._-]{1,120}$/.test(model);
  if (choice === "groq") return /^(?!gemini-)(?!gemma-)[A-Za-z0-9._:/-]{3,160}$/.test(model);
  return /^[A-Za-z0-9._-]+\/[A-Za-z0-9._:-]+$/.test(model) && model.length <= 160;
}

export function modelFor(choice: AIChoice, stored?: StoredAI | null) {
  const saved = stored?.models?.[choice]?.trim();
  if (saved && modelFits(choice, saved)) return saved;
  if (choice === "groq") return process.env.GROQ_MODEL?.trim() || DEFAULT_GROQ_MODEL;
  if (choice === "openrouter") return process.env.OPENROUTER_MODEL?.trim() || DEFAULT_OPENROUTER_MODEL;
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
}

export function isAIChoice(value: string | null | undefined): value is AIChoice {
  return value === "gemini" || value === "groq" || value === "openrouter";
}

export function parseStoredModels(raw: string | null | undefined, provider: AIChoice | null): Partial<Record<AIChoice, string>> {
  const value = raw?.trim();
  if (!value) return {};
  if (!value.startsWith("{")) return provider && modelFits(provider, value) ? { [provider]: value } : {};
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object") return {};
    const models: Partial<Record<AIChoice, string>> = {};
    for (const [key, model] of Object.entries(parsed)) {
      if (isAIChoice(key) && typeof model === "string" && modelFits(key, model)) models[key] = model;
    }
    return models;
  } catch {
    return {};
  }
}

export function chosenProvider(stored: StoredAI | null | undefined, envProvider = process.env.AI_PROVIDER): AIChoice | null {
  if (stored?.provider) return stored.provider;
  return isAIChoice(envProvider) ? envProvider : null;
}

export function activeAI(stored: StoredAI | null | undefined, envProvider = process.env.AI_PROVIDER) {
  if (envProvider === "mock" || envProvider === "off") return null;
  const choice = chosenProvider(stored, envProvider);
  if (!choice) return null;
  return {
    choice,
    ready: Boolean(apiKeyFor(choice, stored)),
    model: modelFor(choice, stored),
    modelChosen: Boolean(stored?.models?.[choice]),
  };
}

export function apiKeyFor(choice: AIChoice, stored: StoredAI | null | undefined) {
  if (choice === "groq") return stored?.groqApiKey?.trim() || process.env.GROQ_API_KEY?.trim() || "";
  if (choice === "gemini") return stored?.geminiApiKey?.trim() || process.env.GEMINI_API_KEY?.trim() || "";
  if (choice === "openrouter") return stored?.openrouterApiKey?.trim() || process.env.OPENROUTER_API_KEY?.trim() || "";
  return "";
}

export function getAIProvider(stored?: StoredAI | null): AIProvider | null {
  const envProvider = process.env.AI_PROVIDER ?? "off";
  if (envProvider === "mock") return new MockProvider();
  if (envProvider === "off") return null;
  const choice = chosenProvider(stored, envProvider);
  if (choice === "groq") {
    const apiKey = apiKeyFor("groq", stored);
    if (!apiKey) return null;
    return new GroqProvider(apiKey, modelFor("groq", stored));
  }
  if (choice === "gemini") {
    const apiKey = apiKeyFor("gemini", stored);
    if (!apiKey) return null;
    return new GeminiProvider(apiKey, modelFor("gemini", stored));
  }
  if (choice === "openrouter") {
    const apiKey = apiKeyFor("openrouter", stored);
    if (!apiKey) return null;
    return new OpenRouterProvider(apiKey, modelFor("openrouter", stored));
  }
  return null;
}
