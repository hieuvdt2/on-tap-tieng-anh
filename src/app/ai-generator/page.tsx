import Image from "next/image";
import Link from "next/link";
import { GenerationSubmitButton } from "@/components/generation-submit-button";
import { PendingLink } from "@/components/pending-link";
import { TopicSelect } from "@/components/topic-select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { activeAI } from "@/modules/ai/provider";
import { continueAIGeneration, startAIGeneration } from "@/modules/ai/generator-actions";
import { getGenerationJob, listGenerationJobs } from "@/modules/ai/generator";
import { readStoredAI } from "@/modules/ai/settings";
import { getStudentId } from "@/lib/student";
import { getTopicProgress } from "@/modules/learning/profile";
import { topicLabel } from "@/lib/topic-names";

const errors: Record<string, string> = {
  invalid: "Lựa chọn tạo đề không hợp lệ.",
  topic: "Không tìm thấy chủ đề đã chọn.",
  "no-review": "Bạn chưa có câu trả lời sai để AI tạo bài ôn lỗi.",
};

const cards = [
  {
    kind: "reading",
    title: "Đọc",
    description: "Một bài đọc nguyên bản 280–380 từ và 4 câu hỏi. Lưu vào kho Đọc.",
    button: "Tạo bài đọc",
  },
  {
    kind: "ordering",
    title: "Sắp xếp",
    description: "5 bài sắp xếp hội thoại hoặc đoạn văn. Lưu vào kho Sắp xếp.",
    button: "Tạo bài sắp xếp",
  },
  {
    kind: "review",
    title: "Ôn lỗi",
    description: "10 câu mới cùng kiến thức với các lỗi gần đây, không sao chép câu cũ.",
    button: "Tạo bài ôn lỗi",
  },
  {
    kind: "diagnostic",
    title: "Chẩn đoán",
    description: "16 câu hoàn toàn mới phủ nhiều chủ đề, sau đó mở phiên chẩn đoán.",
    button: "Tạo đề chẩn đoán",
  },
  {
    kind: "exam",
    title: "Thi thử 40 câu",
    description: "Đề 40 câu, 50 phút. Làm từ phần leaflet 6 chỗ trống, bấm Next để sang phần sau. Các phần còn lại được tạo trong lúc bạn đang làm.",
    button: "Bắt đầu tạo đề",
  },
] as const;

function JobProgress({
  job,
}: {
  job: NonNullable<Awaited<ReturnType<typeof getGenerationJob>>>;
}) {
  const progress = Math.min(100, Math.round((job.questionIds.length / job.targetCount) * 100));
  return (
    <section className="grid gap-4 rounded-xl border border-accent/40 bg-card p-5">
      {job.status !== "completed" ? (
        <Image
          src="/assets/generating.png"
          alt="Đang tạo đề. Please wait."
          width={1129}
          height={1452}
          className="mx-auto h-auto max-h-80 w-auto"
        />
      ) : null}
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="text-xs font-medium tracking-[0.14em] text-muted uppercase">Đang tạo</p>
          <h2 className="font-serif text-2xl">{job.kind === "exam" ? "Thi thử 40 câu" : "Bài luyện AI"}</h2>
        </div>
        <p className="font-medium text-accent">{job.questionIds.length}/{job.targetCount} câu</p>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-background">
        <div className="h-full rounded-full bg-accent" style={{ width: `${progress}%` }} />
      </div>
      <p className="text-sm text-muted">
        Đề được tạo từng phần ngắn. Phần đã đạt kiểm tra được lưu ngay và trang tự chuyển sang phần tiếp theo.
      </p>
      {job.error ? <p className="text-sm text-danger">{job.error}</p> : null}
      {job.status !== "completed" ? (
        <form action={continueAIGeneration}>
          <input type="hidden" name="jobId" value={job.id} />
          <GenerationSubmitButton
            autoKey={job.kind === "exam" || job.error ? undefined : `${job.id}:${job.step}`}
            pendingText="Đang tạo phần tiếp theo…"
          >
            Tiếp tục tạo
          </GenerationSubmitButton>
        </form>
      ) : null}
    </section>
  );
}

