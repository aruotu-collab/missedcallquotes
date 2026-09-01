import Link from "next/link";
import { notFound } from "next/navigation";
import { setMemberPlan } from "@/app/dashboard/admin/actions";
import { getMember, listAllLeads, requireAdmin } from "@/lib/admin";
import { money, timeAgo } from "@/lib/format";

export default async function AdminMemberPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const member = await getMember(id);
  if (!member) notFound();
  const jobs = (await listAllLeads()).filter((lead) => lead.businessId === member.id);

  return (
    <div className="max-w-3xl">
      <p className="text-xs uppercase tracking-[0.16em] text-dash-accent">
        {member.onboarded ? "Onboarded" : "Setup incomplete"} · {timeAgo(member.createdAt)}
      </p>
      <h2 className="mt-2 font-serif text-3xl text-dash-ink">{member.name || "Unnamed business"}</h2>
      <p className="mt-1 text-sm text-dash-muted">
        {member.ownerFirstName || "—"} · {member.ownerEmail || "No email"} · {member.city || "No city"}
      </p>

      <dl className="mt-8 divide-y divide-dash-line rounded-2xl border border-dash-line bg-white">
        {[
          ["Phone", member.phone || "—"],
          ["SMS number", member.notificationMobile || "—"],
          ["Service areas", member.serviceAreas.join(", ") || "—"],
          ["Services", member.services.join(", ") || "—"],
          ["Call-out", money(member.callOut)],
          ["Emergency", money(member.emergencyCallOut)],
          ["Hourly", money(member.hourlyLabour)],
          ["Minimum job", money(member.minimumJob)],
          ["Boiler diagnostic", money(member.boilerDiagnostic)],
          ["Tone", member.tone || "—"],
        ].map(([label, value]) => (
          <div key={label} className="grid grid-cols-3 gap-4 px-5 py-3 text-sm">
            <dt className="text-dash-faint">{label}</dt>
            <dd className="col-span-2 text-dash-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <form action={setMemberPlan} className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl border border-dash-line bg-white px-5 py-4">
        <input type="hidden" name="id" value={member.id} />
        <label className="grid gap-1 text-sm">
          <span className="text-dash-faint">Plan</span>
          <select
            name="plan"
            defaultValue={member.plan}
            className="rounded-lg border border-dash-line bg-white px-3 py-2 text-dash-ink"
          >
            <option value="founding">Founding</option>
            <option value="solo">Solo</option>
            <option value="growth">Growth</option>
            <option value="multivan">Multivan</option>
          </select>
        </label>
        <button
          type="submit"
          className="rounded-full bg-dash-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Save plan
        </button>
      </form>

      <h3 className="mt-10 text-xs uppercase tracking-[0.16em] text-dash-accent">Jobs</h3>
      <div className="mt-3 divide-y divide-dash-line rounded-2xl border border-dash-line bg-white">
        {jobs.length === 0 ? (
          <p className="px-5 py-4 text-sm text-dash-faint">No jobs for this member yet.</p>
        ) : (
          jobs.map((lead) => (
            <Link
              key={lead.id}
              href={`/dashboard/admin/jobs/${lead.id}`}
              className="flex items-center justify-between px-5 py-3 text-sm hover:bg-dash-bg"
            >
              <span className="text-dash-ink">
                {lead.jobLabel} · {lead.customerName}
              </span>
              <span className="text-dash-muted">
                {lead.status.replace("_", " ")} · {timeAgo(lead.createdAt)}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
