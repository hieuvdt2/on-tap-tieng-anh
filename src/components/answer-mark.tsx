export function AnswerMark({ correct }: { correct: boolean }) {
  return (
    <span
      className={`flex size-6 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-accent-foreground ${
        correct ? "bg-accent" : "bg-danger"
      }`}
      aria-hidden
    >
      {correct ? "✓" : "✕"}
    </span>
  );
}
