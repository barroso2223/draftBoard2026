const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "../");

const rawPath = path.join(projectRoot, "raw-data/bleacher.txt");
const outputPath = path.join(projectRoot, "data/bleacherreport.json");

const raw = fs.readFileSync(rawPath, "utf-8");

const lines = raw
  .split("\n")
  .map((l) => l.trim())
  .filter((l) => l.length > 0);

const players = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  const match = line.match(
    /^\d+\.\s+([A-Z]+)\s+(.+?),\s+(.+?)\s+\(([\d.]+)\)$/,
  );

  if (!match) continue;

  const [, position, name, school, grade] = match;

  players.push({
    name: name.trim(),
    position: position.trim(),
    school: school.trim(),

    grade: parseFloat(grade) * 10,

    rank: i + 1,
    source: "Bleacher Report",
    drafted: false,
    team: "",
  });
}

// Sort best first
players.sort((a, b) => b.grade - a.grade);

const dataDir = path.join(projectRoot, "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

fs.writeFileSync(outputPath, JSON.stringify(players, null, 2));

console.log(`✅ bleacher.json created with ${players.length} players`);
