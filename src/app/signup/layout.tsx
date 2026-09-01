import { AuthPageShell } from "@/components/auth-shell";

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <AuthPageShell>{children}</AuthPageShell>;
}
