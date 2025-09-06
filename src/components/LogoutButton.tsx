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
      className="px-2 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl border border-orange/30 hover:bg-orange/10 transition-all disabled:opacity-50 text-orange text-xs md:text-sm"
    >
      {loading ? "로그아웃 중..." : "로그아웃"}
    </button>
  );
}
