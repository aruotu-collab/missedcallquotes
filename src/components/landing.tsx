import Link from "next/link";
import { DemoChat } from "./demo-chat";
import { HeroPitch } from "./hero-pitch";
import { CheckIcon } from "./icons";

export function Landing() {
  return (
    <main>
      <HeroPitch />
      <DemoStrip />
      <HowItWorks />
      <Output />
      <DashboardPreview />
      <Intake />
      <PricingTeaser />
      <Founding />
    </main>
  );
}

function DemoStrip() {
  return (
    <section className="border-b border-line bg-paper py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 lg:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brass-deep">Try it yourself</p>
          <h2 className="mt-3 font-serif text-4xl leading-tight">Call this plumber. Then hang up.</h2>
          <p className="mt-4 max-w-md leading-7 text-ink-soft">
            After you see what a missed call is costing, watch what the customer actually
            gets: a short text that turns into a quote-ready job.
          </p>
        </div>
        <DemoChat />
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      t: "Customer calls. You miss it.",
      d: "Conditional forwarding kicks in after about 15–20 seconds. Your number stays the same.",
    },
    {
      n: "02",
      t: "We run plumbing intake.",
      d: "Short SMS. Job type, error codes, photos, postcode, urgency. Not an endless chatbot.",
    },
    {
      n: "03",
      t: "You get a quote-ready pack.",
      d: "One notification: is this job worth ringing back? Call, send a price, or decline.",
    },
  ];
  return (
    <section id="how" className="py-24">
      <div className="mx-auto max-w-6xl px-5">
        <p className="text-xs uppercase tracking-[0.2em] text-brass-deep">The workflow</p>
        <h2 className="mt-3 max-w-2xl font-serif text-4xl leading-tight md:text-5xl">
          Missed call → qualified job → quote → booked work.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <article key={s.n} className="rounded-2xl border border-line bg-card p-6">
              <p className="text-xs tracking-[0.18em] text-brass-deep">{s.n}</p>
              <h3 className="mt-4 font-serif text-2xl">{s.t}</h3>
              <p className="mt-3 text-sm leading-6 text-ink-soft">{s.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Output() {
  return (
    <section className="border-y border-line bg-card py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brass-deep">The product is the output</p>
          <h2 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">
            Not 12 messages. One decision.
          </h2>
          <p className="mt-5 leading-7 text-ink-soft">
            The plumber wants the answer to one question: is this job worth ringing back?
            Give them that in five seconds.
          </p>
          <ul className="mt-8 grid gap-3 text-sm">
            {[
              "Structured plumbing qualification, not a transcript dump",
              "Typical job value so you prioritise money, not noise",
              "CALL · ACCEPT · SEND PRICE · DECLINE",
              "Then track quoted, won, and collected revenue",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-navy p-6 text-white">
          <p className="text-xs uppercase tracking-[0.18em] text-brass">Quote-ready lead</p>
          <p className="mt-3 font-serif text-3xl">Boiler breakdown · Sarah · SW18</p>
          <dl className="mt-6 grid gap-2 text-sm text-white/75">
            {[
              ["Problem", "No heating / hot water"],
              ["Boiler", "Worcester Bosch · EA"],
              ["Urgency", "Today after 4pm"],
              ["Likely job", "Diagnostic / repair"],
              ["Typical value", "£95–£350"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 border-t border-white/10 py-2">
                <dt className="text-white/40">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 grid grid-cols-2 gap-2 text-sm font-medium sm:grid-cols-4">
            {["Call", "Accept", "Send price", "Decline"].map((a) => (
              <span key={a} className="rounded-full bg-white/10 px-3 py-2 text-center">
                {a}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-5">
        <p className="text-xs uppercase tracking-[0.2em] text-brass-deep">Attribution, not vanity</p>
        <h2 className="mt-3 max-w-3xl font-serif text-4xl leading-tight md:text-5xl">
          “You paid us £179. We generated £6,840 in confirmed jobs.”
        </h2>
        <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-[#0e1622] p-6 text-white md:p-8">
          <p className="text-white/55">Good afternoon, Dave.</p>
          <p className="mt-2 font-serif text-4xl text-[#7ddea8] md:text-5xl">
            £6,840 won from missed calls this month
          </p>
          <p className="mt-2 text-sm text-white/45">£4,250 collected · Growth plan £179</p>
          <div className="mt-8 grid gap-3 text-sm sm:grid-cols-3 lg:grid-cols-6">
            {[
              ["Calls missed", "37"],
              ["Conversations", "29"],
              ["Qualified", "24"],
              ["Quotes / visits", "18"],
              ["Jobs won", "11"],
              ["Revenue won", "£6,840"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-white/5 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.14em] text-white/40">{k}</p>
                <p className="mt-1 text-xl">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Intake() {
  const rows = [
    ["Boiler breakdown", "Heating / hot water, make, error, pressure"],
    ["Leak", "Location, active or not, severity, isolatable"],
    ["Blocked toilet", "Overflowing, only this toilet, property type"],
    ["Burst pipe", "Still running, stopcock, location"],
    ["Boiler replacement", "Current boiler, bedrooms, fuel, access"],
    ["Bathroom", "Scope, photos, supply-only or full fit"],
  ];
  return (
    <section className="border-t border-line bg-paper-2/50 py-24">
      <div className="mx-auto max-w-6xl px-5">
        <p className="text-xs uppercase tracking-[0.2em] text-brass-deep">Plumbing intake engine</p>
        <h2 className="mt-3 max-w-3xl font-serif text-4xl leading-tight md:text-5xl">
          The moat is the questions, not the chatbot.
        </h2>
        <p className="mt-5 max-w-2xl leading-7 text-ink-soft">
          Each enquiry type produces a known schema. That becomes conversion data later:
          which questions predict bookings, which jobs are profitable, how fast you must
          respond.
        </p>
        <div className="mt-10 overflow-hidden rounded-2xl border border-line bg-card">
          {rows.map(([k, v]) => (
            <div
              key={k}
              className="grid gap-2 border-b border-line px-5 py-4 last:border-0 md:grid-cols-2"
            >
              <p className="font-medium">{k}</p>
              <p className="text-sm text-ink-soft">{v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingTeaser() {
  const plans = [
    { name: "Solo", price: "£99", note: "Capture + qualification", extra: "One number" },
    { name: "Growth", price: "£179", note: "Quotes, follow-up, booking", extra: "The plan we optimise for", featured: true },
    { name: "Multi-van", price: "£299", note: "Staff + multiple numbers", extra: "Advanced reporting" },
  ];
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-5">
        <p className="text-xs uppercase tracking-[0.2em] text-brass-deep">Pricing</p>
        <h2 className="mt-3 font-serif text-4xl md:text-5xl">Priced against lost jobs, not software.</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {plans.map((p) => (
            <article
              key={p.name}
              className={`rounded-2xl border p-6 ${
                p.featured ? "border-navy bg-navy text-white" : "border-line bg-card"
              }`}
            >
              <p className="text-sm opacity-70">{p.name}</p>
              <p className="mt-3 font-serif text-4xl">
                {p.price}
                <span className="text-base opacity-60">/mo</span>
              </p>
              <p className="mt-3 text-sm opacity-80">{p.note}</p>
              <p className="mt-6 text-sm opacity-60">{p.extra}</p>
            </article>
          ))}
        </div>
        <div className="mt-8">
          <Link href="/pricing" className="text-sm font-medium underline underline-offset-4">
            Full comparison and founding offer
          </Link>
        </div>
      </div>
    </section>
  );
}

function Founding() {
  return (
    <section className="border-t border-line bg-navy py-20 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-5 md:flex-row md:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brass">Founding 10</p>
          <h2 className="mt-3 font-serif text-4xl">£79/month locked for 12 months.</h2>
          <p className="mt-3 max-w-xl text-white/65">
            The MissedCall Guarantee: if we don&apos;t generate one genuine qualified
            opportunity in your first 30 days, your next month is free.
          </p>
        </div>
        <Link
          href="/signup"
          className="rounded-full bg-brass px-6 py-3 text-sm font-semibold text-navy"
        >
          Claim a founding place
        </Link>
      </div>
    </section>
  );
}
