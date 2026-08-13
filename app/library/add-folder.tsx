"use client";

import { useEffect, useRef, useState } from "react";

import { postJson, putJson } from "@/components/api";
import type { FolderItemInput } from "@/lib/types";

import {
  folderFromInput,
  pickDirectory,
  supportsDirectoryPicker,
  type PickedFolder,
} from "./folder-picker";
import { markdownToItem } from "./parse-markdown";

/** `PUT /api/sources/[id]/items` accepts at most 500 records per call. */
const BATCH = 500;

/** `POST /api/sources/folder` → `{sourceId}` (docs/SPEC.md). */
type FolderSourceResponse = { sourceId?: unknown };

type Phase = "idle" | "reading" | "uploading" | "done";

export function AddFolder({ onAdded }: { onAdded: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [supported, setSupported] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSupported(supportsDirectoryPicker());
    // `webkitdirectory` is not in React's input props; set it directly.
    inputRef.current?.setAttribute("webkitdirectory", "");
  }, []);

  const busy = phase === "reading" || phase === "uploading";

  async function ingest(folder: PickedFolder) {
    if (folder.files.length === 0) {
      setError("No .md files in that folder — nothing to add.");
      setPhase("idle");
      return;
    }

    setError(null);
    setPhase("reading");

    const records: FolderItemInput[] = [];
    for (const picked of folder.files) {
      try {
        const text = await picked.file.text();
        records.push(
          markdownToItem(picked.path, text, picked.file.lastModified),
        );
      } catch {
        // One unreadable file shouldn't sink the folder.
      }
      if (records.length % 25 === 0) {
        setStatus(`Reading ${records.length} of ${folder.files.length} notes…`);
      }
    }

    if (records.length === 0) {
      setError("Those files could not be read.");
      setPhase("idle");
      return;
    }

    setPhase("uploading");
    setStatus(`Creating “${folder.label}”…`);

    const created = await postJson<FolderSourceResponse>("/api/sources/folder", {
      label: folder.label,
    });

    if (!created.ok) {
      setError(created.error);
      setStatus(null);
      setPhase("idle");
      return;
    }

    const sourceId =
      typeof created.data.sourceId === "string" ? created.data.sourceId : null;
    if (!sourceId) {
      setError("The folder was created but came back without an id.");
      setStatus(null);
      setPhase("idle");
      return;
    }

    const batches = Math.ceil(records.length / BATCH);
    for (let index = 0; index < batches; index += 1) {
      const slice = records.slice(index * BATCH, (index + 1) * BATCH);
      setStatus(`Sending batch ${index + 1} of ${batches}…`);

      const sent = await putJson(`/api/sources/${sourceId}/items`, {
        items: slice,
      });

      if (!sent.ok) {
        setError(
          `${sent.error} (${index * BATCH} of ${records.length} notes made it.)`,
        );
        setStatus(null);
        setPhase("idle");
        onAdded();
        return;
      }
    }

    setStatus(
      `Added ${records.length} ${records.length === 1 ? "note" : "notes"} from “${folder.label}”.`,
    );
    setPhase("done");
    onAdded();
  }

  async function handleChoose() {
    if (busy) return;

    if (supported) {
      const folder = await pickDirectory();
      if (!folder) return;
      await ingest(folder);
      return;
    }

    inputRef.current?.click();
  }

  async function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
    const folder = folderFromInput(event.target.files);
    event.target.value = "";
    if (!folder) return;
    await ingest(folder);
  }

  return (
    <div className="connect-card">
      <p className="eyebrow">A folder of notes</p>
      <h3 className="app-h3">Point at your vault</h3>
      <p>
        Markdown files are read in the browser — title, tags and the first few
        lines. The files themselves never leave your device.
      </p>

      <div className="btn-row">
        <button
          type="button"
          className="btn btn-primary btn-small"
          onClick={handleChoose}
          disabled={busy}
        >
          {busy ? "Working…" : "Choose a folder"}
        </button>
      </div>

      <input
        ref={inputRef}
        className="hidden-input"
        type="file"
        accept=".md,.markdown"
        multiple
        onChange={handleInput}
      />

      {error ? <p className="app-error">{error}</p> : null}
      {status && !error ? <p className="app-status">{status}</p> : null}

      <p className="app-note">
        {supported
          ? "Subfolders are included; dotfolders are skipped."
          : "Your browser will ask for the whole folder — only .md files get read."}
      </p>
    </div>
  );
}
