"use client";

import { useSyncExternalStore } from "react";

// Bật/tắt hiển thị phiên âm cho cả app, nhớ theo trình duyệt (localStorage). Mặc định: bật.
const KEY = "vocab-show-ipa";
const EVENT = "vocab-ipa-change";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

function snapshot() {
  try {
    return window.localStorage.getItem(KEY) !== "0";
  } catch {
    return true;
  }
}

export function useShowIpa() {
  return useSyncExternalStore(subscribe, snapshot, () => true);
}

/** Phiên âm dạng " · /ˈæpl/" (có dấu phân cách ở đầu); không hiện gì nếu tắt hoặc từ chưa có phiên âm. */
export function IpaText({ ipa }: { ipa: string | null | undefined }) {
  const show = useShowIpa();
  if (!ipa || !show) return null;
  return <span> · /{ipa.replace(/^\/|\/$/g, "")}/</span>;
}

export function IpaToggle() {
  const show = useShowIpa();
  function toggle() {
    try {
      window.localStorage.setItem(KEY, show ? "0" : "1");
    } catch {
      // Không lưu được thì thôi: lần sau mở lại sẽ về mặc định.
    }
    window.dispatchEvent(new Event(EVENT));
  }
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={show}
      className="inline-flex min-h-10 items-center rounded-lg border border-line px-3 text-sm text-muted hover:text-foreground"
    >
      Phiên âm: {show ? "Bật" : "Tắt"}
    </button>
  );
}
