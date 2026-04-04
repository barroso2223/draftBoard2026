import { getDraftStatus, getDraftPicks } from './scripts/services/draftApi.js';

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
    renderTop10("ALL");
    renderDraftBoard();
    renderTeamGrades();
  } catch (e) {
    console.log("No player data loaded yet. Add your JSON file to data/players.json", e);
  }
}

// ─── Dropdown Event ──────────────────────────────────────────
document.getElementById("positionSelect").addEventListener("change", (e) => {
  renderTop10(e.target.value);
});

// ─── Calculate Grades ────────────────────────────────────────
function calculateGrades() {
  players.forEach((p) => {
    p.score = p.combined_score || p.rating || 0;
  });
}

// ─── Get Top 10 ──────────────────────────────────────────────
function getTop10(position) {
  let pool = players.filter((p) => !p.drafted);
  if (position !== "ALL") {
    pool = pool.filter((p) => p.position === position);
  }
  return pool.sort((a, b) => b.score - a.score).slice(0, 10);
}

// ─── Render Top 10 ───────────────────────────────────────────
function renderTop10(position) {
  const container = document.getElementById("top10List");
  const list = getTop10(position);
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
    container.innerHTML += renderPlayer(p, position, index + 1);
  });
}

// ─── Render Player Row ───────────────────────────────────────
function renderPlayer(p, mode, rank) {
  const score = p.combined_score || p.rating || p.score || 0;

  if (mode === "ALL") {
    return `<div class="playerRow">
      <div class="desktop-only">
        <div class="rank-number">${rank}</div>
        <div class="player-name">${p.name}</div>
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
          <span class="mobile-player-name">${p.name}</span>
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
      <div class="player-name">${p.name}</div>
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
        <span class="mobile-player-name">${p.name}</span>
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

  container.innerHTML = draftedPicks.map(pick => `
    <div class="pick-row">
      <span class="pick-number">#${pick.overall}</span>
      <span class="pick-name">${pick.playerName || '—'}</span>
      <span class="pick-team">${pick.teamAbbrev || '—'}</span>
      <span class="pick-round">Rd ${pick.round}, Pk ${pick.pick}</span>
    </div>
  `).join('');
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
  draftedPicks.forEach(pick => {
    if (!pick.team) return;
    if (!byTeam[pick.team]) byTeam[pick.team] = [];
    byTeam[pick.team].push(pick);
  });

  container.innerHTML = Object.entries(byTeam).map(([team, picks]) => `
    <div class="team-card">
      <h3>${team}</h3>
      ${picks.map(p => `
        <div class="team-pick">
          <span>${p.playerName}</span>
          <span>Rd ${p.round}, Pk ${p.pick}</span>
        </div>
      `).join('')}
    </div>
  `).join('');
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

    if (state === 'pre') {
      console.log('Draft not started yet');
      renderOnClock(null);
      return;
    }

    if (state === 'post') {
      console.log('Draft complete');
      clearInterval(pollInterval);
      return;
    }

    // Draft is live
    const picks = await getDraftPicks();
    draftedPicks = picks;

    // Mark players as drafted
    const draftedNames = new Set(picks.map(p => p.playerName));
    players.forEach(p => {
      if (draftedNames.has(p.name)) {
        p.drafted = true;
        p.draftedBy = picks.find(pick => pick.playerName === p.name)?.team;
      }
    });

    // Show who is on the clock — last pick's next team
    const lastPick = picks[picks.length - 1];
    if (lastPick) renderOnClock(lastPick.team);

    // Re-render everything
    renderTop10(document.getElementById("positionSelect").value);
    renderDraftBoard();
    renderTeamGrades();

  } catch (err) {
    console.error('Poll error:', err);
  }
}

// ─── Start App ───────────────────────────────────────────────
loadPlayers();
const pollInterval = setInterval(pollDraft, 30000);
