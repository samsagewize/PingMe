import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import PingMeApp from "@/app/components/PingMeApp";

export default async function AppPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=/app");
  }

  return <PingMeApp />;
}
