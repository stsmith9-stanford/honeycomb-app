# Honeycomb Platform — v1 Build Spec (frozen 2026-08-12)

Pilot target: Shawn's real circle (2–5 people) live ASAP. Vercel (Next.js 15
App Router, TypeScript, Tailwind v4) + Supabase (Postgres, magic-link auth,
RLS). Sharing model: **share all, hide exceptions** — connecting a source
shares its items with the circles you point it at; per-item Hide and
per-source Pause. Raw files never upload; only parsed item records.

## Product flow

1. Create a circle → get an invite link.
2. Friends open the link → magic-link sign-in → join.
3. Each member connects a library: Readwise (paste access token) and/or a
   local folder (browser folder picker, .md parsed client-side).
4. When ≥2 members have visible items, the **host** generates the first
   blend: conversation starters with receipts. Then weekly (Sun 9am PT) +
   manual regenerate.
5. More libraries → better starters + group picks (read/listen/watch together).

## Repo layout

- Next.js app at repo root (`app/`, `lib/`, `components/`).
- Static prototype moves to `prototype/` (index.html, app.js, styles.css,
  landing.html original). `design-mockups/` stays untouched.
- `supabase/migrations/0001_init.sql` is the schema source of truth.
- `docs/` — this spec + host prompt. Agents must not edit `docs/` or
  `supabase/migrations/`.

## Pages

| Route | Auth | Purpose |
|---|---|---|
| `/` | no | Landing — pixel-faithful port of `prototype/landing.html` (cream editorial, serif, hex brand mark). CTAs → `/new` and `/join` info. |
| `/new` | yes | Name a circle → creates circle + invite link → copy link screen. |
| `/join/[token]` | mixed | Circle preview (name, member count) → sign in → join → `/c/[slug]`. |
| `/c/[slug]` | member | Circle home: latest blend's prompts as host cards (body, participants, "why this?" evidence, reactions), member rail with library status, Regenerate button. |
| `/library` | yes | My sources: connect Readwise (token paste → validate → sync), add folder (File System Access API; parse .md client-side: title from frontmatter/H1/filename, tags, first 300 chars as excerpt; POST batch). Item list with Hide toggles; per-source Pause + which circles it feeds (`source_shares`). |
| `/login` | no | Magic-link email form (Supabase OTP email). |

Style: reuse the landing's design tokens exactly (`--paper #f6efe2`, `--ink
#1f1b15`, `--amber #d2912f`, etc., Iowan Old Style serif stack, sans
eyebrows). The app should feel like the landing page continued. No dark mode
in v1.

## Schema

See `supabase/migrations/0001_init.sql` (authoritative). Summary:
`profiles`, `circles`, `circle_members`, `invites`, `sources`,
`source_secrets` (service-role only), `source_shares` (source→circle),
`items` (hidden flag), `blends`, `prompts` (kind: room|intro|give|pick,
participants, evidence jsonb), `reactions` (useful|awkward|discussed|more).
RLS: members read circle-scoped rows; item visibility = source shared to
circle AND NOT hidden AND NOT paused; owners manage their own rows; secrets
have no client policies. Helper `is_circle_member(uuid)` security definer.

## API route handlers (`app/api/`)

All JSON; auth via Supabase SSR session unless noted. Service-role client
(`lib/server/admin.ts`, env `SUPABASE_SECRET_KEY`) for invite redemption,
secrets, sync, blends.

- `POST /api/circles` `{name}` → create circle (slug from name + nano
  suffix), add creator as admin, create invite (`token` = 21-char url-safe
  random, no expiry v1) → `{slug, inviteUrl}`.
- `GET /api/invites/[token]` → `{circleName, memberCount}` (no auth).
- `POST /api/invites/[token]/redeem` → join (idempotent), bump `uses` → `{slug}`.
- `POST /api/sources/readwise` `{token}` → validate via
  `GET https://readwise.io/api/v2/auth/` (204 = valid), create source +
  secret, sync inline (v1) → `{sourceId, itemCount}`.
- `POST /api/sources/[id]/sync` → owner-only; Readwise pulls:
  `GET /api/v2/export/?updatedAfter=` (books+highlights → one item per book
  with top highlight as excerpt, kind from category) and Reader
  `GET https://readwise.io/api/v3/list/?updatedAfter=` (articles etc.),
  paginate via `pageCursor`, upsert on `(source_id, external_id)`.
- `POST /api/sources/folder` `{label}` → create folder source → `{sourceId}`.
- `PUT /api/sources/[id]/items` `{items: [{externalId, title, kind, tags,
  excerpt, savedAt}]}` (≤500/batch) → owner-only bulk upsert.
- `PATCH /api/sources/[id]` `{paused?, circleIds?}` → owner-only; replaces
  `source_shares` when `circleIds` present.
- `PATCH /api/items/[id]` `{hidden}` → owner-only.
- `POST /api/circles/[id]/blend` → member-only, `{trigger: 'manual'}`;
  runs host (see below). Rate-limit: skip if a blend succeeded < 10 min ago.
- `GET /api/cron/weekly` → `Authorization: Bearer ${CRON_SECRET}`; for each
  circle with ≥2 members having visible items, run host with
  `trigger:'cron'`. `vercel.json` cron: `0 16 * * 0`.
- `POST /api/prompts/[id]/react` `{kind}` → member-only upsert.
- First-blend trigger: after source connect/sync/folder-batch, server checks
  each shared circle — if it now has ≥2 members with ≥1 visible item and no
  prior successful blend → run host with `trigger:'first'`.

## The host (`lib/host/`)

- `runBlend(circleId, trigger)`: gather members + visible items (≤120/member,
  newest first, excerpt ≤280 chars) + last 3 blends' prompts with reactions
  (suppression context) → Anthropic TS SDK `client.messages.parse()` with
  structured outputs (`zodOutputFormat(hostOutput)` from `lib/types.ts`),
  model env `HOST_MODEL` (default `claude-opus-5`), max_tokens 8000, omit
  the `thinking` param (adaptive by default on Opus 5). System prompt from
  `docs/HOST-PROMPT.md` (mirrored into `lib/host/prompt.ts` — keep in
  sync). Check `stop_reason === "refusal"` and null `parsed_output` →
  mark blend failed; otherwise insert blend + prompts rows.
- Output contract (host must return exactly):
  ```json
  {"prompts": [{"kind": "room|intro|give|pick", "body": "...",
    "participants": ["display names"], "evidence": [{"item_id": "...",
    "why": "..."}]}], "quiet": false}
  ```
  2–5 prompts; ≥1 `pick` when signal allows; `quiet: true` with empty
  prompts when there's nothing worth saying (render "quiet week" state).

## Env

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SECRET_KEY` (service role), `ANTHROPIC_API_KEY`, `HOST_MODEL`
(optional), `CRON_SECRET`, `NEXT_PUBLIC_APP_URL`. `.env.example` checked in.

## Non-goals (v1)

No Discord/email delivery, no per-item approval queue, no Obsidian plugin,
no Instapaper/Kindle/podcast/YouTube connectors (roadmap: Latchkey-powered
local agent), no embeddings/vector matching (the host reads items directly),
no mobile app, no dark mode, no payments.

## Definition of done

`npm run build` clean; e2e smoke locally against linked Supabase: create
circle → second account joins via link → connect Readwise (real token) +
folder batch → first blend generates ≥2 grounded prompts with real item
evidence → reactions persist → deployed on Vercel with cron configured.
