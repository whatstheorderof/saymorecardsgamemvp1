const cards = window.SAY_MORE_CARDS || [];
const counts = window.SAY_MORE_COUNTS || { bySet: {}, byCategory: {} };
const STORAGE_KEY = "sayMoreSessionV1";
const FOLLOW_UP_PROMPTS = [
  "What makes you say that?",
  "When did you first notice that?",
  "What part of that feels most true right now?",
  "What would help someone understand that better?",
  "How has that changed over time?",
  "What is the gentler version of that answer?",
  "What do you wish people asked after hearing that?",
];

const els = {
  totalCards: document.querySelector("#totalCards"),
  game: document.querySelector("#game"),
  startGame: document.querySelector("#startGame"),
  randomStart: document.querySelector("#randomStart"),
  datesStart: document.querySelector("#datesStart"),
  sessionMode: document.querySelector("#sessionMode"),
  sessionPack: document.querySelector("#sessionPack"),
  sessionDepth: document.querySelector("#sessionDepth"),
  sessionPlayers: document.querySelector("#sessionPlayers"),
  startSession: document.querySelector("#startSession"),
  activeCards: document.querySelector("#activeCards"),
  seenCards: document.querySelector("#seenCards"),
  modeGrid: document.querySelector("#modeGrid"),
  setFilters: document.querySelector("#setFilters"),
  depthFilters: document.querySelector("#depthFilters"),
  categoryFilters: document.querySelector("#categoryFilters"),
  cardFace: document.querySelector("#cardFace"),
  cardCategory: document.querySelector("#cardCategory"),
  cardId: document.querySelector("#cardId"),
  cardPrompt: document.querySelector("#cardPrompt"),
  cardSet: document.querySelector("#cardSet"),
  drawCard: document.querySelector("#drawCard"),
  shuffleCard: document.querySelector("#shuffleCard"),
  rouletteCard: document.querySelector("#rouletteCard"),
  previousCard: document.querySelector("#previousCard"),
  resetDeck: document.querySelector("#resetDeck"),
  copyCard: document.querySelector("#copyCard"),
  copyLink: document.querySelector("#copyLink"),
  passCard: document.querySelector("#passCard"),
  softerCard: document.querySelector("#softerCard"),
  followUpCard: document.querySelector("#followUpCard"),
  turnPlayer: document.querySelector("#turnPlayer"),
  roulettePack: document.querySelector("#roulettePack"),
  roulettePlayers: document.querySelector("#roulettePlayers"),
  roulettePanel: document.querySelector("#roulettePanel"),
  rouletteWheel: document.querySelector("#rouletteWheel"),
  spinBottle: document.querySelector("#spinBottle"),
  rouletteResult: document.querySelector("#rouletteResult"),
  sessionStatus: document.querySelector("#sessionStatus"),
  sessionPlayersSummary: document.querySelector("#sessionPlayersSummary"),
  sessionSafety: document.querySelector("#sessionSafety"),
  modeName: document.querySelector("#modeName"),
  roundCue: document.querySelector("#roundCue"),
  modeNote: document.querySelector("#modeNote"),
  historyList: document.querySelector("#historyList"),
  toast: document.querySelector("#toast"),
};

const allSets = Object.keys(counts.bySet);
const allCategories = Object.keys(counts.byCategory);
const depths = ["Low", "Medium", "High"];

