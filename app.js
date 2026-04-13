import { getDraftStatus, getDraftPicks } from "./services/draftApi.js";

// ─── Global State ───────────────────────────────────────────
let players = [];
let draftedPicks = [];
let searchQuery = "";

// Helper: Find player object by name (case-insensitive, trimmed)
function getPlayerByName(name) {
  return players.find((p) => p.name.toLowerCase() === name.toLowerCase());
}

// Cache for nflmockdraftcache
// const nflmockdraftcache = new Map();
// const playerAliases = {
//   "KC Concepcion": "Kevin Concepcion",
//   "Omar Cooper": "omar-cooper-jr",
//   "LJ Johnson Jr.": "lj johnson jr",
// };
// function resolvePlayerName(name) {
//   return playerAliases[name] || name;
// }

// function createSlug(name) {
//   return name
//     .toLowerCase()
//     .replace(/\./g, "")
//     .replace(/,/g, "")
//     .replace(/\b(jr|sr|ii|iii|iv|v)\b\.?/gi, "")
//     .replace(/\([^)]*\)/g, "")
//     .replace(/\s+/g, " ")
//     .trim()
//     .replace(/\s/g, "-");
// }
// async function getNflMockDraftUrl(playerName) {
//   if (nflmockdraftcache.has(playerName)) {
//     return nflmockdraftcache.get(playerName);
//   }
//   const resolvedName = resolvePlayerName(playerName);
//   const slug = createSlug(resolvedName);

//   const url = `https://www.nflmockdraftdatabase.com/players/2026/${slug}`;

//   nflmockdraftcache.set(playerName, url);
//   return url;
// }

// Cache for Wikipedia URLs
const wikiUrlCache = new Map();
const playerAliases = {
  "kc concepcion": "Kevin Concepcion",
  "lj johnson jr": "Larry Johnson",
};
function resolvePlayerName(name) {
  const key = name.toLowerCase().trim();
  return playerAliases[key] || name;
}

async function getWikipediaUrl(playerName) {
  const resolvedName = resolvePlayerName(playerName);

  if (wikiUrlCache.has(resolvedName)) {
    return wikiUrlCache.get(resolvedName);
  }

  const base = "https://en.wikipedia.org/api/rest_v1/page/summary/";
  const candidates = [
    resolvedName.replace(/\s+/g, "_") + "_(American_football)",
    resolvedName.replace(/\s+/g, "_"),
  ];

  for (const title of candidates) {
    const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();

      if (data.title || data.title === "Not found.") {
        // If the suffix version, accept it immediately
        if (title.includes("_(American_football")) {
          const url = `https://en.wikipedia.org/wiki/${title}`;
          wikiUrlCache.set(resolvedName, url);
          return url;
        }
        // If it's the plain name, check if it's about a football player
        // by looking at the extract or description
        const extract = data.extract || "";
        const description = data.description || "";
        if (
          extract.includes("football") ||
          description.includes("football") ||
          extract.includes("linebacker") ||
          description.includes("quarterback") ||
          extract.includes("cornerback") ||
          description.includes("safety")
        ) {
          const url = `https://en.wikipedia.org/wiki/${title}`;
          wikiUrlCache.set(resolvedName, url);
          return url;
        }
        // Otherwise, it's a wrong page (like a photographer), so continue to fallback
      }
    } catch (e) {
      // continue
    }
  }
  const fallback = `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(playerName + " American football")}`;
  wikiUrlCache.set(resolvedName, fallback);
  return fallback;
}

//─── TEMP TEST — remove before April 23rd ───────────────────
// async function testDraftBoard() {
//   try {
//     const res = await fetch("./data/mockPicks.json");
//     if (!res.ok) throw new Error("Mock data not found");
//     const picks = await res.json();
//     draftedPicks = picks; // Assign the full array

//     // Mark players as drafted
//     const draftedNames = new Set(draftedPicks.map((p) => p.playerName));
//     players.forEach((p) => {
//       if (draftedNames.has(p.name)) p.drafted = true;
//     });

//     renderDraftBoard();
//     renderTeamGrades();
//     renderOnClock("Cleveland Browns");
//     renderTop25(document.getElementById("positionSelect").value);
//   } catch (err) {
//     console.warn("Could not load mock draft:", err);
//   }
// }

