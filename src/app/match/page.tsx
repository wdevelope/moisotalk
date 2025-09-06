"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function MatchPage() {
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [stats, setStats] = useState<{
    waitingCount: number;
    activeRooms: number;
  } | null>(null);
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const elapsedRef = useRef<NodeJS.Timeout | null>(null);
  const statsRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (elapsedRef.current) clearInterval(elapsedRef.current);
      if (statsRef.current) clearInterval(statsRef.current);
    };
  }, []);

  useEffect(() => {
    if (waiting) {
      elapsedRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (elapsedRef.current) clearInterval(elapsedRef.current);
      setElapsedTime(0);
    }
  }, [waiting]);

  // Live stats polling
  useEffect(() => {
    let cancelled = false;
    async function fetchStats() {
      try {
        const res = await fetch("/api/match/stats", { cache: "no-store" });
        if (!res.ok) return;
        const j = await res.json();
        if (!cancelled) setStats(j);
      } catch {}
    }
    fetchStats();
    statsRef.current = setInterval(fetchStats, 5000);
    return () => {
      cancelled = true;
      if (statsRef.current) clearInterval(statsRef.current);
    };
  }, []);

  async function start() {
    setError(null);
    setWaiting(true);
    const res = await fetch("/api/match/start", { method: "POST" });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "대기열 등록 실패");
      setWaiting(false);
      return;
    }
    timerRef.current = setInterval(tryMatch, 1500);
  }

  async function tryMatch() {
    const res = await fetch("/api/match/try", { method: "POST" });
    if (!res.ok) return; // keep polling
    const { roomId } = await res.json();
    if (roomId) {
      if (timerRef.current) clearInterval(timerRef.current);
      router.push(`/chat/${roomId}`);
    }
  }

  async function cancel() {
    if (timerRef.current) clearInterval(timerRef.current);
    if (elapsedRef.current) clearInterval(elapsedRef.current);
    await fetch("/api/match/cancel", { method: "POST" });
    setWaiting(false);
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center py-6 md:py-10 px-4 md:px-6 font-sans">
      <div className="max-w-xl w-full">
        {/* Main Card */}
        <div className="bg-gradient-to-br from-primary/5 via-surface to-accent/5 rounded-2xl md:rounded-3xl border border-primary/20 p-6 md:p-8 2xl:p-10 shadow-xl backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-primary to-accent mb-4 shadow-lg">
              <span className="text-3xl md:text-4xl">💕</span>
            </div>
            <h1 className="text-2xl md:text-3xl 2xl:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
              English Speed Dating (Beta)
            </h1>
            <p className="text-sm md:text-base text-foreground/70">
              매칭까지 시간이 걸릴 수 있어요 ⏳
            </p>
          </div>

          {/* Status Section */}
          {!waiting ? (
            <div className="space-y-4 md:space-y-6">
              {/* Features */}
              <div className="grid grid-cols-3 gap-2 md:gap-3 mb-6">
                <div className="text-center p-3 rounded-xl bg-mint/10 border border-mint/20">
                  <span className="text-2xl md:text-3xl mb-1 block">🌍</span>
                  <p className="text-xs md:text-sm font-medium text-mint">
                    글로벌
                  </p>
                </div>
                <div className="text-center p-3 rounded-xl bg-purple/10 border border-purple/20">
                  <span className="text-2xl md:text-3xl mb-1 block">⏳</span>
                  <p className="text-xs md:text-sm font-medium text-purple">
                    대기 가능
                  </p>
                </div>
                <div className="text-center p-3 rounded-xl bg-orange/10 border border-orange/20">
                  <span className="text-2xl md:text-3xl mb-1 block">🔥</span>
                  <p className="text-xs md:text-sm font-medium text-orange">
                    핫매치
                  </p>
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={start}
                className="w-full px-6 py-4 md:py-5 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-bold text-base md:text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>매칭 시작하기</span>
                  <span className="text-xl">→</span>
                </span>
              </button>

              {/* Tips */}
              <div className="bg-background/50 rounded-xl p-4 border border-primary/10">
                <p className="text-xs md:text-sm text-foreground/60 leading-relaxed">
                  💡 <strong className="text-accent">Tip:</strong> 영어로만
                  대화하면 보너스 포인트를 받을 수 있어요. 매칭이 늦어도 조금만
                  기다려 주세요.
                </p>
              </div>

              {/* Live Stats */}
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="rounded-xl border border-primary/15 bg-surface/70 p-3 text-center">
                  <p className="text-xs md:text-sm text-foreground/60">
                    대기 중 유저
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-primary">
                    {stats ? stats.waitingCount.toLocaleString() : "-"}
                  </p>
                </div>
                <div className="rounded-xl border border-accent/15 bg-surface/70 p-3 text-center">
                  <p className="text-xs md:text-sm text-foreground/60">
                    진행 중 대화방
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-accent">
                    {stats ? stats.activeRooms.toLocaleString() : "-"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 md:space-y-6">
              {/* Waiting Animation */}
              <div className="relative h-32 md:h-40 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                </div>
                <div className="relative z-10 text-center">
                  <span className="text-4xl md:text-5xl animate-pulse">💝</span>
                  <p className="text-sm md:text-base font-medium text-primary mt-2">
                    {formatTime(elapsedTime)}
                  </p>
                </div>
              </div>

              {/* Waiting Message */}
              <div className="text-center space-y-2">
                <h2 className="text-lg md:text-xl font-bold text-accent">
                  파트너를 찾는 중...
                </h2>
                <p className="text-xs md:text-sm text-foreground/60">
                  현재 이용자가 많지 않아 시간이 걸릴 수 있어요.
                </p>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full animate-pulse"></div>
              </div>

              {/* Cancel Button */}
              <button
                onClick={cancel}
                className="w-full px-4 py-3 md:py-4 rounded-xl border-2 border-accent/30 text-accent font-semibold hover:bg-accent/10 transition-all duration-200"
              >
                매칭 취소
              </button>

              {/* Live Stats while waiting */}
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="rounded-xl border border-primary/15 bg-surface/70 p-3 text-center">
                  <p className="text-xs md:text-sm text-foreground/60">
                    대기 중 유저
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-primary">
                    {stats ? stats.waitingCount.toLocaleString() : "-"}
                  </p>
                </div>
                <div className="rounded-xl border border-accent/15 bg-surface/70 p-3 text-center">
                  <p className="text-xs md:text-sm text-foreground/60">
                    진행 중 대화방
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-accent">
                    {stats ? stats.activeRooms.toLocaleString() : "-"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 md:mt-6 p-4 rounded-xl bg-gradient-to-r from-orange/10 to-red-500/10 border border-orange/30">
              <p className="text-xs md:text-sm text-orange font-medium flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
