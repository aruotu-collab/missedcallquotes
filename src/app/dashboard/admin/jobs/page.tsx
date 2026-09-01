import Link from "next/link";
import { listAllLeads, listMembers, requireAdmin } from "@/lib/admin";
import { money, timeAgo } from "@/lib/format";

export default async function AdminJobsPage() {
  await requireAdmin();
  const [leads, members] = await Promise.all([listAllLeads(), listMembers()]);
  const names = new Map(members.map((m) => [m.id, m.name || m.ownerEmail || m.id]));

  return (
    <div className="overflow-x-auto rounded-2xl border border-dash-line bg-white">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead className="border-b border-dash-line text-dash-faint">
          <tr>
            <th className="px-4 py-3 font-medium">Job</th>
            <th className="px-4 py-3 font-medium">Customer</th>
            <th className="px-4 py-3 font-medium">Member</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Value</th>
            <th className="px-4 py-3 font-medium">When</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-t border-dash-line">
              <td className="px-4 py-3 text-dash-ink">
                <Link href={`/dashboard/admin/jobs/${lead.id}`} className="font-medium hover:text-dash-accent">
                  {lead.jobLabel}
                </Link>
                <p className="text-dash-muted">{lead.postcode || "No postcode"}</p>
              </td>
              <td className="px-4 py-3 text-dash-ink">
                {lead.customerName}
                {lead.customerPhone ? <p className="text-dash-muted">{lead.customerPhone}</p> : null}
              </td>
              <td className="px-4 py-3 text-dash-muted">{names.get(lead.businessId) || "—"}</td>
              <td className="px-4 py-3 capitalize text-dash-ink">{lead.status.replace("_", " ")}</td>
              <td className="px-4 py-3 text-dash-accent">
                {lead.wonAmount
                  ? money(lead.wonAmount)
                  : lead.quotedAmount
                    ? money(lead.quotedAmount)
                    : `${money(lead.typicalMin)}–${money(lead.typicalMax)}`}
              </td>
              <td className="px-4 py-3 text-dash-muted">{timeAgo(lead.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {leads.length === 0 ? (
        <p className="px-4 py-6 text-sm text-dash-faint">No jobs recorded yet.</p>
      ) : null}
    </div>
  );
}
