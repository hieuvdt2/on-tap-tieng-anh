"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { FormPending } from "@/components/form-pending";
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
} from "@/modules/ai/key-actions";
import type { ListedModel } from "@/modules/ai/list-models";
import { MODEL_SUGGESTIONS, type AIChoice } from "@/modules/ai/provider";

const sources: {
  id: AIChoice;
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
}: {
  choice: AIChoice;
  model: string;
  options: ListedModel[];
  listError: string | null;
  hasKey: boolean;
}) {
  const known = options.some((item) => item.id === model);
  const [selected, setSelected] = useState(known ? model : options[0]?.id ?? "");
  const suggestions = MODEL_SUGGESTIONS[choice].flatMap((item) => {
    const listed = options.find((option) => option.id === item.id);
    return listed ? [{ ...item, label: listed.label }] : [];
  });
  if (!hasKey) {
    return <p className="text-sm text-muted">Lưu khóa trước. Danh sách model sẽ lấy từ nhà cung cấp theo khóa đó.</p>;
  }
  if (listError || options.length === 0) {
    return <p className="text-sm text-danger">{listError ?? "Nhà cung cấp không trả model nào dùng để tạo câu."}</p>;
  }

  return (
    <form action={saveAIModel} className="grid gap-3">
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
      <p className="text-sm text-muted">Danh sách lấy từ tài khoản của bạn. Chỉ model dùng để tạo câu mới hiện ở đây.</p>
      <Button type="submit">Hoàn tất cấu hình</Button>
      <FormPending label="Đang lưu model…" />
    </form>
  );
}

