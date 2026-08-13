import type { Metadata } from "next";
import Link from "next/link";

import { AppHeader } from "@/components/app-header";

import "../app.css";
import { PasteInvite } from "./paste-invite";

export const metadata: Metadata = {
  title: "Join a circle — Honeycomb",
};

/**
 * Joining always happens through an invite link (`/join/[token]`), so there is
 * nothing to look up here — this page just takes the link someone sent you.
 */
export default function JoinPage() {
  return (
    <div className="app-page">
      <AppHeader showNav={false} />
      <main className="app-main app-main--center">
        <div className="app-wrap app-wrap--narrow">
          <div className="card">
            <p className="eyebrow">Have an invite?</p>
            <h1 className="app-h1">Paste the link you were sent.</h1>
            <p className="app-lede">
              Circles are invite-only. Whoever started yours can send a link —
              drop it here and it will take you to the door.
            </p>

            <PasteInvite />

            <p className="app-note">
              No link yet?{" "}
              <Link href="/new">Start a circle of your own</Link> and send the
              invite instead.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
