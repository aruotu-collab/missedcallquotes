import { Footer, Header } from "@/components/site-chrome";
import { Landing } from "@/components/landing";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getSessionUser();
  return (
    <>
      <Header signedIn={Boolean(user)} />
      <Landing />
      <Footer />
    </>
  );
}
