import Image from "next/image";
import Link from "next/link";
import { DifficultyPicker } from "@/components/difficulty-picker";
import { ChangeModelLink } from "@/components/change-model-link";
import { GenerationSubmitButton } from "@/components/generation-submit-button";
import { PendingLink } from "@/components/pending-link";
import { TopicSelect } from "@/components/topic-select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SourceSwitchOffer } from "@/components/source-switch-offer";
import { activeAI, fallbackSources, SOURCE_LABELS } from "@/modules/ai/provider";
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

const KIND_LABELS: Record<string, string> = {
  practice: "Luyện theo chủ đề",
  reading: "Đọc",
  ordering: "Sắp xếp",
  review: "Ôn lỗi",
  diagnostic: "Chẩn đoán",
  vocabulary: "Từ vựng",
  exam: "Thi thử 40 câu",
};

const cards = [
  {
    kind: "reading",
    title: "Đọc",
    description: "Một bài đọc 280–380 từ kèm 4 câu hỏi.",
    button: "Tạo bài đọc",
  },
  {
    kind: "ordering",
    title: "Sắp xếp",
    description: "5 bài sắp xếp hội thoại hoặc đoạn văn.",
    button: "Tạo bài sắp xếp",
  },
  {
    kind: "review",
    title: "Ôn lỗi",
    description: "10 câu mới theo các lỗi gần đây.",
    button: "Tạo bài ôn lỗi",
  },
  {
    kind: "diagnostic",
    title: "Chẩn đoán",
    description: "16 câu mới phủ nhiều chủ đề.",
    button: "Tạo đề chẩn đoán",
  },
  {
    kind: "vocabulary",
    title: "Từ vựng",
    description: "20 từ mới cho một chủ đề, lưu vào kho từ để học và ôn.",
    button: "Tạo từ vựng",
  },
  {
    kind: "exam",
    title: "Thi thử 40 câu",
    description: "40 câu, 50 phút. Bắt đầu làm khi phần đầu xong, các phần sau tạo tiếp.",
    button: "Bắt đầu tạo đề",
  },
] as const;

function JobProgress({
  job,
  current,
  options,
}: {
  job: NonNullable<Awaited<ReturnType<typeof getGenerationJob>>>;
  current: { choice: string; label: string; model: string } | null;
  options: { choice: string; label: string; model: string }[];
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
        <p className="font-medium text-accent">{job.questionIds.length}/{job.targetCount} {job.kind === "vocabulary" ? "từ" : "câu"}</p>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-background">
        <div className="h-full rounded-full bg-accent" style={{ width: `${progress}%` }} />
      </div>
      <p className="text-sm text-muted">
        Đề tạo theo từng phần. Phần nào xong được lưu ngay.
      </p>
      {job.error && job.status !== "completed" ? (
        <SourceSwitchOffer jobId={job.id} error={job.error} current={current} options={options} />
      ) : null}
      {job.status !== "completed" ? (
        <div className="flex flex-wrap gap-2">
          <form action={continueAIGeneration}>
            <input type="hidden" name="jobId" value={job.id} />
            <GenerationSubmitButton
              autoKey={job.kind === "exam" || job.error ? undefined : `${job.id}:${job.step}`}
              pendingText="Đang tạo phần tiếp theo…"
              progressLabel={`${job.questionIds.length}/${job.targetCount} câu`}
            >
              Tiếp tục tạo
            </GenerationSubmitButton>
          </form>
          <ChangeModelLink error={job.error} returnTo={`/ai-generator?job=${job.id}`} />
        </div>
      ) : null}
    </section>
  );
}

// Các hàm tạo đề AI chạy trong request của trang này; một lượt gọi AI có thể mất 1–3 phút nên cần
// nới giới hạn thời gian mặc định của Vercel (tối đa thực tế phụ thuộc gói/Fluid compute của dự án).
export const maxDuration = 300;

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
          Chọn một loại để tạo. Câu đạt kiểm tra được lưu vào kho. Nội dung AI không phải đề chính thức.
        </p>
        <p className="text-sm">
          Nguồn AI:{" "}
          {ai ? <strong>{SOURCE_LABELS[ai.choice]}</strong> : <span className="text-danger">chưa kết nối</span>}
          {ai ? ` · ${ai.model}${ai.modelChosen ? "" : " (mặc định)"}` : ""}
        </p>
      </div>

      {!ai?.ready ? (
        <p className="rounded-lg border border-warning/40 bg-card p-4 text-sm">
          Chưa kết nối AI. <Link href="/account/settings" className="text-accent underline">Kết nối AI</Link> để tạo đề.
        </p>
      ) : null}
      {query.error ? <p className="text-sm text-danger">{errors[query.error] ?? "Không tạo được đề."}</p> : null}
      {currentJob ? (
        <JobProgress
          job={currentJob}
          current={ai ? { choice: ai.choice, label: SOURCE_LABELS[ai.choice], model: ai.model } : null}
          options={fallbackSources(stored)}
        />
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Luyện theo chủ đề</CardTitle>
            <CardDescription>10 câu mới cho một chủ đề.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <form action={startAIGeneration} className="grid gap-3">
              <input type="hidden" name="kind" value="practice" />
              <label className="grid gap-1 text-sm">
                Chủ đề
                <TopicSelect topics={availableTopics.map((topic) => ({ slug: topic.slug, label: topicLabel(topic.name) }))} />
              </label>
              <DifficultyPicker idPrefix="gen-practice" />
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
              <form action={startAIGeneration} className="grid gap-3">
                <input type="hidden" name="kind" value={card.kind} />
                {card.kind === "vocabulary" ? (
                  <label className="grid gap-1 text-sm">
                    Chủ đề
                    <TopicSelect
                      topics={topics
                        .filter((topic) => topic.skill === "vocabulary")
                        .map((topic) => ({ slug: topic.slug, label: topicLabel(topic.name) }))}
                    />
                  </label>
                ) : null}
                {card.kind !== "exam" && card.kind !== "diagnostic" && card.kind !== "vocabulary" ? (
                  <DifficultyPicker idPrefix={`gen-${card.kind}`} />
                ) : null}
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
                <span>{KIND_LABELS[job.kind] ?? job.kind} · {job.questionIds.length}/{job.targetCount} {job.kind === "vocabulary" ? "từ" : "câu"} · {job.status === "completed" ? "Xong" : "Chưa xong"}</span>
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
