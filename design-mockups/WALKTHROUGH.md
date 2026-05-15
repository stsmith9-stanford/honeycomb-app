# Honeycomb — Design walkthrough for the team

**Audience:** Yedu, Humzah · **Time budget:** ~25 minutes including Q&A · **Goal:** Lock direction so all three of us are pulling on the same rope through May 23.

**Before you start:** open the preview server pages in a browser. The four URLs you'll cycle through:

- [DESIGN-PLAN.html](DESIGN-PLAN.html) — the main artifact, you'll spend the most time here
- [00-spec-page.html](00-spec-page.html) — the choose-against board, for "I'll show you what I ruled out"
- [03-mockup-a-pair-cream.html](03-mockup-a-pair-cream.html), [03-mockup-b-triad-hex.html](03-mockup-b-triad-hex.html), [03-mockup-c-triad-constellation.html](03-mockup-c-triad-constellation.html) — the three Blend directions
- [04-mockup-vault-review.html](04-mockup-vault-review.html), [05-mockup-shared-shelf.html](05-mockup-shared-shelf.html), [06-mockup-conversations.html](06-mockup-conversations.html) — the polished Direction B mockups for the other three views

You don't need to show every file — most of it is already embedded in the design plan as iframes. The standalone files are there for when someone asks "wait, can I see that full-size."

---

## 0. Framing (2 min)

**Open with this.** Speak it, don't read it from the screen:

> "I spent the last few days doing a deep design pass on Honeycomb. The question was specifically: *what does the visual system look like, especially the triad version, and how does it scale across all four views without becoming a math diagram?* I want to walk you through what I came up with, and at the end I have one decision I'm asking us to lock and three pieces I need from each of you."

**Don't say:** anything about the AI subagents, the screenshot tooling, the Mobbin MCP, etc. The team cares about *what shipped*, not *how it got made*. The "how" makes the design look algorithmic when it should feel decided.

---

## 1. The research approach (2 min)

**Open** [00-spec-page.html](00-spec-page.html). Scroll through it briefly while you talk.

> "I started by canvassing about 400 reference screens on Mobbin, looking specifically at: pair compatibility patterns like Spotify Blend, group-of-three patterns, knowledge tools like Notion and Tolan, granular privacy controls, collaborative shelves like Fable and Goodreads, and conversation prompt cards.
>
> The thing I was looking for is the *triadic* layout — most pair patterns silently break with three users. Side-by-side, head-to-head, VS framing, percentage match scores — all of those collapse when you add a third person. I wanted to find patterns that scale natively to three."

**Show the spec page's bottom row of Mobbin refs in the Blend section** — the How We Feel triadic Venn, the Feeld constellation, and the NYT Spelling Bee hex tiles. Those are the three apps that proved triadic forms exist in production UI.

> "I found three apps that already render three-way overlap as a natural shape: How We Feel does it with translucent gradient bubbles, Feeld does it with glowing nodes on a dark constellation field, and NYT Spelling Bee — which isn't about people at all — happens to render the literal honeycomb pattern. Those became the three visual directions I prototyped."

**Don't:** get into a tour of the spec page itself. It's research scaffolding. Move on quickly.

---

## 2. The three directions, walked through (5 min)

**Switch to the DESIGN-PLAN.html "tour" section** (or open the three direction mockups standalone if anyone wants full-screen).

For each direction, take 90 seconds: pull up the mockup, give the one-line essence, then say what's good and what's risky.

### Direction A — Cream Editorial Pair

[03-mockup-a-pair-cream.html](03-mockup-a-pair-cream.html)

> "Spotify Blend's two-name lockup, in a cream-editorial register that treats the overlap as something literary instead of algorithmic. Strong typography, per-person quote attribution under each shared theme, conversation prompts as magazine-quality cards.
>
> The good: safest, hardest to get wrong, fits the second-brain register perfectly.
>
> The risk: it's just a notes app. Nothing about the visual makes it distinctly *Honeycomb*. If you screenshot this without the wordmark, no one knows what product they're looking at."

