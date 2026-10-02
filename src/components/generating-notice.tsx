import Image from "next/image";

export function GeneratingNotice() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 grid place-items-center bg-background/85 p-6 backdrop-blur-sm"
    >
      <div className="grid w-full max-w-sm justify-items-center gap-5">
        <Image
          src="/assets/generating.png"
          alt="Đang tạo đề. Please wait."
          width={1129}
          height={1452}
          priority
          className="h-auto max-h-[62vh] w-auto"
        />
        <div className="flex w-full items-center gap-4 rounded-xl border border-line bg-card px-4 py-3">
          <span className="relative grid size-12 shrink-0 place-items-center">
            <span className="absolute inset-0 animate-spin rounded-full border-4 border-line border-t-accent" />
            <span className="size-5 animate-pulse rounded-md bg-line" />
          </span>
          <span className="grid flex-1 gap-2">
            <span className="h-3 w-full animate-pulse rounded-full bg-line" />
            <span className="h-3 w-2/3 animate-pulse rounded-full bg-line" />
            <span className="text-sm font-medium">Đang tạo đề…</span>
          </span>
        </div>
      </div>
    </div>
  );
}
