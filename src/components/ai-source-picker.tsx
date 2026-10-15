"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { FormPending } from "@/components/form-pending";
import { LoadingNotice } from "@/components/loading-notice";
import { ModelSelect } from "@/components/model-select";
import { Button } from "@/components/ui/button";
import {
  clearGeminiKey,
  clearGroqKey,
  clearOpenRouterKey,
  saveAIModel,
  saveGeminiKey,
  saveGroqKey,
  saveOpenRouterKey,
  selectAIProvider,
  testAIConnection,
} from "@/modules/ai/key-actions";
import type { ListedModel } from "@/modules/ai/list-models";
import { MODEL_SUGGESTIONS, SOURCE_LABELS, type AIChoice } from "@/modules/ai/provider";

const sources: {
  id: "gemini" | "groq" | "openrouter";
  title: string;
  detail: string;
  href: string;
  hrefLabel: string;
}[] = [
  {
    id: "gemini",
    title: "Gemini",
    detail: "Của Google, phù hợp để bắt đầu.",
    href: "https://aistudio.google.com/apikey",
    hrefLabel: "Lấy khóa Gemini",
  },
  {
    id: "groq",
    title: "Groq",
    detail: "Tạo nội dung nhanh, có nhiều model mở.",
    href: "https://console.groq.com/keys",
    hrefLabel: "Lấy khóa Groq",
  },
  {
    id: "openrouter",
    title: "OpenRouter",
    detail: "Một khóa dùng được model của nhiều hãng.",
    href: "https://openrouter.ai/settings/keys",
    hrefLabel: "Lấy khóa OpenRouter",
  },
];

