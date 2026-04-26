/**
 * humorProfileAgent — Stage 1 / 3 of the matching pipeline.
 * In:  the user's per-meme reactions + the meme catalog.
 * Out: a structured HumorProfile { primaryStyle, secondaryStyle, description, vibes }.
 * Called by: app/api/match/route.ts (once per user request).
 * Next:    its output is fed into compatibilityAgent against each seed profile.
 */

import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import {
  HUMOR_TAGS,
  HumorProfileSchema,
  type HumorProfile,
  type Meme,
  type Reaction,
} from "../types";

type Args = {
  reactions: Record<string, Reaction>;
  memes: Meme[];
};

export async function humorProfileAgent({
  reactions,
  memes,
}: Args): Promise<HumorProfile> {
  const reactionLines = memes
    .map((m) => {
      const r = reactions[m.id] ?? "skipped";
      return `- [${r}] "${m.caption}"  (tags: ${m.humorTags.join(", ")})`;
    })
    .join("\n");

  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: HumorProfileSchema,
    temperature: 0.7,
    system: [
      "You profile a young person's humor style from their meme reactions.",
      "Output is consumed by a downstream compatibility model — be specific, not generic.",
      `primaryStyle and secondaryStyle MUST be drawn from this exact set: ${HUMOR_TAGS.join(", ")}.`,
      "vibes: 3-5 short tags (1-3 words each), in lowercase, in a casual Gen Z register.",
      "description: 1-2 punchy sentences. No corporate-speak, no 'unique sense of humor' filler.",
    ].join(" "),
    prompt: [
      "Reactions (love=strong yes, laugh=enjoyed, meh=neutral, cringe=actively dislikes):",
      reactionLines,
      "",
      "Infer the humor style. Weigh 'love' and 'cringe' more than 'laugh' and 'meh' — strong reactions reveal taste.",
    ].join("\n"),
  });

  return object;
}
