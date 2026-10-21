import { FormPending } from "@/components/form-pending";
import { PendingLink } from "@/components/pending-link";
import { Button } from "@/components/ui/button";
import { getStudentId } from "@/lib/student";
import { startAssessment } from "@/modules/assessment/actions";
import { TEST_LENGTH } from "@/modules/assessment/engine";
import { assessmentPool, listAssessments } from "@/modules/assessment/queries";
import { CEFR_LEVELS } from "@/modules/levels/cefr";

export const dynamic = "force-dynamic";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" }).format(value);
}

export default async function AssessmentPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const query = await searchParams;
  const userId = await getStudentId();
  const [pool, history] = await Promise.all([assessmentPool(), listAssessments(userId)]);
  const perLevel = CEFR_LEVELS.map((level) => ({ level, count: pool.filter((item) => item.level === level).length }));
  const finished = history.filter((item) => item.status === "completed");
  const inProgress = history.find((item) => item.status === "in_progress");

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h1 className="font-serif text-4xl font-medium">Đánh giá năng lực tiếng Anh</h1>
        <p className="max-w-2xl leading-7 text-muted">
          Làm một bài ngắn để biết mình đang ở đâu trên thang CEFR quốc tế (A1 đến C2). Bài không bám sách giáo khoa hay đề thi THPT,
          nên hợp với bất kỳ ai muốn kiểm tra trình độ sau khi ôn tập.
        </p>
      </div>

      <section className="grid gap-4 rounded-xl border-2 border-accent bg-card p-5">
        <ul className="grid gap-1 text-sm leading-6">
          <li>
            <strong>{TEST_LENGTH} câu</strong> ở bốn kỹ năng: ngữ pháp, từ vựng, đọc hiểu và nghe (mỗi câu nghe là một đoạn riêng).
          </li>
          <li>
            <strong>Thích ứng:</strong> làm đúng thì câu sau khó hơn, làm sai thì dễ hơn, nên bài ngắn mà vẫn xếp được mức.
          </li>
          <li>
            Kết quả là <strong>điểm 0–599</strong> (mỗi 100 điểm ứng với một bậc, từ A1 đến C2) cùng mức CEFR và điểm theo từng kỹ năng.
          </li>
          <li>Không quay lại câu trước. Nên làm một mạch, ở nơi yên tĩnh, có tai nghe cho phần nghe.</li>
        </ul>
        <p className="text-xs leading-5 text-muted">
          Đây là bài tự đánh giá để tham khảo, chưa được hiệu chuẩn bằng dữ liệu thật và không phải chứng chỉ hay thay cho IELTS, Cambridge.
        </p>
        {query.error ? (
          <p className="text-sm text-danger">Ngân hàng câu hỏi chưa đủ cho bài đánh giá. Hãy quay lại sau khi có thêm nội dung.</p>
        ) : null}
        {inProgress ? (
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild>
              <PendingLink href={`/assessment/${inProgress.id}`} label="Đang mở…">Làm tiếp bài đang dở</PendingLink>
            </Button>
            <span className="text-sm text-muted">Bắt đầu bài mới sẽ để bài dở này lại.</span>
          </div>
        ) : null}
        <form action={startAssessment} className="grid gap-2">
          <Button type="submit" variant={inProgress ? "outline" : "default"} className="w-fit">
            Bắt đầu bài đánh giá mới
          </Button>
          <FormPending label="Đang chuẩn bị bài…" />
        </form>
        <p className="text-xs text-muted">
          Ngân hàng hiện có: {perLevel.map((item) => `${item.level} ${item.count}`).join(" · ")} câu.
        </p>
      </section>

      <section className="grid gap-2">
        <h2 className="font-serif text-2xl">Kết quả các lần trước</h2>
        {finished.length === 0 ? (
          <p className="text-sm text-muted">Bạn chưa hoàn thành bài đánh giá nào.</p>
        ) : (
          <ul className="grid gap-2 text-sm">
            {finished.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line bg-card px-4 py-3">
                <span>
                  {item.finishedAt ? formatDate(item.finishedAt) : formatDate(item.startedAt)} ·{" "}
                  <strong>{item.score}/599</strong> · {item.level}
                </span>
                <PendingLink className="text-accent underline" href={`/assessment/${item.id}`} label="Đang mở…">Xem kết quả</PendingLink>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
