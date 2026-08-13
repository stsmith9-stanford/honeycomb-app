import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/server/admin";
import { errorResponse, HttpError } from "@/lib/server/http";

type Context = { params: Promise<{ token: string }> };

export async function GET(_request: Request, { params }: Context) {
  try {
    const { token } = await params;
    const admin = createAdminClient();
    const { data: invite, error: inviteError } = await admin
      .from("invites")
      .select("circle_id")
      .eq("token", token)
      .maybeSingle();
    if (inviteError) throw inviteError;
    if (!invite) throw new HttpError(404, "Invite not found");

    const [{ data: circle, error: circleError }, { count, error: countError }] =
      await Promise.all([
        admin
          .from("circles")
          .select("name")
          .eq("id", invite.circle_id)
          .maybeSingle(),
        admin
          .from("circle_members")
          .select("user_id", { count: "exact", head: true })
          .eq("circle_id", invite.circle_id),
      ]);
    if (circleError) throw circleError;
    if (countError) throw countError;
    if (!circle) throw new HttpError(404, "Invite not found");

    return NextResponse.json({
      circleName: circle.name,
      memberCount: count ?? 0,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
