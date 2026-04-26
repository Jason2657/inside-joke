"use client";

type Props = {
  current: number; // 1-indexed
  total: number;
};

export function ProgressBar({ current, total }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs text-ink/60">
        <span className="uppercase tracking-widest">
          {current} / {total}
        </span>
        <span className="uppercase tracking-widest">memes</span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i < current ? "bg-ink" : "bg-ink/15"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
