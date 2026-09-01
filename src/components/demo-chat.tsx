"use client";

import { useMemo, useState } from "react";
import { startConversation } from "@/lib/engine";
import type { ConversationState } from "@/lib/types";
import { money } from "@/lib/format";
import { LeadCard } from "./lead-card";

export function DemoChat({
  businessName = "Dave's Plumbing",
  persist = false,
  customerName = "You",
  customerPhone = "",
  onComplete,
}: {
  businessName?: string;
  persist?: boolean;
  customerName?: string;
  customerPhone?: string;
  onComplete?: (state: ConversationState) => void;
}) {
  const initial = useMemo(() => startConversation(businessName), [businessName]);
  const [state, setState] = useState<ConversationState>(initial);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [started, setStarted] = useState(false);

  async function send(text?: string) {
    const value = (text ?? input).trim();
    if (!value || busy || state.complete) return;
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state,
          text: value,
          businessName,
          persist,
          customerName,
          customerPhone,
        }),
      });
      const data = (await res.json()) as { state: ConversationState };
      setState(data.state);
      if (data.state.complete) onComplete?.(data.state);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0b1220] text-white phone-frame">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-brass">SMS · missed call</p>
          <p className="text-sm text-white/80">{businessName}</p>
        </div>
        <span className="rounded-full bg-white/8 px-3 py-1 text-[11px] text-white/60">now</span>
      </div>

      {!started ? (
        <div className="px-6 py-10 text-center">
          <p className="font-serif text-3xl leading-tight">Call this plumber. Then hang up.</p>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/60">
            In production this is a real number. Here, hang up on the ring and watch the
            intake start on your phone.
          </p>
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="mt-6 rounded-full bg-brass px-5 py-3 text-sm font-semibold text-navy"
          >
            Hang up — start the text
          </button>
        </div>
      ) : (
        <>
          <div className="flex max-h-[420px] flex-col gap-3 overflow-y-auto px-4 py-5">
            {state.messages.map((m, i) => (
              <div
                key={`${m.at}-${i}`}
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[14px] leading-6 ${
                  m.role === "assistant"
                    ? "self-start bg-white/10 text-white"
                    : "self-end bg-[#2f6fed] text-white"
                }`}
              >
                {m.text}
              </div>
            ))}
            {busy ? <div className="self-start text-xs text-white/40">Typing…</div> : null}
          </div>
          {!state.complete ? (
            <form
              className="flex gap-2 border-t border-white/10 p-3"
              onSubmit={(e) => {
                e.preventDefault();
                void send();
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Reply as the customer…"
                className="flex-1 rounded-full bg-white/8 px-4 py-2.5 text-sm outline-none placeholder:text-white/35"
              />
              <button
                type="submit"
                disabled={busy}
                className="rounded-full bg-white px-4 py-2 text-sm font-medium text-navy"
              >
                Send
              </button>
            </form>
          ) : state.lead ? (
            <div className="border-t border-white/10 p-4">
              <p className="mb-3 text-xs uppercase tracking-[0.16em] text-brass">
                This is what the plumber sees · {money(state.lead.typicalMin)}–
                {money(state.lead.typicalMax)}
              </p>
              <LeadCard lead={state.lead} compact />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
