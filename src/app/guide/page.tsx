import { PendingLink } from "@/components/pending-link";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { finishGuide } from "@/modules/learning/onboarding";

type Feature = {
  title: string;
  href: string;
  summary: string;
  points?: string[];
};

const quickStart = [
  {
    title: "Làm bài chẩn đoán",
    text: "16 câu để app ước lượng mức sẵn sàng của bạn và chỉ ra chủ đề nên học trước.",
    href: "/diagnostic",
    label: "Mở Chẩn đoán",
  },
  {
    title: "Học một chủ đề, rồi luyện",
    text: "Đọc bài học (có ví dụ và lỗi hay gặp), sau đó luyện câu ngay trong chủ đề đó.",
    href: "/learn",
    label: "Mở Bài học",
  },
  {
    title: "Thi thử và ôn lại câu sai",
    text: "Làm đề 40 câu trong 50 phút, xem lời giải, rồi ôn lại các câu đã sai.",
    href: "/mock-exam",
    label: "Mở Thi thử",
  },
];

const studyFeatures: Feature[] = [
  {
    title: "Bài học",
    href: "/learn",
    summary: "Kiến thức theo chủ đề, gồm ngữ pháp và từ vựng.",
    points: [
      "Bài ngữ pháp: khái niệm, khi nào dùng, cấu trúc, ví dụ, dấu hiệu nhận biết, so sánh và lỗi hay gặp.",
      "Bài từ vựng: tổng quan, từ và cụm cần nhớ, cụm hay đi cùng.",
      "Mỗi bài có nút luyện ngay chủ đề đó.",
    ],
  },
  {
    title: "Luyện",
    href: "/practice",
    summary: "Làm từng câu và xem giải thích ngay sau khi trả lời.",
    points: [
      "Ba chế độ: Theo chủ đề (tối đa 10 câu), Điểm yếu (20 câu, ưu tiên chủ đề bạn còn yếu), Nhanh (5 câu).",
      "Làm xong có điểm, thống kê theo chủ đề và danh sách xem lại: lọc Tất cả / Sai / Đúng, bấm vào từng câu để xem lời giải.",
      "Có nút Làm lại câu sai, Làm lại cả bài. Câu có lỗi thì bấm Báo câu sai.",
    ],
  },
  {
    title: "Đọc hiểu",
    href: "/reading",
    summary: "Đọc một đoạn văn rồi trả lời các câu hỏi bên dưới, chấm riêng từng câu.",
  },
  {
    title: "Sắp xếp câu",
    href: "/ordering",
    summary: "Đưa các câu về đúng thứ tự để thành đoạn văn hoặc hội thoại hoàn chỉnh.",
  },
  {
    title: "Ôn lỗi",
    href: "/review",
    summary: "Gom các câu bạn từng làm sai, nhóm theo chủ đề, để ôn lại đúng chỗ yếu.",
    points: ["Có thể nhờ AI tạo câu mới cùng kiến thức với các lỗi gần đây (xem mục Tạo đề AI)."],
  },
  {
    title: "Lịch sử luyện",
    href: "/practice/history",
    summary: "Danh sách các phiên luyện, chẩn đoán và ôn lỗi đã làm.",
    points: ["Xem lại bài đã xong, hoặc bấm Tiếp tục ở phiên còn làm dở."],
  },
];

const examFeatures: Feature[] = [
  {
    title: "Thi thử",
    href: "/mock-exam",
    summary: "Đề 40 câu, 50 phút, theo các dạng của kỳ thi: điền từ, sắp xếp, điền câu và đọc hiểu.",
    points: [
      "Chọn Mã đề A hoặc Mã đề B (soạn trong app). Muốn đề mới thì tạo bằng AI ở mục Tạo đề AI, thẻ Thi thử 40 câu.",
      "Màn thi toàn màn hình: đoạn văn bên trái, câu hỏi bên phải, mỗi lần một câu.",
      "Bảng số câu ở dưới: xanh là đã làm, vàng là cần xem lại, trắng là chưa làm. Bấm vào số để nhảy tới câu đó.",
      "Nút Xem lại để tự đánh dấu câu còn phân vân. Đáp án được tự lưu nên đóng tab cũng không mất.",
      "Hết giờ bài tự nộp. Sau khi nộp có điểm, đáp án đúng và lời giải từng câu; có thể Làm lại đề.",
    ],
  },
  {
    title: "Lịch sử thi",
    href: "/mock-exam/history",
    summary: "Xem lại điểm, đáp án và lời giải của các đề đã nộp, hoặc làm tiếp đề còn dở.",
  },
  {
    title: "Chẩn đoán",
    href: "/diagnostic",
    summary: "16 câu rải đều các chủ đề. Sau khi nộp, app ước lượng mức sẵn sàng và gợi ý chủ đề nên học trước.",
    points: ["Đây chỉ là ước lượng từ các câu trong app, không phải điểm thi."],
  },
];

