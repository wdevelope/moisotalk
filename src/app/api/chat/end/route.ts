import { NextRequest, NextResponse } from "next/server";
import { getServerClient } from "@/lib/server/supabase";
import { getServiceClient } from "@/lib/server/supabaseService";

// POST /api/chat/end
// Body: { roomId: string }
export async function POST(req: NextRequest) {
  const supabase = await getServerClient();
  const svc = getServiceClient();
  const body = await req.json().catch(() => ({} as any));
  const { roomId } = body || {};
  if (!roomId) {
    return NextResponse.json({ error: "roomId is required" }, { status: 400 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  // Verify the caller is a participant of the room (RLS-protected check)
  const { data: membership, error: memErr } = await supabase
    .from("chat_participants")
    .select("user_id")
    .eq("room_id", roomId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (memErr)
    return NextResponse.json({ error: memErr.message }, { status: 400 });
  if (!membership)
    return NextResponse.json({ error: "forbidden" }, { status: 403 });

  // If any Korean appeared in the room, no rewards
  const { data: hasKorean, error: rpcErr } = await supabase.rpc(
    "room_has_korean",
    { p_room: roomId }
  );
  if (rpcErr)
    return NextResponse.json({ error: rpcErr.message }, { status: 400 });
  if (hasKorean) {
    // Mark room inactive and notify participants via a system message
    await svc.from("chat_rooms").update({ is_active: false }).eq("id", roomId);
    // Use user-auth client so RLS insert_by_sender passes
    await supabase.from("messages").insert({
      room_id: roomId,
      sender_id: user.id,
      content: "The other person has ended the chat.",
    });
    return NextResponse.json({ rewarded: false, reason: "korean_used" });
  }

  // Reward all participants: +2 points each (service role bypasses RLS)
  const { data: participants, error: partErr } = await svc
    .from("chat_participants")
    .select("user_id")
    .eq("room_id", roomId);
  if (partErr)
    return NextResponse.json({ error: partErr.message }, { status: 400 });
  const ids = (participants ?? []).map((p: any) => p.user_id);

  // Increment points for each participant (small N, fine to loop)
  let callerNewPoints: number | null = null;
  for (const id of ids) {
    const { data: prof } = await svc
      .from("profiles")
      .select("points")
      .eq("id", id)
      .single();
    const next = (prof?.points ?? 0) + 2;
    const { data: updated, error: updErr } = await svc
      .from("profiles")
      .update({ points: next })
      .eq("id", id)
      .select("points")
      .single();
    if (updErr)
      return NextResponse.json({ error: updErr.message }, { status: 400 });
    if (id === user.id) callerNewPoints = updated.points;
  }

  await svc.from("chat_rooms").update({ is_active: false }).eq("id", roomId);

  // Send a system-like notification message so the other side sees immediate notice
  await supabase.from("messages").insert({
    room_id: roomId,
    sender_id: user.id,
    content: "The other person has ended the chat.",
  });

  return NextResponse.json({
    rewarded: true,
    gained: 2,
    points: callerNewPoints,
  });
}
