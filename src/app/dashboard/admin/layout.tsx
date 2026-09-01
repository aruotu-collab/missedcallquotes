import { Suspense } from "react";
import { AdminNav } from "@/components/admin-nav";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.16em] text-dash-accent">Admin</p>
      <h1 className="mt-1 font-serif text-4xl text-dash-ink">Site administration</h1>
      <p className="mt-2 text-sm text-dash-muted">Members, jobs and visits. Visible only to aruotu@gmail.com.</p>
      <div className="mt-6">
        <Suspense fallback={<div className="mb-8 h-9" />}>
          <AdminNav />
        </Suspense>
      </div>
      {children}
    </div>
  );
}
