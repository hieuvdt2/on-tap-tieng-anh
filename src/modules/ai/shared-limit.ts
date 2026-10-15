// Phần thuần (không chạm DB) của hạn mức dùng khóa AI chung, tách riêng để test được.
const DEFAULT_DAILY_LIMIT = 60;
export const WINDOW_MS = 24 * 60 * 60 * 1000;

export class SharedQuotaError extends Error {
  constructor(limit: number) {
    super(
      `Bạn đã dùng hết ${limit} lượt AI dùng chung trong 24 giờ qua. Hãy thử lại sau, hoặc lưu khóa riêng ở Thiết lập AI để không bị giới hạn.`,
    );
    this.name = "SharedQuotaError";
  }
}

export function sharedDailyLimit(raw = process.env.AI_SHARED_DAILY_LIMIT) {
  const parsed = Number.parseInt(raw ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_DAILY_LIMIT;
}

export function quotaLeft(used: number, limit: number) {
  return Math.max(0, limit - used);
}
