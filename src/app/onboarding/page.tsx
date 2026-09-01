"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OnboardingPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        onboarded: true,
        phone: form.get("phone"),
        notificationMobile: form.get("notificationMobile"),
        city: form.get("city"),
        serviceAreas: String(form.get("serviceAreas") || "")
          .split(",")
          .map((s) => s.trim().toUpperCase())
          .filter(Boolean),
        callOut: Number(form.get("callOut")),
        emergencyCallOut: Number(form.get("emergencyCallOut")),
        boilerDiagnostic: Number(form.get("boilerDiagnostic")),
        services: String(form.get("services") || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Could not save");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <main className="mx-auto max-w-xl px-5 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-brass-deep">Setup</p>
      <h1 className="mt-3 font-serif text-4xl">Tell us how you price work.</h1>
      <p className="mt-3 text-ink-soft">
        The intake engine uses these numbers. It will not invent a £183 repair.
      </p>
      <form onSubmit={onSubmit} className="mt-8 grid gap-4">
        <Input name="phone" label="Business phone" placeholder="0161 000 0000" />
        <Input name="notificationMobile" label="Your mobile for new leads" placeholder="07…" />
        <Input name="city" label="City" placeholder="Manchester" />
        <Input name="serviceAreas" label="Areas served" placeholder="M20, M21, SK4" />
        <Input name="services" label="Services" placeholder="Boilers, leaks, bathrooms" />
        <div className="grid grid-cols-3 gap-3">
          <Input name="callOut" label="Call-out £" defaultValue="95" type="number" />
          <Input name="emergencyCallOut" label="Emergency £" defaultValue="150" type="number" />
          <Input name="boilerDiagnostic" label="Diagnostic £" defaultValue="95" type="number" />
        </div>
        {error ? <p className="text-sm text-rust">{error}</p> : null}
        <button disabled={busy} className="rounded-full bg-navy py-3 text-sm font-medium text-white">
          {busy ? "Saving…" : "Open the dashboard"}
        </button>
      </form>
    </main>
  );
}

function Input({
  name,
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  return (
    <label className="grid gap-1 text-sm">
      {label}
      <input name={name} {...props} className="rounded-xl border border-line bg-card px-3 py-2.5" />
    </label>
  );
}
