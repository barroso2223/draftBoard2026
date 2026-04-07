import { getDraftStatus, getDraftPicks } from "./services/draftApi.js";

// ─── Global State ───────────────────────────────────────────
let players = [];
let draftedPicks = [];

// Helper: Find player object by name (case-insensitive, trimmed)
function getPlayerByName(name) {
  return players.find((p) => p.name.toLowerCase() === name.toLowerCase());
}

// Cache for Wikipedia URLs
const wikiUrlCache = new Map();

async function getWikipediaUrl(playerName) {
  if (wikiUrlCache.has(playerName)) return wikiUrlCache.get(playerName);

  const base = "https://en.wikipedia.org/api/rest_v1/page/summary/";
  const candidates = [
    playerName.replace(/\s+/g, "_") + "_(American_football)",
    playerName.replace(/\s+/g, "_"),
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
          wikiUrlCache.set(playerName, url);
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
          wikiUrlCache.set(playerName, url);
          return url;
        }
        // Otherwise, it's a wrong page (like a photographer), so continue to fallback
      }
    } catch (e) {
      // continue
    }
  }
  const fallback = `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(playerName + " American football")}`;
  wikiUrlCache.set(playerName, fallback);
  return fallback;
}

// ─── TEMP TEST — remove before April 23rd ───────────────────
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
  renderTop25(e.target.value);
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
    // Add a full‑width separator before each round
    html += `<div class="round-separator">Round ${round}</div>`;
    // Add all picks for this round
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
  });

  container.innerHTML = html;
}

// ─── Render Team Grades ──────────────────────────────────────
function renderTeamGrades() {
  const container = document.getElementById("teamGrades");

  if (draftedPicks.length === 0) {
    container.innerHTML = "<div>Live draft picks will appear here.</div>";
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
loadPlayers().then(() => testDraftBoard()); // ← calls test after players load
const pollInterval = setInterval(pollDraft, 30000);
