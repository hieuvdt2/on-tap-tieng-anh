import Link from "next/link";
import { LevelBadge } from "@/components/level-badge";
import { StartPracticeButton } from "@/components/start-practice-button";
import { TopicName } from "@/components/topic-name";
import { topicLabel } from "@/lib/topic-names";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { levelLabel, resultLine } from "@/lib/labels";
import { getStudentId } from "@/lib/student";
import { getExamNote } from "@/modules/curriculum/queries";
import { getDashboard } from "@/modules/learning/profile";
import { startPractice } from "@/modules/practice/actions";

export default async function HomePage() {
  const userId = await getStudentId();
  const [dashboard, examNote] = await Promise.all([getDashboard(userId), getExamNote()]);
  const next = dashboard.next;

  return (
    <div className="grid gap-8">
      <section className="grid gap-3">
        <p className="text-sm text-muted">Chào Học sinh</p>
        <h1 className="font-serif text-4xl font-medium">
          {dashboard.overall ? `Mức hiện tại: ${levelLabel[dashboard.overall]}` : "Bắt đầu từ nền ngữ pháp"}
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted">
          {dashboard.started
            ? `Bạn đã làm ${dashboard.answered} câu, ${resultLine(dashboard.correct, dashboard.answered).toLowerCase()}. Mức này chỉ phản ánh các câu trong app.`
            : "Học một chủ đề, làm vài câu, rồi xem mình đang yếu chỗ nào. Chấm điểm không cần AI."}
        </p>
        {next ? (
          <div className="grid gap-3 pt-2 sm:flex sm:flex-wrap">
            <Button asChild className="w-full sm:w-auto">
              <Link href={`/learn/${next.slug}`}>Học {topicLabel(next.name)}</Link>
            </Button>
            <form action={startPractice}>
              <input type="hidden" name="mode" value="weakness" />
              <StartPracticeButton variant="outline" className="w-full sm:w-auto">Luyện tiếp</StartPracticeButton>
            </form>
          </div>
        ) : null}
      </section>

      <section className="grid gap-3">
        <h2 className="font-serif text-2xl">{dashboard.started ? "Chủ đề cần ôn" : "Nên bắt đầu từ đây"}</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {dashboard.focus.map((topic) => (
            <Card key={topic.id}>
              <CardHeader>
                <CardTitle><TopicName name={topic.name} /></CardTitle>
                <CardDescription>{topic.summary}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-3 pt-0">
                <div className="grid min-w-0 justify-items-start gap-2">
                  <LevelBadge level={topic.level} />
                  <p className="text-sm text-muted">{resultLine(topic.correct, topic.attempts)}</p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/learn/${topic.slug}`}>Học</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {examNote ? <p className="max-w-3xl text-sm leading-6 text-muted">{examNote}</p> : null}
    </div>
  );
}
