// Global Player Array
let players = [];

// Load you JSON data dynamically
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
    console.log(
      "No player data loaded yet. Add your JSON file to data/players.json",
      e,
    );
  }
}

// Dropdown event
document.getElementById("positionSelect").addEventListener("change", (e) => {
  renderTop10(e.target.value);
});

// Placeholder: Compute consensus grades (ready for your JSON fields)
function calculateGrades() {
  players.forEach((p) => {
    p.score = p.rating; // Higher score = better player
  });
}

// Get top 10 per position or ALL
function getTop10(position) {
  let pool = players.filter((p) => !p.drafted);
  if (position !== "ALL") {
    pool = pool.filter((p) => p.position === position);
  }
  return pool.sort((a, b) => b.score - a.score).slice(0, 10);
}

// Render top 10 / ALL
function renderTop10(position) {
  const container = document.getElementById("top10List");
  const list = getTop10(position);
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<div>No players found</div>";
    return;
  }

  // Add header row
  if (position === "ALL") {
    container.innerHTML = `
      <div class="headerRow">
        <div>Player</div>
        <div>School</div>
        <div>Pos</div>
        <div>Ht</div>
        <div>Wt</div>
        <div>40</div>
        <div>Rating</div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="headerRow">
        <div>Player</div>
        <div>School</div>
        <div>Pos</div>
        <div>Ht</div>
        <div>Wt</div>
        <div>40</div>
        <div>Rating</div>
      </div>
    `;
  }

  list.forEach((p) => {
    container.innerHTML += renderPlayer(p, position);
  });
}

// Render player row (ALL vs position)
function renderPlayer(p, mode) {
  const score = p.combined_score || p.rating || p.score || 0;

  if (mode === "ALL") {
    return `<div class="playerRow">
      <!-- DESKTOP VERSION (visible on desktop only) -->
      <div class="desktop-only">
        <div class="player-name">${p.name}</div>
        <div>${p.school}</div>
        <div>${p.position}</div>
        <div>${p.height || "—"}</div>
        <div>${p.weight || "—"}lbs</div>
        <div>${p.forty || "—"}s</div>
        <div class="rating-value">${score.toFixed(1)}</div>
      </div>
      
      <!-- MOBILE VERSION (visible on mobile only) -->
      <div class="mobile-only">
        <div class="mobile-name-row">
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

  // Position-specific view
  return `<div class="playerRow">
    <div class="desktop-only">
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

// Draft board placeholder
function renderDraftBoard() {
  const container = document.getElementById("draftBoard");
  container.innerHTML = "Live draft picks will appear here.";
}

// Team grades placeholder
function renderTeamGrades() {
  const container = document.getElementById("teamGrades");
  container.innerHTML = "Team grades will appear here.";
}

// Team on the clock
function renderOnClock(team) {
  document.getElementById("onClock").innerText = team
    ? `On the Clock: ${team}`
    : "";
}

// Live draft updater placeholder
function pollDraft() {
  console.log("Polling for draft updates...");
}

// Run app
loadPlayers();
setInterval(pollDraft, 3000);
