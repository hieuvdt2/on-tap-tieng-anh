import Link from "next/link";
import { ExitButton } from "@/components/exit-button";
import { VocabReview, type ReviewItem } from "@/components/vocab-review";
import { VocabTyping } from "@/components/vocab-typing";
import { Button } from "@/components/ui/button";
import { getStudentId } from "@/lib/student";
import { parseThemeFilter, themeLabel } from "@/modules/vocabulary/themes";
import { anyForPractice, distractorMeanings, dueWords, hardForPractice, learnedForPractice, markedForPractice } from "@/modules/vocabulary/queries";

export const dynamic = "force-dynamic";

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default async function VocabReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; scope?: string; theme?: string }>;
}) {
  const query = await searchParams;
  const mode = query.mode === "type" ? "type" : query.mode === "listen" ? "listen" : "choice";
  const scope = ["marked", "learned", "recent", "any", "hard"].includes(query.scope ?? "")
    ? (query.scope as "marked" | "learned" | "recent" | "any" | "hard")
    : "due";
  const theme = parseThemeFilter(query.theme);
  const userId = await getStudentId();
  const words =
    scope === "marked"
      ? await markedForPractice(userId, 15)
      : scope === "learned"
        ? await learnedForPractice(userId, 15, false, theme)
        : scope === "hard"
          ? await hardForPractice(userId, 15)
          : scope === "recent"
          ? await learnedForPractice(userId, 10, true, theme)
          : scope === "any"
            ? await anyForPractice(userId, 15, theme)
            : await dueWords(userId, 15, theme);
  const items: ReviewItem[] =
    mode === "choice" && words.length > 0
      ? await distractorMeanings(words).then((distractors) =>
          words.map((word) => ({ word, options: shuffle([word.meaningVi, ...(distractors[word.id] ?? [])]) })),
        )
      : [];

  const modeLabel = mode === "type" ? "gõ từ tiếng Anh" : mode === "listen" ? "nghe và gõ" : "chọn nghĩa";
  const title = `${scope === "marked" ? "Luyện từ đã đánh dấu" : scope === "due" ? "Ôn từ" : scope === "any" ? "Luyện tự do" : scope === "hard" ? "Luyện từ hay sai" : "Luyện từ đã học"} · ${modeLabel}`;
  return (
    <div className="mx-auto grid w-full max-w-2xl gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="grid gap-1">
          <h1 className="font-serif text-3xl font-medium sm:text-4xl">{title}</h1>
          {theme ? <p className="text-muted">Chủ đề: {themeLabel(theme)}</p> : null}
        </div>
        <ExitButton href="/vocabulary" />
      </div>
      {words.length === 0 ? (
        <section className="grid gap-3 rounded-xl border border-line bg-card p-5">
          <p>
            {scope === "marked"
              ? "Bạn chưa đánh dấu từ nào. Bấm “Đánh dấu” khi học hoặc ôn để lưu từ cần luyện thêm."
              : scope === "hard"
                ? "Chưa có từ nào bạn hay sai. Cứ luyện tiếp nhé."
                : scope === "due"
                ? "Chưa có từ nào đến hạn ôn. Quay lại sau hoặc học thêm từ mới."
                : "Bạn chưa học từ nào. Học vài từ rồi quay lại luyện."}
          </p>
          <Button asChild className="w-fit">
            <Link href="/vocabulary/learn">Học từ mới</Link>
          </Button>
        </section>
      ) : mode === "type" || mode === "listen" ? (
        <VocabTyping words={words} mode={mode === "listen" ? "listen" : "meaning"} />
      ) : (
        <VocabReview items={items} />
      )}
    </div>
  );
}
