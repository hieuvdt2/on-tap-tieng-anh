import Link from "next/link";
import { Button } from "@/components/ui/button";

const providers = [
  {
    name: "Gemini",
    href: "https://aistudio.google.com/apikey",
    steps: [
      "Đăng nhập tài khoản Google.",
      "Bấm Create API key.",
      "Chọn một dự án có sẵn hoặc tạo dự án mới.",
      "Copy toàn bộ khóa vừa được tạo.",
      "Quay lại Cấu hình AI, chọn Gemini, dán khóa và bấm Lưu khóa.",
    ],
  },
  {
    name: "Groq",
    href: "https://console.groq.com/keys",
    steps: [
      "Đăng nhập hoặc tạo tài khoản Groq.",
      "Bấm Create API Key.",
      "Đặt tên để dễ nhận biết, ví dụ “On Tap”.",
      "Bấm Submit rồi copy khóa ngay khi nó xuất hiện.",
      "Quay lại Cấu hình AI, chọn Groq, dán khóa và bấm Lưu khóa.",
    ],
  },
  {
    name: "OpenRouter",
    href: "https://openrouter.ai/settings/keys",
    steps: [
      "Đăng nhập hoặc tạo tài khoản OpenRouter.",
      "Nạp credits nếu tài khoản chưa có hạn mức sử dụng.",
      "Bấm Create API Key rồi đặt tên, ví dụ “On Tap”.",
      "Copy toàn bộ khóa ngay khi nó xuất hiện.",
      "Quay lại Cấu hình AI, chọn OpenRouter, dán khóa và bấm Lưu khóa.",
    ],
  },
] as const;

export default function ApiKeyGuidePage() {
  return (
    <div className="grid max-w-3xl gap-8">
      <div className="grid gap-2">
        <p className="text-sm text-muted">Hướng dẫn</p>
        <h1 className="font-serif text-4xl font-medium">Tạo khóa AI</h1>
        <p className="max-w-2xl leading-7 text-muted">
          Bạn chỉ cần tạo khóa cho nguồn muốn sử dụng. Có thể lưu nhiều nguồn để đổi sang nguồn khác khi một bên hết lượt.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {providers.map((provider) => (
          <section key={provider.name} className="grid content-start gap-5 rounded-xl border border-line bg-card p-5">
            <div className="grid gap-2">
              <h2 className="font-serif text-3xl font-medium">{provider.name}</h2>
              <Button asChild variant="outline" className="w-fit">
                <a href={provider.href} target="_blank" rel="noreferrer">
                  Mở trang tạo khóa
                </a>
              </Button>
            </div>
            <ol className="grid gap-4">
              {provider.steps.map((step, index) => (
                <li key={step} className="flex gap-3 leading-7">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent/10 text-sm font-medium text-accent">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>

      <section className="grid gap-2 rounded-xl border border-warning/30 bg-card p-5">
        <h2 className="font-serif text-2xl font-medium">Lưu ý an toàn</h2>
        <ul className="grid list-disc gap-2 pl-5 leading-7 text-muted">
          <li>Không gửi khóa cho người khác và không đăng khóa lên mạng.</li>
          <li>Hãy copy toàn bộ chuỗi, không thêm dấu cách ở đầu hoặc cuối.</li>
          <li>Nếu nghi ngờ khóa bị lộ, hãy xóa khóa trên trang của nhà cung cấp rồi tạo khóa mới.</li>
          <li>App mã hóa khóa trước khi lưu và mỗi tài khoản chỉ dùng khóa của chính mình.</li>
        </ul>
      </section>

      <Button asChild className="w-fit">
        <Link href="/account/settings">Đi tới Cấu hình AI</Link>
      </Button>
    </div>
  );
}
