import { type NextFetchEvent, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { recordVisit } from "@/lib/visits";

export async function proxy(request: NextRequest, event: NextFetchEvent) {
  const response = await updateSession(request);
  event.waitUntil(recordVisit(request));
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
