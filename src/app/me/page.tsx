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
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <div className="bg-surface rounded-xl border border-primary/20 p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-accent mb-6">마이페이지</h1>
        <div className="rounded-lg border border-mint/20 bg-mint/5 p-6 text-sm space-y-3">
          <div className="flex gap-2">
            <span className="w-28 text-foreground/60 font-medium">닉네임</span>
            <span className="text-foreground">{profile?.nickname ?? "-"}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-28 text-foreground/60 font-medium">성별</span>
            <span className="text-foreground">{profile?.gender ?? "-"}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-28 text-foreground/60 font-medium">나이대</span>
            <span className="text-foreground">{profile?.age_group ?? "-"}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-28 text-foreground/60 font-medium">포인트</span>
            <div className="flex items-center gap-3">
              <span className="text-primary font-semibold text-lg">
                {profile?.points ?? 0}P
              </span>
              <Link
                href="/charge"
                className="px-3 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition"
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
