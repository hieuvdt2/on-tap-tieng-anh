export type Tone = "correct" | "wrong" | "term";

export type RichPiece = { text: string; tone: Tone | null };

export type HighlightTerm = { text: string; tone: Tone };

const letter = /[A-Za-z']/;

function matchesAt(source: string, index: number, term: string) {
  if (source.slice(index, index + term.length).toLowerCase() !== term.toLowerCase()) return false;
  const before = index === 0 ? "" : source[index - 1];
  const after = source[index + term.length] ?? "";
  return !(before && letter.test(before)) && !(after && letter.test(after));
}

function highlightPlain(source: string, terms: HighlightTerm[]): RichPiece[] {
  const ordered = terms
    .filter((term) => term.text.trim().length > 0)
    .sort((left, right) => right.text.length - left.text.length);
  const pieces: RichPiece[] = [];
  let plain = "";
  let index = 0;

  while (index < source.length) {
    const term = ordered.find((item) => matchesAt(source, index, item.text));
    if (!term) {
      plain += source[index];
      index += 1;
      continue;
    }
    if (plain) pieces.push({ text: plain, tone: null });
    plain = "";
    pieces.push({ text: source.slice(index, index + term.text.length), tone: term.tone });
    index += term.text.length;
  }
  if (plain) pieces.push({ text: plain, tone: null });
  return pieces;
}

export function toRichPieces(source: string, terms: HighlightTerm[] = []): RichPiece[] {
  const pieces: RichPiece[] = [];
  const quoted = /“([^”]+)”/g;
  let last = 0;
  for (const match of source.matchAll(quoted)) {
    const start = match.index ?? 0;
    if (start > last) pieces.push(...highlightPlain(source.slice(last, start), terms));
    const inner = match[1] ?? "";
    const known = terms.find((term) => term.text.toLowerCase() === inner.toLowerCase());
    pieces.push({ text: inner, tone: known?.tone ?? "term" });
    last = start + match[0].length;
  }
  if (last < source.length) pieces.push(...highlightPlain(source.slice(last), terms));
  return pieces;
}

export function optionTerms(input: {
  options: { id: string; text: string }[];
  correctAnswer: string;
  selectedAnswer?: string;
}): HighlightTerm[] {
  return input.options.map((option) => ({
    text: option.text,
    tone:
      option.id === input.correctAnswer
        ? "correct"
        : option.id === input.selectedAnswer
          ? "wrong"
          : "term",
  }));
}
