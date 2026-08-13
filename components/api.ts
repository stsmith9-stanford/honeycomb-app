/**
 * A tiny fetch wrapper for the JSON route handlers in `app/api` (contract:
 * docs/SPEC.md "API route handlers").
 *
 * Everything is returned as a result object rather than thrown: the UI always
 * has a friendly line to render, including while a route is still missing
 * (404) or the network is down.
 */

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; status: number };

function messageFrom(body: unknown): string | null {
  if (typeof body !== "object" || body === null) return null;
  const record = body as Record<string, unknown>;
  for (const key of ["error", "message", "detail"]) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

function fallbackFor(status: number): string {
  if (status === 401) return "You're signed out. Sign in again and retry.";
  if (status === 403) return "You don't have access to that.";
  if (status === 404) {
    return "That endpoint isn't available yet. Try again in a moment.";
  }
  if (status === 409) return "That's already been done.";
  if (status === 429) return "Too many requests — give it a minute.";
  if (status >= 500) return "The server hit a snag. Try again in a moment.";
  return `Request failed (${status}).`;
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiResult<T>> {
  let response: Response;

  try {
    response = await fetch(path, {
      ...init,
      headers: {
        "content-type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    return {
      ok: false,
      status: 0,
      error: "Couldn't reach the server. Check your connection and try again.",
    };
  }

  const text = await response.text();
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text) as unknown;
    } catch {
      body = null;
    }
  }

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: messageFrom(body) ?? fallbackFor(response.status),
    };
  }

  return { ok: true, data: (body ?? {}) as T };
}

export function postJson<T>(path: string, payload?: unknown): Promise<ApiResult<T>> {
  return apiFetch<T>(path, {
    method: "POST",
    body: payload === undefined ? undefined : JSON.stringify(payload),
  });
}

export function patchJson<T>(path: string, payload: unknown): Promise<ApiResult<T>> {
  return apiFetch<T>(path, { method: "PATCH", body: JSON.stringify(payload) });
}

export function putJson<T>(path: string, payload: unknown): Promise<ApiResult<T>> {
  return apiFetch<T>(path, { method: "PUT", body: JSON.stringify(payload) });
}
