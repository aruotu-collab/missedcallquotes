"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthCard, AuthCheckEmail, AuthField } from "@/components/auth-card";

const magicLink = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const nextEmail = String(form.get("email") || "").trim();
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: nextEmail,
        password: form.get("password"),
        name: form.get("name"),
        firstName: form.get("firstName"),
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Could not create account");
      return;
    }
    if (data.checkEmail) {
      setEmail(nextEmail);
      setSent(true);
      return;
    }
    router.push("/onboarding");
  }

  return (
    <AuthCard>
      {sent ? (
        <AuthCheckEmail
          email={email}
          intro="We sent a link to finish creating your account to"
          onUseDifferent={() => {
            setSent(false);
            setError("");
          }}
        />
      ) : (
        <>
          <h1 className="font-serif text-3xl text-dash-ink">Join the founding 10</h1>
          <p className="mt-2 text-sm leading-6 text-dash-muted">
            {magicLink
              ? "£79/month locked for 12 months. We will email a link — no password to remember."
              : "£79/month locked for 12 months. Card is collected at install, not here."}
          </p>
          <form onSubmit={onSubmit} className="mt-8 grid gap-4">
            <AuthField name="firstName" label="Your first name" required />
            <AuthField name="name" label="Business name" required />
            <AuthField name="email" label="Email" type="email" required defaultValue={email} />
            {magicLink ? null : (
              <AuthField name="password" label="Password" type="password" required minLength={8} />
            )}
            {error ? <p className="text-sm text-rust">{error}</p> : null}
            <button
              disabled={busy}
              className="rounded-full bg-dash-accent py-3 text-sm font-medium text-white transition-opacity disabled:opacity-60"
            >
              {busy ? "Sending…" : magicLink ? "Email me a sign-in link" : "Create founding account"}
            </button>
          </form>
          <p className="mt-6 text-sm text-dash-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-dash-accent hover:underline">
              Log in
            </Link>
          </p>
        </>
      )}
    </AuthCard>
  );
}
