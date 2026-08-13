"use client";

import { useState } from "react";

import { patchJson, postJson } from "@/components/api";

import type { LibraryCircle, LibrarySource } from "./data";
import { countLabel, formatDay } from "./format";

type Props = {
  source: LibrarySource;
  circles: LibraryCircle[];
  /** Optimistic replace; the parent owns the list. */
  onChange: (next: LibrarySource) => void;
  onRefresh: () => void;
};

export function SourceCard({ source, circles, onChange, onRefresh }: Props) {
  const [busy, setBusy] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  async function togglePaused() {
    if (busy) return;
    const next = !source.paused;
    setBusy(true);
    setError(null);
    onChange({ ...source, paused: next });

    const result = await patchJson(`/api/sources/${source.id}`, {
      paused: next,
    });

    if (!result.ok) {
      onChange({ ...source, paused: !next });
      setError(result.error);
    }
    setBusy(false);
  }

  async function toggleCircle(circleId: string, checked: boolean) {
    if (busy) return;
    const previous = source.circleIds;
    const next = checked
      ? [...previous, circleId]
      : previous.filter((id) => id !== circleId);

    setBusy(true);
    setError(null);
    onChange({ ...source, circleIds: next });

    const result = await patchJson(`/api/sources/${source.id}`, {
      circleIds: next,
    });

    if (!result.ok) {
      onChange({ ...source, circleIds: previous });
      setError(result.error);
    }
    setBusy(false);
  }

  async function sync() {
    if (syncing) return;
    setSyncing(true);
    setError(null);
    setNote(null);

    const result = await postJson<{ itemCount?: unknown }>(
      `/api/sources/${source.id}/sync`,
    );

    if (!result.ok) {
      setError(result.error);
      setSyncing(false);
      return;
    }

    const count =
      typeof result.data.itemCount === "number" ? result.data.itemCount : null;
    setNote(count === null ? "Synced." : `Synced — ${count} items.`);
    setSyncing(false);
    onRefresh();
  }

  const synced = formatDay(source.lastSyncedAt);

  return (
    <div className="source-card">
      <div className="source-head">
        <div>
          <div className="source-title">
            <span className="app-h3">{source.label}</span>
            <span className="chip">
              {source.kind === "readwise" ? "Readwise" : "Folder"}
            </span>
            {source.paused ? <span className="chip chip--muted">Paused</span> : null}
          </div>
          <p className="source-meta">
            {countLabel(source.itemCount, "item", "items")} ·{" "}
            {synced ? `synced ${synced}` : "not synced yet"}
          </p>
        </div>

        <div className="source-actions">
          {source.kind === "readwise" ? (
            <button
              type="button"
              className="btn btn-ghost btn-small"
              onClick={sync}
              disabled={syncing}
            >
              {syncing ? "Syncing…" : "Sync now"}
            </button>
          ) : null}
          <button
            type="button"
            className="btn btn-ghost btn-small"
            onClick={togglePaused}
            disabled={busy}
          >
            {source.paused ? "Resume" : "Pause"}
          </button>
        </div>
      </div>

      <div className="share-block">
        <p className="app-label" style={{ margin: 0 }}>
          Feeds these circles
        </p>
        {circles.length === 0 ? (
          <p className="source-meta">
            You are not in a circle yet — nothing is shared.
          </p>
        ) : (
          <div className="share-list">
            {circles.map((circle) => (
              <label className="check" key={circle.id}>
                <input
                  type="checkbox"
                  checked={source.circleIds.includes(circle.id)}
                  disabled={busy}
                  onChange={(event) =>
                    toggleCircle(circle.id, event.target.checked)
                  }
                />
                {circle.name}
              </label>
            ))}
          </div>
        )}
      </div>

      {error ? <p className="app-error">{error}</p> : null}
      {note && !error ? <p className="app-status">{note}</p> : null}
    </div>
  );
}
