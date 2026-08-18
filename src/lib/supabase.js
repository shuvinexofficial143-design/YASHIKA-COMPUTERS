import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(
  url &&
  anonKey &&
  !url.includes("YOUR_PROJECT_REF") &&
  !anonKey.includes("YOUR_SUPABASE_ANON_KEY")
);

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export async function getAdminSession() {
  if (!supabase) {
    return {
      configured: false,
      user: null,
      isAdmin: false,
      error: null,
    };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      configured: true,
      user: null,
      isAdmin: false,
      error: userError,
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("user_id,email,role")
    .eq("user_id", user.id)
    .maybeSingle();

  return {
    configured: true,
    user,
    profile,
    isAdmin: profile?.role === "admin",
    error: profileError,
  };
}

export async function signInAdmin(email, password) {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role,email")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (profileError) {
    await supabase.auth.signOut();
    throw profileError;
  }

  if (profile?.role !== "admin") {
    await supabase.auth.signOut();
    throw new Error("This account is not an admin.");
  }

  return {
    user: data.user,
    profile,
  };
}

export async function signOutAdmin() {
  if (!supabase) return;
  await supabase.auth.signOut();
}
