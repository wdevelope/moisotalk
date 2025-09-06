"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserClient } from "@/lib/supabaseClient";

export default function Home() {
  const router = useRouter();
  const supabase = getBrowserClient();
  const [starting, setStarting] = useState(false);

  async function onStart() {
    if (starting) return;
    setStarting(true);
    try {
      const { data } = await supabase.auth.getUser();
      router.push(data.user ? "/match" : "/signup");
    } catch {
      router.push("/match");
    } finally {
      setStarting(false);
    }
  }

  return (
    <div className="font-sans bg-gradient-to-b from-background via-surface/30 to-background text-foreground min-h-screen">
      <main className="px-4 md:px-6 2xl:px-10">
        {/* Hero */}
        <section className="max-w-6xl mx-auto py-8 md:py-12 2xl:py-20 grid grid-cols-1 2xl:grid-cols-2 gap-8 2xl:gap-12 items-center">
          <div className="space-y-5 md:space-y-7 text-center 2xl:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
              <span className="animate-pulse">🔥</span>
              <span className="text-xs md:text-sm font-medium text-primary">
                지금 2,543명이 대화 중!
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl 2xl:text-7xl font-extrabold leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-purple bg-clip-text text-transparent">
                Global Love,
              </span>
              <span className="block mt-1 md:mt-2">
                <span className="text-foreground">English Only</span>
                <span className="inline-block ml-2 md:ml-3 animate-bounce">
                  💝
                </span>
              </span>
            </h1>

            <p className="text-base md:text-lg 2xl:text-xl text-foreground/70 leading-relaxed max-w-lg mx-auto 2xl:mx-0">
              전 세계 싱글들과{" "}
              <span className="font-semibold text-primary">영어로만</span>{" "}
              대화하는
              <span className="font-semibold text-accent"> 익명 소개팅</span>!
              운명의 상대를 지금 바로 만나보세요 ✨
            </p>

            {/* Stats */}
            <div className="flex gap-6 md:gap-8 justify-center 2xl:justify-start text-center">
              <div>
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  10초
                </p>
                <p className="text-xs md:text-sm text-foreground/60">
                  평균 매칭
                </p>
              </div>
              <div className="border-l border-foreground/10"></div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-mint">15K+</p>
                <p className="text-xs md:text-sm text-foreground/60">
                  성공 커플
                </p>
              </div>
              <div className="border-l border-foreground/10"></div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-purple">
                  4.9★
                </p>
                <p className="text-xs md:text-sm text-foreground/60">만족도</p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2 md:pt-4">
              <button
                onClick={onStart}
                disabled={starting}
                className="group relative px-8 md:px-10 py-4 md:py-5 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-bold text-base md:text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.03] transition-all duration-200 disabled:opacity-60"
              >
                <span className="flex items-center justify-center gap-3">
                  <span className="text-xl md:text-2xl">💘</span>
                  <span>{starting ? "준비 중..." : "운명 찾기 START"}</span>
                  <span className="text-xl md:text-2xl animate-pulse">→</span>
                </span>
                <div className="absolute inset-0 rounded-2xl bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              </button>
              <p className="mt-3 text-xs md:text-sm text-foreground/50 text-center 2xl:text-left">
                무료 가입 • 익명 보장 • 즉시 매칭
              </p>
            </div>
          </div>

          {/* Visual Section */}
          <div className="relative flex justify-center 2xl:justify-end">
            {/* Background Decoration */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-primary/20 via-purple/20 to-mint/20 blur-3xl animate-pulse"></div>
            </div>

            {/* Chat Preview Cards Stack */}
            <div className="relative">
              {/* Card 1 - Background */}
              <div className="absolute top-4 left-4 w-[280px] md:w-[340px] p-4 md:p-5 rounded-2xl bg-gradient-to-br from-purple/10 to-purple/5 border border-purple/20 transform rotate-3 hover:rotate-6 transition-transform">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-purple/20 flex items-center justify-center">
                    <span>👩</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Emma, 26</p>
                    <p className="text-xs text-foreground/60">London, UK</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs md:text-sm">
                  <div className="bg-white/50 dark:bg-black/20 rounded-xl px-3 py-2">
                    "I love traveling! Where's your dream destination?"
                  </div>
                </div>
              </div>

              {/* Card 2 - Middle */}
              <div className="absolute top-2 left-2 w-[280px] md:w-[340px] p-4 md:p-5 rounded-2xl bg-gradient-to-br from-mint/10 to-mint/5 border border-mint/20 transform -rotate-2 hover:-rotate-4 transition-transform">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-mint/20 flex items-center justify-center">
                    <span>👨</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">James, 28</p>
                    <p className="text-xs text-foreground/60">Seoul, Korea</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs md:text-sm">
                  <div className="bg-white/50 dark:bg-black/20 rounded-xl px-3 py-2">
                    "Japan! I want to see cherry blossoms 🌸"
                  </div>
                </div>
              </div>

              {/* Card 3 - Front (Active) */}
              <div className="relative z-10 w-[280px] md:w-[340px] p-4 md:p-5 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/30 shadow-2xl transform hover:scale-[1.02] transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                        ?
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-mint rounded-full border-2 border-white animate-pulse"></div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">New Match!</p>
                      <p className="text-xs text-mint font-medium">
                        Online now
                      </p>
                    </div>
                  </div>
                  <span className="text-2xl animate-pulse">💕</span>
                </div>

                {/* Chat Messages */}
                <div className="space-y-2 text-xs md:text-sm mb-4">
                  <div className="bg-white/60 dark:bg-black/30 rounded-xl px-3 py-2 self-start">
                    "Hi! Nice to meet you! 😊"
                  </div>
                  <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl px-3 py-2 text-right">
                    "Hello! Where are you from?"
                  </div>
                  <div className="flex items-center gap-1 text-foreground/40">
                    <span className="animate-bounce">.</span>
                    <span
                      className="animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    >
                      .
                    </span>
                    <span
                      className="animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    >
                      .
                    </span>
                  </div>
                </div>

                {/* Points indicator */}
                <div className="flex items-center justify-between pt-2 border-t border-foreground/10">
                  <div className="flex gap-2">
                    <span className="px-2 py-1 rounded-full bg-mint/20 text-mint text-xs font-medium">
                      English Only
                    </span>
                    <span className="px-2 py-1 rounded-full bg-orange/20 text-orange text-xs font-medium">
                      +2 Points
                    </span>
                  </div>
                  <Image
                    src="/logo.png"
                    alt="MoisoTalk"
                    width={24}
                    height={24}
                    className="opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto py-8 md:py-12 2xl:py-16">
          <h2 className="text-2xl md:text-3xl 2xl:text-4xl font-bold text-center mb-8 md:mb-12">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Why MoisoTalk?
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4 md:gap-6">
            <FeatureCard
              icon="🌍"
              title="Global Dating"
              desc="전 세계 싱글들과 실시간 매칭"
              gradient="from-primary/10 to-accent/10"
              borderColor="border-primary/20"
            />
            <FeatureCard
              icon="⚡"
              title="Instant Match"
              desc="평균 10초 내 운명의 상대 발견"
              gradient="from-mint/10 to-teal-500/10"
              borderColor="border-mint/20"
            />
            <FeatureCard
              icon="🎭"
              title="Anonymous Chat"
              desc="부담 없는 익명 소개팅"
              gradient="from-purple/10 to-pink-500/10"
              borderColor="border-purple/20"
            />
            <FeatureCard
              icon="🏆"
              title="Reward System"
              desc="영어 대화로 포인트 획득"
              gradient="from-orange/10 to-yellow-500/10"
              borderColor="border-orange/20"
            />
          </div>
        </section>

        {/* Trust Badges */}
        <section className="max-w-4xl mx-auto py-6 md:py-8 2xl:py-10 border-t border-foreground/10">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 text-xs md:text-sm text-foreground/50">
            <div className="flex items-center gap-2">
              <span className="text-green-500">🔒</span>
              <span>SSL 보안</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🌐</span>
              <span>24/7 서비스</span>
            </div>
            <div className="flex items-center gap-2">
              <span>💳</span>
              <span>안전한 결제</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🎯</span>
              <span>98% 매칭률</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  gradient,
  borderColor,
}: {
  icon: string;
  title: string;
  desc: string;
  gradient: string;
  borderColor: string;
}) {
  return (
    <div
      className={`group relative rounded-xl md:rounded-2xl border ${borderColor} p-4 md:p-5 2xl:p-6 bg-gradient-to-br ${gradient} hover:scale-[1.02] transition-all duration-200 cursor-pointer`}
    >
      <div className="text-center space-y-3">
        <div className="text-3xl md:text-4xl 2xl:text-5xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="font-bold text-sm md:text-base 2xl:text-lg text-foreground">
          {title}
        </h3>
        <p className="text-xs md:text-sm text-foreground/70">{desc}</p>
      </div>
      <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-white/5 dark:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );
}
