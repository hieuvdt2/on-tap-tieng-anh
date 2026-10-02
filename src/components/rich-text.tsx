import { toRichPieces, type HighlightTerm, type Tone } from "@/lib/rich-text";

const toneClass: Record<Tone, string> = {
  correct: "bg-accent/10 text-accent",
  wrong: "bg-danger/10 text-danger",
  term: "bg-role-verb/10 text-role-verb",
};

export function RichText({ text, terms }: { text: string; terms?: HighlightTerm[] }) {
  return (
    <>
      {toRichPieces(text, terms).map((piece, index) =>
        piece.tone ? (
          <span
            key={index}
            className={`rounded px-1 py-0.5 font-serif text-[1.05em] font-semibold ${toneClass[piece.tone]}`}
          >
            {piece.text}
          </span>
        ) : (
          <span key={index}>{piece.text}</span>
        ),
      )}
    </>
  );
}
