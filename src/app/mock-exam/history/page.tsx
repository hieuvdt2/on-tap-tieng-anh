import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getStudentId } from "@/lib/student";
import { listExamHistory } from "@/modules/exam/queries";
import { formatExamScore } from "@/modules/exam/score";

function examTitle(item: Awaited<ReturnType<typeof listExamHistory>>[number]) {
  if (item.source === "Đề AI trong app") return "Đề AI trong app";
  if (item.specificationId === "exam-form-a") return "Mã đề A";
  if (item.specificationId === "exam-form-b") return "Mã đề B";
  if (item.yearLabel === "practice") return "Đề luyện trong app";
  return `Khung ${item.yearLabel}`;
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(value);
}

export default async function ExamHistoryPage() {
  const history = await listExamHistory(await getStudentId());

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h1 className="font-serif text-4xl font-medium">Lịch sử thi</h1>
        <p className="max-w-2xl leading-7 text-muted">
          Xem lại điểm, đáp án và lời giải của các đề đã nộp. Tối đa 50 lượt gần nhất được hiển thị.
        </p>
      </div>

      {history.length === 0 ? (
        <div className="grid justify-items-start gap-3 rounded-xl border border-line bg-card p-5">
          <p>Bạn chưa làm đề thi nào.</p>
          <Button asChild>
            <Link href="/mock-exam">Chọn đề thi</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {history.map((item) => {
            const submitted = Boolean(item.submittedAt);
            const expired = !submitted && item.expired;
            const status = submitted ? "Đã nộp" : expired ? "Đã hết giờ" : "Đang làm";
            const statusClass = submitted
              ? "bg-accent/10 text-accent"
              : expired
                ? "bg-danger/10 text-danger"
                : "bg-warning/10 text-warning";

            return (
              <article
                key={item.id}
                className="flex flex-col gap-4 rounded-xl border border-line bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="grid gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-serif text-2xl">{examTitle(item)}</h2>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClass}`}>
                      {status}
                    </span>
                  </div>
                  <p className="text-sm text-muted">
                    {formatDate(item.startedAt)} · {item.questionCount} câu · {item.durationMinutes} phút
                  </p>
                  {submitted ? (
                    <p className="font-medium text-accent">
                      Điểm: {formatExamScore(item.score ?? 0)} / 10
                    </p>
                  ) : null}
                </div>
                <Button asChild variant={submitted ? "outline" : "default"}>
                  <Link href={`/mock-exam/${item.id}`}>
                    {submitted ? "Xem lại" : expired ? "Hoàn tất bài" : "Tiếp tục"}
                  </Link>
                </Button>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
