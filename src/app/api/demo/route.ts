import { getSessionAccount } from "@/lib/auth";
import { startConversation } from "@/lib/engine";
import { replySmart } from "@/lib/intake-ai";
import { insertLead } from "@/lib/store";
import type { ConversationState } from "@/lib/types";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    state?: ConversationState;
    text?: string;
    businessName?: string;
    persist?: boolean;
    customerName?: string;
    customerPhone?: string;
  };
  const businessName = body.businessName || "Dave's Plumbing";
  const incoming = body.state ?? startConversation(businessName);
  const next = await replySmart(incoming, body.text || "", businessName);

  if (next.complete && next.lead && body.persist) {
    const account = await getSessionAccount();
    if (account?.business) {
      await insertLead({
        businessId: account.business.id,
        customerName: body.customerName || next.lead.customerName,
        customerPhone: body.customerPhone || next.lead.customerPhone,
        jobType: next.lead.jobType,
        jobLabel: next.lead.jobLabel,
        problem: next.lead.problem,
        answers: next.lead.answers,
        postcode: next.lead.postcode,
        urgency: next.lead.urgency,
        preferredTime: next.lead.preferredTime,
        photoNote: next.lead.photoNote,
        likelyJob: next.lead.likelyJob,
        typicalMin: next.lead.typicalMin,
        typicalMax: next.lead.typicalMax,
        quotedAmount: null,
        wonAmount: null,
        collectedAmount: null,
        status: "new",
        existingCustomer: false,
        conversation: next.messages,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }

  return Response.json({ state: next });
}
