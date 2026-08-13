/**
 * Reads an environment variable, failing loudly when it is missing.
 *
 * Always pass the value as a static `process.env.NAME` reference so Next can
 * inline `NEXT_PUBLIC_*` vars into the client bundle:
 *
 *   required("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL)
 */
export function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing environment variable: ${name} (see .env.example)`);
  }
  return value;
}
