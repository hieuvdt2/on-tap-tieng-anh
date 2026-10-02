import Link from "next/link";
import { AnswerMark } from "@/components/answer-mark";
import { ExitButton } from "@/components/exit-button";
import { RichText } from "@/components/rich-text";
import { TopicName } from "@/components/topic-name";
import { optionTerms } from "@/lib/rich-text";
import { getStudentId } from "@/lib/student";
import { listMistakes } from "@/modules/practice/session";

export default async function ReviewPage() {
  const mistakes = await listMistakes(await getStudentId());
  const groups = new Map<string, { name: string; slug: string; items: typeof mistakes }>();

  for (const mistake of mistakes) {
    const group = groups.get(mistake.topicSlug) ?? {
      name: mistake.topicName,
      slug: mistake.topicSlug,
      items: [],
    };
    group.items.push(mistake);
    groups.set(mistake.topicSlug, group);
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <div className="flex items-start justify-between gap-3">
          <h1 className="font-serif text-4xl font-medium">Ôn lỗi</h1>
          <ExitButton href="/" />
        </div>
        <p className="max-w-2xl text-muted">Những câu bạn chọn sai gần đây, gom theo chủ đề.</p>
      </div>
      {mistakes.length === 0 ? (
        <p>Chưa có câu sai. Khi làm sai, câu đó sẽ hiện ở đây.</p>
      ) : (
        [...groups.values()].map((group) => (
          <section key={group.slug} className="grid gap-3">
            <h2 className="font-serif text-2xl">
              <Link href={`/learn/${group.slug}`} className="underline">
                <TopicName name={group.name} />
              </Link>
            </h2>
            {group.items.map((item) => {
              const selected = item.options.find((option) => option.id === item.selectedAnswer);
              const correct = item.options.find((option) => option.id === item.correctAnswer);
              const wrongNote = item.wrongAnswerExplanations.find(
                (note) => note.optionId === item.selectedAnswer,
              );
              const terms = optionTerms({
                options: item.options,
                correctAnswer: item.correctAnswer,
                selectedAnswer: item.selectedAnswer,
              });
              return (
                <article key={item.id} className="grid gap-2 rounded-xl border border-line bg-card px-5 py-4">
                  <h3 className="font-serif text-xl">{item.stem}</h3>
                  <p className="flex items-center gap-2 text-sm">
                    <AnswerMark correct={false} />
                    <span>Bạn chọn: {selected?.text ?? item.selectedAnswer}</span>
                  </p>
                  <p className="flex items-center gap-2 text-sm">
                    <AnswerMark correct />
                    <span>Đáp án: {correct?.text ?? item.correctAnswer}</span>
                  </p>
                  <p className="leading-7"><RichText text={item.explanation} terms={terms} /></p>
                  {wrongNote ? (
                    <p className="text-sm leading-6 text-muted"><RichText text={wrongNote.explanation} terms={terms} /></p>
                  ) : null}
                </article>
              );
            })}
          </section>
        ))
      )}
    </div>
  );
}
