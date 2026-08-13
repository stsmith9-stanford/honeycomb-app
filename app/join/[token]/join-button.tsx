"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { postJson } from "@/components/api";

/** `POST /api/invites/[token]/redeem` → `{slug}` (docs/SPEC.md). */
type RedeemResponse = { slug?: unknown };

export function JoinButton({
  token,
  circleName,
}: {
  token: string;
  circleName: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleJoin() {
    if (busy) return;
    setBusy(true);
    setError(null);

    const result = await postJson<RedeemResponse>(
      `/api/invites/${encodeURIComponent(token)}/redeem`,
    );

    if (!result.ok) {
      setError(result.error);
      setBusy(false);
      return;
    }

    const slug = typeof result.data.slug === "string" ? result.data.slug : null;
    if (!slug) {
      setError("You are in, but the circle address did not come back.");
      setBusy(false);
      return;
    }

    router.replace(`/c/${slug}`);
    router.refresh();
  }

  return (
    <>
      <div className="btn-row">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleJoin}
          disabled={busy}
        >
          {busy ? "Joining…" : `Join ${circleName}`}
        </button>
      </div>
      {error ? <p className="app-error">{error}</p> : null}
    </>
  );
}
