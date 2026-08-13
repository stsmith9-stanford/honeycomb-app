import { NextResponse } from "next/server";

import { runBlend } from "@/lib/host/runBlend";
import { requireCircleMember } from "@/lib/server/access";
import { createAdminClient } from "@/lib/server/admin";
import { errorResponse, requireUser } from "@/lib/server/http";
import { hasDoneBlendSince } from "@/lib/server/blends";

type Context = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Context) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const admin = createAdminClient();
    await requireCircleMember(admin, id, user.id);

    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const recentBlend = await hasDoneBlendSince(admin, id, tenMinutesAgo);
    if (recentBlend) {
      return NextResponse.json({ blendId: recentBlend.id, skipped: true });
    }

    const result = await runBlend(id, "manual");
    return NextResponse.json({ ...result, skipped: false });
  } catch (error) {
    return errorResponse(error);
  }
}
