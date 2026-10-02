import Link from "next/link";
import { LevelBadge } from "@/components/level-badge";
import { TopicName } from "@/components/topic-name";
import { resultLine } from "@/lib/labels";
import { getStudentId } from "@/lib/student";
import { getTopicProgress } from "@/modules/learning/profile";

export default async function ProgressPage() {
  const topics = await getTopicProgress(await getStudentId());
  const answered = topics.reduce((sum, topic) => sum + topic.attempts, 0);
  const correct = topics.reduce((sum, topic) => sum + topic.correct, 0);

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h1 className="font-serif text-4xl font-medium">Tiến độ</h1>
        <p className="text-muted">
          {answered === 0 ? "Bạn chưa nộp câu nào." : `Tổng cộng ${resultLine(correct, answered)}.`}
        </p>
      </div>
      <div className="divide-y divide-line rounded-xl border border-line bg-card">
        {topics.map((topic) => (
          <div key={topic.id} className="flex flex-col items-start gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="min-w-0">
              <Link href={`/learn/${topic.slug}`} className="font-serif text-xl">
                <TopicName name={topic.name} />
              </Link>
              <p className="text-sm text-muted">{resultLine(topic.correct, topic.attempts)}</p>
            </div>
            <LevelBadge level={topic.level} />
          </div>
        ))}
      </div>
    </div>
  );
}
