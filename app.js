import { getDraftStatus, getDraftPicks } from "./services/draftApi.js";

// ─── Global State ───────────────────────────────────────────
let players = [];
let draftedPicks = [];

// ─── Load Players from JSON ──────────────────────────────────
async function loadPlayers() {
  try {
    const res = await fetch("./data/players.json");
    players = await res.json();
    console.log("Loaded", players.length, "players");
    calculateGrades();
    renderTop100("ALL");
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
  renderTop100(e.target.value);
});

// --- Player name Click -> Open Bio ---------------------------

document.getElementById("top100List").addEventListener("click", (e) => {
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
function openBioModal(playerName) {
  const modal = document.getElementById("bioModal");
  const iframe = document.getElementById("bioIframe");

  if (!modal || !iframe) {
    console.error("Modal or Iframe element not found");
    return;
  }

  const wikiUrl = `https://en.wikipedia.org/wiki/${playerName.replace(/\s+/g, "_")}`;
  iframe.src = wikiUrl;
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modal = document.getElementById("bioModal");
  const iframe = document.getElementById("bioIframe");

  if (modal) modal.style.display = "none";
  if (iframe) iframe.src ="";
  document.body.style.overflow = "";
}

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
  window.addEventListener("click", (e)=> {
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

// ─── Get Top 100 ──────────────────────────────────────────────
function getTop100(position) {
  let pool = players.filter((p) => !p.drafted);
  if (position !== "ALL") {
    pool = pool.filter((p) => p.position === position);
  }
  return pool.sort((a, b) => b.score - a.score).slice(0, 100);
}

// ─── Render Top 100 ───────────────────────────────────────────
function renderTop100(position) {
  const container = document.getElementById("top100List");
  const list = getTop100(position);
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

  container.innerHTML = draftedPicks
    .map(
      (pick) => `
    <div class="pick-row">
      <span class="pick-number">#${pick.overall}</span>
      <span class="pick-name">${pick.playerName || "—"}</span>
      <span class="pick-team">${pick.teamAbbrev || "—"}</span>
      <span class="pick-round">Rd ${pick.round}, Pk ${pick.pick}</span>
    </div>
  `,
    )
    .join("");
}

// ─── Render Team Grades ──────────────────────────────────────
function renderTeamGrades() {
  const container = document.getElementById("teamGrades");

  if (draftedPicks.length === 0) {
    container.innerHTML = "<div>Team grades will appear here.</div>";
    return;
  }

  // Group picks by team
  const byTeam = {};
  draftedPicks.forEach((pick) => {
    if (!pick.team) return;
    if (!byTeam[pick.team]) byTeam[pick.team] = [];
    byTeam[pick.team].push(pick);
  });

  container.innerHTML = Object.entries(byTeam)
    .map(
      ([team, picks]) => `
    <div class="team-card">
      <h3>${team}</h3>
      ${picks
        .map(
          (p) => `
        <div class="team-pick">
          <span>${p.playerName}</span>
          <span>Rd ${p.round}, Pk ${p.pick}</span>
        </div>
      `,
        )
        .join("")}
    </div>
  `,
    )
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
    renderTop100(document.getElementById("positionSelect").value);
    renderDraftBoard();
    renderTeamGrades();
  } catch (err) {
    console.error("Poll error:", err);
  }
}

// ─── Start App ───────────────────────────────────────────────
loadPlayers();
const pollInterval = setInterval(pollDraft, 30000);
