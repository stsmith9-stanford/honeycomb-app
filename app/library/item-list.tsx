"use client";

import { useState } from "react";

import { patchJson } from "@/components/api";

import type { LibraryItem, LibrarySource } from "./data";
import { countLabel, formatDay } from "./format";

type Props = {
  items: LibraryItem[];
  sources: LibrarySource[];
  onChange: (next: LibraryItem) => void;
};

function ItemRow({
  item,
  onChange,
}: {
  item: LibraryItem;
  onChange: (next: LibraryItem) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggleHidden() {
    if (busy) return;
    const next = !item.hidden;
    setBusy(true);
    setError(null);
    onChange({ ...item, hidden: next });

    const result = await patchJson(`/api/items/${item.id}`, { hidden: next });

    if (!result.ok) {
      onChange({ ...item, hidden: !next });
      setError(result.error);
    }
    setBusy(false);
  }

  const meta = [
    item.kind,
    item.author,
    formatDay(item.savedAt),
    item.tags.length ? item.tags.slice(0, 4).join(", ") : null,
  ].filter((value): value is string => Boolean(value));

  return (
    <li className={`item-row${item.hidden ? " is-hidden" : ""}`}>
      <div className="item-body">
        <p className="item-title">
          {item.url ? (
            <a href={item.url} target="_blank" rel="noreferrer noopener">
              {item.title}
            </a>
          ) : (
            item.title
          )}
        </p>
        {meta.length ? <p className="item-meta">{meta.join(" · ")}</p> : null}
        {item.excerpt ? <p className="item-excerpt">{item.excerpt}</p> : null}
        {error ? <p className="app-error">{error}</p> : null}
      </div>
      <button
        type="button"
        className="btn btn-ghost btn-small"
        onClick={toggleHidden}
        disabled={busy}
        aria-pressed={item.hidden}
      >
        {item.hidden ? "Show" : "Hide"}
      </button>
    </li>
  );
}

export function ItemList({ items, sources, onChange }: Props) {
  const bySource = new Map<string, LibraryItem[]>();
  for (const item of items) {
    bySource.set(item.sourceId, [...(bySource.get(item.sourceId) ?? []), item]);
  }

  const groups = sources
    .map((source) => ({ source, rows: bySource.get(source.id) ?? [] }))
    .filter((group) => group.rows.length > 0);

  if (groups.length === 0) {
    return (
      <div className="state">
        <h2 className="app-h2">Nothing in here yet.</h2>
        <p>
          Connect Readwise or point at a folder of notes and everything you have
          been saving shows up here — yours to hide, one item at a time.
        </p>
      </div>
    );
  }

  return (
    <>
      {groups.map(({ source, rows }) => (
        <div className="item-group" key={source.id}>
          <div className="item-group-head">
            <h3 className="app-h3">{source.label}</h3>
            <p className="source-meta">
              {rows.length < source.itemCount
                ? `${rows.length} of ${countLabel(source.itemCount, "item", "items")}`
                : countLabel(source.itemCount, "item", "items")}
              {source.paused ? " · paused" : ""}
            </p>
          </div>
          <ul className="item-list">
            {rows.map((item) => (
              <ItemRow key={item.id} item={item} onChange={onChange} />
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}
