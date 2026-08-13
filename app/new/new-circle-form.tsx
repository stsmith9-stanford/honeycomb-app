"use client";

import Link from "next/link";
import { useState } from "react";

import { postJson } from "@/components/api";
import { CopyLink } from "@/components/copy-link";

type Created = {
  name: string;
  slug: string;
  inviteUrl: string | null;
};

/** `POST /api/circles` → `{slug, inviteUrl}` (docs/SPEC.md). */
type CreateCircleResponse = {
  slug?: unknown;
  inviteUrl?: unknown;
};

export function NewCircleForm() {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<Created | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || busy) return;

    setBusy(true);
    setError(null);

    const result = await postJson<CreateCircleResponse>("/api/circles", {
      name: trimmed,
    });

    if (!result.ok) {
      setError(result.error);
      setBusy(false);
      return;
    }

    const slug = typeof result.data.slug === "string" ? result.data.slug : null;
    if (!slug) {
      setError("The circle was created but came back without an address.");
      setBusy(false);
      return;
    }

    setCreated({
      name: trimmed,
      slug,
      inviteUrl:
        typeof result.data.inviteUrl === "string" ? result.data.inviteUrl : null,
    });
    setBusy(false);
  }

  if (created) {
    return (
      <div className="card">
        <p className="eyebrow">Your circle is live</p>
        <h1 className="app-h1">
          <em>{created.name}</em> is ready.
        </h1>
        <p className="app-lede">
          One link brings everyone in. Send it to two to five people who already
          trust each other — the host starts talking once two libraries are
          connected.
        </p>

        {created.inviteUrl ? (
          <CopyLink url={created.inviteUrl} />
        ) : (
          <p className="app-status">
            The invite link is on the circle page — open your circle to copy it.
          </p>
        )}

        <div className="btn-row" style={{ marginTop: 24 }}>
          <Link className="btn btn-primary" href={`/c/${created.slug}`}>
            Open your circle
          </Link>
          <Link className="btn btn-ghost" href="/library">
            Connect your library
          </Link>
        </div>

        <p className="app-note">
          Nothing is shared yet. You choose which circles each source feeds from
          your library.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <p className="eyebrow">Start a circle</p>
      <h1 className="app-h1">What do you call these people?</h1>
      <p className="app-lede">
        Whatever the group already calls itself. The name only shows up inside
        the circle.
      </p>

      <form className="app-form" onSubmit={handleSubmit}>
        <div className="app-field">
          <label className="app-label" htmlFor="circle-name">
            Circle name
          </label>
          <input
            id="circle-name"
            className="name-input"
            type="text"
            name="name"
            autoComplete="off"
            autoFocus
            maxLength={80}
            placeholder="the group chat"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <button
          className="btn btn-primary"
          type="submit"
          disabled={busy || name.trim().length === 0}
        >
          {busy ? "Creating…" : "Create the circle"}
        </button>
      </form>

      {error ? <p className="app-error">{error}</p> : null}

      <p className="app-note">
        Two to five people works best — a circle of people who already trust
        each other. Leave any time and your slice leaves with you.
      </p>
    </div>
  );
}
