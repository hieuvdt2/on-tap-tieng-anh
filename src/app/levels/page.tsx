import { Button } from "@/components/ui/button";
import { FormPending } from "@/components/form-pending";
import { PendingLink } from "@/components/pending-link";
import { getStudentId } from "@/lib/student";
import { startLevelTest } from "@/modules/levels/actions";
import { bandAvailability, listLevelHistory } from "@/modules/levels/queries";

export const dynamic = "force-dynamic";

const errors: Record<string, string> = {
  empty: "Dải này chưa đủ câu để ghép đề. Hãy thử dải khác hoặc quay lại sau khi có thêm nội dung.",
  invalid: "Chưa chọn được dải trình độ. Hãy chọn lại.",
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" }).format(value);
}

export default async function LevelsPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const query = await searchParams;
  const userId = await getStudentId();
  const [bands, history] = await Promise.all([bandAvailability(), listLevelHistory(userId)]);

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h1 className="font-serif text-4xl font-medium">Làm đề theo trình độ</h1>
        <p className="max-w-2xl leading-7 text-muted">
          Chọn một dải trình độ CEFR và làm đề ngắn gồm ngữ pháp, từ vựng, đọc hiểu và nghe. Kết quả cho biết bạn đang ở khoảng mức nào
          và nên luyện tiếp thế nào. Đây là bài tự đánh giá để luyện tập, không thay thế chứng chỉ hay bài thi chính thức.
        </p>
      </div>
      {query.error ? <p className="text-sm text-danger">{errors[query.error] ?? "Không bắt đầu được đề."}</p> : null}

      <div className="grid gap-3 md:grid-cols-3">
        {bands.map((item) => {
          const ready = item.readyQuestions > 0;
          return (
            <section key={item.band.id} className="grid content-start gap-3 rounded-xl border border-line bg-card p-5">
              <div className="grid gap-1">
                <p className="text-sm text-muted">{item.band.title}</p>
                <h2 className="font-serif text-3xl font-medium">{item.band.label}</h2>
                <p className="text-sm leading-6 text-muted">{item.band.description}</p>
              </div>
              <p className="text-sm">
                {ready ? (
                  <>
                    Đề khoảng <strong>{item.readyQuestions} câu</strong>
                    {item.hasListening ? "" : " (chưa có phần nghe)"}
                    {item.shortfall && item.hasListening ? " (ngắn hơn chuẩn)" : ""}
                  </>
                ) : (
                  <span className="text-danger">Chưa đủ nội dung</span>
                )}
              </p>
              <p className="text-xs text-muted">
                Kho: {item.band.levels.map((level) => `${level}: ${item.perLevel[level] ?? 0} câu`).join(" · ")}
              </p>
              <form action={startLevelTest} className="grid gap-2">
                <input type="hidden" name="band" value={item.band.id} />
                <Button type="submit" disabled={!ready} className="w-fit">
                  Bắt đầu đề {item.band.label}
                </Button>
                <FormPending label="Đang tạo đề…" />
              </form>
            </section>
          );
        })}
      </div>

      <section className="grid gap-2">
        <h2 className="font-serif text-2xl">Lần làm gần đây</h2>
        {history.length === 0 ? (
          <p className="text-sm text-muted">Bạn chưa làm đề theo trình độ nào.</p>
        ) : (
          <ul className="grid gap-2 text-sm">
            {history.map((item) => {
              const done = Boolean(item.submittedAt);
              const percent = Math.round((item.score ?? 0) * 10);
              const correct = Math.round(((item.score ?? 0) * item.questionCount) / 10);
              return (
                <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line bg-card px-4 py-3">
                  <span>
                    {item.yearLabel.replace(/^CEFR /, "")} · {formatDate(item.startedAt)} ·{" "}
                    {done ? `${correct}/${item.questionCount} đúng (${percent}%)` : "chưa nộp"}
                  </span>
                  <PendingLink className="text-accent underline" href={`/levels/${item.id}`} label="Đang mở…">
                    {done ? "Xem lại" : "Làm tiếp"}
                  </PendingLink>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
