const fs = require("fs");

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

try {
  buzzData = JSON.parse(fs.readFileSync("./data/nfldraftbuzz.json", "utf8"));
  console.log(`✅ Loaded ${buzzData.length} players from NFL Draft Buzz`);
} catch (err) {
  console.log("⚠️ nfldraftbuzz.json not found");
}

try {
  bleacherData = JSON.parse(
    fs.readFileSync("./data/bleacherreport.json", "utf8"),
  );
  console.log(`✅ Loaded ${bleacherData.length} players from Bleacher Report`);
} catch (err) {
  console.log("⚠️ bleacherreport.json not found");
}

try {
  pffData = JSON.parse(fs.readFileSync("./data/pff.json", "utf8"));
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

// Calculate combined score (equal weights for all three)
function calculateCombinedScore(data) {
  let scores = [];
  let weights = [];
  let weightPerSource = 1 / 3; // Equal 33.3% each

  // PFF grade (0-100 scale)
  if (data.pff?.grade) {
    scores.push(data.pff.grade);
    weights.push(weightPerSource);
  }

  // NFL Draft Buzz rating (0-100 scale)
  if (data.buzz?.rating) {
    scores.push(data.buzz.rating);
    weights.push(weightPerSource);
  }

  // Bleacher Report (convert 0-10 to 0-100)
  if (data.bleacher?.grade) {
    const normalized = data.bleacher.grade * 10;
    scores.push(normalized);
    weights.push(weightPerSource);
  }

  if (scores.length === 0) return 0;
  if (scores.length === 1) return scores[0];

  // Adjust weights for missing sources (redistribute evenly)
  const adjustedWeights = weights.map(
    (w) => w / weights.reduce((a, b) => a + b, 0),
  );
  let weightedSum = 0;
  for (let i = 0; i < scores.length; i++) {
    weightedSum += scores[i] * adjustedWeights[i];
  }
  return Math.round(weightedSum * 10) / 10;
}

// Create merged players array
const mergedPlayers = [];

for (let [key, data] of playerMap) {
  const combinedScore = calculateCombinedScore(data);

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
fs.writeFileSync("./data/players.json", JSON.stringify(mergedPlayers, null, 2));

// Statistics
const withBuzz = mergedPlayers.filter((p) => p.rankings.buzz).length;
const withBR = mergedPlayers.filter((p) => p.rankings.bleacher).length;
const withPFF = mergedPlayers.filter((p) => p.rankings.pff).length;
const allThree = mergedPlayers.filter(
  (p) => p.rankings.buzz && p.rankings.bleacher && p.rankings.pff,
).length;

console.log(
  `\n✅ Merged ${mergedPlayers.length} unique players into players.json`,
);
console.log(`\n📊 Merge Statistics:`);
console.log(`   - Have Buzz rating: ${withBuzz}`);
console.log(`   - Have B/R grade: ${withBR}`);
console.log(`   - Have PFF grade: ${withPFF}`);
console.log(`   - Have ALL 3 sources: ${allThree}`);

console.log("\n📊 Top 20 Combined Rankings (equal weights 33.3% each):");
console.log("━".repeat(80));
mergedPlayers.slice(0, 20).forEach((p, i) => {
  const buzz = p.rankings.buzz?.rating || "—";
  const br = p.rankings.bleacher?.grade ? p.rankings.bleacher.grade * 10 : "—";
  const pff = p.rankings.pff?.grade || "—";
  console.log(`${i + 1}. ${p.name} (${p.position}) - ${p.school}`);
  console.log(
    `   Combined: ${p.combined_score} | Buzz: ${buzz} | B/R: ${br === "—" ? "—" : p.rankings.bleacher.grade} | PFF: ${pff}`,
  );
});
