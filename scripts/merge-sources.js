const fs = require("fs");
const path = require("path");

// Get project root
const projectRoot = path.resolve(__dirname, "..");

// Position normalization mapping
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
  iol: "IOL",
  g: "IOL",
  c: "IOL",
  guard: "IOL",
  center: "IOL",
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
  return `${name}|${normalizePosition(position)}|${school}`.toLowerCase();
}

// Load all sources
let buzzData = [];
let bleacherData = [];
let pffData = [];

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

// Create map for merged players
const playerMap = new Map();

// Add NFL Draft Buzz players
buzzData.forEach((player) => {
  const key = getPlayerKey(player.name, player.position, player.school);
  playerMap.set(key, {
    buzz: player,
    name: player.name,
    school: player.school,
    position: normalizePosition(player.position),
    weight: player.weight,
    height: player.height,
    forty: player.forty,
    summary: player.summary,
  });
});

// Add Bleacher Report players
bleacherData.forEach((player) => {
  const key = getPlayerKey(player.name, player.position, player.school);
  if (playerMap.has(key)) {
    const existing = playerMap.get(key);
    existing.bleacher = player;
    playerMap.set(key, existing);
  } else {
    playerMap.set(key, {
      bleacher: player,
      name: player.name,
      school: player.school,
      position: normalizePosition(player.position),
      weight: null,
      height: null,
      forty: null,
    });
  }
});

// Add PFF players
pffData.forEach((player) => {
  const key = getPlayerKey(player.name, player.position, player.school);
  if (playerMap.has(key)) {
    const existing = playerMap.get(key);
    existing.pff = player;
    playerMap.set(key, existing);
  } else {
    playerMap.set(key, {
      pff: player,
      name: player.name,
      school: player.school,
      position: normalizePosition(player.position),
      weight: null,
      height: null,
      forty: null,
    });
  }
});

// Calculate combined score - penalize only players with single source
function calculateCombinedScore(data) {
  let scores = [];
  let sourcesFound = 0;

  // Check each source
  if (data.pff?.grade) {
    scores.push(data.pff.grade);
    sourcesFound++;
  }
  if (data.buzz?.rating) {
    scores.push(data.buzz.rating);
    sourcesFound++;
  }
  if (data.bleacher?.grade) {
    scores.push(data.bleacher.grade * 10);
    sourcesFound++;
  }

  if (sourcesFound === 0) return 0;

  // Calculate average of available scores
  const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;

  // Apply penalty ONLY if only 1 source (-4 points)
  let finalScore = averageScore;
  if (sourcesFound === 1) {
    finalScore = averageScore - 10;
  }

  // Ensure score doesn't go below 0
  finalScore = Math.max(0, finalScore);

  return Math.round(finalScore * 10) / 10;
}

// Create merged players array
const mergedPlayers = [];

for (let [key, data] of playerMap) {
  const combinedScore = calculateCombinedScore(data);
  const sourcesCount = [data.buzz, data.bleacher, data.pff].filter(
    Boolean,
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

  if (data.buzz) {
    mergedPlayer.rankings.buzz = { rating: data.buzz.rating };
    if (data.buzz.summary) mergedPlayer.summary = data.buzz.summary;
  }
  if (data.bleacher) {
    mergedPlayer.rankings.bleacher = { grade: data.bleacher.grade };
  }
  if (data.pff) {
    mergedPlayer.rankings.pff = { grade: data.pff.grade };
  }

  mergedPlayers.push(mergedPlayer);
}

// Sort by combined score
mergedPlayers.sort((a, b) => b.combined_score - a.combined_score);

// Save merged file
const outputPath = path.join(dataDir, "players.json");
fs.writeFileSync(outputPath, JSON.stringify(mergedPlayers, null, 2));

// Statistics
const withBuzz = mergedPlayers.filter((p) => p.rankings.buzz).length;
const withBR = mergedPlayers.filter((p) => p.rankings.bleacher).length;
const withPFF = mergedPlayers.filter((p) => p.rankings.pff).length;
const allThree = mergedPlayers.filter(
  (p) => p.rankings.buzz && p.rankings.bleacher && p.rankings.pff,
).length;
const withTwo = mergedPlayers.filter((p) => p.sources_count === 2).length;
const withOne = mergedPlayers.filter((p) => p.sources_count === 1).length;

console.log(
  `\n✅ Merged ${mergedPlayers.length} unique players into players.json`,
);
console.log(`\n📊 Merge Statistics:`);
console.log(`   - Have Buzz rating: ${withBuzz}`);
console.log(`   - Have B/R grade: ${withBR}`);
console.log(`   - Have PFF grade: ${withPFF}`);
console.log(`   - Have ALL 3 sources: ${allThree}`);
console.log(`   - Have 2 sources: ${withTwo} (no penalty)`);
console.log(`   - Have 1 source: ${withOne} (-10 point penalty)`);

console.log("\n📊 Top 20 Combined Rankings:");
console.log("━".repeat(80));
mergedPlayers.slice(0, 20).forEach((p, i) => {
  const buzz = p.rankings.buzz?.rating || "—";
  const br = p.rankings.bleacher?.grade || "—";
  const pff = p.rankings.pff?.grade || "—";
  const penalty = p.sources_count === 1 ? "(-4 penalty)" : "";
  console.log(`${i + 1}. ${p.name} (${p.position}) - ${p.school}`);
  console.log(
    `   Combined: ${p.combined_score} | Buzz: ${buzz} | B/R: ${br} | PFF: ${pff} | ${p.sources_count}/3 sources ${penalty}`,
  );
});

// Show example of penalty
console.log("\n📊 Single-source players (penalized -4):");
const oneSourcePlayers = mergedPlayers
  .filter((p) => p.sources_count === 1)
  .slice(0, 5);
oneSourcePlayers.forEach((p) => {
  const sourceName = Object.keys(p.rankings)[0];
  let originalScore = 0;
  if (sourceName === "buzz") originalScore = p.rankings.buzz.rating;
  if (sourceName === "bleacher") originalScore = p.rankings.bleacher.grade * 10;
  if (sourceName === "pff") originalScore = p.rankings.pff.grade;
  console.log(
    `   ${p.name}: ${originalScore} → ${p.combined_score} (${sourceName} only, -10)`,
  );
});
