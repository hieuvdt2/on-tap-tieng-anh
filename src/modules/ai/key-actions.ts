"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { listProviderModels } from "./list-models";
import { apiKeyFor, isAIChoice } from "./provider";
import { readStoredAI, writeAIModel, writeAIProvider, writeGeminiKey, writeGroqKey, writeOpenRouterKey } from "./settings";

const keySchema = z.string().trim().min(20).max(200).regex(/^\S+$/);

function sanitizeReturnTo(raw: FormDataEntryValue | null) {
  if (typeof raw !== "string" || !raw.startsWith("/") || raw.startsWith("//")) return null;
  return raw;
}

function withReturnTo(path: string, returnTo: string | null) {
  if (!returnTo) return path;
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}returnTo=${encodeURIComponent(returnTo)}`;
}

async function verifyGeminiKey(apiKey: string) {
  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models?pageSize=1", {
      headers: { "x-goog-api-key": apiKey },
      signal: AbortSignal.timeout(15_000),
      cache: "no-store",
    });
    return response.ok ? "valid" : "invalid";
  } catch {
    return "unavailable";
  }
}

export async function saveAIModel(formData: FormData) {
  const returnTo = sanitizeReturnTo(formData.get("returnTo"));
  const stored = await readStoredAI();
  const envProvider = process.env.AI_PROVIDER;
  const choice = stored.provider ?? (isAIChoice(envProvider) ? envProvider : null);
  if (!choice) redirect(withReturnTo("/account/settings?error=model", returnTo));
  const parsed = z.string().trim().min(3).max(160).safeParse(formData.get("model"));
  const apiKey = apiKeyFor(choice, stored);
  const listed = apiKey ? await listProviderModels(choice, apiKey) : { models: [], error: null };
  if (!parsed.success || listed.error || !listed.models.some((item) => item.id === parsed.data)) {
    redirect(withReturnTo("/account/settings?error=model", returnTo));
  }
  await writeAIModel(choice, parsed.data);
  revalidatePath("/", "layout");
  // Có chỗ cần quay lại (bài đang tạo dở) thì về thẳng đó để làm tiếp; không thì về trang chủ
  // như cũ, nơi AIReadyNotice cho chọn ở lại hay sang tạo đề.
  redirect(returnTo ?? "/?ai=ready");
}

export async function selectAIProvider(choice: string) {
  if (!isAIChoice(choice)) return;
  await writeAIProvider(choice);
  revalidatePath("/", "layout");
}

export async function saveGeminiKey(formData: FormData) {
  const returnTo = sanitizeReturnTo(formData.get("returnTo"));
  const parsed = keySchema.safeParse(formData.get("apiKey"));
  if (!parsed.success) redirect(withReturnTo("/account/settings?error=invalid", returnTo));
  const verification = await verifyGeminiKey(parsed.data);
  if (verification === "invalid") redirect(withReturnTo("/account/settings?error=invalid-key", returnTo));
  if (verification === "unavailable") redirect(withReturnTo("/account/settings?error=verify", returnTo));
  await writeGeminiKey(parsed.data);
  redirect(withReturnTo("/account/settings?saved=1", returnTo));
}

export async function clearGeminiKey() {
  await writeGeminiKey(null);
  redirect("/account/settings?cleared=1");
}

export async function saveGroqKey(formData: FormData) {
  const returnTo = sanitizeReturnTo(formData.get("returnTo"));
  const parsed = keySchema.safeParse(formData.get("apiKey"));
  if (!parsed.success) redirect(withReturnTo("/account/settings?error=invalid", returnTo));
  await writeGroqKey(parsed.data);
  redirect(withReturnTo("/account/settings?saved=1", returnTo));
}

export async function clearGroqKey() {
  await writeGroqKey(null);
  redirect("/account/settings?cleared=1");
}

export async function saveOpenRouterKey(formData: FormData) {
  const returnTo = sanitizeReturnTo(formData.get("returnTo"));
  const parsed = keySchema.safeParse(formData.get("apiKey"));
  if (!parsed.success) redirect(withReturnTo("/account/settings?error=invalid", returnTo));
  await writeOpenRouterKey(parsed.data);
  redirect(withReturnTo("/account/settings?saved=1", returnTo));
}

export async function clearOpenRouterKey() {
  await writeOpenRouterKey(null);
  redirect("/account/settings?cleared=1");
}
