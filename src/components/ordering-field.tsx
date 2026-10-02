"use client";

import { useState } from "react";
import { SentenceOrder } from "@/components/sentence-order";

type Sentence = { id: string; text: string };

export function OrderingField({
  name,
  sentences,
}: {
  name: string;
  sentences: Sentence[];
}) {
  const [order, setOrder] = useState(sentences.map((sentence) => sentence.id));

  return (
    <div className="grid gap-2">
      <input type="hidden" name={name} value={order.join(",")} />
      <SentenceOrder sentences={sentences} order={order} onOrder={setOrder} />
    </div>
  );
}
