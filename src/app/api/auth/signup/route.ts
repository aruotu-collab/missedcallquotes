import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth";
import { hashPassword, signSession } from "@/lib/auth-crypto";
import { getUserByEmail, readStore, uid, writeStore } from "@/lib/db";

export async function POST(req: Request) {
  const { email, password, name, firstName } = (await req.json()) as {
    email?: string;
    password?: string;
    name?: string;
    firstName?: string;
  };
  if (!email || !password || !name || !firstName) {
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
