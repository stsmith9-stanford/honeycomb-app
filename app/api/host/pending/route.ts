import { NextResponse } from "next/server";

import { required } from "@/lib/env";
import { HOST_PROMPT } from "@/lib/host/prompt";
import { gatherBlendPayload } from "@/lib/host/runBlend";
import { createAdminClient } from "@/lib/server/admin";
import { errorResponse } from "@/lib/server/http";

// External host workers (claude CLI runner, OpenClaw, Hermes) poll this for
// queued blends. Guarded by the same bearer secret as the cron route.
export async function GET(request: Request) {
  try {
    const secret = required("CRON_SECRET", process.env.CRON_SECRET);
    if (request.headers.get("authorization") !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();
    const { data: pending, error } = await admin
      .from("blends")
      .select("id,circle_id,trigger,created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(10);
    if (error) throw error;

    const jobs = [];
    for (const blend of pending ?? []) {
      const circleId = blend.circle_id as string;
      jobs.push({
        blendId: blend.id as string,
        circleId,
        trigger: blend.trigger as string,
        createdAt: blend.created_at as string,
        payload: await gatherBlendPayload(admin, circleId),
      });
    }

    return NextResponse.json({ systemPrompt: HOST_PROMPT, jobs });
  } catch (error) {
    return errorResponse(error);
  }
}
