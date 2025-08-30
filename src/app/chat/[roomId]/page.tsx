"use client";
import { useEffect, useRef, useState } from "react";
import { getBrowserClient } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";

export default function ChatRoomPage() {
  const supabase = getBrowserClient();
  const { roomId } = useParams<{ roomId: string }>();
  const [messages, setMessages] = useState<
    Array<{
      id: number;
      sender_id: string;
      content: string;
      created_at: string;
    }>
  >([]);
  const [input, setInput] = useState("");
  const [points, setPoints] = useState<number | null>(null);
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // Load history
  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("messages")
        .select("id, sender_id, content, created_at")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });
      setMessages(data ?? []);

      // fetch current points
      const { data: userData } = await supabase.auth.getUser();
      const u = userData.user;
      if (u) {
        const { data: prof } = await supabase
          .from("profiles")
          .select("points")
          .eq("id", u.id)
          .single();
        setPoints(prof?.points ?? 0);
      }
    }
    if (roomId) load();
  }, [roomId, supabase]);

  // Subscribe realtime
  useEffect(() => {
    if (!roomId) return;
    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const m = payload.new as any;
          setMessages((prev) => [
            ...prev,
            {
              id: m.id,
              sender_id: m.sender_id,
              content: m.content,
              created_at: m.created_at,
            },
          ]);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, supabase]);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function send() {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (points !== null && points <= 0) {
      alert("포인트가 부족합니다. (한국어 사용 시 -1)");
      return;
    }
    // Client-side pre-check for Korean
    const hasKorean = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]/.test(trimmed);
    if (
      hasKorean &&
      !confirm(
        "한국어가 감지되었습니다. 전송 시 -1 포인트가 차감됩니다. 계속하시겠습니까?"
      )
    ) {
      return;
    }
    try {
      setSending(true);
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, content: trimmed }),
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json?.error || "전송 실패");
        return;
      }
      setInput("");
      if (typeof json.points === "number") setPoints(json.points);
    } finally {
      setSending(false);
    }
  }

  async function endChat() {
    try {
      const res = await fetch("/api/chat/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId }),
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json?.error || "종료 실패");
        return;
      }
      if (json.rewarded) {
        alert(`영어만 사용 성공! +${json.gained} 포인트`);
        if (typeof json.points === "number") setPoints(json.points);
      } else if (json.reason === "korean_used") {
        alert("한국어가 사용되어 보상은 없습니다.");
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-6 h-[calc(100vh-80px)] flex flex-col">
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto rounded border border-foreground/15 p-4 space-y-3 bg-background"
      >
        {messages.map((m) => (
          <div key={m.id} className="text-sm">
            <span className="font-mono text-foreground/60 mr-2">
              {m.sender_id.slice(0, 6)}
            </span>
            <span>{m.content}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2 items-center">
        <input
          className="flex-1 border rounded px-3 py-2 bg-background"
          placeholder="메시지를 입력하세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          disabled={sending || (points !== null && points <= 0)}
        />
        <button
          onClick={send}
          className="px-4 py-2 rounded bg-foreground text-background disabled:opacity-50"
          disabled={sending || (points !== null && points <= 0)}
        >
          전송
        </button>
        <button
          onClick={endChat}
          className="px-3 py-2 rounded border border-foreground/20"
        >
          종료
        </button>
        {points !== null && (
          <span className="text-sm text-foreground/60">포인트: {points}</span>
        )}
      </div>
    </div>
  );
}
