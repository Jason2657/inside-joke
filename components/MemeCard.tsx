"use client";

import Image from "next/image";
import { useState } from "react";
import type { Meme } from "@/lib/types";

const tagColor: Record<string, string> = {
  absurdist: "bg-lemon",
  surreal: "bg-blush",
  dry: "bg-smoke",
  dark: "bg-ink/85 text-cream",
  meta: "bg-lemon",
  selfaware: "bg-blush",
  wholesome: "bg-cream border border-ink/20",
  chronicallyonline: "bg-smoke",
};

export function MemeCard({ meme }: { meme: Meme }) {
  const [errored, setErrored] = useState(false);
  const primaryTag = meme.humorTags[0] ?? "absurdist";
  const placeholderClass = tagColor[primaryTag] ?? "bg-smoke";

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-ink/10 bg-cream shadow-[0_8px_30px_-12px_rgba(0,0,0,0.18)]">
        {!errored ? (
          <Image
            src={`/memes/${meme.filename}`}
            alt={meme.caption}
            fill
            sizes="(max-width: 768px) 100vw, 480px"
            className="object-contain"
            onError={() => setErrored(true)}
            priority
          />
        ) : (
          <div
            className={`flex h-full w-full flex-col items-center justify-center gap-3 px-8 text-center ${placeholderClass}`}
          >
            <span className="text-[11px] uppercase tracking-[0.2em] opacity-70">
              {meme.humorTags.join(" · ")}
            </span>
            <p className="font-serif text-2xl leading-snug">{meme.caption}</p>
            <span className="text-[10px] uppercase tracking-widest opacity-50">
              add /public/memes/{meme.filename} to replace
            </span>
          </div>
        )}
      </div>
      <p className="px-1 text-sm text-ink/70">{meme.caption}</p>
    </div>
  );
}
