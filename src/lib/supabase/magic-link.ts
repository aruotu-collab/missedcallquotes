import { appOrigin } from "./config";
import { createClient } from "./server";

export async function sendMagicLink(
  request: Request,
  email: string,
  options?: { firstName?: string; businessName?: string; createUser?: boolean },
) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: email.trim().toLowerCase(),
    options: {
      shouldCreateUser: options?.createUser ?? true,
      emailRedirectTo: `${appOrigin(request)}/auth/callback`,
      data: {
        first_name: options?.firstName ?? "",
        business_name: options?.businessName ?? "",
      },
    },
  });
  return error;
}