// ─── Load Players from JSON ──────────────────────────────────
async function loadPlayers() {
  try {
    const res = await fetch("./data/players.json");
    players = await res.json();
    console.log("Loaded", players.length, "players");
    calculateGrades();
    renderTop25("ALL");
    renderDraftBoard();
    renderTeamGrades();
  } catch (e) {
    console.log(
      "No player data loaded yet. Add your JSON file to data/players.json",
      e,
    );
  }
}

// ─── Dropdown Event ──────────────────────────────────────────
document.getElementById("positionSelect").addEventListener("change", (e) => {
  // Clear Search input
  const searchInput = document.getElementById("playerSearch");
  if (searchInput) searchInput.value = "";
  searchQuery = "";
  renderTop25(e.target.value);
});

// --- Search Event --------------------------------------------
document.getElementById("searchButton").addEventListener("click", (e) => {
  const input = document.getElementById("playerSearch");
  searchQuery = input.value;
  renderSearchResults();
});

document.getElementById("playerSearch").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    document.getElementById("searchButton").click();
  }
});

// --- Player name Click -> Open Bio ---------------------------

document.getElementById("top25List").addEventListener("click", (e) => {
  const nameEl = e.target.closest(".player-name, .mobile-player-name");
  if (!nameEl) return;
  const p = players[nameEl.dataset.index];
  if (!p) return;
  openBioModal(p.name);
});

// Prevent background scroll when modal is open
function disableBodyScroll() {
  document.body.style.overflow = "hidden";
}

function enableBodyScroll() {
  document.body.style.overflow = "";
}

// Modify openBioModal
async function openBioModal(playerName) {
  const modal = document.getElementById("bioModal");
  const iframe = document.getElementById("bioIframe");

  if (!modal || !iframe) {
    console.error("Modal or Iframe element not found");
    return;
  }

  modal.style.display = "flex";
  document.body.style.overflow = "hidden";

  // Use the Wikipedia resolver
  const wikiUrl = await getWikipediaUrl(playerName);
  iframe.src = wikiUrl;

  // Use nfl mock draft resolver
  // const nflmockdraftUrl = await getNflMockDraftUrl(playerName);
  // iframe.src = nflmockdraftUrl;
}

function closeModal() {
  const modal = document.getElementById("bioModal");
  const iframe = document.getElementById("bioIframe");

  if (modal) modal.style.display = "none";
  if (iframe) iframe.src = "";
  document.body.style.overflow = "";
}

// --- Click handler for Draft Board player names
document.getElementById("draftBoard").addEventListener("click", (e) => {
  const nameSpan = e.target.closest(".pick-player-name");
  if (!nameSpan) return;
  const playerName = nameSpan.getAttribute("data-player-name");
  if (playerName) openBioModal(playerName);
});

// --- Click handler for player names inside Team Card ---------------
document.getElementById("teamGrades").addEventListener("click", (e) => {
  const nameSpan = e.target.closest(".team-player-name");
  if (!nameSpan) return;
  const playerName = nameSpan.getAttribute("data-player-name");
  if (playerName) openBioModal(playerName);
});

// Attach close event after DOM is ready (add this at the bottom of your script)
function initModalEvents() {
  const modal = document.getElementById("bioModal");
  const closeBtn = document.querySelector(".modal-close");

  if (!modal) return;

  // Close when clicking X button
  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  // Close when clicking outside the modal content
  window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

// Call init after load (or when DOM is ready)
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initModalEvents);
} else {
  initModalEvents();
}

// ─── Calculate Grades ────────────────────────────────────────
function calculateGrades() {
  players.forEach((p) => {
    p.score = p.combined_score || p.rating || 0;
  });
}

// --- Get Search Results
function renderSearchResults() {
  const container = document.getElementById("top25List");
  const query = searchQuery.trim().toLowerCase();

  if (!query) {
    // No search - show normal top 25 undrafted list
    renderTop25(document.getElementById("positionSelect").value);
    return;
  }
  // Filter all Players (including drafted)
  const matched = players.filter((p) => p.name.toLowerCase().includes(query));

  if (matched.length === 0) {
    container.innerHTML = "<div>No Player Found</div>";
    return;
  }
  // Sort by combined score (best first)
  matched.sort((a, b) => (b.combined_score || 0) - (a.combined_score || 0));
  // Build Header (Same as top 25)
  let html = `
  <div class="headerRow">
      <div>#</div>
      <div>Player</div>
      <div>School</div>
      <div>Pos</div>
      <div>Ht</div>
      <div>Wt</div>
      <div>40</div>
      <div>Rating</div>
    </div>
  `;
  matched.forEach((p, i) => {
    // Use existing renderPlayer; pass a dummy mode (e.g., "SEARCH")
    html += renderPlayer(p, "ALL", i + 1, i);
  });
  container.innerHTML = html;
}

