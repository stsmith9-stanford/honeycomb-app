import { createClient } from "@/lib/supabase/server";
import type { ItemKind, ItemRow } from "@/lib/types";

/*
  Library reads. Everything is owner-scoped by RLS (`sources`, `items`,
  `source_shares` for my own sources), so no extra filtering is needed beyond
  `user_id = me` for clarity.
*/

/** Enough for the pilot; the list says so when it is cut off. */
const ITEM_LIMIT = 600;

type SourceRow = {
  id: string;
  kind: string;
  label: string;
  paused: boolean;
  last_synced_at: string | null;
};
type ShareRow = { source_id: string; circle_id: string };
type MembershipRow = { circle_id: string };
type CircleRow = { id: string; name: string; slug: string };
type SourceIdRow = { source_id: string };

export type LibrarySource = {
  id: string;
  kind: "readwise" | "folder";
  label: string;
  paused: boolean;
  lastSyncedAt: string | null;
  itemCount: number;
  circleIds: string[];
};

export type LibraryCircle = { id: string; name: string; slug: string };

export type LibraryItem = {
  id: string;
  sourceId: string;
  kind: ItemKind;
  title: string;
  author: string | null;
  url: string | null;
  excerpt: string | null;
  tags: string[];
  savedAt: string | null;
  hidden: boolean;
};

export type LibraryData = {
  sources: LibrarySource[];
  circles: LibraryCircle[];
  items: LibraryItem[];
  truncated: boolean;
};

export async function loadLibrary(): Promise<LibraryData> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { sources: [], circles: [], items: [], truncated: false };
  }

  const { data: sourceData } = await supabase
    .from("sources")
    .select("id, kind, label, paused, last_synced_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  const sourceRows = (sourceData ?? []) as SourceRow[];
  const sourceIds = sourceRows.map((row) => row.id);

  const { data: shareData } = sourceIds.length
    ? await supabase
        .from("source_shares")
        .select("source_id, circle_id")
        .in("source_id", sourceIds)
    : { data: [] };

  const sharesBySource = new Map<string, string[]>();
  for (const row of (shareData ?? []) as ShareRow[]) {
    sharesBySource.set(row.source_id, [
      ...(sharesBySource.get(row.source_id) ?? []),
      row.circle_id,
    ]);
  }

  // Counts come from a column-only read so the display list can stay capped.
  const { data: countData } = await supabase
    .from("items")
    .select("source_id")
    .eq("user_id", user.id);

  const countsBySource = new Map<string, number>();
  for (const row of (countData ?? []) as SourceIdRow[]) {
    countsBySource.set(row.source_id, (countsBySource.get(row.source_id) ?? 0) + 1);
  }

  const { data: membershipData } = await supabase
    .from("circle_members")
    .select("circle_id")
    .eq("user_id", user.id);

  const circleIds = ((membershipData ?? []) as MembershipRow[]).map(
    (row) => row.circle_id,
  );

  const { data: circleData } = circleIds.length
    ? await supabase
        .from("circles")
        .select("id, name, slug")
        .in("id", circleIds)
        .order("name", { ascending: true })
    : { data: [] };

  const { data: itemData } = await supabase
    .from("items")
    .select(
      "id, source_id, user_id, kind, title, author, url, excerpt, tags, saved_at, hidden",
    )
    .eq("user_id", user.id)
    .order("saved_at", { ascending: false, nullsFirst: false })
    .limit(ITEM_LIMIT);

  const itemRows = (itemData ?? []) as ItemRow[];

  return {
    sources: sourceRows.map((row) => ({
      id: row.id,
      kind: row.kind === "readwise" ? "readwise" : "folder",
      label: row.label,
      paused: row.paused,
      lastSyncedAt: row.last_synced_at,
      itemCount: countsBySource.get(row.id) ?? 0,
      circleIds: sharesBySource.get(row.id) ?? [],
    })),
    circles: ((circleData ?? []) as CircleRow[]).map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
    })),
    items: itemRows.map((row) => ({
      id: row.id,
      sourceId: row.source_id,
      kind: row.kind,
      title: row.title,
      author: row.author,
      url: row.url,
      excerpt: row.excerpt,
      tags: row.tags ?? [],
      savedAt: row.saved_at,
      hidden: row.hidden,
    })),
    truncated: itemRows.length >= ITEM_LIMIT,
  };
}
