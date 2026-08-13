import { createBrowserClient } from "@supabase/ssr";

import { required } from "@/lib/env";

/** Supabase client for browser (client component) use. */
export function createClient() {
  return createBrowserClient(
    required("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
    required(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ),
  );
}
