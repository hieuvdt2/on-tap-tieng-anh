import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid gap-3">
      <h1 className="font-serif text-4xl">Không thấy trang này</h1>
      <Link href="/" className="text-accent underline">
        Về tổng quan
      </Link>
    </div>
  );
}
