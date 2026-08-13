import { personColor } from "@/components/person";
import type {
  PromptCardData,
  PromptEvidence,
  PromptParticipant,
} from "@/components/prompt-card";
import { createClient } from "@/lib/supabase/server";
import {
  REACTION_KINDS,
  type ItemKind,
  type ItemRow,
  type PromptKind,
  type PromptRow,
  type ReactionKind,
} from "@/lib/types";

/*
  Circle home reads. Everything goes through the RLS-scoped session client:
  `circles`/`circle_members`/`blends`/`prompts` are member-readable, items are
  visible only where the owning source is shared with this circle, unpaused and
  unhidden (supabase/migrations/0001_init.sql).
*/

type CircleRow = { id: string; name: string; slug: string };
type MemberRow = { user_id: string; role: string; joined_at: string };
type ProfileRow = { id: string; display_name: string };
type BlendRow = { id: string; created_at: string; trigger: string };
type ReactionRow = { prompt_id: string; user_id: string; kind: ReactionKind };
type ShareRow = { source_id: string };
type SourceRow = { id: string; paused: boolean };
type ItemOwnerRow = { id: string; user_id: string };
type InviteRow = { token: string };

export type CircleMember = {
  id: string;
  name: string;
  color: string;
  isYou: boolean;
  itemCount: number;
};

export type CircleHome = {
  circle: CircleRow;
  members: CircleMember[];
  blend: { id: string; createdAt: string; trigger: string } | null;
  prompts: PromptCardData[];
  inviteToken: string | null;
};

function emptyCounts(): Record<ReactionKind, number> {
  return { useful: 0, awkward: 0, discussed: 0, more: 0 };
}

function isReactionKind(value: unknown): value is ReactionKind {
  return (
    typeof value === "string" &&
    (REACTION_KINDS as readonly string[]).includes(value)
  );
}

/** `prompts.evidence` is jsonb; trust nothing about its shape. */
function readEvidence(value: unknown): { item_id: string; why: string }[] {
  if (!Array.isArray(value)) return [];
  const out: { item_id: string; why: string }[] = [];
  for (const entry of value) {
    if (typeof entry !== "object" || entry === null) continue;
    const record = entry as Record<string, unknown>;
    const itemId = record.item_id;
    if (typeof itemId !== "string" || !itemId) continue;
    out.push({
      item_id: itemId,
      why: typeof record.why === "string" ? record.why : "",
    });
  }
  return out;
}