### Direction B — Hex + Editorial Triad

[03-mockup-b-triad-hex.html](03-mockup-b-triad-hex.html)

> "A honeycomb cell. The amber center hex is what all three of you share. The three satellite hexes are what each pair shares without the third. Avatars sit at the triangle's three outer vertices — equal peers, no host.
>
> The good: the visual *is* the brand. The triadic geometry maps perfectly onto the set theory. The cell extends to all four views, which I'll show in a minute.
>
> The risk: the hex shape needs onboarding the first time. People might first read it as a puzzle tile because of Spelling Bee. Manageable with one line of copy."

### Direction C — Dark Constellation Triad

[03-mockup-c-triad-constellation.html](03-mockup-c-triad-constellation.html)

> "Three glowing peer orbs at triangle vertices on a dark field. Themes are stars positioned by who contributed — center cluster for all three, edges for pairwise, near each orb for solo. The most distinctive visually.
>
> The good: looks expensive. Treats overlap as something celestial being discovered.
>
> The risk: the dark cosmic register tilts toward astrology-app energy. Co-Star, Feeld, Tinder Astrology — that's the company it keeps. The copy has to fight hard to keep Honeycomb from feeling like a horoscope. Not impossible, but every screen costs us a fight."

**Anticipate the question:** "Can't we do A as the base and use B's hex as an accent?" Answer:

> "Yes, but then we lose the brand-defining moment. The hex isn't a decoration — it's the visual encoding of the four overlap zones. If we relegate it to a watermark, we lose what makes Direction B a *system*."

---

## 3. The decision (3 min)

**Show the decision card on DESIGN-PLAN.html.**

> "Direction B is the system for M2. Four arguments — I'll go through them quickly:"

1. **The product is named for its shape.** This is the only direction where the name and the visual are the same idea. No metaphor translation required for new users.
2. **Triadic geometry encoded as zones, not chart geometry.** A triad has exactly four overlap zones; the cell of 1 + 3 maps onto them perfectly. Alternatives either become math diagrams (Venn) or read as astrology (constellation).
3. **One primitive, four surfaces.** The hex shows up in different roles across all four views — not as decoration, but as the structural unit. I'll show this next.
4. **Cream editorial body gives the content its register.** The hex is the moment of identity; the serif typography carries the reading.

**Anticipate the question:** "Did you consider just shipping Direction A for M2 and adding the hex later?" Answer:

> "Considered it. Two reasons no. First, the team thesis ('lower the activation energy for social connection') is hard to demo without a strong visual hook — a magazine-style page about second brains doesn't *land* in 5 minutes. Second, the hex is the easier-to-implement triad solution. Getting Direction A to work for triads would actually require us to *invent* a triadic chart, because A is fundamentally pair-coded right now."

---

## 4. The four views, fast tour (6 min)

**Scroll through the DESIGN-PLAN.html tour section** — the four iframes are right there. Give each one a 90-second beat.

### Blend (the hero)

> "The hex cell is the canvas. Three avatars at the corners, four zones in the middle, theme pills below, trifold editorial columns for solo context, and a full-width amber band cataloging what all three share. That's the headline image — the screenshot we'd put on the final-presentation slide."

### Vault Review

[04-mockup-vault-review.html](04-mockup-vault-review.html)

> "When the agent surfaces a private item from your vault, you don't just approve or reject — you approve *into a zone*. There's a mini honeycomb cell on the right of each card with four tappable destinations: center for all three, or one of the three pairwise satellites. The agent suggests a zone; you confirm or override. The reasoning panel explains what made the agent flag it.
>
> What this gets us: **per-recipient privacy is structural, not a separate setting.** You don't decide 'who sees this' on one screen and 'is this approved' on another — it's one decision."

### Shared Shelf

[05-mockup-shared-shelf.html](05-mockup-shared-shelf.html)

