import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { questions } from "@/db/schema";

export default async function OrderingPage() {
  const items = await db.select().from(questions).where(eq(questions.type, "ordering"));

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <h1 className="font-serif text-4xl font-medium">Sắp xếp câu</h1>
        <p className="max-w-2xl text-muted">
          Đưa các câu về đúng thứ tự. Bài được chấm khi chuỗi thứ tự khớp đáp án.
        </p>
      </div>
      <div className="grid gap-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/ordering/${item.id}`}
            className="rounded-xl border border-line bg-card px-5 py-4"
          >
            <p className="font-serif text-2xl">{item.stem}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
