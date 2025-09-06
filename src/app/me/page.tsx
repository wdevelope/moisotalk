import { getServerClient } from "@/lib/server/supabase";
import Link from "next/link";

export default async function MePage() {
  const supabase = await getServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-4">
            <span className="text-4xl">🔒</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            로그인이 필요합니다
          </h1>
          <p className="text-sm md:text-base text-foreground/60">
            마이페이지를 보려면 먼저 로그인해주세요
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold hover:shadow-lg transition-all"
          >
            로그인하기 →
          </Link>
        </div>
      </div>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname, gender, age_group, points, created_at, role")
    .eq("id", user.id)
    .single();

  // Calculate days since joined
  const joinedDate = profile?.created_at
    ? new Date(profile.created_at)
    : new Date();
  const daysSinceJoined = Math.floor(
    (Date.now() - joinedDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-[calc(100vh-12rem)] py-6 md:py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header Card */}
        <div className="bg-gradient-to-br from-primary/5 via-surface to-accent/5 rounded-2xl md:rounded-3xl border border-primary/20 p-6 md:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar Section */}
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <span className="text-4xl md:text-5xl text-white font-bold">
                  {profile?.nickname?.charAt(0)?.toUpperCase() || "?"}
                </span>
              </div>
              <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-mint text-white text-xs font-semibold shadow-md">
                Level 1
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  {profile?.nickname || "익명 유저"}
                </h1>
                <p className="text-sm text-foreground/60 mt-1">
                  @{user.email?.split("@")[0] || "user"}
                </p>
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <div className="px-3 py-1.5 rounded-lg bg-purple/10 border border-purple/20">
                  <span className="text-xs text-purple font-medium">
                    {profile?.gender === "male"
                      ? "👨 남성"
                      : profile?.gender === "female"
                      ? "👩 여성"
                      : "🧑 기타"}
                  </span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-orange/10 border border-orange/20">
                  <span className="text-xs text-orange font-medium">
                    🎂 {profile?.age_group || "나이 미설정"}
                  </span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-mint/10 border border-mint/20">
                  <span className="text-xs text-mint font-medium">
                    📅 {daysSinceJoined}일차
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Points Card */}
          <div className="bg-gradient-to-br from-primary/10 to-accent/5 rounded-xl md:rounded-2xl border border-primary/20 p-5 md:p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-bold text-foreground flex items-center gap-2">
                <span className="text-2xl">💎</span>
                포인트
              </h2>
              <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                Balance
              </span>
            </div>

            <div className="space-y-4">
              <div className="text-center py-4">
                <p className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {profile?.points || 0}
                </p>
                <p className="text-sm text-foreground/60 mt-1">보유 포인트</p>
              </div>

              <Link
                href="/charge"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all"
              >
                <span>💳</span>
                <span>포인트 충전하기</span>
                <span>→</span>
              </Link>

              <div className="pt-3 border-t border-foreground/10">
                <p className="text-xs text-foreground/50 text-center">
                  영어로만 대화하면 +2 포인트 보너스!
                </p>
              </div>
            </div>
          </div>

          {/* Activity Card */}
          <div className="bg-gradient-to-br from-mint/10 to-purple/5 rounded-xl md:rounded-2xl border border-mint/20 p-5 md:p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-bold text-foreground flex items-center gap-2">
                <span className="text-2xl">📊</span>
                활동 통계
              </h2>
              <span className="px-2 py-1 rounded-full bg-mint/20 text-mint text-xs font-medium">
                Beta
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-background/50">
                <p className="text-2xl md:text-3xl font-bold text-primary">0</p>
                <p className="text-xs text-foreground/60 mt-1">총 매칭</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-background/50">
                <p className="text-2xl md:text-3xl font-bold text-accent">0</p>
                <p className="text-xs text-foreground/60 mt-1">대화 횟수</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-background/50">
                <p className="text-2xl md:text-3xl font-bold text-mint">0%</p>
                <p className="text-xs text-foreground/60 mt-1">영어 사용률</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-background/50">
                <p className="text-2xl md:text-3xl font-bold text-purple">⭐</p>
                <p className="text-xs text-foreground/60 mt-1">평점</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-foreground/10">
              <p className="text-xs text-foreground/50 text-center">
                통계는 곧 업데이트 예정입니다
              </p>
            </div>
          </div>
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {profile?.role === "admin" && (
            <Link
              href="/admin"
              className="group relative overflow-hidden rounded-xl border border-accent/30 bg-accent/5 p-4 hover:shadow-md transition-all"
            >
              <div className="relative z-10 flex items-center gap-3">
                <span className="text-2xl">🛠️</span>
                <div>
                  <p className="font-semibold text-sm text-foreground">
                    운영자 페이지
                  </p>
                  <p className="text-xs text-foreground/60">
                    유저/매칭 통계 보기
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-primary/10 translate-x-full group-hover:translate-x-0 transition-transform"></div>
            </Link>
          )}
          <Link
            href="/settings"
            className="group relative overflow-hidden rounded-xl border border-purple/20 bg-surface/50 p-4 hover:shadow-md transition-all"
          >
            <div className="relative z-10 flex items-center gap-3">
              <span className="text-2xl">⚙️</span>
              <div>
                <p className="font-semibold text-sm text-foreground">설정</p>
                <p className="text-xs text-foreground/60">프로필 수정</p>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple/10 to-pink-500/10 translate-x-full group-hover:translate-x-0 transition-transform"></div>
          </Link>

          <Link
            href="/help"
            className="group relative overflow-hidden rounded-xl border border-mint/20 bg-surface/50 p-4 hover:shadow-md transition-all"
          >
            <div className="relative z-10 flex items-center gap-3">
              <span className="text-2xl">💬</span>
              <div>
                <p className="font-semibold text-sm text-foreground">도움말</p>
                <p className="text-xs text-foreground/60">FAQ & 지원</p>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-mint/10 to-teal-500/10 translate-x-full group-hover:translate-x-0 transition-transform"></div>
          </Link>
        </div>
      </div>
    </div>
  );
}
