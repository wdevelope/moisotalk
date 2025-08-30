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
  });
  if (signUpError) throw signUpError;

  const id = signUpData.user?.id;
  if (!id) throw new Error("Sign up succeeded but user ID missing");

  // Create profile via API route to leverage RLS checks and cookie auth
  const res = await fetch("/api/profiles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, nickname, gender, age_group }),
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    throw new Error(j.error || "Failed to create profile");
  }
  const json = await res.json();
  return { user: signUpData.user, profile: json.profile };
}
