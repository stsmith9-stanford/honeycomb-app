const STORAGE_KEY = "honeycomb-product-v1";

const themeCatalog = {
  "agentic-ai": { label: "Agentic AI", family: "systems" },
  "second-brain": { label: "Second brain", family: "knowledge" },
  friendship: { label: "Friendship", family: "social" },
  privacy: { label: "Privacy boundary", family: "trust" },
  "shared-shelf": { label: "Shared shelf", family: "social" },
  "long-form": { label: "Long-form learning", family: "knowledge" },
  "conversation-design": { label: "Conversation design", family: "social" },
  market: { label: "Power-user wedge", family: "systems" },
  rituals: { label: "Rituals", family: "social" },
  "llm-wiki": { label: "LLM wiki", family: "knowledge" },
  "ambient-context": { label: "Ambient context", family: "systems" },
  "product-demo": { label: "Product demo", family: "systems" }
};

const privacyModes = {
  themes: {
    label: "Themes only",
    body: "Only shared themes, questions, and counts leave the vault."
  },
  artifacts: {
    label: "Approved artifacts",
    body: "Approved artifact titles and public summaries are visible."
  },
  sources: {
    label: "Approved sources",
    body: "Approved artifact titles, summaries, and source labels are visible."
  }
};

const seedState = {
  activeUserId: "shawn",
  friendUserId: "yedu",
  view: "blend",
  privacyMode: "artifacts",
  draft: "",
  agentRuns: 0,
  reactions: {},
  shelf: {
    "shawn:yedu": [
      {
        id: "shelf-karpathy-llm-wiki",
        title: "Karpathy's LLM wiki movement",
        ownerId: "system",
        theme: "llm-wiki",
        status: "queued",
        note: "Read as the shared object for the M2 Honeycomb prototype."
      }
    ],
    "humzah:shawn": [],
    "humzah:yedu": []
  },
  conversations: {
    "shawn:yedu": [
      {
        id: "conv-seed-1",
        type: "text-drafted",
        text: "Honeycomb found second brain + privacy as a real overlap for us.",
        at: "May 10"
      }
    ],
    "humzah:shawn": [],
    "humzah:yedu": []
  },
  users: {
    shawn: {
      id: "shawn",
      name: "Shawn",
      role: "d.school",
      layer: "Core",
      color: "honey",
      thesis: "Agents can lower the activation energy for social connection.",
      vaultItems: [
        {
          id: "shawn-activation-energy",
          title: "Activation energy for friendship",
          kind: "Product spine",
          source: "Honeycomb RPM Plan",
          privateNote:
            "I read so much and then do not talk to anyone about it. The social value dies unless the saved idea turns into a human moment.",
          publicSummary:
            "Agents should lower the effort required to turn saved ideas into a real conversation.",
          themes: ["friendship", "conversation-design", "agentic-ai"],
          depth: 5,
          approved: true,
          suggested: true
        },
        {
          id: "shawn-private-agent-vault",
          title: "Private vault / agent vault split",
          kind: "Privacy pattern",
          source: "AI Awakening transcript",
          privateNote:
            "My personal Obsidian vault stays read-only while the agent has a separate vault where it can write, summarize, and connect.",
          publicSummary:
            "A private knowledge base can stay protected while a separate agent layer creates shareable summaries.",
          themes: ["privacy", "second-brain", "agentic-ai"],
          depth: 4,
          approved: true,
          suggested: true
        },
        {
          id: "shawn-tony-robbins-map",
          title: "Just-in-time long-form learning",
          kind: "Learning map",
          source: "Personal vault",
          privateNote:
            "Seminar transcripts become useful when they can be queried against the live situation instead of consumed linearly.",
          publicSummary:
            "Long-form archives become more useful when they can be pulled into a current conversation at the right moment.",
          themes: ["long-form", "second-brain", "agentic-ai"],
          depth: 3,
          approved: false,
          suggested: false
        },
        {
          id: "shawn-honeycomb-name",
          title: "Honeycomb as warmer frame",
          kind: "Naming note",
          source: "AI Awakening transcript",
          privateNote:
            "Hivemind is too aggressive. Honeycomb has the right visual and emotional texture.",
          publicSummary:
            "Honeycomb frames shared intelligence as tended, warm, and relationship-centered.",
          themes: ["product-demo", "friendship", "rituals"],
          depth: 2,
          approved: true,
          suggested: true
        },
        {
          id: "shawn-watering-hole",
          title: "The missing watering hole",
          kind: "Market observation",
          source: "AI Awakening transcript",
          privateNote:
            "Readwise has community energy, but not the place where two specific friends notice what they are both orbiting.",
          publicSummary:
            "Second-brain tools need a small trusted place where shared curiosities can become conversation.",
          themes: ["shared-shelf", "friendship", "market"],
          depth: 4,
          approved: false,
          suggested: false
        }
      ]
    },
    yedu: {
      id: "yedu",
      name: "Yedu",
      role: "GSB",
      layer: "Mantle",
      color: "teal",
      thesis: "Existing trust plus high-signal personal data is the wedge.",
      vaultItems: [
        {
          id: "yedu-core-mantle",
          title: "Core and mantle relationships",
          kind: "Relationship model",
          source: "Milestone 1",
          privateNote:
            "Honeycomb should deepen the 5-50 relationships where trust already exists instead of trying to match strangers.",
          publicSummary:
            "The product should focus on trusted core and mantle relationships, not broad discovery.",
          themes: ["friendship", "conversation-design", "privacy"],
          depth: 5,
          approved: true,
          suggested: true
        },
        {
          id: "yedu-high-signal-data",
          title: "High-signal personal data",
          kind: "Market wedge",
          source: "Milestone 1",
          privateNote:
            "What people read, save, annotate, and return to has more signal than generic interest tags.",
          publicSummary:
            "Saved and annotated materials are stronger signals than profile tags or location.",
          themes: ["second-brain", "market", "llm-wiki"],
          depth: 5,
          approved: true,
          suggested: true
        },
        {
          id: "yedu-three-part-problem",
          title: "Three-part Honeycomb problem",
          kind: "Product architecture",
          source: "AI Awakening transcript",
          privateNote:
            "Gather context, identify overlaps, then facilitate a human interaction without making it awkward.",
          publicSummary:
            "Honeycomb has to gather context, find the useful overlap, and hand it off into a human interaction.",
          themes: ["agentic-ai", "conversation-design", "privacy"],
          depth: 4,
          approved: true,
          suggested: true
        },
        {
          id: "yedu-twinmind-context",
          title: "Ambient context systems",
          kind: "Operator note",
          source: "Team context",
          privateNote:
            "TwinMind style memory points toward a relationship graph, but Honeycomb should stay narrow for class.",
          publicSummary:
            "Ambient context can help, but the M2 prototype should stay scoped to approved vault slices.",
          themes: ["ambient-context", "agentic-ai", "market"],
          depth: 3,
          approved: false,
          suggested: false
        },
        {
          id: "yedu-business-model",
          title: "$5-10 per pair",
          kind: "Business model",
          source: "Honeycomb RPM Plan",
          privateNote:
            "The initial business story can be a paid pair product for high-curiosity users.",
          publicSummary:
            "A pair-priced product can start with power second-brain users before expanding outward.",
          themes: ["market", "product-demo", "friendship"],
          depth: 2,
          approved: false,
          suggested: false
        }
      ]
    },
    humzah: {
      id: "humzah",
      name: "Humzah",
      role: "Public Policy",
      layer: "Core",
      color: "coral",
      thesis: "A shared shelf keeps good reads from disappearing in chat.",
      vaultItems: [
        {
          id: "humzah-shared-shelf",
          title: "Shared shelf with my wife",
          kind: "Working proof",
          source: "AI Awakening transcript",
          privateNote:
            "Long-form links in texts get lost among groceries and logistics, so a shelf gives them a place.",
          publicSummary:
            "A lightweight shared shelf can preserve long-form things that two people want to read together.",
          themes: ["shared-shelf", "friendship", "rituals"],
          depth: 5,
          approved: true,
          suggested: true
        },
        {
          id: "humzah-private-public-box",
          title: "Private box / public box",
          kind: "Privacy pattern",
          source: "AI Awakening transcript",
          privateNote:
            "A vault needs an intimate private area and a deliberately shareable public area.",
          publicSummary:
            "Users need a private box and a public box so sharing remains intentional.",
          themes: ["privacy", "second-brain", "shared-shelf"],
          depth: 4,
          approved: true,
          suggested: true
        },
        {
          id: "humzah-web-clipper",
          title: "Obsidian Web Clipper lowers capture friction",
          kind: "Capture note",
          source: "AI Awakening transcript",
          privateNote:
            "Even people who do not tend a perfect garden can throw interesting things into Obsidian now.",
          publicSummary:
            "Low-friction clipping makes the second-brain wedge bigger than hardcore gardeners.",
          themes: ["second-brain", "llm-wiki", "market"],
          depth: 3,
          approved: true,
          suggested: true
        },
        {
          id: "humzah-spotify-wrapped",
          title: "Spotify Blend as social UI",
          kind: "Demo shape",
          source: "AI Awakening transcript",
          privateNote:
            "The overlap should feel social, glanceable, and fun, not like a dashboard of graphs.",
          publicSummary:
            "The right demo shape is a Wrapped-style overlap page with a small number of useful prompts.",
          themes: ["product-demo", "conversation-design", "shared-shelf"],
          depth: 4,
          approved: true,
          suggested: true
        },
        {
          id: "humzah-karpathy-retweet",
          title: "AI product-builder credibility",
          kind: "GTM note",
          source: "AI Awakening transcript",
          privateNote:
            "A good outcome is credible AI product-builder proof, maybe even catching the LLM wiki wave.",
          publicSummary:
            "Honeycomb can be a concrete product-builder demo around the LLM wiki movement.",
          themes: ["llm-wiki", "product-demo", "market"],
          depth: 2,
          approved: false,
          suggested: false
        }
      ]
    }
  }
};

