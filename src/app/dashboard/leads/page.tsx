import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionAccount } from "@/lib/auth";
import { leadsFor } from "@/lib/db";
import { money, timeAgo } from "@/lib/format";

export default async function LeadsPage() {
  const account = await getSessionAccount();
  if (!account?.business) redirect("/login");
  const leads = leadsFor(account.business.id);

  return (
    <div>
      <h1 className="font-serif text-4xl">Jobs</h1>
      <p className="mt-2 text-sm text-white/45">Every missed caller that became a pack.</p>
      <div className="mt-8 divide-y divide-white/10 rounded-2xl border border-white/10">
        {leads.map((lead) => (
          <Link
            key={lead.id}
            href={`/dashboard/leads/${lead.id}`}
            className="flex flex-col gap-2 px-5 py-4 hover:bg-white/5 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="font-medium">
                {lead.jobLabel} · {lead.customerName}
              </p>
              <p className="text-sm text-white/45">
                {lead.postcode || "—"} · {lead.status.replace("_", " ")} · {timeAgo(lead.createdAt)}
              </p>
            </div>
            <p className="text-[#7ddea8]">
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
