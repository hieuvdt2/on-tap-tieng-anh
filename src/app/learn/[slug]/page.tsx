import Link from "next/link";
import { notFound } from "next/navigation";
import { Collapse } from "@/components/collapse";
import { GrammarPatterns } from "@/components/grammar-pattern";
import { LessonLines } from "@/components/lesson-lines";
import { TermTag } from "@/components/term-tag";
import { LevelBadge } from "@/components/level-badge";
import { RichText } from "@/components/rich-text";
import { StartPracticeButton } from "@/components/start-practice-button";
import { TopicName } from "@/components/topic-name";
import { topicLabel } from "@/lib/topic-names";
import { getStudentId } from "@/lib/student";
import { toLessonLines } from "@/lib/lesson-lines";
import { getLesson } from "@/modules/curriculum/queries";
import { startPractice } from "@/modules/practice/actions";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-2 border-t border-line py-5">
      <h2 className="text-xs font-medium tracking-[0.14em] text-muted uppercase">{title}</h2>
      <div className="max-w-2xl text-base leading-7">{children}</div>
    </section>
  );
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = await getLesson(slug, await getStudentId());
  if (!lesson) notFound();

  const { topic, progress, prerequisites } = lesson;

  return (
    <article className="grid gap-2">
      <p className="text-sm text-muted">Lớp {topic.gradeFrom}–{topic.gradeTo}</p>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-serif text-4xl font-medium"><TopicName name={topic.name} /></h1>
        <LevelBadge level={progress?.level ?? null} />
      </div>
      <p className="max-w-2xl text-lg leading-8">{topic.summary}</p>

      {prerequisites.length > 0 ? (
        <p className="text-sm text-muted">
          Nên học trước:{" "}
          {prerequisites.map((item, index) => (
            <span key={item.slug}>
              {index > 0 ? ", " : ""}
              <Link className="underline" href={`/learn/${item.slug}`}>
                {topicLabel(item.name)}
              </Link>
            </span>
          ))}
        </p>
      ) : null}

      {lesson.kind === "vocabulary" ? (
        <>
          <Section title="Tổng quan"><RichText text={lesson.vocabulary.overview} /></Section>
          <Section title="Từ và cụm cần nhớ">
            <ul className="grid gap-4">
              {lesson.vocabulary.items.map((item) => (
                <li key={item.word}>
                  <p className="flex flex-wrap items-center gap-2">
                    <TermTag>{item.word}</TermTag>
                    <span className="text-sm text-muted">{item.wordClass}</span>
                  </p>
                  <p>{item.meaningVi}</p>
                  <p className="font-serif text-lg">{item.example}</p>
                  <p className="text-sm text-muted"><RichText text={item.note} /></p>
                </li>
              ))}
            </ul>
          </Section>
          <Collapse title="Cụm hay đi cùng">
            <ul className="grid gap-3">
              {lesson.vocabulary.collocations.map((item) => (
                <li key={item.phrase}>
                  <p><TermTag index={1}>{item.phrase}</TermTag></p>
                  <p>{item.meaningVi}</p>
                  <p className="text-sm text-muted">{item.example}</p>
                </li>
              ))}
            </ul>
          </Collapse>
        </>
      ) : (
        <>
      <Section title="Khái niệm"><LessonLines text={lesson.grammar.purpose} /></Section>
      <Section title="Khi nào dùng"><LessonLines text={lesson.grammar.usage} /></Section>
      <Collapse title="Cấu trúc" defaultOpen>
        <LessonLines text={lesson.grammar.structure} numbered />
        <GrammarPatterns
          affirmative={lesson.grammar.affirmativePattern}
          negative={lesson.grammar.negativePattern}
          question={lesson.grammar.questionPattern}
        />
      </Collapse>
      <Collapse title="Ví dụ">
        <ol className="grid gap-3">
          {lesson.grammar.examples.map((example, index) => (
            <li key={example.sentence} className="flex gap-2">
              <span className="w-6 shrink-0 font-serif text-lg font-semibold text-accent">{index + 1}.</span>
              <div className="min-w-0">
                <p className="font-serif text-lg">{example.sentence}</p>
                <p className="mt-1 flex gap-2 text-sm">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-muted" />
                  <span className="min-w-0"><RichText text={example.note} /></span>
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Collapse>
      <Collapse title="Dấu hiệu nhận biết">
        <ul className="flex flex-wrap gap-2">
          {lesson.grammar.signalWords.map((word, index) => (
            <li key={word}>
              <TermTag index={index}>{word}</TermTag>
            </li>
          ))}
        </ul>
      </Collapse>
      <Collapse title="So sánh">
        <ul className="grid gap-3">
          {lesson.grammar.comparisons.map((comparison, index) => {
            const split = comparison.with.indexOf(": ");
            const title = split > 0 ? comparison.with.slice(0, split) : comparison.with;
            const subtitle = split > 0 ? comparison.with.slice(split + 2) : "";
            const details = toLessonLines(comparison.note);
            return (
              <li key={comparison.with} className="flex gap-2">
                <span aria-hidden className="mt-2.5 size-2 shrink-0 rounded-full bg-foreground" />
                <div className="min-w-0">
                  <p>
                    <TermTag index={index}>{title}</TermTag>
                    {subtitle ? <span> {subtitle}</span> : null}
                  </p>
                  <ul className="mt-1 grid gap-1 pl-1">
                    {details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex gap-2 text-sm">
                        <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-muted" />
                        <span className="min-w-0"><RichText text={detail.text} /></span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      </Collapse>
        </>
      )}

      <Collapse title="Lỗi hay gặp" className="border-b">
        <ul className="grid gap-4">
          {(lesson.kind === "vocabulary" ? lesson.vocabulary.commonMistakes : lesson.grammar.commonMistakes).map((mistake) => (
            <li key={mistake.wrong}>
              <p><span className="text-danger">Sai:</span> {mistake.wrong}</p>
              <p><span className="text-accent">Đúng:</span> {mistake.right}</p>
              <p className="text-sm text-muted"><RichText text={mistake.why} /></p>
            </li>
          ))}
        </ul>
      </Collapse>

      <form action={startPractice} className="pt-4">
        <input type="hidden" name="mode" value="topic" />
        <input type="hidden" name="topicSlug" value={topic.slug} />
        <StartPracticeButton>Luyện chủ đề này</StartPracticeButton>
      </form>
    </article>
  );
}
