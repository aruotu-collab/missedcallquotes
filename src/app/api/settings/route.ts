import { getSessionAccount } from "@/lib/auth";
import { updateBusiness } from "@/lib/store";
import type { Business } from "@/lib/types";

export async function GET() {
  const account = await getSessionAccount();
  if (!account?.business) return Response.json({ error: "Unauthorised" }, { status: 401 });
  return Response.json({ business: account.business });
}

export async function POST(req: Request) {
  const account = await getSessionAccount();
  if (!account?.business) return Response.json({ error: "Unauthorised" }, { status: 401 });
  const patch = (await req.json()) as Partial<Business>;
  const business = await updateBusiness(account.business.id, patch);
  if (!business) return Response.json({ error: "Business not found" }, { status: 404 });
  return Response.json({ business });
}
