export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 py-16 text-zinc-50">
      <section className="w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl shadow-black/30 backdrop-blur">
        <div className="mb-8 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-200">
          App Skeleton Ready
        </div>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Your Next.js folder structure is in place.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
          Auth routes, protected pages, API handlers, shared components, core
          libraries, middleware, and Prisma schema files are ready for the next
          implementation step.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-300 px-6 font-medium text-zinc-950 transition hover:bg-emerald-200"
            href="/login"
          >
            Open login page
          </a>
          <a
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 px-6 font-medium text-white transition hover:border-white/30 hover:bg-white/5"
            href="/dashboard"
          >
            Open dashboard
          </a>
        </div>
      </section>
    </main>
  );
}
