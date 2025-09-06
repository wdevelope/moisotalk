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
              <span className="animate-pulse">🧪</span>
              <span className="text-xs md:text-sm font-medium text-primary">
                베타 오픈 · 지금은 이용자가 많지 않아요
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl 2xl:text-7xl font-extrabold leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-purple bg-clip-text text-transparent">
                영어로 대화하는
              </span>
              <span className="block mt-1 md:mt-2">
                <span className="text-foreground">랜덤 소개팅</span>
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
            </p>

            {/* Honest Status */}
            <div className="flex gap-6 md:gap-8 justify-center 2xl:justify-start text-center">
              <div>
                <p className="text-xl md:text-3xl font-bold text-primary">
                  Beta
                </p>
                <p className="text-xs md:text-sm text-foreground/60">
                  이제 막 시작했어요
                </p>
              </div>
              <div className="border-l border-foreground/10"></div>
              <div>
                <p className="text-xl md:text-3xl font-bold text-mint">
                  대기 가능
                </p>
                <p className="text-xs md:text-sm text-foreground/60">
                  매칭이 느릴 수 있어요
                </p>
              </div>
              <div className="border-l border-foreground/10"></div>
              <div>
                <p className="text-xl md:text-3xl font-bold text-purple">
                  피드백
                </p>
                <p className="text-xs md:text-sm text-foreground/60">
                  함께 빠르게 개선 중
                </p>
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
                무료 가입 • 익명 보장 • 매칭 대기 가능
              </p>
            </div>
          </div>

          {/* Visual Section - Updated */}
          <div className="relative flex justify-center 2xl:justify-end py-8 md:py-0">
            {/* Chat Preview Cards - Non-overlapping layout */}
            <div className="flex flex-col gap-4 md:gap-5">
              {/* Card 1 - Top */}
              <div className="transform -translate-x-8 md:-translate-x-12 rotate-2 hover:rotate-3 transition-all duration-300">
                <div className="w-[280px] md:w-[320px] p-4 rounded-2xl bg-gradient-to-br from-purple/10 to-purple/5 border border-purple/20 shadow-lg">
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
              </div>

              {/* Card 2 - Middle */}
              <div className="transform translate-x-8 md:translate-x-12 -rotate-2 hover:-rotate-3 transition-all duration-300 -mt-2">
                <div className="w-[280px] md:w-[320px] p-4 rounded-2xl bg-gradient-to-br from-mint/10 to-mint/5 border border-mint/20 shadow-lg">
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
              </div>

              {/* Card 3 - Bottom (Active) */}
              <div className="transform hover:scale-[1.02] transition-all duration-300 -mt-2">
                <div className="w-[300px] md:w-[340px] p-5 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border-2 border-primary/30 shadow-2xl">
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
                      <span className="typing-dot">.</span>
                      <span className="typing-dot">.</span>
                      <span className="typing-dot">.</span>
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
