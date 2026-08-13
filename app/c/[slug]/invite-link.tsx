"use client";

import { useEffect, useState } from "react";

import { CopyLink } from "@/components/copy-link";

/**
 * The circle's invite link. The origin is only known for certain in the
 * browser, so the field fills in after mount when NEXT_PUBLIC_APP_URL is unset.
 */
export function InviteLink({ token }: { token: string }) {
  const configured = process.env.NEXT_PUBLIC_APP_URL;
  const [url, setUrl] = useState(
    configured ? `${configured.replace(/\/+$/, "")}/join/${token}` : "",
  );

  useEffect(() => {
    if (url) return;
    setUrl(`${window.location.origin}/join/${token}`);
  }, [token, url]);

  if (!url) return null;

  return <CopyLink url={url} />;
}
