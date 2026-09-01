import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionAccount } from "@/lib/auth";
import { listLeads, listQuotes } from "@/lib/store";
import { money, timeAgo } from "@/lib/format";

export default async function QuotesPage() {
  const account = await getSessionAccount();
  if (!account?.business) redirect("/login");
  const quotes = await listQuotes(account.business.id);
  const leads = await listLeads(account.business.id);

  return (
    <div>
      <h1 className="font-serif text-4xl">Quotes</h1>
      <p className="mt-2 max-w-xl text-sm text-dash-muted">
        Quote recovery is the second half of the domain. A missed call that becomes a quote
        still unpaid is unfinished work.
      </p>
      <div className="mt-8 divide-y divide-dash-line rounded-2xl border border-dash-line bg-white">
        {quotes.map((quote) => {
          const lead = leads.find((l) => l.id === quote.leadId);
          return (
            <Link
              key={quote.id}
              href={`/dashboard/leads/${quote.leadId}`}
              className="flex flex-col gap-2 px-5 py-4 hover:bg-dash-bg md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-medium text-dash-ink">{quote.description}</p>
                <p className="text-sm text-dash-muted">
                  {lead?.customerName || "Customer"} · {quote.status.replace("_", " ")} ·{" "}
                  {quote.lastFollowUpAt ? `followed up ${timeAgo(quote.lastFollowUpAt)}` : timeAgo(quote.createdAt)}
                </p>
              </div>
              <p className="text-dash-accent">{money(quote.amount)}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
