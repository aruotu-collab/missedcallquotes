import { redirect } from "next/navigation";
import { getSessionAccount } from "@/lib/auth";
import { SimulatePanel } from "@/components/simulate-panel";

export default async function SimulatePage() {
  const account = await getSessionAccount();
  if (!account?.business) redirect("/login");
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-serif text-4xl">Catch a call</h1>
      <p className="mt-3 text-sm leading-6 text-dash-muted">
        Until Twilio is wired, play the customer here. A completed conversation becomes a
        real lead on your board.
      </p>
      <div className="mt-8">
        <SimulatePanel businessName={account.business.name} />
      </div>
    </div>
  );
}