const modes = [
  {
    id: "full",
    name: "Full Library",
    note: "All sets are available.",
    sets: allSets,
    categories: allCategories,
    depths,
  },
  {
    id: "roulette",
    name: "Roulette",
    note: "Let the deck choose the direction: full-library spins and pack-based turns.",
    sets: allSets,
    categories: allCategories,
    depths,
  },
  {
    id: "strangers",
    name: "Strangers",
    note: "A balanced loop from light to meaningful.",
    sets: ["Base Deck", "Community Edition"],
    categories: ["Icebreaker", "Connection", "Reflection", "Challenge", "Wildcard"],
    depths: ["Low", "Medium"],
    sequence: ["Icebreaker", "Connection", "Community Edition", "Reflection", "Challenge"],
  },
  {
    id: "deep",
    name: "Deep Dive",
    note: "Higher-trust prompts with room for follow-ups.",
    sets: ["Base Deck", "Facilitator Edition"],
    categories: ["Connection", "Reflection", "Challenge", "Wildcard", "Prompt / Rules", "Facilitator Edition"],
    depths: ["Medium", "High"],
    sequence: ["Connection", "Reflection", "Challenge", "Facilitator Edition"],
  },
  {
    id: "speed",
    name: "Speed",
    note: "Short turns and lighter prompts.",
    sets: ["Base Deck", "Community Edition"],
    categories: ["Icebreaker", "Connection", "Challenge", "Wildcard", "Community Edition"],
    depths: ["Low"],
  },
  {
    id: "paired",
    name: "Paired",
    note: "For two people playing closely.",
    sets: ["Base Deck", "Couples Edition"],
    categories: ["Icebreaker", "Connection", "Reflection", "Challenge", "Couples Edition"],
    depths: ["Low", "Medium", "High"],
    sequence: ["Icebreaker", "Connection", "Couples Edition", "Reflection"],
  },
  {
    id: "dates",
    name: "Dates",
    note: "First, second, and third date prompts.",
    sets: ["First Date", "Second Date", "Third Date", "Couples Edition"],
    categories: ["First Date", "Second Date", "Third Date", "Couples Edition"],
    depths: ["Low", "Medium", "High"],
    sequence: ["First Date", "Second Date", "Third Date"],
  },
  {
    id: "first-date",
    name: "First Date",
    note: "Meaningful small talk without making it weird.",
    sets: ["First Date"],
    categories: ["First Date"],
    depths: ["Low", "Medium", "High"],
  },
  {
    id: "second-date",
    name: "Second Date",
    note: "Realer questions for when curiosity is mutual.",
    sets: ["Second Date"],
    categories: ["Second Date"],
    depths: ["Medium", "High"],
  },
  {
    id: "third-date",
    name: "Third Date",
    note: "Honest relationship talk for clarity and pace.",
    sets: ["Third Date"],
    categories: ["Third Date"],
    depths: ["Medium", "High"],
  },
  {
    id: "friends",
    name: "Friends",
    note: "For friendships, reconnection, and chosen family.",
    sets: ["Base Deck", "Friendship Edition"],
    categories: ["Icebreaker", "Connection", "Reflection", "Challenge", "Friendship Edition"],
    depths: ["Low", "Medium", "High"],
    sequence: ["Icebreaker", "Friendship Edition", "Connection", "Reflection"],
  },
  {
    id: "on-camera",
    name: "On Camera",
    note: "For filmed conversations between people with different stories.",
    sets: ["Base Deck", "Strangers on Camera", "Community Edition", "Facilitator Edition"],
    categories: ["Icebreaker", "Connection", "Strangers on Camera", "Community Edition", "Facilitator Edition"],
    depths: ["Low", "Medium", "High"],
    sequence: ["Icebreaker", "Strangers on Camera", "Connection", "Community Edition"],
  },
  {
    id: "dinner-party",
    name: "Dinner Party",
    note: "Warm prompts for tables, hosts, and friend-of-friend rooms.",
    sets: ["Base Deck", "Dinner Party", "Community Edition"],
    categories: ["Icebreaker", "Connection", "Challenge", "Dinner Party", "Community Edition"],
    depths: ["Low", "Medium", "High"],
    sequence: ["Icebreaker", "Dinner Party", "Connection", "Challenge"],
  },
  {
    id: "best-friends",
    name: "Best Friends",
    note: "For nostalgia, repair, loyalty, and chosen family.",
    sets: ["Friendship Edition", "Best Friends"],
    categories: ["Friendship Edition", "Best Friends"],
    depths: ["Low", "Medium", "High"],
    sequence: ["Friendship Edition", "Best Friends"],
  },
  {
    id: "family-plus",
    name: "Family+",
    note: "Siblings, parents, children, and intergenerational repair.",
    sets: ["Family Edition", "Siblings", "Parent & Child"],
    categories: ["Family Edition", "Siblings", "Parent & Child"],
    depths: ["Low", "Medium", "High"],
    sequence: ["Family Edition", "Siblings", "Parent & Child"],
  },
  {
    id: "young-adults",
    name: "Young Adults",
    note: "Identity, pressure, belonging, becoming, and social life.",
    sets: ["Teens & Young Adults", "Friendship Edition", "Community Edition"],
    categories: ["Teens & Young Adults", "Friendship Edition", "Community Edition"],
    depths: ["Low", "Medium", "High"],
    sequence: ["Teens & Young Adults", "Friendship Edition", "Community Edition"],
  },
  {
    id: "transitions",
    name: "Transitions",
    note: "For breakups, moves, new chapters, grief, and growth.",
    sets: ["Life Transitions", "Self-Discovery", "Base Deck"],
    categories: ["Life Transitions", "Self-Discovery", "Reflection", "Connection"],
    depths: ["Low", "Medium", "High"],
    sequence: ["Life Transitions", "Reflection", "Self-Discovery", "Connection"],
  },
  {
    id: "healing",
    name: "Healing",
    note: "Gentle reflection for repair, care, and self-compassion.",
    sets: ["Healing Edition", "Self-Discovery", "Base Deck"],
    categories: ["Healing Edition", "Self-Discovery", "Reflection", "Connection"],
    depths: ["Low", "Medium", "High"],
    sequence: ["Healing Edition", "Self-Discovery", "Reflection", "Connection"],
  },
  {
    id: "self",
    name: "Self",
    note: "Solo-friendly self-discovery and reflective group prompts.",
    sets: ["Self-Discovery", "Base Deck"],
    categories: ["Self-Discovery", "Reflection", "Connection"],
    depths: ["Low", "Medium", "High"],
    sequence: ["Self-Discovery", "Reflection", "Connection"],
  },
  {
    id: "after-dark",
    name: "After Dark",
    note: "Late-night honesty for trusted rooms.",
    sets: ["After Dark", "Base Deck"],
    categories: ["After Dark", "Connection", "Reflection", "Challenge"],
    depths: ["Medium", "High"],
    sequence: ["Connection", "After Dark", "Reflection", "Challenge"],
  },
  {
    id: "creative",
    name: "Creative",
    note: "For artists, founders, collaborators, and dreamers.",
    sets: ["Creative Minds", "Base Deck"],
    categories: ["Creative Minds", "Connection", "Reflection", "Challenge"],
    depths: ["Low", "Medium", "High"],
    sequence: ["Creative Minds", "Connection", "Reflection", "Challenge"],
  },
  {
    id: "teams",
    name: "Teams",
    note: "For work rooms, offsites, and creative teams.",
    sets: ["Base Deck", "Teams Edition", "Facilitator Edition"],
    categories: ["Icebreaker", "Connection", "Challenge", "Teams Edition", "Facilitator Edition"],
    depths: ["Low", "Medium", "High"],
    sequence: ["Icebreaker", "Teams Edition", "Connection", "Challenge"],
  },
  {
    id: "family",
    name: "Family",
    note: "For intergenerational stories and repair.",
    sets: ["Base Deck", "Family Edition"],
    categories: ["Icebreaker", "Connection", "Reflection", "Challenge", "Family Edition"],
    depths: ["Low", "Medium", "High"],
    sequence: ["Icebreaker", "Family Edition", "Connection", "Reflection"],
  },
  {
    id: "community",
    name: "Community",
    note: "For strangers, neighbors, campuses, and groups.",
    sets: ["Base Deck", "Community Edition", "Facilitator Edition"],
    categories: ["Icebreaker", "Connection", "Challenge", "Community Edition", "Facilitator Edition"],
    depths: ["Low", "Medium", "High"],
    sequence: ["Icebreaker", "Community Edition", "Connection", "Challenge"],
  },
];

