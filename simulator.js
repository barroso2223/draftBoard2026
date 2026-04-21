// simulator.js — 2026 NFL Draft Simulator
// No type="module" — accesses window._players from app.js

// ─── State ───────────────────────────────────────────────────
let simState = {
  userTeam: null,
  mode: null,
  available: [],
  draftOrder: [],
  myPicks: [],
  allPicks: [],
  currentPickIndex: 0,
  timer: null,
  timeLeft: 120,
};

let selectedMode = null;

const NFL_TEAMS = [
  "Arizona Cardinals",
  "Atlanta Falcons",
  "Baltimore Ravens",
  "Buffalo Bills",
  "Carolina Panthers",
  "Chicago Bears",
  "Cincinnati Bengals",
  "Cleveland Browns",
  "Dallas Cowboys",
  "Denver Broncos",
  "Detroit Lions",
  "Green Bay Packers",
  "Houston Texans",
  "Indianapolis Colts",
  "Jacksonville Jaguars",
  "Kansas City Chiefs",
  "Las Vegas Raiders",
  "Los Angeles Chargers",
  "Los Angeles Rams",
  "Miami Dolphins",
  "Minnesota Vikings",
  "New England Patriots",
  "New Orleans Saints",
  "New York Giants",
  "New York Jets",
  "Philadelphia Eagles",
  "Pittsburgh Steelers",
  "San Francisco 49ers",
  "Seattle Seahawks",
  "Tampa Bay Buccaneers",
  "Tennessee Titans",
  "Washington Commanders",
];

const TEAM_ABBR = {
  "Arizona Cardinals": "ARI",
  "Atlanta Falcons": "ATL",
  "Baltimore Ravens": "BAL",
  "Buffalo Bills": "BUF",
  "Carolina Panthers": "CAR",
  "Chicago Bears": "CHI",
  "Cincinnati Bengals": "CIN",
  "Cleveland Browns": "CLE",
  "Dallas Cowboys": "DAL",
  "Denver Broncos": "DEN",
  "Detroit Lions": "DET",
  "Green Bay Packers": "GB",
  "Houston Texans": "HOU",
  "Indianapolis Colts": "IND",
  "Jacksonville Jaguars": "JAX",
  "Kansas City Chiefs": "KC",
  "Las Vegas Raiders": "LVR",
  "Los Angeles Chargers": "LAC",
  "Los Angeles Rams": "LAR",
  "Miami Dolphins": "MIA",
  "Minnesota Vikings": "MIN",
  "New England Patriots": "NE",
  "New Orleans Saints": "NO",
  "New York Giants": "NYG",
  "New York Jets": "NYJ",
  "Philadelphia Eagles": "PHI",
  "Pittsburgh Steelers": "PIT",
  "San Francisco 49ers": "SF",
  "Seattle Seahawks": "SEA",
  "Tampa Bay Buccaneers": "TB",
  "Tennessee Titans": "TEN",
  "Washington Commanders": "WSH",
};

// ─── Consensus Forced Picks ───────────────────────────────────
// overall pick number → player name that always gets selected
const FORCED_PICKS = {
  1: "Fernando Mendoza", // LVR — consensus #1 overall
};

// ─── Open / Close ─────────────────────────────────────────────
function openSimulator() {
  document.getElementById("simModal").style.display = "block";
  document.body.style.overflow = "hidden";
  selectedMode = null;
  renderSetupScreen();
}

function closeSimulator() {
  clearInterval(simState.timer);
  document.getElementById("simModal").style.display = "none";
  document.body.style.overflow = "";
}

