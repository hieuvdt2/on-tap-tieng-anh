import Image from "next/image";
import { registerAction } from "@/app/auth-actions";
import { FormPending } from "@/components/form-pending";
import { PendingLink } from "@/components/pending-link";
import { Button } from "@/components/ui/button";
import { hasClaimableLegacyAccount, redirectAuthenticatedUser } from "@/lib/auth";

const errors: Record<string, string> = {
  invalid: "Hãy nhập đủ thông tin. Tên đăng nhập gồm 3–32 ký tự a–z, số, dấu chấm, gạch dưới hoặc gạch ngang; mật khẩu cần ít nhất 8 ký tự.",
  duplicate: "Tên đăng nhập này đã được sử dụng.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await redirectAuthenticatedUser();
  const query = await searchParams;
  const willClaimLegacyData = await hasClaimableLegacyAccount();

  return (
    <div className="mx-auto grid max-w-md gap-6 pt-8">
      <div className="grid gap-2 text-center">
        <Image
          src="/assets/english-logo.png"
          alt="English"
          width={512}
          height={442}
          priority
          className="mx-auto mb-2 h-40 w-auto"
        />
        <h1 className="font-serif text-4xl font-medium">Tạo tài khoản</h1>
        <p className="leading-7 text-muted">
          {willClaimLegacyData
            ? "Tài khoản đầu tiên sẽ nhận lại toàn bộ tiến độ và dữ liệu đang có trên máy."
            : "Tiến độ, lịch sử làm bài và khóa AI sẽ được lưu riêng cho tài khoản này."}
        </p>
      </div>
      {query.error ? <p className="rounded-lg border border-danger/30 bg-card p-3 text-sm text-danger">{errors[query.error] ?? errors.invalid}</p> : null}
      <form action={registerAction} className="grid gap-4 rounded-xl border border-line bg-card p-5">
        <label className="grid gap-1.5 text-sm font-medium">
          Tên hiển thị
          <input
            name="displayName"
            required
            minLength={2}
            maxLength={50}
            autoComplete="name"
            className="h-11 rounded-lg border border-line bg-background px-3 font-normal"
          />
        </label>
        <label className="grid gap-1.5 text-sm font-medium">
          Tên đăng nhập
          <input
            name="username"
            required
            minLength={3}
            maxLength={32}
            pattern="[a-zA-Z0-9._-]+"
            autoCapitalize="none"
            autoComplete="username"
            className="h-11 rounded-lg border border-line bg-background px-3 font-normal"
          />
        </label>
        <label className="grid gap-1.5 text-sm font-medium">
          Mật khẩu
          <input
            name="password"
            type="password"
            required
            minLength={8}
            maxLength={128}
            autoComplete="new-password"
            className="h-11 rounded-lg border border-line bg-background px-3 font-normal"
          />
        </label>
        <Button type="submit">Tạo tài khoản</Button>
        <FormPending label="Đang tạo tài khoản…" />
      </form>
      <p className="flex min-h-11 items-center justify-center text-center text-sm text-muted">
        Đã có tài khoản?{" "}
        <PendingLink href="/login" label="Đang mở…" className="ml-1 inline-flex min-h-11 items-center text-accent underline-offset-2 hover:underline">Đăng nhập</PendingLink>
      </p>
    </div>
  );
}
