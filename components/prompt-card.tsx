"use client";

import { useState } from "react";

import { postJson } from "@/components/api";
import { BrandMark } from "@/components/brand-mark";
import { PersonDot } from "@/components/person";
import type { ItemKind, PromptKind, ReactionKind } from "@/lib/types";

export type PromptParticipant = {
  name: string;
  color: string;
};

export type PromptEvidence = {
  itemId: string;
  why: string;
  /** Null when the item is no longer visible to this circle. */
  title: string | null;
  url: string | null;
  author: string | null;
  kind: ItemKind | null;
  /** Ready-to-print possessive, e.g. "Your library" / "Allen's library". */
  ownerLabel: string | null;
};

export type PromptCardData = {
  id: string;
  kind: PromptKind;
  body: string;
  participants: PromptParticipant[];
  evidence: PromptEvidence[];
  counts: Record<ReactionKind, number>;
  mine: ReactionKind[];
};

/** What the host was doing, in the host's own voice (docs/SPEC.md prompt kinds). */
const KIND_LABEL: Record<PromptKind, string> = {
  room: "Reading the room",
  intro: "An introduction",
  give: "Someone has something to give",
  pick: "A pick for the circle",
};

const REACTIONS: { kind: ReactionKind; label: string; glyph?: string }[] = [
  { kind: "useful", label: "Useful", glyph: "♥" },
  { kind: "awkward", label: "Awkward" },
  { kind: "discussed", label: "Discussed", glyph: "✓" },
  { kind: "more", label: "More like this" },
];

export function PromptCard({
  prompt,
  demo = false,
}: {
  prompt: PromptCardData;
  /** Demo cards react locally and never touch the network. */
  demo?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [counts, setCounts] = useState(prompt.counts);
  const [mine, setMine] = useState<ReactionKind[]>(prompt.mine);
  const [pending, setPending] = useState<ReactionKind | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function react(kind: ReactionKind) {
    if (mine.includes(kind) || pending) return;

    // Optimistic: the host card should answer instantly.
    setPending(kind);
    setError(null);
    setMine((current) => [...current, kind]);
    setCounts((current) => ({ ...current, [kind]: current[kind] + 1 }));

    if (demo) {
      setPending(null);
      return;
    }

    const result = await postJson(`/api/prompts/${prompt.id}/react`, { kind });

    if (!result.ok) {
      setMine((current) => current.filter((value) => value !== kind));
      setCounts((current) => ({
        ...current,
        [kind]: Math.max(0, current[kind] - 1),
      }));
      setError(result.error);
    }

    setPending(null);
  }

  const receipts = prompt.evidence.length;

  return (
    <article className="host-card">
      <div className="who">
        <BrandMark width={13} height={14} strokeWidth={2} />
        Honeycomb
        <span className="kind">· {KIND_LABEL[prompt.kind]}</span>
      </div>

      <p className="say">{prompt.body}</p>

      {prompt.participants.length > 0 ? (
        <div className="people">
          {prompt.participants.map((person) => (
            <span className="person" key={`${prompt.id}-${person.name}`}>
              <PersonDot color={person.color} />
              {person.name}
            </span>
          ))}
        </div>
      ) : null}

      {receipts > 0 ? (
        <>
          <button
            type="button"
            className="why-toggle"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            Why this? · {receipts} {receipts === 1 ? "receipt" : "receipts"} from
            your libraries {open ? "▴" : "▾"}
          </button>

          {open ? (
            <ul className="evidence">
              {prompt.evidence.map((entry) => (
                <li key={`${prompt.id}-${entry.itemId}`}>
                  <p className="ev-title">
                    {entry.title ? (
                      entry.url ? (
                        <a
                          href={entry.url}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          {entry.title}
                        </a>
                      ) : (
                        entry.title
                      )
                    ) : (
                      <em>An item that is no longer shared with this circle</em>
                    )}
                  </p>
                  {entry.title &&
                  (entry.ownerLabel || entry.author || entry.kind) ? (
                    <p className="ev-meta">
                      {[entry.ownerLabel, entry.author, entry.kind]
                        .filter((value): value is string => Boolean(value))
                        .join(" · ")}
                    </p>
                  ) : null}
                  <p className="ev-why">{entry.why}</p>
                </li>
              ))}
            </ul>
          ) : null}
        </>
      ) : (
        <p className="why-line">Why this? · The host did not leave a receipt.</p>
      )}

      <div className="reaction-row">
        {REACTIONS.map(({ kind, label, glyph }) => {
          const isOn = mine.includes(kind);
          const count = counts[kind];
          return (
            <button
              key={kind}
              type="button"
              className="reaction"
              aria-pressed={isOn}
              disabled={isOn || pending !== null}
              onClick={() => react(kind)}
            >
              {label}
              {glyph ? ` ${glyph}` : ""}
              {count > 0 ? <span className="count">{count}</span> : null}
            </button>
          );
        })}
      </div>

      {error ? <p className="app-error">{error}</p> : null}
    </article>
  );
}