const state = {
  mode: modes[0],
  selectedSets: new Set(modes[0].sets),
  selectedCategories: new Set(modes[0].categories),
  selectedDepths: new Set(modes[0].depths),
  seen: new Set(),
  history: [],
  current: null,
  currentPlayer: "",
  players: [],
  playerIndex: 0,
  sequenceIndex: 0,
  isShuffling: false,
  rouletteAngle: -28,
};

function cleanClass(value) {
  return value.replace(/[^a-z0-9]/gi, "");
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => els.toast.classList.remove("show"), 1500);
}

function parsePlayers(value) {
  return value
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);
}

function modeById(id) {
  return modes.find((mode) => mode.id === id) || modes[0];
}

function nextPlayer() {
  if (!state.players.length) return "";
  const player = state.players[state.playerIndex % state.players.length];
  state.playerIndex = (state.playerIndex + 1) % state.players.length;
  return player;
}

function cardsForSet(set) {
  return cards.filter((card) => card.set === set);
}

function categoriesForSet(set) {
  return [...new Set(cardsForSet(set).map((card) => card.category))];
}

function saveSession() {
  const payload = {
    modeId: state.mode.id,
    selectedSets: [...state.selectedSets],
    selectedCategories: [...state.selectedCategories],
    selectedDepths: [...state.selectedDepths],
    seen: [...state.seen],
    history: state.history.map((card) => card.id),
    currentId: state.current?.id || "",
    currentPlayer: state.currentPlayer,
    players: state.players,
    playerIndex: state.playerIndex,
    roulettePlayers: els.roulettePlayers.value,
    roulettePack: els.roulettePack.value,
  };
  try {
    window.localStorage?.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Local storage is optional; the game remains playable without it.
  }
}

