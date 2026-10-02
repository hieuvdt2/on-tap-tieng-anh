import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { getStudentId } from "@/lib/student";
import { decryptSecret, encryptSecret, isEncryptedSecret } from "@/lib/secret-box";
import { getAIProvider, isAIChoice, parseStoredModels, type AIChoice, type StoredAI } from "./provider";

const empty: StoredAI = { provider: null, models: {}, geminiApiKey: null, groqApiKey: null, openrouterApiKey: null };

export async function readStoredAI(userId?: string): Promise<StoredAI> {
  const ownerId = userId ?? await getStudentId();
  const rows = await db
    .select({
      provider: users.aiProvider,
      model: users.aiModel,
      geminiApiKey: users.geminiApiKey,
      groqApiKey: users.groqApiKey,
      openrouterApiKey: users.openrouterApiKey,
    })
    .from(users)
    .where(eq(users.id, ownerId))
    .limit(1);
  const row = rows[0];
  if (!row) return empty;
  const geminiApiKey = row.geminiApiKey ? decryptSecret(row.geminiApiKey) : null;
  const groqApiKey = row.groqApiKey ? decryptSecret(row.groqApiKey) : null;
  const openrouterApiKey = row.openrouterApiKey ? decryptSecret(row.openrouterApiKey) : null;

  const encrypted: { geminiApiKey?: string; groqApiKey?: string; openrouterApiKey?: string } = {};
  if (row.geminiApiKey && !isEncryptedSecret(row.geminiApiKey)) encrypted.geminiApiKey = encryptSecret(row.geminiApiKey);
  if (row.groqApiKey && !isEncryptedSecret(row.groqApiKey)) encrypted.groqApiKey = encryptSecret(row.groqApiKey);
  if (row.openrouterApiKey && !isEncryptedSecret(row.openrouterApiKey)) {
    encrypted.openrouterApiKey = encryptSecret(row.openrouterApiKey);
  }
  if (Object.keys(encrypted).length) await db.update(users).set(encrypted).where(eq(users.id, ownerId));

  const provider = isAIChoice(row.provider) ? row.provider : null;
  return {
    provider,
    models: parseStoredModels(row.model, provider),
    geminiApiKey,
    groqApiKey,
    openrouterApiKey,
  };
}

export async function resolveAIProvider() {
  return getAIProvider(await readStoredAI());
}

async function saveUser(set: {
  aiProvider?: AIChoice;
  aiModel?: string | null;
  geminiApiKey?: string | null;
  groqApiKey?: string | null;
  openrouterApiKey?: string | null;
}) {
  await db.update(users).set(set).where(eq(users.id, await getStudentId()));
}

export async function writeAIProvider(provider: AIChoice) {
  await saveUser({ aiProvider: provider });
}

export async function writeAIModel(choice: AIChoice, model: string) {
  const stored = await readStoredAI();
  await saveUser({ aiModel: JSON.stringify({ ...stored.models, [choice]: model }) });
}

export async function writeGeminiKey(apiKey: string | null) {
  await saveUser({ geminiApiKey: apiKey ? encryptSecret(apiKey) : null, ...(apiKey ? { aiProvider: "gemini" as const } : {}) });
}

export async function writeGroqKey(apiKey: string | null) {
  await saveUser({ groqApiKey: apiKey ? encryptSecret(apiKey) : null, ...(apiKey ? { aiProvider: "groq" as const } : {}) });
}

export async function writeOpenRouterKey(apiKey: string | null) {
  await saveUser({
    openrouterApiKey: apiKey ? encryptSecret(apiKey) : null,
    ...(apiKey ? { aiProvider: "openrouter" as const } : {}),
  });
}
