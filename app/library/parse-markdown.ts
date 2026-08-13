import type { FolderItemInput } from "@/lib/types";

/*
  Client-side .md parsing. Raw files never leave the device — only the parsed
  record does (docs/SPEC.md: "Raw files never upload; only parsed item
  records").

  Rules, in order:
    title    frontmatter `title:` → first `# H1` → filename
    tags     frontmatter `tags:` (inline list, comma string, or `- ` block)
    excerpt  first 300 characters of the body after the frontmatter
*/

const FRONTMATTER = /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;
const H1 = /^#[ \t]+(.+?)[ \t]*$/m;

const MAX_TITLE = 300;
const MAX_EXTERNAL_ID = 500;
const MAX_TAGS = 20;
const MAX_TAG_LENGTH = 60;
const EXCERPT_LENGTH = 300;

export function splitFrontmatter(text: string): {
  frontmatter: string | null;
  body: string;
} {
  const match = FRONTMATTER.exec(text);
  if (!match) return { frontmatter: null, body: text };
  return { frontmatter: match[1], body: text.slice(match[0].length) };
}

function unquote(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length >= 2) {
    const first = trimmed[0];
    const last = trimmed[trimmed.length - 1];
    if ((first === '"' || first === "'") && first === last) {
      return trimmed.slice(1, -1);
    }
  }
  return trimmed;
}

/**
 * Just enough YAML for note frontmatter: top-level `key: value` pairs plus
 * `- item` blocks. Anything fancier is ignored rather than guessed at.
 */
export function parseFrontmatter(block: string): Map<string, string[]> {
  const fields = new Map<string, string[]>();
  const lines = block.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim() || /^\s/.test(line)) continue;

    const separator = line.indexOf(":");
    if (separator <= 0) continue;

    const key = line.slice(0, separator).trim().toLowerCase();
    const rest = line.slice(separator + 1).trim();

    if (rest) {
      if (rest.startsWith("[") && rest.endsWith("]")) {
        fields.set(
          key,
          rest
            .slice(1, -1)
            .split(",")
            .map(unquote)
            .filter(Boolean),
        );
      } else {
        fields.set(key, [unquote(rest)]);
      }
      continue;
    }

    // Block list: the indented `- item` lines that follow.
    const values: string[] = [];
    let cursor = index + 1;
    while (cursor < lines.length) {
      const next = lines[cursor];
      const entry = /^\s*-\s+(.*)$/.exec(next);
      if (!entry) break;
      const value = unquote(entry[1]);
      if (value) values.push(value);
      cursor += 1;
    }
    if (values.length) {
      fields.set(key, values);
      index = cursor - 1;
    }
  }

  return fields;
}

function cleanTags(values: string[] | undefined): string[] {
  if (!values) return [];
  const flat = values.flatMap((value) =>
    value.includes(",") ? value.split(",") : [value],
  );
  const seen = new Set<string>();
  const tags: string[] = [];

  for (const raw of flat) {
    const tag = raw.trim().replace(/^#/, "").slice(0, MAX_TAG_LENGTH);
    if (!tag || seen.has(tag.toLowerCase())) continue;
    seen.add(tag.toLowerCase());
    tags.push(tag);
    if (tags.length >= MAX_TAGS) break;
  }

  return tags;
}

function fileStem(relativePath: string): string {
  const name = relativePath.split("/").pop() ?? relativePath;
  return name.replace(/\.(md|markdown)$/i, "") || name;
}

function excerptFrom(body: string): string | undefined {
  const flat = body.replace(/\s+/g, " ").trim();
  if (!flat) return undefined;
  return flat.slice(0, EXCERPT_LENGTH);
}

/** Turns one markdown file into the record the API accepts. */
export function markdownToItem(
  relativePath: string,
  text: string,
  lastModified: number,
): FolderItemInput {
  const { frontmatter, body } = splitFrontmatter(text);
  const fields: Map<string, string[]> = frontmatter
    ? parseFrontmatter(frontmatter)
    : new Map();

  const frontmatterTitle = fields.get("title")?.[0]?.trim();
  const headingTitle = H1.exec(body)?.[1]?.trim();
  const title = (frontmatterTitle || headingTitle || fileStem(relativePath))
    .slice(0, MAX_TITLE)
    .trim();

  const savedAt =
    Number.isFinite(lastModified) && lastModified > 0
      ? new Date(lastModified).toISOString()
      : undefined;

  return {
    externalId: relativePath.slice(0, MAX_EXTERNAL_ID),
    title: title || fileStem(relativePath).slice(0, MAX_TITLE),
    kind: "note",
    tags: cleanTags(fields.get("tags") ?? fields.get("tag")),
    excerpt: excerptFrom(body),
    savedAt,
  };
}