> "Three-name lockup at the top, like a co-owned book cover. The 'essential pick' for the week is the item with the strongest all-three resonance — gets a hero amber band with a hex inside it. Below that, every saved item carries a small zone hex chip showing which pair or trio it lives in. Reactions show *who* reacted with their avatar, not just '+47.'"

### Conversations

[06-mockup-conversations.html](06-mockup-conversations.html)

> "The current prompt sits in a centered amber hex frame. Three answer cards below — one per member, color-coded with each person's accent. Past prompts use the Tiimo overlapping-avatar-pips pattern to show who answered each one. The AI-drafted text for sending to one person sits in a dashed-border preview bubble with tone-adjust controls. And at the bottom, the log of in-person talks rendered as Clay-style dated dotted-divider entries."

**Anticipate the question:** "What about the pair version of these views?" Answer:

> "Same primitive, fewer hexes. In pair mode the cell has 1 center + 1 satellite — or really, just a single big amber hex because there's only one zone. Cleanly degrades. The triad is the harder case; pair is a special case of triad."

---

## 5. What we're not doing — anti-patterns (1 min)

**Open [04-anti-patterns.md](04-anti-patterns.md) or just speak it.**

> "While I was looking through the references I made a list of things I'm explicitly *not* doing:
>
> - **No compatibility percentages.** No '92% match.' The result is a conversation, not a score.
> - **No VS framing.** No head-to-head, no side-by-side diff. Pair-coded duality breaks at three users.
> - **No host or admin badges.** Shawn, Yedu, Humzah are equal participants. Nobody is the owner of the blend.
> - **No default ordering of members.** Avatars sit at three vertices, the order rotates per session.
> - **No read receipts, view counts, or 'seen by' signals.** Surveillance disguised as social proof.
>
> The full list is in `04-anti-patterns.md` if anyone wants to push on it."

---

## 6. Distribution wedge — the Obsidian plugin (3 min)

**This is the new strategic piece that wasn't in the original M2 plan.** Frame it as an addition, not a pivot.

> "Coincidentally — and I mean coincidentally, this dropped today — Obsidian launched their new Community plugin directory. Automated reviews on every submission instead of multi-week manual queues. Public install counts. Privacy-disclosure scorecards on every plugin. They cleared a backlog of 2,300 submissions in three days.
>
> Here's why this matters for us. We've been planning to fake the vault ingestion in M2 with manual exports. But an Obsidian plugin makes ingestion native — the vault is right there, no upload, no auth, no export.
>
> And the wedge is *single-vault, not multi-vault*. Phase 1 of the plugin is just: read your vault, run the agent, export a 'blend slice file.' You send your slice to Yedu via Signal or AirDrop. Yedu pastes your slice into their plugin alongside their own vault. The Honeycomb Blend artifact renders locally for them. No sync backend. No accounts. No 'trust us with your data.'
>
> That's literally Bluetooth pairing for second brains. Every privacy primitive we already designed maps onto it cleanly — the slice file *is* the per-recipient permission tier.
>
> If we ship a v0.1 plugin in the next two weeks alongside the web prototype, the final presentation has a much harder beat: *'we shipped this, here's the install count and how many slices have been exported.'* That's a real-world atomic-success metric, not a hypothetical."

**Anticipate the question:** "Doesn't this stretch us thin for M2?" Answer:

> "Yedu, this is the question I'd want your read on. The plugin v0.1 is a stub: vault-read, agent-scan, slice-export. No blend rendering yet. I'm estimating 3–5 engineering days. If that estimate is right, we ship in parallel with the web prototype. If it's wrong, we cut the plugin and stick with the original M2 plan."

---

## 7. What I'm asking each of you to do (2 min)

This is the closer. Make it specific:

**Yedu**
> "Two things. First, an answer on the plugin question — is a 3–5 day v0.1 plausible alongside your business model 1-pager? Second, the Obsidian 'Bases' feature — Obsidian shipped a Notion-style database primitive and our shared shelf is conceptually one. If our shelf can *be* a Base, we ride the launch of a brand-new Obsidian feature. That's a 30-minute investigation if you can take it this week."

