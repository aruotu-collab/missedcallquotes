"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function HeaderActions({ signedIn = false }: { signedIn?: boolean }) {
  const pathname = usePathname() ?? "";
  const onLogin = pathname === "/login";
  const onSignup = pathname === "/signup";

  if (signedIn) {
    return (
      <Link href="/dashboard" className="rounded-full bg-navy px-4 py-2 text-sm font-medium text-white">
        Dashboard
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/demo" className="text-sm text-ink-soft hover:text-ink md:hidden">
        Demo
      </Link>
      <Link
        href="/login"
        className={`text-sm ${onLogin ? "font-medium text-ink" : "text-ink-soft hover:text-ink"}`}
      >
        Log in
      </Link>
      <Link
        href="/signup"
        className={`rounded-full px-4 py-2 text-sm font-medium ${
          onSignup ? "bg-navy-2 text-white" : "bg-navy text-white"
        }`}
      >
        Get founding price
      </Link>
    </div>
  );
}
