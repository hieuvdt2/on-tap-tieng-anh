// Ngày học theo giờ Việt Nam, dạng YYYY-MM-DD; chuỗi ngày = số ngày liên tiếp có hoạt động tính đến
// hôm nay (hôm nay chưa học thì vẫn giữ chuỗi nếu hôm qua có học).
const TIME_ZONE = "Asia/Ho_Chi_Minh";

export function vnDay(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

function previousDay(day: string): string {
  const [y, m, d] = day.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

export function computeStreak(days: readonly string[], today: string): number {
  const set = new Set(days);
  let cursor = set.has(today) ? today : previousDay(today);
  let streak = 0;
  while (set.has(cursor)) {
    streak += 1;
    cursor = previousDay(cursor);
  }
  return streak;
}
