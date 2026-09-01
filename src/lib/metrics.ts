import { isThisMonth } from "./format";
import type { Lead, Quote } from "./types";

export function funnel(leads: Lead[]) {
  const month = leads.filter((l) => isThisMonth(l.createdAt));
  const missed = month.length;
  const started = month.filter((l) => l.status !== "declined" || l.problem).length;
  const qualified = month.filter((l) => l.status !== "declined" && l.postcode).length;
  const quoted = month.filter((l) => l.quotedAmount).length;
  const won = month.filter((l) => l.status === "won");
  const potential = month
    .filter((l) => l.status !== "declined")
    .reduce((sum, l) => sum + (l.typicalMax + l.typicalMin) / 2, 0);
  const quotedRev = month.reduce((sum, l) => sum + (l.quotedAmount ?? 0), 0);
  const wonRev = won.reduce((sum, l) => sum + (l.wonAmount ?? l.quotedAmount ?? 0), 0);
  const collected = month.reduce((sum, l) => sum + (l.collectedAmount ?? 0), 0);
  return {
    missed,
    started,
    qualified,
    quoted,
    jobsWon: won.length,
    potential: Math.round(potential),
    quotedRev,
    wonRev,
    collected,
  };
}

export function needsYou(leads: Lead[], quotes: Quote[]) {
  const urgent = leads.filter((l) => l.status === "new" || l.status === "contacted");
  const follow = leads.filter((l) => l.status === "following_up" || l.status === "quoted");
  const won = leads.filter((l) => l.status === "won" && !l.collectedAmount);
  return { urgent, follow, won, quotes };
}