let state = loadState();

const els = {
  activeUser: document.querySelector("#active-user"),
  friendUser: document.querySelector("#friend-user"),
  privacyReadout: document.querySelector("#privacy-readout"),
  systemStats: document.querySelector("#system-stats"),
  viewTitle: document.querySelector("#view-title"),
  viewKicker: document.querySelector("#view-kicker"),
  screen: document.querySelector("#screen"),
  runAgent: document.querySelector("#run-agent"),
  exportWrap: document.querySelector("#export-wrap"),
  resetDemo: document.querySelector("#reset-demo"),
  toast: document.querySelector("#toast")
};

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return structuredClone(seedState);

  try {
    return mergeState(structuredClone(seedState), JSON.parse(saved));
  } catch {
    return structuredClone(seedState);
  }
}

function mergeState(base, saved) {
  return {
    ...base,
    ...saved,
    users: saved.users || base.users,
    shelf: { ...base.shelf, ...(saved.shelf || {}) },
    conversations: { ...base.conversations, ...(saved.conversations || {}) },
    reactions: saved.reactions || base.reactions
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function init() {
  hydratePairControls();
  attachEvents();
  render();
}

function hydratePairControls() {
  const options = Object.values(state.users)
    .map((user) => `<option value="${escapeHtml(user.id)}">${escapeHtml(user.name)} - ${escapeHtml(user.role)}</option>`)
    .join("");
  els.activeUser.innerHTML = options;
  els.friendUser.innerHTML = options;
}

function attachEvents() {
  els.activeUser.addEventListener("change", (event) => {
    state.activeUserId = event.target.value;
    if (state.activeUserId === state.friendUserId) {
      state.friendUserId = firstOtherUser(state.activeUserId);
    }
    saveAndRender();
  });

  els.friendUser.addEventListener("change", (event) => {
    state.friendUserId = event.target.value;
    if (state.friendUserId === state.activeUserId) {
      state.activeUserId = firstOtherUser(state.friendUserId);
    }
    saveAndRender();
  });

  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.view;
      saveAndRender();
    });
  });

  document.querySelectorAll("[data-privacy]").forEach((button) => {
    button.addEventListener("click", () => {
      state.privacyMode = button.dataset.privacy;
      saveAndRender();
    });
  });

  els.runAgent.addEventListener("click", runAgentScan);
  els.exportWrap.addEventListener("click", copyWrapJson);
  els.resetDemo.addEventListener("click", () => {
    state = structuredClone(seedState);
    saveAndRender();
    showToast("Demo data reset.");
  });

  els.screen.addEventListener("click", handleScreenClick);
  els.screen.addEventListener("input", handleScreenInput);
  els.screen.addEventListener("submit", handleScreenSubmit);
}

