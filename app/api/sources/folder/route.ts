import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/server/admin";
import { errorResponse, parseBody, requireUser } from "@/lib/server/http";
import { createFolderSourceBody } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const { label } = await parseBody(request, createFolderSourceBody);
    const admin = createAdminClient();
    const { data: source, error } = await admin
      .from("sources")
      .insert({ user_id: user.id, kind: "folder", label })
      .select("id")
      .single();
    if (error) throw error;

    return NextResponse.json({ sourceId: source.id });
  } catch (error) {
    return errorResponse(error);
  }
}
