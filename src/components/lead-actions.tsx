"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Lead } from "@/lib/types";

export function LeadActions({
  lead,
  callOut,
  diagnostic,
}: {
  lead: Lead;
  callOut: number;
  diagnostic: number;
}) {
  const router = useRouter();
  const [amount, setAmount] = useState(
    String(lead.quotedAmount || (lead.jobType === "boiler_breakdown" ? diagnostic : callOut)),
  );
  const [busy, setBusy] = useState(false);

  async function act(body: Record<string, unknown>) {
    setBusy(true);
    await fetch(`/api/leads/${lead.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="mt-8 rounded-2xl border border-dash-line bg-white p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-dash-faint">Your move</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          disabled={busy}
          onClick={() => act({ status: "contacted" })}
          className="rounded-full bg-dash-accent px-4 py-2 text-sm font-medium text-white"
        >
          Call {lead.customerName.split(" ")[0]}
        </button>
        <button
          disabled={busy}
          onClick={() => act({ status: "accepted" })}
          className="rounded-full border border-dash-line bg-white px-4 py-2 text-sm text-dash-ink hover:bg-dash-bg"
        >
          Accept job
        </button>
        <button
          disabled={busy}
          onClick={() => act({ status: "declined" })}
          className="rounded-full border border-dash-line bg-white px-4 py-2 text-sm text-dash-ink hover:bg-dash-bg"
        >
          Decline
        </button>
        <button
          disabled={busy}
          onClick={() => act({ followUp: true })}
          className="rounded-full border border-dash-line bg-white px-4 py-2 text-sm text-dash-ink hover:bg-dash-bg"
        >
          Follow up
        </button>
      </div>
      <div className="mt-5 flex flex-wrap items-end gap-3">
        <label className="grid gap-1 text-sm text-dash-muted">
          Send price £
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-32 rounded-xl border border-dash-line bg-white px-3 py-2 text-dash-ink"
          />
        </label>
        <button
          disabled={busy}
          onClick={() => act({ quotedAmount: Number(amount) })}
          className="rounded-full bg-dash-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Send price
        </button>
        <button
          disabled={busy}
          onClick={() => act({ wonAmount: Number(amount || lead.quotedAmount || 0) })}
          className="rounded-full bg-forest px-4 py-2 text-sm text-white"
        >
          Mark won
        </button>
        <button
          disabled={busy}
          onClick={() =>
            act({
              collectedAmount: Number(lead.wonAmount || amount || lead.quotedAmount || 0),
            })
          }
          className="rounded-full border border-dash-line bg-white px-4 py-2 text-sm text-dash-ink hover:bg-dash-bg"
        >
          Mark collected
        </button>
      </div>
    </div>
  );
}
