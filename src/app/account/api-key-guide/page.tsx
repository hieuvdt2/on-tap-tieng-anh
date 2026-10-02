import Link from "next/link";
import { Button } from "@/components/ui/button";

const providers = [
  {
    id: "gemini",
    name: "Gemini",
    badge: "Nên dùng nếu mới bắt đầu",
    summary: "AI của Google. Chỉ cần tài khoản Google là tạo được khóa, có lượt dùng miễn phí mỗi ngày.",
    href: "https://aistudio.google.com/apikey",
    hrefLabel: "Mở Google AI Studio",
    cost: "Có gói miễn phí, giới hạn số lượt mỗi phút và mỗi ngày.",
    keyHint: "Khóa thường bắt đầu bằng AIza…",
    steps: [
      { title: "Mở Google AI Studio", body: "Bấm nút “Mở Google AI Studio” ở trên. Trang mở trong tab mới để bạn không mất trang này." },
      { title: "Đăng nhập Google", body: "Dùng tài khoản Gmail bất kỳ. Nếu được hỏi đồng ý điều khoản, hãy đọc và bấm đồng ý." },
      { title: "Tạo khóa", body: "Bấm “Create API key”. Nếu được hỏi chọn dự án, chọn dự án có sẵn hoặc để Google tự tạo dự án mới." },
      { title: "Copy khóa", body: "Bấm biểu tượng copy cạnh khóa vừa tạo. Không chọn bằng tay để tránh thiếu ký tự." },
      { title: "Dán vào app", body: "Quay lại Thiết lập AI, chọn Gemini, dán khóa rồi bấm “Lưu và kiểm tra khóa”. App sẽ tự kiểm tra khóa với Google." },
    ],
  },
  {
    id: "groq",
    name: "Groq",
    badge: "Tạo câu nhanh",
    summary: "Chạy các model mở như Llama với tốc độ cao. Hợp để dùng thêm khi Gemini hết lượt.",
    href: "https://console.groq.com/keys",
    hrefLabel: "Mở Groq Console",
    cost: "Có gói miễn phí, giới hạn số lượt theo từng model.",
    keyHint: "Khóa thường bắt đầu bằng gsk_…",
    steps: [
      { title: "Mở Groq Console", body: "Bấm nút “Mở Groq Console” ở trên." },
      { title: "Đăng nhập", body: "Có thể đăng nhập bằng Google, GitHub hoặc email." },
      { title: "Tạo khóa", body: "Bấm “Create API Key”, đặt tên dễ nhớ, ví dụ “On Tap”, rồi bấm Submit." },
      { title: "Copy ngay", body: "Groq chỉ hiện khóa đầy đủ một lần. Copy ngay; nếu lỡ đóng, hãy tạo khóa mới." },
      { title: "Dán vào app", body: "Quay lại Thiết lập AI, chọn Groq, dán khóa rồi bấm lưu." },
    ],
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    badge: "Nhiều model nhất",
    summary: "Một khóa dùng được model của nhiều hãng như Google, Meta, OpenAI, Anthropic.",
    href: "https://openrouter.ai/settings/keys",
    hrefLabel: "Mở OpenRouter",
    cost: "Phần lớn model tính phí theo lượng dùng, cần nạp credits. Một số model miễn phí nhưng giới hạn chặt.",
    keyHint: "Khóa thường bắt đầu bằng sk-or-…",
    steps: [
      { title: "Mở OpenRouter", body: "Bấm nút “Mở OpenRouter” ở trên rồi đăng nhập hoặc tạo tài khoản." },
      { title: "Nạp credits nếu cần", body: "Model trả phí cần số dư. Vào mục Credits để nạp; có thể đặt giới hạn chi tiêu cho khóa." },
      { title: "Tạo khóa", body: "Ở trang Keys, bấm “Create Key”, đặt tên ví dụ “On Tap”." },
      { title: "Copy ngay", body: "Khóa chỉ hiện đầy đủ một lần. Copy và lưu vào app luôn." },
      { title: "Dán vào app", body: "Quay lại Thiết lập AI, chọn OpenRouter, dán khóa rồi bấm lưu." },
    ],
  },
] as const;

const problems = [
  {
    q: "App báo khóa không hợp lệ",
    a: "Thường do copy thiếu ký tự hoặc dính dấu cách. Hãy copy lại bằng nút copy trên trang nhà cung cấp. Nếu vẫn lỗi, xóa khóa cũ và tạo khóa mới.",
  },
  {
    q: "Không thấy model nào ở bước 3",
    a: "Danh sách model lấy trực tiếp từ nhà cung cấp theo khóa của bạn. Kiểm tra mạng, thử tải lại trang. Với OpenRouter, tài khoản chưa có credits có thể bị giới hạn model.",
  },
  {
    q: "Đang tạo đề thì báo hết lượt",
    a: "Gói miễn phí giới hạn số lượt mỗi phút hoặc mỗi ngày. Hãy chờ một lúc, hoặc lưu thêm khóa của nguồn khác rồi đổi nguồn ở Thiết lập AI.",
  },
  {
    q: "Model báo không còn hỗ trợ",
    a: "Nhà cung cấp đôi khi ngừng model cũ. Vào Thiết lập AI, chọn lại một model khác trong danh sách.",
  },
  {
    q: "Chưa có khóa thì có học được không?",
    a: "Có. Bài luyện, bài đọc và đề mẫu có sẵn vẫn dùng bình thường. Khóa chỉ cần để tạo câu hỏi mới bằng AI.",
  },
] as const;

