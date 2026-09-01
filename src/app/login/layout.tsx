import { Header } from "@/components/site-chrome";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
