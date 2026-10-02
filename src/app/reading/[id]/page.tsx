import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ExitButton } from "@/components/exit-button";
import { PassageForm } from "@/components/passage-form";
import { db } from "@/db/client";
import { questions, stimuli } from "@/db/schema";
import { scorePassage } from "@/modules/exam/actions";

export default async function ReadingPassagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const passages = await db.select().from(stimuli).where(eq(stimuli.id, id)).limit(1);
  const passage = passages[0];
  if (!passage || passage.kind !== "passage") notFound();

  const rows = await db
    .select()
    .from(questions)
    .where(and(eq(questions.stimulusId, id), eq(questions.status, "published")));
  rows.sort((left, right) => left.id.localeCompare(right.id, "en", { numeric: true }));
  if (rows.length === 0) notFound();

  return (
    <div className="mx-auto grid w-full max-w-3xl gap-6">
      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted">Bài đọc</p>
          <ExitButton href="/reading" warning="Nếu chưa nộp bài, các đáp án sẽ không được lưu." />
        </div>
        <h1 className="font-serif text-4xl font-medium">{passage.title}</h1>
      </div>
      <PassageForm
        stimulusId={passage.id}
        passageBody={passage.body}
        questions={rows.map((question) => ({
          id: question.id,
          stem: question.stem,
          options: question.options,
        }))}
        action={scorePassage}
      />
    </div>
  );
}
