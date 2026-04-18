export default function NotificationsPage() {
  return (
    <main className="px-4 pt-6 lg:px-8 lg:pt-10">
      <h1 className="text-2xl font-semibold text-gray-900 lg:text-3xl">
        Notifications
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        Alerts, reminders, and activity updates can be dropped into this view.
      </p>
      <div className="mt-6 grid gap-3 lg:mt-8 lg:max-w-4xl lg:grid-cols-2">
        <div className="rounded-2xl bg-gray-100 p-4">
          <div className="h-4 w-28 rounded-full bg-white" />
          <div className="mt-3 h-3 w-full rounded-full bg-white" />
        </div>
        <div className="rounded-2xl bg-gray-100 p-4">
          <div className="h-4 w-24 rounded-full bg-white" />
          <div className="mt-3 h-3 w-4/5 rounded-full bg-white" />
        </div>
      </div>
    </main>
  );
}
