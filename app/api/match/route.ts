import { NextResponse } from "next/server";
import memesData from "@/data/memes.json";
import seedProfilesData from "@/data/seedProfiles.json";
import { humorProfileAgent } from "@/lib/agents/humorProfileAgent";
import { compatibilityAgent } from "@/lib/agents/compatibilityAgent";
import { matchReasoningAgent } from "@/lib/agents/matchReasoningAgent";
import {
  MatchRequestSchema,
  MemeSchema,
  SeedProfileSchema,
  type MatchResult,
  type Meme,
  type SeedProfile,
} from "@/lib/types";
import { z } from "zod";

const memes: Meme[] = z.array(MemeSchema).parse(memesData);
const seedProfiles: SeedProfile[] = z
  .array(SeedProfileSchema)
  .parse(seedProfilesData);

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const parsed = MatchRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid request", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const { user, reactions } = parsed.data;

  try {
    // Stage 1: build the user's humor profile from their reactions.
    const userHumorProfile = await humorProfileAgent({ reactions, memes });

    // Stage 2: score user vs all 4 seeds in parallel.
    const scored = await Promise.all(
      seedProfiles.map(async (seed) => {
        const compat = await compatibilityAgent(
          userHumorProfile,
          seed.humorProfile,
        );
        return { seed, compat };
      }),
    );

    // Pick the highest-scoring seed.
    scored.sort((a, b) => b.compat.score - a.compat.score);
    const winner = scored[0];

    // Stage 3: write the personalized blurb for the winner.
    const reasoning = await matchReasoningAgent({
      userName: user.name,
      userProfile: userHumorProfile,
      matchName: winner.seed.name,
      matchProfile: winner.seed.humorProfile,
      compatibility: winner.compat,
    });

    const result: MatchResult = {
      userHumorProfile,
      matchedSeed: {
        id: winner.seed.id,
        name: winner.seed.name,
        age: winner.seed.age,
        school: winner.seed.school,
        bio: winner.seed.bio,
        humorProfile: winner.seed.humorProfile,
      },
      compatibility: winner.compat,
      reasoning,
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("/api/match failed:", err);
    return NextResponse.json(
      {
        error:
          "matching brain hiccup'd. check your OPENAI_API_KEY in .env.local and try again.",
      },
      { status: 500 },
    );
  }
}
