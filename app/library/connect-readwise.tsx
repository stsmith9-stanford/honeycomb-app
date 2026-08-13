"use client";

import { useState } from "react";

import { postJson } from "@/components/api";

/** `POST /api/sources/readwise` → `{sourceId, itemCount}` (docs/SPEC.md). */
type ConnectResponse = { sourceId?: unknown; itemCount?: unknown };

export function ConnectReadwise({ onConnected }: { onConnected: () => void }) {
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = token.trim();
    if (!value || busy) return;

    setBusy(true);
    setError(null);
    setDone(null);

    const result = await postJson<ConnectResponse>("/api/sources/readwise", {
      token: value,
    });

    if (!result.ok) {
      setError(result.error);
      setBusy(false);
      return;
    }

    const count =
      typeof result.data.itemCount === "number" ? result.data.itemCount : null;
    setDone(
      count === null
        ? "Connected. The first sync is running."
        : `Connected — ${count} ${count === 1 ? "item" : "items"} pulled in.`,
    );
    setToken("");
    setBusy(false);
    onConnected();
  }

  return (
    <div className="connect-card">
      <p className="eyebrow">Readwise</p>
      <h3 className="app-h3">Paste your access token</h3>
      <p>
        Highlights from books and articles, plus whatever is in Reader. The
        token is stored server-side and never comes back to the browser.
      </p>

      <form className="app-form" onSubmit={handleSubmit}>
        <div className="app-field">
          <label className="app-label" htmlFor="readwise-token">
            Access token
          </label>
          <input
            id="readwise-token"
            className="app-input"
            type="password"
            name="readwise-token"
            autoComplete="off"
            spellCheck={false}
            placeholder="paste it here"
            value={token}
            onChange={(event) => setToken(event.target.value)}
          />
        </div>
        <button
          className="btn btn-primary btn-small"
          type="submit"
          disabled={busy || token.trim().length === 0}
        >
          {busy ? "Checking…" : "Connect Readwise"}
        </button>
      </form>

      {error ? <p className="app-error">{error}</p> : null}
      {done ? <p className="app-status">{done}</p> : null}

      <p className="app-note">
        Yours is at{" "}
        <a
          href="https://readwise.io/access_token"
          target="_blank"
          rel="noreferrer noopener"
        >
          readwise.io/access_token
        </a>
        .
      </p>
    </div>
  );
}
