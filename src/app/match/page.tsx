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
    <div className="max-w-lg mx-auto py-10 font-sans text-foreground">
      <h1 className="text-2xl font-bold mb-4">랜덤 매칭</h1>
      <p className="text-sm text-foreground/80 mb-6">
        대기열에 등록하면 다른 사용자와 무작위로 매칭됩니다.
      </p>
      <div className="flex gap-3">
        <button
          onClick={start}
          disabled={waiting}
          className="px-4 py-2 rounded bg-foreground text-background disabled:opacity-60"
        >
          {waiting ? "대기 중..." : "채팅 시작"}
        </button>
        {waiting && (
          <button
            onClick={cancel}
            className="px-4 py-2 rounded border border-foreground/20"
          >
            취소
          </button>
        )}
      </div>
      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
    </div>
  );
}
