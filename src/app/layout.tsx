import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
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
  title: "MoisoTalk | 랜덤 영어 소개팅",
  description:
    "무작위 매칭으로 영어만 사용하는 실시간 소개팅 서비스. 한국어 사용 시 -1 포인트, 올-잉글리시 완료 시 +2 보너스!",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  other: {
    "naver-site-verification": "ea84e759a9cda554cc0ac35815db52860299f16b",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider defaultTheme="light" storageKey="moisotalk-ui-theme">
          <Header />
          {children}
          <footer className="px-4 md:px-6 2xl:px-10 py-6 md:py-10 bg-surface border-t border-accent/10 mt-8 md:mt-10">
            <div className="max-w-6xl mx-auto text-xs md:text-sm text-foreground/60">
              © {new Date().getFullYear()} MoisoTalk
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
