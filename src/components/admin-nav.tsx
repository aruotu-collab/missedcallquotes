"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  ["/dashboard/admin", "Overview"],
  ["/dashboard/admin/members", "Members"],
  ["/dashboard/admin/jobs", "All jobs"],
  ["/dashboard/admin/quotes", "Quotes"],
  ["/dashboard/admin/visits", "Visits"],
] as const;

export function AdminNav() {
  const pathname = usePathname() ?? "";

  return (
    <nav className="mb-8 flex flex-wrap gap-2" aria-label="Admin">
      {links.map(([href, label]) => {
        const active = href === "/dashboard/admin" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`rounded-full px-3 py-1.5 text-sm ${
              active ? "bg-dash-accent text-white" : "border border-dash-line bg-white text-dash-muted hover:text-dash-ink"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
