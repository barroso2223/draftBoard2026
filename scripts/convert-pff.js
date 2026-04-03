const fs = require("fs");
const path = require("path");

// Get the directory where this script is located
const scriptDir = __dirname;
// Go up one level to project root
const projectRoot = path.resolve(scriptDir, "..");

// Read from raw-data folder in project root
const rawFilePath = path.join(projectRoot, "raw-data", "raw_pff.txt");
console.log(`Reading from: ${rawFilePath}`);

const rawData = fs.readFileSync(rawFilePath, "utf8");
const lines = rawData
  .split("\n")
  .map((l) => l.trim())
  .filter((l) => l.length > 0);

const players = [];

for (let i = 0; i < lines.length; i += 5) {
  const rank = parseInt(lines[i]);
  const name = lines[i + 1];
  const position = lines[i + 2];
  let school = lines[i + 3];
  const grade = parseFloat(lines[i + 4]);

  if (name && !isNaN(rank) && !isNaN(grade)) {
    school = school.replace(/\([A-Z]{2}\)/, "").trim();
    players.push({
      name: name,
      position: position,
      school: school,
      grade: grade,
      rank: rank,
      source: "PFF",
    });
    console.log(
      `✅ Rank ${rank}: ${name} (${position}) - ${school} - Grade: ${grade}`,
    );
  }
}

// Save to data folder in project root
const dataDir = path.join(projectRoot, "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

const outputPath = path.join(dataDir, "pff.json");
fs.writeFileSync(outputPath, JSON.stringify(players, null, 2));

console.log(
  `\n✅ pff.json saved to: ${outputPath} with ${players.length} players`,
);
