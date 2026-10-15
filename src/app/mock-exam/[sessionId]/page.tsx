import { notFound } from "next/navigation";
import { AnswerMark } from "@/components/answer-mark";
import { ChangeModelLink } from "@/components/change-model-link";
import { CompletionActions } from "@/components/completion-actions";
import { ExamGenerationPump } from "@/components/exam-generation-pump";
import { ExamPaper } from "@/components/exam-paper";
import { ExamWorkspace, type PaletteGroup, type PaletteItem, type PlayerQuestion } from "@/components/exam-workspace";
import { FinishedNotice } from "@/components/finished-notice";
import { FormPending } from "@/components/form-pending";
import { GeneratingNotice } from "@/components/generating-notice";
import { GenerationSubmitButton } from "@/components/generation-submit-button";
import { ExitButton } from "@/components/exit-button";
import { OrderingComparison } from "@/components/ordering-comparison";
import { ReportQuestion } from "@/components/report-question";
import { Button } from "@/components/ui/button";
import { getStudentId } from "@/lib/student";
import { SourceSwitchOffer } from "@/components/source-switch-offer";
import { retryExamGeneration } from "@/modules/ai/generator-actions";
import { chosenProvider, fallbackSources, modelFor, SOURCE_LABELS } from "@/modules/ai/provider";
import { readStoredAI } from "@/modules/ai/settings";
import { getExamGenerationBySession } from "@/modules/ai/generator";
import { EXAM_GENERATION_STEPS, examPageStart } from "@/modules/ai/generator-spec";
import { autosaveExamAnswers, retakeMockExam, submitMockExam } from "@/modules/exam/actions";
import { groupExamBlocks } from "@/modules/exam/group";
import { examTitle, isOfficialExam } from "@/modules/exam/labels";
import { getExamSession, sectionOf } from "@/modules/exam/queries";
import { reportedByUser } from "@/modules/questions/reports";
import { formatExamScore } from "@/modules/exam/score";
import { scoreAnswer } from "@/modules/questions/score";

const sectionLabel: Record<string, string> = {
  gap_short: "Điền từ",
  ordering: "Sắp xếp",
  gap_long: "Điền câu",
  reading: "Đọc hiểu",
  other: "Câu hỏi",
};

// Đề cố định (Mã đề A/B) không có "phần": nhóm các câu liền nhau cùng đoạn văn (hoặc cùng là sắp xếp)
// để thanh điều hướng có cấu trúc như đề thật, thay vì một dải 40 ô.
function groupBySection(list: { id: string; type: string; stimulusId: string | null; stimulusKind: string | null }[]) {
  const groups: PaletteGroup[] = [];
  let lastKey: string | null = null;
  list.forEach((question, index) => {
    const section = sectionOf(question.type, question.stimulusKind);
    const key = section === "ordering" ? "ordering" : question.stimulusId ?? section;
    const last = groups[groups.length - 1];
    if (last && key === lastKey) last.to = index + 1;
    else groups.push({ label: sectionLabel[section], from: index + 1, to: index + 1 });
    lastKey = key;
  });
  return groups;
}

function answerText(options: { id: string; text: string }[], answer: string | undefined) {
  if (!answer) return "Chưa trả lời";
  const labels = new Map(options.map((option) => [option.id, option.text]));
  return answer
    .split(",")
    .map((id) => labels.get(id) ?? id)
    .join(" → ");
}

// Vòng tạo các phần còn lại của đề AI (pumpExamGeneration, tạo lại, đổi nguồn) chạy từ trang này.
export const maxDuration = 300;