// ─── Get Top 25 ──────────────────────────────────────────────
function getTop25(position) {
  let pool = players.filter((p) => !p.drafted);
  if (position !== "ALL") {
    pool = pool.filter((p) => p.position === position);
  }
  return pool.sort((a, b) => b.score - a.score).slice(0, 25);
}

// ─── Render Top 25 ───────────────────────────────────────────
function renderTop25(position) {
  const container = document.getElementById("top25List");
  const list = getTop25(position);
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<div>No players found</div>";
    return;
  }

  container.innerHTML = `
    <div class="headerRow">
      <div>#</div>
      <div>Player</div>
      <div>School</div>
      <div>Pos</div>
      <div>Ht</div>
      <div>Wt</div>
      <div>40</div>
      <div>Rating</div>
    </div>
  `;

  list.forEach((p, index) => {
    container.innerHTML += renderPlayer(p, position, index + 1, index);
  });
}

// ─── Render Player Row ───────────────────────────────────────
function renderPlayer(p, mode, rank, index) {
  const score = p.combined_score || p.rating || p.score || 0;

  if (mode === "ALL") {
    return `<div class="playerRow">
      <div class="desktop-only">
        <div class="rank-number">${rank}</div>
        <div class="player-name" data-index="${players.indexOf(p)}">${p.name}</div>
        <div>${p.school}</div>
        <div>${p.position}</div>
        <div>${p.height || "—"}</div>
        <div>${p.weight || "—"}lbs</div>
        <div>${p.forty || "—"}s</div>
        <div class="rating-value">${score.toFixed(1)}</div>
      </div>
      <div class="mobile-only">
        <div class="mobile-name-row">
          <span class="rank-number-mobile">${rank}</span>
          <span class="mobile-player-name" data-index="${players.indexOf(p)}">${p.name}</span>
          <span class="mobile-school">🏫 ${p.school}</span>
        </div>
        <div class="mobile-stats">
          <span class="mobile-chip">🏈 ${p.position}</span>
          <span class="mobile-chip">📏 ${p.height || "—"}</span>
          <span class="mobile-chip">⚖️ ${p.weight || "—"}lbs</span>
          <span class="mobile-chip">⏱️ ${p.forty || "—"}s</span>
          <span class="mobile-chip rating">⭐ ${score.toFixed(1)}</span>
        </div>
      </div>
    </div>`;
  }

  return `<div class="playerRow">
    <div class="desktop-only">
      <div class="rank-number">${rank}</div>
      <div class="player-name" data-index="${players.indexOf(p)}">${p.name}</div>
      <div>${p.school}</div>
      <div>${p.position}</div>
      <div>${p.height || "—"}</div>
      <div>${p.weight || "—"}lbs</div>
      <div>${p.forty || "—"}s</div>
      <div class="rating-value">${score.toFixed(1)}</div>
    </div>
    <div class="mobile-only">
      <div class="mobile-name-row">
        <span class="rank-number-mobile">${rank}</span>
        <span class="mobile-player-name" data-index="${players.indexOf(p)}">${p.name}</span>
        <span class="mobile-school">🏫 ${p.school}</span>
      </div>
      <div class="mobile-stats">
        <span class="mobile-chip">🏈 ${p.position}</span>
        <span class="mobile-chip">📏 ${p.height || "—"}</span>
        <span class="mobile-chip">⚖️ ${p.weight || "—"}lbs</span>
        <span class="mobile-chip">⏱️ ${p.forty || "—"}s</span>
        <span class="mobile-chip rating">⭐ ${score.toFixed(1)}</span>
      </div>
    </div>
  </div>`;
}

