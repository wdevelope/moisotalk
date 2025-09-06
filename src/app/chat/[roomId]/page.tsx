"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { getBrowserClient } from "@/lib/supabaseClient";
import { useParams, useRouter } from "next/navigation";

export default function ChatRoomPage() {
  const supabase = getBrowserClient();
  const { roomId } = useParams<{ roomId: string }>();
  const router = useRouter();
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
  const [userId, setUserId] = useState<string | null>(null);

  // Whose turn: it's my turn if no messages yet or last sender is not me
  const myTurn = useMemo(() => {
    if (!userId) return false;
    const last = messages[messages.length - 1];
    if (!last) return true;
    return last.sender_id !== userId;
  }, [messages, userId]);

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
        setUserId(u.id);
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
          setMessages((prev) => {
            if (prev.some((x) => x.id === m.id)) return prev;
            return [
              ...prev,
              {
                id: m.id,
                sender_id: m.sender_id,
                content: m.content,
                created_at: m.created_at,
              },
            ];
          });
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.debug(`[realtime] subscribed room:${roomId}`);
        } else if (status === "CHANNEL_ERROR") {
          console.error(`[realtime] channel error room:${roomId}`);
        }
      });
    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, supabase]);

  // Subscribe to room end (chat_rooms.is_active -> false) and redirect both sides
  useEffect(() => {
    if (!roomId) return;
    const ch = supabase
      .channel(`room:end:${roomId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "chat_rooms", filter: `id=eq.${roomId}` },
        (payload) => {
          const next = (payload.new as any) || {};
          if (next.is_active === false) {
            alert("상대가 대화를 종료했어요.");
            router.push("/match");
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [roomId, supabase, router]);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // Fallback polling in case Realtime is not enabled or delayed
  useEffect(() => {
    if (!roomId) return;
    const interval = setInterval(async () => {
      const lastId = messages[messages.length - 1]?.id;
      const lastCreated = messages[messages.length - 1]?.created_at;
      let q = supabase
        .from("messages")
        .select("id, sender_id, content, created_at")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });
      if (lastCreated) {
        q = q.gt("created_at", lastCreated);
      }
      const { data } = await q;
      if (data && data.length) {
        setMessages((prev) => {
          const next = [...prev];
          for (const m of data) {
            if (!next.some((x) => x.id === m.id)) next.push(m as any);
          }
          return next;
        });
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [roomId, supabase, messages]);

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
      // Optimistically append the message so the sender sees it immediately
      if (json?.message) {
        const m = json.message;
        setMessages((prev) => {
          if (prev.some((x) => x.id === m.id)) return prev;
          return [
            ...prev,
            {
              id: m.id,
              sender_id: m.sender_id,
              content: m.content,
              created_at: m.created_at,
            },
          ];
        });
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
  // 종료 후 매칭 페이지로 이동
  router.push("/match");
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-4 md:py-6 px-4 md:px-6 h-[calc(100vh-60px)] md:h-[calc(100vh-80px)] flex flex-col">
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto rounded-lg md:rounded-xl border border-primary/20 p-3 md:p-4 space-y-2 md:space-y-3 bg-gradient-to-br from-surface to-background"
      >
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center p-4 md:p-6 rounded-lg md:rounded-xl bg-background/80 border border-primary/10 backdrop-blur-sm max-w-sm">
              <div className="text-purple text-base md:text-lg font-semibold mb-2">
                소개팅 시작! 💕
              </div>
              <p className="text-foreground/70 text-xs md:text-sm">
                영어로 대화해보세요. 한국어 사용 시 포인트가 차감됩니다.
              </p>
            </div>
          </div>
        ) : (
          messages.map((m) => {
            const isMe = userId && m.sender_id === userId;
            return (
              <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] text-xs md:text-sm p-2 md:p-3 rounded-xl shadow-sm border ${
                    isMe
                      ? "bg-primary text-primary-foreground border-primary/30"
                      : "bg-background/80 text-foreground border-primary/10"
                  }`}
                >
                  <div className={`mb-1 text-[10px] uppercase tracking-wide ${isMe ? "text-primary-foreground/80" : "text-foreground/60"}`}>
                    {isMe ? "me" : "you"}
                  </div>
                  <div className="break-words">{m.content}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="mt-3 md:mt-4 flex flex-col md:flex-row gap-2 items-stretch md:items-center p-3 md:p-4 bg-surface rounded-lg md:rounded-xl border border-primary/20">
        <input
          className="flex-1 border border-foreground/20 rounded-lg px-3 md:px-4 py-2 md:py-3 bg-background focus:border-primary focus:outline-none transition text-sm"
          placeholder="영어로 대화해보세요..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          disabled={sending || (points !== null && points <= 0) || !myTurn}
        />
        <div className="flex gap-2 md:gap-2">
          <button
            onClick={send}
            className="flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 rounded-lg bg-primary text-primary-foreground disabled:opacity-50 font-semibold hover:opacity-90 transition text-sm"
            disabled={sending || (points !== null && points <= 0) || !myTurn}
          >
            전송
          </button>
          <button
            onClick={endChat}
            className="px-3 md:px-4 py-2 md:py-3 rounded-lg border border-accent/30 hover:bg-accent/10 text-accent font-medium transition text-sm"
          >
            소개팅 종료
          </button>
          {(points !== null || !myTurn) && (
            <div className="px-2 md:px-3 py-2 rounded-lg bg-mint/10 border border-mint/20 flex items-center">
              {points !== null && (
                <span className="text-xs text-mint font-medium mr-2">{points}P</span>
              )}
              {!myTurn && (
                <span className="text-[11px] text-foreground/60">상대 차례입니다…</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
