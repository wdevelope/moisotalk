import { getServerClient } from "@/lib/server/supabase";

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
      <h1 className="text-xl font-semibold">마이페이지</h1>
      <div className="rounded border border-foreground/15 p-4 text-sm">
        <div className="flex gap-2"><span className="w-28 text-foreground/60">닉네임</span><span>{profile?.nickname ?? '-'}</span></div>
        <div className="flex gap-2"><span className="w-28 text-foreground/60">성별</span><span>{profile?.gender ?? '-'}</span></div>
        <div className="flex gap-2"><span className="w-28 text-foreground/60">나이대</span><span>{profile?.age_group ?? '-'}</span></div>
        <div className="flex gap-2"><span className="w-28 text-foreground/60">포인트</span><span>{profile?.points ?? 0}</span></div>
      </div>
    </div>
  );
}
