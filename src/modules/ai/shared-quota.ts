import { and, eq, gt, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { aiRequestLogs } from "@/db/schema";

import { quotaLeft, SharedQuotaError, sharedDailyLimit, WINDOW_MS } from "./shared-limit";

export async function sharedUsedToday(userId: string) {
  const rows = await db
    .select({ used: sql<number>`count(*)::int` })
    .from(aiRequestLogs)
    .where(
      and(
        eq(aiRequestLogs.userId, userId),
        eq(aiRequestLogs.provider, "openai"),
        eq(aiRequestLogs.status, "ok"),
        gt(aiRequestLogs.createdAt, new Date(Date.now() - WINDOW_MS)),
      ),
    );
  return rows[0]?.used ?? 0;
}

// Đếm theo nhật ký các lần gọi thành công trong 24 giờ gần nhất. Hai lần gọi song song có thể vượt
// hạn mức vài lượt; chấp nhận được vì mục đích là chặn lạm dụng, không phải tính tiền chính xác.
export async function assertSharedQuota(userId: string) {
  const limit = sharedDailyLimit();
  if (quotaLeft(await sharedUsedToday(userId), limit) <= 0) throw new SharedQuotaError(limit);
}
