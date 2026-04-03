const fs = require("fs");

const rawData = fs.readFileSync("rawData.txt", "utf8");
const lines = rawData
  .split("\n")
  .map((l) => l.trim())
  .filter((l) => l.length > 0);
const players = [];
const skippedLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Find the grade in parentheses at the end
  const lastParenIndex = line.lastIndexOf("(");
  if (lastParenIndex === -1) {
    skippedLines.push({ line, reason: "No grade found", index: i + 1 });
    continue;
  }

  const gradeStr = line.substring(lastParenIndex + 1, line.length - 1);
  const grade = parseFloat(gradeStr);

  if (isNaN(grade)) {
    skippedLines.push({
      line,
      reason: `Invalid grade: ${gradeStr}`,
      index: i + 1,
    });
    continue;
  }

  // Remove the grade part and trim
  let remaining = line.substring(0, lastParenIndex).trim();

  // Split by the last comma to separate name+position from school
  const lastCommaIndex = remaining.lastIndexOf(",");
  if (lastCommaIndex === -1) {
    skippedLines.push({ line, reason: "No comma found", index: i + 1 });
    continue;
  }

  const nameAndPosition = remaining.substring(0, lastCommaIndex).trim();
  const school = remaining.substring(lastCommaIndex + 1).trim();

  // Extract rank and position from the beginning
  // Pattern: "20. S Emmanuel McNeil-Warren"
  const rankMatch = nameAndPosition.match(/^(\d+)\.\s+([A-Za-z\/]+)\s+(.+)$/);

  if (!rankMatch) {
    skippedLines.push({
      line,
      reason: "Could not parse rank/position",
      index: i + 1,
    });
    continue;
  }

  const rank = parseInt(rankMatch[1]);
  const position = rankMatch[2];
  const fullName = rankMatch[3].trim();

  players.push({
    name: fullName,
    position: position,
    school: school,
    grade: grade,
    rank: rank,
    source: "Bleacher Report",
    drafted: false,
    team: "",
  });
}

// Sort by rank
players.sort((a, b) => a.rank - b.rank);

// Check for missing ranks
const existingRanks = new Set(players.map((p) => p.rank));
const missingRanks = [];
for (let i = 1; i <= 250; i++) {
  if (!existingRanks.has(i)) {
    missingRanks.push(i);
  }
}

// Report results
console.log("=".repeat(60));
console.log("📊 BLEACHER REPORT CONVERSION RESULTS");
console.log("=".repeat(60));

console.log(`\n✅ Successfully parsed: ${players.length} players`);
console.log(`⚠️  Skipped: ${skippedLines.length} lines`);

if (missingRanks.length > 0) {
  console.log(`\n🔍 Missing ranks: ${missingRanks.join(", ")}`);
}

if (skippedLines.length > 0) {
  console.log(`\n❌ Skipped lines:`);
  skippedLines.forEach((skip) => {
    console.log(`   Line ${skip.index}: ${skip.line}`);
    console.log(`      Reason: ${skip.reason}`);
  });
}

// Save to file
const dataDir = "./data";
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

fs.writeFileSync(
  `${dataDir}/bleacherreport.json`,
  JSON.stringify(players, null, 2),
);
console.log(`\n💾 Saved to: ${dataDir}/bleacherreport.json`);

// Show first 10 and last 10 to verify
console.log("\n📋 First 10 players:");
players.slice(0, 10).forEach((p) => {
  console.log(
    `   ${p.rank}. ${p.name} (${p.position}) - ${p.school} - ${p.grade}`,
  );
});

console.log("\n📋 Last 10 players:");
players.slice(-10).forEach((p) => {
  console.log(
    `   ${p.rank}. ${p.name} (${p.position}) - ${p.school} - ${p.grade}`,
  );
});

// Specifically check problematic players
console.log("\n🔍 Checking problematic players:");
const mcneil = players.find((p) => p.name.includes("McNeil"));
if (mcneil) {
  console.log(`   ✓ Found: ${mcneil.rank}. ${mcneil.name} - ${mcneil.school}`);
} else {
  console.log(`   ✗ Missing: Emmanuel McNeil-Warren`);
}

const parker = players.find((p) => p.name.includes("T.J."));
if (parker) {
  console.log(`   ✓ Found: ${parker.rank}. ${parker.name} - ${parker.school}`);
} else {
  console.log(`   ✗ Missing: T.J. Parker`);
}
