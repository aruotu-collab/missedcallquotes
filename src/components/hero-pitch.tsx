"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { money } from "@/lib/format";
import { ArrowIcon } from "./icons";

export function HeroPitch() {
  const [calls, setCalls] = useState(80);
  const [missed, setMissed] = useState(20);
  const [job, setJob] = useState(320);
  const [close, setClose] = useState(35);

  const atRisk = useMemo(() => {
    const missedCalls = calls * (missed / 100) * 4.3;
    return Math.round(missedCalls * (close / 100) * job);
  }, [calls, missed, job, close]);

  return (
    <section id="calculator" className="relative overflow-hidden bg-navy text-white">
      <div className="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_80%_0%,#b8893a33,transparent_35%),radial-gradient(circle_at_0%_80%,#1f6b4a33,transparent_40%)]" />
      <div className="relative mx-auto max-w-6xl px-5 py-12 lg:py-16">
        <p className="text-xs uppercase tracking-[0.22em] text-brass">
          Built for UK plumbers, heating engineers & tradesmen
        </p>

        <div className="mt-6 rounded-[28px] border border-white/10 bg-[#0b1220]/80 p-5 md:p-7">
          <p className="text-[11px] uppercase tracking-[0.18em] text-brass">Missed revenue audit</p>
          <div className="mt-3 rounded-xl bg-brass px-5 py-5 text-navy">
            <p className="text-[11px] uppercase tracking-[0.16em] text-brass-deep">
              Estimated revenue at risk
            </p>
            <p className="mt-1 font-serif text-4xl md:text-6xl">{money(atRisk)}/month</p>
            <p className="mt-2 text-sm text-navy/70">
              MissedCallQuotes is £99–£179/month. One recovered job can cover the year.
            </p>
          </div>
          <p className="mt-6 text-sm text-white/50">Use your own figures. No inflated assumptions.</p>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Field label={`Calls a week: ${calls}`} value={calls} min={5} max={250} onChange={setCalls} />
            <Field label={`Missed: ${missed}%`} value={missed} min={5} max={70} onChange={setMissed} />
            <Field
              label={`Average job: ${money(job)}`}
              value={job}
              min={80}
              max={4000}
              step={10}
              onChange={setJob}
            />
            <Field label={`Close rate: ${close}%`} value={close} min={10} max={80} onChange={setClose} />
          </div>
        </div>

        <h1 className="mt-12 max-w-4xl font-serif text-4xl leading-[1.08] md:text-6xl">
          Turn missed calls into quote-ready jobs.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">
          When you can&apos;t answer, MissedCallQuotes texts the caller, finds out exactly
          what they need, gets their postcode and photos, and gives you a qualified job to
          quote. Keep your existing phone number.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 rounded-full bg-brass px-5 py-3 text-sm font-semibold text-navy"
          >
            Recover that revenue <ArrowIcon className="h-4 w-4" />
          </Link>
          <a
            href="#how"
            className="inline-flex items-center rounded-full border border-white/20 px-5 py-3 text-sm text-white"
          >
            See how it works
          </a>
        </div>
        <p className="mt-6 text-sm text-white/40">
          Not an AI receptionist. Not a CRM. Revenue you were already paying to generate.
        </p>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm text-white/65">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-brass"
      />
    </label>
  );
}
