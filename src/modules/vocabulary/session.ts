// Hàng đợi trong một buổi học: trả lời sai thì từ quay lại sau vài từ nữa, cho đến khi đúng.
export const RETRY_GAP = 3;

/** Đưa từ ở đầu hàng đợi ra sau `gap` từ (hoặc cuối hàng nếu hàng ngắn hơn). */
export function requeueHead<T>(queue: readonly T[], gap = RETRY_GAP): T[] {
  if (queue.length <= 1) return [...queue];
  const [head, ...rest] = queue;
  const at = Math.min(gap, rest.length);
  return [...rest.slice(0, at), head, ...rest.slice(at)];
}

/** Bỏ từ ở đầu hàng đợi (đã trả lời đúng). */
export function dropHead<T>(queue: readonly T[]): T[] {
  return queue.slice(1);
}
