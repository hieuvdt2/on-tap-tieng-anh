"use client";

import { useEffect, useId, useRef, useState } from "react";

export function TopicSelect({ topics }: { topics: { slug: string; label: string }[] }) {
  const [slug, setSlug] = useState(topics[0]?.slug ?? "");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = topics.find((topic) => topic.slug === slug);
  const needle = query.trim().toLowerCase();
  const matches = needle
    ? topics.filter((topic) => topic.label.toLowerCase().includes(needle))
    : topics;

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative min-w-0">
      <input type="hidden" name="topicSlug" value={slug} />
      <input
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        value={open ? query : selected?.label ?? ""}
        placeholder="Tìm chủ đề"
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          setQuery("");
          setOpen(true);
        }}
        className="h-11 w-full min-w-0 rounded-lg border border-line bg-background px-3"
      />
      {open ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-line bg-card p-1 shadow-lg"
        >
          {matches.length === 0 ? (
            <li className="px-3 py-2 text-sm text-muted">Không thấy chủ đề.</li>
          ) : (
            matches.map((topic) => (
              <li key={topic.slug}>
                <button
                  type="button"
                  role="option"
                  aria-selected={topic.slug === slug}
                  className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-background"
                  onClick={() => {
                    setSlug(topic.slug);
                    setQuery("");
                    setOpen(false);
                  }}
                >
                  {topic.label}
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
