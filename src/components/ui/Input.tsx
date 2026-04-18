import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Input({ label, className = "", id, ...props }: InputProps) {
  const inputId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label className="flex flex-col gap-2 text-sm text-zinc-200" htmlFor={inputId}>
      <span>{label}</span>
      <input
        id={inputId}
        className={`h-11 rounded-2xl border border-white/10 bg-zinc-900 px-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-emerald-300 ${className}`}
        {...props}
      />
    </label>
  );
}
