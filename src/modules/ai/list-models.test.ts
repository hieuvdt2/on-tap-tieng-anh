import { describe, expect, it } from "vitest";
import { listProviderModels, parseGeminiModels, parseGroqModels, parseOpenRouterModels } from "./list-models";

describe("parseGeminiModels", () => {
  it("keeps text models that can generate content and drops image, speech, and embedding models", () => {
    const models = parseGeminiModels({
      models: [
        {
          name: "models/gemini-3.8-flash",
          displayName: "Gemini 3.8 Flash",
          supportedGenerationMethods: ["generateContent", "countTokens"],
        },
        {
          name: "models/gemini-3.1-flash-image",
          displayName: "Nano Banana 2",
          supportedGenerationMethods: ["generateContent"],
        },
        {
          name: "models/text-embedding-004",
          displayName: "Text Embedding",
          supportedGenerationMethods: ["embedContent"],
        },
      ],
    });
    expect(models).toEqual([{ id: "gemini-3.8-flash", label: "Gemini 3.8 Flash" }]);
  });
});

describe("parseGroqModels", () => {
  it("keeps chat models and drops speech and guard models", () => {
    const models = parseGroqModels({
      data: [
        { id: "llama-3.3-70b-versatile", object: "model", active: true },
        { id: "whisper-large-v3", object: "model", active: true },
        { id: "llama-guard-3-8b", object: "model", active: true },
        { id: "old-chat", object: "model", active: false },
      ],
    });
    expect(models.map((model) => model.id)).toEqual(["llama-3.3-70b-versatile"]);
  });
});

describe("parseOpenRouterModels", () => {
  it("keeps text models that can return JSON", () => {
    const models = parseOpenRouterModels({
      data: [
        {
          id: "google/gemini-3.8-flash",
          name: "Google: Gemini 3.8 Flash",
          supported_parameters: ["temperature", "response_format"],
          architecture: { output_modalities: ["text"] },
        },
        {
          id: "black-forest-labs/flux",
          name: "Flux",
          supported_parameters: ["response_format"],
          architecture: { output_modalities: ["image"] },
        },
        {
          id: "meta/llama-text",
          name: "Llama text",
          supported_parameters: ["temperature"],
          architecture: { output_modalities: ["text"] },
        },
      ],
    });
    expect(models).toEqual([{ id: "google/gemini-3.8-flash", label: "Google: Gemini 3.8 Flash" }]);
  });
});

describe("listProviderModels", () => {
  it("follows Gemini page tokens and only returns models from the response", async () => {
    const fetchImpl: typeof fetch = async (url) => {
      const page = new URL(String(url)).searchParams.get("pageToken");
      const body = page
        ? { models: [{ name: "models/gemini-3.7-flash", displayName: "Gemini 3.7 Flash", supportedGenerationMethods: ["generateContent"] }] }
        : {
          models: [{ name: "models/gemini-3.8-flash", displayName: "Gemini 3.8 Flash", supportedGenerationMethods: ["generateContent"] }],
          nextPageToken: "next",
        };
      return new Response(JSON.stringify(body), { status: 200 });
    };
    const listed = await listProviderModels("gemini", "test-key", fetchImpl);
    expect(listed.error).toBeNull();
    expect(listed.models.map((model) => model.id)).toEqual(["gemini-3.7-flash", "gemini-3.8-flash"]);
  });
});
