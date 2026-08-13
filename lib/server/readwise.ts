import type { ItemKind } from "@/lib/types";
import type { AdminClient, SourceRecord } from "@/lib/server/access";
import { HttpError } from "@/lib/server/http";

type JsonRecord = Record<string, unknown>;

type ItemUpsert = {
  source_id: string;
  user_id: string;
  external_id: string;
  kind: ItemKind;
  title: string;
  author: string | null;
  url: string | null;
  excerpt: string | null;
  tags: string[];
  saved_at: string | null;
};

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function externalId(value: unknown): string | null {
  if (typeof value === "string" && value.length > 0) return value;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}

function truncate(value: string | null, length: number): string | null {
  return value ? value.slice(0, length) : null;
}

function categoryKind(category: unknown): ItemKind {
  const normalized = typeof category === "string" ? category.toLowerCase() : "";
  if (normalized === "book" || normalized === "books") return "book";
  if (normalized === "article" || normalized === "articles") return "article";
  if (normalized === "tweet" || normalized === "tweets") return "tweet";
  if (normalized === "podcast" || normalized === "podcasts") return "podcast";
  return "note";
}

function tagsFrom(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((tag) => {
      if (typeof tag === "string") return tag;
      if (isRecord(tag)) return stringValue(tag.name);
      return null;
    })
    .filter((tag): tag is string => Boolean(tag))
    .slice(0, 20);
}

function firstString(record: JsonRecord, keys: string[]): string | null {
  for (const key of keys) {
    const value = stringValue(record[key]);
    if (value) return value;
  }
  return null;
}

function bookToItem(book: JsonRecord, source: SourceRecord): ItemUpsert | null {
  const id = externalId(book.user_book_id ?? book.id);
  const title = firstString(book, ["title", "readable_title"]);
  if (!id || !title) return null;

  const highlights = Array.isArray(book.highlights)
    ? book.highlights.filter(isRecord)
    : [];
  const firstHighlight = highlights[0];

  return {
    source_id: source.id,
    user_id: source.user_id,
    external_id: id,
    kind: categoryKind(book.category),
    title,
    author: stringValue(book.author),
    url: firstString(book, ["source_url", "unique_url", "readwise_url"]),
    excerpt: truncate(firstHighlight ? stringValue(firstHighlight.text) : null, 500),
    tags: tagsFrom(book.book_tags ?? book.tags),
    saved_at: firstHighlight
      ? firstString(firstHighlight, ["highlighted_at", "updated_at", "created_at"])
      : firstString(book, ["updated_at", "created_at"]),
  };
}

function documentToItem(document: JsonRecord, source: SourceRecord): ItemUpsert | null {
  const id = externalId(document.id);
  const title = stringValue(document.title);
  if (!id || !title) return null;

  return {
    source_id: source.id,
    user_id: source.user_id,
    external_id: id,
    kind: categoryKind(document.category),
    title,
    author: stringValue(document.author),
    url: firstString(document, ["source_url", "url"]),
    excerpt: truncate(stringValue(document.summary), 500),
    tags: tagsFrom(document.tags),
    saved_at: firstString(document, ["saved_at", "updated_at", "created_at"]),
  };
}

function retryDelayMs(header: string | null): number {
  if (!header) return 1000;
  const seconds = Number(header);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);

  const timestamp = Date.parse(header);
  return Number.isNaN(timestamp) ? 1000 : Math.max(0, timestamp - Date.now());
}

async function readwiseFetch(url: URL, token: string): Promise<Response> {
  const request = () =>
    fetch(url, {
      headers: { Authorization: `Token ${token}` },
      cache: "no-store",
    });

  let response = await request();
  if (response.status === 429) {
    await new Promise((resolve) =>
      setTimeout(resolve, Math.min(retryDelayMs(response.headers.get("retry-after")), 60_000)),
    );
    response = await request();
  }

  if (!response.ok) {
    throw new HttpError(502, `Readwise sync failed (${response.status})`);
  }

  return response;
}

async function fetchPages(
  baseUrl: string,
  token: string,
  lastSyncedAt: string | null,
  remaining: () => number,
  consume: (record: JsonRecord) => void,
): Promise<void> {
  let pageCursor: string | null = null;

  do {
    if (remaining() <= 0) return;

    const url = new URL(baseUrl);
    if (lastSyncedAt) url.searchParams.set("updatedAfter", lastSyncedAt);
    if (pageCursor) url.searchParams.set("pageCursor", pageCursor);

    const response = await readwiseFetch(url, token);
    const payload: unknown = await response.json();
    if (!isRecord(payload) || !Array.isArray(payload.results)) {
      throw new HttpError(502, "Readwise returned an invalid response");
    }

    for (const result of payload.results) {
      if (remaining() <= 0) return;
      if (isRecord(result)) consume(result);
    }

    pageCursor = stringValue(payload.nextPageCursor);
  } while (pageCursor);
}

export async function syncReadwiseSource(
  admin: AdminClient,
  source: SourceRecord,
): Promise<number> {
  if (source.kind !== "readwise") {
    throw new HttpError(400, "Source is not a Readwise source");
  }

  const { data: secret, error: secretError } = await admin
    .from("source_secrets")
    .select("token")
    .eq("source_id", source.id)
    .maybeSingle();
  if (secretError) throw secretError;
  if (!secret?.token) throw new HttpError(500, "Readwise credentials are missing");

  const syncedThrough = new Date().toISOString();
  const items: ItemUpsert[] = [];
  const remaining = () => 500 - items.length;

  await fetchPages(
    "https://readwise.io/api/v2/export/",
    secret.token as string,
    source.last_synced_at,
    remaining,
    (book) => {
      const item = bookToItem(book, source);
      if (item) items.push(item);
    },
  );

  await fetchPages(
    "https://readwise.io/api/v3/list/",
    secret.token as string,
    source.last_synced_at,
    remaining,
    (document) => {
      const item = documentToItem(document, source);
      if (item) items.push(item);
    },
  );

  for (let index = 0; index < items.length; index += 100) {
    const { error } = await admin
      .from("items")
      .upsert(items.slice(index, index + 100), {
        onConflict: "source_id,external_id",
      });
    if (error) throw error;
  }

  const { error: updateError } = await admin
    .from("sources")
    .update({ last_synced_at: syncedThrough })
    .eq("id", source.id);
  if (updateError) throw updateError;

  return items.length;
}
