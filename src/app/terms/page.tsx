import { Footer, Header } from "@/components/site-chrome";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="font-serif text-5xl">Terms</h1>
        <div className="mt-8 grid gap-5 leading-7 text-ink-soft">
          <p>
            MissedCallQuotes is a revenue-recovery tool. It does not replace Gas Safe
            diagnosis, emergency services, or your duty of care as a tradesperson.
          </p>
          <p>
            Subscriptions are monthly. The 30-day MissedCall Guarantee applies when the
            product is correctly installed on a live inbound number and you respond to
            qualified leads. SMS, voice and AI usage is metered; we do not promise unlimited
            messages.
          </p>
          <p>
            You must not use the product to send marketing texts to people who called you
            for a job. Founding prices are locked for 12 months for the first ten businesses.
          </p>
          <p>Have a solicitor review this before launch. This is not legal advice.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
