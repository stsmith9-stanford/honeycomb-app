import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { required } from "@/lib/env";

/**
 * Service-role Supabase client. Bypasses RLS — server-only, never import this
 * from a client component. Used for invite redemption, source secrets, sync,
 * and blend writes (docs/SPEC.md "API route handlers").
 */
export function createAdminClient() {
  return createSupabaseClient(
    required("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
    required("SUPABASE_SECRET_KEY", process.env.SUPABASE_SECRET_KEY),
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}
