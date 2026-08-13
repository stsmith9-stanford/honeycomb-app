import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";

import { AppHeader } from "@/components/app-header";
import { createClient } from "@/lib/supabase/server";

import "../../app.css";
import { JoinButton } from "./join-button";

export const metadata: Metadata = {
  title: "Join a circle — Honeycomb",
};

// The invite preview is per-token and per-viewer; never prerender it.
export const dynamic = "force-dynamic";

/** `GET /api/invites/[token]` → `{circleName, memberCount}` (docs/SPEC.md). */
type InvitePreview = {
  circleName: string;
  memberCount: number;
};

async function originFromRequest(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_APP_URL;
  if (configured) return configured.replace(/\/+$/, "");

  const headerList = await headers();
  const host =
    headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost:3000";
  const proto =
    headerList.get("x-forwarded-proto") ??
    (host.startsWith("localhost") || host.startsWith("127.0.0.1")
      ? "http"
      : "https");
  return `${proto}://${host}`;
}

async function loadInvite(token: string): Promise<InvitePreview | null> {
  try {
    const origin = await originFromRequest();
    const response = await fetch(
      `${origin}/api/invites/${encodeURIComponent(token)}`,
      { cache: "no-store" },
    );
    if (!response.ok) return null;

    const body: unknown = await response.json();
    if (typeof body !== "object" || body === null) return null;

    const record = body as Record<string, unknown>;
    const circleName =
      typeof record.circleName === "string" ? record.circleName : null;
    if (!circleName) return null;

    return {
      circleName,
      memberCount:
        typeof record.memberCount === "number" ? record.memberCount : 0,
    };
  } catch {
    return null;
  }
}

async function signedIn(): Promise<boolean> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return Boolean(user);
  } catch {
    return false;
  }
}

function memberLine(count: number): string {
  if (count <= 0) return "You would be the first one in.";
  if (count === 1) return "One person is already in.";
  return `${count} people are already in.`;
}

export default async function JoinTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const [invite, isSignedIn] = await Promise.all([loadInvite(token), signedIn()]);

  return (
    <div className="app-page">
      <AppHeader showNav={false} />
      <main className="app-main app-main--center">
        <div className="app-wrap app-wrap--narrow">
          {invite ? (
            <div className="card">
              <p className="eyebrow">You have been invited</p>
              <h1 className="app-h1">
                Join <em>{invite.circleName}</em>.
              </h1>
              <p className="app-lede">
                {memberLine(invite.memberCount)} Honeycomb reads the trail your
                circle is already leaving — highlights, saves, notes — and
                speaks up when there is a conversation in it.
              </p>

              {isSignedIn ? (
                <JoinButton token={token} circleName={invite.circleName} />
              ) : (
                <div className="btn-row">
                  <Link
                    className="btn btn-primary"
                    href={`/login?next=${encodeURIComponent(`/join/${token}`)}`}
                  >
                    Sign in to join
                  </Link>
                </div>
              )}

              <p className="app-note">
                Joining shares nothing by itself. You pick which of your sources
                feed this circle, and you can hide any item.
              </p>
            </div>
          ) : (
            <div className="card">
              <p className="eyebrow">That link did not open</p>
              <h1 className="app-h1">This invite is not working.</h1>
              <p className="app-lede">
                It may have been mistyped, or the circle may be gone. Ask
                whoever invited you to send the link again.
              </p>
              <div className="btn-row">
                <Link className="btn btn-ghost" href="/join">
                  Paste a different link
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
