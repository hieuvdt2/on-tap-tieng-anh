import { createHash } from "node:crypto";

export function normalizeStem(stem: string) {
  return stem.toLowerCase().replace(/\s+/g, " ").trim();
}

export function contentHash(stem: string) {
  return createHash("sha256").update(normalizeStem(stem)).digest("hex");
}
