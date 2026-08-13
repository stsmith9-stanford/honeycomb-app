"use client";

import { useEffect, useRef, useState } from "react";

/**
 * An invite link with a copy button. Falls back to selecting the text when the
 * clipboard API is unavailable (older browsers, insecure origins).
 */
export function CopyLink({ url, label }: { url: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // No clipboard permission: select the text so ⌘C still works.
      const node = codeRef.current;
      if (node) {
        const range = document.createRange();
        range.selectNodeContents(node);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      setCopied(false);
      return;
    }

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2200);
  }

  return (
    <div className="copy-field">
      <code ref={codeRef}>{url}</code>
      <button
        type="button"
        className="btn btn-ghost btn-small"
        onClick={handleCopy}
        aria-label={label ?? "Copy the invite link"}
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
