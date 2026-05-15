# Honeycomb

Local working prototype for the AI Awakening Honeycomb project.

## What works

- Three seeded users: Shawn, Yedu, and Humzah.
- Pairwise blends across any two users.
- Mutable public layer approval for each user's vault artifacts.
- Agent scan that prepares private items for public review.
- Recalculated blend scores, shared themes, prompts, and evidence.
- Privacy modes for themes, artifacts, and approved source labels.
- Shared shelf with recommendations, reactions, comments, and local persistence.
- Conversation draft, copy action, text-sent log, and 20-minute talk log.
- Copyable wrap JSON for handoff or submission notes.

## Run locally

The app is static. Open `index.html` directly or serve the folder:

```sh
python3 -m http.server 5173
```

Then visit `http://localhost:5173`.

## Storage

State persists in browser `localStorage` under `honeycomb-product-v1`.
Use `Reset demo data` in the sidebar to restore the seeded product state.

## Scope

This is still a local prototype. It does not include accounts, auth, real vault ingestion, an Obsidian plugin, or networked multi-user sync.
