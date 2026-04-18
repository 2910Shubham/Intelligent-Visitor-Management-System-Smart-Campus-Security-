import { BottomNav } from "@/components/BottomNav";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">
            Protected
          </p>
          <h1 className="mt-3 text-4xl font-semibold">Profile</h1>
          <p className="mt-3 max-w-2xl text-zinc-300">
            Add user details, preferences, and account settings here when your
            auth flow is wired up.
          </p>
        </section>
        <BottomNav />
      </div>
    </main>
  );
}
