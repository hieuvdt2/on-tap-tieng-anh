import { apiKeyFor, type AIChoice, type StoredAI } from "./provider";

export type ListedModel = { id: string; label: string };

const listError = "Không lấy được danh sách model. Hãy kiểm tra khóa rồi thử lại.";
const emptyError = "Nhà cung cấp không trả model nào dùng để tạo câu.";
const skippedGemini = /image|tts|live|audio|transcribe|embed|veo|imagen|lyria|robotics|aqa|omni/i;
const skippedGroq = /whisper|tts|orpheus|playai|embed|guard|canopylabs/i;

export function parseGeminiModels(payload: unknown): ListedModel[] {
  const models = payload && typeof payload === "object" && "models" in payload ? payload.models : null;
  if (!Array.isArray(models)) return [];
  const listed = new Map<string, ListedModel>();
  for (const item of models) {
    if (!item || typeof item !== "object") continue;
    const row = item as { name?: unknown; displayName?: unknown; supportedGenerationMethods?: unknown };
    const methods = Array.isArray(row.supportedGenerationMethods) ? row.supportedGenerationMethods : [];
    if (!methods.includes("generateContent")) continue;
    const name = typeof row.name === "string" ? row.name : "";
    const id = name.startsWith("models/") ? name.slice("models/".length) : name;
    if (!id || skippedGemini.test(id)) continue;
    const label = typeof row.displayName === "string" && row.displayName.trim() ? row.displayName.trim() : id;
    listed.set(id, { id, label });
  }
  return [...listed.values()].sort((a, b) => a.label.localeCompare(b.label));
}

export function parseGroqModels(payload: unknown): ListedModel[] {
  const data = payload && typeof payload === "object" && "data" in payload ? payload.data : null;
  if (!Array.isArray(data)) return [];
  const listed = new Map<string, ListedModel>();
  for (const item of data) {
    if (!item || typeof item !== "object") continue;
    const row = item as { id?: unknown; active?: unknown };
    if (row.active === false) continue;
    const id = typeof row.id === "string" ? row.id.trim() : "";
    if (!id || skippedGroq.test(id)) continue;
    listed.set(id, { id, label: id });
  }
  return [...listed.values()].sort((a, b) => a.label.localeCompare(b.label));
}

export function parseOpenRouterModels(payload: unknown): ListedModel[] {
  const data = payload && typeof payload === "object" && "data" in payload ? payload.data : null;
  if (!Array.isArray(data)) return [];
  const listed = new Map<string, ListedModel>();
  for (const item of data) {
    if (!item || typeof item !== "object") continue;
    const row = item as {
      id?: unknown;
      name?: unknown;
      supported_parameters?: unknown;
      architecture?: { output_modalities?: unknown };
    };
    const id = typeof row.id === "string" ? row.id.trim() : "";
    const parameters = Array.isArray(row.supported_parameters) ? row.supported_parameters : [];
    const outputs = Array.isArray(row.architecture?.output_modalities) ? row.architecture.output_modalities : [];
    const canJson = parameters.includes("response_format") || parameters.includes("structured_outputs");
    if (!id || !canJson || (outputs.length > 0 && !outputs.includes("text"))) continue;
    const label = typeof row.name === "string" && row.name.trim() ? row.name.trim() : id;
    listed.set(id, { id, label });
  }
  return [...listed.values()].sort((a, b) => a.label.localeCompare(b.label));
}

export async function listProviderModels(
  choice: AIChoice,
  apiKey: string,
  fetchImpl: typeof fetch = fetch,
): Promise<{ models: ListedModel[]; error: string | null }> {
  try {
    const models = choice === "gemini"
      ? await listGemini(apiKey, fetchImpl)
      : choice === "groq"
        ? parseGroqModels(await getJson("https://api.groq.com/openai/v1/models", { authorization: `Bearer ${apiKey}` }, fetchImpl))
        : parseOpenRouterModels(await getJson(
          "https://openrouter.ai/api/v1/models?supported_parameters=response_format&output_modalities=text",
          { authorization: `Bearer ${apiKey}` },
          fetchImpl,
        ));
    return models.length ? { models, error: null } : { models: [], error: emptyError };
  } catch {
    return { models: [], error: listError };
  }
}

export async function listStoredModels(choice: AIChoice, stored: StoredAI) {
  const apiKey = apiKeyFor(choice, stored);
  if (!apiKey) return { models: [], error: null };
  return listProviderModels(choice, apiKey);
}

async function listGemini(apiKey: string, fetchImpl: typeof fetch) {
  const listed = new Map<string, ListedModel>();
  let pageToken = "";
  for (let page = 0; page < 10; page += 1) {
    const url = new URL("https://generativelanguage.googleapis.com/v1beta/models");
    url.searchParams.set("pageSize", "100");
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    const payload = await getJson(url, { "x-goog-api-key": apiKey }, fetchImpl);
    for (const model of parseGeminiModels(payload)) listed.set(model.id, model);
    pageToken = payload && typeof payload === "object" && "nextPageToken" in payload && typeof payload.nextPageToken === "string"
      ? payload.nextPageToken
      : "";
    if (!pageToken) break;
  }
  return [...listed.values()].sort((a, b) => a.label.localeCompare(b.label));
}

async function getJson(url: string | URL, headers: Record<string, string>, fetchImpl: typeof fetch) {
  const response = await fetchImpl(url, {
    headers,
    signal: AbortSignal.timeout(15_000),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(listError);
  return response.json() as Promise<unknown>;
}
