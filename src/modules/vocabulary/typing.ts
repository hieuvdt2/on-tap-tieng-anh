// Chấm câu trả lời gõ từ tiếng Anh: bỏ qua hoa/thường, khoảng trắng thừa và kiểu dấu nháy.
function normalise(value: string) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function checkTyped(input: string, headword: string) {
  return normalise(input) === normalise(headword);
}

/** Gợi ý: chữ cái đầu và số chữ, ví dụ "run out of" → "r__ o__ o_". */
export function hint(headword: string, reveal = 1) {
  return headword
    .split(" ")
    .map((part, index) => {
      if (index > 0) return "_".repeat(part.length);
      return part.slice(0, reveal) + "_".repeat(Math.max(0, part.length - reveal));
    })
    .join(" ");
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Che từ trong câu ví dụ (kể cả dạng biến đổi như enrolled/enrolling) để không lộ đáp án. */
export function maskExample(example: string, headword: string) {
  const parts = headword.trim().split(/\s+/);
  if (parts.length > 1) {
    return example.replace(new RegExp(escapeRegExp(headword.trim()), "gi"), "_____");
  }
  const stem = headword.slice(0, Math.max(3, headword.length - 2));
  return example.replace(new RegExp(`\\b${escapeRegExp(stem)}[A-Za-z']*`, "gi"), "_____");
}

// Biến thể Anh/Mỹ thường gặp, quy về một dạng để so sánh (colour = color, organise = organize…).
function americanise(value: string) {
  return value
    .replace(/our\b/g, "or")
    .replace(/our(?=[a-z])/g, "or")
    .replace(/ise\b/g, "ize")
    .replace(/ised\b/g, "ized")
    .replace(/ising\b/g, "izing")
    .replace(/isation\b/g, "ization")
    .replace(/yse\b/g, "yze")
    .replace(/tre\b/g, "ter")
    .replace(/ogue\b/g, "og")
    .replace(/ence\b/g, "ense");
}

function editDistance(a: string, b: string): number {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp: number[][] = Array.from({ length: rows }, (_, i) => [i, ...Array(cols - 1).fill(0)]);
  for (let j = 0; j < cols; j += 1) dp[0][j] = j;
  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return dp[a.length][b.length];
}

export type TypingVerdict = "correct" | "close" | "wrong";

/**
 * Chấm gõ từ: đúng (kể cả biến thể Anh/Mỹ), "gần đúng" khi chỉ sai một ký tự ở từ từ 5 chữ trở lên
 * (cho gõ lại, không tính sai), còn lại là sai.
 */
export function typingVerdict(input: string, headword: string): TypingVerdict {
  const typed = normalise(input);
  const target = normalise(headword);
  if (!typed) return "wrong";
  if (typed === target || americanise(typed) === americanise(target)) return "correct";
  if (target.length >= 5 && editDistance(americanise(typed), americanise(target)) === 1) return "close";
  return "wrong";
}
