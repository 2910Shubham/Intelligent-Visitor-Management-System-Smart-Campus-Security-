export default function SearchPage() {
  return (
    <main className="px-4 pt-6 lg:px-8 lg:pt-10">
      <h1 className="text-2xl font-semibold text-gray-900 lg:text-3xl">Search</h1>
      <p className="mt-2 text-sm text-gray-500">
        Search results and discovery tools can live here during the hackathon.
      </p>
      <section className="mt-6 max-w-4xl rounded-3xl bg-gray-100 p-5 lg:mt-8">
        <div className="h-12 rounded-2xl bg-white" />
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <div className="h-16 rounded-2xl bg-white" />
          <div className="h-16 rounded-2xl bg-white" />
          <div className="h-16 rounded-2xl bg-white" />
        </div>
      </section>
    </main>
  );
}
