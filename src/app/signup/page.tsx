"use client";
import { useState } from "react";
import { signUpWithEmail } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";

export default function SignupPage() {
  const router = useRouter();
  const { show } = useToast();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    gender: "",
    age_group: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    // 비밀번호 확인
    if (form.password !== form.confirmPassword) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return;
    }
    setLoading(true);
    try {
      // 필요한 필드만 전달
      const res = await signUpWithEmail({
        email: form.email,
        password: form.password,
        nickname: form.nickname,
        gender: form.gender,
        age_group: form.age_group,
      });
      // 이메일 인증이 켜져있는 경우: 안내 메시지 표시, 아니면 로그인으로 이동
      if (
        res &&
        "needsEmailConfirmation" in res &&
        res.needsEmailConfirmation
      ) {
        const msg = "가입 완료! 이메일 인증 후 로그인해 주세요.";
        setMessage(msg);
        show(msg, { variant: "info" });
      } else {
        router.replace("/login");
      }
      return;
    } catch (err: any) {
      setMessage(err.message ?? "회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto py-6 md:py-10 px-4 md:px-6 font-sans text-foreground">
      <div className="bg-surface rounded-lg md:rounded-xl border border-primary/20 p-4 md:p-6 2xl:p-8 shadow-sm">
        <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-accent">
          회원가입
        </h1>
        <form onSubmit={onSubmit} className="space-y-3 md:space-y-4">
          <input
            className="w-full border border-foreground/20 rounded-lg px-3 md:px-4 py-2.5 md:py-3 bg-background focus:border-primary focus:outline-none transition text-sm md:text-base"
            placeholder="이메일"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="w-full border border-foreground/20 rounded-lg px-3 md:px-4 py-2.5 md:py-3 bg-background focus:border-primary focus:outline-none transition text-sm md:text-base"
            placeholder="비밀번호"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <div>
            <input
              className="w-full border border-foreground/20 rounded-lg px-3 md:px-4 py-2.5 md:py-3 bg-background focus:border-primary focus:outline-none transition text-sm md:text-base"
              placeholder="비밀번호 확인"
              type="password"
              required
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <p className="mt-1 text-xs md:text-sm text-orange">
                비밀번호가 일치하지 않습니다.
              </p>
            )}
          </div>
          <input
            className="w-full border border-foreground/20 rounded-lg px-3 md:px-4 py-2.5 md:py-3 bg-background focus:border-primary focus:outline-none transition text-sm md:text-base"
            placeholder="닉네임"
            required
            value={form.nickname}
            onChange={(e) => setForm({ ...form, nickname: e.target.value })}
          />
          <div className="flex flex-col md:flex-row gap-2 md:gap-3">
            <select
              className="flex-1 border border-foreground/20 rounded-lg px-3 md:px-4 py-2.5 md:py-3 bg-background focus:border-primary focus:outline-none transition text-sm md:text-base"
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              required
            >
              <option value="">성별 선택</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
            </select>
            <select
              className="flex-1 border border-foreground/20 rounded-lg px-3 md:px-4 py-2.5 md:py-3 bg-background focus:border-primary focus:outline-none transition text-sm md:text-base"
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
            disabled={
              loading ||
              (Boolean(form.password) &&
                Boolean(form.confirmPassword) &&
                form.password !== form.confirmPassword)
            }
            className="w-full bg-primary text-primary-foreground py-2.5 md:py-3 rounded-lg disabled:opacity-60 font-semibold hover:opacity-90 transition text-sm md:text-base"
          >
            {loading ? "가입 중..." : "가입하기"}
          </button>
        </form>
        {message && (
          <div className="mt-3 md:mt-4 p-3 rounded-lg bg-orange/10 border border-orange/20">
            <p className="text-xs md:text-sm text-orange">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
