import type { Metadata } from "next";

import { AppHeader } from "@/components/app-header";

import "../app.css";
import { loadLibrary, type LibraryData } from "./data";
import { LibraryClient } from "./library-client";

export const metadata: Metadata = {
  title: "My library — Honeycomb",
};

// Owner-scoped reads through the session cookie; never prerender.
export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  let data: LibraryData | null = null;

  try {
    data = await loadLibrary();
  } catch {
    data = null;
  }

  return (
    <div className="app-page">
      <AppHeader />
      <main className="app-main">
        <div className="app-wrap">
          <div className="circle-head">
            <div>
              <p className="eyebrow">Your library</p>
              <h1 className="app-h1">What you are already saving.</h1>
            </div>
          </div>

          {data ? (
            <LibraryClient
              sources={data.sources}
              circles={data.circles}
              items={data.items}
              truncated={data.truncated}
            />
          ) : (
            <div className="state">
              <h2 className="app-h2">Your library would not load.</h2>
              <p>
                Something went wrong reaching the database. Reload the page — if
                it keeps happening, the connection settings are probably off.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
