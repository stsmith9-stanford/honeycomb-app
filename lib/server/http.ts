import type { User } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { z } from "zod";

import { createClient } from "@/lib/supabase/server";

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export async function requireUser(): Promise<User> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new HttpError(401, "Authentication required");
  }

  return user;
}

export async function parseBody<T>(
  request: Request,
  schema: z.ZodType<T>,
): Promise<T> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    throw new HttpError(400, "Invalid JSON body");
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    throw new HttpError(400, "Invalid request body");
  }

  return result.data;
}

export function errorResponse(error: unknown): NextResponse {
  if (error instanceof HttpError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  console.error(error);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
