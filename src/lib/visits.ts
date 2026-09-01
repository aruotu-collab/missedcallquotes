import { type NextRequest } from "next/server";
import { isSupabaseConfigured, supabasePublicUrl } from "@/lib/supabase/config";

const SKIP_PREFIXES = ["/api", "/dashboard", "/onboarding", "/auth", "/_next"];
const SKIP_PATHS = new Set(["/robots.txt", "/sitemap.xml", "/favicon.ico"]);

export function shouldLogPath(path: string) {
  if (SKIP_PATHS.has(path)) return false;
  return !SKIP_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

export function clientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "";
  return request.headers.get("x-real-ip") || request.headers.get("cf-connecting-ip") || "";
}

export function isPrefetch(request: NextRequest) {
  return request.headers.get("next-router-prefetch") === "1" || request.headers.get("rsc") === "1";
}

export async function recordVisit(request: NextRequest) {
  if (request.method !== "GET" || isPrefetch(request)) return;
  const path = request.nextUrl.pathname;
  if (!shouldLogPath(path) || !isSupabaseConfigured()) return;

  const { url, key } = supabasePublicUrl();
  await fetch(`${url}/rest/v1/page_visits`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      path,
      ip: clientIp(request),
      user_agent: request.headers.get("user-agent") ?? "",
      referrer: request.headers.get("referer") ?? "",
      country: request.headers.get("x-vercel-ip-country") ?? "",
    }),
  }).catch(() => undefined);
}
