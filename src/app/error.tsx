"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="grid max-w-xl gap-3">
      <h1 className="font-serif text-4xl">Không đọc được dữ liệu</h1>
      <p className="leading-7 text-muted">
        Postgres cần đang chạy, schema đã được đẩy, và dữ liệu mẫu đã được nạp.
      </p>
      <button
        type="button"
        onClick={reset}
        className="h-10 w-fit rounded-lg bg-accent px-4 text-sm text-accent-foreground"
      >
        Thử lại
      </button>
    </div>
  );
}
