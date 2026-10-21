import Image from "next/image";
import { cn } from "@/lib/utils";

/** Khung ảnh mèo hướng dẫn, dùng chung cho mọi tin nhắn để đồng bộ kích thước. */
function GuideAvatar() {
  return (
    <div className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-2xl border border-line bg-card sm:size-12">
      <Image src="/assets/cat-reading.png" alt="" aria-hidden width={574} height={641} className="h-9 w-auto sm:h-10" />
    </div>
  );
}

const TONE_CLASS = {
  neutral: "border-line bg-card",
  success: "border-accent/30 bg-accent/5",
  danger: "border-danger/30 bg-danger/5",
} as const;

const TONE_TITLE_CLASS = {
  neutral: "text-muted",
  success: "text-accent",
  danger: "text-danger",
} as const;

export type GuideTone = keyof typeof TONE_CLASS;

/**
 * Một đoạn kiến thức trình bày như tin nhắn của "bạn mèo hướng dẫn", thay vì một khối chữ trong trang
 * tài liệu. Dùng cho phần luôn mở (không thu gọn được); xem Collapse (components/collapse.tsx) cho
 * phần có thể thu gọn — cùng avatar, cùng kiểu bong bóng.
 */
export function GuideMessage({
  title,
  tone = "neutral",
  index = 0,
  children,
}: {
  title: string;
  tone?: GuideTone;
  index?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="lesson-section-in flex items-start gap-3" style={{ animationDelay: `${index * 90}ms` }}>
      <GuideAvatar />
      <div className={cn("min-w-0 max-w-2xl grow rounded-2xl rounded-tl-sm border px-4 py-3.5", TONE_CLASS[tone])}>
        <h2 className={cn("text-xs font-medium tracking-[0.14em] uppercase", TONE_TITLE_CLASS[tone])}>{title}</h2>
        <div className="mt-1.5 text-base leading-7">{children}</div>
      </div>
    </div>
  );
}

export { GuideAvatar };
