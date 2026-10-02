import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt, isNull, sql } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { STUDENT_ID } from "@/db/constants";
import { authSessions, users } from "@/db/schema";
import { SESSION_COOKIE } from "./auth-constants";
import { hashPassword, normalizeUsername, verifyPassword } from "./auth-crypto";

const SESSION_AGE_SECONDS = 60 * 60 * 24 * 30;

function tokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function safeNextPath(value?: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/";
}

function isUniqueViolation(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  if ("code" in error && error.code === "23505") return true;
  return "cause" in error && isUniqueViolation(error.cause);
}

async function setSessionCookie(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_AGE_SECONDS * 1000);
  await db.transaction(async (tx) => {
    await tx.delete(authSessions).where(eq(authSessions.userId, userId));
    await tx.insert(authSessions).values({ tokenHash: tokenHash(token), userId, expiresAt });
  });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function getCurrentUser() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const rows = await db
    .select({
      id: users.id,
      username: users.username,
      displayName: users.name,
    })
    .from(authSessions)
    .innerJoin(users, eq(users.id, authSessions.userId))
    .where(and(eq(authSessions.tokenHash, tokenHash(token)), gt(authSessions.expiresAt, new Date())))
    .limit(1);
  return rows[0] ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (user) return user;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) redirect("/login");
  const stale = await db
    .select({ tokenHash: authSessions.tokenHash })
    .from(authSessions)
    .where(eq(authSessions.tokenHash, tokenHash(token)))
    .limit(1);
  redirect(stale.length ? "/login?error=expired" : "/login?error=replaced");
}

export async function registerUser(input: {
  username: string;
  password: string;
  displayName: string;
}) {
  const username = normalizeUsername(input.username);
  const passwordHash = await hashPassword(input.password);

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(sql`lower(${users.username}) = ${username}`)
    .limit(1);
  if (existing.length) return { ok: false as const, error: "duplicate" as const };

  let userId: string;
  try {
    const claimed = await db
      .update(users)
      .set({ username, passwordHash, name: input.displayName.trim() })
      .where(and(eq(users.id, STUDENT_ID), isNull(users.passwordHash)))
      .returning({ id: users.id });

    userId = claimed[0]?.id ?? crypto.randomUUID();
    if (!claimed[0]) {
      await db.insert(users).values({
        id: userId,
        username,
        passwordHash,
        name: input.displayName.trim(),
      });
    }
  } catch (error) {
    if (isUniqueViolation(error)) return { ok: false as const, error: "duplicate" as const };
    throw error;
  }

  await setSessionCookie(userId);
  return { ok: true as const, userId };
}

export async function loginUser(usernameInput: string, password: string) {
  const username = normalizeUsername(usernameInput);
  const rows = await db
    .select({ id: users.id, passwordHash: users.passwordHash })
    .from(users)
    .where(sql`lower(${users.username}) = ${username}`)
    .limit(1);
  const user = rows[0];
  if (!user?.passwordHash || !(await verifyPassword(password, user.passwordHash))) return false;
  await setSessionCookie(user.id);
  return true;
}

export async function logoutUser() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await db.delete(authSessions).where(eq(authSessions.tokenHash, tokenHash(token)));
  jar.delete(SESSION_COOKIE);
}

export async function redirectAuthenticatedUser() {
  if (await getCurrentUser()) redirect("/");
}

export async function hasClaimableLegacyAccount() {
  const rows = await db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.id, STUDENT_ID), isNull(users.passwordHash)))
    .limit(1);
  return rows.length > 0;
}

export { safeNextPath };
