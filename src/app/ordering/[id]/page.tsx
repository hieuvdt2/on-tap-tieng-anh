import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ExitButton } from "@/components/exit-button";
import { OrderingPractice } from "@/components/ordering-practice";
import { db } from "@/db/client";
import { questions, stimuli } from "@/db/schema";
import { scoreOrdering } from "@/modules/exam/actions";

export default async function OrderingItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rows = await db
    .select({
      id: questions.id,
      type: questions.type,
      stem: questions.stem,
      options: questions.options,
      title: stimuli.title,
    })
    .from(questions)
    .leftJoin(stimuli, eq(questions.stimulusId, stimuli.id))
    .where(eq(questions.id, id))
    .limit(1);
  const item = rows[0];
  if (!item || item.type !== "ordering") notFound();

  return (
    <div className="mx-auto grid w-full max-w-3xl gap-4">
      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted">{item.title}</p>
          <ExitButton href="/ordering" warning="Nếu chưa nộp bài, thứ tự đã chọn sẽ không được lưu." />
        </div>
        <h1 className="font-serif text-4xl font-medium">{item.stem}</h1>
      </div>
      <OrderingPractice questionId={item.id} sentences={item.options} action={scoreOrdering} />
    </div>
  );
}
