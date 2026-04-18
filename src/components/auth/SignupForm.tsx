"use client";

import { Lock, Mail, User2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { signupSchema } from "@/lib/validations";

type FormState = {
  name: string;
  email: string;
  password: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

export function SignupForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const parsed = signupSchema.safeParse(form);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;

      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    setErrors({});
    setLoading(true);

    const createResponse = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsed.data),
    });

    if (!createResponse.ok) {
      const payload = (await createResponse.json()) as { error?: string };

      setLoading(false);
      setFormError(payload.error ?? "Unable to create your account");
      return;
    }

    const signInResult = await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    setLoading(false);

    if (!signInResult?.ok || signInResult.error) {
      setFormError("Account created, but automatic sign in failed");
      return;
    }

    window.location.assign(signInResult.url ?? "/dashboard");
  }

  return (
    <form
      className="space-y-4 rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm lg:p-8"
      onSubmit={handleSubmit}
    >
      <Input
        label="Name"
        name="name"
        autoComplete="name"
        placeholder="Your name"
        value={form.name}
        onChange={(event) => updateField("name", event.target.value)}
        error={errors.name}
        icon={<User2 size={18} />}
      />
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={form.email}
        onChange={(event) => updateField("email", event.target.value)}
        error={errors.email}
        icon={<Mail size={18} />}
      />
      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        placeholder="Create a secure password"
        value={form.password}
        onChange={(event) => updateField("password", event.target.value)}
        error={errors.password}
        icon={<Lock size={18} />}
      />

      {formError ? <p className="text-sm text-red-500">{formError}</p> : null}

      <Button type="submit" fullWidth loading={loading}>
        Create account
      </Button>
    </form>
  );
}