function render() {
  const active = user(state.activeUserId);
  const friend = user(state.friendUserId);
  const blend = buildBlend(active, friend);

  els.activeUser.value = active.id;
  els.friendUser.value = friend.id;
  els.privacyReadout.innerHTML = `
    <strong>${escapeHtml(privacyModes[state.privacyMode].label)}</strong>
    <span>${escapeHtml(privacyModes[state.privacyMode].body)}</span>
  `;

  document.querySelectorAll("[data-view]").forEach((button) => {
    button.setAttribute("aria-current", String(button.dataset.view === state.view));
  });
  document.querySelectorAll("[data-privacy]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.privacy === state.privacyMode));
  });

  renderSystemStats(active, friend, blend);
  renderCurrentView(active, friend, blend);
}

function renderSystemStats(active, friend, blend) {
  const activeApproved = publicItems(active).length;
  const friendApproved = publicItems(friend).length;
  const shelfCount = pairShelf(blend.key).length;
  const conversationCount = pairConversations(blend.key).length;

  els.systemStats.innerHTML = [
    ["Approved slices", `${activeApproved + friendApproved}`],
    ["Shared themes", `${blend.sharedThemes.length}`],
    ["Shelf items", `${shelfCount}`],
    ["Conversation events", `${conversationCount}`]
  ]
    .map(
      ([label, value]) => `
        <div class="stat-row">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value)}</strong>
        </div>
      `
    )
    .join("");
}

