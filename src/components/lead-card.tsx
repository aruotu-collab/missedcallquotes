import { money } from "@/lib/format";
import type { ConversationState, Lead } from "@/lib/types";

type Pack = NonNullable<ConversationState["lead"]> | Lead;

export function LeadCard({
  lead,
  compact = false,
}: {
  lead: Pack;
  compact?: boolean;
}) {
  const rows = [
    ["Customer", lead.customerName],
    ["Job", lead.jobLabel],
    ["Problem", lead.problem],
    ["Postcode", lead.postcode || "—"],
    ["Urgency", lead.urgency || "—"],
    ["Likely job", lead.likelyJob],
    ["Typical value", `${money(lead.typicalMin)}–${money(lead.typicalMax)}`],
    ["Photo", lead.photoNote],
  ];

  return (
    <div
      className={`overflow-hidden rounded-2xl border ${
        compact ? "border-white/10 bg-white/5 text-white" : "border-line bg-card text-ink"
      }`}
    >
      <div className="flex items-center justify-between border-b border-inherit px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brass">
          Quote-ready lead
        </p>
        <p className="text-xs opacity-60">{lead.jobLabel}</p>
      </div>
      <dl className="divide-y divide-inherit">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-3 gap-3 px-4 py-2.5 text-sm">
            <dt className="opacity-50">{k}</dt>
            <dd className="col-span-2">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
