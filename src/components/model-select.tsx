"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ListedModel } from "@/modules/ai/list-models";

export function ModelSelect({
  models,
  initial,
  value,
  onChange,
}: {
  models: ListedModel[];
  initial: string;
  value?: string;
  onChange?: (id: string) => void;
}) {
  const [innerModel, setInnerModel] = useState(initial);
  const model = value ?? innerModel;

  function choose(id: string) {
    onChange?.(id);
    if (value === undefined) setInnerModel(id);
  }
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = models.find((item) => item.id === model);
  const needle = query.trim().toLowerCase();
  const matches = needle
    ? models.filter((item) => item.label.toLowerCase().includes(needle) || item.id.toLowerCase().includes(needle))
    : models;

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
      <input type="hidden" name="model" value={model} />
      <input
        role="combobox"
        aria-label="Model"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        value={open ? query : selected?.label ?? ""}
        placeholder={`Tìm trong ${models.length} model`}
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
      {selected && !open ? <p className="mt-1 truncate text-xs text-muted">{selected.id}</p> : null}
      {open ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-72 w-full overflow-y-auto overscroll-contain rounded-lg border border-line bg-card p-1 shadow-lg"
        >
          {matches.length === 0 ? (
            <li className="px-3 py-2 text-sm text-muted">Không thấy model.</li>
          ) : (
            matches.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={item.id === model}
                  className={
                    item.id === model
                      ? "grid w-full min-w-0 gap-0.5 rounded-md bg-background px-3 py-2 text-left"
                      : "grid w-full min-w-0 gap-0.5 rounded-md px-3 py-2 text-left hover:bg-background"
                  }
                  onClick={() => {
                    choose(item.id);
                    setQuery("");
                    setOpen(false);
                  }}
                >
                  <span className="truncate text-sm">{item.label}</span>
                  {item.label !== item.id ? <span className="truncate text-xs text-muted">{item.id}</span> : null}
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
