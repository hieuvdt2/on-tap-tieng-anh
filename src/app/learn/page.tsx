import Link from "next/link";
import { LevelBadge } from "@/components/level-badge";
import { TopicName } from "@/components/topic-name";
import { resultLine } from "@/lib/labels";
import { getStudentId } from "@/lib/student";
import { getTopicProgress } from "@/modules/learning/profile";

function gradeLabel(from: number, to: number) {
  return from === to ? `Lớp ${from}` : `Lớp ${from}–${to}`;
}

export default async function LearnPage() {
  const topics = await getTopicProgress(await getStudentId());
  const grammar = topics.filter((topic) => topic.skill !== "vocabulary");
  const vocabulary = topics.filter((topic) => topic.skill === "vocabulary");
  const groups = [
    {
      title: "Nền tảng",
      description: "Các cấu trúc cần nắm trước khi học phần còn lại.",
      topics: grammar.filter((topic) => topic.gradeFrom <= 7),
    },
    {
      title: "Cốt lõi",
      description: "Các điểm ngữ pháp thường xuất hiện trong câu và đoạn văn.",
      topics: grammar.filter((topic) => topic.gradeFrom >= 8 && topic.gradeFrom <= 9),
    },
    {
      title: "Nâng cao",
      description: "Cấu trúc cần phân biệt kỹ khi làm câu vận dụng.",
      topics: grammar.filter((topic) => topic.gradeFrom >= 10),
    },
    {
      title: "Từ vựng và cụm",
      description: "Nghĩa trong câu, cụm từ, cụm động từ và giới từ đi kèm.",
      topics: vocabulary,
    },
  ].filter((group) => group.topics.length > 0);

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h1 className="font-serif text-4xl font-medium">Chủ đề</h1>
        <p className="max-w-2xl text-muted">
          {topics.length} chủ đề, gồm ngữ pháp và từ vựng. Mỗi bài có ví dụ và lỗi hay gặp trước khi luyện.
        </p>
      </div>
      <div className="grid gap-8">
        {groups.map((group) => (
          <section key={group.title} className="grid gap-3">
            <div>
              <h2 className="font-serif text-2xl">{group.title}</h2>
              <p className="text-sm text-muted">{group.description}</p>
            </div>
            <div className="grid gap-3">
              {group.topics.map((topic) => (
                <Link
                  key={topic.id}
                  href={`/learn/${topic.slug}`}
                  className="grid gap-2 rounded-xl border border-line bg-card px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-center"
                >
                  <div>
                    <p className="text-xs text-muted">
                      {gradeLabel(topic.gradeFrom, topic.gradeTo)}
                    </p>
                    <h3 className="font-serif text-2xl"><TopicName name={topic.name} /></h3>
                    <p className="text-sm text-muted">{topic.summary}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted">
                      {resultLine(topic.correct, topic.attempts)}
                    </span>
                    <LevelBadge level={topic.level} />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
