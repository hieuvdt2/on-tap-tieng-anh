import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ChangeModelLink({
  error,
  returnTo,
}: {
  error: string | null | undefined;
  returnTo?: string;
}) {
  // Hiện cho mọi lỗi tạo đề (trước đây chỉ hiện khi thông báo chứa "model khác", nên lỗi
  // timeout — ví dụ OpenRouter phản hồi quá lâu — không có đường nào để đổi nguồn/model).
  if (!error) return null;
  const href = returnTo ? `/account/settings?returnTo=${encodeURIComponent(returnTo)}` : "/account/settings";
  return (
    <Button asChild variant="outline">
      <Link href={href}>Chọn model khác</Link>
    </Button>
  );
}
