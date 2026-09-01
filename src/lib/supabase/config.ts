function projectUrl() {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!raw) return "";
  return raw.replace(/\/+$/, "").replace(/\/rest\/v1$/i, "");
}

export function isSupabaseConfigured() {
  return Boolean(projectUrl() && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function supabasePublicUrl() {
  const url = projectUrl();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }
  return { url, key };
}

export function appOrigin(request?: Request) {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  if (request) return new URL(request.url).origin;
  return "http://localhost:3000";
}
