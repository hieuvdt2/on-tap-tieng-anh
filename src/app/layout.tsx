import type { Metadata } from "next";
import { Be_Vietnam_Pro, Newsreader } from "next/font/google";
import { BackLink } from "@/components/back-link";
import { SiteHeader } from "@/components/site-header";
import { getCurrentUser } from "@/lib/auth";
import { activeAI } from "@/modules/ai/provider";
import { readStoredAI } from "@/modules/ai/settings";
import "./globals.css";

const sans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam",
});

const serif = Newsreader({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-newsreader",
});

export const metadata: Metadata = {
  title: "Ôn Tập",
  description: "Học ngữ pháp và luyện câu cho kỳ thi tốt nghiệp THPT.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const ai = user ? activeAI(await readStoredAI(user.id)) : null;
  return (
    <html lang="vi" className={`${sans.variable} ${serif.variable} h-full antialiased`}>
      <body className="min-h-full bg-background font-sans text-foreground">
        {user ? <SiteHeader ai={ai} user={user} /> : null}
        <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-8">
          {user ? <BackLink /> : null}
          {children}
        </main>
      </body>
    </html>
  );
}
