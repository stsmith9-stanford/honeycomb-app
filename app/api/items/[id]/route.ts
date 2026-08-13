import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/server/admin";
import { errorResponse, HttpError, parseBody, requireUser } from "@/lib/server/http";
import { patchItemBody } from "@/lib/types";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  try {
    const user = await requireUser();
    const { hidden } = await parseBody(request, patchItemBody);
    const { id } = await params;
    const admin = createAdminClient();
    const { data: item, error: itemError } = await admin
      .from("items")
      .select("user_id")
      .eq("id", id)
      .maybeSingle();
    if (itemError) throw itemError;
    if (!item) throw new HttpError(404, "Item not found");
    if (item.user_id !== user.id) throw new HttpError(403, "Forbidden");

    const { error: updateError } = await admin
      .from("items")
      .update({ hidden })
      .eq("id", id);
    if (updateError) throw updateError;

    return NextResponse.json({ hidden });
  } catch (error) {
    return errorResponse(error);
  }
}
