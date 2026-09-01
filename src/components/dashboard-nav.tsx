"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  ["/dashboard", "Today"],
  ["/dashboard/leads", "Jobs"],
  ["/dashboard/quotes", "Quotes"],
  ["/dashboard/simulate", "Catch a call"],
  ["/dashboard/settings", "Setup"],
] as const;

export function DashboardNav({ admin = false }: { admin?: boolean }) {
  const pathname = usePathname() ?? "";
  const items = admin ? [...links, ["/dashboard/admin", "Admin"] as const] : links;

  return (
    <nav className="flex gap-1 overflow-x-auto" aria-label="Dashboard">
      {items.map(([href, label]) => {
        const active = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`shrink-0 border-b-2 px-3 py-3 text-sm transition-colors ${
              active
                ? "border-dash-accent font-medium text-dash-accent"
                : "border-transparent text-dash-muted hover:text-dash-accent"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
