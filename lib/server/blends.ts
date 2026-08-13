import { runBlend, type BlendTrigger } from "@/lib/host/runBlend";
import { createAdminClient } from "@/lib/server/admin";
import type { AdminClient } from "@/lib/server/access";

export async function circleHasEnoughVisibleMembers(
  admin: AdminClient,
  circleId: string,
): Promise<boolean> {
  const { data: memberRows, error: memberError } = await admin
    .from("circle_members")
    .select("user_id")
    .eq("circle_id", circleId);
  if (memberError) throw memberError;

  const memberIds = new Set((memberRows ?? []).map((row) => row.user_id as string));
  if (memberIds.size < 2) return false;

  const { data: shareRows, error: shareError } = await admin
    .from("source_shares")
    .select("source_id")
    .eq("circle_id", circleId);
  if (shareError) throw shareError;

  const sharedSourceIds = (shareRows ?? []).map((row) => row.source_id as string);
  if (sharedSourceIds.length === 0) return false;

  const { data: sourceRows, error: sourceError } = await admin
    .from("sources")
    .select("id")
    .in("id", sharedSourceIds)
    .eq("paused", false);
  if (sourceError) throw sourceError;

  const activeSourceIds = (sourceRows ?? []).map((row) => row.id as string);
  if (activeSourceIds.length === 0) return false;

  const { data: itemRows, error: itemError } = await admin
    .from("items")
    .select("user_id")
    .in("source_id", activeSourceIds)
    .eq("hidden", false);
  if (itemError) throw itemError;

  const visibleMembers = new Set<string>();
  for (const row of itemRows ?? []) {
    const userId = row.user_id as string;
    if (memberIds.has(userId)) visibleMembers.add(userId);
    if (visibleMembers.size >= 2) return true;
  }

  return false;
}

export async function hasDoneBlendSince(
  admin: AdminClient,
  circleId: string,
  since?: string,
): Promise<{ id: string; created_at: string } | null> {
  let query = admin
    .from("blends")
    .select("id,created_at")
    .eq("circle_id", circleId)
    .eq("status", "done")
    .order("created_at", { ascending: false })
    .limit(1);

  if (since) query = query.gte("created_at", since);

  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data as { id: string; created_at: string } | null;
}

export async function triggerFirstBlendsForSource(sourceId: string): Promise<void> {
  try {
    const admin = createAdminClient();
    const { data: shares, error } = await admin
      .from("source_shares")
      .select("circle_id")
      .eq("source_id", sourceId);
    if (error) throw error;

    const circleIds = [...new Set((shares ?? []).map((row) => row.circle_id as string))];
    for (const circleId of circleIds) {
      const [eligible, existingBlend] = await Promise.all([
        circleHasEnoughVisibleMembers(admin, circleId),
        hasDoneBlendSince(admin, circleId),
      ]);

      if (eligible && !existingBlend) {
        await runBlend(circleId, "first");
      }
    }
  } catch (error) {
    console.error(`First blend check failed for source ${sourceId}`, error);
  }
}

export type { BlendTrigger };
