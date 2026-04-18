import { redirect } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import { TopNav } from "@/components/TopNav";
import { getServerAuthSession } from "@/lib/auth";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      <div className="mx-auto min-h-screen w-full max-w-7xl bg-white lg:min-h-0 lg:border-x lg:border-gray-200">
        <div className="pb-20 lg:pb-0">{children}</div>
      </div>
      <BottomNav />
    </div>
  );
}
