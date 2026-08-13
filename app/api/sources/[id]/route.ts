import { NextResponse } from "next/server";

import { requireSourceOwner } from "@/lib/server/access";
import { createAdminClient } from "@/lib/server/admin";
import { triggerFirstBlendsForSource } from "@/lib/server/blends";
import { errorResponse, HttpError, parseBody, requireUser } from "@/lib/server/http";
import { patchSourceBody } from "@/lib/types";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  try {
    const user = await requireUser();
    const body = await parseBody(request, patchSourceBody);
    const { id } = await params;
    const admin = createAdminClient();
    await requireSourceOwner(admin, id, user.id);

    if (body.circleIds !== undefined) {
      const uniqueCircleIds = [...new Set(body.circleIds)];
      if (uniqueCircleIds.length > 0) {
        const { data: memberships, error: membershipError } = await admin
          .from("circle_members")
          .select("circle_id")
          .eq("user_id", user.id)
          .in("circle_id", uniqueCircleIds);
        if (membershipError) throw membershipError;
        if ((memberships ?? []).length !== uniqueCircleIds.length) {
          throw new HttpError(403, "Sources can only be shared to your circles");
        }
      }

      const { error: deleteError } = await admin
        .from("source_shares")
        .delete()
        .eq("source_id", id);
      if (deleteError) throw deleteError;

      if (uniqueCircleIds.length > 0) {
        const { error: insertError } = await admin.from("source_shares").insert(
          uniqueCircleIds.map((circleId) => ({ source_id: id, circle_id: circleId })),
        );
        if (insertError) throw insertError;
      }
    }

    if (body.paused !== undefined) {
      const { error: updateError } = await admin
        .from("sources")
        .update({ paused: body.paused })
        .eq("id", id);
      if (updateError) throw updateError;
    }

    if (body.circleIds !== undefined) {
      await triggerFirstBlendsForSource(id);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
