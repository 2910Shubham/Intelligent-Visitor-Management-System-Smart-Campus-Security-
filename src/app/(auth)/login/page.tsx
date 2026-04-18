import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 py-16 text-zinc-50">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30">
        <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">
          Auth
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Welcome back</h1>
        <p className="mt-2 text-sm text-zinc-300">
          Sign in to access your account.
        </p>
        <form className="mt-8 space-y-4">
          <Input label="Email" name="email" type="email" />
          <Input label="Password" name="password" type="password" />
          <Button className="w-full">Login</Button>
        </form>
      </section>
    </main>
  );
}
