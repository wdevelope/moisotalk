"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function MatchPage() {
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
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
    await fetch("/api/match/cancel", { method: "POST" });
    setWaiting(false);
  }

  return (
    <div className="max-w-lg mx-auto py-6 md:py-10 px-4 md:px-6 font-sans text-foreground">
      <div className="bg-surface rounded-lg md:rounded-xl border border-primary/20 p-4 md:p-6 2xl:p-8 shadow-sm">
        <h1 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-accent">
          랜덤 소개팅
        </h1>
        <p className="text-xs md:text-sm text-foreground/80 mb-4 md:mb-6">
          대기열에 등록하면 다른 사용자와 무작위로 소개팅 매칭됩니다.
        </p>
        <div className="flex flex-col md:flex-row gap-2 md:gap-3">
          <button
            onClick={start}
            disabled={waiting}
            className="px-4 md:px-6 py-2.5 md:py-3 rounded-lg bg-primary text-primary-foreground disabled:opacity-60 font-semibold hover:opacity-90 transition flex-1 text-sm md:text-base"
          >
            {waiting ? "매칭 대기 중..." : "소개팅 시작"}
          </button>
          {waiting && (
            <button
              onClick={cancel}
              className="px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-accent/30 hover:bg-accent/10 text-accent font-medium transition text-sm md:text-base"
            >
              취소
            </button>
          )}
        </div>
        {error && (
          <div className="mt-3 md:mt-4 p-3 rounded-lg bg-orange/10 border border-orange/20">
            <p className="text-xs md:text-sm text-orange">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
