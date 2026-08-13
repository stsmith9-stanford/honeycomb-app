# Honeycomb

**Your second brain, shared.** Honeycomb takes what you're already saving —
Readwise highlights, podcast queues, folders of notes — and plays host for a
small circle of people who already trust each other: it notices what you're
all circling, and speaks up when there's a conversation in it.

**Live:** [honeycomb-sand.vercel.app](https://honeycomb-sand.vercel.app) ·
**Demo circle (no sign-up):** [/demo](https://honeycomb-sand.vercel.app/demo)

Born as the final project for Stanford's *The AI Awakening* (Econ 295 / CS 323)
by Shawn Smith, Yedu Pushpendran, and Humzah Khan.

## How it works

1. **Start a circle** and send one invite link to 2–5 people.
2. **Connect a library** — a Readwise token, or a local folder of Markdown
   notes parsed entirely in your browser. Connecting shares nothing by
   itself: you choose which circles each source feeds, and every item has a
   Hide toggle. A reviewed slice, never your vault.
3. **The host reads the overlap** — weekly, or on demand — and posts
   conversation starters with receipts: every prompt cites the actual items
   it came from, and every card takes reactions (useful / awkward /
   discussed / more like this) that feed the next blend.

## The host has no API key

The deployed app never calls an LLM. It **queues** blends, and any worker
with the shared secret completes them:

- `GET /api/host/pending` — queued blends with their full payloads
- `POST /api/host/complete` — validated results back (or a failure)

The reference worker, [`scripts/run-host.mjs`](scripts/run-host.mjs), runs
the `claude` CLI in print mode on whatever machine invokes it — a Claude
Code subscription is the only credential. Point it anywhere:

```sh
APP_URL=https://your-deployment CRON_SECRET=... node scripts/run-host.mjs --loop 300
```

Any agent runtime can own this job instead — it's a poll → generate →
post-back loop against those two endpoints. (Setting `HOST_RUNNER` unset
switches to inline Anthropic API calls with `ANTHROPIC_API_KEY`, if you'd
rather run serverless.)

## Stack

Next.js 15 (App Router) on Vercel · Supabase (Postgres, RLS, magic-link
auth) · the `claude` CLI as the default host runtime. No other services.

## Local development

Prereqs: Node 20+, Docker, the Supabase CLI.

```sh
supabase start            # local Postgres + auth + Mailpit
npm install
npm run dev
```

Point `.env.local` at the local stack (values from `supabase status`; names
in [.env.example](.env.example)). Magic-link emails land in Mailpit at
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

## Deploying your own

1. `supabase link --project-ref <ref> && supabase db push`
2. Set the env vars from `.env.example` on Vercel (`HOST_RUNNER=external`,
   no Anthropic key needed) and `vercel deploy --prod`
3. Point Supabase auth's site URL + redirect allow-list at your domain
4. Run the host worker somewhere with a `claude` login

The weekly cron (`vercel.json`) queues a blend for every eligible circle on
Sundays; the worker completes them.
