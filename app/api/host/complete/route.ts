import { NextResponse } from "next/server";
import { z } from "zod";

import { required } from "@/lib/env";
import {
  completeBlend,
  gatherBlendPayload,
  markBlendFailed,
} from "@/lib/host/runBlend";
import { createAdminClient } from "@/lib/server/admin";
import { errorResponse } from "@/lib/server/http";
import { hostOutput } from "@/lib/types";

const completeBody = z.object({
  blendId: z.string().uuid(),
  circleId: z.string().uuid(),
  model: z.string().max(120).default("external"),
  output: hostOutput.optional(),
  failed: z.string().max(500).optional(),
});

// External host workers report results here. The payload is re-gathered
// server-side so evidence is validated against current visible items.
export async function POST(request: Request) {
  try {
    const secret = required("CRON_SECRET", process.env.CRON_SECRET);
    if (request.headers.get("authorization") !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = completeBody.parse(await request.json());
    const admin = createAdminClient();

    const { data: blend, error } = await admin
      .from("blends")
      .select("id,circle_id,status")
      .eq("id", body.blendId)
      .maybeSingle();
    if (error) throw error;
    if (!blend || (blend.circle_id as string) !== body.circleId) {
      return NextResponse.json({ error: "Blend not found" }, { status: 404 });
    }
    if ((blend.status as string) !== "pending") {
      return NextResponse.json({ error: "Blend is not pending" }, { status: 409 });
    }

    if (body.failed || !body.output) {
      await markBlendFailed(body.blendId, body.model);
      return NextResponse.json({ blendId: body.blendId, status: "failed" });
    }

    const payload = await gatherBlendPayload(admin, body.circleId);
    const promptCount = await completeBlend(admin, {
      blendId: body.blendId,
      circleId: body.circleId,
      payload,
      output: body.output,
      model: body.model,
    });

    return NextResponse.json({ blendId: body.blendId, status: "done", promptCount });
  } catch (error) {
    return errorResponse(error);
  }
}
