# Development

Internal notes for working on Honeycomb. The product story lives in the
[README](../README.md); the frozen build contract is [SPEC.md](SPEC.md) and
the host's system prompt is [HOST-PROMPT.md](HOST-PROMPT.md).

## Stack

Next.js 15 (App Router) on Vercel · Supabase (Postgres, RLS, magic-link
auth) · the `claude` CLI as the default host runtime. No other services.

## The host has no API key

The deployed app never calls an LLM. With `HOST_RUNNER=external` (the
production setting), it **queues** blends, and any worker holding the
shared secret completes them:

- `GET /api/host/pending` — queued blends with their full payloads
- `POST /api/host/complete` — validated results back (or a failure report)

Both take `Authorization: Bearer $CRON_SECRET`. The reference worker,
[`scripts/run-host.mjs`](../scripts/run-host.mjs), runs the `claude` CLI in
print mode on whatever machine invokes it — a Claude Code login is the only
credential:

```sh
APP_URL=https://<deployment> CRON_SECRET=... node scripts/run-host.mjs --loop 300
```

Any agent runtime can own this job instead — it's a poll → generate →
post-back loop against those two endpoints. Unsetting `HOST_RUNNER`
switches to inline Anthropic API calls (`ANTHROPIC_API_KEY`,
`HOST_MODEL`), if you'd rather run serverless.

The weekly Vercel cron (`vercel.json`, Sundays 9am PT) only **queues** a
blend for each eligible circle — a worker must run for prompts to appear.

## Local development

Prereqs: Node 20+, Docker, the Supabase CLI.

```sh
supabase start            # local Postgres + auth + Mailpit
npm install
npm run dev
```

Point `.env.local` at the local stack (values from `supabase status`; names
in [.env.example](../.env.example)). Magic-link emails land in Mailpit at
[localhost:54324](http://127.0.0.1:54324). Set `HOST_RUNNER=external` and
run `node scripts/run-host.mjs` to generate blends locally.

## Repo map

| Path | What |
|---|---|
| `app/` | Landing, `/demo`, auth, circles, library, API routes |
| `lib/host/` | Blend payload assembly, prompt, completion |
| `supabase/migrations/` | Schema + RLS (the source of truth) |
| `docs/SPEC.md` | The frozen v1 build spec |
| `docs/HOST-PROMPT.md` | The host's system prompt |
| `prototype/` | The original static prototype (served at `/prototype/index.html`) |
| `design-mockups/` | The Direction B design exploration |

## Deploying

1. `supabase link --project-ref <ref> && supabase db push`
2. Set the env vars from `.env.example` on Vercel (`HOST_RUNNER=external`,
   no Anthropic key needed) and `vercel deploy --prod`
3. Point Supabase auth's site URL + redirect allow-list at the domain
4. Run the host worker somewhere with a `claude` login

Gotchas learned the hard way: `vercel deploy` uploads the **local
directory**, not git — `.vercelignore` handles the local-only symlink and
directories, and its patterns must be anchored with a leading `/` (a bare
`supabase` line also matches `lib/supabase`).
