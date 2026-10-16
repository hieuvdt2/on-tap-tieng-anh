import Link from "next/link";
import { ExitButton } from "@/components/exit-button";
import { IpaText, IpaToggle } from "@/components/ipa-toggle";
import { MarkButton } from "@/components/mark-button";
import { PendingLink } from "@/components/pending-link";
import { SpeakButton } from "@/components/speak-button";
import { Button } from "@/components/ui/button";
import { getStudentId } from "@/lib/student";
import { markedWords } from "@/modules/vocabulary/queries";

export const dynamic = "force-dynamic";

export default async function MarkedVocabularyPage() {
  const words = await markedWords(await getStudentId());
  return (
    <div className="mx-auto grid w-full max-w-3xl gap-4">
      <div className="flex items-start justify-between gap-3">
        <h1 className="font-serif text-4xl font-medium">Từ đã đánh dấu</h1>
        <ExitButton href="/vocabulary" />
      </div>
      {words.length === 0 ? (
        <section className="grid gap-3 rounded-xl border border-line bg-card p-5">
          <p>Chưa có từ nào. Bấm “Đánh dấu” khi học hoặc ôn để lưu những từ khó nhớ.</p>
          <Button asChild className="w-fit">
            <Link href="/vocabulary/learn">Học từ mới</Link>
          </Button>
        </section>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            <IpaToggle />
            <Button asChild>
              <PendingLink href="/vocabulary/review?scope=marked&mode=type" label="Đang mở…">
                Gõ lại {Math.min(words.length, 15)} từ
              </PendingLink>
            </Button>
            <Button asChild variant="outline">
              <PendingLink href="/vocabulary/review?scope=marked&mode=choice" label="Đang mở…">
                Chọn nghĩa
              </PendingLink>
            </Button>
          </div>
          <ul className="grid gap-2">
            {words.map((word) => (
              <li key={word.id} className="grid gap-2 rounded-xl border border-line bg-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <p className="font-serif text-2xl font-medium">{word.headword}</p>
                    <SpeakButton text={word.headword} />
                    <span className="text-sm text-muted">
                      {word.wordClass}
                      <IpaText ipa={word.ipa} />
                    </span>
                  </div>
                  <MarkButton wordId={word.id} initial />
                </div>
                <p className="font-medium text-accent">{word.meaningVi}</p>
                {word.example ? <p className="text-sm leading-6">“{word.example}”</p> : null}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
