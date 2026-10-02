import { FormPending } from "@/components/form-pending";
import { Button } from "@/components/ui/button";
import { startDiagnostic } from "@/modules/exam/actions";

export default async function DiagnosticPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const query = await searchParams;

  return (
    <div className="grid max-w-2xl gap-4">
      <h1 className="font-serif text-4xl font-medium">Chẩn đoán</h1>
      <p className="leading-7 text-muted">
        16 câu đã xuất bản, rải các chủ đề đang có. Sau khi nộp, app ước lượng mức sẵn sàng và chỉ chủ đề nên học trước. Đây không phải điểm thi.
      </p>
      {query.error === "empty" ? (
        <p className="text-sm text-danger">Chưa đủ câu đã xuất bản để mở bài chẩn đoán.</p>
      ) : null}
      <form action={startDiagnostic}>
        <Button type="submit">Bắt đầu</Button>
        <FormPending label="Đang mở bài chẩn đoán…" />
      </form>
    </div>
  );
}
