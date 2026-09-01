import Link from "next/link";
import { getSessionAccount } from "@/lib/auth";
import { leadsFor, quotesFor } from "@/lib/db";
import { greeting, money, timeAgo } from "@/lib/format";
import { funnel } from "@/lib/metrics";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const account = await getSessionAccount();
  if (!account?.business) redirect("/login");
  const leads = leadsFor(account.business.id);
  const quotes = quotesFor(account.business.id);
  const stats = funnel(leads);
  const needs = leads.filter((l) => ["new", "contacted", "quoted", "following_up"].includes(l.status));

  return (
    <div>
      <p className="text-white/50">{greeting(account.business.ownerFirstName)}</p>
      <h1 className="mt-2 font-serif text-4xl text-[#7ddea8] md:text-6xl">
        {money(stats.wonRev)} won from missed calls this month
      </h1>
      <p className="mt-3 text-sm text-white/45">
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
          <div key={String(k)} className="rounded-xl bg-white/5 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.14em] text-white/40">{k}</p>
            <p className="mt-1 text-xl">{v}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-xs uppercase tracking-[0.18em] text-brass">Needs you</h2>
      <div className="mt-4 grid gap-3">
        {needs.length === 0 ? (
          <p className="text-white/40">Nothing waiting. Missed callers will land here.</p>
        ) : (
          needs.map((lead) => (
            <Link
              key={lead.id}
              href={`/dashboard/leads/${lead.id}`}
              className="flex flex-col justify-between gap-3 rounded-2xl bg-white/5 px-5 py-4 md:flex-row md:items-center"
            >
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-brass">
                  {lead.status === "new" ? "Urgent" : lead.status.replace("_", " ")} · {timeAgo(lead.createdAt)}
                </p>
                <p className="mt-1 font-serif text-2xl">
                  {lead.jobLabel} — {lead.postcode || "No postcode"}
                </p>
                <p className="mt-1 text-sm text-white/55">
                  {lead.customerName} · {lead.problem}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[#7ddea8]">
                  {lead.quotedAmount
                    ? money(lead.quotedAmount)
                    : `${money(lead.typicalMin)}–${money(lead.typicalMax)}`}
                </p>
                <p className="text-xs text-white/40">
                  {lead.status === "following_up" ? "FOLLOW UP" : lead.status === "new" ? "CALL" : "OPEN"}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>

      {quotes.some((q) => q.status === "following_up") ? (
        <p className="mt-8 text-sm text-white/40">
          {quotes.filter((q) => q.status === "following_up").length} quote
          {quotes.filter((q) => q.status === "following_up").length === 1 ? "" : "s"} waiting on a
          follow-up.
        </p>
      ) : null}
    </div>
  );
}