function restoreSession() {
  try {
    const raw = window.localStorage?.getItem(STORAGE_KEY);
    if (!raw) return false;
    const saved = JSON.parse(raw);
    state.mode = modeById(saved.modeId);
    state.selectedSets = new Set(saved.selectedSets?.filter((set) => allSets.includes(set)) || state.mode.sets);
    state.selectedCategories = new Set(
      saved.selectedCategories?.filter((category) => allCategories.includes(category)) || state.mode.categories,
    );
    state.selectedDepths = new Set(saved.selectedDepths?.filter((depth) => depths.includes(depth)) || state.mode.depths);
    state.seen = new Set(saved.seen?.filter((id) => cards.some((card) => card.id === id)) || []);
    state.history = (saved.history || []).map((id) => cards.find((card) => card.id === id)).filter(Boolean);
    state.current = cards.find((card) => card.id === saved.currentId) || null;
    state.currentPlayer = saved.currentPlayer || "";
    state.players = Array.isArray(saved.players) ? saved.players.filter(Boolean) : [];
    state.playerIndex = Number.isInteger(saved.playerIndex) ? saved.playerIndex : 0;
    if (saved.roulettePlayers) els.roulettePlayers.value = saved.roulettePlayers;
    if (saved.roulettePack && allSets.includes(saved.roulettePack)) els.roulettePack.value = saved.roulettePack;
    if (state.players.length) els.sessionPlayers.value = state.players.join(", ");
    els.sessionMode.value = state.mode.id;
    els.sessionDepth.value = depthChoiceFromSet(state.selectedDepths);
    els.sessionPack.value = state.selectedSets.size === 1 ? [...state.selectedSets][0] : "";
    return true;
  } catch {
    return false;
  }
}

function depthRange(choice) {
  if (choice === "High") return ["Low", "Medium", "High"];
  if (choice === "Medium") return ["Low", "Medium"];
  return ["Low"];
}

