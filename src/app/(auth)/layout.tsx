import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerAuthSession();

  if (session) {
    redirect("/dashboard");
  }

  return children;
}
