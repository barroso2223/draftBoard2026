const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const dataDir = path.join(projectRoot, "data");

// ─── Name Normalization ───────────────────────────────────────
function normalizeName(name) {
  if (!name) return "";
  let n = name.trim().replace(/\s+/g, " ");
  n = n.replace(/J\.\.\./gi, "Jr.").replace(/J\.\./gi, "Jr.");
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
  const parts = n.split(/[\s,]+/);
  const last = parts[parts.length - 1].toLowerCase();
  if (suffixMap[last]) {
    parts[parts.length - 1] = suffixMap[last];
    n = parts.join(" ");
  }
  return n.trim();
}

// ─── Name Aliases (alternate → canonical) ────────────────────
const NAME_ALIASES = {
  "kc concepcion": "Kevin Concepcion",
  "kevin concepcion": "Kevin Concepcion",
  "c.j. allen": "CJ Allen",
  "cj allen": "CJ Allen",
  "lj johnson jr": "LJ Johnson Jr.",
  "rueben bain jr.": "Rueben Bain Jr.",
  "de'zhaun stribling": "De'Zhaun Stribling",
  "skyler bell": "Skyler Bell",
  "jake slaughter": "Jake Slaughter",
  "zxavian harris": "Zxavian Harris",
  "justin joly": "Justin Joly",
  "jalon kilgore": "Jalon Kilgore",
  "sam hecht": "Sam Hecht",
  "brian parker ii": "Brian Parker II",
  "trey zuhn iii": "Trey Zuhn III",
  "dani dennis-sutton": "Dani Dennis-Sutton",
  "peter woods": "Peter Woods",
  "francis mauigoa": "Francis Mauigoa",
  "keldric faulk": "Keldric Faulk",
  "chris bell": "Chris Bell",
  "logan jones": "Logan Jones",
  "jager burton": "Jager Burton",
  "parker brailsford": "Parker Brailsford",
  "pat coogan": "Pat Coogan",
  "max bredeson": "Max Bredeson",
  "dillon wade": "Dillon Wade",
  "alex harkey": "Alex Harkey",
  "mat gulbin": "Matt Gulbin",
  "garrett digiorgio": "Garrett DiGiorgio",
  "gennings dunker": "Gennings Dunker",
  "lt overton": "LT Overton",
  "brandon cleveland": "Brandon Cleveland",
  "jackie marshall": "Jackie Marshall",
  "dae'quan wright": "Dae'Quan Wright",
  "emmanuel henderson jr.": "Emmanuel Henderson Jr.",
  "emmanel henderson jr": "Emmanuel Henderson Jr.",
  "kaleb proctor": "Kaleb Proctor",
  "joe fagnano": "Joe Fagnano",
  "carver willis": "Carver Willis",
  "caullin lacy": "Caullin Lacy",
  "harrison wallace iii": "Harrison Wallace III",
  "diego pounds": "Diego Pounds",
  "james brockermeyer": "James Brockermeyer",
  "toriano pride jr.": "Toriano Pride Jr.",
  "toriano pride": "Toriano Pride Jr.",
  "tyren montgomery": "Tyren Montgomery",
  "treydan stukes": "Treydan Stukes",
  "jadon canady": "Jadon Canady",
  "jalen huskey": "Jalen Huskey",
  "lorenzo styles jr.": "Lorenzo Styles Jr.",
  "lorenzo styles": "Lorenzo Styles Jr.",
};

function resolveNameAlias(name) {
  const key = normalizeName(name).toLowerCase().trim();
  return NAME_ALIASES[key] || normalizeName(name);
}

// ─── School Aliases ───────────────────────────────────────────
const SCHOOL_ALIASES = {
  "ole miss": "Mississippi",
  uconn: "Connecticut",
  connecticut: "Connecticut",
  pitt: "Pittsburgh",
  ucf: "UCF",
  smu: "SMU",
  byu: "BYU",
  utsa: "UTSA",
  "se louisiana": "Southeastern Louisiana",
  "southeastern louisiana": "Southeastern Louisiana",
  "stephen f. austin": "Stephen F. Austin",
  "north carolina state": "NC State",
  louisvilles: "Louisville",
  "incarnate words": "Incarnate Word",
  "john carroll": "John Carroll",
  louisvilles: "Louisville",
  "miami (oh)": "Miami (OH)",
};

function resolveSchool(school) {
  if (!school) return "";
  return SCHOOL_ALIASES[school.toLowerCase().trim()] || school;
}

// ─── Position Normalization ───────────────────────────────────
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
  lt: "OT",
  rt: "OT",
  iol: "OG",
  g: "OG",
  guard: "OG",
  og: "OG",
  c: "C",
  center: "C",
};

function normalizePosition(pos) {
  if (!pos) return "UNKNOWN";
  const lp = pos.toLowerCase().trim();
  if (positionMap[lp]) return positionMap[lp];
  for (const [k, v] of Object.entries(positionMap)) {
    if (lp.includes(k)) return v;
  }
  return pos.toUpperCase();
}

// ─── Player Key ───────────────────────────────────────────────
function getPlayerKey(name, position) {
  // Key by canonical name + position ONLY (ignore school differences)
  const canonical = resolveNameAlias(name);
  return `${canonical}|${normalizePosition(position)}`.toLowerCase();
}

