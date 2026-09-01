"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AuthCard, AuthCheckEmail, AuthField } from "@/components/auth-card";

const magicLink = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [error, setError] = useState(search.get("error") === "auth" ? "That sign-in link was invalid or expired." : "");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const nextEmail = String(form.get("email") || "").trim();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: nextEmail,
        password: form.get("password"),
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Could not log in");
      return;
    }
    if (data.checkEmail) {
      setEmail(nextEmail);
      setSent(true);
      return;
    }
    router.push(data.onboarded ? "/dashboard" : "/onboarding");
  }

  return (
    <AuthCard>
      {sent ? (
        <AuthCheckEmail
          email={email}
          intro="We sent a sign-in link to"
          onUseDifferent={() => {
            setSent(false);
            setError("");
          }}
        />
      ) : (
        <>
          <h1 className="font-serif text-3xl text-dash-ink">Welcome back</h1>
          <p className="mt-2 text-sm leading-6 text-dash-muted">
            {magicLink
              ? "Enter your email and we will send a one-time sign-in link. No password."
              : "Demo plumber: dave@davesplumbing.test / plumber123"}
          </p>
          <form onSubmit={onSubmit} className="mt-8 grid gap-4">
            <AuthField
              name="email"
              label="Email"
              type="email"
              required
              defaultValue={magicLink ? email : "dave@davesplumbing.test"}
            />
            {magicLink ? null : (
              <AuthField
                name="password"
                label="Password"
                type="password"
                required
                defaultValue="plumber123"
              />
            )}
            {error ? <p className="text-sm text-rust">{error}</p> : null}
            <button
              disabled={busy}
              className="rounded-full bg-dash-accent py-3 text-sm font-medium text-white transition-opacity disabled:opacity-60"
            >
              {busy ? (magicLink ? "Sending…" : "Signing in…") : magicLink ? "Email me a sign-in link" : "Log in"}
            </button>
          </form>
          <p className="mt-6 text-sm text-dash-muted">
            New here?{" "}
            <Link href="/signup" className="font-medium text-dash-accent hover:underline">
              Create an account
            </Link>
          </p>
        </>
      )}
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
