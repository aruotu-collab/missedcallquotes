import { AuthPageShell } from "@/components/auth-shell";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <AuthPageShell>{children}</AuthPageShell>;
}