// ─── Load Sources ─────────────────────────────────────────────
function loadSource(filename, label) {
  try {
    const data = JSON.parse(
      fs.readFileSync(path.join(dataDir, filename), "utf8"),
    );
    console.log(`✅ Loaded ${data.length} players from ${label}`);
    return data;
  } catch {
    console.log(`⚠️  ${filename} not found`);
    return [];
  }
}

const buzzData = loadSource("nfldraftbuzz.json", "NFL Draft Buzz");
const bleachData = loadSource("bleacherreport.json", "Bleacher Report");
const pffData = loadSource("pff.json", "PFF");
const espnData = loadSource("espn.json", "ESPN");
const scoutData = loadSource("scoutingGrade.json", "Scouting Grade");

// ─── Merge Players ────────────────────────────────────────────
const playerMap = new Map();

function addPlayer(player, sourceName) {
  const key = getPlayerKey(player.name, player.position);
  const canonicalName = resolveNameAlias(player.name);
  const canonicalSchool = resolveSchool(player.school);

  if (playerMap.has(key)) {
    const existing = playerMap.get(key);
    existing[sourceName] = player;
    // Fill in missing physical data
    if (player.weight && !existing.weight) existing.weight = player.weight;
    if (player.height && !existing.height) existing.height = player.height;
    if (player.forty && !existing.forty) existing.forty = player.forty;
    if (player.summary && !existing.summary) existing.summary = player.summary;
    // Prefer canonical school (first non-null wins, but alias overrides)
    if (!existing.school || resolveSchool(player.school) !== player.school) {
      existing.school = canonicalSchool;
    }
    playerMap.set(key, existing);
  } else {
    playerMap.set(key, {
      [sourceName]: player,
      name: canonicalName,
      school: canonicalSchool,
      position: normalizePosition(player.position),
      weight: player.weight || null,
      height: player.height || null,
      forty: player.forty || null,
      summary: player.summary || null,
    });
  }
}

buzzData.forEach((p) => addPlayer(p, "buzz"));
bleachData.forEach((p) => addPlayer(p, "bleacher"));
pffData.forEach((p) => addPlayer(p, "pff"));
espnData.forEach((p) => addPlayer(p, "espn"));
scoutData.forEach((p) => addPlayer(p, "scouting"));

// ─── Combined Score (with single-source penalty) ───────────────
function calculateCombinedScore(data) {
  const scores = [];

  if (data.espn?.grade) scores.push(data.espn.grade);
  if (data.pff?.grade) scores.push(data.pff.grade);
  if (data.buzz?.rating) scores.push(data.buzz.rating);
  if (data.bleacher?.grade) scores.push(data.bleacher.grade);
  if (data.scouting?.grade) scores.push(data.scouting.grade);

  if (scores.length === 0) return 0;

  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const final = scores.length === 1 ? avg - 10 : avg;
  return Math.round(Math.max(0, final) * 10) / 10;
}

// ─── Build Final Array ────────────────────────────────────────
const mergedPlayers = [];

for (const [key, data] of playerMap) {
  const combinedScore = calculateCombinedScore(data);
  const sourcesCount = ["buzz", "bleacher", "pff", "espn", "scouting"].filter(
    (s) => data[s],
  ).length;

  const player = {
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

  if (data.buzz) player.rankings.buzz = { rating: data.buzz.rating };
  if (data.bleacher) player.rankings.bleacher = { grade: data.bleacher.grade };
  if (data.pff) player.rankings.pff = { grade: data.pff.grade };
  if (data.espn) player.rankings.espn = { grade: data.espn.grade };
  if (data.scouting) player.rankings.scouting = { grade: data.scouting.grade };
  if (data.summary) player.summary = data.summary;

  mergedPlayers.push(player);
}

mergedPlayers.sort((a, b) => b.combined_score - a.combined_score);

// ─── Save ─────────────────────────────────────────────────────
const outputPath = path.join(dataDir, "players.json");
fs.writeFileSync(outputPath, JSON.stringify(mergedPlayers, null, 2));

// ─── Stats ────────────────────────────────────────────────────
console.log(
  `\n✅ Merged ${mergedPlayers.length} unique players into players.json`,
);
console.log(`\n📊 Source breakdown:`);
["buzz", "bleacher", "pff", "espn", "scouting"].forEach((s) => {
  console.log(`   ${s}: ${mergedPlayers.filter((p) => p.rankings[s]).length}`);
});
[5, 4, 3, 2, 1].forEach((n) => {
  console.log(
    `   ${n} sources: ${mergedPlayers.filter((p) => p.sources_count === n).length}`,
  );
});

console.log(`\n📊 Top 20:`);
mergedPlayers.slice(0, 20).forEach((p, i) => {
  const b = p.rankings.buzz?.rating || "—";
  const br = p.rankings.bleacher?.grade || "—";
  const pf = p.rankings.pff?.grade || "—";
  const e = p.rankings.espn?.grade || "—";
  const sc = p.rankings.scouting?.grade || "—";
  console.log(`${i + 1}. ${p.name} (${p.position}) ${p.school}`);
  console.log(
    `   Score: ${p.combined_score} | Buzz:${b} BR:${br} PFF:${pf} ESPN:${e} Scout:${sc} | ${p.sources_count}/5 sources`,
  );
});
