import { getServerClient } from "@/lib/server/supabase";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await getServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6 font-sans text-foreground">
        <h1 className="text-2xl font-bold text-accent mb-4">Admin</h1>
        <p className="text-foreground/80">로그인이 필요합니다.</p>
      </div>
    );
  }

  // Check role
  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!me || me.role !== "admin") {
    return (
      <div className="max-w-4xl mx-auto p-6 font-sans text-foreground">
        <h1 className="text-2xl font-bold text-accent mb-4">Admin</h1>
        <p className="text-foreground/80">접근 권한이 없습니다.</p>
      </div>
    );
  }

  // For admins, list recent profiles
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, nickname, gender, age_group, role, points, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  // Aggregate stats
  const [{ count: roomsTotal }, { count: roomsActive }] = await Promise.all([
    supabase.from("chat_rooms").select("id", { count: "exact", head: true }),
    supabase
      .from("chat_rooms")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
  ]);
  const [{ count: totalParticipants }, { count: totalMessages }] =
    await Promise.all([
      supabase
        .from("chat_participants")
        .select("room_id", { count: "exact", head: true }),
      supabase.from("messages").select("id", { count: "exact", head: true }),
    ]);

  return (
    <div className="max-w-5xl mx-auto p-6 font-sans text-foreground">
      <h1 className="text-2xl font-bold text-accent mb-4">Admin Dashboard</h1>
      {error && (
        <div className="p-3 rounded-lg bg-orange/10 border border-orange/20 text-orange mb-4">
          {error.message}
        </div>
      )}
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <div className="p-4 rounded-xl bg-background border border-primary/20">
          <div className="text-xs text-foreground/60">총 채팅방</div>
          <div className="text-xl font-bold text-accent">{roomsTotal ?? 0}</div>
        </div>
        <div className="p-4 rounded-xl bg-background border border-primary/20">
          <div className="text-xs text-foreground/60">진행중 채팅방</div>
          <div className="text-xl font-bold text-primary">
            {roomsActive ?? 0}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-background border border-primary/20">
          <div className="text-xs text-foreground/60">총 매칭 참가자수</div>
          <div className="text-xl font-bold text-purple">
            {totalParticipants ?? 0}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-background border border-primary/20">
          <div className="text-xs text-foreground/60">총 메시지</div>
          <div className="text-xl font-bold text-mint">
            {totalMessages ?? 0}
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="overflow-x-auto bg-surface rounded-xl border border-primary/20">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left bg-accent/10">
              <th className="p-3">Nickname</th>
              <th className="p-3">Gender</th>
              <th className="p-3">Age</th>
              <th className="p-3">Role</th>
              <th className="p-3">Points</th>
              <th className="p-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {profiles?.map((p) => (
              <tr key={p.id} className="border-t border-foreground/10">
                <td className="p-3 font-medium">{p.nickname}</td>
                <td className="p-3">{p.gender || "-"}</td>
                <td className="p-3">{p.age_group || "-"}</td>
                <td className="p-3">{p.role}</td>
                <td className="p-3">{p.points}</td>
                <td className="p-3">
                  {new Date(p.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
