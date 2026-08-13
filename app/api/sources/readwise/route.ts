import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/server/admin";
import { triggerFirstBlendsForSource } from "@/lib/server/blends";
import { errorResponse, HttpError, parseBody, requireUser } from "@/lib/server/http";
import { syncReadwiseSource } from "@/lib/server/readwise";
import { connectReadwiseBody } from "@/lib/types";

async function validateReadwiseToken(token: string): Promise<void> {
  let response: Response;
  try {
    response = await fetch("https://readwise.io/api/v2/auth/", {
      headers: { Authorization: `Token ${token}` },
      cache: "no-store",
    });
  } catch {
    throw new HttpError(502, "Could not reach Readwise");
  }

  if (response.status === 204) return;
  if (response.status === 401 || response.status === 403) {
    throw new HttpError(400, "Invalid Readwise token");
  }
  throw new HttpError(502, `Readwise validation failed (${response.status})`);
}

export async function POST(request: Request) {
  let createdSourceId: string | null = null;

  try {
    const user = await requireUser();
    const { token } = await parseBody(request, connectReadwiseBody);
    await validateReadwiseToken(token);

    const admin = createAdminClient();
    const { data: source, error: sourceError } = await admin
      .from("sources")
      .insert({ user_id: user.id, kind: "readwise", label: "Readwise" })
      .select("id,user_id,kind,label,paused,last_synced_at")
      .single();
    if (sourceError) throw sourceError;
    createdSourceId = source.id as string;

    const { error: secretError } = await admin.from("source_secrets").insert({
      source_id: source.id,
      token,
    });
    if (secretError) throw secretError;

    const itemCount = await syncReadwiseSource(admin, {
      id: source.id as string,
      user_id: source.user_id as string,
      kind: "readwise",
      label: source.label as string,
      paused: source.paused as boolean,
      last_synced_at: (source.last_synced_at as string | null) ?? null,
    });
    await triggerFirstBlendsForSource(source.id as string);

    return NextResponse.json({ sourceId: source.id, itemCount });
  } catch (error) {
    if (createdSourceId) {
      const admin = createAdminClient();
      const { error: cleanupError } = await admin
        .from("sources")
        .delete()
        .eq("id", createdSourceId);
      if (cleanupError) console.error("Failed to clean up Readwise source", cleanupError);
    }
    return errorResponse(error);
  }
}
