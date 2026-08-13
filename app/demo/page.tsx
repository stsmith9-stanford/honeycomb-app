import type { Metadata } from "next";
import Link from "next/link";

import { AppHeader } from "@/components/app-header";
import { PersonDot } from "@/components/person";
import { PromptCard, type PromptCardData } from "@/components/prompt-card";

import "../app.css";

export const metadata: Metadata = {
  title: "Demo circle — Honeycomb",
  description:
    "A fake circle with fake people so you can feel how the host works — no sign-up.",
};

// Fixture people match the landing page's cast and colors.
const PEOPLE = {
  allen: { name: "Allen", color: "#c95a2e" },
  shawn: { name: "Shawn", color: "#2f6a64" },
  justin: { name: "Justin", color: "#6b3aa0" },
};

const MEMBERS = [
  { ...PEOPLE.allen, items: 214 },
  { ...PEOPLE.shawn, items: 504 },
  { ...PEOPLE.justin, items: 87 },
];

const zero = { useful: 0, awkward: 0, discussed: 0, more: 0 };

const PROMPTS: PromptCardData[] = [
  {
    id: "demo-room",
    kind: "room",
    body: "The group chat needs to unpack what's going on with cyclosporiasis.",
    participants: [PEOPLE.allen, PEOPLE.shawn, PEOPLE.justin],
    evidence: [
      {
        itemId: "demo-room-1",
        why: "Allen saved four outbreak explainers this week",
        title: "What is cyclosporiasis, and why is it in the news?",
        url: null,
        author: null,
        kind: "article",
        ownerLabel: "Allen's library",
      },
      {
        itemId: "demo-room-2",
        why: "Shawn clipped the produce-recall tracker two days later",
        title: "FDA produce recall tracker, annotated",
        url: null,
        author: null,
        kind: "note",
        ownerLabel: "Shawn's library",
      },
      {
        itemId: "demo-room-3",
        why: "Justin queued the epidemiology explainer episode",
        title: "This Podcast Will Kill You: Cyclospora",
        url: null,
        author: null,
        kind: "podcast",
        ownerLabel: "Justin's library",
      },
    ],
    counts: { ...zero, useful: 2 },
    mine: [],
  },
  {
    id: "demo-intro",
    kind: "intro",
    body: "Allen and Shawn are both reading about digital hygiene. Talk about how you're managing screen time?",
    participants: [PEOPLE.allen, PEOPLE.shawn],
    evidence: [
      {
        itemId: "demo-intro-1",
        why: "Allen highlighted half of Digital Minimalism this month",
        title: "Digital Minimalism",
        url: null,
        author: "Cal Newport",
        kind: "book",
        ownerLabel: "Allen's library",
      },
      {
        itemId: "demo-intro-2",
        why: "Shawn saved a home-screen redesign note the same week",
        title: "How I redesigned my phone to stop doomscrolling",
        url: null,
        author: null,
        kind: "article",
        ownerLabel: "Shawn's library",
      },
    ],
    counts: { ...zero, useful: 1, discussed: 1 },
    mine: [],
  },
  {
    id: "demo-give",
    kind: "give",
    body: "Shawn's reading about building a business. Justin can share his thoughts on Paul Graham's essays on startups.",
    participants: [PEOPLE.shawn, PEOPLE.justin],
    evidence: [
      {
        itemId: "demo-give-1",
        why: "Shawn saved the essay itself on Tuesday",
        title: "Do Things that Don't Scale",
        url: null,
        author: "Paul Graham",
        kind: "article",
        ownerLabel: "Shawn's library",
      },
      {
        itemId: "demo-give-2",
        why: "Justin highlighted 12 PG essays last year — he has been where Shawn is headed",
        title: "Default Alive or Default Dead?",
        url: null,
        author: "Paul Graham",
        kind: "highlight",
        ownerLabel: "Justin's library",
      },
    ],
    counts: { ...zero, more: 1 },
    mine: [],
  },
];

export default function DemoPage() {
  return (
    <div className="app-page">
      <AppHeader showNav={false} />
      <main className="app-main">
        <div className="app-wrap">
          <div className="demo-banner">
            <p>
              <strong>This is a demo circle.</strong> Allen, Shawn, and Justin
              are made up — the cards, receipts, and reactions are exactly what
              a real circle sees. Click around.
            </p>
            <Link className="btn btn-primary btn-small" href="/new">
              Start a real one
            </Link>
          </div>

          <div className="circle-head">
            <div>
              <p className="eyebrow">The circle</p>
              <h1 className="app-h1">The Group Chat</h1>
            </div>
          </div>

          <div className="circle-layout">
            <section>
              <p className="blend-meta">Sunday · the weekly blend</p>
              <div className="prompt-stack">
                {PROMPTS.map((prompt) => (
                  <PromptCard key={prompt.id} prompt={prompt} demo />
                ))}
              </div>
            </section>

            <aside className="rail">
              <div className="rail-card">
                <p className="eyebrow">Who is here</p>
                <ul className="rail-list">
                  {MEMBERS.map((member) => (
                    <li className="rail-item" key={member.name}>
                      <PersonDot color={member.color} />
                      <div>
                        <div className="rail-name">{member.name}</div>
                        <p className="rail-meta">
                          {member.items} items shared here
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rail-card">
                <p className="eyebrow">How this happened</p>
                <p className="rail-meta" style={{ margin: "0 0 12px" }}>
                  Each person connected a library — Readwise or a folder of
                  notes — and chose to share it here. Once a week the host
                  reads the overlap and speaks up.
                </p>
                <Link className="btn btn-ghost btn-small" href="/#setup">
                  How the setup works
                </Link>
              </div>

              <div className="rail-card">
                <p className="eyebrow">Your turn</p>
                <p className="rail-meta" style={{ margin: "0 0 12px" }}>
                  Two to five people who already trust each other. One invite
                  link. No feed.
                </p>
                <Link className="btn btn-primary btn-small" href="/new">
                  Start a circle
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
