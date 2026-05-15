# Honeycomb — What Not To Copy (Pass 4)

Patterns from the Mobbin sweep that look superficially relevant but would
quietly destabilize Honeycomb's three differentiators. Each entry names
the source apps, the specific affordance to avoid, the underlying reason
it conflicts with Honeycomb, and — where there's a salvageable kernel —
the reframe that keeps the idea without the baggage.

---

## 1. Dating-app gamification

**Patterns to drop:**

- **Swipe-to-approve as a primary gesture** (Tinder, Hinge, Bumble) — fast and satisfying, but encodes "decide one at a time, in or out." Honeycomb's items aren't candidates; they're parts of a shared knowledge object that needs *per-recipient* nuance, not binary triage. Twitch AutoMod "Allow / Deny" is the cleaner reference for the same gesture without the dating connotations.
- **Match percentages framed as scores** (Tinder Astrology element-mix "Fire 0% / Earth 50%", Hevy "STRONGER" tag, generic compatibility bars) — turns mutual knowledge into a leaderboard. The phrase "92% compatible" is the anti-pattern; "you've both returned to this idea five times" is the Honeycomb version of the same data.
- **Compatibility leaderboards / ranked-friend lists** — even when implicit (Apple Sports F1 rank, Strava leaderboard, Goodreads "books in common" counts shown as a single number). Honeycomb members are peers; nobody should ever appear higher or lower than anyone else.
- **Reveal-as-jackpot animation** (Airbuds compatibility arch with sparkles) — the *form* of the reveal is fine, but the slot-machine energy makes the result feel like a result rather than an invitation to talk. **Reframe:** the reveal should look like a book cover being placed on a shelf, not a card being flipped on a casino table.

**Underlying rule:** if a pattern produces a single legible number where a higher number is better, it's almost certainly an anti-pattern for Honeycomb. The "result" is supposed to be a conversation, not a score.

---

## 2. Social-media feed grammar

**Patterns to drop:**