// ─── Setup Screen ─────────────────────────────────────────────
function renderSetupScreen() {
  document.getElementById("simContent").innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;">
      <div>
        <h2 style="color:#ff6b6b;margin:0;font-size:1.6rem;letter-spacing:1px;">🏈 2026 NFL Draft Simulator</h2>
        <p style="color:#7a8fa6;margin:4px 0 0;font-size:0.85rem;">Run your own mock draft with the real 2026 pick order</p>
      </div>
      <button onclick="closeSimulator()"
        style="background:none;border:2px solid #2e3f5c;color:#aaa;font-size:1.2rem;cursor:pointer;border-radius:8px;padding:4px 10px;"
        onmouseover="this.style.borderColor='#ff6b6b';this.style.color='#ff6b6b'"
        onmouseout="this.style.borderColor='#2e3f5c';this.style.color='#aaa'">✕</button>
    </div>

    <div style="margin-bottom:20px;">
      <label style="color:#ff6b6b;font-weight:bold;display:block;margin-bottom:8px;font-size:0.9rem;letter-spacing:1px;text-transform:uppercase;">Select Your Team</label>
      <select id="teamSelect"
        style="width:100%;padding:12px;border-radius:10px;border:2px solid #2e3f5c;background:#0f1923;color:white;font-size:1rem;cursor:pointer;outline:none;"
        onfocus="this.style.borderColor='#ff6b6b'"
        onblur="this.style.borderColor='#2e3f5c'">
        <option value="">— Choose a team —</option>
        ${NFL_TEAMS.map((t) => `<option value="${t}">${t}</option>`).join("")}
      </select>
    </div>

    <div style="margin-bottom:28px;">
      <label style="color:#ff6b6b;font-weight:bold;display:block;margin-bottom:12px;font-size:0.9rem;letter-spacing:1px;text-transform:uppercase;">Draft Mode</label>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div onclick="selectMode('bpa', this)" id="bpaBtn"
          style="padding:16px;border-radius:10px;border:2px solid #2e3f5c;background:#0f1923;color:#eee;cursor:pointer;text-align:center;transition:all 0.2s;">
          <div style="font-size:1.5rem;margin-bottom:6px;">🎯</div>
          <div style="font-weight:bold;color:#ff6b6b;margin-bottom:4px;">Best Player Available</div>
          <div style="font-size:0.8rem;color:#7a8fa6;">Other teams pick randomly from top 2 available</div>
        </div>
        <div onclick="selectMode('needs', this)" id="needsBtn"
          style="padding:16px;border-radius:10px;border:2px solid #2e3f5c;background:#0f1923;color:#eee;cursor:pointer;text-align:center;transition:all 0.2s;">
          <div style="font-size:1.5rem;margin-bottom:6px;">📋</div>
          <div style="font-weight:bold;color:#ff6b6b;margin-bottom:4px;">Team Needs</div>
          <div style="font-size:0.8rem;color:#7a8fa6;">Other teams pick randomly from top 5 available</div>
        </div>
      </div>
    </div>

    <button onclick="startSimulation()"
      style="width:100%;padding:14px;background:linear-gradient(135deg,#ff6b6b,#ff8e53);border:none;border-radius:10px;color:#1a1a2e;font-size:1.1rem;font-weight:bold;cursor:pointer;letter-spacing:1px;"
      onmouseover="this.style.opacity='0.9'"
      onmouseout="this.style.opacity='1'">
      START DRAFT 🏈
    </button>
  `;
}

function selectMode(mode, el) {
  selectedMode = mode;
  ["bpaBtn", "needsBtn"].forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.style.borderColor = "#2e3f5c";
      btn.style.background = "#0f1923";
    }
  });
  el.style.borderColor = "#ff6b6b";
  el.style.background = "#16213e";
}

// ─── Start Simulation ─────────────────────────────────────────
async function startSimulation() {
  const teamSelect = document.getElementById("teamSelect");
  if (!teamSelect || !teamSelect.value) {
    alert("Please select a team.");
    return;
  }
  if (!selectedMode) {
    alert("Please select a draft mode.");
    return;
  }

  simState.userTeam = teamSelect.value;
  simState.mode = selectedMode;
  simState.myPicks = [];
  simState.allPicks = [];
  simState.currentPickIndex = 0;

  const res = await fetch("./data/draftOrder.json");
  simState.draftOrder = await res.json();
  simState.available = (window._players || []).filter(
    (p) => (p.combined_score || 0) > 0,
  );

  renderDraftScreen();
  processNextPick();
}

// ─── Auto Pick (with forced consensus picks) ──────────────────
function autoPick(available, mode, overall) {
  if (FORCED_PICKS[overall]) {
    const forced = available.find((p) => p.name === FORCED_PICKS[overall]);
    if (forced) return forced;
  }
  const sorted = [...available].sort(
    (a, b) => (b.combined_score || 0) - (a.combined_score || 0),
  );
  const poolSize = mode === "bpa" ? 2 : 5;
  const pool = sorted.slice(0, Math.min(poolSize, sorted.length));
  return pool[Math.floor(Math.random() * pool.length)];
}

// ─── Draft Loop ───────────────────────────────────────────────
function processNextPick() {
  if (
    simState.currentPickIndex >= simState.draftOrder.length ||
    !simState.available.length
  ) {
    renderResultsScreen();
    return;
  }

  const slot = simState.draftOrder[simState.currentPickIndex];

  if (slot.team === simState.userTeam) {
    renderUserPickBanner(slot);
    startTimer(slot);
    renderAvailablePlayers(true);
  } else {
    setTimeout(() => {
      const picked = autoPick(simState.available, simState.mode, slot.overall);
      picked.round = slot.round;
      simState.available = simState.available.filter(
        (p) => p.name !== picked.name,
      );
      simState.allPicks.push({
        team: slot.team,
        player: picked,
        overall: slot.overall,
        round: slot.round,
        pick: slot.pick,
      });
      simState.currentPickIndex++;
      updateLiveDraftBoard();
      processNextPick();
    }, 80);
  }
}

// ─── Timer ────────────────────────────────────────────────────
function startTimer(slot) {
  clearInterval(simState.timer);
  simState.timeLeft = 120;
  simState.timer = setInterval(() => {
    simState.timeLeft--;
    const el = document.getElementById("simTimer");
    if (el) {
      const m = Math.floor(simState.timeLeft / 60);
      const s = simState.timeLeft % 60;
      el.textContent = `⏱ ${m}:${s.toString().padStart(2, "0")}`;
      el.style.color = simState.timeLeft <= 30 ? "#ff6b6b" : "#ffd93d";
    }
    if (simState.timeLeft <= 0) {
      clearInterval(simState.timer);
      const picked = autoPick(simState.available, simState.mode, slot.overall);
      userSelectPlayer(picked.name);
    }
  }, 1000);
}

// ─── Draft Screen Layout ──────────────────────────────────────
function renderDraftScreen() {
  document.getElementById("simContent").innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
      <div>
        <h2 style="color:#ff6b6b;margin:0;font-size:1.3rem;">🏈 ${simState.userTeam}</h2>
        <p style="color:#7a8fa6;margin:2px 0 0;font-size:0.8rem;">Mode: ${simState.mode === "bpa" ? "Best Player Available" : "Team Needs"}</p>
      </div>
      <button onclick="closeSimulator()"
        style="background:none;border:2px solid #2e3f5c;color:#aaa;font-size:1rem;cursor:pointer;border-radius:8px;padding:4px 10px;">✕</button>
    </div>

    <div id="clockBanner"
      style="background:linear-gradient(135deg,#0f1923,#16213e);border:2px solid #2e3f5c;border-radius:10px;padding:10px 16px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;">
      <span id="clockText" style="color:#7a8fa6;font-size:0.9rem;">⏳ Simulating draft picks...</span>
      <span id="simTimer" style="color:#ffd93d;font-weight:bold;font-size:1rem;"></span>
    </div>

    <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:16px;height:calc(100vh - 280px);min-height:500px;">

      <!-- Left: Available Players -->
      <div style="display:flex;flex-direction:column;gap:10px;overflow:hidden;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <h3 style="color:#ff6b6b;margin:0;font-size:0.85rem;letter-spacing:1px;text-transform:uppercase;">Top Available Players</h3>
          <select id="simPosFilter" onchange="renderAvailablePlayers()"
            style="padding:5px 8px;border-radius:6px;border:1px solid #2e3f5c;background:#0f1923;color:#eee;font-size:0.8rem;outline:none;">
            <option value="ALL">All Positions</option>
            <option value="QB">QB</option>
            <option value="RB">RB</option>
            <option value="WR">WR</option>
            <option value="TE">TE</option>
            <option value="OT">OT</option>
            <option value="EDGE">EDGE</option>
            <option value="DT">DT</option>
            <option value="LB">LB</option>
            <option value="CB">CB</option>
            <option value="S">S</option>
          </select>
        </div>
        <div id="availablePlayers" style="overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:8px;padding-right:4px;"></div>
      </div>

      <!-- Right: My Picks + Live Board -->
      <div style="display:flex;flex-direction:column;gap:12px;overflow:hidden;">
        <div>
          <h3 id="myPicksHeader" style="color:#4caf50;margin:0 0 8px;font-size:0.85rem;letter-spacing:1px;text-transform:uppercase;">Your Picks (0)</h3>
          <div id="myPicksList" style="display:flex;flex-direction:column;gap:6px;max-height:200px;overflow-y:auto;padding-right:4px;"></div>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;overflow:hidden;">
          <h3 style="color:#ff6b6b;margin:0 0 8px;font-size:0.85rem;letter-spacing:1px;text-transform:uppercase;">Live Draft Board</h3>
          <div id="liveDraftBoard" style="flex:1;overflow-y:auto;background:#0a0f1e;border-radius:8px;padding:8px;">
            <p style="color:#2e3f5c;text-align:center;font-size:0.8rem;margin:20px 0;">Picks will appear here...</p>
          </div>
        </div>
      </div>
    </div>
  `;

  renderAvailablePlayers(false);
  updateMyPicks();
  updateLiveDraftBoard();
}

