import { Suspense } from "react";
import { redirect } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import { DashboardNav } from "@/components/dashboard-nav";
import { Logo } from "@/components/site-chrome";
import { getSessionAccount } from "@/lib/auth";
import { displayFirstName } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const account = await getSessionAccount();
  if (!account) redirect("/login");
  if (!account.business?.onboarded) redirect("/onboarding");

  const firstName = displayFirstName(account.business.ownerFirstName, account.user.email);

  return (
    <div className="dash-shell min-h-screen text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0e1622]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <Logo light />
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <p className="truncate text-sm text-white/70">
              Welcome back{firstName ? `, ${firstName}` : ""}
            </p>
            <LogoutButton />
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-5">
            <Suspense fallback={<div className="h-12" />}>
              <DashboardNav />
            </Suspense>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-10">{children}</div>
    </div>
  );
}

function LogoutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-medium text-white/70 transition-colors hover:border-white/30 hover:text-white"
      >
        Log out
      </button>
    </form>
  );
}
