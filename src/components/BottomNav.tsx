import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profile", label: "Profile" },
];

export function BottomNav() {
  return (
    <nav className="sticky bottom-6 flex items-center gap-3 self-center rounded-full border border-white/10 bg-zinc-900/90 p-2 backdrop-blur">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rounded-full px-4 py-2 text-sm text-zinc-200 transition hover:bg-white/10 hover:text-white"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
