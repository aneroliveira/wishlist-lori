import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/session";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await getAuthSession();
  if (!session.isAuthenticated) {
    redirect("/login");
  }

  return <>{children}</>;
}
