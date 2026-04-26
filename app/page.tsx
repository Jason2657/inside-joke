"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/Button";
import { useApp } from "@/lib/context";
import { UserProfileSchema } from "@/lib/types";

export default function OnboardingPage() {
  const router = useRouter();
  const { dispatch } = useApp();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [school, setSchool] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = UserProfileSchema.safeParse({
      name: name.trim(),
      age: Number(age),
      school: school.trim(),
    });
    if (!parsed.success) {
      setError("fill in all three (and you've gotta be 18+)");
      return;
    }
    dispatch({ type: "SET_PROFILE", profile: parsed.data });
    router.push("/memes");
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-between px-6 pb-10 pt-16">
      <header className="animate-fade-up">
        <span className="text-[11px] uppercase tracking-[0.25em] text-ink/50">
          inside joke
        </span>
        <h1 className="mt-3 font-serif text-6xl leading-[0.95]">
          memes
          <br />
          don&apos;t lie.
        </h1>
        <p className="mt-5 text-base leading-relaxed text-ink/70">
          we don&apos;t ask what you&apos;re looking for. you react to 8 memes
          and we figure out who&apos;s on your wavelength.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mt-12 flex flex-col gap-4 animate-fade-up"
      >
        <Field
          label="first name"
          value={name}
          onChange={setName}
          placeholder="jason"
          autoComplete="given-name"
        />
        <Field
          label="age"
          value={age}
          onChange={setAge}
          placeholder="21"
          inputMode="numeric"
          maxLength={2}
        />
        <Field
          label="school"
          value={school}
          onChange={setSchool}
          placeholder="stanford"
          autoComplete="organization"
        />

        {error && <p className="text-xs text-blush/90">{error}</p>}

        <Button type="submit" className="mt-4">
          start matching →
        </Button>
        <p className="text-center text-xs text-ink/50">
          no profile pics. no swiping. just taste.
        </p>
      </form>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] uppercase tracking-widest text-ink/50">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-2xl border border-ink/15 bg-cream px-4 py-4 text-lg outline-none transition-colors focus:border-ink"
        {...rest}
      />
    </label>
  );
}