function renderCurrentView(active, friend, blend) {
  const titles = {
    blend: [`${active.name} + ${friend.name} Blend`, "Activation-energy reducer"],
    vault: [`${active.name}'s Vault Review`, "Public layer approval"],
    shelf: `${active.name} + ${friend.name} Shelf`,
    conversations: `${active.name} + ${friend.name} Conversations`
  };
  const title = titles[state.view];
  els.viewTitle.textContent = Array.isArray(title) ? title[0] : title;
  els.viewKicker.textContent = Array.isArray(title) ? title[1] : "Shared follow-through";

  if (state.view === "vault") {
    renderVaultView(active, blend);
  } else if (state.view === "shelf") {
    renderShelfView(active, friend, blend);
  } else if (state.view === "conversations") {
    renderConversationView(active, friend, blend);
  } else {
    renderBlendView(active, friend, blend);
  }
}

function renderBlendView(active, friend, blend) {
  document.documentElement.style.setProperty("--score-angle", `${blend.score * 3.6}deg`);

  els.screen.innerHTML = `
    <section class="blend-hero">
      <div class="hero-copy">
        <p class="eyebrow">This week</p>
        <h2>${escapeHtml(blend.hero)}</h2>
        <p>${escapeHtml(blend.summary)}</p>
        <div class="hero-actions">
          <button type="button" class="primary-button" data-action="use-prompt" data-prompt-index="0">Use best prompt</button>
          <button type="button" class="secondary-button" data-action="mark-talked">Mark 20-minute talk</button>
        </div>
      </div>
      <div class="blend-meter" aria-label="Blend strength">
        <div class="meter-ring"><span>${blend.score}</span></div>
        <p>${escapeHtml(blend.scoreLabel)}</p>
      </div>
    </section>

    <section class="metric-grid">
      ${metricCard("Shared themes", blend.sharedThemes.length, "Approved themes in both public slices.")}
      ${metricCard("Evidence", blend.evidence.length, "Artifact pairs backing this blend.")}
      ${metricCard("Activation", blend.activationCount, "Shelf and conversation actions for this pair.")}
      ${metricCard("Pending approval", blend.pendingCount, "Private items that could improve the blend.")}
    </section>

    <section class="section-block">
      <div class="section-heading">
        <p class="eyebrow">Overlap map</p>
        <h2>Where the vaults touch</h2>
      </div>
      <div class="hex-map">
        ${renderThemeCells(blend)}
      </div>
    </section>

    <section class="content-grid">
      <div class="section-block">
        <div class="section-heading">
          <p class="eyebrow">Three prompts</p>
          <h2>Conversation starters</h2>
        </div>
        <div class="card-list">
          ${blend.prompts.map((prompt, index) => renderPromptCard(prompt, index)).join("")}
        </div>
      </div>
      <div class="section-block">
        <div class="section-heading">
          <p class="eyebrow">One pick</p>
          <h2>Read together</h2>
        </div>
        ${renderPickCard(blend.pick)}
      </div>
    </section>

    <section class="section-block">
      <div class="section-heading">
        <p class="eyebrow">Approved public layer</p>
        <h2>Evidence Honeycomb can show</h2>
      </div>
      <div class="evidence-grid">
        ${blend.evidence.map((item) => renderEvidenceCard(item)).join("") || emptyState("No shared approved evidence yet.")}
      </div>
    </section>
  `;
}

function renderVaultView(active, blend) {
  const approvedCount = publicItems(active).length;
  const suggestedCount = active.vaultItems.filter((item) => item.suggested && !item.approved).length;

  els.screen.innerHTML = `
    <section class="workbench">
      <div class="section-heading">
        <p class="eyebrow">Public layer</p>
        <h2>${escapeHtml(approvedCount)} approved, ${escapeHtml(suggestedCount)} suggested</h2>
      </div>
      <form class="add-form" data-form="add-artifact">
        <input name="title" required placeholder="New artifact title" />
        <select name="theme" required>
          ${Object.entries(themeCatalog)
            .map(([id, theme]) => `<option value="${escapeHtml(id)}">${escapeHtml(theme.label)}</option>`)
            .join("")}
        </select>
        <input name="summary" required placeholder="Public summary" />
        <button type="submit" class="primary-button">Add approved artifact</button>
      </form>
    </section>

    <section class="vault-list">
      ${active.vaultItems.map((item) => renderVaultItem(active, item, blend)).join("")}
    </section>
  `;
}

function renderShelfView(active, friend, blend) {
  const shelf = pairShelf(blend.key);
  const recommendations = recommendedShelfItems(blend).filter(
    (item) => !shelf.some((entry) => entry.id === item.id)
  );

  els.screen.innerHTML = `
    <section class="content-grid">
      <div class="section-block">
        <div class="section-heading">
          <p class="eyebrow">Queued together</p>
          <h2>Shared shelf</h2>
        </div>
        <div class="shelf-grid">
          ${shelf.map((item) => renderShelfItem(item, blend.key)).join("") || emptyState("No shelf items yet.")}
        </div>
      </div>
      <div class="section-block">
        <div class="section-heading">
          <p class="eyebrow">Agent picks</p>
          <h2>Add next</h2>
        </div>
        <div class="recommendation-list">
          ${recommendations.map((item) => renderRecommendation(item)).join("") || emptyState("All current picks are already on the shelf.")}
        </div>
      </div>
    </section>
  `;
}

