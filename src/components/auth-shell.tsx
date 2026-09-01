import Link from "next/link";
import { Header } from "@/components/site-chrome";

export function AuthPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f8fafc]">
      <Header tone="white" />
      {children}
      <footer className="border-t border-dash-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-xs text-dash-faint">
          <p>© 2026 MissedCallQuotes</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-dash-ink">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-dash-ink">
              Terms
            </Link>
            <a href="mailto:hello@missedcallquotes.com" className="hover:text-dash-ink">
              hello@missedcallquotes.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
