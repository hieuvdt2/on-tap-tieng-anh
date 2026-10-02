import { afterEach, describe, expect, it } from "vitest";
import { GroqProvider } from "./groq-provider";
import { OpenRouterProvider } from "./openrouter-provider";
import { getAIProvider } from "./provider";

const envKeys = [
  "AI_PROVIDER",
  "GEMINI_API_KEY",
  "GROQ_API_KEY",
  "GROQ_MODEL",
  "OPENROUTER_API_KEY",
  "OPENROUTER_MODEL",
] as const;
const previous = new Map<string, string | undefined>();

function rememberEnv() {
  for (const key of envKeys) previous.set(key, process.env[key]);
}

function restoreEnv() {
  for (const key of envKeys) {
    const value = previous.get(key);
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

afterEach(() => {
  restoreEnv();
});

describe("getAIProvider", () => {
  it("returns Groq when the Groq key is set", () => {
    rememberEnv();
    process.env.AI_PROVIDER = "groq";
    process.env.GROQ_API_KEY = "groq-test";
    delete process.env.GROQ_MODEL;
    const provider = getAIProvider({
      provider: null,
      geminiApiKey: "gemini-stored",
      groqApiKey: null,
      openrouterApiKey: null,
    });
    expect(provider).toBeInstanceOf(GroqProvider);
    expect(provider?.name).toBe("groq");
    expect(provider?.model).toBe("llama-3.3-70b-versatile");
  });

  it("does not call Groq when the Groq key is missing", () => {
    rememberEnv();
    process.env.AI_PROVIDER = "groq";
    delete process.env.GROQ_API_KEY;
    expect(getAIProvider({
      provider: null,
      geminiApiKey: "gemini-stored",
      groqApiKey: null,
      openrouterApiKey: null,
    })).toBeNull();
  });

  it("uses the saved Groq choice instead of the Gemini env", () => {
    rememberEnv();
    process.env.AI_PROVIDER = "gemini";
    process.env.GEMINI_API_KEY = "gemini-env-key";
    const provider = getAIProvider({
      provider: "groq",
      geminiApiKey: "gemini-stored-key",
      groqApiKey: "groq-stored-key",
      openrouterApiKey: null,
    });
    expect(provider).toBeInstanceOf(GroqProvider);
  });

  it("does not fall back to Gemini when the saved choice has no key", () => {
    rememberEnv();
    process.env.AI_PROVIDER = "gemini";
    process.env.GEMINI_API_KEY = "gemini-env-key";
    expect(getAIProvider({
      provider: "groq",
      geminiApiKey: "gemini-stored-key",
      groqApiKey: null,
      openrouterApiKey: null,
    })).toBeNull();
  });

  it("returns OpenRouter with automatic model selection", () => {
    rememberEnv();
    process.env.AI_PROVIDER = "openrouter";
    process.env.OPENROUTER_API_KEY = "openrouter-test";
    delete process.env.OPENROUTER_MODEL;
    const provider = getAIProvider({
      provider: null,
      geminiApiKey: null,
      groqApiKey: null,
      openrouterApiKey: null,
    });
    expect(provider).toBeInstanceOf(OpenRouterProvider);
    expect(provider?.model).toBe("openrouter/auto");
  });
});

describe("GroqProvider", () => {
  it("reads a fake chat completion in JSON mode", async () => {
    let body = "";
    let authorization = "";
    const fetchImpl: typeof fetch = async (_url, init) => {
      authorization = new Headers(init?.headers).get("authorization") ?? "";
      body = String(init?.body ?? "");
      return new Response(JSON.stringify({
        choices: [{ message: { content: "{\"ok\":true}" } }],
        usage: { prompt_tokens: 11, completion_tokens: 4 },
      }));
    };
    const output = await new GroqProvider("groq-test", "llama-3.3-70b-versatile", fetchImpl).generateText({
      prompt: "Trả về JSON.",
      operation: "question-generation",
      promptVersion: "question-generation-v1",
    });
    expect(authorization).toBe("Bearer groq-test");
    expect(JSON.parse(body).response_format).toEqual({ type: "json_object" });
    expect(output.text).toBe("{\"ok\":true}");
    expect(output.inputTokens).toBe(11);
    expect(output.outputTokens).toBe(4);
  });
});

describe("OpenRouterProvider", () => {
  it("reads an OpenRouter chat completion in JSON mode", async () => {
    let body = "";
    let authorization = "";
    const fetchImpl: typeof fetch = async (_url, init) => {
      authorization = new Headers(init?.headers).get("authorization") ?? "";
      body = String(init?.body ?? "");
      return new Response(JSON.stringify({
        choices: [{ message: { content: "{\"ok\":true}" } }],
        usage: { prompt_tokens: 8, completion_tokens: 3 },
      }));
    };
    const output = await new OpenRouterProvider("openrouter-test", "openrouter/auto", fetchImpl).generateText({
      prompt: "Trả về JSON.",
      operation: "question-generation",
      promptVersion: "question-generation-v1",
    });
    expect(authorization).toBe("Bearer openrouter-test");
    expect(JSON.parse(body).model).toBe("openrouter/auto");
    expect(output.text).toBe("{\"ok\":true}");
    expect(output.inputTokens).toBe(8);
    expect(output.outputTokens).toBe(3);
  });
});
