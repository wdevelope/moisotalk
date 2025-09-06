import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/server/supabaseService";

export const revalidate = 0; // no cache

export async function GET() {
  try {
    const supabase = getServiceClient();

    const [waitingRes, activeRes] = await Promise.all([
      supabase
        .from("waiting_pool")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("chat_rooms")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true),
    ]);

    if (waitingRes.error) {
      throw waitingRes.error;
    }
    if (activeRes.error) {
      throw activeRes.error;
    }

    const waitingCount = waitingRes.count ?? 0;
    const activeRooms = activeRes.count ?? 0;

    return NextResponse.json(
      { waitingCount, activeRooms },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed to load stats" },
      { status: 500 }
    );
  }
}
