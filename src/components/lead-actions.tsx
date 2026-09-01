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
    <div className="mt-8 rounded-2xl border border-white/10 p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-white/40">Your move</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          disabled={busy}
          onClick={() => act({ status: "contacted" })}
          className="rounded-full bg-white px-4 py-2 text-sm font-medium text-navy"
        >
          Call {lead.customerName.split(" ")[0]}
        </button>
        <button
          disabled={busy}
          onClick={() => act({ status: "accepted" })}
          className="rounded-full bg-white/10 px-4 py-2 text-sm"
        >
          Accept job
        </button>
        <button
          disabled={busy}
          onClick={() => act({ status: "declined" })}
          className="rounded-full bg-white/10 px-4 py-2 text-sm"
        >
          Decline
        </button>
        <button
          disabled={busy}
          onClick={() => act({ followUp: true })}
          className="rounded-full bg-white/10 px-4 py-2 text-sm"
        >
          Follow up
        </button>
      </div>
      <div className="mt-5 flex flex-wrap items-end gap-3">
        <label className="grid gap-1 text-sm">
          Send price £
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-32 rounded-xl border border-white/15 bg-white/5 px-3 py-2"
          />
        </label>
        <button
          disabled={busy}
          onClick={() => act({ quotedAmount: Number(amount) })}
          className="rounded-full bg-brass px-4 py-2 text-sm font-semibold text-navy"
        >
          Send price
        </button>
        <button
          disabled={busy}
          onClick={() => act({ wonAmount: Number(amount || lead.quotedAmount || 0) })}
          className="rounded-full bg-[#1f6b4a] px-4 py-2 text-sm"
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
          className="rounded-full bg-white/10 px-4 py-2 text-sm"
        >
          Mark collected
        </button>
      </div>
    </div>
  );
}
