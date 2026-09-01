import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth";
import { signSession, verifyPassword } from "@/lib/auth-crypto";
import { getBusinessByUserId, getUserByEmail } from "@/lib/db";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { sendMagicLink } from "@/lib/supabase/magic-link";

export async function POST(req: Request) {
  const { email, password } = (await req.json()) as { email?: string; password?: string };
  if (!email) {
    return Response.json({ error: "Email required" }, { status: 400 });
  }

  if (isSupabaseConfigured()) {
    const error = await sendMagicLink(req, email, { createUser: false });
    if (error) {
      const noAccount =
        error.code === "otp_disabled" ||
        /signups not allowed/i.test(error.message);
      return Response.json(
        {
          error: noAccount
            ? "No account for that email yet. Create an account first."
            : error.message || "Could not send a sign-in link.",
        },
        { status: 400 },
      );
    }
    return Response.json({ ok: true, checkEmail: true });
  }

  if (!password) {
    return Response.json({ error: "Email and password required" }, { status: 400 });
  }
  const user = getUserByEmail(email);
  if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) {
    return Response.json({ error: "Those details don't match" }, { status: 401 });
  }
  const jar = await cookies();
  jar.set(SESSION_COOKIE, signSession(user.id), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  const business = getBusinessByUserId(user.id);
  return Response.json({ ok: true, onboarded: Boolean(business?.onboarded) });
}
