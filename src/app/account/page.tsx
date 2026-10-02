import Link from "next/link";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";

export default async function AccountPage() {
  const user = await requireUser();

  return (
    <div className="grid max-w-xl gap-6">
      <div className="grid gap-2">
        <p className="text-sm text-muted">Tài khoản</p>
        <h1 className="font-serif text-4xl font-medium">{user.displayName}</h1>
      </div>
      <dl className="grid gap-4 rounded-xl border border-line bg-card p-5">
        <div className="grid gap-1">
          <dt className="text-sm text-muted">Tên hiển thị</dt>
          <dd className="font-medium">{user.displayName}</dd>
        </div>
        <div className="grid gap-1">
          <dt className="text-sm text-muted">Tên đăng nhập</dt>
          <dd className="font-medium">{user.username ? `@${user.username}` : "Chưa đặt"}</dd>
        </div>
      </dl>
      <p className="leading-7 text-muted">
        Tiến độ, lịch sử làm bài và khóa AI chỉ thuộc tài khoản này. Kho câu hỏi vẫn dùng chung cho mọi người.
      </p>
      <Button asChild variant="outline" className="w-fit">
        <Link href="/account/settings">Mở cấu hình AI</Link>
      </Button>
    </div>
  );
}