// ─── Render Draft Board ──────────────────────────────────────
function renderDraftBoard() {
  const container = document.getElementById("draftBoard");

  if (draftedPicks.length === 0) {
    container.innerHTML = "<div>Live draft picks will appear here.</div>";
    return;
  }

  // Group picks by round
  const picksByRound = {};
  draftedPicks.forEach((pick) => {
    const round = pick.round;
    if (!picksByRound[round]) picksByRound[round] = [];
    picksByRound[round].push(pick);
  });

  const sortedRounds = Object.keys(picksByRound).sort((a, b) => a - b);
  let html = "";

  sortedRounds.forEach((round) => {
    // Round header with toggle icon
    html += `<div class="round-separator round-header-toggle" data-round="${round}">
              <span class="toggle-icon">▼</span> Round ${round}
             </div>`;
    html += `<div class="round-picks" data-round="${round}">`;
    // Add picks for this round
    picksByRound[round].forEach((pick) => {
      const player = getPlayerByName(pick.playerName);
      const hasStats = !!player;
      html += `
        <div class="pick-card">
          <div class="pick-header">
            <span class="pick-number">#${pick.overall}</span>
            <span class="pick-team">${pick.teamAbbrev || pick.team || "—"}</span>
            <span class="pick-round">Rd ${pick.round}, Pk ${pick.pick}</span>
          </div>
          <div class="pick-player-name" data-player-name="${pick.playerName.replace(/"/g, "&quot;")}">
            ${pick.playerName}
          </div>
          ${
            hasStats
              ? `
            <div class="pick-stats">
              <span class="pick-stat">🏈 ${player.position}</span>
              <span class="pick-stat">🎓 ${player.school}</span>
              <span class="pick-stat">📏 ${player.height || "—"}</span>
              <span class="pick-stat">⚖️ ${player.weight || "—"}lbs</span>
              <span class="pick-stat">⏱️ ${player.forty || "—"}s</span>
              <span class="pick-stat rating">⭐ ${(player.combined_score || player.rating || 0).toFixed(1)}</span>
            </div>
          `
              : '<div class="pick-stats no-stats">Stats not available</div>'
          }
        </div>
      `;
    });
    html += `</div>`;
  });

  container.innerHTML = html;

  // Attach click events to round headers (toggle)
  document.querySelectorAll(".round-header-toggle").forEach((header) => {
    header.addEventListener("click", (e) => {
      e.stopPropagation();
      const round = header.getAttribute("data-round");
      const picksDiv = document.querySelector(
        `.round-picks[data-round="${round}"]`,
      );
      if (picksDiv) {
        picksDiv.classList.toggle("collapsed");
        const icon = header.querySelector(".toggle-icon");
        if (icon) {
          icon.textContent = picksDiv.classList.contains("collapsed")
            ? "▶"
            : "▼";
        }
      }
    });
  });
}

// ─── Render Team Grades ──────────────────────────────────────
function renderTeamGrades() {
  const container = document.getElementById("teamGrades");

  if (draftedPicks.length === 0) {
    container.innerHTML =
      "<div>Live draft picks by team (A-Z) will appear here.</div>";
    return;
  }

  // Group picks by team
  const byTeam = {};
  draftedPicks.forEach((pick) => {
    if (!pick.team) return;
    if (!byTeam[pick.team]) byTeam[pick.team] = [];
    byTeam[pick.team].push(pick);
  });

  // Sort teams alphabetically
  const sortedTeams = Object.keys(byTeam).sort();

  container.innerHTML = sortedTeams
    .map((team) => {
      const picks = byTeam[team].sort((a, b) => a.overall - b.overall);
      return `
        <div class="team-card">
          <div class="team-card-header">
            <h3>${team}</h3>
            <span class="team-pick-count">${picks.length} pick${picks.length !== 1 ? "s" : ""}</span>
          </div>
          <div class="team-picks-list">
            ${picks
              .map((pick) => {
                const player = getPlayerByName(pick.playerName);
                const hasStats = !!player;
                return `
                  <div class="team-pick-item">
                    <div class="team-pick-main">
                      <span class="team-pick-round">Rd ${pick.round}, Pk ${pick.pick}</span>
                      <span class="team-player-name" data-player-name="${pick.playerName.replace(/"/g, "&quot;")}">${pick.playerName}</span>
                      <span class="team-pick-overall">#${pick.overall}</span>
                    </div>
                    ${
                      hasStats
                        ? `
                      <div class="team-pick-stats">
                        <span class="pick-stat">${player.position}</span>
                        <span class="pick-stat">${player.school}</span>
                        <span class="pick-stat">${player.height || "—"}</span>
                        <span class="pick-stat">${player.weight || "—"}lbs</span>
                        <span class="pick-stat">${player.forty || "—"}s</span>
                        <span class="pick-stat rating">${(player.combined_score || player.rating || 0).toFixed(1)}</span>
                      </div>
                    `
                        : '<div class="team-pick-stats no-stats">Stats not available</div>'
                    }
                  </div>
                `;
              })
              .join("")}
          </div>
        </div>
      `;
    })
    .join("");
}

