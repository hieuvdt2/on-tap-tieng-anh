import { ExitButton } from "@/components/exit-button";
import { PendingLink } from "@/components/pending-link";
import { Button } from "@/components/ui/button";
import { getStudentId } from "@/lib/student";
import { getThemeStats } from "@/modules/vocabulary/queries";

export const dynamic = "force-dynamic";

export default async function VocabularyTopicsPage() {
  const themes = await getThemeStats(await getStudentId());
  return (
    <div className="grid gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="grid gap-1">
          <h1 className="font-serif text-4xl font-medium">Từ vựng theo chủ đề</h1>
          <p className="text-muted">Chọn một chủ đề để học từ mới hoặc luyện gõ riêng chủ đề đó.</p>
        </div>
        <ExitButton href="/vocabulary" />
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {themes.map((theme) => {
          const knownPercent = theme.total > 0 ? Math.round((theme.known / theme.total) * 100) : 0;
          const seenPercent = theme.total > 0 ? Math.round((theme.learned / theme.total) * 100) : 0;
          const learning = theme.learned - theme.known;
          const query = `theme=${theme.slug}`;
          return (
            <li key={theme.slug} className="grid gap-3 rounded-xl border border-line bg-card p-4">
              <div className="grid gap-1">
                <h2 className="font-medium">{theme.label}</h2>
                <p className="text-sm text-muted">
                  <strong className="text-foreground">Thuộc {theme.known}</strong>/{theme.total} · đang học {learning}
                </p>
              </div>
              <div className="relative h-2 overflow-hidden rounded-full bg-background" aria-hidden>
                <div className="absolute inset-y-0 left-0 rounded-full bg-accent/35" style={{ width: `${seenPercent}%` }} />
                <div className="absolute inset-y-0 left-0 rounded-full bg-accent" style={{ width: `${knownPercent}%` }} />
              </div>
              <div className="flex flex-wrap gap-2">
                {theme.learned < theme.total ? (
                  <Button asChild size="sm">
                    <PendingLink href={`/vocabulary/learn?${query}`} label="Đang mở…">Học từ mới</PendingLink>
                  </Button>
                ) : null}
                <Button asChild size="sm" variant="outline">
                  <PendingLink href={`/vocabulary/review?scope=any&mode=type&${query}`} label="Đang mở…">Gõ từ</PendingLink>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <PendingLink href={`/vocabulary/review?scope=any&mode=choice&${query}`} label="Đang mở…">Chọn nghĩa</PendingLink>
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
