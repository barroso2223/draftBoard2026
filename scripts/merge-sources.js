const fs = require("fs");
const path = require("path");

// Get project root
const projectRoot = path.resolve(__dirname, "..");

// ============================================================
// NAME NORMALIZATION (handles Jr., Sr., II, III, etc.)
// ============================================================
function normalizeName(name) {
  if (!name) return "";
  let normalized = name.trim().replace(/\s+/g, " ");
  // Fix common truncations like "J..." -> "Jr."
  normalized = normalized.replace(/J\.\.\./gi, "Jr.");
  normalized = normalized.replace(/J\.\./gi, "Jr.");
  // Suffix mapping (case‑insensitive, with or without period)
  const suffixMap = {
    junior: "Jr.",
    jr: "Jr.",
    "jr.": "Jr.",
    sr: "Sr.",
    "sr.": "Sr.",
    senior: "Sr.",
    ii: "II",
    iii: "III",
    iv: "IV",
    v: "V",
  };
  // Check for suffix at the end of the name (after a space or comma)
  const parts = normalized.split(/[\s,]+/);
  const lastPart = parts[parts.length - 1].toLowerCase();
  if (suffixMap[lastPart]) {
    // Replace the last part with the standard suffix
    parts[parts.length - 1] = suffixMap[lastPart];
    normalized = parts.join(" ");
  }
  // Also handle "First Last Jr" without comma
  const suffixPattern = /\s+(jr|jr\.|junior|sr|sr\.|senior|ii|iii|iv|v)$/i;
  normalized = normalized.replace(suffixPattern, (match, p1) => {
    const key = p1.toLowerCase().replace(/\.$/, "");
    return ` ${suffixMap[key] || p1}`;
  });
  return normalized.trim();
}

// ============================================================
// POSITION NORMALIZATION (unchanged)
// ============================================================
const positionMap = {
  edge: "EDGE",
  de: "EDGE",
  "de/ed": "EDGE",
  ed: "EDGE",
  lb: "LB",
  ilb: "LB",
  olb: "LB",
  s: "S",
  saf: "S",
  safety: "S",
  fs: "S",
  ss: "S",
  cb: "CB",
  cornerback: "CB",
  dt: "DT",
  dl: "DT",
  di: "DT",
  qb: "QB",
  rb: "RB",
  hb: "RB",
  halfback: "RB",
  wr: "WR",
  te: "TE",
  ot: "OT",
  t: "OT",
  tackle: "OT",
  iol: "IOL",
  g: "IOL",
  c: "IOL",
  guard: "IOL",
  center: "IOL",
  og: "IOL",
};

function normalizePosition(position) {
  if (!position) return "UNKNOWN";
  const lowerPos = position.toLowerCase().trim();
  if (positionMap[lowerPos]) return positionMap[lowerPos];
  for (const [key, value] of Object.entries(positionMap)) {
    if (lowerPos.includes(key)) return value;
  }
  return position.toUpperCase();
}

function getPlayerKey(name, position, school) {
  const normName = normalizeName(name);
  return `${normName}|${normalizePosition(position)}|${school}`.toLowerCase();
}

// Load all sources
let buzzData = [];
let bleacherData = [];
let pffData = [];
let espnData = [];
let scoutingData = [];

const dataDir = path.join(projectRoot, "data");

try {
  buzzData = JSON.parse(
    fs.readFileSync(path.join(dataDir, "nfldraftbuzz.json"), "utf8"),
  );
  console.log(`✅ Loaded ${buzzData.length} players from NFL Draft Buzz`);
} catch (err) {
  console.log("⚠️ nfldraftbuzz.json not found");
}

try {
  bleacherData = JSON.parse(
    fs.readFileSync(path.join(dataDir, "bleacherreport.json"), "utf8"),
  );
  console.log(`✅ Loaded ${bleacherData.length} players from Bleacher Report`);
} catch (err) {
  console.log("⚠️ bleacherreport.json not found");
}

