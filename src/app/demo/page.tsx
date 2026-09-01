import { DemoChat } from "@/components/demo-chat";
import { Footer, Header } from "@/components/site-chrome";
import { getSessionUser } from "@/lib/auth";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Live demo" };

export default async function DemoPage() {
  const user = await getSessionUser();
  return (
    <>
      <Header signedIn={Boolean(user)} />
      <main className="mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brass-deep">Try it yourself</p>
          <h1 className="mt-3 font-serif text-5xl leading-tight">
            Call this plumber. Then hang up.
          </h1>
          <ol className="mt-8 grid gap-4 text-ink-soft">
            <li>1. Pretend you just rang Dave&apos;s Plumbing.</li>
            <li>2. Hang up when it rings.</li>
            <li>3. Reply as if your boiler has failed, a pipe has burst, or a toilet is blocked.</li>
            <li>4. Watch the quote-ready job pack appear.</li>
          </ol>
          <p className="mt-8 max-w-md leading-7 text-ink-soft">
            This is what your missed customers could experience. No PowerPoint. No 30-minute
            software demo.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-block rounded-full bg-navy px-5 py-3 text-sm font-medium text-white"
          >
            Set up your number
          </Link>
        </div>
        <DemoChat />
      </main>
      <Footer />
    </>
  );
}
