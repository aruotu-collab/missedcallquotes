import { Footer, Header } from "@/components/site-chrome";
import { getSessionUser } from "@/lib/auth";
import type { Metadata } from "next";
import Link from "next/link";
import { CheckIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Pricing" };

const features = [
  ["Missed-call capture", true, true, true],
  ["Plumbing qualification", true, true, true],
  ["Photos & postcode", true, true, true],
  ["Quote-ready summaries", true, true, true],
  ["Revenue tracking", true, true, true],
  ["Quote follow-up", false, true, true],
  ["Booking", false, true, true],
  ["Multiple staff", false, false, true],
  ["Multiple numbers", false, false, true],
  ["Advanced reporting", false, true, true],
] as const;

export default async function PricingPage() {
  const user = await getSessionUser();
  return (
    <>
      <Header signedIn={Boolean(user)} />
      <main className="mx-auto max-w-6xl px-5 py-16">
        <p className="text-xs uppercase tracking-[0.2em] text-brass-deep">Pricing</p>
        <h1 className="mt-3 max-w-3xl font-serif text-5xl leading-tight">
          Don&apos;t compete with £59. Charge against a lost boiler job.
        </h1>
        <p className="mt-5 max-w-2xl text-ink-soft leading-7">
          The MissedCall Guarantee: we install it on your number. If it doesn&apos;t generate
          at least one genuine qualified opportunity in 30 days, your next month is free.
        </p>
        <div className="mt-12 overflow-x-auto rounded-2xl border border-line bg-card">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="p-5 font-medium text-muted"> </th>
                <th className="p-5">
                  Solo
                  <div className="font-serif text-3xl text-ink">£99</div>
                </th>
                <th className="bg-navy p-5 text-white">
                  Growth
                  <div className="font-serif text-3xl">£179</div>
                </th>
                <th className="p-5">
                  Multi-van
                  <div className="font-serif text-3xl text-ink">£299</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((row) => (
                <tr key={row[0]} className="border-b border-line last:border-0">
                  <td className="p-4 text-ink-soft">{row[0]}</td>
                  {[row[1], row[2], row[3]].map((ok, i) => (
                    <td
                      key={i}
                      className={`p-4 ${i === 1 ? "bg-navy/5" : ""}`}
                    >
                      {ok ? <CheckIcon className="h-4 w-4 text-forest" /> : <span className="text-line">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-10 rounded-2xl border border-brass/40 bg-[#f7eed6] p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-brass-deep">Founding 10</p>
          <p className="mt-2 font-serif text-3xl">£79/month locked for 12 months</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-ink-soft">
            No setup fee. In exchange: weekly feedback, a 15-minute interview after 30 days,
            and permission to publish anonymised results.
          </p>
          <Link
            href="/signup"
            className="mt-5 inline-block rounded-full bg-navy px-5 py-3 text-sm font-medium text-white"
          >
            Apply as a founding customer
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
