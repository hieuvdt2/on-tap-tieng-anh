import { AiSourcePicker } from "@/components/ai-source-picker";
import { requireUser } from "@/lib/auth";
import { listStoredModels } from "@/modules/ai/list-models";
import { modelFor, sharedAIAvailable } from "@/modules/ai/provider";
import { readStoredAI } from "@/modules/ai/settings";
import { sharedDailyLimit } from "@/modules/ai/shared-limit";
import { sharedUsedToday } from "@/modules/ai/shared-quota";

function maskKey(key: string) {
  return `••••••••${key.slice(-4)}`;
}

function sanitizeReturnTo(raw: string | undefined) {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return null;
  return raw;
}

export default async function AccountSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; cleared?: string; error?: string; model?: string; returnTo?: string }>;
}) {
  const query = await searchParams;
  const returnTo = sanitizeReturnTo(query.returnTo);
  const user = await requireUser();
  const stored = await readStoredAI(user.id);
  const selected = stored.provider;
  const geminiMask = stored.geminiApiKey?.trim() ? maskKey(stored.geminiApiKey.trim()) : null;
  const groqMask = stored.groqApiKey?.trim() ? maskKey(stored.groqApiKey.trim()) : null;
  const openrouterMask = stored.openrouterApiKey?.trim() ? maskKey(stored.openrouterApiKey.trim()) : null;
  const selectedMask =
    selected === "groq"
      ? groqMask
      : selected === "gemini"
        ? geminiMask
        : selected === "openrouter"
          ? openrouterMask
          : selected === "openai" && sharedAIAvailable()
            ? "Khóa dùng chung của ứng dụng"
            : null;
  const listed = selected ? await listStoredModels(selected, stored) : { models: [], error: null };
  const hasKey = Boolean(selectedMask);
  const savedModelId = selected ? stored.models?.[selected] ?? null : null;
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
    <div className="mx-auto grid w-full max-w-2xl gap-4">
      <div className="grid gap-2">
        <h1 className="font-serif text-4xl font-medium">Thiết lập AI</h1>
        <p className="leading-7 text-muted">
          Chọn cách kết nối AI để tạo đề. Chưa thiết lập thì bạn vẫn luyện được bằng câu hỏi có sẵn.
        </p>
      </div>
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
        models={listed.models}
        listError={listed.error}
        hasKey={hasKey}
        activeModel={selected ? modelFor(selected, stored) : null}
        geminiMask={geminiMask}
        groqMask={groqMask}
        openrouterMask={openrouterMask}
        shared={sharedAIAvailable() ? { limit: sharedDailyLimit(), used: await sharedUsedToday(user.id) } : null}
        justSaved={Boolean(query.saved || query.model)}
        returnTo={returnTo}
      />
    </div>
  );
}
