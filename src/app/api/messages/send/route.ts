import { NextRequest, NextResponse } from "next/server";
import { getServerClient } from "@/lib/server/supabase";

// POST /api/messages/send
// Body: { roomId: string, content: string }
export async function POST(req: NextRequest) {
  const supabase = await getServerClient();
  const body = await req.json().catch(() => ({}));
  const { roomId, content } = body || {};
  if (!roomId || typeof content !== "string") {
    return NextResponse.json(
      { error: "roomId and content are required" },
      { status: 400 }
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  // Check current points and gate sending when <= 0
  const { data: profile } = await supabase
    .from("profiles")
    .select("points")
    .eq("id", user.id)
    .single();
  const points = profile?.points ?? 0;
  if (points <= 0)
    return NextResponse.json(
      { error: "insufficient_points", points },
      { status: 403 }
    );

  // Server-side Korean detection
  const hasKorean = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]/.test(content);

  // Insert message
  const { data: inserted, error: insertErr } = await supabase
    .from("messages")
    .insert({ room_id: roomId, sender_id: user.id, content })
    .select()
    .single();
  if (insertErr)
    return NextResponse.json({ error: insertErr.message }, { status: 400 });

  let newPoints = points;
  if (hasKorean) {
    const { data: updated, error: updErr } = await supabase
      .from("profiles")
      .update({ points: points - 1 })
      .eq("id", user.id)
      .select("points")
      .single();
    if (updErr)
      return NextResponse.json({ error: updErr.message }, { status: 400 });
    newPoints = updated.points;
  }

  return NextResponse.json({
    message: inserted,
    points: newPoints,
    deducted: hasKorean,
  });
}
