import type { createAdminClient } from "@/lib/server/admin";
import { HttpError } from "@/lib/server/http";

export type AdminClient = ReturnType<typeof createAdminClient>;

export type SourceRecord = {
  id: string;
  user_id: string;
  kind: "readwise" | "folder";
  label: string;
  paused: boolean;
  last_synced_at: string | null;
};

export async function requireSourceOwner(
  admin: AdminClient,
  sourceId: string,
  userId: string,
): Promise<SourceRecord> {
  const { data, error } = await admin
    .from("sources")
    .select("id,user_id,kind,label,paused,last_synced_at")
    .eq("id", sourceId)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new HttpError(404, "Source not found");
  if (data.user_id !== userId) throw new HttpError(403, "Forbidden");

  return data as SourceRecord;
}

export async function requireCircleMember(
  admin: AdminClient,
  circleId: string,
  userId: string,
): Promise<void> {
  const { data, error } = await admin
    .from("circle_members")
    .select("circle_id")
    .eq("circle_id", circleId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new HttpError(403, "Circle membership required");
}
