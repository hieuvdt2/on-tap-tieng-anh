import type { FilledSegment } from "@/lib/fill-blank";

/** Câu hoàn chỉnh sau khi điền đáp án đúng vào chỗ trống; phần đáp án được gạch chân để dễ nhận ra. */
export function FilledSentence({ segments, className }: { segments: FilledSegment[]; className?: string }) {
  return (
    <span className={className}>
      {segments.map((segment, index) =>
        segment.isAnswer ? (
          <span key={index} className="font-semibold text-accent underline decoration-2 underline-offset-2">
            {segment.text}
          </span>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </span>
  );
}
