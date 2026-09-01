import { redirect } from "next/navigation";
import { getSessionAccount } from "@/lib/auth";
import { SettingsForm } from "@/components/settings-form";

export default async function SettingsPage() {
  const account = await getSessionAccount();
  if (!account?.business) redirect("/login");
  return (
    <div className="max-w-xl">
      <h1 className="font-serif text-4xl">Setup</h1>
      <p className="mt-2 text-sm text-white/45">
        Prices, areas and tone. The system quotes only what you configure.
      </p>
      <SettingsForm business={account.business} />
    </div>
  );
}
