/**
 * Normalizes a `?next=` redirect target to a same-origin path, so a crafted
 * link cannot bounce a signed-in user off to another site.
 */
export function safeNextPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}
