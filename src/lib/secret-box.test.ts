import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { decryptSecret, encryptSecret, isEncryptedSecret } from "./secret-box";

const previousSecret = process.env.AI_KEY_ENCRYPTION_SECRET;

describe("AI key encryption", () => {
  beforeAll(() => {
    process.env.AI_KEY_ENCRYPTION_SECRET = "test-secret-that-is-longer-than-thirty-two-characters";
  });

  afterAll(() => {
    if (previousSecret === undefined) delete process.env.AI_KEY_ENCRYPTION_SECRET;
    else process.env.AI_KEY_ENCRYPTION_SECRET = previousSecret;
  });

  it("encrypts with authenticated encryption and decrypts", () => {
    const encrypted = encryptSecret("provider-secret-key");
    expect(isEncryptedSecret(encrypted)).toBe(true);
    expect(encrypted).not.toContain("provider-secret-key");
    expect(decryptSecret(encrypted)).toBe("provider-secret-key");
  });

  it("keeps old plaintext readable for migration", () => {
    expect(decryptSecret("old-plaintext-key")).toBe("old-plaintext-key");
  });
});
