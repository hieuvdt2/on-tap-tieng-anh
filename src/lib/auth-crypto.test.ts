import { describe, expect, it } from "vitest";
import { hashPassword, isValidUsername, normalizeUsername, verifyPassword } from "./auth-crypto";

describe("authentication crypto", () => {
  it("normalizes and validates usernames", () => {
    expect(normalizeUsername("  HocSinh_01 ")).toBe("hocsinh_01");
    expect(isValidUsername("HocSinh_01")).toBe(true);
    expect(isValidUsername("học sinh")).toBe(false);
    expect(isValidUsername("ab")).toBe(false);
  });

  it("hashes passwords with a random salt and verifies them", async () => {
    const first = await hashPassword("mat-khau-an-toan");
    const second = await hashPassword("mat-khau-an-toan");
    expect(first).not.toBe(second);
    expect(first).not.toContain("mat-khau-an-toan");
    await expect(verifyPassword("mat-khau-an-toan", first)).resolves.toBe(true);
    await expect(verifyPassword("sai-mat-khau", first)).resolves.toBe(false);
  });

  it("rejects malformed password hashes", async () => {
    await expect(verifyPassword("anything", "not-a-password-hash")).resolves.toBe(false);
  });
});
