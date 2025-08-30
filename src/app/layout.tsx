import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { getServerClient } from "@/lib/server/supabase";
import LogoutButton from "@/components/LogoutButton";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MoisoTalk | 랜덤 영어 채팅",
  description:
    "무작위 매칭으로 영어만 사용하는 실시간 채팅 서비스. 한국어 사용 시 -1 포인트, 올-잉글리시 완료 시 +2 보너스!",
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await getServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider defaultTheme="light" storageKey="moisotalk-ui-theme">
          <header className="px-6 sm:px-10 py-4 border-b border-accent/10 bg-surface">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <Link
                href="/"
                className="font-semibold flex items-center gap-1 text-accent"
              >
                <Image
                  src="/logo_without_text.png"
                  alt="MoisoTalk"
                  width={36}
                  height={36}
                  className="drop-shadow-sm"
                />
                <span className="text-lg">MoisoTalk</span>
              </Link>
              <nav className="flex items-center gap-2 text-sm">
                <ThemeToggle />
                {user ? (
                  <>
                    <Link
                      href="/me"
                      className="px-4 py-2 rounded-xl border border-accent/30 hover:bg-accent/10 transition-all"
                    >
                      마이페이지
                    </Link>
                    <LogoutButton />
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="px-4 py-2 rounded-xl border border-accent/30 hover:bg-accent/10 transition-all"
                    >
                      로그인
                    </Link>
                    <Link
                      href="/signup"
                      className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-md"
                    >
                      회원가입
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </header>
          {children}
          <footer className="px-6 sm:px-10 py-10 bg-surface border-t border-accent/10 mt-10">
            <div className="max-w-6xl mx-auto text-sm text-foreground/60">
              © {new Date().getFullYear()} MoisoTalk
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
