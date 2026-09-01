import { notFound, redirect } from "next/navigation";
import { getSessionAccount } from "@/lib/auth";
import { listLeads } from "@/lib/store";
import { LeadActions } from "@/components/lead-actions";
import { money, timeAgo } from "@/lib/format";

export default async function LeadPage({ params }: { params: Promise<{ id: string }> }) {
  const account = await getSessionAccount();
  if (!account?.business) redirect("/login");
  const { id } = await params;
  const lead = (await listLeads(account.business.id)).find((l) => l.id === id);
  if (!lead) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs uppercase tracking-[0.16em] text-dash-accent">
        {lead.status.replace("_", " ")} · {timeAgo(lead.createdAt)}
      </p>
      <h1 className="mt-2 font-serif text-4xl text-dash-ink">
        {lead.jobLabel} — {lead.postcode || "No area yet"}
      </h1>
      <p className="mt-2 text-dash-muted">
        {lead.customerName} · {lead.customerPhone || "Number captured at install"}
      </p>

      <dl className="mt-8 divide-y divide-dash-line rounded-2xl border border-dash-line bg-white">
        {[
          ["Problem", lead.problem],
          ...Object.entries(lead.answers)
            .filter(([k]) => k !== "problem")
            .map(([k, v]) => [k, v] as const),
          ["Likely job", lead.likelyJob],
          ["Typical value", `${money(lead.typicalMin)}–${money(lead.typicalMax)}`],
          ["Quoted", lead.quotedAmount ? money(lead.quotedAmount) : "—"],
          ["Won", lead.wonAmount ? money(lead.wonAmount) : "—"],
          ["Collected", lead.collectedAmount ? money(lead.collectedAmount) : "—"],
          ["Photo", lead.photoNote],
        ].map(([k, v]) => (
          <div key={k} className="grid grid-cols-3 gap-4 px-5 py-3 text-sm">
            <dt className="text-dash-faint">{k}</dt>
            <dd className="col-span-2">{v}</dd>
          </div>
        ))}
      </dl>

      <LeadActions lead={lead} callOut={account.business.callOut} diagnostic={account.business.boilerDiagnostic} />

      {lead.conversation.length ? (
        <div className="mt-10">
          <h2 className="text-xs uppercase tracking-[0.16em] text-dash-faint">Conversation</h2>
          <div className="mt-4 grid gap-2">
            {lead.conversation.map((m, i) => (
              <p key={i} className="text-sm text-dash-ink">
                <span className="text-dash-faint">{m.role === "assistant" ? "MCQ" : "Caller"}:</span> {m.text}
              </p>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
