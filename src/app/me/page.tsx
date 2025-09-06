import { getServerClient } from "@/lib/server/supabase";
import Link from "next/link";

export default async function MePage() {
  const supabase = await getServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-xl font-semibold mb-2">마이페이지</h1>
        <p className="text-sm text-foreground/70">로그인이 필요합니다.</p>
      </div>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname, gender, age_group, points, created_at")
    .eq("id", user.id)
    .single();

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-4">
      <div className="bg-surface rounded-lg md:rounded-xl border border-primary/20 p-4 md:p-6 2xl:p-8 shadow-sm">
        <h1 className="text-lg md:text-xl font-semibold text-accent mb-4 md:mb-6">
          마이페이지
        </h1>
        <div className="rounded-lg border border-mint/20 bg-mint/5 p-4 md:p-6 text-sm space-y-3 md:space-y-4">
          <div className="flex flex-col md:flex-row md:gap-2">
            <span className="w-full md:w-28 text-foreground/60 font-medium text-xs md:text-sm">
              닉네임
            </span>
            <span className="text-foreground text-sm md:text-base">
              {profile?.nickname ?? "-"}
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:gap-2">
            <span className="w-full md:w-28 text-foreground/60 font-medium text-xs md:text-sm">
              성별
            </span>
            <span className="text-foreground text-sm md:text-base">
              {profile?.gender ?? "-"}
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:gap-2">
            <span className="w-full md:w-28 text-foreground/60 font-medium text-xs md:text-sm">
              나이대
            </span>
            <span className="text-foreground text-sm md:text-base">
              {profile?.age_group ?? "-"}
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:gap-2">
            <span className="w-full md:w-28 text-foreground/60 font-medium text-xs md:text-sm">
              포인트
            </span>
            <div className="flex items-center gap-2 md:gap-3">
              <span className="text-primary font-semibold text-base md:text-lg">
                {profile?.points ?? 0}P
              </span>
              <Link
                href="/charge"
                className="px-2 md:px-3 py-1 rounded-md md:rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition"
              >
                충전
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
