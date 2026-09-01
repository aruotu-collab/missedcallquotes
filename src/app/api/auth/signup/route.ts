import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth";
import { hashPassword, signSession } from "@/lib/auth-crypto";
import { getUserByEmail, readStore, uid, writeStore } from "@/lib/db";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { sendMagicLink } from "@/lib/supabase/magic-link";

export async function POST(req: Request) {
  const { email, password, name, firstName } = (await req.json()) as {
    email?: string;
    password?: string;
    name?: string;
    firstName?: string;
  };
  if (!email || !name || !firstName) {
    return Response.json({ error: "Name, business name and email are required" }, { status: 400 });
  }

  if (isSupabaseConfigured()) {
    const error = await sendMagicLink(req, email, {
      firstName,
      businessName: name,
      createUser: true,
    });
    if (error) {
      return Response.json({ error: error.message || "Could not send a sign-in link" }, { status: 400 });
    }
    return Response.json({ ok: true, checkEmail: true });
  }

  if (!password) {
    return Response.json({ error: "All fields required" }, { status: 400 });
  }
  if (getUserByEmail(email)) {
    return Response.json({ error: "An account with that email already exists" }, { status: 409 });
  }
  const store = readStore();
  const user = {
    id: uid("user"),
    email: email.toLowerCase(),
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };
  store.users.push(user);
  store.businesses.push({
    id: uid("biz"),
    userId: user.id,
    name,
    ownerFirstName: firstName,
    phone: "",
    notificationMobile: "",
    city: "",
    serviceAreas: [],
    services: [],
    callOut: 95,
    emergencyCallOut: 150,
    hourlyLabour: 65,
    minimumJob: 80,
    boilerDiagnostic: 95,
    tone: "plain, calm, local plumber",
    plan: "founding",
    onboarded: false,
    createdAt: new Date().toISOString(),
  });
  writeStore(store);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, signSession(user.id), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return Response.json({ ok: true });
}
