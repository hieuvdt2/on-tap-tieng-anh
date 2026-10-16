import Link from "next/link";
import { ExitButton } from "@/components/exit-button";
import { VocabLearn } from "@/components/vocab-learn";
import type { ReviewItem } from "@/components/vocab-review";
import { Button } from "@/components/ui/button";
import { getStudentId } from "@/lib/student";
import { distractorMeanings, nextNewWords, relativesOf } from "@/modules/vocabulary/queries";
import { parseThemeFilter, themeLabel } from "@/modules/vocabulary/themes";

export const dynamic = "force-dynamic";

function shuffle<T>(list: T[]) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default async function VocabLearnPage({ searchParams }: { searchParams: Promise<{ theme?: string }> }) {
  const theme = parseThemeFilter((await searchParams).theme);
  const words = await nextNewWords(await getStudentId(), 10, theme);
  const [distractors, relatives] = await Promise.all([distractorMeanings(words), relativesOf(words)]);
  const items: ReviewItem[] = words.map((word) => ({
    word,
    options: shuffle([word.meaningVi, ...(distractors[word.id] ?? [])]),
  }));
  return (
    <div className="mx-auto grid w-full max-w-2xl gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="grid gap-1">
          <h1 className="font-serif text-4xl font-medium">Học từ mới</h1>
          {theme ? <p className="text-muted">Chủ đề: {themeLabel(theme)}</p> : null}
        </div>
        <ExitButton href="/vocabulary" />
      </div>
      {words.length === 0 ? (
        <section className="grid gap-3 rounded-xl border border-line bg-card p-5">
          <p>{theme ? "Bạn đã học hết từ của chủ đề này." : "Bạn đã học hết từ trong kho. Tạo thêm từ mới để học tiếp."}</p>
          <Button asChild className="w-fit">
            <Link href="/ai-generator">Tạo từ vựng bằng AI</Link>
          </Button>
        </section>
      ) : (
        <VocabLearn items={items} relatives={relatives} theme={theme} />
      )}
    </div>
  );
}
