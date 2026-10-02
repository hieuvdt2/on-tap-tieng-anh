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
  geminiApiKey: string | null;
  groqApiKey: string | null;
  openrouterApiKey: string | null;
};

const DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile";
const DEFAULT_OPENROUTER_MODEL = "openrouter/auto";

export function isAIChoice(value: string | null | undefined): value is AIChoice {
  return value === "gemini" || value === "groq" || value === "openrouter";
}

export function chosenProvider(stored: StoredAI | null | undefined, envProvider = process.env.AI_PROVIDER): AIChoice | null {
  if (stored?.provider) return stored.provider;
  return isAIChoice(envProvider) ? envProvider : null;
}

export function activeAI(stored: StoredAI | null | undefined, envProvider = process.env.AI_PROVIDER) {
  if (envProvider === "mock" || envProvider === "off") return null;
  const choice = chosenProvider(stored, envProvider);
  if (!choice) return null;
  return { choice, ready: Boolean(keyFor(choice, stored)) };
}

function keyFor(choice: AIChoice, stored: StoredAI | null | undefined) {
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
    const apiKey = keyFor("groq", stored);
    if (!apiKey) return null;
    return new GroqProvider(apiKey, process.env.GROQ_MODEL?.trim() || DEFAULT_GROQ_MODEL);
  }
  if (choice === "gemini") {
    const apiKey = keyFor("gemini", stored);
    if (!apiKey) return null;
    return new GeminiProvider(apiKey, process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash");
  }
  if (choice === "openrouter") {
    const apiKey = keyFor("openrouter", stored);
    if (!apiKey) return null;
    return new OpenRouterProvider(apiKey, process.env.OPENROUTER_MODEL?.trim() || DEFAULT_OPENROUTER_MODEL);
  }
  return null;
}
