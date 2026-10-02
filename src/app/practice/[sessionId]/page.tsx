import { PendingLink } from "@/components/pending-link";
import { notFound } from "next/navigation";
import { AnswerForm } from "@/components/answer-form";
import { CompletionActions } from "@/components/completion-actions";
import { FinishedNotice } from "@/components/finished-notice";
import { AnswerMark } from "@/components/answer-mark";
import { ExitButton } from "@/components/exit-button";
import { RichText } from "@/components/rich-text";
import { optionTerms } from "@/lib/rich-text";
import { topicLabel } from "@/lib/topic-names";
import { Button } from "@/components/ui/button";
import { difficultyLabel } from "@/lib/labels";
import { getStudentId } from "@/lib/student";
import { submitAnswer } from "@/modules/practice/actions";
import { saveDiagnosticSummary } from "@/modules/exam/actions";
import { getSessionBundle } from "@/modules/practice/session";
import type { TeacherExplanationBody } from "@/db/schema";

const explanationLabels: { key: keyof TeacherExplanationBody; label: string }[] = [
  { key: "correctAnswer", label: "Đáp án đúng" },
  { key: "whyCorrect", label: "Vì sao đúng" },
  { key: "whyWrong", label: "Vì sao phương án đã chọn sai" },
  { key: "rule", label: "Quy tắc" },
  { key: "structure", label: "Cấu trúc câu" },
  { key: "signalWords", label: "Dấu hiệu nhận biết" },
  { key: "commonMistake", label: "Lỗi hay gặp" },
  { key: "comparison", label: "So với điểm ngữ pháp gần" },
  { key: "shortExample", label: "Một ví dụ ngắn" },
  { key: "practicePrompt", label: "Một câu luyện ngắn" },
];

