import { PendingLink } from "@/components/pending-link";
import { Button } from "@/components/ui/button";
import { practiceModeLabel } from "@/lib/labels";
import { getStudentId } from "@/lib/student";
import { topicLabel } from "@/lib/topic-names";
import { listPracticeHistory } from "@/modules/practice/session";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(value);
}

export default async function PracticeHistoryPage() {
  const history = await listPracticeHistory(await getStudentId());

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h1 className="font-serif text-4xl font-medium">Lịch sử luyện tập</h1>
        <p className="max-w-2xl leading-7 text-muted">
          Xem lại từng phiên luyện, chẩn đoán và ôn lỗi, hoặc làm tiếp phiên còn dở. Tối đa 50 phiên gần nhất được hiển thị.
        </p>
      </div>

      {history.length === 0 ? (
        <div className="grid justify-items-start gap-3 rounded-xl border border-line bg-card p-5">
          <p>Bạn chưa có phiên luyện nào.</p>
          <Button asChild>
            <PendingLink href="/practice" label="Đang mở…">Bắt đầu luyện</PendingLink>
          </Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {history.map((item) => {
            const finished = item.total > 0 && item.answered >= item.total;
            const title = practiceModeLabel[item.mode] ?? "Phiên luyện";
            return (
              <article
                key={item.id}
                className="flex flex-col gap-4 rounded-xl border border-line bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="grid gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-serif text-2xl">{title}</h2>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        finished ? "bg-accent/10 text-accent" : "bg-warning/10 text-warning"
                      }`}
                    >
                      {finished ? "Đã xong" : `Đang làm ${item.answered}/${item.total}`}
                    </span>
                  </div>
                  <p className="text-sm text-muted">
                    {formatDate(item.startedAt)}
                    {item.topicName ? ` · ${topicLabel(item.topicName)}` : ""} · {item.total} câu
                  </p>
                  {finished ? (
                    <p className="font-medium text-accent">Đúng {item.correct}/{item.total} câu</p>
                  ) : null}
                </div>
                <Button asChild variant={finished ? "outline" : "default"}>
                  <PendingLink
                    href={finished ? `/practice/${item.id}?done=1` : `/practice/${item.id}`}
                    label="Đang mở phiên luyện…"
                  >
                    {finished ? "Xem lại" : "Tiếp tục"}
                  </PendingLink>
                </Button>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
