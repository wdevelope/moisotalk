'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ChatHomePage() {
  const router = useRouter();
  const [roomId, setRoomId] = useState('');
  return (
    <div className="max-w-lg mx-auto py-10 font-sans text-foreground">
      <h1 className="text-2xl font-bold mb-4">채팅</h1>
      <div className="space-y-4">
        <button
          className="w-full px-4 py-2 rounded bg-foreground text-background"
          onClick={() => router.push('/match')}
        >
          랜덤 매칭 시작
        </button>
        <div className="flex gap-2">
          <input
            className="flex-1 border rounded px-3 py-2 bg-background"
            placeholder="방 ID 입력"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button
            className="px-4 py-2 rounded border border-foreground/20"
            onClick={() => roomId && router.push(`/chat/${roomId}`)}
          >
            입장
          </button>
        </div>
      </div>
    </div>
  );
}
