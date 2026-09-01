"use client";

import { useMemo, useState } from "react";
import { money } from "@/lib/format";

export function RevenueCalculator({ variant = "page" }: { variant?: "page" | "hero" }) {
  const [calls, setCalls] = useState(80);
  const [missed, setMissed] = useState(20);
  const [job, setJob] = useState(320);
  const [close, setClose] = useState(35);

  const atRisk = useMemo(() => {
    const missedCalls = calls * (missed / 100) * 4.3;
    return Math.round(missedCalls * (close / 100) * job);
  }, [calls, missed, job, close]);

  if (variant === "hero") {
    return (
      <div id="calculator" className="rounded-[28px] border border-white/10 bg-[#0b1220] p-5 text-white phone-frame">
        <p className="text-[11px] uppercase tracking-[0.18em] text-brass">Missed revenue audit</p>
        <div className="mt-3 rounded-xl bg-brass px-5 py-4 text-navy">
          <p className="text-[11px] uppercase tracking-[0.16em] text-brass-deep">Estimated revenue at risk</p>
          <p className="mt-1 font-serif text-4xl">{money(atRisk)}/month</p>
          <p className="mt-2 text-sm text-navy/70">
            MissedCallQuotes is £99–£179/month. One recovered job can cover the year.
          </p>
        </div>
        <p className="mt-5 text-sm text-white/55">Use your own numbers.</p>
        <div className="mt-3">
          <Field
            label={`Calls a week: ${calls}`}
            value={calls}
            min={5}
            max={250}
            onChange={setCalls}
            light
          />
          <Field label={`Missed: ${missed}%`} value={missed} min={5} max={70} onChange={setMissed} light />
          <Field
            label={`Average job: ${money(job)}`}
            value={job}
            min={80}
            max={4000}
            step={10}
            onChange={setJob}
            light
          />
          <Field label={`Close rate: ${close}%`} value={close} min={10} max={80} onChange={setClose} light />
        </div>
      </div>
    );
  }

  return (
    <section id="calculator" className="border-t border-line bg-paper-2/60 py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brass-deep">Missed revenue audit</p>
          <h2 className="mt-3 text-4xl leading-tight text-ink md:text-5xl">
            How much money are your missed calls costing?
          </h2>
          <p className="mt-4 max-w-md text-ink-soft leading-7">
            Use your own numbers. No inflated assumptions. Then compare that figure to a
            £99–£179 subscription.
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-card p-6 shadow-[var(--shadow)]">
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
          <div className="mt-6 rounded-xl bg-navy px-5 py-5 text-white">
            <p className="text-xs uppercase tracking-[0.16em] text-brass">Estimated revenue at risk</p>
            <p className="mt-2 font-serif text-4xl">{money(atRisk)}/month</p>
            <p className="mt-3 text-sm text-white/65">
              MissedCallQuotes starts at £99/month. Growth is £179. If one recovered job covers
              the year, the rest is margin.
            </p>
          </div>
        </div>
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
  light = false,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (n: number) => void;
  light?: boolean;
}) {
  return (
    <label className="mb-4 block">
      <span className={`text-sm ${light ? "text-white/65" : "text-ink-soft"}`}>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`mt-2 w-full ${light ? "accent-brass" : "accent-navy"}`}
      />
    </label>
  );
}