function depthChoiceFromSet(set) {
  if (set.has("High")) return "High";
  if (set.has("Medium")) return "Medium";
  return "Low";
}

function activeCards() {
  return cards.filter(
    (card) =>
      state.selectedSets.has(card.set) &&
      state.selectedCategories.has(card.category) &&
      state.selectedDepths.has(card.depth),
  );
}

function unseenFrom(list) {
  const unseen = list.filter((card) => !state.seen.has(card.id));
  return unseen.length ? unseen : list;
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function drawCard({ skipSequence = false } = {}) {
  if (state.isShuffling) return;
  const available = activeCards();
  if (!available.length) {
    showToast("No cards match those filters.");
    return;
  }

  let pool = available;
  if (!skipSequence && state.mode.sequence?.length) {
    const category = state.mode.sequence[state.sequenceIndex % state.mode.sequence.length];
    const matching = available.filter((card) => card.category === category);
    if (matching.length) {
      pool = matching;
      state.sequenceIndex += 1;
    }
  }

  const card = pickRandom(unseenFrom(pool));
  displayCard(card, { pushHistory: true, assignee: nextPlayer() });
}

function drawFromCards(list, { pushHistory = true, assignee = nextPlayer() } = {}) {
  if (!list.length) {
    showToast("No cards match those filters.");
    return null;
  }
  const card = pickRandom(unseenFrom(list));
  displayCard(card, { pushHistory, assignee });
  return card;
}

function previewCard(card) {
  els.cardFace.className = `card-face category-${cleanClass(card.category)} is-shuffling`;
  els.cardCategory.textContent = card.category;
  els.cardId.textContent = card.id;
  els.cardPrompt.textContent = card.prompt;
  els.cardSet.textContent = card.set;
}

function showReadyCard() {
  els.cardFace.className = "card-face";
  els.cardCategory.textContent = "Ready";
  els.cardId.textContent = "SM-300";
  els.cardPrompt.textContent = "Choose a mode, then draw the first card.";
  els.cardSet.textContent = "Full Library";
}

function displayCard(card, { pushHistory = false, assignee } = {}) {
  state.current = card;
  if (assignee !== undefined) state.currentPlayer = assignee;
  state.seen.add(card.id);
  if (pushHistory) {
    state.history = [card, ...state.history.filter((item) => item.id !== card.id)].slice(0, 12);
  }

  els.cardFace.className = `card-face category-${cleanClass(card.category)}`;
  els.cardCategory.textContent = card.category;
  els.cardId.textContent = card.id;
  els.cardPrompt.textContent = card.prompt;
  els.cardSet.textContent = card.set;
  window.history.replaceState(null, "", `#${card.id}`);
  renderTurn();
  renderStats();
  renderHistory();
  saveSession();
}

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function setShuffleControls(disabled) {
  state.isShuffling = disabled;
  els.drawCard.disabled = disabled;
  els.shuffleCard.disabled = disabled;
  els.rouletteCard.disabled = disabled;
  els.passCard.disabled = disabled;
  els.previousCard.disabled = disabled;
  els.resetDeck.disabled = disabled;
  els.spinBottle.disabled = disabled;
  els.cardFace.setAttribute("aria-busy", String(disabled));
}

async function shuffleRandomCard() {
  if (state.isShuffling) return;
  const available = activeCards();
  if (!available.length) {
    showToast("No cards match those filters.");
    return;
  }

  const pool = unseenFrom(available);
  const finalCard = pickRandom(pool);
  const spins = Math.min(14, Math.max(8, available.length));
  setShuffleControls(true);

  for (let i = 0; i < spins; i += 1) {
    previewCard(pickRandom(available));
    await sleep(46 + i * 9);
  }

  setShuffleControls(false);
  displayCard(finalCard, { pushHistory: true, assignee: nextPlayer() });
  showToast("Random card selected");
}

async function rouletteRandomCard() {
  if (state.isShuffling) return;
  const available = cards;
  if (!available.length) return;

  const rouletteMode = modes.find((item) => item.id === "roulette") || modes[0];
  setMode(rouletteMode, { silent: true });
  setShuffleControls(true);
  els.rouletteWheel.classList.add("is-spinning");
  state.rouletteAngle += 720 + Math.floor(Math.random() * 540);
  els.rouletteWheel.style.setProperty("--spin-angle", `${state.rouletteAngle}deg`);

  const finalCard = pickRandom(unseenFrom(available));
  for (let i = 0; i < 18; i += 1) {
    previewCard(pickRandom(available));
    await sleep(34 + i * 6);
  }

  await sleep(220);
  els.rouletteWheel.classList.remove("is-spinning");
  setShuffleControls(false);
  displayCard(finalCard, { pushHistory: true, assignee: nextPlayer() });
  els.rouletteResult.textContent = `Roulette picked ${finalCard.set}.`;
  showToast("Roulette card selected");
}

function renderStats() {
  els.totalCards.textContent = cards.length;
  els.activeCards.textContent = activeCards().length;
  els.seenCards.textContent = state.seen.size;
}

function renderModes() {
  els.modeGrid.replaceChildren(
    ...modes.map((mode) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `mode-button${state.mode.id === mode.id ? " active" : ""}`;
      button.textContent = mode.name;
      button.addEventListener("click", () => setMode(mode));
      return button;
    }),
  );
}

