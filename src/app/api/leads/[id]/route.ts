import { getSessionAccount } from "@/lib/auth";
import { readStore, uid, writeStore } from "@/lib/db";
import type { LeadStatus, Quote } from "@/lib/types";

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
  const store = readStore();
  const lead = store.leads.find((l) => l.id === id && l.businessId === account.business!.id);
  if (!lead) return Response.json({ error: "Lead not found" }, { status: 404 });

  if (body.status) lead.status = body.status;
  if (typeof body.quotedAmount === "number") {
    lead.quotedAmount = body.quotedAmount;
    lead.status = "quoted";
    const quote: Quote = {
      id: uid("quote"),
      businessId: account.business.id,
      leadId: lead.id,
      amount: body.quotedAmount,
      description: body.quoteDescription || lead.jobLabel,
      status: "sent",
      sentAt: new Date().toISOString(),
      lastFollowUpAt: null,
      createdAt: new Date().toISOString(),
    };
    store.quotes.push(quote);
  }
  if (typeof body.wonAmount === "number") {
    lead.wonAmount = body.wonAmount;
    lead.status = "won";
    const quote = store.quotes.find((q) => q.leadId === lead.id);
    if (quote) quote.status = "accepted";
  }
  if (typeof body.collectedAmount === "number") {
    lead.collectedAmount = body.collectedAmount;
  }
  if (body.followUp) {
    lead.status = "following_up";
    const quote = [...store.quotes].reverse().find((q) => q.leadId === lead.id);
    if (quote) {
      quote.status = "following_up";
      quote.lastFollowUpAt = new Date().toISOString();
    }
  }
  lead.updatedAt = new Date().toISOString();
  writeStore(store);
  return Response.json({ lead });
}
