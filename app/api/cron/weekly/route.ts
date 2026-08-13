import { NextResponse } from "next/server";

import { required } from "@/lib/env";
import { runBlend } from "@/lib/host/runBlend";
import { createAdminClient } from "@/lib/server/admin";
import {
  circleHasEnoughVisibleMembers,
  hasDoneBlendSince,
} from "@/lib/server/blends";
import { errorResponse } from "@/lib/server/http";

export async function GET(request: Request) {
  try {
    const secret = required("CRON_SECRET", process.env.CRON_SECRET);
    if (request.headers.get("authorization") !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();
    const { data: circles, error: circleError } = await admin
      .from("circles")
      .select("id");
    if (circleError) throw circleError;

    const sixDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString();
    let eligible = 0;
    let generated = 0;
    let failed = 0;

    for (const circle of circles ?? []) {
      const circleId = circle.id as string;
      try {
        const [hasItems, recentBlend] = await Promise.all([
          circleHasEnoughVisibleMembers(admin, circleId),
          hasDoneBlendSince(admin, circleId, sixDaysAgo),
        ]);
        if (!hasItems || recentBlend) continue;

        eligible += 1;
        await runBlend(circleId, "cron");
        generated += 1;
      } catch (error) {
        failed += 1;
        console.error(`Weekly blend failed for circle ${circleId}`, error);
      }
    }

    return NextResponse.json({ checked: circles?.length ?? 0, eligible, generated, failed });
  } catch (error) {
    return errorResponse(error);
  }
}
