"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { updateBusiness } from "@/lib/store";
import type { PlanId } from "@/lib/types";

const PLANS: PlanId[] = ["founding", "solo", "growth", "multivan"];

export async function setMemberPlan(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const plan = String(formData.get("plan") ?? "") as PlanId;
  if (!id || !PLANS.includes(plan)) return;
  await updateBusiness(id, { plan });
  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/members");
  revalidatePath(`/dashboard/admin/members/${id}`);
}
