import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import { getSessionAccount } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const account = await getSessionAccount();
  if (!account) redirect("/login");
  if (!account.business?.onboarded) redirect("/onboarding");

  const links = [
    ["/dashboard", "Today"],
    ["/dashboard/leads", "Jobs"],
    ["/dashboard/quotes", "Quotes"],
    ["/dashboard/simulate", "Catch a call"],
    ["/dashboard/settings", "Setup"],
  ];

  return (
    <div className="dash-shell min-h-screen text-white">
      <aside className="fixed inset-y-0 left-0 hidden w-56 border-r border-white/10 px-5 py-6 md:block">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          MissedCallQuotes
        </Link>
        <p className="mt-1 text-xs text-white/40">{account.business.name}</p>
        <nav className="mt-10 grid gap-2 text-sm text-white/70">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="rounded-lg px-2 py-2 hover:bg-white/5 hover:text-white">
              {label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-6 left-5">
          <LogoutButton />
        </div>
      </aside>
      <div className="md:pl-56">
        <header className="border-b border-white/10 px-5 py-4 md:hidden">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="text-sm font-semibold">
              MissedCallQuotes
            </Link>
            <LogoutButton />
          </div>
          <nav className="mt-3 flex gap-4 overflow-x-auto text-sm text-white/60">
            {links.map(([href, label]) => (
              <Link key={href} href={href} className="shrink-0 hover:text-white">
                {label}
              </Link>
            ))}
          </nav>
        </header>
        <div className="px-5 py-8 md:px-10">{children}</div>
      </div>
    </div>
  );
}

function LogoutButton() {
  return (
    <form action={signOut}>
      <button type="submit" className="text-xs text-white/40 hover:text-white">
        Log out
      </button>
    </form>
  );
}
