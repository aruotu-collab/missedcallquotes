import Link from "next/link";
import { notFound } from "next/navigation";
import { getLead, getMember, requireAdmin } from "@/lib/admin";
import { money, timeAgo } from "@/lib/format";

export default async function AdminJobPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) notFound();
  const member = await getMember(lead.businessId);

  return (
    <div className="max-w-3xl">
      <p className="text-xs uppercase tracking-[0.16em] text-dash-accent">
        {lead.status.replace("_", " ")} · {timeAgo(lead.createdAt)}
      </p>
      <h2 className="mt-2 font-serif text-3xl text-dash-ink">
        {lead.jobLabel} — {lead.postcode || "No area yet"}
      </h2>
      <p className="mt-1 text-sm text-dash-muted">
        {lead.customerName} · {lead.customerPhone || "No number"}
        {member ? (
          <>
            {" · "}
            <Link href={`/dashboard/admin/members/${member.id}`} className="text-dash-accent hover:underline">
              {member.name || member.ownerEmail || "Member"}
            </Link>
          </>
        ) : null}
      </p>

      <dl className="mt-8 divide-y divide-dash-line rounded-2xl border border-dash-line bg-white">
        {[
          ["Problem", lead.problem],
          ...Object.entries(lead.answers)
            .filter(([key]) => key !== "problem")
            .map(([key, value]) => [key, value] as const),
          ["Likely job", lead.likelyJob],
          ["Typical value", `${money(lead.typicalMin)}–${money(lead.typicalMax)}`],
          ["Quoted", lead.quotedAmount ? money(lead.quotedAmount) : "—"],
          ["Won", lead.wonAmount ? money(lead.wonAmount) : "—"],
          ["Collected", lead.collectedAmount ? money(lead.collectedAmount) : "—"],
          ["Photo", lead.photoNote || "—"],
        ].map(([label, value]) => (
          <div key={label} className="grid grid-cols-3 gap-4 px-5 py-3 text-sm">
            <dt className="text-dash-faint">{label}</dt>
            <dd className="col-span-2 text-dash-ink">{value}</dd>
          </div>
        ))}
      </dl>

      {lead.conversation.length ? (
        <div className="mt-10">
          <h3 className="text-xs uppercase tracking-[0.16em] text-dash-faint">Conversation</h3>
          <div className="mt-4 grid gap-2">
            {lead.conversation.map((message, index) => (
              <p key={index} className="text-sm text-dash-ink">
                <span className="text-dash-faint">{message.role === "assistant" ? "MCQ" : "Caller"}:</span>{" "}
                {message.text}
              </p>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
