import Link from "next/link";

import { FitSelect } from "@/components/fit-select";

import "./landing.css";

/*
  LANDING PAGE · "Your second brain, shared."

  The page lets the host do the talking: the hero is the agent speaking
  into a group chat, and the proof section is three real host lines.
  The party-host framing is the pitch — not steps, not diagrams.

  Setup is one sentence with two blanks (source, circle) — the two
  decisions a new person actually makes. No configurator grids.

  Visual language: Direction B cream editorial (per design-mockups),
  hex reserved for the brand mark.
*/

const SOURCE_OPTIONS = [
  "Readwise",
  "my Obsidian vault",
  "my podcast app",
  "my notes app",
  "wherever — I'll paste",
] as const;

const CIRCLE_OPTIONS = [
  "the group chat",
  "my book club",
  "my mastermind",
] as const;

export default function LandingPage() {
  return (
    <>
      <div className="wrap">
        <header className="topbar">
          <div className="brand">
            <svg width="26" height="28" viewBox="0 0 26 28" aria-hidden="true">
              <polygon
                points="13,1 24.5,7.5 24.5,20.5 13,27 1.5,20.5 1.5,7.5"
                fill="#d2912f"
                stroke="#b8761a"
                strokeWidth="1.5"
              />
            </svg>
            Honeycomb
          </div>
          <Link className="quiet" href="/join">
            Have an invite? Join your circle →
          </Link>
        </header>

        {/* ======================= HERO ======================= */}
        <section className="hero">
          <div>
            <p className="eyebrow">For people who save things</p>
            <h1>
              Your second brain, <em>shared.</em>
            </h1>
            <p className="lede">
              You already highlight books, save articles, and queue podcasts.
              Honeycomb reads the trail you&apos;re leaving anyway and plays host —
              noticing what your friends are circling too, and speaking up when
              there&apos;s a conversation in it.
            </p>
            <div className="cta-row">
              <Link className="btn btn-primary" href="/new">
                Start a circle
              </Link>
              <a className="btn btn-ghost" href="/prototype/index.html">
                See the working demo
              </a>
            </div>
            <p className="fine">
              You share a reviewed slice, never your vault. More below.
            </p>
          </div>

          <aside className="chat" aria-label="The host speaking in a group chat">
            <div className="head">
              <span>Sunday · 9:00 am</span>
              <span>The group chat</span>
            </div>
            <div className="host-msg">
              <div className="who">
                <svg width="13" height="14" viewBox="0 0 26 28" aria-hidden="true">
                  <polygon
                    points="13,1 24.5,7.5 24.5,20.5 13,27 1.5,20.5 1.5,7.5"
                    fill="#d2912f"
                    stroke="#b8761a"
                    strokeWidth="2"
                  />
                </svg>
                Honeycomb
              </div>
              <p className="say">
                The group chat needs to unpack what&apos;s going on with
                cyclosporiasis.
              </p>
              <p className="why">
                Why this? · Three of you saved outbreak explainers this week
              </p>
            </div>
            <div className="reply">
              <span className="dot" style={{ background: "var(--allen)" }}></span>
              <span className="name">Allen</span>
              <p className="text">
                NO WAY. I have four articles saved on this exact thing
              </p>
            </div>
            <div className="reply">
              <span className="dot" style={{ background: "var(--shawn)" }}></span>
              <span className="name">Shawn</span>
              <p className="text">
                told you it wasn&apos;t just me being paranoid about the basil
              </p>
            </div>
          </aside>
        </section>
      </div>

      {/* ======================= THE NEED ======================= */}
      <section className="deep">
        <div className="wrap">
          <p className="eyebrow">The dusty shelf problem</p>
          <h2>
            A note that never becomes a conversation is well-organized
            forgetting.
          </h2>
          <div className="need-grid">
            <div>
              <h3>You consume more than ever</h3>
              <p>
                Podcasts on the commute, articles saved for later, highlights
                piling up in Readwise, notes filed in the vault. The archive
                grows every day.
              </p>
            </div>
            <div>
              <h3>Almost none of it comes up</h3>
              <p>
                A good link dies in the group chat within a day. The rest never
                leaves your second brain at all. The shelf gets dustier.
              </p>
            </div>
            <div>
              <h3>Your people are right there</h3>
              <p>
                Two close friends can circle the same question for months —
                same podcasts, same books — and never find out.
              </p>
            </div>
          </div>
          <p className="pull">
            Honeycomb exists for the moment you discover your best friend has
            been listening to the same show all along — and the next chat gets
            better than <strong>“hey, did you see the game?”</strong>
          </p>
        </div>
      </section>

      {/* ======================= THE HOST ======================= */}
      <section>
        <div className="wrap">
          <p className="eyebrow">The host</p>
          <h2>An agent that acts like a good party host.</h2>
          <p className="host-intro">
            It doesn&apos;t feed you content and it doesn&apos;t talk to hear
            itself talk. It knows what everyone&apos;s been into lately, makes
            the introduction with a reason, and gets out of the way.
          </p>

          <div className="hostlines">
            <div className="hostline">
              <div className="virtue">
                It <b>reads the room</b>
              </div>
              <div>
                <blockquote>
                  “The group chat needs to unpack what&apos;s going on with{" "}
                  <span className="accent">cyclosporiasis</span>.”
                </blockquote>
                <p className="receipt">
                  When the whole circle orbits the same story, the host names
                  it.
                </p>
              </div>
            </div>

            <div className="hostline">
              <div className="virtue">
                It <b>makes introductions</b>
              </div>
              <div>
                <blockquote>
                  “Allen and Shawn are both reading about{" "}
                  <span className="accent">digital hygiene</span>. Talk about
                  how you&apos;re managing screen time?”
                </blockquote>
                <p className="receipt">
                  Not a match score — two people, one topic, and an opening
                  question.
                </p>
              </div>
            </div>

            <div className="hostline">
              <div className="virtue">
                It knows <b>who has something to give</b>
              </div>
              <div>
                <blockquote>
                  “Shawn&apos;s reading about building a business. Justin can
                  share his thoughts on{" "}
                  <span className="accent">Paul Graham&apos;s essays</span> on
                  startups.”
                </blockquote>
                <p className="receipt">
                  Sometimes the overlap isn&apos;t mutual — one of you is
                  already where the other is headed. The host remembers.
                </p>
              </div>
            </div>
          </div>

          <p className="host-quiet">
            And on a week with nothing worth saying, it says nothing. No
            streaks, no digest for the sake of a digest.
          </p>
        </div>
      </section>

      {/* ======================= SETUP ======================= */}
      <section className="deep" id="setup">
        <div className="wrap">
          <p className="eyebrow">The whole setup</p>
          <h2>Two decisions. The host handles the rest.</h2>

          <p className="madlib">
            My saves live in{" "}
            <FitSelect label="Where your saves live" options={SOURCE_OPTIONS} />,
            and my people are{" "}
            <FitSelect label="Your circle" options={CIRCLE_OPTIONS} />.
          </p>

          <p className="setup-after">
            That&apos;s it. One invite link brings your circle in — two to five
            people who already trust each other. From there the host reads each
            week&apos;s overlap and speaks up where you already talk.
          </p>

          <p className="setup-fine">
            Connecting a source shares nothing by itself — you review what
            leaves your device. No feed, no followers, nothing to check.
          </p>
        </div>
      </section>

      {/* ======================= PRIVACY ======================= */}
      <section className="boundary">
        <div className="wrap">
          <p className="eyebrow">The boundary</p>
          <h2>A reviewed slice, never your vault.</h2>
          <div className="boundary-grid">
            <p>
              <strong>You approve every item</strong> before it leaves your
              device. The host proposes; you decide.
            </p>
            <p>
              <strong>Each circle gets its own slice.</strong> The book club
              never sees what you share with the group chat.
            </p>
            <p>
              <strong>Unpublish any time.</strong> Leave a circle and your slice
              leaves with you.
            </p>
            <p>
              <strong>Every prompt explains itself.</strong> “Why am I seeing
              this?” always has an answer.
            </p>
          </div>
        </div>
      </section>

      {/* ======================= CLOSER ======================= */}
      <section className="closer">
        <div className="wrap">
          <p className="eyebrow">A book club for the modern era</p>
          <h2>Don&apos;t let the podcasts, books, and articles go to waste.</h2>
          <p className="sub">
            Take what you&apos;re already consuming and turn it into the
            conversations your friendships deserve.
          </p>
          <Link className="btn btn-primary" href="/new">
            Start a circle
          </Link>
        </div>
      </section>

      <div className="wrap">
        <footer>
          <span>Honeycomb — Shawn Smith · Yedu Pushpendran · Humzah Khan</span>
          <span>Built for The AI Awakening, Stanford, 2026</span>
        </footer>
      </div>
    </>
  );
}
