"use client";
import { getBrowserClient } from "@/lib/supabaseClient";
import { useState } from "react";

export default function LogoutButton() {
  const supabase = getBrowserClient();
  const [loading, setLoading] = useState(false);
  const onLogout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      // Refresh to update server-rendered header
      window.location.href = "/";
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      onClick={onLogout}
      disabled={loading}
      className="px-3 py-2 rounded border border-foreground/20 hover:bg-foreground/10 transition disabled:opacity-50"
    >
      {loading ? "로그아웃 중..." : "로그아웃"}
    </button>
  );
}
