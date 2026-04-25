// scripts/fetch-picks.cjs
// NFL.com live first, Yahoo article fallback

const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const dataDir = path.join(__dirname, "../data");
const picksPath = path.join(dataDir, "picks.json");
const draftOrdPath = path.join(dataDir, "draftOrder.json");

const YAHOO_ARTICLE =
  "https://sports.yahoo.com/articles/2026-nfl-draft-picks-full-092859120.html";

const NFL_ROUNDS = [4, 5, 6, 7];

const POS_REGEX =
  /^(QB|RB|WR|TE|OT|OG|OL|C|G|T|EDGE|DE|DT|LB|ILB|OLB|CB|DB|S|SAF|FS|SS|K|P|LS)$/i;

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

function titleCase(str) {
  return (str || "")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bJr\b/g, "Jr.")
    .replace(/\bIi\b/g, "II")
    .replace(/\bIii\b/g, "III")
    .replace(/\bIv\b/g, "IV");
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

function getDraftOrderTeam(overall) {
  try {
    const draftOrder = JSON.parse(fs.readFileSync(draftOrdPath, "utf8"));
    const slot = draftOrder.find((p) => Number(p.overall) === Number(overall));
    return slot?.team || "";
  } catch {
    return "";
  }
}

async function getLines(page, url) {
  await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });

  await page.waitForTimeout(7000);

  return page.evaluate(() =>
    document.body.innerText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean),
  );
}

async function scrapeNFL() {
  console.log("Launching browser for NFL.com live tracker...");

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const picks = [];
  const seen = new Set();

  for (const round of NFL_ROUNDS) {
    const url = `https://www.nfl.com/draft/tracker/2026/rounds/${round}`;
    console.log(`Checking NFL.com round ${round}...`);

    const lines = await getLines(page, url);

    for (let i = 0; i < lines.length; i++) {
      if (!/^\d+$/.test(lines[i])) continue;
      if (!/^\(\d+\)$/.test(lines[i + 1] || "")) continue;

      const pickInRound = Number(lines[i]);
      const overall = Number(lines[i + 1].replace(/[()]/g, ""));

      const a = lines[i + 2];
      const b = lines[i + 3];
      const c = lines[i + 4];
      const d = lines[i + 5];

      if (!a || !b || !c || !d) continue;
      if (!POS_REGEX.test(c)) continue;

      const name = titleCase(`${a} ${b}`);
      const position = normalizePos(c);
      const school = titleCase(d);

      const team = getDraftOrderTeam(overall);

      if (!team) continue;
      if (seen.has(overall)) continue;

      seen.add(overall);

      picks.push({
        overall,
        round,
        pick: pickInRound,
        team,
        name,
        position,
        school,
      });
    }
  }

  await browser.close();

  return picks.sort((a, b) => a.overall - b.overall);
}

async function scrapeYahoo() {
  console.log("Launching browser for Yahoo fallback...");

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const lines = await getLines(page, YAHOO_ARTICLE);

  await browser.close();

  const picks = [];
  const pickLineRegex = /^(\d+)\s+(.+?):\s+(.+?),\s+([A-Z.]+),\s+(.+)$/i;

  lines.forEach((line) => {
    const match = line.match(pickLineRegex);
    if (!match) return;

    const overall = parseInt(match[1], 10);
    const teamPart = match[2].trim();

    const team = teamPart
      .split(" from ")[0]
      .replace(/\s+\(Compensatory Selection\)/i, "")
      .trim()
      .replace("Las Angeles", "Los Angeles");

    picks.push({
      overall,
      round: getRoundFromOverall(overall),
      pick: overall,
      team,
      name: match[3].trim(),
      position: normalizePos(match[4].trim()),
      school: match[5].trim(),
    });
  });

  return picks.sort((a, b) => a.overall - b.overall);
}

async function main() {
  let existingPicks = [];

  try {
    existingPicks = JSON.parse(fs.readFileSync(picksPath, "utf8"));
  } catch {}

  console.log(`📋 Current picks.json: ${existingPicks.length} picks`);

  let scrapedPicks = await scrapeNFL();
  console.log(`🔍 NFL.com live found: ${scrapedPicks.length} picks total`);

  if (scrapedPicks.length === 0) {
    console.log("⚠️ NFL.com found no picks — falling back to Yahoo");
    scrapedPicks = await scrapeYahoo();
    console.log(`🔍 Yahoo article found: ${scrapedPicks.length} picks total`);
  }

  if (scrapedPicks.length === 0) {
    console.log("⚠️ No picks found");
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