**Humzah**
> "Two things. First, your GTM 1-pager — I'd like us to position the wedge in two parts: indie second-brain users via the public plugin directory, and small teams via the private-plugin team-deployment path Obsidian announced today. Second, your customer convos this week — when you talk to second-brain users, mention the slice-export idea specifically and watch their reaction. That tells us whether the privacy story actually lands or sounds paranoid."

**Shawn (me)**
> "I'll port Direction B's visual language into the live web prototype this week — replace the current pair-only Blend with the hex triangle cell. Then I'll spin up the plugin v0.1 in parallel. Both shippable by May 22 if my estimates hold."

---

## 8. Anticipated Q&A — what people might push on

Things I'd be ready to answer:

**Q: "Why amber? Why these specific colors for each of us?"**
A: Amber is honey-bee literal. The three person colors (Shawn = warm orange, Yedu = teal, Humzah = magenta) are tertiary-spaced on the color wheel so any two combinations look distinct and equal-weight. None of us is the "primary" color.

**Q: "What if a fourth person joins later?"**
A: The cell extends to 1 center + 6 satellites (Spelling Bee's full pattern). Four members = 4 three-way zones + 6 pairwise zones. The visual primitive doesn't change. But N=4+ is a v2 problem — we explicitly scoped pair/triad for M2.

**Q: "Will this look right on mobile?"**
A: Mockups tested at 760px width. Mobile breakpoint reduces hex size proportionally, stacks the trifold body. The hex stays above the fold; reading happens in the editorial body below. Manageable but worth a real device test before the final demo.

**Q: "Doesn't the hex cell only work if you have all three people active? What about asymmetric activity?"**
A: That's a real edge case. Right now the design shows zone counts; an empty pairwise zone says "no shared notes yet" rather than vanishing. Open question: when one member's vault is much sparser than the others, do we still show their satellite at the same size, or scale by activity? Leaning toward "same size, different fill density" — peer status is in the geometry, not the data.

**Q: "Have you tested whether the agent can actually find the overlaps?"**
A: Not yet on a real triad. The web prototype demos work on a seeded dataset. Yedu and Humzah handing me real slice exports this week is the test. If the agent can't find good overlaps from a real three-vault scan, the design plan is academic.

**Q: "Why now on Obsidian?"**
A: The launch today (May 12, 2026) reset the distribution game. Automated reviews mean we can ship in days, not weeks. Public install counts give us free signal. The disclosures system makes our privacy claims structural. Most importantly: this is the moment of maximum signal-to-noise — the coding-agent flood of AI plugins hasn't fully hit yet. Six months from now we'd be one of fifty "Obsidian + AI" plugins. Today we can be the first honest second-brain-blending one.

---

## 9. Close (30 sec)

> "Three asks to leave you with:
>
> 1. Yedu: plugin v0.1 estimate + Bases investigation.
> 2. Humzah: two-wedge GTM positioning + 'slice export' question in customer convos.
> 3. All of us: I want us to leave today aligned on Direction B as the visual system and the plugin as the distribution wedge. Anything either of you wants to push on, push now — the next two weeks move fast."

---

## What to leave open vs. close

**Close on:**
- Direction B as the visual system
- Hex cell + four-zone structure as the M2 design language
- The plugin distribution path as the post-M2 GTM

**Leave open for the team to weigh in on:**
- Plugin v0.1 timeline (Yedu's call)
- Whether Bases is the shelf format (depends on investigation)
- Specific color assignments per person (low-stakes; can swap)
- Whether to soft-announce the plugin before M2 demo or wait

**Don't close on:**
- Pricing ($5–10/mo per pair was in the RPM plan — keep that as a directional placeholder, not a decision)
- Brand voice / copy register beyond "editorial" (separate conversation)
- The agent's actual implementation (LLM choice, prompt design — Yedu's domain)
