import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionAccount } from "@/lib/auth";
import { listLeads } from "@/lib/store";
import { money, timeAgo } from "@/lib/format";

export default async function LeadsPage() {
  const account = await getSessionAccount();
  if (!account?.business) redirect("/login");
  const leads = await listLeads(account.business.id);

  return (
    <div>
      <h1 className="font-serif text-4xl">Jobs</h1>
      <p className="mt-2 text-sm text-dash-muted">Every missed caller that became a pack.</p>
      <div className="mt-8 divide-y divide-dash-line rounded-2xl border border-dash-line bg-white">
        {leads.map((lead) => (
          <Link
            key={lead.id}
            href={`/dashboard/leads/${lead.id}`}
            className="flex flex-col gap-2 px-5 py-4 hover:bg-dash-bg md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="font-medium text-dash-ink">
                {lead.jobLabel} · {lead.customerName}
              </p>
              <p className="text-sm text-dash-muted">
                {lead.postcode || "—"} · {lead.status.replace("_", " ")} · {timeAgo(lead.createdAt)}
              </p>
            </div>
            <p className="text-dash-accent">
              {lead.wonAmount
                ? money(lead.wonAmount)
                : lead.quotedAmount
                  ? money(lead.quotedAmount)
                  : `${money(lead.typicalMin)}–${money(lead.typicalMax)}`}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
