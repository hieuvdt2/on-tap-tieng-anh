import { notFound } from "next/navigation";
import { AnswerMark } from "@/components/answer-mark";
import { CompletionActions } from "@/components/completion-actions";
import { ExamGenerationPump, ExamNextButton, ExamPartRefresh } from "@/components/exam-generation-pump";
import { ExamPaper } from "@/components/exam-paper";
import { FinishedNotice } from "@/components/finished-notice";
import { GeneratingNotice } from "@/components/generating-notice";
import { GenerationSubmitButton } from "@/components/generation-submit-button";
import { ExitButton } from "@/components/exit-button";
import { OrderingField } from "@/components/ordering-field";
import { PinnedPassage } from "@/components/pinned-passage";
import { getStudentId } from "@/lib/student";
import { retryExamGeneration } from "@/modules/ai/generator-actions";
import { getExamGenerationBySession } from "@/modules/ai/generator";
import { EXAM_GENERATION_STEPS, examPageStart } from "@/modules/ai/generator-spec";
import { saveExamPart, submitMockExam } from "@/modules/exam/actions";
import { blocksForQuestions, groupExamBlocks } from "@/modules/exam/group";
import { getExamSession } from "@/modules/exam/queries";
import { formatExamScore } from "@/modules/exam/score";
import { scoreAnswer } from "@/modules/questions/score";

function answerText(options: { id: string; text: string }[], answer: string | undefined) {
  if (!answer) return "Chưa trả lời";
  const labels = new Map(options.map((option) => [option.id, option.text]));
  return answer
    .split(",")
    .map((id) => labels.get(id) ?? id)
    .join(" → ");
}

