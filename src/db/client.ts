import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;

if (!url) {
  throw new Error("DATABASE_URL is missing");
}

const globalForDb = globalThis as unknown as { sql?: ReturnType<typeof postgres> };
const sql =
  globalForDb.sql ??
  postgres(url, {
    // Vercel/Neon: ít connection + tắt prepared statements (PgBouncer transaction mode)
    max: process.env.NODE_ENV === "production" ? 1 : 10,
    prepare: false,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.sql = sql;
}

export const db = drizzle(sql, { schema });
