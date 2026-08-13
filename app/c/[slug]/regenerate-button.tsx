"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { postJson } from "@/components/api";

/**
 * "Ask the host again" → `POST /api/circles/[id]/blend` (docs/SPEC.md).
 * The route rate-limits to one blend per 10 minutes; whatever it says comes
 * back verbatim so the wait is explained rather than silent.
 */
/** `{blendId, promptCount}` on a fresh run; `{skipped: true}` inside the window. */
type BlendResponse = { skipped?: unknown; promptCount?: unknown };

export function RegenerateButton({ circleId }: { circleId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  async function handleClick() {
    if (busy) return;
    setBusy(true);
    setError(null);
    setNote(null);

    const result = await postJson<BlendResponse>(`/api/circles/${circleId}/blend`);

    if (!result.ok) {
      setError(result.error);
      setBusy(false);
      return;
    }

    if (result.data.skipped === true) {
      setNote("The host looked within the last ten minutes — this is still it.");
    } else if (result.data.promptCount === 0) {
      setNote("Nothing worth saying this time.");
    }

    router.refresh();
    setBusy(false);
  }

  return (
    <div>
      <button
        type="button"
        className="btn btn-ghost"
        onClick={handleClick}
        disabled={busy}
      >
        {busy ? "Asking the host…" : "Ask the host again"}
      </button>
      {error ? <p className="app-error">{error}</p> : null}
      {note && !error ? <p className="app-status">{note}</p> : null}
    </div>
  );
}
