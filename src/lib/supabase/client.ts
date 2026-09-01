import { createBrowserClient } from "@supabase/ssr";
import { supabasePublicUrl } from "./config";

export function createBrowserSupabase() {
  const { url, key } = supabasePublicUrl();
  return createBrowserClient(url, key);
}