function ModelForm({
  choice,
  model,
  options,
  listError,
  hasKey,
  returnTo,
}: {
  choice: AIChoice;
  model: string;
  options: ListedModel[];
  listError: string | null;
  hasKey: boolean;
  returnTo: string | null;
}) {
  const known = options.some((item) => item.id === model);
  const [selected, setSelected] = useState(known ? model : options[0]?.id ?? "");
  const suggestions = MODEL_SUGGESTIONS[choice].flatMap((item) => {
    const listed = options.find((option) => option.id === item.id);
    return listed ? [{ ...item, label: listed.label }] : [];
  });
  if (!hasKey) {
    return <p className="text-sm text-muted">Lưu khóa trước. Danh sách model lấy từ nhà cung cấp theo khóa đó.</p>;
  }
  if (listError || options.length === 0) {
    return <p className="text-sm text-danger">{listError ?? "Nhà cung cấp không trả model nào dùng để tạo câu."}</p>;
  }

  return (
    <form action={saveAIModel} className="grid gap-3">
      {returnTo ? <input type="hidden" name="returnTo" value={returnTo} /> : null}
      {!known && model ? (
        <p className="text-sm text-danger">Model đã lưu không còn trong danh sách của khóa này. Hãy chọn model khác.</p>
      ) : null}
      {suggestions.length > 0 ? (
        <div className="grid gap-2">
          <p className="text-sm font-medium">Gợi ý model ổn định</p>
          <ul className="grid gap-2">
            {suggestions.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  aria-pressed={selected === item.id}
                  onClick={() => setSelected(item.id)}
                  className={
                    selected === item.id
                      ? "grid w-full gap-0.5 rounded-lg border border-accent bg-background px-3 py-2 text-left"
                      : "grid w-full gap-0.5 rounded-lg border border-line px-3 py-2 text-left hover:border-accent/50"
                  }
                >
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-sm leading-6 text-muted">{item.note}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="grid gap-1 text-sm">
        Hoặc tìm model khác
        <ModelSelect models={options} initial={selected} value={selected} onChange={setSelected} />
      </div>
      <p className="text-sm text-muted">Danh sách lấy từ tài khoản của bạn. Không chọn thì app dùng model mặc định.</p>
      <Button type="submit">Lưu model</Button>
      <FormPending label="Đang xác nhận model với nhà cung cấp…" />
    </form>
  );
}

function KeyForm({
  action,
  clearAction,
  source,
  mask,
  returnTo,
}: {
  action: (formData: FormData) => Promise<void>;
  clearAction: () => Promise<void>;
  source: (typeof sources)[number];
  mask: string | null;
  returnTo: string | null;
}) {
  const keyFields = (
    <>
      <div className="grid gap-2">
        <p className="text-sm leading-6 text-muted">
          Mở trang của {source.title}, tạo một khóa rồi copy và dán vào ô bên dưới.
        </p>
        <Button asChild variant="outline" className="w-fit">
          <a href={source.href} target="_blank" rel="noreferrer">
            {source.hrefLabel} <span aria-hidden="true">↗</span>
          </a>
        </Button>
      </div>
      <form action={action} className="grid gap-3">
        {returnTo ? <input type="hidden" name="returnTo" value={returnTo} /> : null}
        <label className="grid gap-1 text-sm">
          {mask ? "Dán khóa mới" : `Dán khóa ${source.title}`}
          <input
            name="apiKey"
            type="password"
            autoComplete="off"
            required
            placeholder="Dán toàn bộ khóa vào đây"
            className="h-11 rounded-lg border border-line bg-background px-3"
          />
        </label>
        <Button type="submit">
          {source.id === "gemini" ? (mask ? "Lưu khóa mới" : "Lưu và kiểm tra khóa") : mask ? "Lưu khóa mới" : "Lưu khóa"}
        </Button>
        {/* Chỉ Gemini thật sự gọi Google để xác minh khóa trước khi lưu; Groq/OpenRouter lưu
            thẳng nên không nên nói "đang kiểm tra" — dễ hiểu lầm là app có kiểm tra mà không có. */}
        <FormPending label={source.id === "gemini" ? "Đang xác minh khóa với Google…" : "Đang lưu khóa…"} />
      </form>
    </>
  );

  if (!mask) return <div className="grid gap-4">{keyFields}</div>;

  return (
    <div className="grid gap-4">
      <p className="rounded-lg border border-accent/30 bg-background p-3 text-sm">
        <span className="font-medium text-accent">Khóa đã sẵn sàng ✓</span>
        <span className="ml-2 text-muted">{mask}</span>
      </p>
      <details className="group">
        <summary className="min-h-11 cursor-pointer py-3 text-sm text-muted hover:text-foreground">
          Thay hoặc xóa khóa
        </summary>
        <div className="grid gap-4 border-t border-line pt-4">
          {keyFields}
        <form action={clearAction}>
          <Button type="submit" variant="ghost" className="px-0 text-danger">
            Xóa khóa đã lưu
          </Button>
          <FormPending label="Đang xóa khóa…" />
        </form>
        </div>
      </details>
    </div>
  );
}

type Shared = { limit: number; used: number } | null;

function TestConnection() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  return (
    <div className="grid gap-2">
      <Button
        type="button"
        variant="outline"
        className="w-fit"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            setResult(await testAIConnection());
          })
        }
      >
        {pending ? "Đang kiểm tra…" : "Kiểm tra kết nối"}
      </Button>
      {result ? (
        <p className={result.ok ? "text-sm text-accent" : "text-sm text-danger"}>{result.message}</p>
      ) : null}
    </div>
  );
}