export default async function MockExamSessionPage({
  params,
  searchParams,
}: {
  params: Promise<{ sessionId: string }>;
  searchParams: Promise<{ part?: string }>;
}) {
  const { sessionId } = await params;
  const query = await searchParams;
  const userId = await getStudentId();
  const bundle = await getExamSession(sessionId, userId);
  if (!bundle) notFound();

  const { session, spec, questions } = bundle;
  const submitted = Boolean(session.submittedAt);
  const answers = session.answers ?? {};
  const practice = spec.id !== "exam-2025-v1";
  const wrong = submitted
    ? questions.filter((question) => !scoreAnswer(question.correctAnswer, answers[question.id] ?? ""))
    : [];

  const generation = spec.source === "Đề AI trong app" && !submitted
    ? await getExamGenerationBySession(session.id, userId)
    : null;
  const pages = generation?.config.pages ?? [];
  const requestedPart = Number(query.part ?? "1");
  const part = Number.isFinite(requestedPart) && requestedPart >= 1 ? Math.floor(requestedPart) : 1;
  const currentPage = pages[part - 1];
  const staged = Boolean(generation);
  const lastPart = part >= EXAM_GENERATION_STEPS.length;
  const pageQuestionIds = new Set(currentPage?.questionIds ?? []);

  const blocks = groupExamBlocks(
    questions.map((question) => ({
      ...question,
      stimulusId: question.stimulusId,
      stimulusTitle: question.stimulusTitle,
      stimulusBody: question.stimulusBody,
    })),
  );
  const questionNumbers = new Map(questions.map((question, index) => [question.id, index + 1]));
  const paperLabel = spec.source === "Đề AI trong app"
    ? "Đề AI trong app"
    : spec.id === "exam-form-b"
      ? "Mã đề B"
      : spec.id === "exam-form-a"
        ? "Mã đề A"
        : practice
          ? "Đề luyện trong app"
          : `Khung ${spec.yearLabel}`;

  return (
    <div className="grid gap-6">
      {generation ? (
        <ExamGenerationPump
          sessionId={session.id}
          enabled={generation.status !== "completed" && !generation.error}
        />
      ) : null}
      <div className="grid gap-2">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm text-muted">
            {paperLabel} · {spec.questionCount} câu · {spec.durationMinutes} phút
          </p>
          <ExitButton
            href="/mock-exam"
            warning={submitted ? undefined : "Các đáp án chưa nộp sẽ không được lưu và đồng hồ vẫn tiếp tục chạy."}
          />
        </div>
        <div className={submitted ? "grid justify-items-center gap-2 text-center" : "grid gap-2"}>
          {submitted ? <FinishedNotice /> : null}
          <h1 className="font-serif text-4xl font-medium">
            {submitted ? `${formatExamScore(session.score ?? 0)} / 10` : "Đang làm bài"}
          </h1>
          {submitted ? (
            <>
              <p className="text-muted">
                Đúng {questions.length - wrong.length}/{questions.length} câu. Đồng hồ đã dừng lúc nộp.
              </p>
              <CompletionActions continueHref="/mock-exam" continueLabel="Làm đề khác" />
            </>
          ) : null}
          {practice ? (
            <p className="max-w-2xl text-sm leading-6 text-muted">
              Điểm này chỉ tính trong đề luyện. Không phải điểm thi và không phải đề minh họa của Bộ.
            </p>
          ) : null}
        </div>
      </div>

      {submitted ? (
        <ExamPaper endsAt={session.endsAt.toISOString()} submitted action={submitMockExam}>
          <div className="grid gap-3">
            <h2 className="font-serif text-2xl">Xem lại đáp án</h2>
            {questions.map((question) => {
              const selected = answers[question.id] ?? "";
              const correct = scoreAnswer(question.correctAnswer, selected);
              return (
                <article
                  key={question.id}
                  className={`grid gap-2 rounded-xl border bg-card px-4 py-3 ${
                    correct ? "border-accent/30" : "border-danger/30"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <AnswerMark correct={correct} />
                    <p>
                      <span className="font-medium">{questionNumbers.get(question.id)}. </span>
                      {question.stem}
                    </p>
                  </div>
                  <p className="text-sm text-muted">
                    Bạn chọn: {answerText(question.options, selected)}
                  </p>
                  {!correct ? (
                    <p className="text-sm">
                      Đáp án đúng: {answerText(question.options, question.correctAnswer)}
                    </p>
                  ) : null}
                  <p className="text-sm leading-6 text-muted">{question.explanation}</p>
                </article>
              );
            })}
          </div>
        </ExamPaper>
      ) : staged && !currentPage ? (
        <section className="grid gap-4">
          <ExamPartRefresh active={!generation?.error} />
          {generation?.error ? (
            <div className="grid gap-3">
              <p className="text-sm text-danger">{generation.error}</p>
              <form action={retryExamGeneration}>
                <input type="hidden" name="sessionId" value={session.id} />
                <input type="hidden" name="part" value={part} />
                <GenerationSubmitButton>Tạo lại phần này</GenerationSubmitButton>
              </form>
            </div>
          ) : (
            <GeneratingNotice />
          )}
        </section>
      ) : (
        <>
        {generation?.error && currentPage ? (
          <form action={retryExamGeneration}>
            <input type="hidden" name="sessionId" value={session.id} />
            <input type="hidden" name="part" value={part} />
            <GenerationSubmitButton variant="outline">Tạo lại phần sau</GenerationSubmitButton>
          </form>
        ) : null}
        <ExamPaper
          endsAt={session.endsAt.toISOString()}
          submitted={false}
          action={staged ? (lastPart ? submitMockExam : saveExamPart) : submitMockExam}
          hideSubmit={staged}
        >
          <input type="hidden" name="sessionId" value={session.id} />
          {staged && !lastPart ? <input type="hidden" name="part" value={part + 1} /> : null}
          {staged && currentPage ? (
            <div className="grid gap-2">
              <div className="grid gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-accent">Phần {part}/{EXAM_GENERATION_STEPS.length}</span>
                  <span className="text-muted">Câu {examPageStart(part - 1)}–{examPageStart(part - 1) + currentPage.questionIds.length - 1}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-accent transition-[width]"
                    style={{ width: `${(part / EXAM_GENERATION_STEPS.length) * 100}%` }}
                  />
                </div>
              </div>
              <p className="max-w-3xl leading-7">{currentPage.instruction}</p>
              {generation?.error ? (
                <p className="text-sm text-danger">{generation.error} Phần này vẫn làm được. Bấm nút tạo lại phía trên để chuẩn bị phần sau.</p>
              ) : generation?.status !== "completed" ? (
                <p className="text-sm text-muted">Phần sau vẫn đang được tạo trong lúc bạn làm phần này.</p>
              ) : null}
            </div>
          ) : null}
          {(staged ? blocksForQuestions(blocks, pageQuestionIds) : blocks).map((block) => {
            if (block.kind === "ordering") {
              const number = questionNumbers.get(block.question.id) ?? examPageStart(part - 1);
              return (
                <section key={block.question.id} className="grid gap-2">
                  <h2 className="font-medium">{number}. {block.question.stem}</h2>
                  <OrderingField name={`answer-${block.question.id}`} sentences={block.question.options} />
                </section>
              );
            }
            return (
              <section key={block.key} className="grid gap-4">
                <PinnedPassage title={block.title} className="top-[126px] sm:top-4">
                  {block.body}
                </PinnedPassage>
                {block.items.map((question) => {
                  return (
                    <div key={question.id} className="rounded-xl border border-line bg-card p-3 sm:p-4">
                    <fieldset className="m-0 min-w-0 border-0 p-0">
                      <legend className="mb-2 w-full p-0 leading-6 font-medium">
                        {questionNumbers.get(question.id)}. {question.type === "gap_short" || question.type === "gap_long" ? "" : question.stem}
                      </legend>
                      <div className="grid gap-1">
                      {question.options.map((option) => (
                        <label key={option.id} className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg px-2 py-2 leading-6 has-[:checked]:bg-accent/10">
                          <input
                            className="mt-1 size-4 shrink-0 accent-accent"
                            type="radio"
                            name={`answer-${question.id}`}
                            value={option.id}
                            defaultChecked={answers[question.id] === option.id}
                          />
                          <span className="min-w-0">{option.id.toUpperCase()}. {option.text}</span>
                        </label>
                      ))}
                      </div>
                    </fieldset>
                    </div>
                  );
                })}
              </section>
            );
          })}
          {staged ? (
            <div className="sticky bottom-3 z-10 rounded-xl border border-line bg-background/95 p-2 shadow-lg backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
              <ExamNextButton pendingText={lastPart ? "Đang kiểm tra…" : "Đang mở phần tiếp…"} checking={lastPart}>
                {lastPart ? "Nộp bài" : "Next"}
              </ExamNextButton>
            </div>
          ) : null}
        </ExamPaper>
        </>
      )}
    </div>
  );
}
