import Image from "next/image";
import Link from "next/link";
import { loginAction } from "@/app/auth-actions";
import { Button } from "@/components/ui/button";
import { redirectAuthenticatedUser, safeNextPath } from "@/lib/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  await redirectAuthenticatedUser();
  const query = await searchParams;
  const next = safeNextPath(query.next);

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
        <h1 className="font-serif text-4xl font-medium">Đăng nhập</h1>
        <p className="leading-7 text-muted">Tiếp tục bài học, đề thi và tiến độ của riêng bạn.</p>
      </div>
      {query.error ? <p className="rounded-lg border border-danger/30 bg-card p-3 text-sm text-danger">Tên đăng nhập hoặc mật khẩu chưa đúng.</p> : null}
      <form action={loginAction} className="grid gap-4 rounded-xl border border-line bg-card p-5">
        <input type="hidden" name="next" value={next} />
        <label className="grid gap-1.5 text-sm font-medium">
          Tên đăng nhập
          <input
            name="username"
            required
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
            autoComplete="current-password"
            className="h-11 rounded-lg border border-line bg-background px-3 font-normal"
          />
        </label>
        <Button type="submit">Đăng nhập</Button>
      </form>
      <p className="flex min-h-11 items-center justify-center text-center text-sm text-muted">
        Chưa có tài khoản?{" "}
        <Link href="/register" className="ml-1 inline-flex min-h-11 items-center text-accent underline-offset-2 hover:underline">Đăng ký</Link>
      </p>
    </div>
  );
}
