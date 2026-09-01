import { redirect } from "next/navigation";
import { getSessionAccount } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const account = await getSessionAccount();
  if (!account) redirect("/login");
  if (account.business?.onboarded) redirect("/dashboard");
  return children;
}
