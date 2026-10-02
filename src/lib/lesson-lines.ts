export type LessonLine = {
  term: string | null;
  text: string;
  children: LessonLine[];
};

const maxTermLength = 60;

function splitTerm(line: string): LessonLine {
  const split = line.indexOf(": ");
  if (split <= 0 || split > maxTermLength) return { term: null, text: line, children: [] };
  return { term: line.slice(0, split).trim(), text: line.slice(split + 2).trim(), children: [] };
}

function explodeSentences(text: string) {
  if (text.length < 90 || !text.includes(". ")) return [text];
  const parts = text.split(/(?<=\.)\s+/).map((part) => part.trim()).filter(Boolean);
  return parts.length > 1 ? parts : [text];
}

export function toLessonLines(source: string): LessonLine[] {
  const roots: LessonLine[] = [];
  for (const raw of source.split("\n")) {
    const nested = /^\s*-\s+/.test(raw);
    const line = raw.replace(/^\s*-\s+/, "").trim();
    if (!line) continue;
    const item = splitTerm(line);
    if (nested && roots.length > 0) {
      roots[roots.length - 1]?.children.push(item);
      continue;
    }
    if (!item.term) {
      for (const sentence of explodeSentences(item.text)) roots.push({ term: null, text: sentence, children: [] });
      continue;
    }
    roots.push(item);
  }
  return roots;
}