// ─── Render Available Players ─────────────────────────────────
function renderAvailablePlayers(isMyTurn = false) {
  const container = document.getElementById("availablePlayers");
  if (!container) return;

  const pos = document.getElementById("simPosFilter")?.value || "ALL";
  const slot = simState.draftOrder[simState.currentPickIndex];
  const myTurn = slot && slot.team === simState.userTeam;

  let pool = [...simState.available].sort(
    (a, b) => (b.combined_score || 0) - (a.combined_score || 0),
  );
  if (pos !== "ALL") pool = pool.filter((p) => p.position === pos);
  pool = pool.slice(0, 15);

  if (!pool.length) {
    container.innerHTML = `<p style="color:#7a8fa6;text-align:center;font-size:0.85rem;padding:20px 0;">No players at this position</p>`;
    return;
  }

  container.innerHTML = pool
    .map((p, i) => {
      const score = (p.combined_score || 0).toFixed(1);
      const scoreColor =
        score >= 88 ? "#ff6b6b" : score >= 80 ? "#ffd93d" : "#8bc34a";
      const safeName = (p.name || "")
        .replace(/'/g, "\\'")
        .replace(/"/g, "&quot;");

      return `
      <div style="background:#16213e;border:1px solid #2e3f5c;border-radius:10px;overflow:hidden;flex-shrink:0;transition:transform 0.15s,border-color 0.15s;"
           onmouseover="this.style.transform='translateY(-1px)';this.style.borderColor='#ff6b6b'"
           onmouseout="this.style.transform='translateY(0)';this.style.borderColor='#2e3f5c'">

        <div style="background:#0f1923;padding:5px 10px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #2e3f5c;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="background:#ff6b6b;color:#0f1923;font-weight:bold;font-size:0.7rem;padding:2px 6px;border-radius:4px;">#${i + 1}</span>
            <span style="color:#7a8fa6;font-size:0.75rem;">${p.position || "—"}</span>
          </div>
          <span style="color:#7a8fa6;font-size:0.72rem;">${p.school || "—"}</span>
        </div>

        <div style="padding:10px 12px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
            <div style="flex:1;min-width:0;">
              <div style="color:#ff6b6b;font-weight:bold;font-size:0.95rem;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                ${p.name || "Unknown"}
                <span style="margin-left:4px;">
                  <img src="https://en.wikipedia.org/static/favicon/wikipedia.ico"
                       style="height:12px;cursor:pointer;vertical-align:middle;"
                       onclick="openBioModal('${safeName}')"
                       title="Wikipedia">
                  <img src="https://www.nflmockdraftdatabase.com/favicon.ico"
                       style="height:12px;cursor:pointer;margin-left:3px;vertical-align:middle;"
                       onclick="openBioModal('${safeName}', getNflMockDraftUrl('${safeName}'))"
                       title="NFL Mock Draft DB">
                </span>
              </div>
            </div>
            <span style="color:${scoreColor};font-weight:bold;font-size:1.05rem;margin-left:8px;flex-shrink:0;">${score}</span>
          </div>

          <div style="display:flex;gap:10px;font-size:0.75rem;color:#7a8fa6;margin-bottom:${myTurn ? "8px" : "0"};">
            ${p.height ? `<span>📏 ${p.height}</span>` : ""}
            ${p.weight ? `<span>⚖️ ${p.weight}lbs</span>` : ""}
            ${p.forty ? `<span>⚡ ${p.forty}s</span>` : ""}
          </div>

          ${
            myTurn
              ? `
            <button onclick="userSelectPlayer('${safeName}', event)"
              style="width:100%;padding:7px;background:linear-gradient(135deg,#ff6b6b,#ff8e53);border:none;border-radius:6px;color:#1a1a2e;font-weight:bold;cursor:pointer;font-size:0.85rem;letter-spacing:0.5px;margin-top:4px;">
              SELECT PICK ✓
            </button>
          `
              : ""
          }
        </div>
      </div>
    `;
    })
    .join("");
}

// ─── User Pick Banner ─────────────────────────────────────────
function renderUserPickBanner(slot) {
  const banner = document.getElementById("clockBanner");
  const text = document.getElementById("clockText");
  if (banner) banner.style.borderColor = "#ff6b6b";
  if (text)
    text.innerHTML = `
    <strong style="color:#ff6b6b;font-size:1rem;">🎯 YOU'RE ON THE CLOCK</strong>
    <span style="color:#7a8fa6;"> — Round ${slot.round}, Pick ${slot.pick} (Overall #${slot.overall})</span>`;
  renderAvailablePlayers(true);
}

// ─── User Selects Player ──────────────────────────────────────
function userSelectPlayer(playerName, e) {
  if (e) e.stopPropagation();
  clearInterval(simState.timer);

  const slot = simState.draftOrder[simState.currentPickIndex];
  const picked = simState.available.find((p) => p.name === playerName);
  if (!picked) return;

  picked.round = slot.round;
  simState.myPicks.push(picked);
  simState.available = simState.available.filter((p) => p.name !== playerName);
  simState.allPicks.push({
    team: slot.team,
    player: picked,
    overall: slot.overall,
    round: slot.round,
    pick: slot.pick,
  });
  simState.currentPickIndex++;

  const banner = document.getElementById("clockBanner");
  const text = document.getElementById("clockText");
  const timer = document.getElementById("simTimer");
  if (banner) banner.style.borderColor = "#2e3f5c";
  if (text)
    text.innerHTML = `<span style="color:#7a8fa6;">⏳ Simulating draft picks...</span>`;
  if (timer) timer.textContent = "";

  updateMyPicks();
  updateLiveDraftBoard();
  renderAvailablePlayers(false);
  processNextPick();
}

// ─── Update My Picks Panel ────────────────────────────────────
function updateMyPicks() {
  const container = document.getElementById("myPicksList");
  const header = document.getElementById("myPicksHeader");
  if (header) header.textContent = `Your Picks (${simState.myPicks.length})`;
  if (!container) return;

  if (!simState.myPicks.length) {
    container.innerHTML = `<p style="color:#2e3f5c;font-size:0.8rem;text-align:center;">No picks yet</p>`;
    return;
  }

  container.innerHTML = simState.myPicks
    .map((p) => {
      const score = (p.combined_score || 0).toFixed(1);
      const scoreColor =
        score >= 88 ? "#ff6b6b" : score >= 80 ? "#ffd93d" : "#8bc34a";
      const safeName = (p.name || "")
        .replace(/'/g, "\\'")
        .replace(/"/g, "&quot;");

      return `
      <div style="background:#1a3a2a;border:1px solid #4caf50;border-radius:8px;
                  padding:8px 10px;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <span style="color:#ffd93d;font-size:0.75rem;font-weight:bold;">Rd ${p.round}</span>
          <span style="color:#4caf50;font-weight:bold;font-size:0.85rem;margin-left:6px;">
            ${p.name}
          </span>
          <span style="margin-left:5px;">
            <img src="https://en.wikipedia.org/static/favicon/wikipedia.ico"
                 style="height:11px;cursor:pointer;vertical-align:middle;opacity:0.85;"
                 onclick="openBioModal('${safeName}')"
                 title="Wikipedia">
            <img src="https://www.nflmockdraftdatabase.com/favicon.ico"
                 style="height:11px;cursor:pointer;margin-left:3px;vertical-align:middle;opacity:0.85;"
                 onclick="openBioModal('${safeName}', getNflMockDraftUrl('${safeName}'))"
                 title="NFL Mock Draft DB">
          </span>
          <span style="color:#7a8fa6;font-size:0.75rem;"> · ${p.position}</span>
        </div>
        <span style="color:${scoreColor};font-weight:bold;font-size:0.85rem;">${score}</span>
      </div>
    `;
    })
    .join("");

  container.scrollTop = container.scrollHeight;
}
// ─── Live Draft Board ─────────────────────────────────────────
function updateLiveDraftBoard() {
  const container = document.getElementById("liveDraftBoard");
  if (!container) return;

  if (!simState.allPicks.length) {
    container.innerHTML = `<p style="color:#2e3f5c;text-align:center;font-size:0.8rem;margin:20px 0;">Picks will appear here...</p>`;
    return;
  }

  const byRound = {};
  simState.allPicks.forEach((pick) => {
    const r = pick.round;
    if (!byRound[r]) byRound[r] = [];
    byRound[r].push(pick);
  });

  container.innerHTML = Object.keys(byRound)
    .sort((a, b) => a - b)
    .map(
      (round) => `
    <div style="margin-bottom:10px;">
      <div style="color:#ff6b6b;font-size:0.75rem;font-weight:bold;letter-spacing:1px;text-transform:uppercase;padding:4px 0;border-bottom:1px solid #2e3f5c;margin-bottom:6px;">
        Round ${round}
      </div>
      ${byRound[round]
        .map((pick) => {
          const isMe = pick.team === simState.userTeam;
          const abbr =
            TEAM_ABBR[pick.team] || pick.team.substring(0, 3).toUpperCase();
          const score = (pick.player.combined_score || 0).toFixed(1);
          return `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px;border-radius:6px;margin-bottom:3px;background:${isMe ? "#1a3a2a" : "#16213e"};border-left:3px solid ${isMe ? "#4caf50" : "#2e3f5c"};">
            <div style="display:flex;gap:6px;align-items:center;min-width:0;flex:1;">
              <span style="background:${isMe ? "#4caf50" : "#0f1923"};color:${isMe ? "#0f1923" : "#7a8fa6"};font-size:0.65rem;padding:2px 5px;border-radius:3px;font-weight:bold;flex-shrink:0;">#${pick.overall}</span>
              <span style="color:${isMe ? "#4caf50" : "#ff6b6b"};font-size:0.72rem;font-weight:bold;flex-shrink:0;">${abbr}</span>
              <span style="color:${isMe ? "#6dff9a" : "#eee"};font-size:0.78rem;font-weight:bold;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${pick.player.name}</span>
              <span style="color:#7a8fa6;font-size:0.72rem;flex-shrink:0;">${pick.player.position}</span>
            </div>
            <span style="color:#ffd93d;font-size:0.78rem;font-weight:bold;flex-shrink:0;margin-left:6px;">${score}</span>
          </div>
        `;
        })
        .join("")}
    </div>
  `,
    )
    .join("");

  container.scrollTop = container.scrollHeight;
}

// ─── Grade Draft (Value Over Expected) ───────────────────────
// ─── Grading Formulas ────────────────────────────────────────
function gradeAllFormulas(myPicks) {
  const expected = { 1: 88, 2: 83, 3: 78, 4: 73, 5: 68, 6: 63, 7: 58 };
  const weights = { 1: 1.0, 2: 0.9, 3: 0.8, 4: 0.7, 5: 0.6, 6: 0.5, 7: 0.4 };

  // 1. Value Over Expected
  const voeValues = myPicks.map(
    (p) => (p.combined_score || 0) - (expected[p.round] || 58),
  );
  const voeAvg = voeValues.reduce((a, b) => a + b, 0) / voeValues.length;

  // 2. Round-Weighted Average
  const weightedScores = myPicks.map(
    (p) => (p.combined_score || 0) * (weights[p.round] || 0.4),
  );
  const weightedAvg =
    weightedScores.reduce((a, b) => a + b, 0) / weightedScores.length;

  // 3. Best 3 Picks
  const top3 = [...myPicks]
    .sort((a, b) => (b.combined_score || 0) - (a.combined_score || 0))
    .slice(0, 3);
  const top3Avg =
    top3.reduce((a, p) => a + (p.combined_score || 0), 0) / top3.length;

  // 4. Raw Average
  const rawAvg =
    myPicks.reduce((a, p) => a + (p.combined_score || 0), 0) / myPicks.length;

  return {
    voe: {
      label: "Value Over Expected",
      value: voeAvg,
      grade: voeGrade(voeAvg),
      desc: "How much better/worse than expected per round",
    },
    weighted: {
      label: "Round-Weighted Avg",
      value: weightedAvg,
      grade: weightedGrade(weightedAvg),
      desc: "Earlier picks count more (1.0 → 0.4)",
    },
    top3: {
      label: "Best 3 Picks",
      value: top3Avg,
      grade: rawGrade(top3Avg),
      desc: "Grade based on your three best selections",
    },
    raw: {
      label: "Raw Average",
      value: rawAvg,
      grade: rawGrade(rawAvg),
      desc: "Simple average of all pick scores",
    },
  };
}

function voeGrade(avg) {
  if (avg >= 6) return { letter: "A+", color: "#00e676" };
  if (avg >= 3) return { letter: "A", color: "#4caf50" };
  if (avg >= 1) return { letter: "A-", color: "#8bc34a" };
  if (avg >= -1) return { letter: "B+", color: "#cddc39" };
  if (avg >= -3) return { letter: "B", color: "#ffd93d" };
  if (avg >= -5) return { letter: "B-", color: "#ffb300" };
  if (avg >= -7) return { letter: "C+", color: "#ff9800" };
  if (avg >= -9) return { letter: "C", color: "#ff7043" };
  if (avg >= -11) return { letter: "C-", color: "#f44336" };
  return { letter: "D", color: "#b71c1c" };
}

function weightedGrade(avg) {
  // Weighted scores are naturally lower — adjusted thresholds
  if (avg >= 76) return { letter: "A+", color: "#00e676" };
  if (avg >= 73) return { letter: "A", color: "#4caf50" };
  if (avg >= 70) return { letter: "A-", color: "#8bc34a" };
  if (avg >= 67) return { letter: "B+", color: "#cddc39" };
  if (avg >= 64) return { letter: "B", color: "#ffd93d" };
  if (avg >= 61) return { letter: "B-", color: "#ffb300" };
  if (avg >= 58) return { letter: "C+", color: "#ff9800" };
  if (avg >= 55) return { letter: "C", color: "#ff7043" };
  if (avg >= 52) return { letter: "C-", color: "#f44336" };
  return { letter: "D", color: "#b71c1c" };
}

function rawGrade(avg) {
  if (avg >= 88) return { letter: "A+", color: "#00e676" };
  if (avg >= 85) return { letter: "A", color: "#4caf50" };
  if (avg >= 82) return { letter: "A-", color: "#8bc34a" };
  if (avg >= 80) return { letter: "B+", color: "#cddc39" };
  if (avg >= 78) return { letter: "B", color: "#ffd93d" };
  if (avg >= 76) return { letter: "B-", color: "#ffb300" };
  if (avg >= 74) return { letter: "C+", color: "#ff9800" };
  if (avg >= 72) return { letter: "C", color: "#ff7043" };
  if (avg >= 70) return { letter: "C-", color: "#f44336" };
  return { letter: "D", color: "#b71c1c" };
}

function consensusGrade(grades) {
  // Convert letter grades to GPA-style numbers, average, convert back
  const scale = {
    "A+": 4.3,
    A: 4.0,
    "A-": 3.7,
    "B+": 3.3,
    B: 3.0,
    "B-": 2.7,
    "C+": 2.3,
    C: 2.0,
    "C-": 1.7,
    D: 1.0,
  };
  const reverse = Object.fromEntries(
    Object.entries(scale).map(([k, v]) => [v, k]),
  );

  const values = Object.values(grades).map((g) => scale[g.grade.letter] || 1.0);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;

  // Find closest
  const closest = Object.keys(reverse).reduce((a, b) =>
    Math.abs(b - avg) < Math.abs(a - avg) ? b : a,
  );

  const letter = reverse[closest];
  return { letter, color: grades.voe.grade.color }; // use VOE color
}

// ─── Results Screen ───────────────────────────────────────────
function renderResultsScreen() {
  clearInterval(simState.timer);
  const grades = gradeAllFormulas(simState.myPicks);
  const consensus = consensusGrade(grades);
  const expected = { 1: 88, 2: 83, 3: 78, 4: 73, 5: 68, 6: 63, 7: 58 };

  document.getElementById("simContent").innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
      <h2 style="color:#ff6b6b;margin:0;">🏆 Draft Complete — ${simState.userTeam}</h2>
      <button onclick="closeSimulator()" style="background:none;border:2px solid #2e3f5c;color:#aaa;font-size:1rem;cursor:pointer;border-radius:8px;padding:4px 10px;">✕</button>
    </div>

    <!-- Consensus Grade -->
    <div style="text-align:center;background:linear-gradient(135deg,#0f1923,#16213e);border:2px solid ${consensus.color};border-radius:16px;padding:20px;margin-bottom:16px;">
      <div style="font-size:0.8rem;color:#7a8fa6;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;">Consensus Grade</div>
      <div style="font-size:4rem;font-weight:bold;color:${consensus.color};line-height:1;">${consensus.letter}</div>
      <div style="color:#7a8fa6;font-size:0.8rem;margin-top:4px;">Average across all four grading formulas</div>
    </div>

    <!-- Four Formula Grades -->
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px;margin-bottom:20px;">
      ${Object.values(grades)
        .map(
          (g) => `
        <div style="background:#16213e;border:1px solid #2e3f5c;border-radius:10px;padding:12px;text-align:center;">
          <div style="font-size:1.8rem;font-weight:bold;color:${g.grade.color};">${g.grade.letter}</div>
          <div style="color:#ff6b6b;font-size:0.75rem;font-weight:bold;margin:4px 0;">${g.label}</div>
          <div style="color:#7a8fa6;font-size:0.68rem;">${g.desc}</div>
          <div style="color:#ffd93d;font-size:0.75rem;margin-top:6px;font-weight:bold;">
            ${
              g.label === "Value Over Expected"
                ? (g.value >= 0 ? "+" : "") + g.value.toFixed(1) + " vs exp"
                : g.value.toFixed(1)
            }
          </div>
        </div>
      `,
        )
        .join("")}
    </div>

    <!-- Picks Breakdown -->
    <h3 style="color:#ff6b6b;margin:0 0 12px;font-size:0.9rem;letter-spacing:1px;text-transform:uppercase;">Your Picks</h3>
    <div style="display:grid;gap:8px;margin-bottom:24px;max-height:340px;overflow-y:auto;">
      ${simState.myPicks
        .map((p) => {
          const exp = expected[p.round] || 58;
          const voe = (p.combined_score || 0) - exp;
          const voeColor = voe >= 0 ? "#4caf50" : "#ff6b6b";
          const score = (p.combined_score || 0).toFixed(1);
          const abbr =
            TEAM_ABBR[simState.userTeam] ||
            simState.userTeam.substring(0, 3).toUpperCase();
          const safeName = (p.name || "")
            .replace(/'/g, "\\'")
            .replace(/"/g, "&quot;");
          return `
          <div style="background:linear-gradient(135deg,#1a3a2a,#162d1f);border:1px solid #4caf50;border-radius:10px;overflow:hidden;">
            <div style="background:#1e4d30;padding:5px 12px;display:flex;justify-content:space-between;">
              <span style="color:#4caf50;font-size:0.75rem;font-weight:bold;">Round ${p.round} · ${abbr}</span>
              <span style="color:#7a8fa6;font-size:0.72rem;">Expected: ${exp}</span>
            </div>
            <div style="padding:10px 12px;display:flex;justify-content:space-between;align-items:center;">
              <div>
                <div style="color:#4caf50;font-weight:bold;font-size:1rem;margin-bottom:3px;">
                  ${p.name}
                  <img src="https://en.wikipedia.org/static/favicon/wikipedia.ico"
                       style="height:12px;cursor:pointer;vertical-align:middle;margin-left:4px;"
                       onclick="openBioModal('${safeName}')" title="Wikipedia">
                  <img src="https://www.nflmockdraftdatabase.com/favicon.ico"
                       style="height:12px;cursor:pointer;margin-left:3px;vertical-align:middle;"
                       onclick="openBioModal('${safeName}',getNflMockDraftUrl('${safeName}'))" title="NFL Mock Draft DB">
                </div>
                <div style="display:flex;gap:8px;align-items:center;">
                  <span style="background:#1a3a5c;color:#4a9eff;font-size:0.72rem;padding:2px 6px;border-radius:4px;font-weight:bold;">${p.position}</span>
                  <span style="color:#7a8fa6;font-size:0.78rem;">🎓 ${p.school || "—"}</span>
                </div>
              </div>
              <div style="text-align:right;flex-shrink:0;margin-left:12px;">
                <div style="color:#ffd93d;font-weight:bold;font-size:1.1rem;">${score}</div>
                <div style="color:${voeColor};font-size:0.8rem;">${voe >= 0 ? "+" : ""}${voe.toFixed(1)} vs exp</div>
              </div>
            </div>
          </div>
        `;
        })
        .join("")}
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">
      <button onclick="startSimulation()"
        style="padding:12px;background:linear-gradient(135deg,#ff6b6b,#ff8e53);border:none;border-radius:8px;color:#1a1a2e;font-weight:bold;cursor:pointer;font-size:0.9rem;">
        Draft Again 🔄
      </button>
      <button onclick="renderSetupScreen();selectedMode=null;"
        style="padding:12px;background:#0f1923;border:2px solid #ff6b6b;border-radius:8px;color:#ff6b6b;font-weight:bold;cursor:pointer;font-size:0.9rem;">
        Change Team
      </button>
      <button onclick="closeSimulator()"
        style="padding:12px;background:#0f1923;border:2px solid #2e3f5c;border-radius:8px;color:#7a8fa6;font-weight:bold;cursor:pointer;font-size:0.9rem;">
        Close
      </button>
    </div>
  `;
}
