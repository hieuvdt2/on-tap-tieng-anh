import { notFound, redirect } from "next/navigation";
import { AnswerMark } from "@/components/answer-mark";
import { Collapse } from "@/components/collapse";
import { ExamWorkspace, type PaletteGroup, type PaletteItem, type PlayerQuestion } from "@/components/exam-workspace";
import { ExitButton } from "@/components/exit-button";
import { FormPending } from "@/components/form-pending";
import { ReportQuestion } from "@/components/report-question";
import { Button } from "@/components/ui/button";
import { getStudentId } from "@/lib/student";
import { autosaveExamAnswers, submitMockExam } from "@/modules/exam/actions";
import { groupExamBlocks } from "@/modules/exam/group";
import { getExamSession } from "@/modules/exam/queries";
import { startLevelTest } from "@/modules/levels/actions";
import { BANDS, estimateLevel, isCefrLevel, LEVEL_SOURCE, parseBand, type CefrLevel } from "@/modules/levels/cefr";
import type { LevelSection } from "@/modules/levels/compose";
import { reportedByUser } from "@/modules/questions/reports";
import { scoreAnswer } from "@/modules/questions/score";

export const dynamic = "force-dynamic";

function answerText(options: { id: string; text: string }[], id: string) {
  return options.find((option) => option.id === id)?.text ?? (id ? id : "Chưa chọn");
}

function readMeta(notes: string): { band: string; sections: LevelSection[] } {
  try {
    const parsed = JSON.parse(notes) as { band?: string; sections?: LevelSection[] };
    return { band: parsed.band ?? "", sections: Array.isArray(parsed.sections) ? parsed.sections : [] };
  } catch {
    return { band: "", sections: [] };
  }
}

