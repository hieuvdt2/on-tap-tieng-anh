import { AnswerMark } from "@/components/answer-mark";
import { matchedPositions, splitOrder } from "@/lib/ordering";

type Sentence = { id: string; text: string };

// Kết quả câu sắp xếp: mỗi hàng là một vị trí, cột trái là câu học sinh đặt, cột phải là câu đúng.
// Màn hẹp xếp chồng hai ô trong cùng hàng nên vẫn so sánh được theo từng vị trí.
export function OrderingComparison({
  sentences,
  selected,
  correct,
}: {
  sentences: Sentence[];
  selected: string | null | undefined;
  correct: string;
}) {
  const textOf = new Map(sentences.map((sentence) => [sentence.id, sentence.text]));
  const mine = splitOrder(selected);
  const right = splitOrder(correct);
  const matched = matchedPositions(selected, correct);

  return (
    <div className="grid gap-2">
      <p className="text-sm font-medium">
        Bạn đặt đúng {matched}/{right.length} vị trí
      </p>
      <div className="hidden gap-2 px-1 text-xs font-medium text-muted sm:grid sm:grid-cols-[1.5rem_1fr_1fr]">
        <span />
        <span>Bạn chọn</span>
        <span>Đáp án đúng</span>
      </div>
      <ol className="grid gap-2">
        {right.map((id, index) => {
          const placed = mine[index];
          const ok = placed === id;
          return (
            <li key={id} className="grid gap-1.5 sm:grid-cols-[1.5rem_1fr_1fr] sm:gap-2">
              <span className="grid size-6 place-items-center rounded-md border border-line bg-card text-sm font-semibold tabular-nums">
                {index + 1}
              </span>
              <div
                className={`flex items-start gap-2 rounded-lg border px-3 py-2 ${ok ? "border-accent/30 bg-accent/5" : "border-danger/30 bg-danger/5"}`}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted sm:hidden">Bạn chọn</p>
                  <p className="leading-6">{placed ? (textOf.get(placed) ?? placed) : "Chưa đặt câu nào"}</p>
                </div>
                <AnswerMark correct={ok} />
              </div>
              <div className="rounded-lg border border-accent/30 bg-accent/5 px-3 py-2">
                <p className="text-xs text-muted sm:hidden">Đáp án đúng</p>
                <p className="leading-6">{textOf.get(id) ?? id}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
