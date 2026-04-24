// scripts/apply-picks.js
// Run: node scripts/apply-picks.js
//
// Reads data/picks.json and:
//   1. Updates players.json — marks each picked player as drafted, adds team/round/pick
//   2. Updates draftOrder.json — marks each slot as filled with the player name

const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "../data");
const picksPath = path.join(dataDir, "picks.json");
const playersPath = path.join(dataDir, "players.json");
const draftOrdPath = path.join(dataDir, "draftOrder.json");

// ─── Load files ───────────────────────────────────────────────
const picks = JSON.parse(fs.readFileSync(picksPath, "utf8"));
const players = JSON.parse(fs.readFileSync(playersPath, "utf8"));
const draftOrder = JSON.parse(fs.readFileSync(draftOrdPath, "utf8"));

console.log(`\n📋 Applying ${picks.length} picks from picks.json...\n`);

// ─── Helpers ──────────────────────────────────────────────────
function normName(name) {
  return (name || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.']/g, "");
}

function findPlayer(name, position, school) {
  const n = normName(name);
  const p = (position || "").toUpperCase();
  const s = (school || "").toLowerCase();

  // 1. Exact name + position
  let match = players.find(
    (pl) => normName(pl.name) === n && (pl.position || "").toUpperCase() === p,
  );
  if (match) return match;

  // 2. Exact name only
  match = players.find((pl) => normName(pl.name) === n);
  if (match) return match;

  // 3. Partial name match
  match = players.find((pl) => {
    const pn = normName(pl.name);
    return pn.includes(n) || n.includes(pn);
  });
  if (match) return match;

  // 4. Last name + school
  const lastName = n.split(" ").pop();
  match = players.find(
    (pl) =>
      normName(pl.name).endsWith(lastName) &&
      (pl.school || "").toLowerCase().includes(s.split(" ")[0]),
  );
  return match || null;
}

// ─── Apply picks ──────────────────────────────────────────────
let matched = 0;
let unmatched = [];

picks.forEach((pick) => {
  // — Update players.json —
  const player = findPlayer(pick.name, pick.position, pick.school);

  if (player) {
    player.drafted = true;
    player.team = pick.team;
    player.draft_round = pick.round;
    player.draft_pick = pick.overall;
    matched++;
    console.log(
      `✅ #${String(pick.overall).padStart(3)} ${pick.name.padEnd(25)} → ${pick.team}`,
    );
  } else {
    unmatched.push(pick);
    console.log(
      `⚠️  #${String(pick.overall).padStart(3)} ${pick.name.padEnd(25)} — NOT FOUND`,
    );
  }

  // — Update draftOrder.json —
  const slot = draftOrder.find((d) => d.overall === pick.overall);
  if (slot) {
    slot.player = pick.name;
    slot.position = pick.position;
    slot.school = pick.school;
    slot.team = pick.team; // update team in case trade changed it
  }
});

// ─── Save files ───────────────────────────────────────────────
fs.writeFileSync(playersPath, JSON.stringify(players, null, 2));
fs.writeFileSync(draftOrdPath, JSON.stringify(draftOrder, null, 2));

// ─── Summary ─────────────────────────────────────────────────
console.log(`\n${"─".repeat(60)}`);
console.log(`✅ players.json   — ${matched} players updated`);
console.log(`✅ draftOrder.json — ${picks.length} slots updated`);

if (unmatched.length > 0) {
  console.log(
    `\n⚠️  ${unmatched.length} players NOT found — fix spelling in picks.json:`,
  );
  unmatched.forEach((p) =>
    console.log(
      `   Pick #${p.overall}: "${p.name}" | ${p.position} | ${p.school}`,
    ),
  );
  console.log(
    `\n   Tip: check players.json for the correct spelling and update picks.json`,
  );
}

console.log(
  `\n🏈 Done! Run: git add data/ && git commit -m "Update draft picks" && git push\n`,
);
