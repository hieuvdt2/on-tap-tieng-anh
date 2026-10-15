export function splitOrder(value: string | null | undefined) {
  return (value ?? "").split(",").map((id) => id.trim()).filter(Boolean);
}

/** Số vị trí học sinh đặt đúng câu (so từng vị trí với thứ tự đúng). */
export function matchedPositions(selected: string | null | undefined, correct: string) {
  const mine = splitOrder(selected);
  return splitOrder(correct).filter((id, index) => mine[index] === id).length;
}

/** Rút gọn một câu về vài từ đầu để gợi nhớ mà không lặp lại nguyên câu dài. */
export function firstWords(text: string, words = 9) {
  const parts = text.trim().split(/\s+/).filter(Boolean);
  return parts.length <= words ? parts.join(" ") : `${parts.slice(0, words).join(" ")}…`;
}
