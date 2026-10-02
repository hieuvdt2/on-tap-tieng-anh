"use client";

import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { moveItem } from "@/lib/move-item";

type Sentence = { id: string; text: string };

type Drag = {
  id: string;
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
};

export function SentenceOrder({
  sentences,
  order,
  onOrder,
}: {
  sentences: Sentence[];
  order: string[];
  onOrder: (order: string[]) => void;
}) {
  const listRef = useRef<HTMLOListElement>(null);
  const orderRef = useRef(order);
  const tops = useRef(new Map<string, number>());
  const placeRef = useRef<(id: string, clientY: number) => void>(() => {});
  const [drag, setDrag] = useState<Drag | null>(null);
  const byId = new Map(sentences.map((sentence) => [sentence.id, sentence]));
  const lifted = drag ? byId.get(drag.id) : null;

  useLayoutEffect(() => {
    const rows = listRef.current?.querySelectorAll<HTMLElement>("[data-sentence-id]") ?? [];
    rows.forEach((row) => {
      const id = row.dataset.sentenceId;
      if (!id || id === drag?.id) return;
      const previous = tops.current.get(id);
      const next = row.getBoundingClientRect().top;
      if (previous != null && previous !== next) {
        row.animate(
          [{ transform: `translateY(${previous - next}px)` }, { transform: "translateY(0)" }],
          { duration: 180, easing: "ease-out" },
        );
      }
      tops.current.set(id, next);
    });
  }, [order, drag?.id]);

  function rememberPositions() {
    const rows = listRef.current?.querySelectorAll<HTMLElement>("[data-sentence-id]") ?? [];
    rows.forEach((row) => {
      const id = row.dataset.sentenceId;
      if (id) tops.current.set(id, row.getBoundingClientRect().top);
    });
  }

  function indexAt(clientY: number) {
    const rows = [...(listRef.current?.querySelectorAll<HTMLElement>("[data-sentence-id]") ?? [])];
    let closest = 0;
    let distance = Number.POSITIVE_INFINITY;
    rows.forEach((row, index) => {
      const box = row.getBoundingClientRect();
      const delta = Math.abs(clientY - (box.top + box.height / 2));
      if (delta < distance) {
        distance = delta;
        closest = index;
      }
    });
    return closest;
  }

  function place(id: string, clientY: number) {
    const current = orderRef.current;
    const from = current.indexOf(id);
    const to = indexAt(clientY);
    if (from < 0 || from === to) return;
    rememberPositions();
    onOrder(moveItem(current, from, to));
  }

  function beginDrag(event: ReactPointerEvent<HTMLElement>, id: string) {
    if (event.button !== 0 || drag?.id === id) return;
    const row = event.currentTarget.closest<HTMLElement>("[data-sentence-id]");
    if (!row) return;
    const box = row.getBoundingClientRect();
    setDrag({
      id,
      x: event.clientX,
      y: event.clientY,
      offsetX: event.clientX - box.left,
      offsetY: event.clientY - box.top,
      width: box.width,
      height: box.height,
    });
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Some browsers only capture a real pointer.
    }
  }

  const draggingId = drag?.id ?? null;
  useEffect(() => {
    orderRef.current = order;
    placeRef.current = place;
  });

  useEffect(() => {
    if (!draggingId) return;
    const id = draggingId;
    function move(event: PointerEvent) {
      setDrag((current) => (current ? { ...current, x: event.clientX, y: event.clientY } : current));
      placeRef.current(id, event.clientY);
    }
    function release() {
      setDrag(null);
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", release);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", release);
    };
  }, [draggingId]);

  return (
    <div className="grid gap-2">
      <p className="text-sm text-muted">Giữ và kéo câu đến vị trí muốn đặt.</p>
      <ol ref={listRef} className="grid gap-2">
        {order.map((id, index) => {
          const sentence = byId.get(id);
          if (!sentence) return null;
          const active = drag?.id === id;
          return (
            <li
              key={id}
              data-sentence-id={id}
              tabIndex={active ? -1 : 0}
              aria-label={`Câu ${index + 1}. ${sentence.text}`}
              className={`flex items-start gap-3 rounded-xl border px-3 py-3 select-none sm:px-4 ${
                active
                  ? "border-dashed border-accent bg-accent/10"
                  : "border-line bg-card"
              }`}
              style={active ? { minHeight: drag.height } : undefined}
              onKeyDown={(event) => {
                if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
                event.preventDefault();
                const from = order.indexOf(id);
                const to = event.key === "ArrowUp" ? from - 1 : from + 1;
                rememberPositions();
                onOrder(moveItem(order, from, to));
              }}
            >
              {active ? (
                <p className="w-full py-1 text-center text-sm text-accent">Thả vào đây</p>
              ) : (
                <>
                  <button
                    type="button"
                    aria-label={`Kéo câu ${index + 1}`}
                    className="-m-2 grid size-11 shrink-0 touch-none cursor-grab place-items-center text-xs tracking-widest text-muted active:cursor-grabbing"
                    onPointerDown={(event) => beginDrag(event, id)}
                  >
                    ⋮⋮
                  </button>
                  <span className="mt-0.5 w-4 text-sm text-muted">{index + 1}</span>
                  <p className="flex-1 leading-6">{sentence.text}</p>
                </>
              )}
            </li>
          );
        })}
      </ol>
      {drag && lifted ? (
        <div
          className="pointer-events-none fixed z-50 flex scale-105 rotate-1 items-start gap-3 rounded-xl border border-accent bg-card px-4 py-3 shadow-2xl"
          style={{
            left: drag.x - drag.offsetX + 10,
            top: drag.y - drag.offsetY - 14,
            width: drag.width,
          }}
        >
          <span className="mt-1 text-xs tracking-widest text-accent" aria-hidden>
            ⋮⋮
          </span>
          <p className="flex-1 leading-6">{lifted.text}</p>
        </div>
      ) : null}
    </div>
  );
}
