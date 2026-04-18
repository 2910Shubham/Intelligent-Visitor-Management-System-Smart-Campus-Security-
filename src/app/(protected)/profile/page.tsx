import { ChevronRight } from "lucide-react";
import { getServerSession } from "next-auth";
import { LogoutButton } from "@/components/LogoutButton";
import { authOptions } from "@/lib/auth";

const settingsItems = ["Account", "Notifications", "Privacy", "Help"];

function getInitials(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.trim() || "User";

  return source
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const initials = getInitials(session?.user?.name, session?.user?.email);

  return (
    <main className="px-4 pt-6 lg:px-8 lg:pt-10">
      <section className="rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-500 p-6 text-white lg:p-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-xl font-semibold">
          {initials}
        </div>
        <h1 className="mt-4 text-2xl font-semibold">
          {session?.user?.name ?? "Hackathon User"}
        </h1>
        <p className="mt-1 text-sm text-violet-100">
          {session?.user?.email ?? "No email available"}
        </p>
      </section>

      <section className="mt-6 max-w-2xl rounded-3xl border border-gray-100 bg-white px-4">
        {settingsItems.map((item) => (
          <div
            key={item}
            className="flex items-center justify-between border-b border-gray-100 py-3 last:border-b-0"
          >
            <span className="text-sm font-medium text-gray-700">{item}</span>
            <ChevronRight className="text-gray-300" size={18} />
          </div>
        ))}
      </section>

      <div className="mt-8 max-w-sm">
        <LogoutButton />
      </div>
    </main>
  );
}
