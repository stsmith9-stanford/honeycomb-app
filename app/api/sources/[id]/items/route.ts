import { NextResponse } from "next/server";

import { requireSourceOwner } from "@/lib/server/access";
import { createAdminClient } from "@/lib/server/admin";
import { triggerFirstBlendsForSource } from "@/lib/server/blends";
import { errorResponse, HttpError, parseBody, requireUser } from "@/lib/server/http";
import { putFolderItemsBody } from "@/lib/types";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Context) {
  try {
    const user = await requireUser();
    const body = await parseBody(request, putFolderItemsBody);
    const { id } = await params;
    const admin = createAdminClient();
    const source = await requireSourceOwner(admin, id, user.id);
    if (source.kind !== "folder") {
      throw new HttpError(400, "Source is not a folder source");
    }

    const rows = body.items.map((item) => ({
      source_id: id,
      user_id: user.id,
      external_id: item.externalId,
      title: item.title,
      kind: item.kind,
      author: item.author ?? null,
      url: item.url ?? null,
      tags: item.tags,
      excerpt: item.excerpt ?? null,
      saved_at: item.savedAt ?? null,
    }));
    const { error: upsertError } = await admin
      .from("items")
      .upsert(rows, { onConflict: "source_id,external_id" });
    if (upsertError) throw upsertError;

    const { error: sourceError } = await admin
      .from("sources")
      .update({ last_synced_at: new Date().toISOString() })
      .eq("id", id);
    if (sourceError) throw sourceError;

    await triggerFirstBlendsForSource(id);
    return NextResponse.json({ sourceId: id, itemCount: rows.length });
  } catch (error) {
    return errorResponse(error);
  }
}
