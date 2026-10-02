"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  clearGeminiKey,
  clearGroqKey,
  clearOpenRouterKey,
  saveGeminiKey,
  saveGroqKey,
  saveOpenRouterKey,
  selectAIProvider,
} from "@/modules/ai/key-actions";
import type { AIChoice } from "@/modules/ai/provider";

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
    detail: "AI của Google. Cần khóa từ Google AI Studio.",
    href: "https://aistudio.google.com/apikey",
    hrefLabel: "Mở trang tạo khóa",
  },
  {
    id: "groq",
    title: "Groq",
    detail: "AI trên mạng khác. Dùng khi Gemini hết lượt.",
    href: "https://console.groq.com/keys",
    hrefLabel: "Mở trang tạo khóa",
  },
  {
    id: "openrouter",
    title: "OpenRouter",
    detail: "Một khóa dùng được nhiều model. Chế độ Auto sẽ tự chọn model phù hợp.",
    href: "https://openrouter.ai/settings/keys",
    hrefLabel: "Mở trang tạo khóa",
  },
];

function KeyForm({
  action,
  clearAction,
  label,
  mask,
}: {
  action: (formData: FormData) => Promise<void>;
  clearAction: () => Promise<void>;
  label: string;
  mask: string | null;
}) {
  return (
    <div className="grid gap-3">
      {mask ? <p className="text-sm text-muted">Khóa đang lưu: {mask}</p> : null}
      <form action={action} className="grid gap-3">
        <label className="grid gap-1 text-sm">
          {label}
          <input
            name="apiKey"
            type="password"
            autoComplete="off"
            placeholder="Dán khóa vào đây"
            className="h-11 rounded-lg border border-line bg-background px-3"
          />
        </label>
        <Button type="submit">{mask ? "Thay khóa" : "Lưu khóa"}</Button>
      </form>
      {mask ? (
        <form action={clearAction}>
          <Button type="submit" variant="outline" className="text-danger">
            Xóa khóa đã lưu
          </Button>
        </form>
      ) : null}
    </div>
  );
}

export function AiSourcePicker({
  selected,
  geminiMask,
  groqMask,
  openrouterMask,
}: {
  selected: AIChoice | null;
  geminiMask: string | null;
  groqMask: string | null;
  openrouterMask: string | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function pick(source: (typeof sources)[number]) {
    window.open(source.href, "_blank", "noopener,noreferrer");
    startTransition(async () => {
      await selectAIProvider(source.id);
      router.replace("/account/settings");
      router.refresh();
    });
  }

  return (
    <div className="grid gap-3" role="radiogroup" aria-label="Nguồn AI">
      {sources.map((source) => {
        const active = selected === source.id;
        return (
          <div
            key={source.id}
            className={active ? "grid gap-4 rounded-xl border border-accent bg-card p-4" : "rounded-xl border border-line bg-card p-4"}
          >
            <button
              type="button"
              role="radio"
              aria-checked={active}
              disabled={pending}
              onClick={() => pick(source)}
              className="grid gap-1 text-left"
            >
              <span className="font-medium">
                {source.title}
                {active ? <span className="ml-2 text-sm font-normal text-accent">Đang dùng</span> : null}
              </span>
              <span className="text-sm leading-6 text-muted">{source.detail}</span>
            </button>
            {active ? (
              <a href={source.href} target="_blank" rel="noreferrer" className="text-sm text-accent underline-offset-2 hover:underline">
                {source.hrefLabel}
              </a>
            ) : null}
            {active && source.id === "gemini" ? (
              <KeyForm action={saveGeminiKey} clearAction={clearGeminiKey} label="Khóa Gemini" mask={geminiMask} />
            ) : null}
            {active && source.id === "groq" ? (
              <KeyForm action={saveGroqKey} clearAction={clearGroqKey} label="Khóa Groq" mask={groqMask} />
            ) : null}
            {active && source.id === "openrouter" ? (
              <KeyForm
                action={saveOpenRouterKey}
                clearAction={clearOpenRouterKey}
                label="Khóa OpenRouter"
                mask={openrouterMask}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
