import { NextResponse } from "next/server";

import { requireCircleMember } from "@/lib/server/access";
import { createAdminClient } from "@/lib/server/admin";
import { errorResponse, HttpError, parseBody, requireUser } from "@/lib/server/http";
import { reactBody } from "@/lib/types";

type Context = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Context) {
  try {
    const user = await requireUser();
    const { kind } = await parseBody(request, reactBody);
    const { id } = await params;
    const admin = createAdminClient();
    const { data: prompt, error: promptError } = await admin
      .from("prompts")
      .select("circle_id")
      .eq("id", id)
      .maybeSingle();
    if (promptError) throw promptError;
    if (!prompt) throw new HttpError(404, "Prompt not found");

    await requireCircleMember(admin, prompt.circle_id as string, user.id);
    const { error: reactionError } = await admin.from("reactions").upsert(
      { prompt_id: id, user_id: user.id, kind },
      { onConflict: "prompt_id,user_id,kind" },
    );
    if (reactionError) throw reactionError;

    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
