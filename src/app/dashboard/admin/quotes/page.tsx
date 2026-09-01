import Link from "next/link";
import { listAllQuotes, listMembers, requireAdmin } from "@/lib/admin";
import { money, timeAgo } from "@/lib/format";

export default async function AdminQuotesPage() {
  await requireAdmin();
  const [quotes, members] = await Promise.all([listAllQuotes(), listMembers()]);
  const names = new Map(members.map((m) => [m.id, m.name || m.ownerEmail || m.id]));

  return (
    <div className="overflow-x-auto rounded-2xl border border-dash-line bg-white">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead className="border-b border-dash-line text-dash-faint">
          <tr>
            <th className="px-4 py-3 font-medium">Quote</th>
            <th className="px-4 py-3 font-medium">Member</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Amount</th>
            <th className="px-4 py-3 font-medium">When</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((quote) => (
            <tr key={quote.id} className="border-t border-dash-line">
              <td className="px-4 py-3 text-dash-ink">
                <Link href={`/dashboard/admin/jobs/${quote.leadId}`} className="font-medium hover:text-dash-accent">
                  {quote.description || "Quote"}
                </Link>
              </td>
              <td className="px-4 py-3 text-dash-muted">{names.get(quote.businessId) || "—"}</td>
              <td className="px-4 py-3 capitalize text-dash-ink">{quote.status.replace("_", " ")}</td>
              <td className="px-4 py-3 text-dash-accent">{money(quote.amount)}</td>
              <td className="px-4 py-3 text-dash-muted">
                {quote.lastFollowUpAt ? `Followed up ${timeAgo(quote.lastFollowUpAt)}` : timeAgo(quote.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {quotes.length === 0 ? (
        <p className="px-4 py-6 text-sm text-dash-faint">No quotes recorded yet.</p>
      ) : null}
    </div>
  );
}
