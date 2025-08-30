"use client";
import { useState } from "react";
import { signUpWithEmail } from "@/lib/auth";

export default function SignupPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    nickname: "",
    gender: "",
    age_group: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await signUpWithEmail(form);
      if (res.needsEmailConfirmation) {
        setMessage("가입 완료! 이메일 인증 후 로그인해 주세요.");
      } else {
        setMessage("프로필이 생성되었습니다. 이제 로그인할 수 있어요.");
      }
    } catch (err: any) {
      setMessage(err.message ?? "회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto py-10 font-sans text-foreground">
      <h1 className="text-2xl font-bold mb-6">회원가입</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          className="w-full border rounded px-3 py-2 bg-background"
          placeholder="이메일"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="w-full border rounded px-3 py-2 bg-background"
          placeholder="비밀번호"
          type="password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <input
          className="w-full border rounded px-3 py-2 bg-background"
          placeholder="닉네임"
          required
          value={form.nickname}
          onChange={(e) => setForm({ ...form, nickname: e.target.value })}
        />
        <div className="flex gap-3">
          <input
            className="flex-1 border rounded px-3 py-2 bg-background"
            placeholder="성별(선택)"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          />
          <input
            className="flex-1 border rounded px-3 py-2 bg-background"
            placeholder="나이대(선택)"
            value={form.age_group}
            onChange={(e) => setForm({ ...form, age_group: e.target.value })}
          />
        </div>
        <button
          disabled={loading}
          className="w-full bg-foreground text-background py-2 rounded disabled:opacity-60"
        >
          {loading ? "가입 중..." : "가입하기"}
        </button>
      </form>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
}
