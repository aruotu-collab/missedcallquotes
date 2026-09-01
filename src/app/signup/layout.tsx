import { Header } from "@/components/site-chrome";

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
