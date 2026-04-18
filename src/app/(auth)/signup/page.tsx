import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <AuthShell
      title="Hackathon App"
      subtitle="Create your account to get started"
      eyebrow="Build Once"
      heroTitle="Create an account from any screen size without being stuck in phone view."
      heroDescription="The layout expands naturally on desktop while preserving a clean, focused experience on mobile and tablet."
      footer={
        <>
          Already have an account?{" "}
          <Link className="font-medium text-violet-600" href="/login">
            Log in
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthShell>
  );
}
