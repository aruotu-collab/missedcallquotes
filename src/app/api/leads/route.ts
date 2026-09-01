import { getSessionAccount } from "@/lib/auth";
import { leadsFor, quotesFor } from "@/lib/db";
import { funnel } from "@/lib/metrics";

export async function GET() {
  const account = await getSessionAccount();
  if (!account?.business) return Response.json({ error: "Unauthorised" }, { status: 401 });
  const leads = leadsFor(account.business.id);
  const quotes = quotesFor(account.business.id);
  return Response.json({
    business: account.business,
    leads,
    quotes,
    funnel: funnel(leads),
  });
}
