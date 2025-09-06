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

  return (
    <div className="max-w-5xl mx-auto p-6 font-sans text-foreground">
      <h1 className="text-2xl font-bold text-accent mb-4">Admin Dashboard</h1>
      {error && (
        <div className="p-3 rounded-lg bg-orange/10 border border-orange/20 text-orange mb-4">
          {error.message}
        </div>
      )}
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
