import { cookies } from "next/headers";
import { readSession } from "./auth-crypto";
import { getBusinessByUserId, getUserById } from "./db";

export const SESSION_COOKIE = "mcq_session";

export async function getSessionUser() {
  const jar = await cookies();
  const userId = readSession(jar.get(SESSION_COOKIE)?.value);
  if (!userId) return null;
  const user = getUserById(userId);
  if (!user) return null;
  const { passwordHash: _, ...safe } = user;
  return safe;
}

export async function getSessionAccount() {
  const user = await getSessionUser();
  if (!user) return null;
  const business = getBusinessByUserId(user.id);
  return { user, business };
}
