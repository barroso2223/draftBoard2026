const fs = require("fs");
const path = require("path");

// Get project root
const projectRoot = path.resolve(__dirname, "..");

// Read the raw ESPN data
const rawData = fs.readFileSync(
  path.join(projectRoot, "raw-data/raw_espn.txt"),
  "utf8",
);
const lines = rawData.split("\n").filter((l) => l.trim().length > 0);

const players = [];

for (const line of lines) {
  // Match pattern: "1. Arvell Reese, LB, Ohio State (92)"
  const match = line.match(
    /^(\d+)\.\s+([^,]+),\s+([^,]+),\s+([^(]+)\s+\((\d+)\)/,
  );
  if (match) {
    const rank = parseInt(match[1]);
    const name = match[2].trim();
    const position = match[3].trim();
    const school = match[4].trim();
    const grade = parseInt(match[5]);

    players.push({
      name: name,
      position: position,
      school: school,
      grade: grade,
      rank: rank,
      source: "ESPN",
    });

    console.log(
      `✅ Rank ${rank}: ${name} (${position}) - ${school} - Grade: ${grade}`,
    );
  }
}

// Save to data folder
const dataDir = path.join(projectRoot, "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

const outputPath = path.join(dataDir, "espn.json");
fs.writeFileSync(outputPath, JSON.stringify(players, null, 2));

console.log(
  `\n✅ espn.json saved to: ${outputPath} with ${players.length} players`,
);
