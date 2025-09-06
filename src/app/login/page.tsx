"use client";
import { useEffect, useState } from "react";
import { getBrowserClient } from "@/lib/supabaseClient";
import { ensurePendingProfile } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

  return (
    <div className="max-w-md mx-auto py-6 sm:py-10 px-4 sm:px-6 font-sans text-foreground">
      <div className="bg-surface rounded-lg sm:rounded-xl border border-primary/20 p-4 sm:p-6 lg:p-8 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-accent">
          로그인
        </h1>
        <form onSubmit={onLogin} className="space-y-3 sm:space-y-4">
          <input
            className="w-full border border-foreground/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 bg-background focus:border-primary focus:outline-none transition text-sm sm:text-base"
            placeholder="이메일"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full border border-foreground/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 bg-background focus:border-primary focus:outline-none transition text-sm sm:text-base"
            placeholder="비밀번호"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-2.5 sm:py-3 rounded-lg disabled:opacity-60 font-semibold hover:opacity-90 transition text-sm sm:text-base"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <Link
          href="/signup"
          className="mt-3 sm:mt-4 w-full block text-center border border-accent/30 text-accent py-2.5 sm:py-3 rounded-lg hover:bg-accent/10 transition text-sm sm:text-base"
        >
          회원가입
        </Link>
        {message && (
          <div className="mt-3 sm:mt-4 p-3 rounded-lg bg-mint/10 border border-mint/20">
            <p className="text-xs sm:text-sm text-mint">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
