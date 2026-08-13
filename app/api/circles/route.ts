import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

import { required } from "@/lib/env";
import { createAdminClient } from "@/lib/server/admin";
import { errorResponse, parseBody, requireUser } from "@/lib/server/http";
import { createCircleBody } from "@/lib/types";

function slugify(name: string): string {
  const slug = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return slug || "circle";
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const { name } = await parseBody(request, createCircleBody);
    const appUrl = required("NEXT_PUBLIC_APP_URL", process.env.NEXT_PUBLIC_APP_URL);
    const admin = createAdminClient();
    const slug = `${slugify(name)}-${nanoid(6)}`;

    const { data: circle, error: circleError } = await admin
      .from("circles")
      .insert({ name, slug, created_by: user.id })
      .select("id")
      .single();
    if (circleError) throw circleError;

    const token = nanoid(21);
    const { error: setupError } = await admin.from("circle_members").insert({
      circle_id: circle.id,
      user_id: user.id,
      role: "admin",
    });
    if (setupError) {
      await admin.from("circles").delete().eq("id", circle.id);
      throw setupError;
    }

    const { error: inviteError } = await admin.from("invites").insert({
      token,
      circle_id: circle.id,
      created_by: user.id,
    });
    if (inviteError) {
      await admin.from("circles").delete().eq("id", circle.id);
      throw inviteError;
    }

    return NextResponse.json({
      slug,
      inviteUrl: `${appUrl.replace(/\/$/, "")}/join/${token}`,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