function renderConversationView(active, friend, blend) {
  const conversations = pairConversations(blend.key);
  const draft = state.draft || defaultDraft(active, friend, blend);

  els.screen.innerHTML = `
    <section class="conversation-layout">
      <div class="composer-card">
        <div class="section-heading">
          <p class="eyebrow">Nudge</p>
          <h2>Draft message</h2>
        </div>
        <textarea id="draft-message" rows="7">${escapeHtml(draft)}</textarea>
        <div class="button-row">
          <button type="button" class="primary-button" data-action="copy-draft">Copy draft</button>
          <button type="button" class="secondary-button" data-action="log-text">Mark text sent</button>
          <button type="button" class="secondary-button" data-action="use-prompt" data-prompt-index="1">Use privacy prompt</button>
        </div>
      </div>
      <div class="timeline-card">
        <div class="section-heading">
          <p class="eyebrow">Follow-through</p>
          <h2>Conversation log</h2>
        </div>
        <div class="timeline">
          ${conversations.map((event) => renderConversationEvent(event)).join("") || emptyState("No conversation events yet.")}
        </div>
      </div>
    </section>
  `;
}

function renderThemeCells(blend) {
  const cells = [
    ...blend.sharedThemes.map((theme) => ({ theme, kind: "shared" })),
    ...blend.adjacentThemes.slice(0, 4).map((theme) => ({ theme, kind: "adjacent" })),
    { theme: `${blend.active.name}'s private notes`, kind: "private" },
    { theme: `${blend.friend.name}'s private notes`, kind: "private" }
  ];

  return cells
    .map(
      (cell) => `
        <div class="hex-cell ${escapeHtml(cell.kind)}">
          <span>${escapeHtml(themeLabel(cell.theme))}</span>
        </div>
      `
    )
    .join("");
}

function renderPromptCard(prompt, index) {
  return `
    <article class="prompt-card">
      <span class="prompt-number">${index + 1}</span>
      <h3>${escapeHtml(prompt.title)}</h3>
      <p>${escapeHtml(prompt.body)}</p>
      <button type="button" class="reaction-button" data-action="use-prompt" data-prompt-index="${index}">Use</button>
    </article>
  `;
}

function renderPickCard(pick) {
  return `
    <article class="feature-card">
      <div class="feature-meta">
        <span class="pill">${escapeHtml(pick.kind)}</span>
        <span class="pill">${escapeHtml(pick.time)}</span>
      </div>
      <h3>${escapeHtml(pick.title)}</h3>
      <p>${escapeHtml(pick.note)}</p>
      <button type="button" class="primary-button" data-action="add-shelf" data-item-id="${escapeHtml(pick.id)}">Add to shelf</button>
    </article>
  `;
}

function renderEvidenceCard(item) {
  const visibleText =
    state.privacyMode === "themes"
      ? `Theme-level signal: ${themeLabel(item.theme)}`
      : state.privacyMode === "sources"
        ? `${item.summary} Source: ${item.source}.`
        : item.summary;

  return `
    <article class="artifact-card" data-accent="${escapeHtml(item.ownerColor)}">
      <div class="feature-meta">
        <span class="pill">${escapeHtml(item.ownerName)}</span>
        <span class="pill">${escapeHtml(themeLabel(item.theme))}</span>
      </div>
      <h3>${state.privacyMode === "themes" ? escapeHtml(themeLabel(item.theme)) : escapeHtml(item.title)}</h3>
      <p>${escapeHtml(visibleText)}</p>
    </article>
  `;
}

function renderVaultItem(owner, item, blend) {
  const sharedWithFriend = publicItems(blend.friend).some((friendItem) =>
    friendItem.themes.some((theme) => item.themes.includes(theme))
  );
  const status = item.approved ? "Approved" : item.suggested ? "Suggested" : "Private";

  return `
    <article class="vault-card ${item.approved ? "approved" : ""}">
      <div class="vault-main">
        <div class="feature-meta">
          <span class="pill">${escapeHtml(status)}</span>
          <span class="pill">${escapeHtml(item.kind)}</span>
          ${sharedWithFriend ? '<span class="pill hot">Helps current blend</span>' : ""}
        </div>
        <h3>${escapeHtml(item.title)}</h3>
        <p class="private-note">${escapeHtml(item.privateNote)}</p>
        <label class="field-label" for="summary-${escapeHtml(item.id)}">Public summary</label>
        <textarea id="summary-${escapeHtml(item.id)}" data-summary-id="${escapeHtml(item.id)}" rows="3">${escapeHtml(item.publicSummary)}</textarea>
        <div class="theme-row">
          ${item.themes.map((theme) => `<span class="pill">${escapeHtml(themeLabel(theme))}</span>`).join("")}
        </div>
      </div>
      <div class="vault-actions">
        <button type="button" class="primary-button" data-action="toggle-approval" data-item-id="${escapeHtml(item.id)}">
          ${item.approved ? "Set private" : "Approve public"}
        </button>
        <button type="button" class="secondary-button" data-action="bump-depth" data-item-id="${escapeHtml(item.id)}">
          Depth ${item.depth}
        </button>
      </div>
    </article>
  `;
}

