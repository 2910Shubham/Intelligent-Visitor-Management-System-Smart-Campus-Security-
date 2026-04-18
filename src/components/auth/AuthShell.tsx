import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

type AuthShellProps = {
  title: string;
  subtitle: string;
  eyebrow: string;
  heroTitle: string;
  heroDescription: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthShell({
  title,
  subtitle,
  eyebrow,
  heroTitle,
  heroDescription,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10 lg:px-8">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <section className="hidden lg:block">
          <div className="max-w-xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-violet-500">
              {eyebrow}
            </p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight text-gray-900">
              {heroTitle}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-500">
              {heroDescription}
            </p>
          </div>
        </section>

        <div className="space-y-6">
          <div className="text-center lg:text-left">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-100 text-violet-600 lg:mx-0">
              <Sparkles size={28} />
            </div>
            <h1 className="mt-4 text-3xl font-semibold text-violet-600">
              {title}
            </h1>
            <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
          </div>

          {children}

          <div className="text-center text-sm text-gray-500 lg:text-left">
            {footer}
          </div>
        </div>
      </div>
    </main>
  );
}
