// scripts/fetch-draft-order.js
// Run: node scripts/fetch-draft-order.js

const fs = require("fs");
const path = require("path");

const TEAM_MAP = {
  "Las Vegas Raiders": "Las Vegas Raiders",
  "New York Jets": "New York Jets",
  "Arizona Cardinals": "Arizona Cardinals",
  "Tennessee Titans": "Tennessee Titans",
  "New York Giants": "New York Giants",
  "Cleveland Browns": "Cleveland Browns",
  "Washington Commanders": "Washington Commanders",
  "New Orleans Saints": "New Orleans Saints",
  "Kansas City Chiefs": "Kansas City Chiefs",
  "Cincinnati Bengals": "Cincinnati Bengals",
  "Miami Dolphins": "Miami Dolphins",
  "Dallas Cowboys": "Dallas Cowboys",
  "Los Angeles Rams": "Los Angeles Rams",
  "Baltimore Ravens": "Baltimore Ravens",
  "Tampa Bay Buccaneers": "Tampa Bay Buccaneers",
  "Indianapolis Colts": "Indianapolis Colts",
  "Detroit Lions": "Detroit Lions",
  "Minnesota Vikings": "Minnesota Vikings",
  "Carolina Panthers": "Carolina Panthers",
  "Green Bay Packers": "Green Bay Packers",
  "Pittsburgh Steelers": "Pittsburgh Steelers",
  "Los Angeles Chargers": "Los Angeles Chargers",
  "Philadelphia Eagles": "Philadelphia Eagles",
  "Jacksonville Jaguars": "Jacksonville Jaguars",
  "Chicago Bears": "Chicago Bears",
  "Buffalo Bills": "Buffalo Bills",
  "San Francisco 49ers": "San Francisco 49ers",
  "Houston Texans": "Houston Texans",
  "Denver Broncos": "Denver Broncos",
  "New England Patriots": "New England Patriots",
  "Seattle Seahawks": "Seattle Seahawks",
  "Atlanta Falcons": "Atlanta Falcons",
};

// ─── ESPN Fetch ───────────────────────────────────────────────
async function fetchFromESPN() {
  console.log("Trying ESPN API...");
  const roundsUrl =
    "https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2026/draft/rounds?limit=10";

  const roundsRes = await fetch(roundsUrl);
  if (!roundsRes.ok) throw new Error(`ESPN rounds HTTP ${roundsRes.status}`);
  const roundsData = await roundsRes.json();

  if (!roundsData.items?.length) throw new Error("No rounds in ESPN response");

  const picks = [];

  for (const roundRef of roundsData.items) {
    if (!roundRef.$ref) continue;

    const roundRes = await fetch(roundRef.$ref); // ← fixed variable name
    if (!roundRes.ok) throw new Error(`Round fetch failed: ${roundRes.status}`);
    const roundData = await roundRes.json();

    const roundNum = roundData.number;
    console.log(
      `  Round ${roundNum} — ${roundData.picks?.items?.length || 0} picks`,
    );

    if (!roundData.picks?.items) continue;

    for (const pickRef of roundData.picks.items) {
      if (!pickRef.$ref) continue;

      const pickRes = await fetch(pickRef.$ref);
      if (!pickRes.ok) continue;
      const pickData = await pickRes.json();

      let teamName = "Unknown";
      if (pickData.currentTeam?.$ref) {
        const teamRes = await fetch(pickData.currentTeam.$ref);
        const teamData = await teamRes.json();
        teamName = teamData.displayName || teamData.name || "Unknown";
      }

      picks.push({
        overall: pickData.id || picks.length + 1,
        round: roundNum,
        pick: pickData.number || picks.length,
        team: TEAM_MAP[teamName] || teamName,
      });
    }
  }

  if (picks.length < 200)
    throw new Error(`Only got ${picks.length} picks from ESPN`);
  return picks.sort((a, b) => a.overall - b.overall);
}

