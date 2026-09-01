import Link from "next/link";
import { getSessionAccount } from "@/lib/auth";
import { listLeads, listQuotes } from "@/lib/store";
import { money, monthLabel, timeAgo } from "@/lib/format";
import { funnel } from "@/lib/metrics";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const account = await getSessionAccount();
  if (!account?.business) redirect("/login");
  const leads = await listLeads(account.business.id);
  const quotes = await listQuotes(account.business.id);
  const stats = funnel(leads);
  const needs = leads.filter((l) => ["new", "contacted", "quoted", "following_up"].includes(l.status));

  return (
    <div>
      <p className="text-dash-faint">{monthLabel()}</p>
      <h1 className="mt-2 font-serif text-4xl text-dash-accent md:text-6xl">
        {money(stats.wonRev)} won from missed calls this month
      </h1>
      <p className="mt-3 text-sm text-dash-muted">
        {money(stats.collected)} collected · {account.business.plan === "founding" ? "Founding £79" : "Subscription"} ·
        potential {money(stats.potential)}
      </p>

      <div className="mt-10 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          ["Calls missed", stats.missed],
          ["Conversations", stats.started],
          ["Qualified", stats.qualified],
          ["Quotes / visits", stats.quoted],
          ["Jobs won", stats.jobsWon],
          ["Revenue won", money(stats.wonRev)],
        ].map(([k, v]) => (
          <div key={String(k)} className="rounded-xl border border-dash-line bg-white px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.14em] text-dash-faint">{k}</p>
            <p className="mt-1 text-xl text-dash-ink">{v}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-xs uppercase tracking-[0.18em] text-dash-accent">Needs you</h2>
      <div className="mt-4 grid gap-3">
        {needs.length === 0 ? (
          <p className="text-dash-faint">Nothing waiting. Missed callers will land here.</p>
        ) : (
          needs.map((lead) => (
            <Link
              key={lead.id}
              href={`/dashboard/leads/${lead.id}`}
              className="flex flex-col justify-between gap-3 rounded-2xl border border-dash-line bg-white px-5 py-4 md:flex-row md:items-center"
            >
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-dash-accent">
                  {lead.status === "new" ? "Urgent" : lead.status.replace("_", " ")} · {timeAgo(lead.createdAt)}
                </p>
                <p className="mt-1 font-serif text-2xl text-dash-ink">
                  {lead.jobLabel} — {lead.postcode || "No postcode"}
                </p>
                <p className="mt-1 text-sm text-dash-muted">
                  {lead.customerName} · {lead.problem}
                </p>
              </div>
              <div className="text-right">
                <p className="text-dash-accent">
                  {lead.quotedAmount
                    ? money(lead.quotedAmount)
                    : `${money(lead.typicalMin)}–${money(lead.typicalMax)}`}
                </p>
                <p className="text-xs text-dash-faint">
                  {lead.status === "following_up" ? "FOLLOW UP" : lead.status === "new" ? "CALL" : "OPEN"}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>

      {quotes.some((q) => q.status === "following_up") ? (
        <p className="mt-8 text-sm text-dash-faint">
          {quotes.filter((q) => q.status === "following_up").length} quote
          {quotes.filter((q) => q.status === "following_up").length === 1 ? "" : "s"} waiting on a
          follow-up.
        </p>
      ) : null}
    </div>
  );
}
