"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getBrowserClient } from "@/lib/supabaseClient";
import { ThemeToggle } from "@/components/ThemeToggle";
import LogoutButton from "@/components/LogoutButton";
import { ensurePendingProfile } from "@/lib/auth";

export function Header() {
  const supabase = getBrowserClient();
  const [hasUser, setHasUser] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    // Initial check
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setHasUser(!!data.user);
      if (data.user) {
        ensurePendingProfile().catch(() => {});
      }
    });
    // Subscribe to auth state changes to update header immediately
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setHasUser(!!session?.user);
      if (session?.user) {
        ensurePendingProfile().catch(() => {});
      }
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <header className="px-4 md:px-6 2xl:px-10 py-3 md:py-4 border-b border-accent/10 bg-surface">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="font-semibold flex items-center gap-1 md:gap-2 text-accent"
        >
          <Image
            src="/logo_without_text.png"
            alt="MoisoTalk"
            width={32}
            height={32}
            className="md:w-9 md:h-9 drop-shadow-sm"
          />
          <span className="text-base md:text-lg">MoisoTalk</span>
        </Link>
        <nav className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
          <ThemeToggle />
          {hasUser ? (
            <>
              <Link
                href="/me"
                className="px-2 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl border border-accent/30 hover:bg-accent/10 transition-all text-xs md:text-sm"
              >
                <span className="hidden md:inline">마이페이지</span>
                <span className="md:hidden">마이페이지</span>
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-2 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl border border-accent/30 hover:bg-accent/10 transition-all text-xs md:text-sm"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="px-2 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-md text-xs md:text-sm"
              >
                회원가입
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
