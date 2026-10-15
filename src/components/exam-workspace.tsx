"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useFormStatus } from "react-dom";
import { CheckingNotice } from "@/components/checking-notice";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ExamTimer } from "@/components/exam-timer";
import { ExitButton } from "@/components/exit-button";
import { EXAM_ANSWER_EVENT, OrderingField, type ExamAnswerDetail } from "@/components/ordering-field";
import { Button } from "@/components/ui/button";

export type PaletteItem = { id: string; number: number; answered: boolean };
export type PlayerQuestion = {
  id: string;
  number: number;
  type: string;
  stem: string;
  options: { id: string; text: string }[];
  passageKey: string | null;
  saved?: string;
};
export type PaletteGroup = { label: string; from: number; to: number };
type Action = (formData: FormData) => void | Promise<void>;
type Autosave = (input: { sessionId: string; answers: Record<string, string> }) => Promise<{ ok: boolean }>;
type SaveState = "idle" | "saving" | "saved" | "error";

// Trạng thái ô câu theo kiểu bảng câu hỏi của các phần mềm thi (tô cả ô, không dùng icon):
// cần xem lại luôn là vàng, đã làm là xanh; đã làm + cần xem lại thì vàng kèm góc xanh.
function cellClass(done: boolean, marked: boolean) {
  if (marked) return "border-marked bg-marked text-marked-foreground";
  if (done) return "border-accent bg-accent text-accent-foreground";
  return "border-muted/35 bg-card text-foreground/80 hover:border-accent hover:text-accent";
}

function Check({ className = "size-3" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m2.5 6.2 2.3 2.3 4.7-4.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Góc tam giác xanh ở góc trên phải: chỉ chiếm góc ô nên không đè lên số câu ở giữa.
function AnsweredCorner({ className = "size-3" }: { className?: string }) {
  return <span aria-hidden="true" className={`absolute top-0 right-0 bg-accent [clip-path:polygon(0_0,100%_0,100%_100%)] ${className}`} />;
}

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d={direction === "left" ? "M10 3 5 8l5 5" : "m6 3 5 5-5 5"} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Đánh dấu chỉ là ghi chú riêng của người làm trên máy này (không ảnh hưởng điểm), nên lưu localStorage.
const NO_FLAGS: ReadonlySet<string> = new Set();
const flagListeners = new Set<() => void>();
const flagCache = new Map<string, ReadonlySet<string>>();

function subscribeFlags(listener: () => void) {
  flagListeners.add(listener);
  return () => flagListeners.delete(listener);
}

function readFlags(key: string) {
  const cached = flagCache.get(key);
  if (cached) return cached;
  let value = NO_FLAGS;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw) value = new Set(JSON.parse(raw) as string[]);
  } catch {
    // Trình duyệt chặn lưu trữ: vẫn đánh dấu được trong phiên, chỉ không nhớ khi tải lại.
  }
  flagCache.set(key, value);
  return value;
}

function useFlags(sessionId: string) {
  const key = `exam-flags:${sessionId}`;
  const flagged = useSyncExternalStore(subscribeFlags, () => readFlags(key), () => NO_FLAGS);
  const toggle = useCallback(
    (id: string) => {
      const next = new Set(readFlags(key));
      if (next.has(id)) next.delete(id);
      else next.add(id);
      flagCache.set(key, next);
      try {
        window.localStorage.setItem(key, JSON.stringify([...next]));
      } catch {
        // Như trên.
      }
      flagListeners.forEach((listener) => listener());
    },
    [key],
  );
  return { flagged, toggle };
}

function subscribeFullscreen(listener: () => void) {
  document.addEventListener("fullscreenchange", listener);
  return () => document.removeEventListener("fullscreenchange", listener);
}

function useFullscreen() {
  const supported = useSyncExternalStore(subscribeFullscreen, () => document.fullscreenEnabled, () => false);
  const active = useSyncExternalStore(subscribeFullscreen, () => Boolean(document.fullscreenElement), () => false);
  const toggle = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen();
  };
  return { supported, active, toggle };
}

function SubmittingOverlay() {
  const { pending } = useFormStatus();
  return pending ? <CheckingNotice /> : null;
}

