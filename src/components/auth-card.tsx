"use client";

export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 items-center justify-center px-5 py-12 sm:py-16">
      <div className="w-full max-w-md rounded-2xl border border-dash-line bg-white px-6 py-8 shadow-[0_16px_50px_rgba(15,23,42,0.06)] sm:px-8 sm:py-10">
        {children}
      </div>
    </main>
  );
}

export function AuthCheckEmail({
  email,
  intro,
  onUseDifferent,
}: {
  email: string;
  intro: string;
  onUseDifferent: () => void;
}) {
  return (
    <div>
      <div className="grid h-12 w-12 place-items-center rounded-full bg-[#eff6ff] text-dash-accent">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      </div>
      <h1 className="mt-5 font-serif text-3xl text-dash-ink">Check your email</h1>
      <p className="mt-3 text-sm leading-6 text-dash-muted">
        {intro}{" "}
        {email ? <span className="font-medium text-dash-ink">{email}</span> : "your inbox"}.
      </p>
      <ul className="mt-6 grid gap-2 text-sm leading-6 text-dash-muted">
        <li>The link expires in a few minutes.</li>
        <li>If you do not see it, check spam or junk.</li>
        <li>You can close this tab after you open the link.</li>
      </ul>
      <button
        type="button"
        onClick={onUseDifferent}
        className="mt-8 text-sm font-medium text-dash-accent hover:underline"
      >
        Use a different email
      </button>
    </div>
  );
}

export function AuthField({
  label,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="grid gap-1.5 text-sm text-dash-ink">
      {label}
      <input
        {...rest}
        className="rounded-xl border border-dash-line bg-white px-3 py-2.5 text-dash-ink outline-none transition-colors focus:border-dash-accent"
      />
    </label>
  );
}
