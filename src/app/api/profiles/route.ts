import { NextRequest, NextResponse } from "next/server";
import { getServerClient } from "@/lib/server/supabase";

// POST /api/profiles
// Body: { id: string (auth.users.id), nickname: string, gender?: string, age_group?: string }
export async function POST(req: NextRequest) {
  const supabase = await getServerClient();
  const body = await req.json().catch(() => ({}));
  const { id, nickname, gender, age_group } = body || {};

  if (!id || !nickname) {
    return NextResponse.json({ error: "id and nickname are required" }, { status: 400 });
  }

  // Ensure requester is the same as payload id
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.id !== id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .insert({ id, nickname, gender, age_group })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ profile: data });
}
