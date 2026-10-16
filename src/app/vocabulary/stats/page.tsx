import { ExitButton } from "@/components/exit-button";
import { PendingLink } from "@/components/pending-link";
import { Button } from "@/components/ui/button";
import { getStudentId } from "@/lib/student";
import { getDetailedStats, getVocabStats } from "@/modules/vocabulary/queries";

export const dynamic = "force-dynamic";

export default async function VocabularyStatsPage() {
  const userId = await getStudentId();
  const [stats, detail] = await Promise.all([getVocabStats(userId), getDetailedStats(userId)]);
  const peak = Math.max(1, ...detail.forecast.map((day) => day.count));

  return (
    <div className="mx-auto grid w-full max-w-3xl gap-5">
      <div className="flex items-start justify-between gap-3">
        <h1 className="font-serif text-4xl font-medium">Thống kê từ vựng</h1>
        <ExitButton href="/vocabulary" />
      </div>

      <section className="grid gap-3 sm:grid-cols-4">
        <div className="rounded-xl border-2 border-accent bg-card p-4">
          <p className="text-sm text-muted">Đã thuộc</p>
          <p className="text-2xl font-semibold">{stats.known}</p>
        </div>
        <div className="rounded-xl border border-line bg-card p-4">
          <p className="text-sm text-muted">Đang học</p>
          <p className="text-2xl font-semibold">{stats.learning}</p>
        </div>
        <div className="rounded-xl border border-line bg-card p-4">
          <p className="text-sm text-muted">Chưa học</p>
          <p className="text-2xl font-semibold">{stats.unseen}</p>
        </div>
        <div className="rounded-xl border border-line bg-card p-4">
          <p className="text-sm text-muted">Tỉ lệ nhớ đúng</p>
          <p className="text-2xl font-semibold">{detail.accuracy === null ? "—" : `${detail.accuracy}%`}</p>
          <p className="text-xs text-muted">{detail.answered} lượt trả lời</p>
        </div>
      </section>
      <p className="-mt-2 text-sm text-muted">
        Đang học: đã xem nhưng chưa nhớ vững, còn phải ôn lại. Đã thuộc: nhớ đúng qua ít nhất 3 lần ôn cách ngày.
      </p>

      <section className="grid gap-3 rounded-xl border border-line bg-card p-4">
        <h2 className="font-medium">Từ đến hạn ôn trong 7 ngày tới</h2>
        <ul className="grid gap-2">
          {detail.forecast.map((day) => (
            <li key={day.label} className="grid grid-cols-[5.5rem_1fr_2.5rem] items-center gap-3 text-sm">
              <span className="text-muted">{day.label}</span>
              <div className="h-3 overflow-hidden rounded-full bg-background" aria-hidden>
                <div className="h-full rounded-full bg-accent" style={{ width: `${(day.count / peak) * 100}%` }} />
              </div>
              <span className="text-right font-medium">{day.count}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-3 rounded-xl border border-line bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-medium">Từ hay sai</h2>
          {detail.hard.length > 0 ? (
            <Button asChild size="sm">
              <PendingLink href="/vocabulary/review?scope=hard&mode=type" label="Đang mở…">Luyện gõ các từ này</PendingLink>
            </Button>
          ) : null}
        </div>
        {detail.hard.length === 0 ? (
          <p className="text-sm text-muted">Chưa có từ nào sai từ 2 lần trở lên.</p>
        ) : (
          <ul className="grid gap-2">
            {detail.hard.map((word) => (
              <li key={word.id} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-2 last:border-0">
                <span>
                  <strong>{word.headword}</strong> <span className="text-sm text-muted">{word.meaningVi}</span>
                </span>
                <span className="text-sm text-muted">
                  sai {word.wrong} · đúng {word.correct}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
