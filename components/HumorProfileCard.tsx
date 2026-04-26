"use client";

import type { HumorProfile } from "@/lib/types";

export function HumorProfileCard({ profile }: { profile: HumorProfile }) {
  return (
    <div className="rounded-3xl border border-ink/10 bg-cream p-6 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.15)]">
      <div className="text-[11px] uppercase tracking-[0.2em] text-ink/50">
        humor profile
      </div>
      <h2 className="mt-2 font-serif text-4xl leading-tight">
        {profile.primaryStyle}
        <span className="text-ink/40"> + </span>
        {profile.secondaryStyle}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-ink/70">
        {profile.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {profile.vibes.map((v) => (
          <span
            key={v}
            className="rounded-full bg-lemon/60 px-3 py-1 text-xs text-ink/80"
          >
            {v}
          </span>
        ))}
      </div>
    </div>
  );
}
