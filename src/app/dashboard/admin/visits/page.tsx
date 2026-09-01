import { listVisits, requireAdmin, visitCounts } from "@/lib/admin";
import { timeAgo } from "@/lib/format";

export default async function AdminVisitsPage() {
  await requireAdmin();
  const [visits, stats] = await Promise.all([listVisits(500), visitCounts()]);

  return (
    <div>
      <p className="mb-4 text-sm text-dash-muted">
        {stats.total} recorded · {stats.today} today · {stats.week} in 7 days · {stats.uniqueIps}{" "}
        unique IPs this week. IPs come from the request, not Google Analytics.
      </p>
      <div className="overflow-x-auto rounded-2xl border border-dash-line bg-white">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="border-b border-dash-line text-dash-faint">
            <tr>
              <th className="px-4 py-3 font-medium">When</th>
              <th className="px-4 py-3 font-medium">Page</th>
              <th className="px-4 py-3 font-medium">IP</th>
              <th className="px-4 py-3 font-medium">Country</th>
              <th className="px-4 py-3 font-medium">Referrer</th>
              <th className="px-4 py-3 font-medium">Browser</th>
            </tr>
          </thead>
          <tbody>
            {visits.map((visit) => (
              <tr key={visit.id} className="border-t border-dash-line">
                <td className="px-4 py-3 text-dash-muted">{timeAgo(visit.createdAt)}</td>
                <td className="px-4 py-3 text-dash-ink">{visit.path}</td>
                <td className="px-4 py-3 font-mono text-xs text-dash-ink">{visit.ip || "—"}</td>
                <td className="px-4 py-3 text-dash-muted">{visit.country || "—"}</td>
                <td className="max-w-xs truncate px-4 py-3 text-dash-muted">{visit.referrer || "—"}</td>
                <td className="max-w-xs truncate px-4 py-3 text-xs text-dash-faint">{visit.userAgent || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {visits.length === 0 ? (
          <p className="px-4 py-6 text-sm text-dash-faint">
            No visits yet. Run supabase/admin.sql, then open the homepage.
          </p>
        ) : null}
      </div>
    </div>
  );
}