try {
  pffData = JSON.parse(fs.readFileSync(path.join(dataDir, "pff.json"), "utf8"));
  console.log(`✅ Loaded ${pffData.length} players from PFF`);
} catch (err) {
  console.log("⚠️ pff.json not found");
}

try {
  espnData = JSON.parse(
    fs.readFileSync(path.join(dataDir, "espn.json"), "utf8"),
  );
  console.log(`✅ Loaded ${espnData.length} players from ESPN`);
} catch (err) {
  console.log("⚠️ espn.json not found");
}

try {
  scoutingData = JSON.parse(
    fs.readFileSync(path.join(dataDir, "scoutingGrade.json"), "utf-8"),
  );
  console.log(`✅ Loaded ${scoutingData.length} players from Scouting Grade`);
} catch (err) {
  console.log("⚠️ scoutingGrade.json not found");
}

// ============================================================
// MERGING LOGIC
// ============================================================

// Create map for merged players
const playerMap = new Map();

// Helper to add player
function addPlayer(source, player, sourceName) {
  const normalizePlayerName = normalizeName(player.name);
  const key = getPlayerKey(player.name, player.position, player.school);

  if (playerMap.has(key)) {
    const existing = playerMap.get(key);
    existing[sourceName] = player;
    if (player.weight && !existing.weight) existing.weight = player.weight;
    if (player.height && !existing.height) existing.height = player.height;
    if (player.forty && !existing.forty) existing.forty = player.forty;
    if (player.summary && !existing.summary) existing.summary = player.summary;
    if (existing.name === player.name && normalizePlayerName !== player.name) {
      existing.name = normalizePlayerName;
    }
    playerMap.set(key, existing);
  } else {
    playerMap.set(key, {
      [sourceName]: player,
      name: normalizePlayerName,
      school: player.school,
      position: normalizePosition(player.position),
      weight: player.weight || null,
      height: player.height || null,
      forty: player.forty || null,
      summary: player.summary || null,
    });
  }
}

// Add all sources
buzzData.forEach((p) => addPlayer(p, p, "buzz"));
bleacherData.forEach((p) => addPlayer(p, p, "bleacher"));
pffData.forEach((p) => addPlayer(p, p, "pff"));
espnData.forEach((p) => addPlayer(p, p, "espn"));
scoutingData.forEach((p) => addPlayer(p, p, "scouting"));

// Calculate combined score with penalty for single-source players
function calculateCombinedScore(data) {
  let scores = [];
  let sourcesFound = 0;

  if (data.espn?.grade) {
    scores.push(data.espn.grade);
    sourcesFound++;
  }
  if (data.pff?.grade) {
    scores.push(data.pff.grade);
    sourcesFound++;
  }
  if (data.buzz?.rating) {
    scores.push(data.buzz.rating);
    sourcesFound++;
  }
  if (data.bleacher?.grade) {
    scores.push(data.bleacher.grade);
    sourcesFound++;
  }
  if (data.scouting?.grade) {
    scores.push(data.scouting.grade);
    sourcesFound++;
  }

  if (sourcesFound === 0) return 0;

  const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;

  // Penalty: -10 points if only 1 source
  let finalScore = averageScore;
  if (sourcesFound === 1) {
    finalScore = averageScore - 10;
  }

  return Math.round(Math.max(0, finalScore) * 10) / 10;
}

// ============================================================
// BUILD FINAL ARRAY
// ============================================================
// Create merged players array
const mergedPlayers = [];

