const fs = require("fs");

const rawData = fs.readFileSync("raw_pff.txt", "utf8");
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
    // Clean up school name
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

// Save to file
const dataDir = "./data";
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

fs.writeFileSync(`${dataDir}/pff.json`, JSON.stringify(players, null, 2));
console.log(`\n✅ pff.json created with ${players.length} players`);
