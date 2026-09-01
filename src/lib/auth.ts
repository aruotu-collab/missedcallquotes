import { cookies } from "next/headers";
import { readSession } from "./auth-crypto";
import { getUserById } from "./db";
import { ensureMemberBusiness, getBusinessForUser } from "./store";
import { isSupabaseConfigured } from "./supabase/config";
import { createClient } from "./supabase/server";

export const SESSION_COOKIE = "mcq_session";

export type SessionUser = {
  id: string;
  email: string;
  createdAt: string;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) return null;
    return { id: user.id, email: user.email, createdAt: user.created_at ?? "" };
  }

  const jar = await cookies();
  const userId = readSession(jar.get(SESSION_COOKIE)?.value);
  if (!userId) return null;
  const user = getUserById(userId);
  if (!user) return null;
  return { id: user.id, email: user.email, createdAt: user.createdAt };
}

export async function getSessionAccount() {
  const user = await getSessionUser();
  if (!user) return null;

  let business = await getBusinessForUser(user.id);
  if (!business && isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    const meta = authUser?.user_metadata ?? {};
    business = await ensureMemberBusiness({
      userId: user.id,
      firstName: typeof meta.first_name === "string" ? meta.first_name : "",
      businessName: typeof meta.business_name === "string" ? meta.business_name : "",
    });
  }

  return { user, business };
}