export default async function PracticeSessionPage({
  params,
  searchParams,
}: {
  params: Promise<{ sessionId: string }>;
  searchParams: Promise<{ review?: string; done?: string }>;
}) {
  const { sessionId } = await params;
  const query = await searchParams;
  const bundle = await getSessionBundle(sessionId, await getStudentId());
  if (!bundle) notFound();

  const { questions, attempts, explanations } = bundle;
  const answeredIds = new Set(attempts.map((attempt) => attempt.questionId));
  const correctCount = attempts.filter((attempt) => attempt.isCorrect).length;
  const reviewAttempt = attempts.find((attempt) => attempt.questionId === query.review);
  const reviewQuestion = questions.find((question) => question.id === query.review);
  const current = questions.find((question) => !answeredIds.has(question.id));
  const finished = !current;
  const exitHref = bundle.session.mode === "diagnostic"
    ? "/diagnostic"
    : bundle.session.mode === "review_ai"
      ? "/review"
      : "/practice";
  const continueHref = bundle.session.mode === "review_ai" ? "/review" : "/practice";
  const continueLabel = bundle.session.mode === "diagnostic"
    ? "Bắt đầu luyện"
    : bundle.session.mode === "review_ai"
      ? "Ôn lỗi tiếp"
      : "Luyện tiếp";
  const diagnosticSummary = bundle.session.mode === "diagnostic" && finished
    ? await saveDiagnosticSummary(sessionId, await getStudentId())
    : null;

  if (query.done === "1" || (finished && !reviewAttempt)) {
    return (
      <div className="mx-auto grid w-full max-w-2xl justify-items-center gap-4 text-center">
        <div className="flex w-full justify-end">
          <ExitButton href={exitHref} />
        </div>
        <FinishedNotice />
        <p className="text-sm text-muted">{diagnosticSummary ? "Kết quả chẩn đoán" : "Kết quả phiên luyện"}</p>
        <h1 className="font-serif text-4xl font-medium">
          Đúng {correctCount}/{questions.length} câu
        </h1>
        {diagnosticSummary ? (
          <p className="leading-7 text-muted">{diagnosticSummary}</p>
        ) : (
          <p className="text-muted">Các câu sai được giữ lại trong mục ôn lỗi.</p>
        )}
        <div className="grid w-full gap-3 sm:flex sm:w-auto sm:flex-wrap sm:justify-center">
          <Button asChild className="w-full sm:w-auto">
            <PendingLink href="/review" label="Đang mở câu sai…">Xem câu sai</PendingLink>
          </Button>
        </div>
        <CompletionActions continueHref={continueHref} continueLabel={continueLabel} />
      </div>
    );
  }

  if (reviewAttempt && reviewQuestion) {
    const selected = reviewQuestion.options.find((option) => option.id === reviewAttempt.selectedAnswer);
    const correct = reviewQuestion.options.find((option) => option.id === reviewQuestion.correctAnswer);
    const wrongNote = reviewQuestion.wrongAnswerExplanations.find(
      (item) => item.optionId === reviewAttempt.selectedAnswer,
    );
    const teacher = explanations.find((item) => item.attemptId === reviewAttempt.id);
    const terms = optionTerms({
      options: reviewQuestion.options,
      correctAnswer: reviewQuestion.correctAnswer,
      selectedAnswer: reviewAttempt.selectedAnswer,
    });
    const otherNotes = reviewQuestion.wrongAnswerExplanations.flatMap((note) => {
      if (!reviewAttempt.isCorrect && note.optionId === reviewAttempt.selectedAnswer) return [];
      const option = reviewQuestion.options.find((item) => item.id === note.optionId);
      return option ? [{ option, note: note.explanation }] : [];
    });
    const nextHref = finished ? `/practice/${sessionId}?done=1` : `/practice/${sessionId}`;

    return (
      <div className="grid max-w-2xl gap-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm text-muted">
            {topicLabel(reviewQuestion.topicName)} · {difficultyLabel[reviewQuestion.difficulty as keyof typeof difficultyLabel] ?? reviewQuestion.difficulty}
          </p>
          <ExitButton href={exitHref} />
        </div>
        <h1 className="font-serif text-3xl leading-snug">{reviewQuestion.stem}</h1>
        <p className={`flex items-center gap-2 font-medium ${reviewAttempt.isCorrect ? "text-accent" : "text-danger"}`}>
          <AnswerMark correct={reviewAttempt.isCorrect} />
          {reviewAttempt.isCorrect ? "Đúng." : "Chưa đúng."}
        </p>
        <ul className="grid gap-2">
          {reviewQuestion.options.map((option) => {
            const isCorrect = option.id === reviewQuestion.correctAnswer;
            const isSelected = option.id === reviewAttempt.selectedAnswer;
            const marked = isCorrect || (isSelected && !isCorrect);
            return (
              <li
                key={option.id}
                className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 ${
                  isCorrect ? "border-accent bg-accent/5" : isSelected ? "border-danger bg-danger/5" : "border-line"
                }`}
              >
                <span>{option.text}</span>
                {marked ? <AnswerMark correct={isCorrect} /> : null}
              </li>
            );
          })}
        </ul>
        <div className="grid gap-4 leading-7">
          {reviewQuestion.provenance === "ai_generated" ? (
            <p className="text-sm text-muted">Câu này được tạo cho bài luyện, không phải đề chính thức.</p>
          ) : null}
          {selected && correct && !reviewAttempt.isCorrect ? (
            <p>
              Bạn chọn <RichText text={`“${selected.text}”`} terms={terms} />. Đáp án là{" "}
              <RichText text={`“${correct.text}”`} terms={terms} />.
            </p>
          ) : null}
          <section className="grid gap-1 rounded-lg border border-accent/30 bg-accent/5 px-4 py-3">
            <h2 className="text-xs font-medium tracking-[0.12em] text-accent uppercase">Vì sao đúng</h2>
            <p><RichText text={reviewQuestion.explanation} terms={terms} /></p>
          </section>
          {!reviewAttempt.isCorrect && wrongNote ? (
            <section className="grid gap-1 rounded-lg border border-danger/30 bg-danger/5 px-4 py-3">
              <h2 className="text-xs font-medium tracking-[0.12em] text-danger uppercase">Vì sao bạn chọn sai</h2>
              <p><RichText text={wrongNote.explanation} terms={terms} /></p>
            </section>
          ) : null}
          {otherNotes.length > 0 ? (
            <section className="grid gap-2">
              <h2 className="text-xs font-medium tracking-[0.12em] text-muted uppercase">Các phương án còn lại</h2>
              <ul className="grid gap-2">
                {otherNotes.map((item) => (
                  <li key={item.option.id} className="grid gap-1 rounded-lg border border-line px-4 py-3">
                    <p className="text-sm text-muted">
                      Vì sao không chọn <RichText text={`“${item.option.text}”`} terms={terms} />
                    </p>
                    <p><RichText text={item.note} terms={terms} /></p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {teacher ? (
            <section className="grid gap-3 border-t border-line pt-4">
              <h2 className="text-xs font-medium tracking-[0.12em] text-muted uppercase">Giáo viên giải thích thêm</h2>
              {explanationLabels.map((item) => (
                <p key={item.key}>
                  <span className="font-medium">{item.label}. </span>
                  <RichText text={teacher.body[item.key]} terms={terms} />
                </p>
              ))}
            </section>
          ) : null}
        </div>
        <div className="sticky bottom-3 z-10 rounded-xl border border-line bg-background/95 p-2 shadow-lg backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
          <Button asChild className="w-full sm:w-auto">
            <PendingLink href={nextHref} label={finished ? "Đang mở kết quả…" : "Đang mở câu tiếp…"}>
              {finished ? "Xem kết quả" : "Câu tiếp theo"}
            </PendingLink>
          </Button>
        </div>
      </div>
    );
  }

  if (!current) notFound();
  const index = questions.findIndex((question) => question.id === current.id) + 1;

  return (
    <div className="grid max-w-2xl gap-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted">
          Câu {index}/{questions.length} · {topicLabel(current.topicName)} · {difficultyLabel[current.difficulty as keyof typeof difficultyLabel] ?? current.difficulty}
        </p>
        <ExitButton href={exitHref} warning="Câu chưa nộp sẽ không được lưu." />
      </div>
      <h1 className="font-serif text-3xl leading-snug">{current.stem}</h1>
      <AnswerForm
        action={submitAnswer}
        sessionId={sessionId}
        questionId={current.id}
        options={current.options}
      />
    </div>
  );
}
