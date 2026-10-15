"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { getStudentId } from "@/lib/student";

export async function hasSeenGuide(userId: string) {
  const rows = await db.select({ seen: users.guideSeenAt }).from(users).where(eq(users.id, userId)).limit(1);
  return Boolean(rows[0]?.seen);
}

async function markSeen() {
  const userId = await getStudentId();
  await db.update(users).set({ guideSeenAt: new Date() }).where(eq(users.id, userId));
}

// Khung chào mừng ở trang tổng quan: xem hướng dẫn hoặc bỏ qua đều tính là đã biết, không hiện lại.
export async function openGuide() {
  await markSeen();
  redirect("/guide");
}

export async function dismissGuide() {
  await markSeen();
  redirect("/");
}

// Nút cuối trang hướng dẫn: ghi nhận đã đọc rồi đi tiếp tới phần được chọn.
const startTargets = new Set(["/diagnostic", "/learn", "/practice", "/mock-exam", "/account/settings"]);

export async function finishGuide(formData: FormData) {
  await markSeen();
  const target = String(formData.get("target") ?? "");
  redirect(startTargets.has(target) ? target : "/");
}
