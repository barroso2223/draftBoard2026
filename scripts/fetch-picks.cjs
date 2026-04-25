// scripts/fetch-picks.cjs
// Scrapes Yahoo Sports article for live draft picks with correct team ownership

const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const dataDir = path.join(__dirname, "../data");
const picksPath = path.join(dataDir, "picks.json");

const YAHOO_ARTICLE =
  "https://sports.yahoo.com/articles/2026-nfl-draft-picks-full-092859120.html";

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

function getRoundFromOverall(overall) {
  if (overall <= 32) return 1;
  if (overall <= 64) return 2;
  if (overall <= 100) return 3;
  if (overall <= 140) return 4;
  if (overall <= 181) return 5;
  if (overall <= 216) return 6;
  return 7;
}

async function scrapeYahoo() {
  console.log("Launching browser...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(YAHOO_ARTICLE, {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });

  await page.waitForTimeout(6000);

  const lines = await page.evaluate(() =>
    document.body.innerText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean),
  );

  await browser.close();

  const picks = [];

  const pickLineRegex = /^(\d+)\s+(.+?):\s+(.+?),\s+([A-Z.]+),\s+(.+)$/i;

  lines.forEach((line) => {
    const match = line.match(pickLineRegex);
    if (!match) return;

    const overall = parseInt(match[1], 10);
    const teamPart = match[2].trim();
    const name = match[3].trim();
    const position = normalizePos(match[4].trim());
    const school = match[5].trim();

    const team = teamPart
      .split(" from ")[0]
      .replace(/\s+\(Compensatory Selection\)/i, "")
      .trim();

    const round = getRoundFromOverall(overall);

    picks.push({
      overall,
      round,
      pick: overall,
      team,
      name,
      position,
      school,
    });
  });

  return picks;
}

async function main() {
  let existingPicks = [];

  try {
    existingPicks = JSON.parse(fs.readFileSync(picksPath, "utf8"));
  } catch (e) {}

  console.log(`📋 Current picks.json: ${existingPicks.length} picks`);

  const scrapedPicks = await scrapeYahoo();
  console.log(`🔍 Yahoo article found: ${scrapedPicks.length} picks total`);

  if (scrapedPicks.length === 0) {
    console.log("⚠️  No picks found");
    return;
  }

  const newPicks = scrapedPicks.filter(
    (pick) => !existingPicks.find((p) => p.overall === pick.overall),
  );

  if (newPicks.length === 0) {
    console.log("✅ No new picks — already up to date");
    return;
  }

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
