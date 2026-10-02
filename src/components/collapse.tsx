import { cn } from "@/lib/utils";

export function Collapse({
  title,
  defaultOpen = false,
  className,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <details open={defaultOpen} className={cn("group border-t border-line", className)}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-4 [&::-webkit-details-marker]:hidden">
        <h2 className="text-xs font-medium tracking-[0.14em] text-muted uppercase group-open:text-foreground">
          {title}
        </h2>
        <svg
          viewBox="0 0 20 20"
          aria-hidden
          className="size-4 shrink-0 text-muted transition-transform group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <div className="max-w-2xl pb-5 text-base leading-7">{children}</div>
    </details>
  );
}