function KeyForm({
  action,
  clearAction,
  source,
  mask,
}: {
  action: (formData: FormData) => Promise<void>;
  clearAction: () => Promise<void>;
  source: (typeof sources)[number];
  mask: string | null;
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
        <Button type="submit">{mask ? "Lưu khóa mới" : "Lưu và kiểm tra khóa"}</Button>
        <FormPending label="Đang kiểm tra và lưu khóa…" />
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

export function AiSourcePicker({
  selected,
  model,
  savedModels,
  models,
  listError,
  hasKey,
  geminiMask,
  groqMask,
  openrouterMask,
}: {
  selected: AIChoice | null;
  model: string | null;
  savedModels: Partial<Record<AIChoice, string>>;
  models: ListedModel[];
  listError: string | null;
  hasKey: boolean;
  geminiMask: string | null;
  groqMask: string | null;
  openrouterMask: string | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [switchTo, setSwitchTo] = useState<(typeof sources)[number] | null>(null);

  function apply(source: (typeof sources)[number]) {
    startTransition(async () => {
      await selectAIProvider(source.id);
      router.replace("/account/settings");
      router.refresh();
    });
  }

  function pick(source: (typeof sources)[number]) {
    if (selected === source.id) return;
    if (!selected) {
      apply(source);
      return;
    }
    setSwitchTo(source);
  }

  function maskFor(id: AIChoice) {
    return id === "gemini" ? geminiMask : id === "groq" ? groqMask : openrouterMask;
  }

  function switchDescription(target: (typeof sources)[number]) {
    const current = sources.find((source) => source.id === selected)?.title ?? "nguồn hiện tại";
    const keep = `Khóa và model của ${current} vẫn được giữ, có thể chuyển lại bất cứ lúc nào.`;
    if (!maskFor(target.id)) {
      return `${target.title} chưa có khóa. Sau khi chuyển, tạo đề bằng AI sẽ tạm dừng cho đến khi bạn lưu khóa ${target.title}. Bài luyện vẫn dùng câu có sẵn. ${keep}`;
    }
    const saved = savedModels[target.id];
    return saved
      ? `Tạo đề AI sẽ dùng ${target.title} với model ${saved} đã chọn trước đó. ${keep}`
      : `${target.title} đã có khóa nhưng chưa chọn model. Hãy chọn model ở bước 3 sau khi chuyển; nếu chưa chọn, app tạm dùng model mặc định của ${target.title}. ${keep}`;
  }

  const activeSource = sources.find((source) => source.id === selected);
  const activeMask =
    selected === "gemini" ? geminiMask : selected === "groq" ? groqMask : selected === "openrouter" ? openrouterMask : null;
  const keyAction = selected === "gemini" ? saveGeminiKey : selected === "groq" ? saveGroqKey : saveOpenRouterKey;
  const clearAction =
    selected === "gemini" ? clearGeminiKey : selected === "groq" ? clearGroqKey : clearOpenRouterKey;
  const modelConfigured = Boolean(model && models.some((item) => item.id === model));

  return (
    <div className="grid gap-6">
      <ConfirmDialog
        open={Boolean(switchTo)}
        title={switchTo ? `Chuyển sang ${switchTo.title}?` : ""}
        description={switchTo ? switchDescription(switchTo) : ""}
        confirmLabel="Chuyển nguồn"
        cancelLabel="Giữ nguyên"
        onCancel={() => setSwitchTo(null)}
        onConfirm={() => {
          if (switchTo) apply(switchTo);
          setSwitchTo(null);
        }}
      />
      <section className="grid gap-3">
        <div>
          <p className="text-sm font-medium text-accent">Bước 1 trong 3</p>
          <h2 className="mt-1 text-xl font-medium">Chọn nguồn AI</h2>
          <p className="mt-1 text-sm leading-6 text-muted">Nếu chưa biết chọn gì, hãy dùng Gemini.</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Nguồn AI">
          {sources.map((source) => {
            const active = selected === source.id;
            return (
              <button
                key={source.id}
                type="button"
                role="radio"
                aria-checked={active}
                disabled={pending}
                onClick={() => pick(source)}
                className={
                  active
                    ? "grid min-h-24 gap-1 rounded-xl border-2 border-accent bg-card p-4 text-left"
                    : "grid min-h-24 gap-1 rounded-xl border border-line bg-card p-4 text-left hover:border-accent/50"
                }
              >
                <span className="font-medium">
                  {source.title}
                  {active ? <span className="ml-2 text-xs font-normal text-accent">Đã chọn ✓</span> : null}
                </span>
                <span className="text-sm leading-6 text-muted">{source.detail}</span>
              </button>
            );
          })}
        </div>
        {pending ? <p className="text-sm text-muted">Đang đổi nguồn…</p> : null}
      </section>

      <section
        inert={!activeSource}
        className={activeSource ? "grid gap-4 rounded-xl border border-line bg-card p-4 sm:p-5" : "grid gap-2 rounded-xl border border-dashed border-line bg-card/60 p-4 text-muted sm:p-5"}
      >
        <div>
          <p className={activeSource ? "text-sm font-medium text-accent" : "text-sm font-medium"}>
            Bước 2 trong 3 {hasKey ? "· Đã xong ✓" : activeSource ? "" : "· Chưa mở"}
          </p>
          <h2 className="mt-1 text-xl font-medium">Lấy và lưu khóa {activeSource ? activeSource.title : ""}</h2>
          <p className="mt-1 text-sm leading-6 text-muted">
            {activeSource
              ? `Khóa giúp ứng dụng kết nối với ${activeSource.title}. Khóa được mã hóa và chỉ thuộc tài khoản của bạn.`
              : "Hãy chọn một nguồn ở bước 1 trước."}
          </p>
        </div>
        {activeSource ? <KeyForm action={keyAction} clearAction={clearAction} source={activeSource} mask={activeMask} /> : null}
      </section>

      <section
        inert={!hasKey}
        className={hasKey ? "grid gap-4 rounded-xl border border-line bg-card p-4 sm:p-5" : "grid gap-2 rounded-xl border border-dashed border-line bg-card/60 p-4 text-muted sm:p-5"}
      >
        <div>
          <p className={hasKey ? "text-sm font-medium text-accent" : "text-sm font-medium"}>
            Bước 3 trong 3 {modelConfigured ? "· Đã xong ✓" : hasKey ? "" : "· Chưa mở"}
          </p>
          <h2 className="mt-1 text-xl font-medium">Chọn model</h2>
          <p className="mt-1 text-sm leading-6 text-muted">
            {hasKey
              ? "Model là phiên bản AI sẽ tạo câu hỏi. Bạn có thể tìm theo tên rồi chọn một model."
              : "Hãy lưu khóa ở bước 2 trước. Danh sách model lấy theo khóa đó."}
          </p>
        </div>
        {hasKey && activeSource ? (
          <ModelForm
            key={`${activeSource.id}:${model ?? ""}:${models.map((item) => item.id).join(",")}`}
            choice={activeSource.id}
            model={model ?? ""}
            options={models}
            listError={listError}
            hasKey={hasKey}
          />
        ) : null}
      </section>
    </div>
  );
}
