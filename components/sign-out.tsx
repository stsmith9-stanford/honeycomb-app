"use client";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

export function SignOut() {
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      className="app-nav-signout"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await createClient().auth.signOut();
        window.location.assign("/");
      }}
    >
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}
