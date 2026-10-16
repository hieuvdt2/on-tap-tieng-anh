"use client";

// Đọc to từ bằng giọng của trình duyệt. Không có hỗ trợ thì ẩn nút, không báo lỗi.
export function SpeakButton({ text }: { text: string }) {
  function speak() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
  return (
    <button
      type="button"
      onClick={speak}
      aria-label={`Nghe phát âm: ${text}`}
      className="grid size-10 place-items-center rounded-lg border border-line text-muted hover:text-foreground"
    >
      <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 10v4h4l5 4V6L8 10H4Z" />
        <path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" />
      </svg>
    </button>
  );
}
