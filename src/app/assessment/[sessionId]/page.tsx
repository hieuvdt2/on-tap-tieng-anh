import { notFound } from "next/navigation";
import { AssessmentPlayer } from "@/components/assessment-player";
import { ExitButton } from "@/components/exit-button";
import { FormPending } from "@/components/form-pending";
import { PendingLink } from "@/components/pending-link";
import { Button } from "@/components/ui/button";
import { getStudentId } from "@/lib/student";
import { startAssessment } from "@/modules/assessment/actions";
import type { AssessmentResult } from "@/modules/assessment/engine";
import { getAssessmentSession, listAssessments, publicItem } from "@/modules/assessment/queries";
import { CEFR_LEVELS, isCefrLevel, LEVEL_SUMMARIES } from "@/modules/levels/cefr";

export const dynamic = "force-dynamic";

export default async function AssessmentSessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const userId = await getStudentId();
  const session = await getAssessmentSession(sessionId, userId);
  if (!session) notFound();

  if (session.status === "in_progress") {
    const current = session.current;
    const item = current ? await publicItem(current.questionId, current.skill as never) : null;
    if (!item) notFound();
    return (
      <div className="grid gap-4">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3">
          <h1 className="font-serif text-2xl">Bài đánh giá năng lực</h1>
          <ExitButton href="/assessment" warning="Bài làm dở được lưu. Bạn có thể vào lại và làm tiếp từ câu này." />
        </div>
        <AssessmentPlayer sessionId={session.id} initial={item} index={session.items.length + 1} />
      </div>
    );
  }

  const result = session.result as unknown as AssessmentResult | null;
  if (!result) notFound();
  const previous = (await listAssessments(userId))
    .filter((entry) => entry.status === "completed" && entry.id !== session.id && entry.startedAt < session.startedAt)
    .at(0);
  const delta = previous?.score != null ? result.score - previous.score : null;
  const levelIndex = CEFR_LEVELS.indexOf(result.level);
  const nextLevel = CEFR_LEVELS[levelIndex + 1];

  return (
    <div className="mx-auto grid w-full max-w-3xl gap-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted">Kết quả bài đánh giá năng lực</p>
        <ExitButton href="/assessment" />
      </div>

      <section className="grid justify-items-center gap-2 rounded-xl border-2 border-accent bg-card p-6 text-center">
        <p className="text-sm text-muted">Mức của bạn</p>
        <h1 className="font-serif text-6xl font-medium">{result.level}</h1>
        <p className="text-xl">
          <strong>{result.score}</strong>
          <span className="text-muted">/599</span>
          <span className="ml-2 text-sm text-muted">(khoảng ±{result.margin})</span>
        </p>
        {delta !== null ? (
          <p className="text-sm text-muted">
            So với lần trước: {delta > 0 ? "+" : ""}
            {delta} điểm
          </p>
        ) : null}
        <p className="max-w-xl leading-7">{isCefrLevel(result.level) ? LEVEL_SUMMARIES[result.level] : ""}</p>
        <p className="max-w-xl text-xs leading-5 text-muted">
          Ước lượng từ {result.answered} câu, chưa hiệu chuẩn bằng dữ liệu người làm thật và không phải chứng chỉ. Làm lại vài lần để thấy xu hướng
          đáng tin hơn.
        </p>
      </section>

      <section className="grid gap-2 rounded-xl border border-line bg-card p-4">
        <h2 className="font-medium">Theo kỹ năng</h2>
        {result.skills.map((skill) => (
          <p key={skill.skill} className="flex flex-wrap justify-between gap-2 text-sm">
            <span>{skill.label}</span>
            <span>
              {skill.correct}/{skill.total} đúng
              {skill.level ? <strong className="ml-2">≈ {skill.level}</strong> : <span className="ml-2 text-muted">chưa đủ câu để xếp mức</span>}
            </span>
          </p>
        ))}
        <p className="text-xs text-muted">Mức theo từng kỹ năng chỉ tham khảo vì mỗi kỹ năng chỉ có vài câu.</p>
      </section>

      <section className="grid gap-2 rounded-xl border border-line bg-card p-4 text-sm leading-6">
        <h2 className="font-medium">Gợi ý luyện tiếp</h2>
        <p>
          {nextLevel
            ? `Để tiến tới ${nextLevel}, luyện đều ở ${result.level} rồi thử các đề dải tương ứng, và ôn từ vựng mỗi ngày.`
            : "Bạn đã ở mức cao nhất của thang. Duy trì bằng đọc và nghe tài liệu thật."}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <PendingLink href="/levels" label="Đang mở…">Luyện theo trình độ</PendingLink>
          </Button>
          <Button asChild variant="outline" size="sm">
            <PendingLink href="/vocabulary" label="Đang mở…">Ôn từ vựng</PendingLink>
          </Button>
        </div>
      </section>

      <form action={startAssessment}>
        <Button type="submit">Làm bài đánh giá khác</Button>
        <FormPending label="Đang chuẩn bị bài…" />
      </form>
    </div>
  );
}