// ============================================================
// COLLAPSIBLE SECTIONS (Draft Board, Top 25, Team Grades)
// ============================================================
function addSectionToggle(headingId, containerId) {
  const heading = document.getElementById(headingId);
  if (!heading) return;
  const container = document.getElementById(containerId);
  if (!container) return;

  const toggleBtn = document.createElement("span");
  toggleBtn.className = "section-toggle";
  toggleBtn.textContent = "▼";
  heading.appendChild(toggleBtn);

  let isCollapsed = false;
  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    isCollapsed = !isCollapsed;
    if (isCollapsed) {
      container.classList.add("collapsed-section");
      toggleBtn.textContent = "▶";
    } else {
      container.classList.remove("collapsed-section");
      toggleBtn.textContent = "▼";
    }
  });
}

function initSectionToggles() {
  addSectionToggle("draftBoardHeading", "draftBoard");
  addSectionToggle("teamGradesHeading", "teamGrades");
  // Special handling for Top 25 (it's a div with an h2 inside)
  const top25Heading = document.getElementById("top25Heading");
  const top25Section = document.getElementById("top25Section");
  if (top25Heading && top25Section) {
    const toggleBtn = document.createElement("span");
    toggleBtn.className = "section-toggle";
    toggleBtn.textContent = "▼";
    top25Heading.appendChild(toggleBtn);
    let isCollapsed = false;
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      isCollapsed = !isCollapsed;
      if (isCollapsed) {
        top25Section.classList.add("collapsed-section");
        toggleBtn.textContent = "▶";
      } else {
        top25Section.classList.remove("collapsed-section");
        toggleBtn.textContent = "▼";
      }
    });
  }
}

// Call this after DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSectionToggles);
} else {
  initSectionToggles();
}

// ─── On The Clock ────────────────────────────────────────────
function renderOnClock(team) {
  document.getElementById("onClock").innerText = team
    ? `On the Clock: ${team}`
    : "";
}

// ─── Poll Draft ──────────────────────────────────────────────
async function pollDraft() {
  try {
    const state = await getDraftStatus();

    if (state === "pre") {
      console.log("Draft not started yet");
      renderOnClock(null);
      return;
    }

    if (state === "post") {
      console.log("Draft complete");
      clearInterval(pollInterval);
      return;
    }

    // Draft is live
    const picks = await getDraftPicks();
    draftedPicks = picks;

    // Mark players as drafted
    const draftedNames = new Set(picks.map((p) => p.playerName));
    players.forEach((p) => {
      if (draftedNames.has(p.name)) {
        p.drafted = true;
        p.draftedBy = picks.find((pick) => pick.playerName === p.name)?.team;
      }
    });

    // Show who is on the clock — last pick's next team
    const lastPick = picks[picks.length - 1];
    if (lastPick) renderOnClock(lastPick.team);

    // Re-render everything
    renderTop25(document.getElementById("positionSelect").value);
    renderDraftBoard();
    renderTeamGrades();
  } catch (err) {
    console.error("Poll error:", err);
  }
}

// ─── Start App ───────────────────────────────────────────────
loadPlayers(); // <-- use this one when not testing with mock draft function
//loadPlayers().then(() => testDraftBoard()); // ← use this one to run the test mock draft function
const pollInterval = setInterval(pollDraft, 30000);

// --- TEMP DEBUG: Expose internals to console for learning ---
if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  window.__draftDebug = {
    players: () => players,
    draftedPicks: () => draftedPicks,
    renderTop25: () => renderTop25(pos),
    renderDraftBoard: () => renderDraftBoard(),
    renderTeamGrades: () => renderTeamGrades(),
    setPlayerDrafted: (index, drafted) => {
      if (players[index]) players[index].drafted = drafted;
      renderTop25(document.getElementById("positionSelect").value);
      renderDraftBoard();
      renderTeamGrades();
    },
  };
  console.log("Dev debug helper active");
}
