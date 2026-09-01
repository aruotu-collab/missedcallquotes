import Link from "next/link";
import { listMembers, requireAdmin } from "@/lib/admin";
import { timeAgo } from "@/lib/format";

export default async function AdminMembersPage() {
  await requireAdmin();
  const members = await listMembers();

  return (
    <div className="overflow-x-auto rounded-2xl border border-dash-line bg-white">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-dash-line text-dash-faint">
          <tr>
            <th className="px-4 py-3 font-medium">Member</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">City</th>
            <th className="px-4 py-3 font-medium">Plan</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Joined</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id} className="border-t border-dash-line">
              <td className="px-4 py-3 text-dash-ink">
                <Link href={`/dashboard/admin/members/${member.id}`} className="font-medium hover:text-dash-accent">
                  {member.name || "Unnamed business"}
                </Link>
                <p className="text-dash-muted">{member.ownerFirstName || "—"}</p>
              </td>
              <td className="px-4 py-3 text-dash-ink">{member.ownerEmail || "—"}</td>
              <td className="px-4 py-3 text-dash-muted">{member.city || "—"}</td>
              <td className="px-4 py-3 capitalize text-dash-ink">{member.plan}</td>
              <td className="px-4 py-3 text-dash-muted">{member.onboarded ? "Onboarded" : "Setup incomplete"}</td>
              <td className="px-4 py-3 text-dash-muted">{timeAgo(member.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {members.length === 0 ? (
        <p className="px-4 py-6 text-sm text-dash-faint">No member businesses yet.</p>
      ) : null}
    </div>
  );
}
