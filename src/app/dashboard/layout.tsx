import { Suspense } from "react";
import { redirect } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import { DashboardNav } from "@/components/dashboard-nav";
import { Logo } from "@/components/site-chrome";
import { isAdminEmail } from "@/lib/admin";
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
  const admin = isAdminEmail(account.user.email);
  if (!account.business?.onboarded && !admin) redirect("/onboarding");

  const firstName = displayFirstName(account.business?.ownerFirstName, account.user.email);

  return (
    <div className="dash-shell min-h-screen">
      <header className="sticky top-0 z-40 border-b border-dash-line bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <Logo />
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <p className="truncate text-sm text-dash-muted">
              Welcome back{firstName ? `, ${firstName}` : ""}
            </p>
            <LogoutButton />
          </div>
        </div>
        <div className="border-t border-dash-line">
          <div className="mx-auto max-w-6xl px-5">
            <Suspense fallback={<div className="h-12" />}>
              <DashboardNav admin={admin} />
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
        className="rounded-full border border-dash-line px-3.5 py-1.5 text-xs font-medium text-dash-muted transition-colors hover:border-dash-accent/40 hover:text-dash-accent"
      >
        Log out
      </button>
    </form>
  );
}
