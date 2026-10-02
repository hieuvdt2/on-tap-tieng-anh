import Link from "next/link";
import { AiSourcePicker } from "@/components/ai-source-picker";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { chosenProvider } from "@/modules/ai/provider";
import { readStoredAI } from "@/modules/ai/settings";

function maskKey(key: string) {
  return `••••••••${key.slice(-4)}`;
}

export default async function AccountSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; cleared?: string; error?: string }>;
}) {
  const query = await searchParams;
  const user = await requireUser();
  const stored = await readStoredAI(user.id);
  const selected = chosenProvider(stored);
  const geminiMask = stored.geminiApiKey?.trim() ? maskKey(stored.geminiApiKey.trim()) : null;
  const groqMask = stored.groqApiKey?.trim() ? maskKey(stored.groqApiKey.trim()) : null;
  const openrouterMask = stored.openrouterApiKey?.trim() ? maskKey(stored.openrouterApiKey.trim()) : null;
  const selectedMask =
    selected === "groq" ? groqMask : selected === "gemini" ? geminiMask : selected === "openrouter" ? openrouterMask : null;

  const notice = query.saved
    ? "Đã lưu khóa."
    : query.cleared
      ? "Đã xóa khóa. Bài luyện dùng lại câu có sẵn cho đến khi có khóa mới."
      : query.error
        ? selectedMask
          ? "Khóa mới chưa đúng dạng. Khóa cũ vẫn được giữ."
          : "Khóa chưa đúng dạng. Hãy copy cả chuỗi khóa rồi dán lại."
        : null;

  return (
    <div className="grid max-w-xl gap-6">
      <div className="grid gap-2">
        <p className="text-sm text-muted">Cấu hình</p>
        <h1 className="font-serif text-4xl font-medium">Nguồn AI</h1>
        <p className="leading-7 text-muted">
          Chọn nguồn dùng để tạo câu và giải thích. Bấm một nguồn sẽ mở trang tạo khóa ở tab mới. Khóa được mã hóa và chỉ gắn với tài khoản này.
        </p>
        <Button asChild variant="outline" className="mt-2 w-fit">
          <Link href="/account/api-key-guide">Xem hướng dẫn tạo khóa</Link>
        </Button>
      </div>
      {notice ? (
        <p className={query.error ? "text-sm text-danger" : "text-sm text-accent"}>{notice}</p>
      ) : null}
      <AiSourcePicker
        selected={selected}
        geminiMask={geminiMask}
        groqMask={groqMask}
        openrouterMask={openrouterMask}
      />
      <p className="text-sm text-muted">
        Nguồn đang chọn chưa có khóa thì luyện dùng câu có sẵn. Đổi nguồn không xóa khóa đã lưu.
      </p>
    </div>
  );
}
