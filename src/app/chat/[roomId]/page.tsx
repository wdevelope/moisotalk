'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getBrowserClient } from '@/lib/supabaseClient';
import { useParams } from 'next/navigation';

export default function ChatRoomPage() {
  const supabase = getBrowserClient();
  const { roomId } = useParams<{ roomId: string }>();
  const [messages, setMessages] = useState<Array<{ id: number; sender_id: string; content: string; created_at: string }>>([]);
  const [input, setInput] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  // Load history
  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('messages')
        .select('id, sender_id, content, created_at')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });
      setMessages(data ?? []);
    }
    if (roomId) load();
  }, [roomId, supabase]);

  // Subscribe realtime
  useEffect(() => {
    if (!roomId) return;
    const channel = supabase
      .channel(`room:${roomId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${roomId}` }, (payload) => {
        const m = payload.new as any;
        setMessages((prev) => [...prev, { id: m.id, sender_id: m.sender_id, content: m.content, created_at: m.created_at }]);
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, supabase]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  async function send() {
    const trimmed = input.trim();
    if (!trimmed) return;
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return;
    await supabase.from('messages').insert({ room_id: roomId, sender_id: user.id, content: trimmed });
    setInput('');
  }

  return (
    <div className="max-w-3xl mx-auto py-6 h-[calc(100vh-80px)] flex flex-col">
      <div ref={listRef} className="flex-1 overflow-y-auto rounded border border-foreground/15 p-4 space-y-3 bg-background">
        {messages.map((m) => (
          <div key={m.id} className="text-sm">
            <span className="font-mono text-foreground/60 mr-2">{m.sender_id.slice(0, 6)}</span>
            <span>{m.content}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2 bg-background"
          placeholder="메시지를 입력하세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') send();
          }}
        />
        <button onClick={send} className="px-4 py-2 rounded bg-foreground text-background">
          전송
        </button>
      </div>
    </div>
  );
}
