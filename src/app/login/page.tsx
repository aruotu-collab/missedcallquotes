"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

const magicLink = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [error, setError] = useState(search.get("error") === "auth" ? "That sign-in link was invalid or expired." : "");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
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
      setSent(true);
      return;
    }
    router.push(data.onboarded ? "/dashboard" : "/onboarding");
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-5 py-16">
      <h1 className="font-serif text-4xl">Welcome back</h1>
      {sent ? (
        <p className="mt-4 text-sm leading-6 text-ink-soft">
          Check your email for a sign-in link. It expires in a few minutes. You can close this tab.
        </p>
      ) : (
        <>
          <p className="mt-2 text-sm text-ink-soft">
            {magicLink
              ? "We’ll email you a one-time link. No password."
              : "Demo plumber: dave@davesplumbing.test / plumber123"}
          </p>
          <form onSubmit={onSubmit} className="mt-8 grid gap-4">
            <label className="grid gap-1 text-sm">
              Email
              <input
                name="email"
                type="email"
                required
                defaultValue={magicLink ? "" : "dave@davesplumbing.test"}
                className="rounded-xl border border-line bg-card px-3 py-2.5"
              />
            </label>
            {magicLink ? null : (
              <label className="grid gap-1 text-sm">
                Password
                <input
                  name="password"
                  type="password"
                  required
                  defaultValue="plumber123"
                  className="rounded-xl border border-line bg-card px-3 py-2.5"
                />
              </label>
            )}
            {error ? <p className="text-sm text-rust">{error}</p> : null}
            <button
              disabled={busy}
              className="rounded-full bg-navy py-3 text-sm font-medium text-white"
            >
              {busy ? (magicLink ? "Sending…" : "Signing in…") : magicLink ? "Email me a sign-in link" : "Log in"}
            </button>
          </form>
        </>
      )}
      <p className="mt-6 text-sm text-ink-soft">
        New here? <Link href="/signup" className="underline">Create an account</Link>
      </p>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
