"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { HumorProfileCard } from "@/components/HumorProfileCard";
import { useApp } from "@/lib/context";

const AVATAR_BG = ["bg-lemon", "bg-blush", "bg-smoke", "bg-ink text-cream"];

export default function MatchPage() {
  const router = useRouter();
  const { state, dispatch } = useApp();
  const result = state.matchResult;

  // Guard: if there's no match result, bounce home.
  useEffect(() => {
    if (!result) router.replace("/");
  }, [result, router]);

  if (!result) return null;

  const { matchedSeed, compatibility, reasoning, userHumorProfile } = result;
  const initial = matchedSeed.name.charAt(0).toUpperCase();
  const avatarBg =
    AVATAR_BG[
      matchedSeed.id.charCodeAt(matchedSeed.id.length - 1) % AVATAR_BG.length
    ];

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-8 px-5 pb-12 pt-10">
      <header className="animate-fade-up">
        <span className="text-[11px] uppercase tracking-[0.25em] text-ink/50">
          we read your reactions.
        </span>
      </header>

      <section className="animate-fade-up">
        <HumorProfileCard profile={userHumorProfile} />
      </section>

      <div className="flex items-center gap-3 animate-fade-up">
        <div className="h-px flex-1 bg-ink/15" />
        <span className="font-serif text-base italic text-ink/60">
          you&apos;d click with
        </span>
        <div className="h-px flex-1 bg-ink/15" />
      </div>

      <section className="animate-fade-up rounded-3xl border border-ink/10 bg-cream p-6 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.18)]">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full font-serif text-3xl ${avatarBg}`}
          >
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="truncate font-serif text-3xl">
                {matchedSeed.name}
              </h3>
              <span className="shrink-0 rounded-full bg-ink px-3 py-1 text-xs font-medium text-cream">
                {compatibility.score}% match
              </span>
            </div>
            <p className="mt-1 text-sm text-ink/60">
              {matchedSeed.age} · {matchedSeed.school}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink/75">
              {matchedSeed.bio}
            </p>
          </div>
        </div>

        <p className="mt-5 font-serif text-xl italic leading-snug">
          &ldquo;{reasoning}&rdquo;
        </p>

        {compatibility.overlapThemes.length > 0 && (
          <div className="mt-5 border-t border-ink/10 pt-4">
            <div className="text-[11px] uppercase tracking-[0.2em] text-ink/50">
              what you share
            </div>
            <ul className="mt-2 space-y-1 text-sm text-ink/75">
              {compatibility.overlapThemes.map((t) => (
                <li key={t}>· {t}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <Button
        variant="secondary"
        onClick={() => {
          dispatch({ type: "RESET" });
          router.push("/");
        }}
      >
        react to more memes
      </Button>
    </main>
  );
}
