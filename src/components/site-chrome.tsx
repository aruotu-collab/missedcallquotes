import { Suspense } from "react";
import Link from "next/link";
import { HeaderActions } from "@/components/header-actions";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span
        className={`grid h-8 w-8 place-items-center rounded-md text-[11px] font-semibold tracking-tight ${
          light ? "bg-brass text-navy" : "bg-navy text-paper"
        }`}
      >
        MC
      </span>
      <span className={`text-[15px] font-semibold tracking-tight ${light ? "text-white" : "text-ink"}`}>
        MissedCallQuotes
      </span>
    </Link>
  );
}

export function Header({
  signedIn = false,
  tone = "paper",
}: {
  signedIn?: boolean;
  tone?: "paper" | "white";
}) {
  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur ${
        tone === "white" ? "border-dash-line bg-white/90" : "border-line/70 bg-paper/85"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm text-ink-soft md:flex">
          <a href="/#how" className="hover:text-ink">
            How it works
          </a>
          <a href="/#calculator" className="hover:text-ink">
            Calculator
          </a>
          <Link href="/pricing" className="hover:text-ink">
            Pricing
          </Link>
          <Link href="/demo" className="hover:text-ink">
            Live demo
          </Link>
        </nav>
        <Suspense fallback={<div className="h-9 w-40" />}>
          <HeaderActions signedIn={signedIn} />
        </Suspense>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-md text-sm leading-6 text-white/65">
            Revenue recovery for UK plumbers and heating engineers. Missed call → qualified
            job → quote → booked work.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-brass">Product</p>
          <div className="mt-4 grid gap-2 text-sm text-white/75">
            <Link href="/demo">Live demo</Link>
            <Link href="/pricing">Pricing</Link>
            <a href="/#calculator">Missed revenue calculator</a>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-brass">Company</p>
          <div className="mt-4 grid gap-2 text-sm text-white/75">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <a href="mailto:hello@missedcallquotes.com">hello@missedcallquotes.com</a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-white/45">
        Built for UK plumbers, heating engineers & tradesmen. Keep your existing number. ©{" "}
        {new Date().getFullYear()}{" "}
        MissedCallQuotes.
      </div>
    </footer>
  );
}