const aiTypes = [
  ["Luyện theo chủ đề", "10 câu mới cho một chủ đề ngữ pháp hoặc từ vựng."],
  ["Đọc", "Một bài đọc nguyên bản kèm 4 câu hỏi."],
  ["Sắp xếp", "5 bài sắp xếp hội thoại hoặc đoạn văn."],
  ["Ôn lỗi", "10 câu mới cùng kiến thức với các lỗi gần đây của bạn."],
  ["Chẩn đoán", "16 câu mới phủ nhiều chủ đề."],
  ["Thi thử 40 câu", "Đề 40 câu, 50 phút, tạo theo từng phần."],
];

const tips = [
  "Chưa cấu hình AI vẫn học và luyện được bằng câu có sẵn. Chấm điểm không cần AI.",
  "Điểm trong app chỉ để tự đánh giá. Nội dung do app hoặc AI soạn không phải đề chính thức của Bộ Giáo dục và Đào tạo.",
  "AI có thể sai. Gặp câu có đáp án sai hay khó hiểu, hãy bấm Báo câu sai để câu đó không xuất hiện ở bài mới.",
  "Câu AI tạo ra được lưu vào kho chung để dùng lại, nên lần sau có thể không cần chờ AI.",
  "Khoá AI là của riêng bạn, được mã hoá và không chia sẻ. Đừng gửi khoá cho người khác.",
];

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <article className="grid content-start gap-3 rounded-xl border border-line bg-card p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-serif text-2xl">{feature.title}</h3>
        <Button asChild variant="outline" size="sm" className="shrink-0">
          <PendingLink href={feature.href} label="Đang mở…">Mở</PendingLink>
        </Button>
      </div>
      <p className="leading-7">{feature.summary}</p>
      {feature.points ? (
        <ul className="grid gap-1.5 text-sm leading-6 text-muted">
          {feature.points.map((point) => (
            <li key={point} className="flex gap-2">
              <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

function SectionHeading({ id, kicker, title, text }: { id: string; kicker: string; title: string; text?: string }) {
  return (
    <div id={id} className="grid scroll-mt-24 gap-1">
      <p className="text-sm font-medium text-accent">{kicker}</p>
      <h2 className="font-serif text-3xl font-medium">{title}</h2>
      {text ? <p className="max-w-2xl leading-7 text-muted">{text}</p> : null}
    </div>
  );
}

export default async function GuidePage({ searchParams }: { searchParams: Promise<{ welcome?: string }> }) {
  const query = await searchParams;
  const user = await requireUser();

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-10">
      <header className="grid gap-3">
        <p className="text-sm text-muted">{query.welcome ? `Chào ${user.displayName}` : "Hướng dẫn"}</p>
        <h1 className="font-serif text-4xl font-medium">
          {query.welcome ? "Chào mừng bạn đến với app ôn thi tiếng Anh" : "Cách dùng app ôn thi tiếng Anh"}
        </h1>
        <p className="max-w-3xl leading-7 text-muted">
          App giúp bạn ôn tiếng Anh cho kỳ thi tốt nghiệp THPT: học kiến thức theo chủ đề, luyện câu, làm đề thi thử có
          đồng hồ, và nhờ AI tạo thêm câu hỏi mới. Trang này giới thiệu từng phần và việc mỗi phần dùng để làm gì.
        </p>
        <nav aria-label="Mục lục" className="flex flex-wrap gap-2 pt-1 text-sm">
          {[
            ["#bat-dau", "Bắt đầu nhanh"],
            ["#hoc", "Học và luyện"],
            ["#thi", "Thi"],
            ["#ai", "Tạo đề AI"],
            ["#thiet-lap", "Thiết lập AI"],
            ["#luu-y", "Lưu ý"],
          ].map(([href, label]) => (
            <a key={href} href={href} className="min-h-11 rounded-full border border-line px-4 py-2.5 hover:border-accent/60">
              {label}
            </a>
          ))}
        </nav>
      </header>

      <section className="grid gap-4">
        <SectionHeading id="bat-dau" kicker="Bước đầu" title="Bắt đầu nhanh trong 3 bước" text="Chưa biết bắt đầu từ đâu thì làm theo thứ tự này." />
        <ol className="grid gap-3 md:grid-cols-3">
          {quickStart.map((step, index) => (
            <li key={step.title} className="grid content-start gap-3 rounded-xl border border-line bg-card p-4 sm:p-5">
              <span className="grid size-8 place-items-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                {index + 1}
              </span>
              <h3 className="font-serif text-xl">{step.title}</h3>
              <p className="text-sm leading-6 text-muted">{step.text}</p>
              <Button asChild variant="outline" size="sm" className="w-fit">
                <PendingLink href={step.href} label="Đang mở…">{step.label}</PendingLink>
              </Button>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-4">
        <SectionHeading id="hoc" kicker="Nhóm Học" title="Học và luyện" text="Các phần nằm trong mục Học ở menu phía trên." />
        <div className="grid gap-3 md:grid-cols-2">
          {studyFeatures.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </section>

      <section className="grid gap-4">
        <SectionHeading id="thi" kicker="Nhóm Thi" title="Thi thử và chẩn đoán" text="Các phần nằm trong mục Thi ở menu phía trên." />
        <div className="grid gap-3 md:grid-cols-2">
          {examFeatures.map((feature, index) => (
            <div key={feature.title} className={index === 0 ? "md:col-span-2" : undefined}>
              <FeatureCard feature={feature} />
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4">
        <SectionHeading
          id="ai"
          kicker="Tạo đề AI"
          title="Nhờ AI tạo câu hỏi mới"
          text="Khi muốn có thêm câu mới, vào Tạo đề AI và chọn loại bài. Câu đạt kiểm tra được lưu vào kho chung để dùng lại, nên người dùng sau (và bạn lần sau) ít phải chờ hơn."
        />
        <ul className="grid gap-2 sm:grid-cols-2">
          {aiTypes.map(([title, text]) => (
            <li key={title} className="grid gap-0.5 rounded-xl border border-line bg-card px-4 py-3">
              <span className="font-medium">{title}</span>
              <span className="text-sm leading-6 text-muted">{text}</span>
            </li>
          ))}
        </ul>
        <p className="max-w-3xl text-sm leading-6 text-muted">
          Tạo đề thi thử mất vài phút, bạn có thể làm những phần đã có trong lúc app tạo tiếp phần sau. Nếu nguồn AI
          đang dùng bị lỗi (hết lượt, quá tải), app sẽ hỏi bạn có muốn chuyển sang nguồn AI khác đã lưu khoá để tạo tiếp không.
        </p>
        <Button asChild variant="outline" className="w-fit">
          <PendingLink href="/ai-generator" label="Đang mở…">Mở Tạo đề AI</PendingLink>
        </Button>
      </section>

      <section className="grid gap-4">
        <SectionHeading
          id="thiet-lap"
          kicker="Cài đặt một lần"
          title="Thiết lập AI"
          text="Muốn dùng Tạo đề AI, hãy làm 3 bước ở mục Cấu hình AI (trong menu tài khoản, góc trên bên phải)."
        />
        <ol className="grid gap-3 md:grid-cols-3">
          {[
            ["Chọn nguồn AI", "Gemini, Groq hoặc OpenRouter. Chưa biết chọn gì thì dùng Gemini."],
            ["Lưu khoá", "Lấy khoá ở trang của nguồn đã chọn rồi dán vào. Khoá được mã hoá và chỉ thuộc tài khoản của bạn."],
            ["Chọn model", "Model là phiên bản AI sẽ tạo câu hỏi. Danh sách lấy theo khoá của bạn."],
          ].map(([title, text], index) => (
            <li key={title} className="grid content-start gap-2 rounded-xl border border-line bg-card p-4 sm:p-5">
              <span className="text-sm font-medium text-accent">Bước {index + 1}</span>
              <h3 className="font-serif text-xl">{title}</h3>
              <p className="text-sm leading-6 text-muted">{text}</p>
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <PendingLink href="/account/settings" label="Đang mở…">Mở Cấu hình AI</PendingLink>
          </Button>
          <Button asChild variant="outline">
            <PendingLink href="/account/api-key-guide" label="Đang mở…">Chưa biết lấy khoá? Xem hướng dẫn</PendingLink>
          </Button>
        </div>
      </section>

      <section className="grid gap-4">
        <SectionHeading id="luu-y" kicker="Cần biết" title="Một vài lưu ý" />
        <ul className="grid gap-2">
          {tips.map((tip) => (
            <li key={tip} className="flex gap-3 rounded-xl border border-line bg-card px-4 py-3 leading-7">
              <span aria-hidden="true" className="mt-3 size-1.5 shrink-0 rounded-full bg-accent" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted">
          Theo dõi kết quả từng chủ đề (Yếu, Đang học, Vững) ở mục{" "}
          <PendingLink href="/progress" label="Đang mở…" className="text-accent underline">Tiến độ</PendingLink>.
        </p>
      </section>

      <section className="grid justify-items-center gap-4 rounded-xl border border-accent/30 bg-card p-6 text-center">
        <h2 className="font-serif text-3xl font-medium">Sẵn sàng bắt đầu?</h2>
        <p className="max-w-xl leading-7 text-muted">Bạn có thể quay lại trang này bất cứ lúc nào ở mục Hướng dẫn trên menu.</p>
        <div className="grid w-full gap-2 sm:flex sm:w-auto sm:flex-wrap sm:justify-center">
          {[
            ["/diagnostic", "Làm bài chẩn đoán", true],
            ["/learn", "Xem các bài học", false],
            ["/account/settings", "Cấu hình AI trước", false],
          ].map(([target, label, primary]) => (
            <form key={String(target)} action={finishGuide}>
              <input type="hidden" name="target" value={String(target)} />
              <Button type="submit" variant={primary ? "default" : "outline"} className="w-full sm:w-auto">
                {label}
              </Button>
            </form>
          ))}
        </div>
      </section>
    </div>
  );
}
