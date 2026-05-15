# Honeycomb — Pattern Extraction (Pass 2)

Patterns extracted from the Mobbin sweep, organized by Honeycomb view. The
**Scales to triad?** column is the load-bearing one — many pair patterns
(split-screen diff, side-by-side avatars, two-color bars, VS framing)
break with three users. Where a pattern doesn't scale, the column says
*what would have to change*.

---

## Blend view — overlap viz, shared themes, evidence cards

| Pattern | Source apps | Why it works | Scales to triad? |
|---|---|---|---|
| **Two-name blend lockup with overlapping circles** | Spotify Blend ("Alexsmith + Sam"), Airbuds Widget compatibility arch | Names + plus sign + minimal artwork makes the artifact feel co-owned, not algorithmic. | **Yes** — extend to three names with three overlapping circles or a triangle of avatars. Spotify already does N-name lockups internally for Jam. |
| **Translucent overlapping gradient circles (set-theoretic Venn made beautiful)** | How We Feel weekly check-in (2/3/4 bubbles), Pillowtalk loader, Spotify Blend cover | Transparency itself encodes intersection. Where two bubbles meet, the color blends. | **Native triad** — How We Feel proves it at N=3 and N=4 without becoming a math diagram. Use as Mockup C's primitive. |
| **Hex triangle cell (1 large center + 3 satellites)** | NYT Spelling Bee, Elevate hex grid, Runna badges | The brand-literal honeycomb cell — 6-around-1 reduces cleanly to 3-around-1 with a central amber hex as the 3-way zone. | **Native triad** — and the only pattern that's *named after the product*. Mockup B's hero. |
| **Themes as emoji-prefixed pills, "Things in common" framing** | Peanut, Bear (#hashtag pills), mymind onboarding | Pills with leading emoji read as personality, not metadata. Header copy frames overlap as discovery. | **Yes** — N-agnostic. Each pill can carry a small N-pip badge indicating which members contributed. |
| **Per-item dual-avatar marker + "Overlap N" pill** | Beli ("2 bookmarks"), Pangea ("Overlaps with 1 person"), Discord ("+73,258 people in common") | A tiny pill quantifies shared-with-N without taking visual territory on the card. | **Yes** — the number does the work. "Shared with Yedu + Humzah" is a one-line pill. |
| **Filterable shared-list with co-presence markers** | Beli filter chips (City/Cuisine/Price) + dual-avatar marker per item | Lets users slice overlap by attribute, not by person. | **Yes** — Beli's own "Sort by: Number of friends" already implies N≥2. Filter chips work identically for triads. |
| **Per-person grouped quotes within a theme** | Particle News "7 Quotes — People" (olive blocks per speaker), Medium "Highlighted by Alex Smith" | Splits a shared theme into per-vault quote stacks, preserving attribution. | **Yes** — adds vertically: three quote blocks instead of two. The constraint is page length, not legibility. |
| **Trifold editorial columns + central amber band** | Tolan "The Relay" + Co-Star crush-report tabular Venn | Three vertical cream columns (one per user's solo context), narrow pairwise gutters between, full-width amber band at the bottom for the 3-way overlap. | **Native triad** — the layout *requires* three columns. Solves overlap legibility by spatial assignment rather than chart geometry. Mockup B body. |
| **Constellation of glowing nodes with thin edges** | Feeld "My Constellation", Tolan planet orbit, Co-Star birth chart | Nodes = users, stars = themes positioned by which zone they belong to (center = 3-way, edges = pairwise, near a node = solo). | **Native triad** — and treats members as celestial peers (no host privileging). Mockup C's primitive. |
| **Reveal-as-event arch animation** | Airbuds compatibility, Apple Music Replay, Spotify Blend reveal | Makes the result feel like an unboxing rather than a screen. | **Yes** — add a third silhouette to the arch. But avoid percentage scores in the reveal (anti-pattern, see Pass 4). |
| **Perspective toggle (You / Them)** | Tolan segmented "You / Tolan" | Lets users re-pivot the view through another participant's lens. | **Yes with caveats** — three-segment "Shawn / Yedu / Humzah" works, but the toggle implies asymmetry. Better in triad: a *highlight* affordance ("show what Yedu can see"), not a global pivot. |
| **Side-by-side compatibility-as-percentage** | Tinder Astrology element-mix pie, Hevy "STRONGER" tag | Quantifies pair compatibility per dimension. | **No** — pair-only. Three-way percentage scores are mathematically incoherent and feel like a leaderboard. **Anti-pattern for Honeycomb.** |
| **Head-to-head "VS" framing** | Hevy comparison screen | Two avatars flanking a "VS" badge. | **No** — inherently dyadic and competitive; Honeycomb is mutual exchange, not competition. Drop entirely. |

## Vault Review — agent-prepared queue, per-item + per-recipient approve/reject

| Pattern | Source apps | Why it works | Scales to triad? |
|---|---|---|---|
| **Approve-with-routing destination picker** | HEY Screener ("Yes, deliver to Imbox / The Feed / Paper Trail"), Snapchat custom story scope-at-creation | Don't just allow/deny — let the user pick *where* the approved item goes in one gesture. | **Native triad** — the destination becomes a multi-toggle of recipients: "Approve for: ☑ Yedu ☐ Humzah." This is the headline triad pattern for the queue. |
| **Per-recipient verb tier dropdown** | Notion (Can view / Can comment / Can edit / Full access, with subtitle copy), ClickUp permissions | Each recipient row has its own access verb with consequence text under it. | **Native triad** — directly maps. In triad mode every item shows "Yedu: shared • Humzah: private" with tap-to-change verb dropdowns and clear subtitle. |
| **Agent prep trail (collapsed reasoning steps)** | Manus "Research / Search / Searching images" collapsible, Twitch AutoMod queue, Workplace Flagged empty-state | Shows what the agent did *before* the user has to decide. Builds trust. | **Yes** — N-agnostic. The agent reasoning is "scanned 47 notes, surfaced this because it matches grief theme also tagged by Yedu." |
| **Three-tier visibility picker with descriptive subtitle** | Komoot ("Only me / Close friends / Anyone"), Snapchat ("Everyone / My Friends / Custom"), Sora ("Only me / People I approve / Mutuals / Everyone") | Visual radio-as-card with subtitle explaining the consequence. | **Yes with extension** — for triad, add per-relationship tiers ("Yedu: artifacts, Humzah: themes only"). The tier *labels* still work; the picker just multiplies. |
| **Composer-level audience pill (Close Friends pill)** | Instagram story composer (green-star pill at bottom), audience-as-button | Audience is a first-class control at the moment of authoring, not buried in settings. | **Yes** — in triad, the pill becomes a row of three pills (one per recipient), each tappable to toggle. |
| **Saved audience groups** | Notion Groups tab ("Founders" with members), Snapchat "My Friends, Except" | Named reusable audiences for fast reuse. | **Yes** — a saved triad ("Class crew: Shawn/Yedu/Humzah") becomes a one-tap recipient set. |
| **Per-item swipe approve/reject at scale** | Tinder right-to-like, Twitch AutoMod allow/deny | Fast triage when the queue is long. | **Yes, but use sparingly** — in triad, swipe maps onto a single recipient context. Multi-recipient items need an explicit per-recipient picker, not a swipe. |
| **Audit log of agent decisions** | Apollo for Reddit mod logs, Attio activity timeline | Chronological record of what the agent did and why. | **Yes** — N-agnostic. Add a "shared with whom" column. |
| **Trust-building empty-state copy** | Workplace ("We've flagged these posts because they might be spam..."), Twitch AutoMod | Plain English explainer of what the agent surfaces and what the user controls. | **Yes** — N-agnostic. Critical for first-run reassurance. |

## Shared Shelf — saved items, reactions, comments, multiple contributors

| Pattern | Source apps | Why it works | Scales to triad? |
|---|---|---|---|
| **Per-item contributor avatar badge** | Spotify Jam track-row avatars, Google Maps "Must visit" ("Added by Jessica Smith · Just now"), Collect boards | Tiny avatar adjacent to each item answers "who added this" at a glance. | **Yes** — N-agnostic. In triad, just shows whichever member added it. |
| **Reactions-as-pills row beneath the item** | Shelf, Fable book reviews, Airbuds, Lex | Fixed 3-5 emoji slots + "+" to add. Lighter than threaded comments; instant signal. | **Yes** — N-agnostic. Each reaction shows count + small avatar stack of who reacted. |
| **Two-name (or three-name) shelf header lockup** | Spotify "Sam + Alexsmith" Blend cover | Combined name renders the shared object as having its own identity beyond "Untitled list." | **Yes** — extend to three names with comma separator or "·" delimiter. |
| **Multi-contributor avatar stack + "+N" counter** | Dispo rolls (stacked avatars + "+67"), Pinterest collaborator pills | Compresses arbitrary number of contributors into a single glanceable badge. | **Yes** — N-agnostic. Three avatar stack without a "+N" works for Honeycomb since triad is the ceiling. |
| **Per-item suggestion / "Add Suggestion" affordance** | Hypelist ("Add Suggestion" button per item), Letterboxd list comments | Comments are a different gesture from contributions; "Suggest something for this slot" feels collaborative without arguing. | **Yes** — N-agnostic. |
| **Floating friend comment bubbles around an item** | Whering (chat bubbles around a wishlist item) | Playful collaborative annotation that scales to a few commenters. | **Yes for triad** — three comment bubbles around an item is the sweet spot; gets crowded at N>5. Perfect for Honeycomb's specific 2-3 ceiling. |
| **Shelf-as-3D-object aesthetic** | Fable "My Shelfie" (books on a wooden shelf, typography picker overlay) | Physical-object metaphor adds warmth that a flat list can't. | **Yes** — N-agnostic. The shelf is the object; contributors are who shelved each book. |
| **Per-item bookmark with editable note** | Medium reading list ("Add a note…" per entry) | Annotation as first-class affordance per saved item. | **Yes** — N-agnostic. In triad each member's note is shown stacked with attribution. |
| **Pre-built named collection templates** | Notion Groups, Canopi "Who Brings What?" template card | Reusable starting structures. | **Yes** — N-agnostic. Useful for "Trip prep shelf", "Reading list shelf", etc. |

## Conversations — draft message + send + log of past talks

| Pattern | Source apps | Why it works | Scales to triad? |
|---|---|---|---|
| **AI-drafted preview bubble with thumbs-down + send** | Beside "Draft Text" (dotted-border preview bubble), Notion AI draft with Save/Copy/Try again, Outlook suggested-reply chips | The draft is clearly "not sent yet" — distinct visual treatment. Quick reject, regenerate, or send. | **Pair-leaning, extensible to triad** — in triad, you draft to one recipient at a time (1:1 text) *or* the group thread. Show recipient as a top pill so you don't accidentally send the 1:1 draft to the group. |
| **Tone-adjust bottom sheet** | Spark Mail compose ("Rephrase / Shorten / Make friendlier"), Notion AI Adjust | Quick controls to nudge the AI draft without retyping. | **Yes** — N-agnostic. |
| **Magazine-quality serif prompt card** | stoic. "Do you get discouraged easily?", Co-Star Crush report ("Matching haircuts"), Paired pack covers | Single oversize serif question, generous margins, watermark — feels screenshot-worthy. | **Yes** — N-agnostic. Avoid the dating-app yellow-bubble look unless you want that energy explicitly. |
| **Pack-of-prompts cover + grid library** | Paired "Journeys" illustrated card grid, IRL prompt categories, Ahead pastel community cards | Prompts come in branded packs (e.g. "Re-meet your friends", "Trip debrief"). Library is a shelf, not a feed. | **Yes** — N-agnostic. Pack covers can carry a "pair / triad" badge. |
| **Group-context prompt with member answer feed inline** | Tiimo "Question of the day" (serif question + member answers + hearts), Bumble "What's it like to date you?" answer cards | Same prompt rendered three times below (one per member's response), each with attribution and reactions. | **Native triad** — directly enables "all three of us answer the same question." This is the headline triad pattern for Conversations. |
| **Pre-written message picker bubbles** | Peanut Icebreakers (red bubbles with name placeholder), Bumble prompts | Browse drafted-on-behalf-of options before sending. | **Yes** — N-agnostic. Add a recipient pill at the top. |
| **Asynchronous answer chat bubble after prompt** | Paired ("What do you remember about the first time you met?" + partner's answer bubble) | The prompt becomes the message; the partner's eventual answer becomes part of the artifact. | **Pair-leaning, fixable** — for triad, render three answer tracks (one per member). Mockup B's prompt section uses this pattern. |
| **Suggested-reply chip row above input** | Outlook ("Not at this time. Thank you." / "Thank you, I will…" chips) | Two-tap reply without typing. | **Pair-leaning** — works in 1:1 conversation logs but feels generic in group context. Use only for the 1:1 text draft surface. |
| **Conversation-log-as-journal-card with retroactive date** | Retro "Add Note" ("When did this happen?"), How We Feel entry, Clay person notes | Turns a logged in-person talk into a beautiful dateable artifact instead of a flat list. | **Yes** — N-agnostic. The "talked to" field becomes a multi-select for triad. |
| **Person Activity timeline** | Attio activity timeline (icons + relative time + collapsible change groups) | Robust per-relationship history. | **Yes** — N-agnostic. Critical for "what have we talked about lately" surface. |

---

## Cross-cutting principle: the triad changes the *kind* of UI, not just the count

A pattern that "scales to triad" usually does one of three things:

1. **Replaces a pair-coded affordance with an N-coded one** — "VS" → "with"; "compared to you" → "shared by X / Y / Z"; two-color split → multi-color band.
2. **Adds a per-recipient axis to a previously global control** — global privacy tier → per-relationship tier; global share-with → per-recipient toggle.
3. **Lets the visual encode set-theoretic structure literally** — Venn bubbles, hex triangle, constellation zones, trifold columns. These were *already* triadic forms; they just hadn't been adopted as UI.

Patterns that *don't* scale are almost always ones that picked a metaphor of duality (VS, head-to-head, percentage match, mirror, "the other side"). Honeycomb's mockups should explicitly avoid duality metaphors even in the pair view, so the pair → triad transition is just adding a third element, not switching paradigms.
