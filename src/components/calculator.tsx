"use client";

import { useMemo, useState } from "react";
import { money } from "@/lib/format";

export function RevenueCalculator() {
  const [calls, setCalls] = useState(80);
  const [missed, setMissed] = useState(20);
  const [job, setJob] = useState(320);
  const [close, setClose] = useState(35);

  const atRisk = useMemo(() => {
    const missedCalls = calls * (missed / 100) * 4.3;
    return Math.round(missedCalls * (close / 100) * job);
  }, [calls, missed, job, close]);

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
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="mb-5 block">
      <span className="text-sm text-ink-soft">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-navy"
      />
    </label>
  );
}
