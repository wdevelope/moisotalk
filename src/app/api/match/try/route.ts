import { NextRequest, NextResponse } from "next/server";
import { getServerClient } from "@/lib/server/supabase";

// POST /api/match/try -> attempt to find or create match and return room id
export async function POST(_req: NextRequest) {
  const supabase = await getServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data, error } = await supabase.rpc("find_or_create_match", { p_user: user.id });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ roomId: data });
}