export default async function AIGeneratorPage({
  searchParams,
}: {
  searchParams: Promise<{ job?: string; error?: string }>;
}) {
  const query = await searchParams;
  const userId = await getStudentId();
  const [stored, topics, recent] = await Promise.all([
    readStoredAI(),
    getTopicProgress(userId),
    listGenerationJobs(userId),
  ]);
  const ai = activeAI(stored);
  const currentJob = query.job ? await getGenerationJob(query.job, userId) : null;
  const availableTopics = topics.filter((topic) => topic.skill === "grammar" || topic.skill === "vocabulary");

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h1 className="font-serif text-4xl font-medium">Tạo đề AI</h1>
        <p className="max-w-2xl leading-7 text-muted">
          Chọn một mẫu. Câu đạt kiểm tra được lưu vào kho để dùng lại khi hết token. Nội dung AI trong app không phải đề chính thức.
        </p>
        <p className="text-sm">
          Nguồn hiện tại:{" "}
          {ai ? <strong>{ai.choice === "gemini" ? "Gemini" : ai.choice === "groq" ? "Groq" : "OpenRouter"}</strong> : <span className="text-danger">chưa chọn</span>}
          {ai ? ` · ${ai.model}${ai.modelChosen ? "" : " (mặc định)"}` : ""}
          {ai?.ready ? " · đã lưu khóa" : " · chưa có khóa"}
        </p>
      </div>

      {!ai?.ready ? (
        <p className="rounded-lg border border-warning/40 bg-card p-4 text-sm">
          Hãy <Link href="/account/settings" className="text-accent underline">chọn nguồn AI và lưu khóa</Link> trước khi tạo.
        </p>
      ) : !ai.modelChosen ? (
        <p className="rounded-lg border border-line bg-card p-4 text-sm">
          Bạn chưa chọn model cho nguồn này nên app đang dùng model mặc định.{" "}
          <Link href="/account/settings" className="text-accent underline">Chọn model</Link>
        </p>
      ) : null}
      {query.error ? <p className="text-sm text-danger">{errors[query.error] ?? "Không tạo được đề."}</p> : null}
      {currentJob ? <JobProgress job={currentJob} /> : null}

      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Luyện theo chủ đề</CardTitle>
            <CardDescription>10 câu mới cho một chủ đề ngữ pháp hoặc từ vựng.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <form action={startAIGeneration} className="grid gap-3">
              <input type="hidden" name="kind" value="practice" />
              <label className="grid gap-1 text-sm">
                Chủ đề
                <TopicSelect topics={availableTopics.map((topic) => ({ slug: topic.slug, label: topicLabel(topic.name) }))} />
              </label>
              <GenerationSubmitButton>Tạo 10 câu</GenerationSubmitButton>
            </form>
          </CardContent>
        </Card>

        {cards.map((card) => (
          <Card key={card.kind}>
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <form action={startAIGeneration}>
                <input type="hidden" name="kind" value={card.kind} />
                <GenerationSubmitButton variant={card.kind === "exam" ? "default" : "outline"}>
                  {card.button}
                </GenerationSubmitButton>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>

      {recent.length > 0 ? (
        <section className="grid gap-2">
          <h2 className="font-serif text-2xl">Lần tạo gần đây</h2>
          <ul className="grid gap-2 text-sm">
            {recent.map((job) => (
              <li key={job.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line bg-card px-4 py-3">
                <span>{job.kind} · {job.questionIds.length}/{job.targetCount} câu · {job.status}</span>
                {job.kind === "exam" && job.config.examSessionId ? (
                  <PendingLink className="text-accent underline" href={`/mock-exam/${job.config.examSessionId}?part=1`} label="Đang mở đề…">Làm tiếp</PendingLink>
                ) : job.status !== "completed" ? (
                  <PendingLink className="text-accent underline" href={`/ai-generator?job=${job.id}`} label="Đang mở…">Mở lại</PendingLink>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