for (let [key, data] of playerMap) {
  const combinedScore = calculateCombinedScore(data);
  const sourcesCount = ["buzz", "bleacher", "pff", "espn", "scouting"].filter(
    (s) => data[s],
  ).length;

  const mergedPlayer = {
    name: data.name,
    position: data.position,
    school: data.school,
    team: "",
    weight: data.weight || null,
    height: data.height || null,
    forty: data.forty || null,
    drafted: false,
    combined_score: combinedScore,
    sources_count: sourcesCount,
    rankings: {},
  };

  if (data.buzz) mergedPlayer.rankings.buzz = { rating: data.buzz.rating };
  if (data.bleacher)
    mergedPlayer.rankings.bleacher = { grade: data.bleacher.grade };
  if (data.pff) mergedPlayer.rankings.pff = { grade: data.pff.grade };
  if (data.espn) mergedPlayer.rankings.espn = { grade: data.espn.grade };
  if (data.scouting)
    mergedPlayer.rankings.scouting = { grade: data.scouting.grade };
  if (data.summary) mergedPlayer.summary = data.summary;

  mergedPlayers.push(mergedPlayer);
}

// Sort by combined score
mergedPlayers.sort((a, b) => b.combined_score - a.combined_score);

// Save merged file
const outputPath = path.join(dataDir, "players.json");
fs.writeFileSync(outputPath, JSON.stringify(mergedPlayers, null, 2));

// ============================================================
// STATISTICS
// ============================================================
const withBuzz = mergedPlayers.filter((p) => p.rankings.buzz).length;
const withBR = mergedPlayers.filter((p) => p.rankings.bleacher).length;
const withPFF = mergedPlayers.filter((p) => p.rankings.pff).length;
const withESPN = mergedPlayers.filter((p) => p.rankings.espn).length;
const withScouting = mergedPlayers.filter((p) => p.rankings.scouting).length;
const allFive = mergedPlayers.filter(
  (p) =>
    p.rankings.buzz &&
    p.rankings.bleacher &&
    p.rankings.pff &&
    p.rankings.espn &&
    p.rankings.scouting,
).length;
const withFour = mergedPlayers.filter((p) => p.sources_count === 4).length;
const withThree = mergedPlayers.filter((p) => p.sources_count === 3).length;
const withTwo = mergedPlayers.filter((p) => p.sources_count === 2).length;
const withOne = mergedPlayers.filter((p) => p.sources_count === 1).length;

console.log(
  `\n✅ Merged ${mergedPlayers.length} unique players into players.json`,
);
console.log(
  `\n📊 Merge Statistics (5 sources: Buzz, B/R, PFF, ESPN, ScoutingGrade):`,
);
console.log(`   - Have Buzz rating: ${withBuzz}`);
console.log(`   - Have B/R grade: ${withBR}`);
console.log(`   - Have PFF grade: ${withPFF}`);
console.log(`   - Have ESPN grade: ${withESPN}`);
console.log(`   - Have Scouting grade: ${withScouting}`);
console.log(`   - Have ALL 5 sources: ${allFive}`);
console.log(`   - Have 4 sources: ${withFour} (no penalty)`);
console.log(`   - Have 3 sources: ${withThree} (no penalty)`);
console.log(`   - Have 2 sources: ${withTwo} (no penalty)`);
console.log(`   - Have 1 source: ${withOne} (-10 point penalty)`);

console.log("\n📊 Top 20 Combined Rankings (5 sources):");
console.log("━".repeat(85));
mergedPlayers.slice(0, 20).forEach((p, i) => {
  const buzz = p.rankings.buzz?.rating || "—";
  const br = p.rankings.bleacher?.grade || "—";
  const pff = p.rankings.pff?.grade || "—";
  const espn = p.rankings.espn?.grade || "—";
  const scouting = p.rankings.scouting?.grade || "—";
  const penalty = p.sources_count === 1 ? "(-10 penalty)" : "";
  console.log(`${i + 1}. ${p.name} (${p.position}) - ${p.school}`);
  console.log(
    `   Combined: ${p.combined_score} | Buzz: ${buzz} | B/R: ${br} | PFF: ${pff} | ESPN: ${espn} | SCOUTING: ${scouting} | ${p.sources_count}/5 sources ${penalty}`,
  );
});