const BLANK = /(\(\d+\)\s*_{3,})/;

// Tô sáng chỗ trống của câu đang làm ngay trong đoạn văn để không phải dò tìm.
function PassageBody({ body, activeNumber }: { body: string; activeNumber: number | null }) {
  const activeRef = useRef<HTMLElement>(null);
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [activeNumber]);
  return (
    <p className="leading-8 whitespace-pre-wrap">
      {body.split(BLANK).map((piece, index) => {
        const match = piece.match(/^\((\d+)\)/);
        if (!match) return <Fragment key={index}>{piece}</Fragment>;
        const active = Number(match[1]) === activeNumber;
        return (
          <mark
            key={index}
            ref={active ? activeRef : undefined}
            className={active ? "rounded bg-accent/15 px-1 font-semibold text-accent ring-2 ring-accent" : "bg-transparent font-medium text-accent"}
          >
            {piece}
          </mark>
        );
      })}
    </p>
  );
}

function QuestionBadge({ value }: { value: number }) {
  return (
    <span className="grid h-8 min-w-8 shrink-0 place-items-center rounded-lg bg-accent px-2 text-sm font-semibold text-accent-foreground tabular-nums">
      {value}
    </span>
  );
}

function QuestionView({ question, hidden }: { question: PlayerQuestion; hidden: boolean }) {
  const gap = question.type === "gap_short" || question.type === "gap_long";
  const shortOptions = question.options.every((option) => option.text.length <= 28);
  if (question.type === "ordering") {
    return (
      <section hidden={hidden} className="grid gap-4">
        <h2 className="flex items-start gap-3 text-lg leading-8 font-medium">
          <QuestionBadge value={question.number} />
          <span className="min-w-0">{question.stem}</span>
        </h2>
        <OrderingField name={`answer-${question.id}`} sentences={question.options} saved={question.saved} />
      </section>
    );
  }
  return (
    <fieldset hidden={hidden} className="m-0 grid min-w-0 gap-4 border-0 p-0">
      <legend className="mb-4 flex w-full items-start gap-3 p-0 text-lg leading-8 font-medium">
        <QuestionBadge value={question.number} />
        <span className="min-w-0">{gap ? `Chọn đáp án cho chỗ trống (${question.number})` : question.stem}</span>
      </legend>
      <div className={`grid gap-2.5 ${shortOptions ? "sm:grid-cols-2" : ""}`}>
        {question.options.map((option) => (
          <label
            key={option.id}
            className="group flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border border-line bg-card px-4 py-3 leading-6 transition-colors hover:border-accent/50 has-[:checked]:border-accent has-[:checked]:bg-accent/10 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent"
          >
            <input
              className="sr-only"
              type="radio"
              name={`answer-${question.id}`}
              value={option.id}
              defaultChecked={question.saved === option.id}
            />
            <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-sm font-semibold text-muted group-has-[:checked]:border-accent group-has-[:checked]:bg-accent group-has-[:checked]:text-accent-foreground">
              {option.id.toUpperCase()}
            </span>
            <span className="min-w-0">{option.text}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

const saveLabel: Record<SaveState, string> = {
  idle: "",
  saving: "Đang lưu…",
  saved: "Đã lưu",
  error: "Chưa lưu được, sẽ thử lại",
};

export function ExamWorkspace({
  sessionId,
  paperLabel,
  endsAt,
  total,
  questions,
  passages,
  palette,
  groups,
  instructions,
  banner,
  initialQuestionId,
  submitBlockedReason,
  submitAction,
  autosaveAction,
}: {
  sessionId: string;
  paperLabel: string;
  endsAt: string;
  total: number;
  /** Mọi câu đã có của đề (đề AI: các phần đã tạo xong; phần đang tạo hiện ô viền đứt). */
  questions: PlayerQuestion[];
  passages: Record<string, { title: string; body: string }>;
  palette: PaletteItem[];
  groups: PaletteGroup[];
  /** Hướng dẫn theo câu (đề AI: hướng dẫn của phần chứa câu đó). */
  instructions?: Record<string, string>;
  banner?: React.ReactNode;
  initialQuestionId?: string;
  /** Có giá trị khi chưa nộp được (ví dụ AI còn đang tạo phần còn lại). */
  submitBlockedReason?: string;
  submitAction: Action;
  autosaveAction: Autosave;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const questionPaneRef = useRef<HTMLDivElement>(null);
  const saveTimer = useRef<number | null>(null);
  const timedOut = useRef(false);
  const flags = useFlags(sessionId);
  const fullscreen = useFullscreen();
  const [index, setIndex] = useState(() => Math.max(0, questions.findIndex((question) => question.id === initialQuestionId)));
  const [answered, setAnswered] = useState<ReadonlySet<string>>(
    () => new Set(palette.filter((item) => item.answered).map((item) => item.id)),
  );
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const byNumber = useMemo(() => new Map(palette.map((item) => [item.number, item])), [palette]);

  const current = questions[Math.min(index, questions.length - 1)];
  const passage = current?.passageKey ? passages[current.passageKey] : null;
  const instruction = current ? instructions?.[current.id] : undefined;
  const answeredCount = palette.filter((item) => answered.has(item.id)).length;
  const flaggedCount = palette.filter((item) => flags.flagged.has(item.id)).length;
  const unanswered = total - answeredCount;
  const isLast = index >= questions.length - 1;

  const saveNow = useCallback(async () => {
    const form = formRef.current;
    if (!form) return;
    const answers: Record<string, string> = {};
    for (const [key, value] of new FormData(form).entries()) {
      if (key.startsWith("answer-") && typeof value === "string") answers[key.slice("answer-".length)] = value;
    }
    setSaveState("saving");
    try {
      const result = await autosaveAction({ sessionId, answers });
      setSaveState(result.ok ? "saved" : "error");
    } catch {
      setSaveState("error");
    }
  }, [autosaveAction, sessionId]);

  const scheduleSave = useCallback(
    (delay = 800) => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(() => void saveNow(), delay);
    },
    [saveNow],
  );

  useEffect(() => {
    if (saveState === "error") scheduleSave(5000);
  }, [saveState, scheduleSave]);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const mark = (name: string, value: boolean) => {
      if (!name.startsWith("answer-")) return;
      const id = name.slice("answer-".length);
      setAnswered((previous) => {
        if (previous.has(id) === value) return previous;
        const next = new Set(previous);
        if (value) next.add(id);
        else next.delete(id);
        return next;
      });
    };
    const onChange = (event: Event) => {
      const target = event.target;
      if (target instanceof HTMLInputElement && target.type === "radio") {
        mark(target.name, true);
        scheduleSave();
      }
    };
    const onOrder = (event: Event) => {
      const detail = (event as CustomEvent<ExamAnswerDetail>).detail;
      mark(detail.name, detail.answered);
      scheduleSave();
    };
    form.addEventListener("change", onChange);
    form.addEventListener(EXAM_ANSWER_EVENT, onOrder);
    return () => {
      form.removeEventListener("change", onChange);
      form.removeEventListener(EXAM_ANSWER_EVENT, onOrder);
    };
  }, [scheduleSave]);

  // Hết giờ thì nộp luôn những câu đã có, kể cả khi AI chưa tạo xong phần còn lại.
  useEffect(() => {
    const end = new Date(endsAt).getTime();
    const timer = window.setInterval(() => {
      if (timedOut.current || Date.now() < end) return;
      timedOut.current = true;
      formRef.current?.requestSubmit();
    }, 1000);
    return () => window.clearInterval(timer);
  }, [endsAt]);

  useEffect(() => {
    questionPaneRef.current?.scrollTo({ top: 0 });
  }, [index]);

  function goToNumber(number: number) {
    setNavOpen(false);
    const local = questions.findIndex((question) => question.number === number);
    if (local >= 0) setIndex(local);
  }

  function submit() {
    setConfirmOpen(false);
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    formRef.current?.requestSubmit();
  }

  const currentFlagged = current ? flags.flagged.has(current.id) : false;

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-background">
      <header className="flex items-center gap-3 border-b border-line bg-card px-3 py-2 sm:px-5">
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-medium">{paperLabel}</h1>
          <p className="truncate text-xs text-muted">
            Đã làm {answeredCount}/{total}
            {flaggedCount > 0 ? <span className="font-medium text-warning"> · {flaggedCount} cần xem lại</span> : null}
            {saveState !== "idle" ? (
              <span className={saveState === "error" ? "text-danger" : ""} aria-live="polite"> · {saveLabel[saveState]}</span>
            ) : null}
          </p>
        </div>
        <ExamTimer endsAt={endsAt} submitted={false} compact />
        {fullscreen.supported ? (
          <button
            type="button"
            onClick={fullscreen.toggle}
            aria-label={fullscreen.active ? "Thoát toàn màn hình" : "Toàn màn hình"}
            title={fullscreen.active ? "Thoát toàn màn hình" : "Toàn màn hình"}
            className="hidden size-10 place-items-center rounded-lg text-muted hover:bg-background hover:text-foreground sm:grid"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d={fullscreen.active ? "M6 2v4H2M10 2v4h4M6 14v-4H2M10 14v-4h4" : "M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4"} />
            </svg>
          </button>
        ) : null}
        <Button
          type="button"
          size="sm"
          disabled={Boolean(submitBlockedReason)}
          title={submitBlockedReason}
          onClick={() => (unanswered > 0 || flaggedCount > 0 ? setConfirmOpen(true) : submit())}
        >
          Nộp bài
        </Button>
        <ExitButton href="/mock-exam" warning="Đáp án đã chọn được lưu tự động. Đồng hồ vẫn tiếp tục chạy khi bạn thoát." />
      </header>

      {/* Ngoài form: banner có thể chứa form riêng (tạo lại phần), mà HTML không cho lồng form. */}
      {instruction || banner || submitBlockedReason ? (
        <div className="grid max-h-[40svh] gap-1 overflow-y-auto border-b border-line bg-card/60 px-3 py-2 text-sm leading-6 sm:px-5">
          {instruction ? <p className="max-w-5xl">{instruction}</p> : null}
          {banner}
          {submitBlockedReason && !banner ? <p className="text-xs text-muted">{submitBlockedReason}</p> : null}
        </div>
      ) : null}

      <form ref={formRef} action={submitAction} className="flex min-h-0 flex-1 flex-col">
        <input type="hidden" name="sessionId" value={sessionId} />

        <main className="flex min-h-0 flex-1 flex-col lg:flex-row">
          {passage ? (
            <section
              aria-label="Đoạn văn"
              className="max-h-[38svh] shrink-0 overflow-y-auto overscroll-contain border-b border-line bg-card px-4 py-4 sm:px-6 lg:max-h-none lg:w-1/2 lg:border-r lg:border-b-0 lg:px-10 lg:py-8"
            >
              <h2 className="mb-3 font-serif text-xl lg:text-2xl">{passage.title}</h2>
              <PassageBody body={passage.body} activeNumber={current?.passageKey ? current.number : null} />
            </section>
          ) : null}
          <div ref={questionPaneRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-10 lg:py-8">
            <div className={passage ? "max-w-2xl" : "mx-auto max-w-3xl"}>
              {questions.map((question, position) => (
                <QuestionView key={question.id} question={question} hidden={position !== index} />
              ))}
              {isLast && questions.length < total ? (
                <p className="mt-6 text-sm text-muted">Các câu tiếp theo đang được tạo, sẽ tự hiện khi xong.</p>
              ) : null}
            </div>
          </div>
        </main>

        <footer className="border-t border-line bg-card">
          <nav
            id="exam-question-map"
            aria-label="Danh sách câu hỏi"
            className={`${navOpen ? "block" : "hidden"} max-h-[45svh] overflow-y-auto border-b border-line px-3 py-3 sm:px-5 lg:block lg:max-h-[30svh] lg:border-b-0 lg:pb-1`}
          >
            <div className="flex flex-wrap gap-x-7 gap-y-3">
              {groups.map((group) => (
                <div key={`${group.label}-${group.from}`} role="group" aria-label={group.label} className="grid gap-1.5">
                  <span className="text-[11px] font-semibold tracking-wide whitespace-nowrap text-muted uppercase">
                    {group.label} <span className="font-normal normal-case">· {group.from}–{group.to}</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: group.to - group.from + 1 }, (_, offset) => {
                      const number = group.from + offset;
                      const item = byNumber.get(number);
                      if (!item) {
                        return (
                          <span
                            key={number}
                            aria-label={`Câu ${number}: đang được tạo`}
                            title="Đang được tạo"
                            className="grid size-9 place-items-center rounded-md border border-dashed border-muted/40 text-sm text-muted/50"
                          >
                            {number}
                          </span>
                        );
                      }
                      const done = answered.has(item.id);
                      const marked = flags.flagged.has(item.id);
                      const here = current?.id === item.id;
                      return (
                        <button
                          key={number}
                          type="button"
                          onClick={() => goToNumber(number)}
                          aria-current={here ? "step" : undefined}
                          aria-label={`Câu ${number}: ${done ? "đã làm" : "chưa làm"}${marked ? ", cần xem lại" : ""}`}
                          className={`relative grid size-9 place-items-center overflow-hidden rounded-md border text-sm font-semibold tabular-nums transition-colors ${cellClass(done, marked)} ${
                            here ? "ring-2 ring-foreground ring-offset-2 ring-offset-card" : ""
                          }`}
                        >
                          {number}
                          {marked && done ? <AnsweredCorner /> : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </nav>

          <div className="flex items-center gap-2 px-3 py-2 sm:px-5">
            <button
              type="button"
              onClick={() => setNavOpen((open) => !open)}
              aria-expanded={navOpen}
              aria-controls="exam-question-map"
              className="min-h-10 rounded-lg border border-line px-3 text-sm font-medium lg:hidden"
            >
              {navOpen ? "Ẩn bảng câu" : `Bảng câu · ${answeredCount}/${total}`}
            </button>
            <ul aria-hidden="true" className="hidden items-center gap-4 text-xs text-muted lg:flex">
              <li className="flex items-center gap-1.5"><span className="size-3.5 rounded-sm bg-accent" />Đã làm</li>
              <li className="flex items-center gap-1.5"><span className="size-3.5 rounded-sm bg-marked" />Cần xem lại</li>
              <li className="flex items-center gap-1.5">
                <span className="relative size-3.5 overflow-hidden rounded-sm bg-marked">
                  <AnsweredCorner className="size-2" />
                </span>
                Đã làm, cần xem lại
              </li>
              <li className="flex items-center gap-1.5"><span className="size-3.5 rounded-sm border border-muted/35 bg-card" />Chưa làm</li>
            </ul>
            <div className="flex-1" />
            {current ? (
              <button
                type="button"
                role="checkbox"
                aria-checked={currentFlagged}
                onClick={() => flags.toggle(current.id)}
                className={`flex min-h-10 shrink-0 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors ${
                  currentFlagged
                    ? "border-marked bg-marked text-marked-foreground"
                    : "border-line text-foreground/80 hover:border-marked hover:bg-marked/10"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`grid size-4 place-items-center rounded-[4px] border ${
                    currentFlagged ? "border-marked-foreground bg-marked-foreground text-marked" : "border-muted bg-card"
                  }`}
                >
                  {currentFlagged ? <Check className="size-3" /> : null}
                </span>
                Xem lại
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setIndex((value) => Math.max(0, value - 1))}
              disabled={index === 0}
              aria-label="Câu trước"
              className="grid size-10 shrink-0 place-items-center rounded-lg border border-line text-foreground hover:bg-background disabled:opacity-40"
            >
              <Arrow direction="left" />
            </button>
            <button
              type="button"
              onClick={() => setIndex((value) => Math.min(questions.length - 1, value + 1))}
              disabled={isLast}
              aria-label="Câu sau"
              className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-40"
            >
              <Arrow direction="right" />
            </button>
          </div>
        </footer>

        <SubmittingOverlay />
      </form>

      <ConfirmDialog
        open={confirmOpen}
        title="Nộp bài?"
        description={[
          unanswered > 0 ? `Còn ${unanswered} câu chưa làm.` : "",
          flaggedCount > 0 ? `Có ${flaggedCount} câu bạn đánh dấu cần xem lại.` : "",
          "Sau khi nộp sẽ không sửa được đáp án.",
        ]
          .filter(Boolean)
          .join(" ")}
        confirmLabel="Nộp bài"
        cancelLabel="Làm tiếp"
        onConfirm={submit}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