function renderShelfItem(item, pairKeyValue) {
  const reactionKey = `${pairKeyValue}:${item.id}`;
  const reaction = state.reactions[reactionKey] || "none";
  const comments = item.comments || [];

  return `
    <article class="artifact-card shelf-card" data-accent="teal">
      <div class="feature-meta">
        <span class="pill">${escapeHtml(themeLabel(item.theme))}</span>
        <span class="pill">${escapeHtml(item.status)}</span>
      </div>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.note)}</p>
      <div class="reaction-strip">
        ${["curious", "discuss", "done"].map((value) => `
          <button type="button" class="reaction-button ${reaction === value ? "active" : ""}" data-action="react" data-item-id="${escapeHtml(item.id)}" data-reaction="${value}">
            ${escapeHtml(value)}
          </button>
        `).join("")}
      </div>
      <form class="comment-form" data-form="comment" data-item-id="${escapeHtml(item.id)}">
        <input name="comment" required placeholder="Add a note" />
        <button type="submit" class="secondary-button">Add</button>
      </form>
      <div class="comment-list">
        ${comments.map((comment) => `<p>${escapeHtml(comment)}</p>`).join("")}
      </div>
    </article>
  `;
}

function renderRecommendation(item) {
  return `
    <article class="recommendation-card">
      <div>
        <p class="eyebrow">${escapeHtml(themeLabel(item.theme))}</p>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.note)}</p>
      </div>
      <button type="button" class="primary-button" data-action="add-shelf" data-item-id="${escapeHtml(item.id)}">Add</button>
    </article>
  `;
}

function renderConversationEvent(event) {
  return `
    <article class="timeline-event">
      <span>${escapeHtml(event.at)}</span>
      <h3>${escapeHtml(event.type.replaceAll("-", " "))}</h3>
      <p>${escapeHtml(event.text)}</p>
    </article>
  `;
}

function metricCard(label, value, note) {
  return `
    <article class="metric-card">
      <span>${escapeHtml(String(value))}</span>
      <h3>${escapeHtml(label)}</h3>
      <p>${escapeHtml(note)}</p>
    </article>
  `;
}

function emptyState(text) {
  return `<div class="empty-state">${escapeHtml(text)}</div>`;
}

function handleScreenClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const active = user(state.activeUserId);
  const friend = user(state.friendUserId);
  const blend = buildBlend(active, friend);
  const action = button.dataset.action;

  if (action === "use-prompt") {
    const prompt = blend.prompts[Number(button.dataset.promptIndex || 0)];
    state.draft = `${friend.name}, Honeycomb found something we both keep circling: ${blend.primaryThemeLabel}. ${prompt.body}`;
    state.view = "conversations";
    saveAndRender();
    showToast("Prompt moved into the conversation draft.");
  }

  if (action === "mark-talked") {
    addConversation(blend.key, {
      type: "20-minute-talk",
      text: `${active.name} and ${friend.name} talked about ${blend.primaryThemeLabel}.`,
      at: todayLabel()
    });
    saveAndRender();
    showToast("Conversation marked.");
  }

  if (action === "add-shelf") {
    addShelfItem(blend, button.dataset.itemId);
    saveAndRender();
    showToast("Added to shared shelf.");
  }

  if (action === "toggle-approval") {
    toggleApproval(active.id, button.dataset.itemId);
    saveAndRender();
  }

  if (action === "bump-depth") {
    bumpDepth(active.id, button.dataset.itemId);
    saveAndRender();
  }

  if (action === "react") {
    const key = `${blend.key}:${button.dataset.itemId}`;
    state.reactions[key] = button.dataset.reaction;
    saveAndRender();
  }

  if (action === "copy-draft") {
    copyText(state.draft || defaultDraft(active, friend, blend));
  }

  if (action === "log-text") {
    addConversation(blend.key, {
      type: "text-sent",
      text: state.draft || defaultDraft(active, friend, blend),
      at: todayLabel()
    });
    saveAndRender();
    showToast("Text logged.");
  }
}

function handleScreenInput(event) {
  const summary = event.target.closest("[data-summary-id]");
  if (summary) {
    const item = findItem(state.activeUserId, summary.dataset.summaryId);
    item.publicSummary = summary.value;
    saveState();
  }

  if (event.target.id === "draft-message") {
    state.draft = event.target.value;
    saveState();
  }
}

function handleScreenSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const formType = form.dataset.form;
  const active = user(state.activeUserId);
  const blend = buildBlend(active, user(state.friendUserId));

  if (formType === "add-artifact") {
    const formData = new FormData(form);
    const id = `${active.id}-${Date.now()}`;
    active.vaultItems.unshift({
      id,
      title: String(formData.get("title")),
      kind: "Added artifact",
      source: "Manual demo entry",
      privateNote: String(formData.get("summary")),
      publicSummary: String(formData.get("summary")),
      themes: [String(formData.get("theme"))],
      depth: 3,
      approved: true,
      suggested: true
    });
    form.reset();
    saveAndRender();
    showToast("Artifact added to the public layer.");
  }

  if (formType === "comment") {
    const formData = new FormData(form);
    const shelfItem = pairShelf(blend.key).find((item) => item.id === form.dataset.itemId);
    shelfItem.comments = [...(shelfItem.comments || []), String(formData.get("comment"))];
    form.reset();
    saveAndRender();
  }
}

function buildBlend(active, friend) {
  const activePublic = publicItems(active);
  const friendPublic = publicItems(friend);
  const activeThemes = weightedThemes(activePublic);
  const friendThemes = weightedThemes(friendPublic);
  const sharedThemes = Object.keys(activeThemes)
    .filter((theme) => friendThemes[theme])
    .sort((a, b) => sharedWeight(b, activeThemes, friendThemes) - sharedWeight(a, activeThemes, friendThemes));
  const adjacentThemes = adjacentThemeList(activeThemes, friendThemes, sharedThemes);
  const primaryTheme = sharedThemes[0] || adjacentThemes[0] || "friendship";
  const key = pairKey(active.id, friend.id);
  const evidence = buildEvidence(active, friend, primaryTheme, sharedThemes);
  const activationCount = pairShelf(key).length + pairConversations(key).length;
  const pendingCount = [active, friend].flatMap((member) => member.vaultItems).filter((item) => !item.approved).length;
  const score = Math.min(
    99,
    36 + sharedThemes.length * 9 + evidence.length * 4 + activationCount * 5 + Math.min(8, adjacentThemes.length * 2)
  );

  return {
    key,
    active,
    friend,
    activePublic,
    friendPublic,
    sharedThemes,
    adjacentThemes,
    primaryTheme,
    primaryThemeLabel: themeLabel(primaryTheme),
    evidence,
    activationCount,
    pendingCount,
    score,
    scoreLabel: score >= 85 ? "Strong overlap" : score >= 68 ? "Ready to talk" : "Needs more public signal",
    hero: `${active.name} and ${friend.name} both keep circling ${themeLabel(primaryTheme)}.`,
    summary: `${active.name}'s public layer says "${active.thesis}" ${friend.name}'s says "${friend.thesis}" The current best handoff is a focused conversation around ${themeLabel(primaryTheme)}.`,
    prompts: buildPrompts(active, friend, primaryTheme, sharedThemes, evidence),
    pick: buildPick(active, friend, primaryTheme, evidence)
  };
}

function buildPrompts(active, friend, primaryTheme, sharedThemes, evidence) {
  const theme = themeLabel(primaryTheme);
  const secondary = themeLabel(sharedThemes[1] || "privacy");
  const anchor = evidence[0]?.title || "the thing you both saved";
  return [
    {
      title: "The live question",
      body: `What is each of us trying to understand about ${theme} right now, and where does ${anchor} change the question?`
    },
    {
      title: "The trust boundary",
      body: `What would make a ${theme} overlap feel useful instead of invasive, especially around ${secondary}?`
    },
    {
      title: "The human next step",
      body: `What is the smallest shared ritual that would turn this from saved material into a real conversation this week?`
    }
  ];
}

function buildPick(active, friend, primaryTheme, evidence) {
  const item = evidence[0];
  if (item) {
    return {
      id: `pick-${item.id}`,
      title: item.title,
      kind: item.kind,
      time: `${Math.max(15, item.depth * 7)} min`,
      theme: primaryTheme,
      note: item.summary
    };
  }

  return {
    id: `pick-${primaryTheme}`,
    title: `${themeLabel(primaryTheme)} starter`,
    kind: "Conversation object",
    time: "20 min",
    theme: primaryTheme,
    note: `Pick one approved artifact about ${themeLabel(primaryTheme)} and use it as the shared object.`
  };
}

function buildEvidence(active, friend, primaryTheme, sharedThemes) {
  const themes = sharedThemes.length ? sharedThemes : [primaryTheme];
  const items = [];

  for (const member of [active, friend]) {
    for (const item of publicItems(member)) {
      const matchedTheme = themes.find((theme) => item.themes.includes(theme));
      if (matchedTheme) {
        items.push({
          id: item.id,
          ownerId: member.id,
          ownerName: member.name,
          ownerColor: member.color,
          title: item.title,
          kind: item.kind,
          summary: item.publicSummary,
          source: item.source,
          depth: item.depth,
          theme: matchedTheme
        });
      }
    }
  }

  return items.sort((a, b) => b.depth - a.depth).slice(0, 8);
}

