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
      <div className="bg-surface rounded-xl border border-primary/20 p-8 shadow-sm">
        <h1 className="text-2xl font-bold mb-6 text-accent">회원가입</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            className="w-full border border-foreground/20 rounded-lg px-4 py-3 bg-background focus:border-primary focus:outline-none transition"
            placeholder="이메일"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="w-full border border-foreground/20 rounded-lg px-4 py-3 bg-background focus:border-primary focus:outline-none transition"
            placeholder="비밀번호"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <input
            className="w-full border border-foreground/20 rounded-lg px-4 py-3 bg-background focus:border-primary focus:outline-none transition"
            placeholder="닉네임"
            required
            value={form.nickname}
            onChange={(e) => setForm({ ...form, nickname: e.target.value })}
          />
          <div className="flex gap-3">
            <select
              className="flex-1 border border-foreground/20 rounded-lg px-4 py-3 bg-background focus:border-primary focus:outline-none transition"
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="">성별(선택)</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
              <option value="other">기타/선택안함</option>
            </select>
            <select
              className="flex-1 border border-foreground/20 rounded-lg px-4 py-3 bg-background focus:border-primary focus:outline-none transition"
              value={form.age_group}
              onChange={(e) => setForm({ ...form, age_group: e.target.value })}
            >
              <option value="">나이대(선택)</option>
              <option value="teens">10대</option>
              <option value="20s">20대</option>
              <option value="30s">30대</option>
              <option value="40s">40대</option>
              <option value="50s+">50대 이상</option>
            </select>
          </div>
          <button
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg disabled:opacity-60 font-semibold hover:opacity-90 transition"
          >
            {loading ? "가입 중..." : "가입하기"}
          </button>
        </form>
        {message && (
          <div className="mt-4 p-3 rounded-lg bg-mint/10 border border-mint/20">
            <p className="text-sm text-mint">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