export default async function MockExamSessionPage({
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
  const submitted = Boolean(session.submittedAt);
  const answers = session.answers ?? {};
  const practice = spec.id !== "exam-2025-v1";
  const wrong = submitted
    ? questions.filter((question) => !scoreAnswer(question.correctAnswer, answers[question.id] ?? ""))
    : [];
  const reported = submitted ? await reportedByUser(userId, questions.map((question) => question.id)) : new Set<string>();

  const generation = spec.source === "Đề AI trong app" && !submitted
    ? await getExamGenerationBySession(session.id, userId)
    : null;
  const pages = generation?.config.pages ?? [];
  const staged = Boolean(generation);
  const reusedCount = generation?.config.reusedQuestionIds?.length ?? 0;
  // Khi tạo đề lỗi: nguồn đang dùng và các nguồn đã lưu khoá khác để đề nghị chuyển sang.
  const storedAI = generation?.error ? await readStoredAI(userId) : null;
  const currentChoice = storedAI ? chosenProvider(storedAI) : null;
  const currentSource = storedAI && currentChoice
    ? { choice: currentChoice, label: SOURCE_LABELS[currentChoice], model: modelFor(currentChoice, storedAI) }
    : null;
  const sourceOptions = storedAI ? fallbackSources(storedAI) : [];
  const generating = Boolean(generation && generation.status !== "completed" && !generation.error);
  // Đọc hiểu giờ sinh 2 lượt nhỏ (đoạn văn + bù câu) nên lâu hơn ordering/điền khuyết một chút.
  const pendingStepKind = generation ? EXAM_GENERATION_STEPS[generation.step]?.kind : undefined;
  const pendingEstimateSeconds = pendingStepKind === "reading" ? 70 : 30;
  const pendingProgressLabel = generation
    ? `${generation.questionIds.length}/${generation.targetCount} câu · Phần ${generation.step + 1}/${EXAM_GENERATION_STEPS.length}`
    : undefined;

  const blocks = groupExamBlocks(
    questions.map((question) => ({
      ...question,
      stimulusId: question.stimulusId,
      stimulusTitle: question.stimulusTitle,
      stimulusBody: question.stimulusBody,
    })),
  );
  const questionNumbers = new Map(questions.map((question, index) => [question.id, index + 1]));
  // Mọi câu đã có nằm trên cùng một màn (đi lại tức thì); phần AI chưa tạo xong hiện ô khoá và tự
  // xuất hiện khi tạo xong (ExamGenerationPump làm mới trang).
  const playerQuestions: PlayerQuestion[] = blocks.flatMap((block) =>
    (block.kind === "ordering" ? [{ question: block.question, passageKey: null }] : block.items.map((item) => ({ question: item, passageKey: block.key })))
      .map(({ question, passageKey }) => ({
        id: question.id,
        number: questionNumbers.get(question.id) ?? 0,
        type: question.type,
        stem: question.stem,
        options: question.options,
        passageKey,
        saved: answers[question.id],
      })),
  );
  const passages = Object.fromEntries(
    blocks.flatMap((block) => (block.kind === "stimulus" ? [[block.key, { title: block.title, body: block.body }]] : [])),
  );
  const instructions = Object.fromEntries(pages.flatMap((page) => page.questionIds.map((id) => [id, page.instruction])));
  const paletteGroups: PaletteGroup[] = staged
    ? EXAM_GENERATION_STEPS.map((step, index) => ({
        label: `Phần ${index + 1} · ${sectionLabel[step.kind]}`,
        from: examPageStart(index),
        to: examPageStart(index) + step.count - 1,
      }))
    : groupBySection(questions);
  const paletteItems: PaletteItem[] = questions.map((question, index) => {
    const saved = answers[question.id];
    // Câu sắp xếp luôn gửi thứ tự ban đầu dù chưa đụng vào, nên chỉ tính là đã làm khi khác thứ tự đó.
    const untouched = question.options.map((option) => option.id).join(",");
    return {
      id: question.id,
      number: index + 1,
      answered: question.type === "ordering" ? Boolean(saved) && saved !== untouched : Boolean(saved),
    };
  });
  // Nộp khi đề chưa đủ câu thì điểm bị chấm trên ít câu hơn; chỉ cho nộp sớm khi việc tạo đã lỗi hẳn
  // (hết giờ thì vẫn tự nộp).
  const submitBlockedReason = generating
    ? "Đang tạo phần còn lại của đề. Nộp bài được khi tạo xong; hết giờ thì bài tự nộp."
    : undefined;
  const paperLabel = examTitle(spec);
  const official = isOfficialExam(spec);

  return (
    <div className={submitted ? "grid gap-6" : "grid gap-4"}>
      {generation ? (
        <ExamGenerationPump
          sessionId={session.id}
          enabled={generation.status !== "completed" && !generation.error}
        />
      ) : null}
      {submitted ? (
        <div className="grid gap-2">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm text-muted">
              {paperLabel} · {spec.questionCount} câu · {spec.durationMinutes} phút
            </p>
            <ExitButton href="/mock-exam" />
          </div>
          <div className="grid justify-items-center gap-2 text-center">
            <FinishedNotice />
            <h1 className="font-serif text-4xl font-medium">{formatExamScore(session.score ?? 0)} / 10</h1>
            <p className="text-muted">
              Đúng {questions.length - wrong.length}/{questions.length} câu. Đồng hồ đã dừng lúc nộp.
            </p>
            <form action={retakeMockExam}>
              <input type="hidden" name="sessionId" value={session.id} />
              <Button type="submit" variant="outline">Làm lại đề này</Button>
              <FormPending label="Đang tạo lại đề…" />
            </form>
            <CompletionActions continueHref="/mock-exam" continueLabel="Làm đề khác" />
            {official ? (
              <p className="max-w-2xl text-sm leading-6 text-muted">
                Điểm quy đổi thang 10 chỉ để bạn tự đánh giá, không phải điểm thi thật. Đáp án dựa trên bản tham khảo.
              </p>
            ) : practice ? (
              <p className="max-w-2xl text-sm leading-6 text-muted">
                Điểm này chỉ tính trong đề luyện. Không phải điểm thi và không phải đề minh họa của Bộ.
              </p>
            ) : null}
          </div>
        </div>
      ) : staged && questions.length === 0 ? (
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="sr-only">Đang chờ tạo đề</h1>
            <p className="font-medium">
              {paperLabel} <span className="font-normal text-muted">· {spec.questionCount} câu · {spec.durationMinutes} phút</span>
            </p>
          </div>
          <ExitButton href="/mock-exam" />
        </div>
      ) : null}

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
                  {question.type === "ordering" ? (
                    <OrderingComparison sentences={question.options} selected={selected} correct={question.correctAnswer} />
                  ) : (
                    <>
                      <p className="text-sm text-muted">
                        Bạn chọn: {answerText(question.options, selected)}
                      </p>
                      {!correct ? (
                        <p className="text-sm">
                          Đáp án đúng: {answerText(question.options, question.correctAnswer)}
                        </p>
                      ) : null}
                    </>
                  )}
                  <p className="text-sm leading-6 text-muted">{question.explanation}</p>
                  <ReportQuestion questionId={question.id} reported={reported.has(question.id)} />
                </article>
              );
            })}
          </div>
        </ExamPaper>
      ) : staged && questions.length === 0 ? (
        <section className="grid gap-4">
          {generation?.error ? (
            <SourceSwitchOffer
              jobId={generation.id}
              error={generation.error}
              current={currentSource}
              options={sourceOptions}
            >
              <form action={retryExamGeneration}>
                <input type="hidden" name="sessionId" value={session.id} />
                <GenerationSubmitButton variant="outline">Thử lại với nguồn hiện tại</GenerationSubmitButton>
              </form>
              <ChangeModelLink error={generation.error} returnTo={`/mock-exam/${session.id}`} />
            </SourceSwitchOffer>
          ) : (
            <GeneratingNotice estimatedSeconds={pendingEstimateSeconds} progressLabel={pendingProgressLabel} />
          )}
        </section>
      ) : (
        <ExamWorkspace
          sessionId={session.id}
          paperLabel={paperLabel}
          endsAt={session.endsAt.toISOString()}
          total={spec.questionCount}
          questions={playerQuestions}
          passages={passages}
          palette={paletteItems}
          groups={paletteGroups}
          instructions={instructions}
          banner={
            generation?.error ? (
              <SourceSwitchOffer
                jobId={generation.id}
                error={`${generation.error} Các câu đã có vẫn làm được; nộp bài lúc này sẽ chỉ chấm trên ${questions.length} câu.`}
                current={currentSource}
                options={sourceOptions}
              >
                <form action={retryExamGeneration}>
                  <input type="hidden" name="sessionId" value={session.id} />
                  <GenerationSubmitButton variant="outline">Thử lại với nguồn hiện tại</GenerationSubmitButton>
                </form>
                <ChangeModelLink error={generation.error} returnTo={`/mock-exam/${session.id}`} />
              </SourceSwitchOffer>
            ) : reusedCount > 0 ? (
              <p className="text-xs text-muted">
                Đề có {reusedCount} câu bạn đã gặp: kho hết câu mới và AI chưa tạo được, nên app dùng lại câu cũ để đủ đề.
              </p>
            ) : undefined
          }
          initialQuestionId={query.q}
          submitBlockedReason={submitBlockedReason}
          submitAction={submitMockExam}
          autosaveAction={autosaveExamAnswers}
        />
      )}
    </div>
  );
}
