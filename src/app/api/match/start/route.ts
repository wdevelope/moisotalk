import { NextRequest, NextResponse } from "next/server";
import { getServerClient } from "@/lib/server/supabase";

// POST /api/match/start -> enqueue current user into waiting_pool
export async function POST(_req: NextRequest) {
  const supabase = await getServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("waiting_pool")
    .upsert(
      { user_id: user.id, enqueued_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
