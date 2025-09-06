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
  const [roomActive, setRoomActive] = useState(true);
  const [endedByOther, setEndedByOther] = useState(false);
  const [endedByMe, setEndedByMe] = useState(false);
  const [confirmEndOpen, setConfirmEndOpen] = useState(false);
  const END_NOTICE = "The other person has ended the chat.";

  // Whose turn: it's my turn if no messages yet or last sender is not me
  const myTurn = useMemo(() => {
    if (!userId) return false;
    const last = messages[messages.length - 1];
    if (!last) return true;
    return last.sender_id !== userId;
  }, [messages, userId]);

  const hasEndNotice = useMemo(() => {
    const t = END_NOTICE.toLowerCase();
    return messages.some(
      (m) =>
        typeof m.content === "string" && m.content.trim().toLowerCase() === t
    );
  }, [messages]);

  // Load history, room state, user/points, and subscribe to new messages
  useEffect(() => {
    if (!roomId) return;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function load() {
      // history
      const { data: msgs } = await supabase
        .from("messages")
        .select("id, sender_id, content, created_at")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });
      setMessages(msgs ?? []);

      // initial room state
      const { data: room } = await supabase
        .from("chat_rooms")
        .select("is_active")
        .eq("id", roomId)
        .single();
      if (room) setRoomActive(room.is_active);

      // user and points
      const { data: userRes } = await supabase.auth.getUser();
      const uid = userRes?.user?.id ?? null;
      setUserId(uid);
      if (uid) {
        const { data: prof } = await supabase
          .from("profiles")
          .select("points")
          .eq("id", uid)
          .single();
        if (typeof prof?.points === "number") setPoints(prof.points);
      }

      // realtime subscription for new messages
      channel = supabase
        .channel(`room:messages:${roomId}`)
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
              const nextList = [
                ...prev,
                {
                  id: m.id,
                  sender_id: m.sender_id,
                  content: m.content,
                  created_at: m.created_at,
                },
              ];
              // Detect end-chat notice from other side
              if (
                uid &&
                m.sender_id !== uid &&
                typeof m.content === "string" &&
                m.content.trim().toLowerCase() ===
                  "the other person has ended the chat."
              ) {
                setEndedByOther(true);
                setRoomActive(false);
              }
              return nextList;
            });
          }
        )
        .subscribe();
    }

    load();
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [roomId, supabase]);

  // Subscribe to room end (chat_rooms.is_active -> false) and redirect both sides
  useEffect(() => {
    if (!roomId) return;
    const ch = supabase
      .channel(`room:end:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "chat_rooms",
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          const next = (payload.new as any) || {};
          if (next.is_active === false) {
            setRoomActive(false);
            if (!endedByMe) setEndedByOther(true);
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [roomId, supabase, endedByMe]);

  // Fallback polling: detect room end even if Realtime is not enabled on chat_rooms
  useEffect(() => {
    if (!roomId || endedByMe || !roomActive) return;
    const interval = setInterval(async () => {
      const { data: room } = await supabase
        .from("chat_rooms")
        .select("is_active")
        .eq("id", roomId)
        .single();
      if (room && room.is_active === false) {
        setRoomActive(false);
        setEndedByOther(true);
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [roomId, supabase, endedByMe, roomActive]);

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
      // 종료 후 매칭 페이지로 이동 (내가 종료한 쪽만 이동)
      setEndedByMe(true);
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
            const isEndNotice =
              typeof m.content === "string" &&
              m.content.trim().toLowerCase() === END_NOTICE.toLowerCase();
            if (isEndNotice) {
              return (
                <div key={m.id} className="flex justify-center">
                  <div className="inline-block px-3 py-2 text-xs md:text-sm rounded-lg bg-accent/10 border border-accent/20 text-accent">
                    {END_NOTICE}
                  </div>
                </div>
              );
            }
            const isMe = userId && m.sender_id === userId;
            return (
              <div
                key={m.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] text-xs md:text-sm p-2 md:p-3 rounded-xl shadow-sm border ${
                    isMe
                      ? "bg-primary text-primary-foreground border-primary/30"
                      : "bg-background/80 text-foreground border-primary/10"
                  }`}
                >
                  <div
                    className={`mb-1 text-[10px] uppercase tracking-wide ${
                      isMe ? "text-primary-foreground/80" : "text-foreground/60"
                    }`}
                  >
                    {isMe ? "me" : "you"}
                  </div>
                  <div className="break-words">{m.content}</div>
                </div>
              </div>
            );
          })
        )}

        {/* Notice when the other person ended the chat */}
        {endedByOther && !hasEndNotice && (
          <div className="mt-3 text-center">
            <span className="inline-block px-3 py-2 text-xs md:text-sm rounded-lg bg-orange-100/80 dark:bg-orange-900/20 border border-orange-300/40 text-orange">
              The other person has ended the chat.
            </span>
          </div>
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
          disabled={
            sending ||
            (points !== null && points <= 0) ||
            !myTurn ||
            !roomActive
          }
        />
        <div className="flex gap-2 md:gap-2">
          <button
            onClick={send}
            className="flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 rounded-lg bg-primary text-primary-foreground disabled:opacity-50 font-semibold hover:opacity-90 transition text-sm"
            disabled={
              sending ||
              (points !== null && points <= 0) ||
              !myTurn ||
              !roomActive
            }
          >
            전송
          </button>
          <button
            onClick={() => setConfirmEndOpen(true)}
            className="px-3 md:px-4 py-2 md:py-3 rounded-lg border border-accent/30 hover:bg-accent/10 text-accent font-medium transition text-sm"
          >
            소개팅 종료
          </button>
          {(points !== null || !myTurn) && (
            <div className="px-2 md:px-3 py-2 rounded-lg bg-mint/10 border border-mint/20 flex items-center">
              {points !== null && (
                <span className="text-xs text-mint font-medium mr-2">
                  {points}P
                </span>
              )}
              {!myTurn && (
                <span className="text-[11px] text-foreground/60">
                  상대 차례입니다…
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Responsive confirm dialog for ending chat */}
      {confirmEndOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setConfirmEndOpen(false)}
          />
          <div
            role="alertdialog"
            aria-modal="true"
            aria-live="assertive"
            className="relative rounded-xl border border-primary/20 bg-background shadow-xl px-5 py-4 w-[92vw] max-w-md"
          >
            <div className="flex flex-col gap-4">
              <div className="text-sm text-foreground/90 text-center sm:text-left break-keep whitespace-pre-wrap">
                정말로 대화를 종료할까요?
              </div>
              <div className="flex gap-2 justify-center sm:justify-end flex-wrap">
                <button
                  onClick={() => setConfirmEndOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-foreground/20 text-foreground/80 hover:bg-foreground/5 text-sm whitespace-nowrap min-w-[64px]"
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    setConfirmEndOpen(false);
                    endChat();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-accent text-white hover:opacity-90 text-sm whitespace-nowrap min-w-[92px]"
                >
                  지금 종료
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