function renderFilter(container, values, selected, onToggle) {
  container.replaceChildren(
    ...values.map((value) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `chip${selected.has(value) ? " active" : ""}`;
      button.textContent = value.replace(" Edition", "");
      button.addEventListener("click", () => onToggle(value));
      return button;
    }),
  );
}

function renderFilters() {
  renderFilter(els.setFilters, allSets, state.selectedSets, (value) => {
    toggleSet(state.selectedSets, value);
    renderAll();
    saveSession();
  });
  renderFilter(els.depthFilters, depths, state.selectedDepths, (value) => {
    toggleSet(state.selectedDepths, value);
    renderAll();
    saveSession();
  });
  renderFilter(els.categoryFilters, allCategories, state.selectedCategories, (value) => {
    toggleSet(state.selectedCategories, value);
    renderAll();
    saveSession();
  });
}

function renderRoulettePacks() {
  els.roulettePack.replaceChildren(
    ...allSets.map((set) => {
      const option = document.createElement("option");
      option.value = set;
      option.textContent = set;
      return option;
    }),
  );
}

function renderSessionSetupOptions() {
  els.sessionMode.replaceChildren(
    ...modes.map((mode) => {
      const option = document.createElement("option");
      option.value = mode.id;
      option.textContent = mode.name;
      return option;
    }),
  );

  els.sessionPack.replaceChildren(
    ...[
      (() => {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "Use mode default";
        return option;
      })(),
      ...allSets.map((set) => {
        const option = document.createElement("option");
        option.value = set;
        option.textContent = set;
        return option;
      }),
    ],
  );
}

function renderRound() {
  els.modeName.textContent = state.mode.name;
  els.roundCue.textContent = state.mode.sequence?.length
    ? state.mode.sequence[state.sequenceIndex % state.mode.sequence.length]
    : "Free draw";
  els.modeNote.textContent = state.mode.note;
  els.roulettePanel.hidden = state.mode.id !== "roulette";
}

function renderSession() {
  const playerSummary = state.players.length ? state.players.join(" · ") : "No players yet";
  els.sessionStatus.textContent = state.players.length ? `${state.mode.name} session` : "Open table";
  els.sessionPlayersSummary.textContent = playerSummary;
  els.sessionSafety.textContent =
    state.selectedDepths.has("High")
      ? "Deep cards are on. Anyone can pass, pause, or choose a softer card."
      : "Pass, pause, or choose a softer card at any time.";
}

