import { getSessionAccount } from "@/lib/auth";
import { listLeads, listQuotes } from "@/lib/store";
import { funnel } from "@/lib/metrics";

export async function GET() {
  const account = await getSessionAccount();
  if (!account?.business) return Response.json({ error: "Unauthorised" }, { status: 401 });
  const leads = await listLeads(account.business.id);
  const quotes = await listQuotes(account.business.id);
  return Response.json({
    business: account.business,
    leads,
    quotes,
    funnel: funnel(leads),
  });
}
