import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/server/admin";
import { errorResponse, HttpError, requireUser } from "@/lib/server/http";

type Context = { params: Promise<{ token: string }> };

export async function POST(_request: Request, { params }: Context) {
  try {
    const user = await requireUser();
    const { token } = await params;
    const admin = createAdminClient();
    const { data: invite, error: inviteError } = await admin
      .from("invites")
      .select("circle_id,expires_at,max_uses,uses")
      .eq("token", token)
      .maybeSingle();
    if (inviteError) throw inviteError;
    if (!invite) throw new HttpError(404, "Invite not found");

    const { data: circle, error: circleError } = await admin
      .from("circles")
      .select("slug")
      .eq("id", invite.circle_id)
      .maybeSingle();
    if (circleError) throw circleError;
    if (!circle) throw new HttpError(404, "Invite not found");

    const { data: existing, error: existingError } = await admin
      .from("circle_members")
      .select("circle_id")
      .eq("circle_id", invite.circle_id)
      .eq("user_id", user.id)
      .maybeSingle();
    if (existingError) throw existingError;

    if (!existing) {
      if (invite.expires_at && Date.parse(invite.expires_at as string) <= Date.now()) {
        throw new HttpError(410, "Invite has expired");
      }
      if (invite.max_uses !== null && invite.uses >= invite.max_uses) {
        throw new HttpError(410, "Invite has reached its use limit");
      }

      const { error: memberError } = await admin.from("circle_members").upsert(
        {
          circle_id: invite.circle_id,
          user_id: user.id,
          role: "member",
        },
        { onConflict: "circle_id,user_id", ignoreDuplicates: true },
      );
      if (memberError) throw memberError;

      const { error: usesError } = await admin
        .from("invites")
        .update({ uses: (invite.uses as number) + 1 })
        .eq("token", token);
      if (usesError) throw usesError;
    }

    return NextResponse.json({ slug: circle.slug });
  } catch (error) {
    return errorResponse(error);
  }
}
