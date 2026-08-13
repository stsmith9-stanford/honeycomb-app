"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { safeNextPath } from "@/lib/next-path";
import { createClient } from "@/lib/supabase/client";

type Status = "idle" | "sending" | "sent";

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = safeNextPath(searchParams.get("next"));

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError(null);

    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
      const supabase = createClient();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${appUrl}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });

      if (otpError) throw otpError;
      setStatus("sent");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not send the link. Try again.",
      );
      setStatus("idle");
    }
  }

  if (status === "sent") {
    return (
      <>
        <p className="eyebrow">Check your email</p>
        <h1>The link is on its way.</h1>
        <p className="auth-sent">
          We sent a sign-in link to <strong>{email}</strong>. Open it on this
          device and you&apos;ll land right back here.
        </p>
        <p className="auth-note">
          No link after a minute? Check spam, or{" "}
          <button
            type="button"
            className="auth-linkish"
            onClick={() => setStatus("idle")}
          >
            try another address
          </button>
          .
        </p>
      </>
    );
  }

  return (
    <>
      <p className="eyebrow">Sign in</p>
      <h1>No passwords here.</h1>
      <p className="auth-lede">
        Give us your email and we&apos;ll send a link that signs you in.
      </p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div>
          <label className="auth-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="auth-input"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <button
          className="btn btn-primary"
          type="submit"
          disabled={status === "sending"}
        >
          {status === "sending" ? "Sending…" : "Send the link"}
        </button>
      </form>

      {error ? <p className="auth-error">{error}</p> : null}

      <p className="auth-note">
        New here? The same link works — signing in creates your account.
      </p>
    </>
  );
}
