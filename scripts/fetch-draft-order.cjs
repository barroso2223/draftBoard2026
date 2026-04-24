// scripts/fetch-picks.cjs
// Run: node scripts/fetch-picks.cjs
// Scrapes NFL.com for actual draft picks and merges with draftOrder.json teams

const fs   = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const dataDir       = path.join(__dirname, "../data");
const picksPath     = path.join(dataDir, "picks.json");
const draftOrdPath  = path.join(dataDir, "draftOrder.json");

// Position normalization
const POS_MAP = {
  "SAF": "S", "G": "OG", "T": "OT", "DE": "EDGE",
  "ILB": "LB", "OLB": "LB", "FS": "S", "SS": "S",
};
function normalizePos(pos) {
  return POS_MAP[pos?.toUpperCase()] || pos?.toUpperCase() || "";
}

async function scrapeRound(page, round) {
  const url = `https://www.nfl.com/draft/tracker/2026/rounds/${round}`;
  console.log(`  Scraping Round ${round}...`);

  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(6000);

  const text = await page.evaluate(() => document.body.innerText);
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

  const picks = [];
  let i = 0;

  // Pattern: pick number followed by FIRSTNAME, LASTNAME, POSITION, SCHOOL
  while (i < lines.length) {
    const line = lines[i];

    // Look for pick number pattern (1-257)
    if (/^\d+$/.test(line)) {
      const pickNum = parseInt(line);
      if (pickNum >= 1 && pickNum <= 257) {
        // Next lines should be: first name, last name, position, school
        const firstName = lines[i + 1] || "";
        const lastName  = lines[i + 2] || "";
        const position  = lines[i + 3] || "";
        const school    = lines[i + 4] || "";

        // Validate — position should be a known football position
        const validPositions = ["QB","RB","WR","TE","OT","OG","C","G","T","EDGE","DE","DT","LB","ILB","OLB","CB","S","SAF","FS","SS","K","P","LS"];
        if (
          firstName && lastName &&
          validPositions.includes(position.toUpperCase()) &&
          school.length > 2 &&
          !/^\d+$/.test(firstName)
        ) {
          picks.push({
            pickInRound: pickNum,
            name: `${firstName} ${lastName}`.trim(),
            position: normalizePos(position),
            school: school,
          });
          i += 5;
          continue;
        }
      }
    }
    i++;
  }

  console.log(`  ✅ Round ${round}: ${picks.length} picks parsed`);
  return picks;
}

async function main() {
  // Load existing draftOrder.json (has teams per overall pick)
  const draftOrder = JSON.parse(fs.readFileSync(draftOrdPath, "utf8"));

  // Load existing picks.json
  let existingPicks = [];
  try {
    existingPicks = JSON.parse(fs.readFileSync(picksPath, "utf8"));
  } catch(e) {}

  // Find which rounds have already been completed
  const maxExistingOverall = existingPicks.length > 0
    ? Math.max(...existingPicks.map(p => p.overall))
    : 0;

  console.log(`\n📋 Current picks.json has ${existingPicks.length} picks (up to overall #${maxExistingOverall})`);
  console.log("Launching browser...\n");

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
  });
  const page = await context.newPage();

  const allNewPicks = [];

  for (let round = 1; round <= 7; round++) {
    try {
      const roundPicks = await scrapeRound(page, round);

      if (roundPicks.length === 0) {
        console.log(`  ⚠️  Round ${round}: No picks found — round may not have started yet`);
        continue;
      }

      // Match each scraped pick to the draftOrder slot
      // Calculate overall pick number based on round and pick position
      const roundSlots = draftOrder.filter(d => d.round === round)
        .sort((a, b) => a.overall - b.overall);

      roundPicks.forEach((pick, idx) => {
        const slot = roundSlots[idx];
        if (!slot) return;

        // Check if this pick already exists in picks.json
        const exists = existingPicks.find(p => p.overall === slot.overall);
        if (exists) return; // skip already recorded picks

        allNewPicks.push({
          overall:  slot.overall,
          round:    slot.round,
          pick:     idx + 1,
          team:     slot.team,
          name:     pick.name,
          position: pick.position,
          school:   pick.school,
        });
      });
    } catch(err) {
      console.log(`  ❌ Round ${round} failed: ${err.message}`);
    }
  }

  await browser.close();

  if (allNewPicks.length === 0) {
    console.log("\n✅ No new picks to add — picks.json is up to date.");
    return;
  }

  // Merge new picks with existing
  const merged = [...existingPicks, ...allNewPicks]
    .sort((a, b) => a.overall - b.overall);

  // Remove duplicates by overall pick number
  const seen = new Set();
  const deduped = merged.filter(p => {
    if (seen.has(p.overall)) return false;
    seen.add(p.overall);
    return true;
  });

  fs.writeFileSync(picksPath, JSON.stringify(deduped, null, 2));

  console.log(`\n✅ Added ${allNewPicks.length} new picks to picks.json`);
  console.log(`✅ Total picks: ${deduped.length}`);
  console.log("\nNew picks added:");
  allNewPicks.slice(0, 10).forEach(p =>
    console.log(`  #${p.overall} ${p.team}: ${p.name} (${p.position}) ${p.school}`)
  );
  if (allNewPicks.length > 10) {
    console.log(`  ... and ${allNewPicks.length - 10} more`);
  }

  console.log(`\n🏈 Now run: node scripts/apply-picks.cjs`);
  console.log(`   Then: git add data/ && git commit -m "Live draft update" && git push`);
}

main().catch(err => {
  console.error("Fatal error:", err.message);
  process.exit(1);
});
