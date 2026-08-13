import { z } from "zod";

// Shared contract between API routes, the host, and the UI.
// Owned by the orchestrator — extend, don't reshape.

export const ITEM_KINDS = [
  "article",
  "book",
  "podcast",
  "video",
  "note",
  "tweet",
  "pdf",
  "highlight",
] as const;
export type ItemKind = (typeof ITEM_KINDS)[number];

export const PROMPT_KINDS = ["room", "intro", "give", "pick"] as const;
export type PromptKind = (typeof PROMPT_KINDS)[number];

export const REACTION_KINDS = ["useful", "awkward", "discussed", "more"] as const;
export type ReactionKind = (typeof REACTION_KINDS)[number];

// ---------- API payloads ----------

export const createCircleBody = z.object({
  name: z.string().trim().min(1).max(80),
});

export const connectReadwiseBody = z.object({
  token: z.string().trim().min(10).max(200),
});

export const createFolderSourceBody = z.object({
  label: z.string().trim().min(1).max(120),
});

export const folderItemInput = z.object({
  externalId: z.string().min(1).max(500), // stable path-derived id
  title: z.string().trim().min(1).max(300),
  kind: z.enum(ITEM_KINDS).default("note"),
  author: z.string().max(200).optional(),
  url: z.string().url().max(1000).optional(),
  tags: z.array(z.string().max(60)).max(20).default([]),
  excerpt: z.string().max(500).optional(),
  savedAt: z.string().datetime().optional(),
});
export type FolderItemInput = z.infer<typeof folderItemInput>;

export const putFolderItemsBody = z.object({
  items: z.array(folderItemInput).min(1).max(500),
});

export const patchSourceBody = z.object({
  paused: z.boolean().optional(),
  circleIds: z.array(z.string().uuid()).max(20).optional(),
});

export const patchItemBody = z.object({
  hidden: z.boolean(),
});

export const reactBody = z.object({
  kind: z.enum(REACTION_KINDS),
});

// ---------- Host output (model must return exactly this) ----------

export const hostEvidence = z.object({
  item_id: z.string(),
  why: z.string().max(300),
});

export const hostPrompt = z.object({
  kind: z.enum(PROMPT_KINDS),
  body: z.string().min(1).max(1200),
  participants: z.array(z.string().max(80)).default([]),
  evidence: z.array(hostEvidence).min(1).max(6),
});

export const hostOutput = z.object({
  prompts: z.array(hostPrompt).max(5),
  quiet: z.boolean().default(false),
});
export type HostOutput = z.infer<typeof hostOutput>;

// ---------- Row shapes the UI reads (RLS-scoped selects) ----------

export type PromptRow = {
  id: string;
  blend_id: string;
  circle_id: string;
  kind: PromptKind;
  body: string;
  participants: string[];
  evidence: { item_id: string; why: string }[];
  created_at: string;
};

export type ItemRow = {
  id: string;
  source_id: string;
  user_id: string;
  kind: ItemKind;
  title: string;
  author: string | null;
  url: string | null;
  excerpt: string | null;
  tags: string[];
  saved_at: string | null;
  hidden: boolean;
};