function StatusCard({
  selected,
  ready,
  activeModel,
  shared,
  returnTo,
}: {
  selected: AIChoice | null;
  ready: boolean;
  activeModel: string | null;
  shared: Shared;
  returnTo: string | null;
}) {
  if (!selected || !ready) {
    return (
      <section className="grid gap-1 rounded-xl border border-warning/40 bg-card p-4 sm:p-5">
        <p className="text-lg font-medium">Chưa kết nối AI</p>
        <p className="text-sm leading-6 text-muted">
          Bạn vẫn luyện được bằng câu hỏi có sẵn. Muốn tạo đề bằng AI thì chọn một cách bên dưới.
        </p>
      </section>
    );
  }
  const isShared = selected === "openai";
  return (
    <section className="grid gap-3 rounded-xl border-2 border-accent bg-card p-4 sm:p-5">
      <div className="grid gap-1">
        <p className="text-lg font-medium">
          <span className="text-accent">✓</span> Đang dùng: {SOURCE_LABELS[selected]}
        </p>
        <p className="text-sm leading-6 text-muted">
          {isShared && shared
            ? `Không cần cài đặt. Còn ${Math.max(0, shared.limit - shared.used)}/${shared.limit} lượt AI trong 24 giờ.`
            : `Dùng khóa riêng của bạn${activeModel ? ` · model ${activeModel}` : ""}.`}
        </p>
      </div>
      <div className="flex flex-wrap items-start gap-3">
        <TestConnection />
        {returnTo ? (
          <Button asChild>
            <Link href={returnTo}>Quay lại bài đang làm</Link>
          </Button>
        ) : null}
      </div>
    </section>
  );
}

type StepKey = "way" | "key" | "check";

const stepLabels: Record<StepKey, string> = { way: "Chọn cách", key: "Lưu khóa", check: "Hoàn tất" };

function Stepper({ steps, current }: { steps: StepKey[]; current: StepKey }) {
  const index = steps.indexOf(current);
  return (
    <ol className="flex items-center gap-2 text-sm" aria-label="Các bước">
      {steps.map((key, i) => {
        const done = i < index;
        const active = i === index;
        return (
          <li key={key} className="flex items-center gap-2" aria-current={active ? "step" : undefined}>
            <span
              className={
                done
                  ? "flex size-7 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground"
                  : active
                    ? "flex size-7 items-center justify-center rounded-full border-2 border-accent text-xs font-medium"
                    : "flex size-7 items-center justify-center rounded-full border border-line text-xs text-muted"
              }
            >
              {done ? "✓" : i + 1}
            </span>
            <span className={active ? "font-medium" : "text-muted"}>{stepLabels[key]}</span>
            {i < steps.length - 1 ? <span aria-hidden className="mx-1 h-px w-6 bg-line" /> : null}
          </li>
        );
      })}
    </ol>
  );
}

function ModelDetails({
  choice,
  model,
  models,
  listError,
  hasKey,
  returnTo,
}: {
  choice: AIChoice;
  model: string | null;
  models: ListedModel[];
  listError: string | null;
  hasKey: boolean;
  returnTo: string | null;
}) {
  return (
    <details className="group rounded-xl border border-line bg-card">
      <summary className="min-h-11 cursor-pointer px-4 py-3 font-medium sm:px-5">Tùy chỉnh model (nâng cao)</summary>
      <div className="grid gap-4 border-t border-line p-4 sm:p-5">
        <ModelForm
          key={`${choice}:${model ?? ""}:${models.map((item) => item.id).join(",")}`}
          choice={choice}
          model={model ?? ""}
          options={models}
          listError={listError}
          hasKey={hasKey}
          returnTo={returnTo}
        />
      </div>
    </details>
  );
}

