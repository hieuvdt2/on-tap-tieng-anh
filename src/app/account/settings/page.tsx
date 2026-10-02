import Link from "next/link";
import { AiSourcePicker } from "@/components/ai-source-picker";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { listStoredModels } from "@/modules/ai/list-models";
import { readStoredAI } from "@/modules/ai/settings";

function maskKey(key: string) {
  return `••••••••${key.slice(-4)}`;
}

export default async function AccountSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; cleared?: string; error?: string; model?: string }>;
}) {
  const query = await searchParams;
  const user = await requireUser();
  const stored = await readStoredAI(user.id);
  const selected = stored.provider;
  const geminiMask = stored.geminiApiKey?.trim() ? maskKey(stored.geminiApiKey.trim()) : null;
  const groqMask = stored.groqApiKey?.trim() ? maskKey(stored.groqApiKey.trim()) : null;
  const openrouterMask = stored.openrouterApiKey?.trim() ? maskKey(stored.openrouterApiKey.trim()) : null;
  const selectedMask =
    selected === "groq" ? groqMask : selected === "gemini" ? geminiMask : selected === "openrouter" ? openrouterMask : null;
  const listed = selected ? await listStoredModels(selected, stored) : { models: [], error: null };
  const hasKey = Boolean(selectedMask);
  const savedModelId = selected ? stored.models?.[selected] ?? null : null;
  const savedModel = listed.models.find((item) => item.id === savedModelId);
  const sourceName = selected === "gemini" ? "Gemini" : selected === "groq" ? "Groq" : selected === "openrouter" ? "OpenRouter" : null;
  const steps = [
    { label: "Chọn nguồn AI", done: Boolean(selected), detail: sourceName },
    { label: "Lưu khóa", done: hasKey, detail: hasKey ? selectedMask ?? "Khóa của hệ thống" : null },
    { label: "Chọn model", done: Boolean(savedModel), detail: savedModel?.label ?? null },
  ];

  const notice = query.model
    ? "Đã lưu model."
    : query.saved
    ? "Đã xác minh và lưu khóa."
    : query.cleared
      ? "Đã xóa khóa. Bài luyện dùng lại câu có sẵn cho đến khi có khóa mới."
      : query.error === "invalid-key"
        ? selectedMask
          ? "Gemini từ chối khóa mới. Khóa cũ vẫn được giữ. Hãy tạo khóa mới trong Google AI Studio."
          : "Gemini từ chối khóa này. Hãy tạo khóa mới trong Google AI Studio rồi dán lại."
        : query.error === "verify"
          ? "Chưa kết nối được Google để kiểm tra khóa. Khóa chưa được lưu; hãy thử lại."
          : query.error === "model"
            ? "Model này không có trong danh sách của khóa đang dùng."
            : query.error
            ? selectedMask
              ? "Khóa mới chưa đúng dạng. Khóa cũ vẫn được giữ."
              : "Khóa chưa đúng dạng. Hãy copy cả chuỗi khóa rồi dán lại."
            : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:items-start lg:gap-10">
      <aside className="grid gap-5 lg:sticky lg:top-6">
        <div className="grid gap-2">
          <p className="text-sm text-muted">Cấu hình</p>
          <h1 className="font-serif text-4xl font-medium">Thiết lập AI</h1>
          <p className="leading-7 text-muted">
            Làm lần lượt 3 bước. Mỗi tài khoản chỉ cần thiết lập một lần và có thể đổi lại bất cứ lúc nào.
          </p>
        </div>
        <ol className="hidden gap-2 rounded-xl border border-line bg-card p-4 text-sm lg:grid">
          {steps.map((step, index) => (
            <li key={step.label} className="flex items-center gap-3">
              <span
                className={
                  step.done
                    ? "flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground"
                    : "flex size-7 shrink-0 items-center justify-center rounded-full border border-line text-xs text-muted"
                }
              >
                {step.done ? "✓" : index + 1}
              </span>
              <span className="min-w-0">
                <span className={step.done ? "block font-medium" : "block"}>{step.label}</span>
                {step.detail ? <span className="block truncate text-xs text-muted">{step.detail}</span> : null}
              </span>
            </li>
          ))}
        </ol>
        <Button asChild variant="outline" className="w-fit">
          <Link href="/account/api-key-guide">Chưa biết lấy khóa? Xem hướng dẫn</Link>
        </Button>
        <p className="hidden text-sm leading-6 text-muted lg:block">
          Chưa cấu hình xong thì bạn vẫn có thể luyện bằng câu hỏi có sẵn. Đổi nguồn không làm mất khóa đã lưu.
        </p>
      </aside>
      <div className="grid min-w-0 gap-4">
        {notice ? (
          <p
            className={
              query.error
                ? "rounded-lg border border-danger/30 bg-card p-3 text-sm text-danger"
                : "rounded-lg border border-accent/30 bg-card p-3 text-sm text-accent"
            }
          >
            {notice}
          </p>
        ) : null}
        <AiSourcePicker
          selected={selected}
          model={savedModelId}
          savedModels={stored.models ?? {}}
          models={listed.models}
          listError={listed.error}
          hasKey={hasKey}
          geminiMask={geminiMask}
          groqMask={groqMask}
          openrouterMask={openrouterMask}
        />
        <p className="text-sm leading-6 text-muted lg:hidden">
          Chưa cấu hình xong thì bạn vẫn có thể luyện bằng câu hỏi có sẵn. Đổi nguồn không làm mất khóa đã lưu.
        </p>
      </div>
    </div>
  );
}
