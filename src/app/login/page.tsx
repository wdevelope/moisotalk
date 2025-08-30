"use client";
import { useEffect, useState } from "react";
import { getBrowserClient } from "@/lib/supabaseClient";
import { ensurePendingProfile } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const supabase = getBrowserClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // After login (or if already logged in), ensure pending profile creation
    ensurePendingProfile().catch(() => {});
  }, []);

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setMessage(error.message);
    else {
      setMessage("로그인 성공");
      router.push("/");
    }
    setLoading(false);
    // Try to finalize pending profile after login
    ensurePendingProfile().catch(() => {});
  }

  async function onLogout() {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    setMessage("로그아웃 되었습니다.");
  }

  return (
    <div className="max-w-md mx-auto py-10 font-sans text-foreground">
      <div className="bg-surface rounded-xl border border-primary/20 p-8 shadow-sm">
        <h1 className="text-2xl font-bold mb-6 text-accent">로그인</h1>
        <form onSubmit={onLogin} className="space-y-4">
          <input
            className="w-full border border-foreground/20 rounded-lg px-4 py-3 bg-background focus:border-primary focus:outline-none transition"
            placeholder="이메일"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full border border-foreground/20 rounded-lg px-4 py-3 bg-background focus:border-primary focus:outline-none transition"
            placeholder="비밀번호"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg disabled:opacity-60 font-semibold hover:opacity-90 transition"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <button
          onClick={onLogout}
          className="mt-4 w-full border border-accent/30 text-accent py-3 rounded-lg hover:bg-accent/10 transition"
        >
          로그아웃
        </button>
        {message && (
          <div className="mt-4 p-3 rounded-lg bg-mint/10 border border-mint/20">
            <p className="text-sm text-mint">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
