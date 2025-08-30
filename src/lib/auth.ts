"use client";
import { getBrowserClient } from "@/lib/supabaseClient";

export async function signUpWithEmail(params: {
  email: string;
  password: string;
  nickname: string;
  gender?: string;
  age_group?: string;
}) {
  const supabase = getBrowserClient();
  const { email, password, nickname, gender, age_group } = params;
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Adjust redirect URL as needed for your deployment domain
      emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined,
    },
  });
  if (signUpError) throw signUpError;

  const id = signUpData.user?.id;
  if (!id) throw new Error("Sign up succeeded but user ID missing");

  // Create profile via API route to leverage RLS checks and cookie auth
  // Note: if email confirmation is required, session may be null and the
  // server route will return 401. In that case, stash pending profile data
  // and ask the user to confirm email and login; we'll complete profile then.
  try {
    const res = await fetch("/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, nickname, gender, age_group }),
    });
    if (res.ok) {
      const json = await res.json();
      return { user: signUpData.user, profile: json.profile, needsEmailConfirmation: !signUpData.session } as const;
    }
    const j = await res.json().catch(() => ({}));
    if (res.status === 401) {
      // store pending profile to finalize after first login
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'pending_profile',
          JSON.stringify({ nickname, gender, age_group })
        );
      }
      return { user: signUpData.user, profile: null, needsEmailConfirmation: true } as const;
    }
    throw new Error(j.error || "Failed to create profile");
  } catch (e) {
    // network or other errors; still store pending data if session is missing
    if (!signUpData.session && typeof window !== 'undefined') {
      localStorage.setItem(
        'pending_profile',
        JSON.stringify({ nickname, gender, age_group })
      );
      return { user: signUpData.user, profile: null, needsEmailConfirmation: true } as const;
    }
    throw e;
  }
}

export async function ensurePendingProfile() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('pending_profile');
  if (!raw) return null;
  const supabase = getBrowserClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return null;
  try {
    const { nickname, gender, age_group } = JSON.parse(raw);
    const res = await fetch("/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, nickname, gender, age_group }),
    });
    if (res.ok) {
      localStorage.removeItem('pending_profile');
      const json = await res.json();
      return json.profile;
    }
  } catch (_) {
    // ignore parse or network errors
  }
  return null;
}
