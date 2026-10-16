import Link from "next/link";
import { PendingLink } from "@/components/pending-link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getStudentId } from "@/lib/student";
import { getTodaySummary, getVocabStats } from "@/modules/vocabulary/queries";

export const dynamic = "force-dynamic";

export default async function VocabularyPage() {
  const userId = await getStudentId();
  const [stats, today] = await Promise.all([getVocabStats(userId), getTodaySummary(userId)]);
  const lowBank = stats.unseen < 10;
  const newLeft = Math.max(0, today.newGoal - today.newDone);
  const newPercent = Math.min(100, Math.round((today.newDone / today.newGoal) * 100));
  // Việc nên làm tiếp: ôn từ đến hạn trước, rồi học từ mới cho đủ mục tiêu ngày.
  const next =
    today.due > 0
      ? { href: "/vocabulary/review?mode=choice", label: `Ôn ${today.due} từ đến hạn` }
      : newLeft > 0 && today.unseen > 0
        ? { href: "/vocabulary/learn", label: `Học ${Math.min(newLeft, 10)} từ mới` }
        : null;

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h1 className="font-serif text-4xl font-medium">Từ vựng</h1>
        <p className="max-w-2xl text-muted">
          Học từ mới mỗi ngày, ôn lại đúng lúc sắp quên. <strong>Đã thuộc {stats.known}</strong> · Đang học {stats.learning} ·
          Chưa học {stats.unseen} (tổng {stats.total} từ).
        </p>
        <p className="max-w-2xl text-sm text-muted">
          “Thuộc” nghĩa là bạn đã nhớ đúng qua ít nhất 3 lần ôn cách ngày, không chỉ mới xem hay vừa làm đúng bài kiểm tra.
        </p>
      </div>

      <section className="grid gap-4 rounded-xl border-2 border-accent bg-card p-5" aria-label="Hôm nay">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-serif text-2xl font-medium">Hôm nay</h2>
          <p className="text-sm font-medium">
            {today.streak > 0 ? `🔥 ${today.streak} ngày liên tiếp` : "Học hôm nay để bắt đầu chuỗi ngày"}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <p className="text-sm">
              Từ mới đã xem: <strong>{today.newDone}</strong>/{today.newGoal}
            </p>
            <div className="h-2 overflow-hidden rounded-full bg-background" aria-hidden>
              <div className="h-full rounded-full bg-accent" style={{ width: `${newPercent}%` }} />
            </div>
          </div>
          <p className="text-sm">
            Đã ôn hôm nay: <strong>{today.reviewsDone}</strong> lượt · Còn <strong>{today.due}</strong> từ đến hạn
          </p>
        </div>
        {next ? (
          <Button asChild className="w-full sm:w-fit">
            <PendingLink href={next.href} label="Đang mở…">{next.label}</PendingLink>
          </Button>
        ) : (
          <p className="text-sm font-medium text-accent">
            ✓ Hôm nay xong rồi. Muốn thì luyện thêm ở bên dưới.
          </p>
        )}
      </section>

      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Luyện tự do</CardTitle>
            <CardDescription>Luyện bất cứ lúc nào, không cần đến hạn. 15 từ mỗi lượt.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 pt-0">
            <Button asChild>
              <PendingLink href="/vocabulary/review?scope=any&mode=type" label="Đang mở…">Gõ từ tiếng Anh</PendingLink>
            </Button>
            <Button asChild variant="outline">
              <PendingLink href="/vocabulary/review?scope=any&mode=choice" label="Đang mở…">Chọn nghĩa</PendingLink>
            </Button>
            <Button asChild variant="outline">
              <PendingLink href="/vocabulary/review?scope=any&mode=listen" label="Đang mở…">Nghe và gõ</PendingLink>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Theo chủ đề</CardTitle>
            <CardDescription>Học và luyện từ theo từng nhóm: ăn uống, sức khỏe, công việc, du lịch…</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button asChild>
              <PendingLink href="/vocabulary/topics" label="Đang mở…">Chọn chủ đề</PendingLink>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Học từ mới</CardTitle>
            <CardDescription>
              {stats.unseen > 0 ? `Còn ${stats.unseen} từ chưa học. Mỗi lượt 10 từ.` : "Bạn đã xem hết từ trong kho. Ôn lại để nhớ lâu."}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {stats.unseen > 0 ? (
              <Button asChild variant="outline">
                <PendingLink href="/vocabulary/learn" label="Đang mở…">Học 10 từ</PendingLink>
              </Button>
            ) : (
              <Button disabled>Học 10 từ</Button>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ôn đến hạn</CardTitle>
            <CardDescription>
              {stats.due > 0
                ? `${stats.due} từ sắp quên, nên ôn ngay để nhớ lâu.`
                : "Chưa có từ đến hạn. Từ đã xem sẽ hiện ở đây đúng lúc cần ôn lại."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 pt-0">
            {stats.due > 0 ? (
              <>
                <Button asChild>
                  <PendingLink href="/vocabulary/review?mode=type" label="Đang mở…">Gõ từ tiếng Anh</PendingLink>
                </Button>
                <Button asChild variant="outline">
                  <PendingLink href="/vocabulary/review?mode=choice" label="Đang mở…">Chọn nghĩa</PendingLink>
                </Button>
              </>
            ) : (
              <Button disabled>Chưa có từ đến hạn</Button>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Từ đã đánh dấu</CardTitle>
            <CardDescription>
              {stats.marked > 0 ? `${stats.marked} từ bạn muốn luyện thêm.` : "Đánh dấu từ khó nhớ khi học hoặc ôn."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 pt-0">
            {stats.marked > 0 ? (
              <>
                <Button asChild>
                  <PendingLink href="/vocabulary/review?scope=marked&mode=type" label="Đang mở…">Gõ lại</PendingLink>
                </Button>
                <Button asChild variant="outline">
                  <PendingLink href="/vocabulary/marked" label="Đang mở…">Xem danh sách</PendingLink>
                </Button>
              </>
            ) : (
              <Button disabled>Chưa có từ</Button>
            )}
          </CardContent>
        </Card>
      </div>

      <p className="text-sm">
        <Link href="/vocabulary/stats" className="text-accent underline">Xem thống kê và từ hay sai</Link>
      </p>

      {lowBank ? (
        <p className="rounded-lg border border-line bg-card p-4 text-sm">
          Kho còn ít từ mới. <Link href="/ai-generator" className="text-accent underline">Tạo thêm từ vựng bằng AI</Link>.
        </p>
      ) : null}
    </div>
  );
}
