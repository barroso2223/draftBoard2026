// scripts/fetch-picks.cjs
// Scrapes Yahoo Sports for live draft picks

const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const dataDir = path.join(__dirname, "../data");
const picksPath = path.join(dataDir, "picks.json");
const draftOrdPath = path.join(dataDir, "draftOrder.json");

const POS_MAP = {
  SAF: "S",
  G: "OG",
  T: "OT",
  DE: "EDGE",
  ILB: "LB",
  OLB: "EDGE",
  FS: "S",
  SS: "S",
};

function normalizePos(pos) {
  return POS_MAP[pos?.toUpperCase()] || pos?.toUpperCase() || "";
}

async function scrapeYahoo() {
  console.log("Launching browser...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://sports.yahoo.com/nfl/draft/", {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });
  await page.waitForTimeout(6000);

  const fullText = await page.evaluate(() => document.body.innerText);
  await browser.close();

  const picks = [];
  const lines = fullText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const rdPkRegex = /^RD(\d+),\s*PK(\d+)$/i;
  const posRegex =
    /^(QB|RB|WR|TE|OT|OG|OL|C|G|T|EDGE|DE|DT|LB|ILB|OLB|CB|S|SAF|FS|SS|K|P|LS)$/i;

  let i = 0;
  while (i < lines.length) {
    const m = lines[i].match(rdPkRegex);
    if (m) {
      const round = parseInt(m[1]);
      const pickNum = parseInt(m[2]);
      i++;

      // Skip trade note like "(from Cleveland)"
      if (lines[i]?.startsWith("(")) i++;

      const playerName = lines[i] || "";
      const position = lines[i + 1] || "";
      const school = lines[i + 2] || "";

      if (playerName && posRegex.test(position) && school.length > 1) {
        picks.push({
          round,
          pickInRound: pickNum,
          name: playerName,
          position: normalizePos(position),
          school: school,
        });
        i += 3;
        continue;
      }
    }
    i++;
  }

  return picks;
}

async function main() {
  const draftOrder = JSON.parse(fs.readFileSync(draftOrdPath, "utf8"));
  let existingPicks = [];
  try {
    existingPicks = JSON.parse(fs.readFileSync(picksPath, "utf8"));
  } catch (e) {}

  console.log(`📋 Current picks.json: ${existingPicks.length} picks`);

  const scrapedPicks = await scrapeYahoo();
  console.log(`🔍 Yahoo found: ${scrapedPicks.length} picks total`);

  if (scrapedPicks.length === 0) {
    console.log("⚠️  No picks found");
    return;
  }

  // Match to draftOrder by round + pick position to get overall# and team
  const newPicks = [];

  scrapedPicks.forEach((pick) => {
    const roundSlots = draftOrder
      .filter((d) => d.round === pick.round)
      .sort((a, b) => a.overall - b.overall);

    const slot = roundSlots[pick.pickInRound - 1];
    if (!slot) return;

    // Skip if already saved
    if (existingPicks.find((p) => p.overall === slot.overall)) return;

    newPicks.push({
      overall: slot.overall,
      round: slot.round,
      pick: pick.pickInRound,
      team: slot.team,
      name: pick.name,
      position: pick.position,
      school: pick.school,
    });
  });

  if (newPicks.length === 0) {
    console.log("✅ No new picks — already up to date");
    return;
  }

  // Merge and deduplicate
  const merged = [...existingPicks, ...newPicks].sort(
    (a, b) => a.overall - b.overall,
  );
  const seen = new Set();
  const deduped = merged.filter((p) => {
    if (seen.has(p.overall)) return false;
    seen.add(p.overall);
    return true;
  });

  fs.writeFileSync(picksPath, JSON.stringify(deduped, null, 2));

  console.log(
    `\n✅ Added ${newPicks.length} new picks — total: ${deduped.length}`,
  );
  newPicks.forEach((p) =>
    console.log(
      `  #${p.overall} ${p.team}: ${p.name} (${p.position}) ${p.school}`,
    ),
  );
  console.log(`\n🏈 Run: node scripts/apply-picks.cjs`);
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
