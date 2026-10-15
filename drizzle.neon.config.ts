import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Chỉ dùng cho `npm run db:push:neon`. Đọc NEON_DATABASE_URL từ .env.neon (đã nằm trong .gitignore
// qua mẫu `.env*`), cố ý KHÔNG dùng DATABASE_URL của .env.local để không đẩy nhầm lên DB local.
config({ path: ".env.neon" });

const url = process.env.NEON_DATABASE_URL;
if (!url) throw new Error("Thiếu NEON_DATABASE_URL. Tạo file .env.neon theo hướng dẫn trong DEPLOY.md.");

console.log(`[db:push:neon] DB đích: ${new URL(url).host}`);

export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: { url },
});
