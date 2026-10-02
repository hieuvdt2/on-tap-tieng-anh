"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { listProviderModels } from "./list-models";
import { apiKeyFor, isAIChoice } from "./provider";
import { readStoredAI, writeAIModel, writeAIProvider, writeGeminiKey, writeGroqKey, writeOpenRouterKey } from "./settings";

const keySchema = z.string().trim().min(20).max(200).regex(/^\S+$/);

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
  const stored = await readStoredAI();
  const envProvider = process.env.AI_PROVIDER;
  const choice = stored.provider ?? (isAIChoice(envProvider) ? envProvider : null);
  if (!choice) redirect("/account/settings?error=model");
  const parsed = z.string().trim().min(3).max(160).safeParse(formData.get("model"));
  const apiKey = apiKeyFor(choice, stored);
  const listed = apiKey ? await listProviderModels(choice, apiKey) : { models: [], error: null };
  if (!parsed.success || listed.error || !listed.models.some((item) => item.id === parsed.data)) {
    redirect("/account/settings?error=model");
  }
  await writeAIModel(choice, parsed.data);
  revalidatePath("/", "layout");
  redirect("/account/settings?model=1");
}

export async function selectAIProvider(choice: string) {
  if (!isAIChoice(choice)) return;
  await writeAIProvider(choice);
  revalidatePath("/", "layout");
}

export async function saveGeminiKey(formData: FormData) {
  const parsed = keySchema.safeParse(formData.get("apiKey"));
  if (!parsed.success) redirect("/account/settings?error=invalid");
  const verification = await verifyGeminiKey(parsed.data);
  if (verification === "invalid") redirect("/account/settings?error=invalid-key");
  if (verification === "unavailable") redirect("/account/settings?error=verify");
  await writeGeminiKey(parsed.data);
  redirect("/account/settings?saved=1");
}

export async function clearGeminiKey() {
  await writeGeminiKey(null);
  redirect("/account/settings?cleared=1");
}

export async function saveGroqKey(formData: FormData) {
  const parsed = keySchema.safeParse(formData.get("apiKey"));
  if (!parsed.success) redirect("/account/settings?error=invalid");
  await writeGroqKey(parsed.data);
  redirect("/account/settings?saved=1");
}

export async function clearGroqKey() {
  await writeGroqKey(null);
  redirect("/account/settings?cleared=1");
}

export async function saveOpenRouterKey(formData: FormData) {
  const parsed = keySchema.safeParse(formData.get("apiKey"));
  if (!parsed.success) redirect("/account/settings?error=invalid");
  await writeOpenRouterKey(parsed.data);
  redirect("/account/settings?saved=1");
}

export async function clearOpenRouterKey() {
  await writeOpenRouterKey(null);
  redirect("/account/settings?cleared=1");
}
