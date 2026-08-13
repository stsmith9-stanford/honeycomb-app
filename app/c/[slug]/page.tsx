import type { Metadata } from "next";
import Link from "next/link";

import { AppHeader } from "@/components/app-header";
import { PersonDot } from "@/components/person";
import { PromptCard } from "@/components/prompt-card";

import "../../app.css";
import { loadCircleHome, type CircleHome } from "./data";
import { InviteLink } from "./invite-link";
import { RegenerateButton } from "./regenerate-button";

export const metadata: Metadata = {
  title: "Your circle — Honeycomb",
};

// Member-scoped reads through the session cookie; never prerender.
export const dynamic = "force-dynamic";

const TRIGGER_LABEL: Record<string, string> = {
  first: "the first blend",
  cron: "the weekly blend",
  manual: "you asked",
};

function blendLine(createdAt: string, trigger: string): string {
  const when = new Date(createdAt);
  const stamp = Number.isNaN(when.getTime())
    ? null
    : new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      }).format(when);

  const why = TRIGGER_LABEL[trigger] ?? trigger;
  return stamp ? `${stamp} · ${why}` : why;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-page">
      <AppHeader />
      <main className="app-main">
        <div className="app-wrap">{children}</div>
      </main>
    </div>
  );
}

function CircleBody({ home }: { home: CircleHome }) {
  const { circle, members, blend, prompts, inviteToken } = home;
  const withLibraries = members.filter((member) => member.itemCount > 0).length;

  return (
    <>
      <div className="circle-head">
        <div>
          <p className="eyebrow">The circle</p>
          <h1 className="app-h1">{circle.name}</h1>
        </div>
        <RegenerateButton circleId={circle.id} />
      </div>

      <div className="circle-layout">
        <section>
          {blend && prompts.length > 0 ? (
            <>
              <p className="blend-meta">
                {blendLine(blend.createdAt, blend.trigger)}
              </p>
              <div className="prompt-stack">
                {prompts.map((prompt) => (
                  <PromptCard key={prompt.id} prompt={prompt} />
                ))}
              </div>
            </>
          ) : blend ? (
            <div className="state state--quiet">
              <h2 className="app-h2">A quiet week.</h2>
              <p>
                The host read the room and had nothing worth saying. No streaks,
                no digest for the sake of a digest — it will speak up when
                something is actually there.
              </p>
              <p className="blend-meta" style={{ marginTop: 18 }}>
                Last looked {blendLine(blend.createdAt, blend.trigger)}
              </p>
            </div>
          ) : (
            <div className="state">
              <h2 className="app-h2">The host is waiting for two libraries.</h2>
              <p>
                {withLibraries === 0
                  ? "Nobody here has connected a library yet."
                  : withLibraries === 1
                    ? "One library is connected. One more and the host has something to work with."
                    : "Two libraries are connected — ask the host to take a look."}
              </p>
              <div className="btn-row">
                <Link className="btn btn-primary" href="/library">
                  Connect your library
                </Link>
              </div>
            </div>
          )}
        </section>

        <aside className="rail">
          <div className="rail-card">
            <p className="eyebrow">Who is here</p>
            <ul className="rail-list">
              {members.map((member) => (
                <li className="rail-item" key={member.id}>
                  <PersonDot color={member.color} />
                  <div>
                    <div className="rail-name">
                      {member.name}
                      {member.isYou ? " (you)" : ""}
                    </div>
                    <p
                      className={`rail-meta${member.itemCount === 0 ? " is-empty" : ""}`}
                    >
                      {member.itemCount === 0
                        ? "no library yet"
                        : `${member.itemCount} ${member.itemCount === 1 ? "item" : "items"} shared here`}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {inviteToken ? (
            <div className="rail-card">
              <p className="eyebrow">Add someone</p>
              <p className="rail-meta" style={{ margin: "0 0 12px" }}>
                Anyone with this link can join the circle.
              </p>
              <InviteLink token={inviteToken} />
            </div>
          ) : null}

          <div className="rail-card">
            <p className="eyebrow">Your side of it</p>
            <p className="rail-meta" style={{ margin: "0 0 14px" }}>
              Choose which sources feed this circle, and hide anything you would
              rather keep.
            </p>
            <Link className="btn btn-ghost btn-small" href="/library">
              Open my library
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}

export default async function CirclePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let home: CircleHome | null = null;
  let failed = false;

  try {
    const result = await loadCircleHome(slug);
    home = result.home;
  } catch {
    failed = true;
  }

  if (failed) {
    return (
      <Shell>
        <div className="state">
          <h2 className="app-h2">The circle would not load.</h2>
          <p>
            Something went wrong reaching the database. Reload the page — if it
            keeps happening, the connection settings are probably off.
          </p>
        </div>
      </Shell>
    );
  }

  if (!home) {
    return (
      <Shell>
        <div className="state">
          <h2 className="app-h2">This circle is not yours yet.</h2>
          <p>
            Either the address is wrong or you have not joined. Circles are
            invite-only — open the link someone sent you.
          </p>
          <div className="btn-row">
            <Link className="btn btn-ghost" href="/join">
              I have an invite link
            </Link>
            <Link className="btn btn-primary" href="/new">
              Start my own circle
            </Link>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <CircleBody home={home} />
    </Shell>
  );
}
