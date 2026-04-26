/**
 * compatibilityAgent — Stage 2 / 3 of the matching pipeline.
 * In:  two HumorProfiles (the user's + one seed profile's).
 * Out: { score 0-100, overlapThemes, tensionPoints }.
 * Called by: app/api/match/route.ts in parallel (Promise.all) for each seed profile.
 * Next:    the highest-scoring pair is forwarded to matchReasoningAgent.
 */

import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import {
  CompatibilitySchema,
  type Compatibility,
  type HumorProfile,
} from "../types";

export async function compatibilityAgent(
  a: HumorProfile,
  b: HumorProfile,
): Promise<Compatibility> {
  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: CompatibilitySchema,
    // Lower temperature: scoring should be consistent across calls in the same request.
    temperature: 0.3,
    system: [
      "You score humor compatibility between two people for a dating app.",
      "Two people don't need identical humor — complementary humor (e.g. dry + absurdist) often clicks harder than identical.",
      "Score 80+ only when there's real shared sensibility AND minimal friction.",
      "overlapThemes: concrete shared patterns ('both lean self-aware', 'both reject wholesome internet'), not vague labels.",
      "tensionPoints: small frictions, not deal-breakers. Empty array if genuinely none.",
    ].join(" "),
    prompt: [
      "Person A:",
      `  primary: ${a.primaryStyle}, secondary: ${a.secondaryStyle}`,
      `  description: ${a.description}`,
      `  vibes: ${a.vibes.join(", ")}`,
      "",
      "Person B:",
      `  primary: ${b.primaryStyle}, secondary: ${b.secondaryStyle}`,
      `  description: ${b.description}`,
      `  vibes: ${b.vibes.join(", ")}`,
    ].join("\n"),
  });

  return object;
}