function renderTurn() {
  els.turnPlayer.textContent = state.currentPlayer
    ? `${state.currentPlayer} answers this card.`
    : "Set up players to rotate turns.";
}

function renderHistory() {
  els.historyList.replaceChildren(
    ...state.history.map((card) => {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.innerHTML = `<span>${card.id} · ${card.category}</span><p></p>`;
      button.querySelector("p").textContent = card.prompt;
      button.addEventListener("click", () => displayCard(card));
      li.append(button);
      return li;
    }),
  );
}

function renderAll() {
  renderModes();
  renderFilters();
  renderRound();
  renderSession();
  renderTurn();
  renderStats();
  renderHistory();
}

function toggleSet(set, value) {
  if (set.has(value)) {
    if (set.size > 1) set.delete(value);
  } else {
    set.add(value);
  }
}

function setMode(mode, { silent = false } = {}) {
  state.mode = mode;
  state.selectedSets = new Set(mode.sets);
  state.selectedCategories = new Set(mode.categories);
  state.selectedDepths = new Set(mode.depths);
  state.sequenceIndex = 0;
  renderAll();
  saveSession();
  if (!silent) showToast(`${mode.name} mode`);
}

function scrollToGame() {
  els.game?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function startDateMode() {
  const mode = modes.find((item) => item.id === "dates");
  if (mode) setMode(mode);
  scrollToGame();
}

function startGuidedSession() {
  const mode = modeById(els.sessionMode.value);
  state.mode = mode;
  state.selectedSets = new Set(mode.sets);
  state.selectedCategories = new Set(mode.categories);
  state.selectedDepths = new Set(depthRange(els.sessionDepth.value));
  state.players = parsePlayers(els.sessionPlayers.value);
  state.playerIndex = 0;
  state.currentPlayer = "";
  state.sequenceIndex = 0;
  state.seen.clear();
  state.history = [];
  state.current = null;

  if (els.sessionPack.value) {
    state.selectedSets = new Set([els.sessionPack.value]);
    state.selectedCategories = new Set(categoriesForSet(els.sessionPack.value));
  }

  if (state.mode.id === "roulette") {
    els.roulettePlayers.value = state.players.length ? state.players.join(", ") : els.sessionPlayers.value;
    if (els.sessionPack.value) els.roulettePack.value = els.sessionPack.value;
  }

  renderAll();
  saveSession();
  scrollToGame();
  if (state.mode.id === "roulette") {
    showReadyCard();
  } else {
    drawCard();
  }
  showToast("Session started");
}

async function landingShuffle() {
  scrollToGame();
  await sleep(280);
  shuffleRandomCard();
}

function previousCard() {
  if (state.history.length < 2) {
    showToast("No previous card yet.");
    return;
  }
  const previous = state.history[1];
  state.history = [previous, state.history[0], ...state.history.slice(2)].slice(0, 12);
  displayCard(previous);
}

function getRoulettePlayers() {
  const players = parsePlayers(els.roulettePlayers.value);
  return players.length ? players : ["Player 1"];
}

async function spinBottle() {
  if (state.isShuffling) return;
  const players = getRoulettePlayers();
  const set = els.roulettePack.value || allSets[0];
  const packCards = cards.filter((card) => card.set === set);
  if (!packCards.length) {
    showToast("That pack has no cards.");
    return;
  }

  const chosenIndex = Math.floor(Math.random() * players.length);
  const segment = 360 / players.length;
  const targetAngle = 360 * 4 + chosenIndex * segment + Math.random() * Math.max(18, segment * 0.7);
  state.rouletteAngle += targetAngle;

  setShuffleControls(true);
  els.rouletteResult.textContent = "Spinning...";
  els.rouletteWheel.classList.add("is-spinning");
  els.rouletteWheel.style.setProperty("--spin-angle", `${state.rouletteAngle}deg`);

  const previews = Math.min(12, Math.max(6, packCards.length));
  for (let i = 0; i < previews; i += 1) {
    previewCard(pickRandom(packCards));
    await sleep(48 + i * 8);
  }

  await sleep(520);
  const card = drawFromCards(packCards);
  const player = players[chosenIndex];
  els.rouletteWheel.classList.remove("is-spinning");
  setShuffleControls(false);
  state.currentPlayer = player;
  renderTurn();
  saveSession();
  els.rouletteResult.textContent = `${player} answers next from ${set}.`;
  if (card) showToast(`${player} is up`);
}

function drawSofterCard() {
  if (state.isShuffling) return;
  const softPool = activeCards().filter((card) => card.depth === "Low");
  const fallback = cards.filter((card) => card.depth === "Low");
  const card = drawFromCards(softPool.length ? softPool : fallback);
  if (card) showToast("Softer card drawn");
}

function showFollowUp() {
  if (!state.current) {
    showToast("Draw a card first.");
    return;
  }
  const prompt = pickRandom(FOLLOW_UP_PROMPTS);
  els.turnPlayer.textContent = state.currentPlayer
    ? `${state.currentPlayer}, follow-up: ${prompt}`
    : `Follow-up: ${prompt}`;
}

function resetDeck() {
  state.seen.clear();
  state.history = [];
  state.sequenceIndex = 0;
  state.current = null;
  state.currentPlayer = "";
  state.playerIndex = 0;
  window.history.replaceState(null, "", window.location.pathname);
  showReadyCard();
  els.rouletteResult.textContent = "Add names separated by commas.";
  renderAll();
  saveSession();
  showToast("Deck reset");
}

async function copyText(text, success) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const area = document.createElement("textarea");
      area.value = text;
      document.body.append(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    showToast(success);
  } catch {
    showToast("Copy failed.");
  }
}

