export function money(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function moneyExact(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);
}

export function formatPhone(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function greeting(name: string) {
  const hour = new Date().getHours();
  const part = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return name.trim() ? `${part}, ${name}.` : `${part}.`;
}

export function displayFirstName(name?: string | null, email?: string | null) {
  const trimmed = name?.trim();
  if (trimmed) return trimmed;
  const local = email?.split("@")[0]?.replace(/[._-]+/g, " ").trim();
  if (!local) return "";
  return local.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function timeAgo(iso: string) {
  const delta = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(delta / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function monthLabel() {
  return new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

export function isThisMonth(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
}
