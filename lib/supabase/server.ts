import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { required } from "@/lib/env";

/**
 * Supabase client for server components, route handlers, and server actions.
 * Reads and writes the auth session through Next's cookie store.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    required("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
    required(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Called from a Server Component, which cannot set cookies.
            // middleware.ts refreshes the session instead.
          }
        },
      },
    },
  );
}
