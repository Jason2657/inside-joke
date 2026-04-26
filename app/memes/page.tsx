"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MemeCard } from "@/components/MemeCard";
import { ReactionButton } from "@/components/ReactionButton";
import { ProgressBar } from "@/components/ProgressBar";
import { useApp } from "@/lib/context";
import memesData from "@/data/memes.json";
import { MemeSchema, type Meme, type Reaction } from "@/lib/types";
import { z } from "zod";

const REACTIONS: Reaction[] = ["love", "laugh", "meh", "cringe"];

export default function MemesPage() {
  const router = useRouter();
  const { state, dispatch } = useApp();

  const memes = useMemo<Meme[]>(
    () => z.array(MemeSchema).parse(memesData),
    [],
  );

  const [index, setIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Guard: if user lands here without onboarding, send them home.
  useEffect(() => {
    if (!state.profile) router.replace("/");
  }, [state.profile, router]);

  if (!state.profile) return null;

  const current = memes[index];
  const isLast = index === memes.length - 1;

  async function handleReact(reaction: Reaction) {
    dispatch({ type: "SET_REACTION", memeId: current.id, reaction });

    if (!isLast) {
      setIndex((i) => i + 1);
      return;
    }

    // Last meme — fire the matching pipeline.
    setSubmitting(true);
    setSubmitError(null);
    try {
      const finalReactions = {
        ...state.reactions,
        [current.id]: reaction,
      };
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: state.profile,
          reactions: finalReactions,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? "match failed");
      }
      const result = await res.json();
      dispatch({ type: "SET_MATCH", result });
      router.push("/match");
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "something went sideways",
      );
      setSubmitting(false);
    }
  }

  if (submitting) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="font-serif text-5xl leading-tight animate-fade-up">
          reading the room…
        </div>
        <div className="mt-4 h-1 w-32 overflow-hidden rounded-full bg-ink/10">
          <div className="h-full w-1/2 animate-pulse bg-ink" />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 px-5 pb-8 pt-10">
      <ProgressBar current={index + 1} total={memes.length} />

      <div key={current.id} className="animate-fade-up">
        <MemeCard meme={current} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {REACTIONS.map((r) => (
          <ReactionButton key={r} reaction={r} onClick={handleReact} />
        ))}
      </div>

      {submitError && (
        <p className="text-center text-xs text-blush/90">{submitError}</p>
      )}
    </main>
  );
}