// ─── Wikipedia Fetch ──────────────────────────────────────────
async function fetchFromWikipedia() {
  console.log("Trying Wikipedia API...");

  const url =
    "https://en.wikipedia.org/w/api.php?" +
    new URLSearchParams({
      action: "parse",
      page: "2026_NFL_draft",
      prop: "wikitext",
      format: "json",
      origin: "*",
    });

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Wikipedia HTTP ${res.status}`);
  const data = await res.json();
  const wikitext = data?.parse?.wikitext?.["*"];
  if (!wikitext) throw new Error("No wikitext in Wikipedia response");

  const picks = [];
  const roundCounts = {};
  let overall = 0;

  const lines = wikitext.split("\n");

  for (const line of lines) {
    // Format 1: tab-separated  "1\t1\tLas Vegas Raiders\t..."
    const tabMatch = line.match(/^(\d+)\t(\d+)\t([A-Z][A-Za-z\s'.]+?)(?:\t|$)/);

    // Format 2: pipe-separated "| 1 || 1 || Las Vegas Raiders"
    const pipeMatch = line.match(
      /^\|\s*(\d+)\s*\|\|\s*(\d+)\s*\|\|\s*([A-Z][A-Za-z\s'.]+?)(?:\s*\|\||$)/,
    );

    // Format 3: wiki template "{{nfl team|Las Vegas Raiders"
    const tmplMatch = line.match(
      /^\|\s*(\d+)\s*\|\|\s*(\d+)\s*\|\|.*?(?:nfl\s*team\|)([A-Z][A-Za-z\s'.]+?)(?:\||\})/i,
    );

    const m = tabMatch || pipeMatch || tmplMatch;
    if (!m) continue;

    const round = parseInt(m[1]);
    const pickNum = parseInt(m[2]);
    if (isNaN(round) || isNaN(pickNum) || round < 1 || round > 7) continue;

    // Skip header row
    if (m[3].trim().toLowerCase().includes("nfl team")) continue;

    overall++;
    if (!roundCounts[round]) roundCounts[round] = 0;
    roundCounts[round]++;

    const teamRaw = m[3]
      .trim()
      .replace(/\|.*/g, "")
      .replace(/\}.*/g, "")
      .replace(/\[.*/g, "")
      .trim();

    if (!teamRaw || teamRaw.length < 3) continue;

    picks.push({
      overall,
      round,
      pick: roundCounts[round],
      team: TEAM_MAP[teamRaw] || teamRaw,
    });
  }

  console.log(`  Parsed ${picks.length} picks from Wikipedia`);
  if (picks.length < 200)
    throw new Error(
      `Only ${picks.length} picks — table format may have changed`,
    );
  return picks;
}

// ─── Main ─────────────────────────────────────────────────────
async function main() {
  const outputPath = path.join(__dirname, "../data/draftOrder.json");
  let picks = [];

  // Try ESPN first
  try {
    picks = await fetchFromESPN();
    console.log(`✅ ESPN: ${picks.length} picks`);
  } catch (err) {
    console.warn(`⚠️  ESPN failed: ${err.message}`);

    // Try Wikipedia
    try {
      picks = await fetchFromWikipedia();
      console.log(`✅ Wikipedia: ${picks.length} picks`);
    } catch (err2) {
      console.error(`❌ Wikipedia also failed: ${err2.message}`);
      console.log("💾 Keeping existing draftOrder.json unchanged.");
      process.exit(1);
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(picks, null, 2));
  console.log(`\n✅ Saved ${picks.length} picks to data/draftOrder.json`);

  // Show first 5 and last 5
  console.log("\nFirst 5 picks:");
  picks
    .slice(0, 5)
    .forEach((p) =>
      console.log(`  #${p.overall} Rd${p.round} Pk${p.pick}: ${p.team}`),
    );
  console.log("Last 5 picks:");
  picks
    .slice(-5)
    .forEach((p) =>
      console.log(`  #${p.overall} Rd${p.round} Pk${p.pick}: ${p.team}`),
    );
}

main();
