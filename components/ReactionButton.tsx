"use client";

import type { Reaction } from "@/lib/types";

type Props = {
  reaction: Reaction;
  onClick: (r: Reaction) => void;
};

const META: Record<Reaction, { emoji: string; label: string; bg: string }> = {
  love: { emoji: "😍", label: "Love", bg: "bg-blush hover:bg-blush/80" },
  laugh: { emoji: "😂", label: "Laugh", bg: "bg-lemon hover:bg-lemon/80" },
  meh: { emoji: "😐", label: "Meh", bg: "bg-smoke hover:bg-smoke/70" },
  cringe: {
    emoji: "😬",
    label: "Cringe",
    bg: "bg-ink text-cream hover:bg-ink/85",
  },
};

export function ReactionButton({ reaction, onClick }: Props) {
  const { emoji, label, bg } = META[reaction];
  return (
    <button
      onClick={() => onClick(reaction)}
      className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl py-5 text-sm font-medium transition-all duration-150 active:animate-pop ${bg}`}
    >
      <span className="text-3xl">{emoji}</span>
      <span className="uppercase tracking-wider text-xs">{label}</span>
    </button>
  );
}
