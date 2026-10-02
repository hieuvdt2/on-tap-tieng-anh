"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { isAIChoice } from "./provider";
import { writeAIProvider, writeGeminiKey, writeGroqKey, writeOpenRouterKey } from "./settings";

const keySchema = z.string().trim().min(20).max(200).regex(/^\S+$/);

export async function selectAIProvider(choice: string) {
  if (!isAIChoice(choice)) return;
  await writeAIProvider(choice);
  revalidatePath("/", "layout");
}

export async function saveGeminiKey(formData: FormData) {
  const parsed = keySchema.safeParse(formData.get("apiKey"));
  if (!parsed.success) redirect("/account/settings?error=invalid");
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