export default async function LevelSessionPage({
  params,
  searchParams,
}: {
  params: Promise<{ sessionId: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { sessionId } = await params;
  const query = await searchParams;
  const userId = await getStudentId();
  const bundle = await getExamSession(sessionId, userId);
  if (!bundle) notFound();
  const { session, spec, questions } = bundle;
  if (spec.source !== LEVEL_SOURCE) redirect(`/mock-exam/${sessionId}`);

  const meta = readMeta(spec.notes);
  const band = parseBand(meta.band) ?? BANDS[1];
  const submitted = Boolean(session.submittedAt);
  const answers = session.answers ?? {};
  const numbers = new Map(questions.map((question, index) => [question.id, index + 1]));
  const blocks = groupExamBlocks(questions);

  if (!submitted) {
    // Câu độc lập (ngữ pháp, từ vựng) không thuộc khối đoạn nào nên không nằm trong `blocks`: duyệt theo thứ tự đề.
    const passageKeyOf = new Map<string, string>();
    for (const block of blocks) {
      if (block.kind === "stimulus") for (const item of block.items) passageKeyOf.set(item.id, block.key);
    }
    const playerQuestions: PlayerQuestion[] = questions.map((item) => ({
      id: item.id,
      number: numbers.get(item.id) ?? 0,
      type: item.type,
      stem: item.stem,
      options: item.options,
      passageKey: passageKeyOf.get(item.id) ?? null,
      saved: answers[item.id],
    }));
    const passages = Object.fromEntries(
      blocks.flatMap((block) =>
        block.kind === "stimulus"
          ? [[block.key, { title: block.title, body: block.body, listening: block.stimulusKind === "listening" }]]
          : [],
      ),
    );
    const palette: PaletteItem[] = questions.map((question, index) => ({ id: question.id, number: index + 1, answered: Boolean(answers[question.id]) }));
    const groups: PaletteGroup[] = meta.sections.map((section) => ({ label: section.label, from: section.from, to: section.to }));
    return (
      <ExamWorkspace
        sessionId={session.id}
        paperLabel={`Trình độ ${band.label}`}
        endsAt={session.endsAt.toISOString()}
        total={spec.questionCount}
        questions={playerQuestions}
        passages={passages}
        palette={palette}
        groups={groups}
        instructions={{}}
        initialQuestionId={query.q}
        submitAction={submitMockExam}
        autosaveAction={autosaveExamAnswers}
      />
    );
  }

  // ---- Kết quả ----
  const results = questions.map((question) => ({
    question,
    correct: scoreAnswer(question.correctAnswer, answers[question.id] ?? ""),
    number: numbers.get(question.id) ?? 0,
  }));
  const correctCount = results.filter((item) => item.correct).length;
  const percent = results.length ? Math.round((correctCount / results.length) * 100) : 0;
  const perLevel: Partial<Record<CefrLevel, { correct: number; total: number }>> = {};
  for (const item of results) {
    const level = item.question.cefr;
    if (!isCefrLevel(level)) continue;
    const entry = perLevel[level] ?? { correct: 0, total: 0 };
    entry.total += 1;
    if (item.correct) entry.correct += 1;
    perLevel[level] = entry;
  }
  const estimate = estimateLevel(band, perLevel);
  const bandIndex = BANDS.findIndex((item) => item.id === band.id);
  const nextBand = estimate.direction === "up" ? BANDS[bandIndex + 1] : estimate.direction === "down" ? BANDS[bandIndex - 1] : null;
  const reported = await reportedByUser(userId, questions.map((question) => question.id));
  const sectionOf = (number: number) => meta.sections.find((section) => number >= section.from && number <= section.to);
  const perSkill = meta.sections.map((section) => {
    const items = results.filter((item) => item.number >= section.from && item.number <= section.to);
    return { label: section.label, correct: items.filter((item) => item.correct).length, total: items.length };
  });
  const shownPassages = new Set<string>();

  return (
    <div className="grid gap-6">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted">
          Đề trình độ {band.label} · {spec.questionCount} câu
        </p>
        <ExitButton href="/levels" />
      </div>

      <section className="grid justify-items-center gap-2 rounded-xl border-2 border-accent bg-card p-6 text-center">
        <p className="text-sm text-muted">Bạn đang ở khoảng</p>
        <h1 className="font-serif text-5xl font-medium">{estimate.level}</h1>
        <p className="text-muted">
          Đúng {correctCount}/{results.length} câu ({percent}%)
        </p>
        <p className="max-w-xl leading-7">{estimate.advice}</p>
        <p className="max-w-xl text-xs leading-5 text-muted">
          Ước lượng này chỉ từ một đề luyện ngắn, nên chỉ mang tính tham khảo và không phải chứng chỉ trình độ.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          <form action={startLevelTest}>
            <input type="hidden" name="band" value={band.id} />
            <Button type="submit" variant="outline">Làm đề {band.label} khác</Button>
            <FormPending label="Đang tạo đề…" />
          </form>
          {nextBand ? (
            <form action={startLevelTest}>
              <input type="hidden" name="band" value={nextBand.id} />
              <Button type="submit">{estimate.direction === "up" ? "Thử" : "Quay lại"} dải {nextBand.label}</Button>
              <FormPending label="Đang tạo đề…" />
            </form>
          ) : null}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-2 rounded-xl border border-line bg-card p-4">
          <h2 className="font-medium">Theo mức</h2>
          {band.levels.map((level) => {
            const item = perLevel[level];
            return (
              <p key={level} className="flex justify-between text-sm">
                <span>{level}</span>
                <span>{item ? `${item.correct}/${item.total} đúng` : "không có câu"}</span>
              </p>
            );
          })}
        </div>
        <div className="grid gap-2 rounded-xl border border-line bg-card p-4">
          <h2 className="font-medium">Theo kỹ năng</h2>
          {perSkill.map((item) => (
            <p key={item.label} className="flex justify-between text-sm">
              <span>{item.label}</span>
              <span>
                {item.correct}/{item.total} đúng
              </span>
            </p>
          ))}
        </div>
      </section>

      <section className="grid gap-3">
        <h2 className="font-serif text-2xl">Xem lại đáp án</h2>
        {results.map(({ question, correct, number }) => {
          const section = sectionOf(number);
          const showPassage = question.stimulusId && question.stimulusBody && !shownPassages.has(question.stimulusId);
          if (showPassage && question.stimulusId) shownPassages.add(question.stimulusId);
          return (
            <div key={question.id} className="grid gap-2">
              {showPassage ? (
                <details className="rounded-xl border border-line bg-card px-4 py-3" open>
                  <summary className="cursor-pointer font-medium">
                    {section?.kind === "listening" ? "Văn bản bài nghe" : "Đoạn văn"}: {question.stimulusTitle}
                  </summary>
                  <p className="mt-2 whitespace-pre-line leading-7">{question.stimulusBody}</p>
                </details>
              ) : null}
              <article className={`grid gap-2 rounded-xl border bg-card px-4 py-3 ${correct ? "border-accent/30" : "border-danger/30"}`}>
                <div className="flex items-start gap-3">
                  <AnswerMark correct={correct} />
                  <p>
                    <span className="font-medium">{number}. </span>
                    {question.stem}
                    {isCefrLevel(question.cefr) ? <span className="ml-2 text-xs text-muted">[{question.cefr}]</span> : null}
                  </p>
                </div>
                <p className="text-sm text-muted">Bạn chọn: {answerText(question.options, answers[question.id] ?? "")}</p>
                {!correct ? <p className="text-sm">Đáp án đúng: {answerText(question.options, question.correctAnswer)}</p> : null}
                <Collapse title="Giải thích" avatar={false}>
                  <p className="text-sm text-muted">{question.explanation}</p>
                </Collapse>
                <ReportQuestion questionId={question.id} reported={reported.has(question.id)} />
              </article>
            </div>
          );
        })}
      </section>
    </div>
  );
}
