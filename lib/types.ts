import { z } from "zod";

export const HUMOR_TAGS = [
  "absurdist",
  "dry",
  "wholesome",
  "dark",
  "meta",
  "surreal",
  "selfaware",
  "chronicallyonline",
] as const;

export const HumorTagSchema = z.enum(HUMOR_TAGS);
export type HumorTag = z.infer<typeof HumorTagSchema>;

export const ReactionSchema = z.enum(["love", "laugh", "meh", "cringe"]);
export type Reaction = z.infer<typeof ReactionSchema>;

export const MemeSchema = z.object({
  id: z.string(),
  filename: z.string(),
  caption: z.string(),
  humorTags: z.array(HumorTagSchema),
});
export type Meme = z.infer<typeof MemeSchema>;

export const UserProfileSchema = z.object({
  name: z.string().min(1),
  age: z.number().int().min(18).max(99),
  school: z.string().min(1),
});
export type UserProfile = z.infer<typeof UserProfileSchema>;

export const HumorProfileSchema = z.object({
  primaryStyle: HumorTagSchema,
  secondaryStyle: HumorTagSchema,
  description: z
    .string()
    .describe("A 1-2 sentence description of this person's humor style."),
  vibes: z
    .array(z.string())
    .min(3)
    .max(5)
    .describe("3-5 short vibe descriptors (1-3 words each)."),
});
export type HumorProfile = z.infer<typeof HumorProfileSchema>;

export const SeedProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number(),
  school: z.string(),
  bio: z.string(),
  memeReactions: z.record(z.string(), ReactionSchema),
  humorProfile: HumorProfileSchema,
});
export type SeedProfile = z.infer<typeof SeedProfileSchema>;

export const CompatibilitySchema = z.object({
  score: z
    .number()
    .min(0)
    .max(100)
    .describe("Humor compatibility score from 0 (no match) to 100 (soulmates)."),
  overlapThemes: z
    .array(z.string())
    .min(1)
    .max(4)
    .describe("Specific humor themes both people share."),
  tensionPoints: z
    .array(z.string())
    .max(3)
    .describe("Subtle differences in their humor that could create friction."),
});
export type Compatibility = z.infer<typeof CompatibilitySchema>;

export const MatchReasoningSchema = z.object({
  reasoning: z
    .string()
    .describe(
      "2-3 sentences in casual Gen Z voice explaining why these two would click. Reference specific shared humor patterns. No corny dating-app cliches.",
    ),
});
export type MatchReasoning = z.infer<typeof MatchReasoningSchema>;

export const MatchRequestSchema = z.object({
  user: UserProfileSchema,
  reactions: z.record(z.string(), ReactionSchema),
});
export type MatchRequest = z.infer<typeof MatchRequestSchema>;

export type MatchedSeed = {
  id: string;
  name: string;
  age: number;
  school: string;
  bio: string;
  humorProfile: HumorProfile;
};

export type MatchResult = {
  userHumorProfile: HumorProfile;
  matchedSeed: MatchedSeed;
  compatibility: Compatibility;
  reasoning: string;
};
