/**
 * matchReasoningAgent — Stage 3 / 3 of the matching pipeline.
 * In:  both HumorProfiles + the Compatibility result + first names.
 * Out: a 2-3 sentence Gen-Z-voiced explanation of why they'd click.
 * Called by: app/api/match/route.ts once, on the highest-scoring seed.
 * Next:    its output renders on the /match screen as the personalized blurb.
 */

import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import {
  MatchReasoningSchema,
  type Compatibility,
  type HumorProfile,
} from "../types";

type Args = {
  userName: string;
  userProfile: HumorProfile;
  matchName: string;
  matchProfile: HumorProfile;
  compatibility: Compatibility;
};

export async function matchReasoningAgent({
  userName,
  userProfile,
  matchName,
  matchProfile,
  compatibility,
}: Args): Promise<string> {
  const { object } = await generateObject({
    model: openai("gpt-5.4-mini"),
    schema: MatchReasoningSchema,
    temperature: 0.85,
    system: [
      "You write the 'why this match' blurb on a humor-based dating app.",
      "Voice: casual Gen Z, lowercase-ok, mildly clever, never cringe. NOT corporate, NOT therapist-speak.",
      "Reference at least one SPECIFIC overlap theme from the input — don't generalize.",
      `Address ${userName} in second person ("you"), refer to ${matchName} by name.`,
      "Hard limit: 2-3 sentences. Under 60 words.",
      "Never use the words 'soulmates', 'destiny', 'connection', or 'unique'.",
    ].join(" "),
    prompt: [
      `${userName}'s humor: ${userProfile.primaryStyle} + ${userProfile.secondaryStyle}. ${userProfile.description}`,
      `vibes: ${userProfile.vibes.join(", ")}`,
      "",
      `${matchName}'s humor: ${matchProfile.primaryStyle} + ${matchProfile.secondaryStyle}. ${matchProfile.description}`,
      `vibes: ${matchProfile.vibes.join(", ")}`,
      "",
      `Compatibility score: ${compatibility.score}/100`,
      `Overlap: ${compatibility.overlapThemes.join("; ")}`,
      compatibility.tensionPoints.length
        ? `Light tension: ${compatibility.tensionPoints.join("; ")}`
        : "",
    ]
      .filter(Boolean)
      .join("\n"),
  });

  return object.reasoning;
}
