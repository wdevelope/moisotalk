import { NextRequest, NextResponse } from "next/server";
import { getServerClient } from "@/lib/server/supabase";
import { getServiceClient } from "@/lib/server/supabaseService";

// POST /api/match/try -> attempt to find or create match and return room id
export async function POST(_req: NextRequest) {
  try {
    const supabase = await getServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    // Use service role for the RPC to bypass RLS during pairing
    const svc = getServiceClient();
    const { data, error } = await svc.rpc("find_or_create_match", {
      p_user: user.id,
    });
    if (error)
      return NextResponse.json(
        {
          error: error.message,
          code: (error as any).code,
          details: (error as any).details,
          hint: (error as any).hint,
        },
        { status: 400 }
      );
    return NextResponse.json({ roomId: data });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "match failed" },
      { status: 500 }
    );
  }
}