function recommendedShelfItems(blend) {
  const evidencePicks = blend.evidence.map((item) => ({
    id: `rec-${item.id}`,
    title: item.title,
    ownerId: item.ownerId,
    theme: item.theme,
    status: "queued",
    note: item.summary
  }));

  return [
    ...evidencePicks,
    {
      id: `rec-wrap-${blend.primaryTheme}`,
      title: `${blend.primaryThemeLabel} Honeycomb wrap`,
      ownerId: "system",
      theme: blend.primaryTheme,
      status: "queued",
      note: `A short wrap that compares ${blend.active.name}'s and ${blend.friend.name}'s approved notes.`
    }
  ].slice(0, 5);
}

function runAgentScan() {
  const active = user(state.activeUserId);
  let changed = 0;
  for (const item of active.vaultItems) {
    if (!item.suggested) {
      item.suggested = true;
      changed += 1;
    }
  }
  state.agentRuns += 1;
  saveAndRender();
  showToast(changed ? `Agent prepared ${changed} public summaries.` : "Agent scan found no new private items.");
}

function copyWrapJson() {
  const blend = buildBlend(user(state.activeUserId), user(state.friendUserId));
  const payload = {
    pair: [blend.active.name, blend.friend.name],
    score: blend.score,
    sharedThemes: blend.sharedThemes.map(themeLabel),
    prompts: blend.prompts,
    shelf: pairShelf(blend.key),
    conversations: pairConversations(blend.key)
  };
  copyText(JSON.stringify(payload, null, 2));
}

function addShelfItem(blend, itemId) {
  const shelf = pairShelf(blend.key);
  const pick = [blend.pick, ...recommendedShelfItems(blend)].find((item) => item.id === itemId);
  if (!pick || shelf.some((item) => item.id === pick.id)) return;
  shelf.unshift({ ...pick, comments: [] });
}

function addConversation(key, event) {
  pairConversations(key).unshift({ id: `conv-${Date.now()}`, ...event });
}

function toggleApproval(userId, itemId) {
  const item = findItem(userId, itemId);
  item.approved = !item.approved;
  item.suggested = true;
  showToast(item.approved ? "Artifact approved for the public layer." : "Artifact set private.");
}

function bumpDepth(userId, itemId) {
  const item = findItem(userId, itemId);
  item.depth = item.depth >= 5 ? 1 : item.depth + 1;
}

function publicItems(member) {
  return member.vaultItems.filter((item) => item.approved);
}

function weightedThemes(items) {
  return items.reduce((acc, item) => {
    for (const theme of item.themes) {
      acc[theme] = (acc[theme] || 0) + item.depth;
    }
    return acc;
  }, {});
}

function sharedWeight(theme, activeThemes, friendThemes) {
  return Math.min(activeThemes[theme], friendThemes[theme]);
}

function adjacentThemeList(activeThemes, friendThemes, sharedThemes) {
  const sharedFamilies = new Set(sharedThemes.map((theme) => themeCatalog[theme]?.family));
  return Object.keys({ ...activeThemes, ...friendThemes })
    .filter((theme) => !sharedThemes.includes(theme))
    .sort((a, b) => {
      const aBoost = sharedFamilies.has(themeCatalog[a]?.family) ? 10 : 0;
      const bBoost = sharedFamilies.has(themeCatalog[b]?.family) ? 10 : 0;
      return bBoost + (activeThemes[b] || 0) + (friendThemes[b] || 0) - (aBoost + (activeThemes[a] || 0) + (friendThemes[a] || 0));
    });
}

function defaultDraft(active, friend, blend) {
  return `${friend.name}, Honeycomb found a real overlap for us around ${blend.primaryThemeLabel}. Want to do 20 minutes this week on this prompt: ${blend.prompts[0].body}`;
}

function pairKey(a, b) {
  return [a, b].sort().join(":");
}

function pairShelf(key) {
  if (!state.shelf[key]) state.shelf[key] = [];
  return state.shelf[key];
}

function pairConversations(key) {
  if (!state.conversations[key]) state.conversations[key] = [];
  return state.conversations[key];
}

function findItem(userId, itemId) {
  return user(userId).vaultItems.find((item) => item.id === itemId);
}

function user(id) {
  return state.users[id];
}

function firstOtherUser(id) {
  return Object.keys(state.users).find((userId) => userId !== id);
}

function themeLabel(theme) {
  return themeCatalog[theme]?.label || theme;
}

function todayLabel() {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date());
}

function saveAndRender() {
  saveState();
  render();
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast("Copied to clipboard.");
  } catch {
    showToast(text);
  }
}

let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add("show");
  toastTimer = setTimeout(() => {
    els.toast.classList.remove("show");
  }, 2600);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

init();
