// Gom các dạng của cùng một từ (amaze/amazed/amazing/amazingly) để không học trùng trong một buổi
// và hiện "cùng họ từ" khi học. Chỉ gom khi dạng gốc cũng nằm trong danh sách, tránh ghép nhầm.
const SUFFIXES = ["ingly", "ically", "ation", "ments", "ment", "ness", "ful", "less", "able", "ibly", "ably", "ing", "ily", "ly", "ed", "er", "ers", "es", "s", "ion", "ity", "al"];

// Cặp "gốc|dạng sinh ra" trông giống họ từ nhưng nghĩa không liên quan (bit|bitter, leg|legal…).
const NOT_RELATED = new Set([
  "bit|bitter", "ear|early", "even|evening", "come|comment", "care|career", "cure|curly", "fame|family",
  "fine|final", "flow|flower", "form|former", "man|manner", "lay|layer", "leg|legal", "let|letter",
  "more|moral", "off|offer", "rid|rider", "rid|riding", "rub|rubber", "should|shoulder", "show|shower",
  "sign|signal", "state|station", "statue|status", "sum|summer", "suf|suffer", "try|trial",
  "polite|politically", "numb|number",
]);

function baseCandidates(word: string): string[] {
  const out: string[] = [];
  for (const suffix of SUFFIXES) {
    if (!word.endsWith(suffix) || word.length - suffix.length < 3) continue;
    const stem = word.slice(0, -suffix.length);
    out.push(stem, `${stem}e`);
    if (stem.endsWith("i")) out.push(`${stem.slice(0, -1)}y`);
    if (stem.length > 3 && stem.at(-1) === stem.at(-2)) out.push(stem.slice(0, -1));
  }
  return out;
}

/** Trả về map từ → từ gốc của họ (từ ngắn nhất tìm được trong danh sách). Từ không có họ thì là gốc của chính nó. */
export function buildFamilies(words: readonly string[]): Map<string, string> {
  const known = new Set(words);
  const root = new Map<string, string>();
  const find = (word: string): string => {
    let current = word;
    while (root.get(current) && root.get(current) !== current) current = root.get(current) as string;
    return current;
  };
  for (const word of [...words].sort((a, b) => a.length - b.length)) {
    if (!root.has(word)) root.set(word, word);
    for (const base of baseCandidates(word)) {
      if (base !== word && known.has(base) && !NOT_RELATED.has(`${base}|${word}`)) {
        root.set(word, find(base));
        break;
      }
    }
  }
  return new Map(words.map((word) => [word, find(word)]));
}