- **Public feeds of who-shared-what** — anything that resembles Instagram/Twitter timelines: chronological, follow-shaped, viral-shaped. Honeycomb is mutual exchange between trusted peers; a feed implies audience.
- **Follower counts, like counts as social proof** — any number that says "how popular" rather than "how shared by these specific people." Letterboxd's 4,604-comment thread on a public list, Pinterest's repin counts, Goodreads' shelf-view counts.
- **Viral-share affordances** (Lex's "share to feed", Spotify's "share this Blend story", Spotify Wrapped's auto-generated screenshot card with watermarks) — these assume the artifact wants to escape the circle. Honeycomb artifacts are co-owned by 2–3 people and shouldn't have a one-tap exit to TikTok.
- **Discoverability surfaces** (Pinterest "Discover", Spotify "Made for You", Polywork Shuffle, Discord "find a server") — Honeycomb already knows who's in your blend. There's no discovery layer; there's only the existing trust circle being made legible.
- **Reaction emoji as engagement metric** — reactions on the shared shelf are fine, but the *count* of reactions shouldn't be larger than the contributors' names. Fable's per-review heart count is OK; turning that into a "most reacted" rank would not be. **Reframe:** show reactions as small avatar pips next to the emoji, not "+47" tallies.

**Underlying rule:** if a pattern makes sense in a 10,000-user context, it probably doesn't make sense in a 2–3-user context. The right surface area for Honeycomb is closer to a shared Google Doc than a public feed.

---

## 3. One-way consumption framing

**Patterns to drop:**

- **"Audience" language** (Instagram "Audience — who would you like to share your reel with?", Snapchat custom-story-with-viewer-count) — even when the picker UX is great. The word *audience* makes the recipient passive. **Reframe:** "Yedu will see…" instead of "share with audience."
- **Read receipts / view counts** (Snapchat story views, Instagram seen receipts, even Discord "read by"). Surveillance disguised as social proof. Replace with "Yedu reacted" or "Yedu replied" — actual mutual signals, not passive viewing.
- **Recommendation engines that recommend one person to another** (Polywork Shuffle, Hinge's "Most Compatible") — implies one person is the consumer of another's profile. Honeycomb's blend is a third object both people contribute *to*; the agent reads three vaults to produce one artifact, not "Yedu's vault, ranked for Shawn."
- **Influencer / patron / verified-creator badges** (Letterboxd "Patron," Twitter verified, Discord boosters) — any hierarchy among peer members. There is no Honeycomb power user.
- **"Following" relationships** as the directional unit. Honeycomb's primitive is the blend, which is inherently symmetric. Avoid any UI that asks "do you want to follow Yedu?"

**Underlying rule:** if Honeycomb were a print object, it would be a co-authored letterpress chapbook, not a magazine you subscribe to. The grammar should be co-authorship, not subscription.

---

## 4. Triad-specific anti-patterns (the load-bearing ones)

These are the most important — they're the patterns that would silently break Honeycomb at N=3 even if they work fine in pair mode.

**Patterns to drop:**

- **Host / owner / admin hierarchy in group UIs** (WhatsApp group "Admin" role tags, Discord server "Owner" badges, Apple Music collaborative-playlist "Owner" label, Splitwise group creator label, Weverse Party "Host" tier). Even one member labeled differently breaks the peer relationship. **Reframe:** if Honeycomb needs an operational primary (e.g., for billing or invite quota), keep it off the canvas entirely. Every visible affordance treats all three members equally.

- **Numbered or arbitrarily ordered member rows** (Spotify Jam "Person 1 / Person 2 / Person 3", any default-sorted member list, group chat name showing "Shawn, Yedu, Humzah" in onboarding order). Even alphabetical ordering quietly privileges whoever's first. **Reframe:** triangle layouts (three vertices, no top), radial arrangements, or order randomized per session. Wherever a list is unavoidable, vary the order by viewer or by recency-of-contribution, not by name or join date.

- **Profile-and-relationships framing** (Apple Fitness with a big central avatar + smaller activity badges in orbit, Tolan "You / Tolan" segmented toggle) — the central figure becomes the user and everyone else becomes a satellite of *that user's* experience. **Reframe:** in triad mode, the *blend* is the center, not any one member. All three members orbit the artifact, not each other.

- **Pair-coded metaphors that secretly cling on** — "VS" badges (Hevy), "side-by-side" comparisons, "split screens", two-color bars (any pair compatibility chart). These don't extend gracefully; they break when you add a third element. **Reframe:** even in the pair Mockup A, avoid duality metaphors so the pair → triad transition is just adding a third element, not switching paradigms.

- **Asymmetric privacy where one member controls visibility for others** (any group setting where an admin decides what's visible to everyone). In Honeycomb each member controls *their own* per-relationship privacy. The triad version of Snapchat's "My Story · Custom" must let three people each have three independent decisions, not one shared policy.

- **The pairwise zone treated as "leftover"** — a triad has *four* meaningful zones (one 3-way + three 2-way), not "the main one and three afterthoughts." If the UI hides the pairwise zones behind a "more" tap, the design has implicitly demoted the relationships between subsets of the triad. **Reframe:** the pairwise zones should be visually first-class (Mockup B does this with three peer satellite hexes; Mockup C does it with edge-region stars). The center zone is *more dense*, not more important.

- **"Add a third friend" CTA framed as completing a missing slot** (Yope's "anyone is missing? add 1 more friend" is great as an *invite* moment but anti-pattern if it persists after the triad is formed). Three should not feel like "two-plus-one"; the empty-slot framing is only valid before the third person joins.

**Underlying rule:** Honeycomb's three members are peers. Every triadic UI decision should be testable against the question "would this design look different if you re-ran it with the three names in a different order?" If yes, redesign.

---

## 5. Privacy theater (the subtler one)

**Patterns to drop:**

- **Global privacy settings buried in a settings page** (the standard iOS/Android model). For Honeycomb's per-relationship privacy, the controls have to live where the sharing happens — at the moment of authoring, on the item itself, or in the topbar of the active blend. Instagram's composer-level Close Friends pill is the *right* pattern; Apple's Settings → Privacy → Sharing nested deep model is the wrong one.
- **Privacy as a single toggle** (most apps' "Public / Private" switch) — too coarse for the per-recipient, per-tier model. Honeycomb has at minimum 3 tiers × 2 recipients = 6 decisions for a triad member.
- **"Trust us, the agent will be careful" empty states** — the agent prep trail (Manus collapsed reasoning, Workplace flagged-items copy) shows what the agent saw and why. Don't hide the reasoning under marketing copy.
- **One-way disclosures dressed as reciprocity** (Snapchat "Best Friends" emoji status, Goodreads "favorited by") — features that imply mutuality but actually expose one person's behavior to another without symmetric disclosure. Anything Honeycomb labels as "what the agent surfaced" should be *equally* surfaceable in both directions.

**Underlying rule:** every privacy control should be testable against the question "could the other member ship a reciprocal version of this exposure tomorrow without changing the data model?" If no, it's an asymmetric disclosure and probably needs work.

---

## 6. Final filter — the "would you screenshot this" test

A patterns rule-of-thumb for Honeycomb's specific positioning:

- If the screenshot would look *cool on a dating profile*, it's probably wrong for Honeycomb.
- If the screenshot would look *like a Wrapped-style result you'd post to Stories*, it might be wrong — but probably salvageable with copy changes (replace any percentage with a count, any "compatibility" with "you both", any singular gloating with mutual-noticing).
- If the screenshot would look *like a page out of a co-authored notebook*, you're in the right register.

The mockups in this folder were drafted against that filter. Mockup A (cream editorial pair) is the safest register; Mockup B (hex triangle + editorial body) is the brand-defining direction; Mockup C (constellation) is the most ambitious — it leans cosmic, which means the copy has to work harder to avoid astrology-app energy.

---

*Compiled from the Mobbin sweep across pair, triad, knowledge, privacy, shelf, and prompt screens. Anti-patterns are organized by what they would silently break if borrowed without modification, not by app-of-origin — because the same pattern shows up across many apps and gets a free pass in each.*
