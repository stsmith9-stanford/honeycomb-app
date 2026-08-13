import { NextResponse } from "next/server";

import { requireSourceOwner } from "@/lib/server/access";
import { createAdminClient } from "@/lib/server/admin";
import { triggerFirstBlendsForSource } from "@/lib/server/blends";
import { errorResponse, requireUser } from "@/lib/server/http";
import { syncReadwiseSource } from "@/lib/server/readwise";

type Context = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Context) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const admin = createAdminClient();
    const source = await requireSourceOwner(admin, id, user.id);
    const itemCount = await syncReadwiseSource(admin, source);
    await triggerFirstBlendsForSource(id);

    return NextResponse.json({ sourceId: id, itemCount });
  } catch (error) {
    return errorResponse(error);
  }
}
