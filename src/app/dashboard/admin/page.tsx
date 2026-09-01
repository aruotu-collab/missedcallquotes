import Link from "next/link";
import { listAllLeads, listMembers, listVisits, requireAdmin, visitCounts } from "@/lib/admin";
import { timeAgo } from "@/lib/format";

export default async function AdminOverviewPage() {
  await requireAdmin();
  const [members, leads, visits, stats] = await Promise.all([
    listMembers(),
    listAllLeads(),
    listVisits(500),
    visitCounts(),
  ]);
  const onboarded = members.filter((m) => m.onboarded).length;

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Visits today", stats.today],
          ["Visits (7 days)", stats.week],
          ["Unique IPs (7 days)", stats.uniqueIps],
          ["All visits", stats.total],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-xl border border-dash-line bg-white px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.14em] text-dash-faint">{label}</p>
            <p className="mt-1 text-2xl text-dash-ink">{value}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-dash-muted">
        {onboarded}/{members.length} members onboarded · {leads.length} jobs on the board.
      </p>

      <h2 className="mt-10 text-xs uppercase tracking-[0.16em] text-dash-accent">Recent visits</h2>
      <div className="mt-3 overflow-x-auto rounded-2xl border border-dash-line bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-dash-line text-dash-faint">
            <tr>
              <th className="px-4 py-3 font-medium">When</th>
              <th className="px-4 py-3 font-medium">Page</th>
              <th className="px-4 py-3 font-medium">IP</th>
              <th className="px-4 py-3 font-medium">Country</th>
            </tr>
          </thead>
          <tbody>
            {visits.slice(0, 12).map((visit) => (
              <tr key={visit.id} className="border-t border-dash-line">
                <td className="px-4 py-3 text-dash-muted">{timeAgo(visit.createdAt)}</td>
                <td className="px-4 py-3 text-dash-ink">{visit.path}</td>
                <td className="px-4 py-3 font-mono text-xs text-dash-ink">{visit.ip || "—"}</td>
                <td className="px-4 py-3 text-dash-muted">{visit.country || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {visits.length === 0 ? (
          <p className="px-4 py-6 text-sm text-dash-faint">No visits recorded yet. Public pages start logging after the admin SQL is run.</p>
        ) : null}
      </div>
      <p className="mt-4 text-sm">
        <Link href="/dashboard/admin/visits" className="font-medium text-dash-accent hover:underline">
          All visits
        </Link>
      </p>
    </div>
  );
}
