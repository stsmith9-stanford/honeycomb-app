import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";

import { HOST_PROMPT } from "@/lib/host/prompt";
import { createAdminClient } from "@/lib/server/admin";
import { hostOutput, type ItemKind, type ReactionKind } from "@/lib/types";

export type BlendTrigger = "first" | "cron" | "manual";

export type RunBlendResult = {
  blendId: string;
  promptCount: number;
};

type MemberPayload = { id: string; name: string };

type ItemPayload = {
  id: string;
  member_id: string;
  kind: ItemKind;
  title: string;
  author: string | null;
  tags: string[];
  excerpt: string | null;
  saved_at: string | null;
};

type PastPromptPayload = {
  kind: string;
  body: string;
  evidence_item_ids: string[];
  reactions: ReactionKind[];
};

function evidenceIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (
      typeof entry === "object" &&
      entry !== null &&
      "item_id" in entry &&
      typeof entry.item_id === "string"
    ) {
      return [entry.item_id];
    }
    return [];
  });
}

async function markFailed(blendId: string, model: string): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin
    .from("blends")
    .update({ status: "failed", model })
    .eq("id", blendId);
  if (error) console.error(`Failed to mark blend ${blendId} failed`, error);
}

export async function runBlend(
  circleId: string,
  trigger: BlendTrigger,
): Promise<RunBlendResult> {
  const admin = createAdminClient();
  const model = process.env.HOST_MODEL || "claude-opus-5";
  const { data: blend, error: blendError } = await admin
    .from("blends")
    .insert({ circle_id: circleId, trigger, status: "pending" })
    .select("id")
    .single();
  if (blendError) throw blendError;

  const blendId = blend.id as string;

  try {
    const { data: circle, error: circleError } = await admin
      .from("circles")
      .select("name")
      .eq("id", circleId)
      .maybeSingle();
    if (circleError) throw circleError;
    if (!circle) throw new Error(`Circle ${circleId} not found`);

    const { data: memberRows, error: memberError } = await admin
      .from("circle_members")
      .select("user_id,joined_at")
      .eq("circle_id", circleId)
      .order("joined_at", { ascending: true });
    if (memberError) throw memberError;

    const memberIds = (memberRows ?? []).map((row) => row.user_id as string);
    let members: MemberPayload[] = [];
    if (memberIds.length > 0) {
      const { data: profileRows, error: profileError } = await admin
        .from("profiles")
        .select("id,display_name")
        .in("id", memberIds);
      if (profileError) throw profileError;

      const namesById = new Map(
        (profileRows ?? []).map((row) => [row.id as string, row.display_name as string]),
      );
      members = memberIds.flatMap((id) => {
        const name = namesById.get(id);
        return name ? [{ id, name }] : [];
      });
    }

    const { data: shareRows, error: shareError } = await admin
      .from("source_shares")
      .select("source_id")
      .eq("circle_id", circleId);
    if (shareError) throw shareError;

    const sharedSourceIds = (shareRows ?? []).map((row) => row.source_id as string);
    let activeSourceIds: string[] = [];
    if (sharedSourceIds.length > 0) {
      const { data: sourceRows, error: sourceError } = await admin
        .from("sources")
        .select("id")
        .in("id", sharedSourceIds)
        .eq("paused", false);
      if (sourceError) throw sourceError;
      activeSourceIds = (sourceRows ?? []).map((row) => row.id as string);
    }

    const items: ItemPayload[] = [];
    if (activeSourceIds.length > 0) {
      for (const member of members) {
        const { data: itemRows, error: itemError } = await admin
          .from("items")
          .select("id,user_id,kind,title,author,tags,excerpt,saved_at,created_at")
          .eq("user_id", member.id)
          .in("source_id", activeSourceIds)
          .eq("hidden", false)
          .order("saved_at", { ascending: false, nullsFirst: false })
          .order("created_at", { ascending: false })
          .limit(120);
        if (itemError) throw itemError;

        for (const row of itemRows ?? []) {
          items.push({
            id: row.id as string,
            member_id: row.user_id as string,
            kind: row.kind as ItemKind,
            title: row.title as string,
            author: (row.author as string | null) ?? null,
            tags: (row.tags as string[] | null) ?? [],
            excerpt:
              typeof row.excerpt === "string" ? row.excerpt.slice(0, 280) : null,
            saved_at: (row.saved_at as string | null) ?? null,
          });
        }
      }
    }

    const { data: pastBlendRows, error: pastBlendError } = await admin
      .from("blends")
      .select("id")
      .eq("circle_id", circleId)
      .eq("status", "done")
      .order("created_at", { ascending: false })
      .limit(3);
    if (pastBlendError) throw pastBlendError;

    const pastBlendIds = (pastBlendRows ?? []).map((row) => row.id as string);
    let pastPrompts: PastPromptPayload[] = [];
    if (pastBlendIds.length > 0) {
      const { data: promptRows, error: promptError } = await admin
        .from("prompts")
        .select("id,kind,body,evidence,created_at")
        .in("blend_id", pastBlendIds)
        .order("created_at", { ascending: false });
      if (promptError) throw promptError;

      const promptIds = (promptRows ?? []).map((row) => row.id as string);
      const reactionsByPrompt = new Map<string, ReactionKind[]>();
      if (promptIds.length > 0) {
        const { data: reactionRows, error: reactionError } = await admin
          .from("reactions")
          .select("prompt_id,kind")
          .in("prompt_id", promptIds);
        if (reactionError) throw reactionError;

        for (const row of reactionRows ?? []) {
          const promptId = row.prompt_id as string;
          const reactions = reactionsByPrompt.get(promptId) ?? [];
          reactions.push(row.kind as ReactionKind);
          reactionsByPrompt.set(promptId, reactions);
        }
      }

      pastPrompts = (promptRows ?? []).map((row) => ({
        kind: row.kind as string,
        body: row.body as string,
        evidence_item_ids: evidenceIds(row.evidence),
        reactions: reactionsByPrompt.get(row.id as string) ?? [],
      }));
    }

    const payload = {
      circle: { name: circle.name as string },
      members,
      items,
      past_prompts: pastPrompts,
    };

    const client = new Anthropic();
    const response = await client.messages.parse({
      model,
      max_tokens: 8000,
      system: HOST_PROMPT,
      messages: [{ role: "user", content: JSON.stringify(payload) }],
      output_config: { format: zodOutputFormat(hostOutput) },
    });

    if (response.stop_reason === "refusal" || response.parsed_output === null) {
      throw new Error("The host did not return a usable blend");
    }

    const validItemIds = new Set(items.map((item) => item.id));
    const validPrompts = response.parsed_output.prompts.filter((prompt) =>
      prompt.evidence.every((entry) => validItemIds.has(entry.item_id)),
    );

    const memberIdByName = new Map(
      members.map((member) => [member.name.trim().toLowerCase(), member.id]),
    );
    const promptRows = validPrompts.map((prompt) => ({
      blend_id: blendId,
      circle_id: circleId,
      kind: prompt.kind,
      body: prompt.body,
      participants: [
        ...new Set(
          prompt.participants.flatMap((name) => {
            const id = memberIdByName.get(name.trim().toLowerCase());
            return id ? [id] : [];
          }),
        ),
      ],
      evidence: prompt.evidence,
    }));

    if (promptRows.length > 0) {
      const { error: promptInsertError } = await admin.from("prompts").insert(promptRows);
      if (promptInsertError) throw promptInsertError;
    }

    const { error: completeError } = await admin
      .from("blends")
      .update({ status: "done", model })
      .eq("id", blendId);
    if (completeError) throw completeError;

    return { blendId, promptCount: promptRows.length };
  } catch (error) {
    await markFailed(blendId, model);
    throw error;
  }
}
