"use client";

import { useState } from "react";
import type { Business } from "@/lib/types";

export function SettingsForm({ business }: { business: Business }) {
  const [saved, setSaved] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        phone: form.get("phone"),
        notificationMobile: form.get("notificationMobile"),
        city: form.get("city"),
        serviceAreas: String(form.get("serviceAreas"))
          .split(",")
          .map((s) => s.trim().toUpperCase())
          .filter(Boolean),
        services: String(form.get("services"))
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        callOut: Number(form.get("callOut")),
        emergencyCallOut: Number(form.get("emergencyCallOut")),
        boilerDiagnostic: Number(form.get("boilerDiagnostic")),
        hourlyLabour: Number(form.get("hourlyLabour")),
      }),
    });
    setSaved(true);
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 grid gap-4 text-sm">
      <Field name="name" label="Business name" defaultValue={business.name} />
      <Field name="phone" label="Public number" defaultValue={business.phone} />
      <Field name="notificationMobile" label="Notify mobile" defaultValue={business.notificationMobile} />
      <Field name="city" label="City" defaultValue={business.city} />
      <Field name="serviceAreas" label="Areas" defaultValue={business.serviceAreas.join(", ")} />
      <Field name="services" label="Services" defaultValue={business.services.join(", ")} />
      <div className="grid grid-cols-2 gap-3">
        <Field name="callOut" label="Call-out" defaultValue={String(business.callOut)} type="number" />
        <Field
          name="emergencyCallOut"
          label="Emergency"
          defaultValue={String(business.emergencyCallOut)}
          type="number"
        />
        <Field
          name="boilerDiagnostic"
          label="Boiler diagnostic"
          defaultValue={String(business.boilerDiagnostic)}
          type="number"
        />
        <Field name="hourlyLabour" label="Hourly labour" defaultValue={String(business.hourlyLabour)} type="number" />
      </div>
      <p className="rounded-xl bg-white/5 p-4 text-white/55">
        Call forwarding: divert unanswered/busy calls to your MissedCallQuotes number. We will
        issue that number when Twilio is connected. Test EE, O2, Vodafone and Three before
        promising CLI to customers.
      </p>
      <button className="rounded-full bg-white py-3 font-medium text-navy">Save setup</button>
      {saved ? <p className="text-[#7ddea8]">Saved.</p> : null}
    </form>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  const { label, ...rest } = props;
  return (
    <label className="grid gap-1">
      <span className="text-white/50">{label}</span>
      <input {...rest} className="rounded-xl border border-white/15 bg-white/5 px-3 py-2.5" />
    </label>
  );
}
