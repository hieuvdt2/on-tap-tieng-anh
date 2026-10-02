import { PendingLink } from "@/components/pending-link";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { stimuli } from "@/db/schema";

export default async function ReadingPage() {
  const passages = await db.select().from(stimuli).where(eq(stimuli.kind, "passage"));

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <h1 className="font-serif text-4xl font-medium">Đọc hiểu</h1>
        <p className="max-w-2xl text-muted">
          Mỗi đoạn hiện một lần. Bốn câu hỏi nằm phía dưới, chấm riêng từng câu.
        </p>
      </div>
      <div className="grid gap-3">
        {passages.map((passage) => (
          <PendingLink
            key={passage.id}
            href={`/reading/${passage.id}`}
            label="Đang mở bài đọc…"
            className="rounded-xl border border-line bg-card px-5 py-4"
          >
            <p className="font-serif text-2xl">{passage.title}</p>
            <p className="text-sm text-muted">{passage.wordCount} từ</p>
          </PendingLink>
        ))}
      </div>
    </div>
  );
}
