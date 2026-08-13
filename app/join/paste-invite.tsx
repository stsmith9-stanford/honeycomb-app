"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Pulls the token out of whatever got pasted: a full invite URL, a path, or
 * the bare token itself.
 */
function tokenFrom(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const fromPath = /\/join\/([A-Za-z0-9_-]{6,})/.exec(trimmed);
  if (fromPath) return fromPath[1];

  if (/^[A-Za-z0-9_-]{6,}$/.test(trimmed)) return trimmed;

  return null;
}

export function PasteInvite() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = tokenFrom(value);

    if (!token) {
      setError("That does not look like an invite link. Paste the whole thing?");
      return;
    }

    setError(null);
    router.push(`/join/${token}`);
  }

  return (
    <>
      <form className="app-form" onSubmit={handleSubmit}>
        <div className="app-field">
          <label className="app-label" htmlFor="invite">
            Invite link
          </label>
          <input
            id="invite"
            className="app-input"
            type="text"
            name="invite"
            autoComplete="off"
            spellCheck={false}
            placeholder="https://…/join/…"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Take me there
        </button>
      </form>
      {error ? <p className="app-error">{error}</p> : null}
    </>
  );
}
