import Link from "next/link";
import { Button } from "@/components/ui/button";
import { missingSections } from "@/modules/exam/score";
import { listExamSpecs, sectionStock } from "@/modules/exam/queries";
import { startMockExam } from "@/modules/exam/actions";

export default async function MockExamPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const query = await searchParams;
  const [specs, stock] = await Promise.all([listExamSpecs(), sectionStock()]);
  const ordered = [...specs].sort((left, right) => left.yearLabel.localeCompare(right.yearLabel));

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <div className="flex items-start justify-between gap-3">
          <h1 className="font-serif text-4xl font-medium">Thi thử</h1>
          <Button asChild variant="outline">
            <Link href="/mock-exam/history">Lịch sử thi</Link>
          </Button>
        </div>
        <p className="max-w-2xl leading-7 text-muted">
          Mã đề A và mã đề B, mỗi mã có 40 câu và 50 phút, cùng các dạng của kỳ thi. Câu và đoạn văn được soạn trong app, không phải đề của Bộ. Khung 2025+ vẫn khóa vì kho chung chưa đủ từng dạng. Đề luyện ngắn vẫn còn để tập màn thi.
        </p>
      </div>
      {query.error === "locked" ? (
        <p className="text-sm text-danger">Đề này đang khóa vì chưa đủ câu đúng dạng.</p>
      ) : null}
      <div className="grid gap-3">
        {ordered.map((spec) => {
          const missing = missingSections(spec.sections, stock);
          const fixed = (spec.questionIds?.length ?? 0) === spec.questionCount;
          const practice = spec.yearLabel === "practice";
          const aiGenerated = spec.source === "Đề AI trong app";
          const title = practice
            ? "Đề luyện trong app"
            : aiGenerated
              ? "Đề AI trong app"
              : spec.id === "exam-form-b"
                ? "Mã đề B"
                : fixed
                  ? "Mã đề A"
                  : `Khung ${spec.yearLabel}`;
          return (
            <article key={spec.id} className="grid gap-3 rounded-xl border border-line bg-card px-5 py-4">
              <div>
                <h2 className="font-serif text-2xl">{title}</h2>
                <p className="text-sm text-muted">
                  {spec.questionCount} câu · {spec.durationMinutes} phút · {spec.status === "provisional" ? "tạm thời" : spec.status}
                </p>
              </div>
              <p className="text-sm leading-6 text-muted">{spec.notes}</p>
              {fixed || missing.length === 0 ? (
                <form action={startMockExam}>
                  <input type="hidden" name="specificationId" value={spec.id} />
                  <Button type="submit">Bắt đầu</Button>
                </form>
              ) : (
                <ul className="grid gap-1 text-sm">
                  {missing.map((section) => (
                    <li key={section.questionType}>
                      Thiếu {section.label}: đang có {section.available}/{section.count}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