export function AiSourcePicker({
  selected,
  model,
  models,
  listError,
  hasKey,
  activeModel,
  geminiMask,
  groqMask,
  openrouterMask,
  shared,
  justSaved,
  returnTo,
}: {
  selected: AIChoice | null;
  model: string | null;
  models: ListedModel[];
  listError: string | null;
  hasKey: boolean;
  activeModel: string | null;
  geminiMask: string | null;
  groqMask: string | null;
  openrouterMask: string | null;
  /** Có khóa AI dùng chung của ứng dụng hay không, kèm hạn mức/lượt đã dùng. */
  shared: Shared;
  /** Vừa lưu khóa/model xong: mở thẳng bước cuối thay vì quay lại bước 1. */
  justSaved: boolean;
  returnTo: string | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const ownSelected = selected && selected !== "openai" ? selected : null;
  const [view, setView] = useState<"summary" | "wizard">(hasKey && !justSaved ? "summary" : "wizard");
  const [way, setWay] = useState<"shared" | "own">(
    selected === "openai" ? "shared" : ownSelected ? "own" : shared ? "shared" : "own",
  );
  const [step, setStep] = useState<StepKey>(hasKey && justSaved ? "check" : "way");
  const [viewing, setViewing] = useState<(typeof sources)[number]["id"]>(ownSelected ?? "gemini");
  const [showOthers, setShowOthers] = useState(ownSelected === "groq" || ownSelected === "openrouter");
  const settingsPath = returnTo ? `/account/settings?returnTo=${encodeURIComponent(returnTo)}` : "/account/settings";

  const steps: StepKey[] = way === "shared" ? ["way", "check"] : ["way", "key", "check"];
  const finishHref = returnTo ?? "/ai-generator";
  const finishLabel = returnTo ? "Xong, quay lại bài đang làm" : "Xong, đi tạo đề AI";

  function activate(choice: AIChoice, next: StepKey) {
    startTransition(async () => {
      await selectAIProvider(choice);
      router.replace(settingsPath);
      router.refresh();
      setStep(next);
    });
  }

  function maskFor(id: AIChoice) {
    return id === "gemini" ? geminiMask : id === "groq" ? groqMask : id === "openrouter" ? openrouterMask : null;
  }

  const source = sources.find((item) => item.id === viewing) ?? sources[0];
  const mask = maskFor(source.id);
  const keyAction = source.id === "gemini" ? saveGeminiKey : source.id === "groq" ? saveGroqKey : saveOpenRouterKey;
  const clearAction = source.id === "gemini" ? clearGeminiKey : source.id === "groq" ? clearGroqKey : clearOpenRouterKey;
  const visible = showOthers ? sources : sources.filter((item) => item.id === "gemini");

  if (view === "summary") {
    return (
      <div className="grid gap-4">
        <StatusCard selected={selected} ready={hasKey} activeModel={activeModel} shared={shared} returnTo={returnTo} />
        {ownSelected ? (
          <ModelDetails
            choice={ownSelected}
            model={model}
            models={models}
            listError={listError}
            hasKey={hasKey}
            returnTo={returnTo}
          />
        ) : null}
        <Button
          type="button"
          variant="outline"
          className="w-fit"
          onClick={() => {
            setStep("way");
            setView("wizard");
          }}
        >
          Đổi cách kết nối
        </Button>
      </div>
    );
  }

  function back() {
    const index = steps.indexOf(step);
    if (index > 0) setStep(steps[index - 1]);
    else if (hasKey) setView("summary");
  }

  const canBack = steps.indexOf(step) > 0 || hasKey;

  return (
    <div className="grid gap-4">
      <Stepper steps={steps} current={step} />

      {step === "way" ? (
        <section className="grid gap-4 rounded-xl border border-line bg-card p-4 sm:p-5">
          <div>
            <h2 className="text-xl font-medium">Bạn muốn kết nối AI bằng cách nào?</h2>
            <p className="mt-1 text-sm leading-6 text-muted">Có thể đổi lại bất cứ lúc nào, khóa đã lưu không bị mất.</p>
          </div>
          <div className="grid gap-2" role="radiogroup" aria-label="Cách kết nối">
            {shared ? (
              <button
                type="button"
                role="radio"
                aria-checked={way === "shared"}
                onClick={() => setWay("shared")}
                className={
                  way === "shared"
                    ? "grid gap-1 rounded-xl border-2 border-accent bg-background p-4 text-left"
                    : "grid gap-1 rounded-xl border border-line p-4 text-left hover:border-accent/50"
                }
              >
                <span className="font-medium">
                  Dùng AI của ứng dụng <span className="ml-1 text-xs font-normal text-accent">Dễ nhất</span>
                </span>
                <span className="text-sm leading-6 text-muted">
                  Không cần tạo khóa. Giới hạn {shared.limit} lượt AI mỗi 24 giờ cho mỗi người.
                </span>
              </button>
            ) : null}
            <button
              type="button"
              role="radio"
              aria-checked={way === "own"}
              onClick={() => setWay("own")}
              className={
                way === "own"
                  ? "grid gap-1 rounded-xl border-2 border-accent bg-background p-4 text-left"
                  : "grid gap-1 rounded-xl border border-line p-4 text-left hover:border-accent/50"
              }
            >
              <span className="font-medium">Dùng khóa riêng của tôi</span>
              <span className="text-sm leading-6 text-muted">
                Không bị giới hạn lượt. Cần tạo một khóa miễn phí ở Gemini, Groq hoặc OpenRouter.
              </span>
            </button>
          </div>
        </section>
      ) : null}

      {step === "key" ? (
        <section className="grid gap-4 rounded-xl border border-line bg-card p-4 sm:p-5">
          <div>
            <h2 className="text-xl font-medium">Lưu khóa của bạn</h2>
            <p className="mt-1 text-sm leading-6 text-muted">
              Khóa được mã hóa và chỉ thuộc tài khoản của bạn. Nếu chưa biết chọn gì, hãy dùng Gemini.
            </p>
          </div>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Nguồn AI">
            {visible.map((item) => (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={viewing === item.id}
                onClick={() => setViewing(item.id)}
                className={
                  viewing === item.id
                    ? "min-h-11 rounded-lg border-2 border-accent bg-background px-4 text-sm font-medium"
                    : "min-h-11 rounded-lg border border-line px-4 text-sm hover:border-accent/50"
                }
              >
                {item.title}
                {item.id === "gemini" ? <span className="ml-2 text-xs text-accent">Khuyên dùng</span> : null}
                {maskFor(item.id) ? <span className="ml-2 text-xs text-accent">Đã có khóa ✓</span> : null}
              </button>
            ))}
            {!showOthers ? (
              <button
                type="button"
                onClick={() => setShowOthers(true)}
                className="min-h-11 rounded-lg px-3 text-sm text-muted hover:text-foreground"
              >
                Nguồn khác
              </button>
            ) : null}
          </div>
          <p className="text-sm leading-6 text-muted">{source.detail}</p>
          <KeyForm key={source.id} action={keyAction} clearAction={clearAction} source={source} mask={mask} returnTo={returnTo} />
          <Link href="/account/api-key-guide" className="w-fit text-sm text-accent underline">
            Chưa biết lấy khóa? Xem hướng dẫn từng bước
          </Link>
        </section>
      ) : null}

      {step === "check" ? (
        <div className="grid gap-4">
          <StatusCard selected={selected} ready={hasKey} activeModel={activeModel} shared={shared} returnTo={null} />
          {ownSelected ? (
            <ModelDetails
              choice={ownSelected}
              model={model}
              models={models}
              listError={listError}
              hasKey={hasKey}
              returnTo={returnTo}
            />
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        {canBack ? (
          <Button type="button" variant="ghost" disabled={pending} onClick={back}>
            ← Quay lại
          </Button>
        ) : (
          <span />
        )}
        {step === "way" ? (
          <Button
            type="button"
            disabled={pending}
            onClick={() => (way === "shared" ? activate("openai", "check") : setStep("key"))}
          >
            Tiếp →
          </Button>
        ) : null}
        {step === "key" ? (
          <Button
            type="button"
            disabled={pending || !mask}
            onClick={() => (selected === source.id ? setStep("check") : activate(source.id, "check"))}
          >
            Tiếp →
          </Button>
        ) : null}
        {step === "check" ? (
          <Button asChild>
            <Link href={finishHref}>{finishLabel}</Link>
          </Button>
        ) : null}
      </div>
      {step === "key" && !mask ? (
        <p className="text-sm text-muted">Lưu khóa ở trên trước, nút Tiếp sẽ sáng lên.</p>
      ) : null}
      {pending ? <LoadingNotice label="Đang đổi nguồn AI…" portal /> : null}
    </div>
  );
}
