"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const magicLink = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
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
      setSent(true);
      return;
    }
    router.push("/onboarding");
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-5 py-16">
      <h1 className="font-serif text-4xl">Join the founding 10</h1>
      {sent ? (
        <p className="mt-4 text-sm leading-6 text-ink-soft">
          Check your email for a sign-in link. Click it to finish creating your account.
        </p>
      ) : (
        <>
          <p className="mt-2 text-sm text-ink-soft">
            {magicLink
              ? "£79/month locked for 12 months. We’ll email a link — no password to remember."
              : "£79/month locked for 12 months. Card is collected at install, not here."}
          </p>
          <form onSubmit={onSubmit} className="mt-8 grid gap-4">
            <label className="grid gap-1 text-sm">
              Your first name
              <input name="firstName" required className="rounded-xl border border-line bg-card px-3 py-2.5" />
            </label>
            <label className="grid gap-1 text-sm">
              Business name
              <input name="name" required className="rounded-xl border border-line bg-card px-3 py-2.5" />
            </label>
            <label className="grid gap-1 text-sm">
              Email
              <input name="email" type="email" required className="rounded-xl border border-line bg-card px-3 py-2.5" />
            </label>
            {magicLink ? null : (
              <label className="grid gap-1 text-sm">
                Password
                <input name="password" type="password" required minLength={8} className="rounded-xl border border-line bg-card px-3 py-2.5" />
              </label>
            )}
            {error ? <p className="text-sm text-rust">{error}</p> : null}
            <button disabled={busy} className="rounded-full bg-navy py-3 text-sm font-medium text-white">
              {busy ? "Sending…" : magicLink ? "Email me a sign-in link" : "Create founding account"}
            </button>
          </form>
        </>
      )}
      <p className="mt-6 text-sm text-ink-soft">
        Already have an account? <Link href="/login" className="underline">Log in</Link>
      </p>
    </main>
  );
}
