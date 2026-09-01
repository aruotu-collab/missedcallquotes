import { getSessionAccount } from "@/lib/auth";
import { readStore, writeStore } from "@/lib/db";
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
  const store = readStore();
  const idx = store.businesses.findIndex((b) => b.id === account.business!.id);
  if (idx < 0) return Response.json({ error: "Business not found" }, { status: 404 });
  store.businesses[idx] = { ...store.businesses[idx], ...patch };
  writeStore(store);
  return Response.json({ business: store.businesses[idx] });
}
