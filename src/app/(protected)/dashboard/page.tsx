import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const date = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <main className="px-4 pt-6 lg:px-8 lg:pt-10">
      <header>
        <p className="text-sm font-medium text-violet-600">{date}</p>
        <h1 className="mt-2 text-3xl font-semibold text-gray-900 lg:text-4xl">
          {getGreeting()},{" "}
          {session?.user?.name?.split(" ")[0] ?? "there"}
        </h1>
      </header>
      <section className="mt-6 grid grid-cols-2 gap-4 lg:mt-8 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 rounded-2xl bg-gray-100 p-4"
          >
            <div className="h-4 w-20 rounded-full bg-white" />
            <div className="mt-3 h-3 w-full rounded-full bg-white" />
            <div className="mt-2 h-3 w-3/4 rounded-full bg-white" />
          </div>
        ))}
      </section>
    </main>
  );
}
