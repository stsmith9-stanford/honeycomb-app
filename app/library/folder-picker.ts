/*
  Folder picking. The File System Access API (Chrome/Edge) gives a real folder
  handle; everywhere else falls back to `<input webkitdirectory>`. Either way
  the files stay on the device — only the parsed records are sent.

  The API is not in TypeScript's DOM lib (and `values()` needs the
  DOM.AsyncIterable lib), so the shapes we touch are declared here.
*/

type FsFileHandle = {
  kind: "file";
  name: string;
  getFile: () => Promise<File>;
};

type FsDirectoryHandle = {
  kind: "directory";
  name: string;
  values: () => AsyncIterable<FsFileHandle | FsDirectoryHandle>;
};

type DirectoryPicker = (options?: {
  mode?: "read" | "readwrite";
  id?: string;
}) => Promise<FsDirectoryHandle>;

export type PickedFile = { path: string; file: File };
export type PickedFolder = { label: string; files: PickedFile[] };

const MARKDOWN = /\.(md|markdown)$/i;

function directoryPicker(): DirectoryPicker | null {
  if (typeof window === "undefined") return null;
  const candidate = (window as unknown as { showDirectoryPicker?: DirectoryPicker })
    .showDirectoryPicker;
  return typeof candidate === "function" ? candidate : null;
}

export function supportsDirectoryPicker(): boolean {
  return directoryPicker() !== null;
}

async function collect(
  directory: FsDirectoryHandle,
  prefix: string,
  out: PickedFile[],
): Promise<void> {
  for await (const entry of directory.values()) {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.kind === "directory") {
      // Skip the dotfolders that vaults and repos are full of.
      if (entry.name.startsWith(".")) continue;
      await collect(entry, path, out);
    } else if (MARKDOWN.test(entry.name)) {
      out.push({ path, file: await entry.getFile() });
    }
  }
}

/** Returns null when the person dismisses the picker. */
export async function pickDirectory(): Promise<PickedFolder | null> {
  const picker = directoryPicker();
  if (!picker) return null;

  let handle: FsDirectoryHandle;
  try {
    handle = await picker({ mode: "read", id: "honeycomb-folder" });
  } catch {
    return null; // AbortError — nothing picked.
  }

  const files: PickedFile[] = [];
  await collect(handle, "", files);
  return { label: handle.name || "Folder", files };
}

/** The `<input type="file" webkitdirectory>` fallback. */
export function folderFromInput(list: FileList | null): PickedFolder | null {
  if (!list || list.length === 0) return null;

  const files: PickedFile[] = [];
  let label = "Folder";

  for (const file of Array.from(list)) {
    const relative = file.webkitRelativePath || file.name;
    const segments = relative.split("/");
    if (segments.length > 1) label = segments[0];
    if (segments.some((segment) => segment.startsWith("."))) continue;
    if (!MARKDOWN.test(file.name)) continue;
    // Drop the top-level folder name so ids match the picker's paths.
    const path = segments.length > 1 ? segments.slice(1).join("/") : relative;
    files.push({ path, file });
  }

  return { label, files };
}
