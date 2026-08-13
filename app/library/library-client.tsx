"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AddFolder } from "./add-folder";
import { ConnectReadwise } from "./connect-readwise";
import type { LibraryCircle, LibraryItem, LibrarySource } from "./data";
import { ItemList } from "./item-list";
import { SourceCard } from "./source-card";

type Props = {
  sources: LibrarySource[];
  circles: LibraryCircle[];
  items: LibraryItem[];
  truncated: boolean;
};

/**
 * Holds the library's optimistic state. Every mutation updates locally first
 * and calls `router.refresh()` when the server has more to say (new items,
 * fresh sync stamps); the effects below re-seed from the server render.
 */
export function LibraryClient({
  sources: initialSources,
  circles,
  items: initialItems,
  truncated,
}: Props) {
  const router = useRouter();
  const [sources, setSources] = useState(initialSources);
  const [items, setItems] = useState(initialItems);

  useEffect(() => setSources(initialSources), [initialSources]);
  useEffect(() => setItems(initialItems), [initialItems]);

  function replaceSource(next: LibrarySource) {
    setSources((current) =>
      current.map((source) => (source.id === next.id ? next : source)),
    );
  }

  function replaceItem(next: LibraryItem) {
    setItems((current) =>
      current.map((item) => (item.id === next.id ? next : item)),
    );
  }

  const refresh = () => router.refresh();

  return (
    <>
      <section className="app-section">
        <div className="app-section-head">
          <div>
            <p className="eyebrow">Connect</p>
            <h2 className="app-h2">Where your saves live</h2>
            <p>
              Connecting a source shares nothing by itself. You choose which
              circles it feeds, and you can hide any single item.
            </p>
          </div>
        </div>

        <div className="connect-grid">
          <ConnectReadwise onConnected={refresh} />
          <AddFolder onAdded={refresh} />
        </div>
      </section>

      <section className="app-section">
        <div className="app-section-head">
          <div>
            <p className="eyebrow">Sources</p>
            <h2 className="app-h2">What is connected</h2>
          </div>
        </div>

        {sources.length === 0 ? (
          <div className="state">
            <h2 className="app-h2">No sources yet.</h2>
            <p>
              Start with Readwise or a folder of notes above. Two libraries in a
              circle is all the host needs to start talking.
            </p>
          </div>
        ) : (
          <div className="card-stack">
            {sources.map((source) => (
              <SourceCard
                key={source.id}
                source={source}
                circles={circles}
                onChange={replaceSource}
                onRefresh={refresh}
              />
            ))}
          </div>
        )}

        {circles.length === 0 ? (
          <p className="app-note">
            You are not in a circle yet.{" "}
            <Link href="/new">Start one</Link> and your sources get somewhere to
            go.
          </p>
        ) : null}
      </section>

      <section className="app-section">
        <div className="app-section-head">
          <div>
            <p className="eyebrow">Items</p>
            <h2 className="app-h2">Everything you have saved</h2>
            <p>
              Hidden items stay in your library but never reach a circle, and
              the host never sees them.
            </p>
          </div>
        </div>

        <ItemList items={items} sources={sources} onChange={replaceItem} />

        {truncated ? (
          <p className="app-note">
            Showing your most recent items. Older ones are still shared with
            whichever circles their source feeds.
          </p>
        ) : null}
      </section>
    </>
  );
}
