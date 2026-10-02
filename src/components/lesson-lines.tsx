import { RichText } from "@/components/rich-text";
import { TermTag } from "@/components/term-tag";
import { toLessonLines, type LessonLine } from "@/lib/lesson-lines";

function LineBody({ line, index }: { line: LessonLine; index: number }) {
  return (
    <span className="min-w-0">
      {line.term ? <TermTag index={index}>{line.term}</TermTag> : null}
      {line.term && line.text ? " " : null}
      {line.text ? <RichText text={line.text} /> : null}
    </span>
  );
}

function NestedList({ items }: { items: LessonLine[] }) {
  return (
    <ul className="mt-1 grid gap-1 pl-6">
      {items.map((line, index) => (
        <li key={index} className="flex gap-2">
          <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-muted" />
          <LineBody line={line} index={index + 1} />
        </li>
      ))}
    </ul>
  );
}

export function LessonLines({ text, numbered = false }: { text: string; numbered?: boolean }) {
  const lines = toLessonLines(text);
  if (lines.length === 1 && !lines[0]?.term && lines[0]?.children.length === 0) {
    return <p><RichText text={lines[0]?.text ?? ""} /></p>;
  }

  const List = numbered ? "ol" : "ul";
  return (
    <List className="grid gap-3">
      {lines.map((line, index) => (
        <li key={index}>
          <div className="flex gap-2">
            {numbered ? (
              <span className="w-6 shrink-0 font-serif text-lg font-semibold text-accent">{index + 1}.</span>
            ) : (
              <span aria-hidden className="mt-2.5 size-2 shrink-0 rounded-full bg-foreground" />
            )}
            <div className="min-w-0">
              <LineBody line={line} index={index} />
              {line.children.length > 0 ? <NestedList items={line.children} /> : null}
            </div>
          </div>
        </li>
      ))}
    </List>
  );
}