const glossary = [
  { term: "Khóa (API key)", meaning: "Một chuỗi ký tự bí mật giúp app thay bạn gửi yêu cầu tới nhà cung cấp AI." },
  { term: "Nguồn AI", meaning: "Công ty cung cấp AI: Gemini, Groq hoặc OpenRouter." },
  { term: "Model", meaning: "Phiên bản AI cụ thể. Model lớn thường viết tốt hơn, model nhỏ chạy nhanh hơn." },
] as const;

export default function ApiKeyGuidePage() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:items-start lg:gap-10">
      <aside className="grid gap-5 lg:sticky lg:top-6">
        <div className="grid gap-2">
          <p className="text-sm text-muted">Hướng dẫn</p>
          <h1 className="font-serif text-4xl font-medium">Tạo khóa AI</h1>
          <p className="leading-7 text-muted">Mất khoảng 2–3 phút. Chỉ cần làm cho một nguồn.</p>
        </div>
        <nav aria-label="Mục lục" className="flex flex-wrap gap-2 lg:grid lg:gap-1">
          {[
            { href: "#tong-quan", label: "Tổng quan" },
            ...providers.map((provider) => ({ href: `#${provider.id}`, label: provider.name })),
            { href: "#loi-thuong-gap", label: "Lỗi thường gặp" },
            { href: "#an-toan", label: "An toàn" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 items-center rounded-lg border border-line bg-card px-3 text-sm hover:border-accent/50 lg:border-transparent lg:bg-transparent lg:hover:bg-card"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <Button asChild className="w-fit">
          <Link href="/account/settings">Đi tới Thiết lập AI</Link>
        </Button>
      </aside>

      <div className="grid min-w-0 gap-8">
        <section id="tong-quan" className="grid scroll-mt-24 gap-4 rounded-xl border border-line bg-card p-5 sm:p-6">
          <h2 className="font-serif text-2xl font-medium">Tổng quan</h2>
          <ol className="grid gap-3 sm:grid-cols-3">
            {[
              { title: "Chọn nguồn", body: "Chưa biết chọn gì thì dùng Gemini." },
              { title: "Tạo và dán khóa", body: "Làm theo hướng dẫn của nguồn đã chọn bên dưới." },
              { title: "Chọn model", body: "Sau khi lưu khóa, chọn model trong danh sách." },
            ].map((step, index) => (
              <li key={step.title} className="grid content-start gap-1 rounded-lg bg-background p-4">
                <span className="text-sm font-medium text-accent">Bước {index + 1}</span>
                <span className="font-medium">{step.title}</span>
                <span className="text-sm leading-6 text-muted">{step.body}</span>
              </li>
            ))}
          </ol>
          <dl className="grid gap-3 border-t border-line pt-4 sm:grid-cols-3">
            {glossary.map((item) => (
              <div key={item.term} className="grid gap-1">
                <dt className="text-sm font-medium">{item.term}</dt>
                <dd className="text-sm leading-6 text-muted">{item.meaning}</dd>
              </div>
            ))}
          </dl>
        </section>

        {providers.map((provider) => (
          <section
            key={provider.id}
            id={provider.id}
            className="grid scroll-mt-24 gap-5 rounded-xl border border-line bg-card p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="grid min-w-0 gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-serif text-3xl font-medium">{provider.name}</h2>
                  <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">{provider.badge}</span>
                </div>
                <p className="max-w-2xl leading-7 text-muted">{provider.summary}</p>
              </div>
              <Button asChild variant="outline">
                <a href={provider.href} target="_blank" rel="noreferrer">
                  {provider.hrefLabel} <span aria-hidden="true">↗</span>
                </a>
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <p className="rounded-lg bg-background p-3 text-sm leading-6">
                <span className="block font-medium">Chi phí</span>
                <span className="text-muted">{provider.cost}</span>
              </p>
              <p className="rounded-lg bg-background p-3 text-sm leading-6">
                <span className="block font-medium">Nhận biết khóa đúng</span>
                <span className="text-muted">{provider.keyHint}</span>
              </p>
            </div>

            <ol className="grid gap-4">
              {provider.steps.map((step, index) => (
                <li key={step.title} className="flex gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-sm font-medium text-accent-foreground">
                    {index + 1}
                  </span>
                  <span className="grid min-w-0 gap-0.5 pt-1">
                    <span className="font-medium">{step.title}</span>
                    <span className="text-sm leading-6 text-muted">{step.body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>
        ))}

        <section id="loi-thuong-gap" className="grid scroll-mt-24 gap-3">
          <h2 className="font-serif text-2xl font-medium">Lỗi thường gặp</h2>
          <div className="grid gap-2">
            {problems.map((item) => (
              <details key={item.q} className="group rounded-xl border border-line bg-card px-4">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 py-3 font-medium">
                  {item.q}
                  <span aria-hidden="true" className="text-muted transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="pb-4 text-sm leading-6 text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="an-toan" className="grid scroll-mt-24 gap-3 rounded-xl border border-warning/30 bg-card p-5 sm:p-6">
          <h2 className="font-serif text-2xl font-medium">Giữ khóa an toàn</h2>
          <ul className="grid gap-2 leading-7 text-muted sm:grid-cols-2">
            <li>• Không gửi khóa cho người khác và không đăng lên mạng.</li>
            <li>• Copy cả chuỗi, không thêm dấu cách ở đầu hoặc cuối.</li>
            <li>• Nghi ngờ bị lộ: xóa khóa trên trang nhà cung cấp rồi tạo khóa mới.</li>
            <li>• App mã hóa khóa trước khi lưu; mỗi tài khoản chỉ dùng khóa của mình.</li>
          </ul>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-accent/30 bg-card p-5">
          <p className="font-medium">Đã có khóa? Dán vào app để bắt đầu tạo đề.</p>
          <Button asChild>
            <Link href="/account/settings">Đi tới Thiết lập AI</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
