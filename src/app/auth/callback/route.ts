import { NextResponse } from "next/server";
import { ensureMemberBusiness } from "@/lib/store";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next");

  if (!code || !isSupabaseConfigured()) {
    return NextResponse.redirect(new URL("/login?error=auth", url.origin));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL("/login?error=auth", url.origin));
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login?error=auth", url.origin));
  }

  const meta = user.user_metadata ?? {};
  const business = await ensureMemberBusiness({
    userId: user.id,
    firstName: typeof meta.first_name === "string" ? meta.first_name : "",
    businessName: typeof meta.business_name === "string" ? meta.business_name : "",
  });

  const dest = next || (business?.onboarded ? "/dashboard" : "/onboarding");
  return NextResponse.redirect(new URL(dest, url.origin));
}
