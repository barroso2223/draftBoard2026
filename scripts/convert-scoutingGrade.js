const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "../");

const rawPath = path.join(projectRoot, "raw-data/scoutingGrade.txt");
const outputPath = path.join(projectRoot, "data/scoutingGrade.json");

const raw = fs.readFileSync(rawPath, "utf-8");

const lines = raw
  .split("\n")
  .map((l) => l.trim())
  .filter((l) => l.length > 0);

const players = [];

for (let i = 0; i < lines.length; i++) {
  const parts = lines[i].split("\t");

  if (parts.length < 8) continue;

  players.push({
    name: parts[1].trim(),
    position: parts[2].trim(),
    school: parts[3].trim(),

    grade: parseFloat(parts[4]),
    rank: i + 1,

    scouting_pick: parseFloat(parts[6]),
    scouting_tag: parts[7],

    source: "Scouting Grade",
  });
}

// Sort best first
players.sort((a, b) => b.grade - a.grade);

const dataDir = path.join(projectRoot, "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

fs.writeFileSync(outputPath, JSON.stringify(players, null, 2));

console.log(`✅ scoutingGrade.json created with ${players.length} players`);
