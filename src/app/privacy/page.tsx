import { Footer, Header } from "@/components/site-chrome";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="font-serif text-5xl">Privacy</h1>
        <div className="mt-8 grid gap-5 leading-7 text-ink-soft">
          <p>
            MissedCallQuotes processes caller numbers, messages, photos and job details so a
            plumbing business can respond to an enquiry they missed. That is a service
            communication, not marketing.
          </p>
          <p>
            We do not add promotions, discounts or unrelated offers to missed-call replies.
            Customers can ask for their data to be deleted. Photos can be retained or purged
            on a per-business setting.
          </p>
          <p>
            We act as a processor for the plumbing company and as a controller for account
            data. Get a proper DPA and UK legal review before taking live customer traffic.
            This page is a product placeholder, not legal advice.
          </p>
          <p>
            The site operator may keep a log of public page visits (time, path, IP address,
            country and referrer) to operate and secure the service. That log is not shown
            to member accounts.
          </p>
          <p>Contact: privacy@missedcallquotes.com</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
