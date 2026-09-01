import { getSessionAccount } from "@/lib/auth";
import { applyLeadAction } from "@/lib/store";
import type { LeadStatus } from "@/lib/types";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const account = await getSessionAccount();
  if (!account?.business) return Response.json({ error: "Unauthorised" }, { status: 401 });
  const { id } = await params;
  const body = (await req.json()) as {
    status?: LeadStatus;
    quotedAmount?: number;
    wonAmount?: number;
    collectedAmount?: number;
    quoteDescription?: string;
    followUp?: boolean;
  };
  const lead = await applyLeadAction(account.business.id, id, body);
  if (!lead) return Response.json({ error: "Lead not found" }, { status: 404 });
  return Response.json({ lead });
}
