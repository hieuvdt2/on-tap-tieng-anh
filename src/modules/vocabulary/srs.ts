// Ôn lặp lại ngắt quãng kiểu hộp Leitner: nhớ thì lên hộp và lần ôn sau xa hơn, quên thì về hộp 0 và
// ôn lại sau ít phút. Không dùng thuật toán phức tạp hơn (SM-2…) vì bản đầu cần dễ hiểu, dễ kiểm tra.
export const MAX_BOX = 5;
const INTERVAL_DAYS = [0, 1, 2, 4, 8, 16] as const;
const RETRY_MINUTES = 10;
const DAY_MS = 24 * 60 * 60 * 1000;

export type SrsState = { box: number; dueAt: Date };

/** Từ vừa được học lần đầu: vào hộp 1, ôn lại sau 1 ngày. */
export function introduced(now: Date): SrsState {
  return { box: 1, dueAt: new Date(now.getTime() + INTERVAL_DAYS[1] * DAY_MS) };
}

export function review(box: number, remembered: boolean, now: Date): SrsState {
  if (!remembered) return { box: 0, dueAt: new Date(now.getTime() + RETRY_MINUTES * 60 * 1000) };
  const next = Math.min(MAX_BOX, Math.max(0, box) + 1);
  return { box: next, dueAt: new Date(now.getTime() + INTERVAL_DAYS[next] * DAY_MS) };
}

// "Đã thuộc" = lên tới hộp này: nhớ đúng qua ít nhất 3 lần ôn cách ngày (khoảng 1, 2 và 4 ngày sau lần học đầu).
// Chỉ xem một từ hoặc làm đúng bài kiểm tra ngay sau khi học thì CHƯA tính là thuộc.
export const KNOWN_BOX = 4;

export type WordStage = "new" | "learning" | "known";

export function stageOf(box: number | null | undefined): WordStage {
  if (box === null || box === undefined) return "new";
  return box >= KNOWN_BOX ? "known" : "learning";
}