function copyCurrentCard() {
  if (!state.current) {
    showToast("Draw a card first.");
    return;
  }
  const player = state.currentPlayer ? `${state.currentPlayer} answers\n` : "";
  copyText(`${player}${state.current.id} · ${state.current.category}\n${state.current.prompt}`, "Card copied");
}

function copyCurrentLink() {
  if (!state.current) {
    showToast("Draw a card first.");
    return;
  }
  copyText(window.location.href, "Link copied");
}

function loadHashCard() {
  const id = decodeURIComponent(window.location.hash.replace("#", ""));
  if (!id) return false;
  const card = cards.find((item) => item.id.toLowerCase() === id.toLowerCase());
  if (!card) return false;
  state.selectedSets.add(card.set);
  state.selectedCategories.add(card.category);
  state.selectedDepths.add(card.depth);
  displayCard(card, { pushHistory: true });
  return true;
}

els.drawCard.addEventListener("click", () => drawCard());
els.shuffleCard.addEventListener("click", shuffleRandomCard);
els.rouletteCard.addEventListener("click", rouletteRandomCard);
els.passCard.addEventListener("click", () => drawCard({ skipSequence: true }));
els.previousCard.addEventListener("click", previousCard);
els.resetDeck.addEventListener("click", resetDeck);
els.copyCard.addEventListener("click", copyCurrentCard);
els.copyLink.addEventListener("click", copyCurrentLink);
els.softerCard.addEventListener("click", drawSofterCard);
els.followUpCard.addEventListener("click", showFollowUp);
els.spinBottle.addEventListener("click", spinBottle);
els.startSession.addEventListener("click", startGuidedSession);
els.roulettePlayers.addEventListener("change", saveSession);
els.roulettePack.addEventListener("change", saveSession);
els.startGame?.addEventListener("click", scrollToGame);
els.randomStart?.addEventListener("click", landingShuffle);
els.datesStart?.addEventListener("click", startDateMode);
window.addEventListener("hashchange", loadHashCard);

renderRoulettePacks();
renderSessionSetupOptions();
const restored = restoreSession();
renderAll();
if (restored && state.current) {
  displayCard(state.current);
}
if (loadHashCard()) {
  scrollToGame();
}