export async function loadCircleHome(
  slug: string,
): Promise<{ userId: string; home: CircleHome } | { userId: string; home: null }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id ?? "";

  const { data: circleData } = await supabase
    .from("circles")
    .select("id, name, slug")
    .eq("slug", slug)
    .maybeSingle();

  const circle = (circleData ?? null) as CircleRow | null;
  if (!circle) return { userId, home: null };

  // ---- members + profiles ----
  const { data: memberData } = await supabase
    .from("circle_members")
    .select("user_id, role, joined_at")
    .eq("circle_id", circle.id)
    .order("joined_at", { ascending: true });

  const memberRows = (memberData ?? []) as MemberRow[];
  const memberIds = memberRows.map((row) => row.user_id);

  const { data: profileData } = memberIds.length
    ? await supabase
        .from("profiles")
        .select("id, display_name")
        .in("id", memberIds)
    : { data: [] };

  const profiles = new Map<string, string>();
  for (const row of (profileData ?? []) as ProfileRow[]) {
    profiles.set(row.id, row.display_name);
  }

  // ---- how much of each library this circle can actually see ----
  const { data: shareData } = await supabase
    .from("source_shares")
    .select("source_id")
    .eq("circle_id", circle.id);

  const sharedSourceIds = ((shareData ?? []) as ShareRow[]).map(
    (row) => row.source_id,
  );

  // `sources` is owner-scoped, so this only returns mine — enough to drop my
  // own paused sources, which RLS already hides from everyone else.
  const { data: mySourceData } = sharedSourceIds.length
    ? await supabase
        .from("sources")
        .select("id, paused")
        .in("id", sharedSourceIds)
    : { data: [] };

  const pausedMine = new Set(
    ((mySourceData ?? []) as SourceRow[])
      .filter((row) => row.paused)
      .map((row) => row.id),
  );
  const visibleSourceIds = sharedSourceIds.filter((id) => !pausedMine.has(id));

  const { data: countData } = visibleSourceIds.length
    ? await supabase
        .from("items")
        .select("id, user_id")
        .in("source_id", visibleSourceIds)
        .eq("hidden", false)
    : { data: [] };

  const counts = new Map<string, number>();
  for (const row of (countData ?? []) as ItemOwnerRow[]) {
    counts.set(row.user_id, (counts.get(row.user_id) ?? 0) + 1);
  }

  const members: CircleMember[] = memberRows.map((row, index) => ({
    id: row.user_id,
    name: profiles.get(row.user_id) ?? "Someone",
    color: personColor(index),
    isYou: row.user_id === userId,
    itemCount: counts.get(row.user_id) ?? 0,
  }));

  const membersById = new Map(members.map((member) => [member.id, member]));
  const membersByName = new Map(
    members.map((member) => [member.name.toLowerCase(), member]),
  );

  // ---- newest finished blend ----
  const { data: blendData } = await supabase
    .from("blends")
    .select("id, created_at, trigger")
    .eq("circle_id", circle.id)
    .eq("status", "done")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const blendRow = (blendData ?? null) as BlendRow | null;

  let prompts: PromptCardData[] = [];

  if (blendRow) {
    const { data: promptData } = await supabase
      .from("prompts")
      .select(
        "id, blend_id, circle_id, kind, body, participants, evidence, created_at",
      )
      .eq("blend_id", blendRow.id)
      .order("created_at", { ascending: true });

    const promptRows = (promptData ?? []) as PromptRow[];
    const promptIds = promptRows.map((row) => row.id);

    const { data: reactionData } = promptIds.length
      ? await supabase
          .from("reactions")
          .select("prompt_id, user_id, kind")
          .in("prompt_id", promptIds)
      : { data: [] };

    const countsByPrompt = new Map<string, Record<ReactionKind, number>>();
    const mineByPrompt = new Map<string, ReactionKind[]>();
    for (const row of (reactionData ?? []) as ReactionRow[]) {
      if (!isReactionKind(row.kind)) continue;
      const bucket = countsByPrompt.get(row.prompt_id) ?? emptyCounts();
      bucket[row.kind] += 1;
      countsByPrompt.set(row.prompt_id, bucket);
      if (row.user_id === userId) {
        mineByPrompt.set(row.prompt_id, [
          ...(mineByPrompt.get(row.prompt_id) ?? []),
          row.kind,
        ]);
      }
    }

    // ---- the receipts behind "why this?" ----
    const evidenceByPrompt = new Map<
      string,
      { item_id: string; why: string }[]
    >();
    const itemIds = new Set<string>();
    for (const row of promptRows) {
      const evidence = readEvidence(row.evidence);
      evidenceByPrompt.set(row.id, evidence);
      for (const entry of evidence) itemIds.add(entry.item_id);
    }

    const { data: itemData } = itemIds.size
      ? await supabase
          .from("items")
          .select(
            "id, source_id, user_id, kind, title, author, url, excerpt, tags, saved_at, hidden",
          )
          .in("id", [...itemIds])
      : { data: [] };

    const itemsById = new Map<string, ItemRow>();
    for (const row of (itemData ?? []) as ItemRow[]) {
      itemsById.set(row.id, row);
    }

    prompts = promptRows.map((row) => {
      const participants: PromptParticipant[] = (row.participants ?? []).map(
        (value) => {
          const member =
            membersById.get(value) ?? membersByName.get(value.toLowerCase());
          return member
            ? { name: member.name, color: member.color }
            : { name: value, color: "#8a7f6b" };
        },
      );

      const evidence: PromptEvidence[] = (
        evidenceByPrompt.get(row.id) ?? []
      ).map((entry) => {
        const item = itemsById.get(entry.item_id);
        const owner = item ? membersById.get(item.user_id) : undefined;
        return {
          itemId: entry.item_id,
          why: entry.why,
          title: item?.title ?? null,
          url: item?.url ?? null,
          author: item?.author ?? null,
          kind: (item?.kind as ItemKind | undefined) ?? null,
          ownerLabel: owner
            ? owner.isYou
              ? "Your library"
              : `${owner.name}’s library`
            : null,
        };
      });

      return {
        id: row.id,
        kind: row.kind as PromptKind,
        body: row.body,
        participants,
        evidence,
        counts: countsByPrompt.get(row.id) ?? emptyCounts(),
        mine: mineByPrompt.get(row.id) ?? [],
      };
    });
  }

  // ---- the circle's invite link, for adding one more person ----
  const { data: inviteData } = await supabase
    .from("invites")
    .select("token")
    .eq("circle_id", circle.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const invite = (inviteData ?? null) as InviteRow | null;

  return {
    userId,
    home: {
      circle,
      members,
      blend: blendRow
        ? {
            id: blendRow.id,
            createdAt: blendRow.created_at,
            trigger: blendRow.trigger,
          }
        : null,
      prompts,
      inviteToken: invite?.token ?? null,
    },
  };
}
