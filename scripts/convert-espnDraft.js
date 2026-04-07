const fs = require("fs");
const path = require("path");

// Configuration

const INPUT_FILE = path.join(__dirname, "..", "raw-data", "espnMockDraft.txt");
const OUTPUT_FILE = path.join(__dirname, "..", "data", "mockPicks.js");
const OUTPUT_JSON = path.join(__dirname, "..", "data", "mockPicks.json");

// Map full team name to abbreviation
const teamAbbrMap = {
  "Las Vegas Raiders": "LVR",
  "New York Jets": "NYJ",
  "Arizona Cardinals": "ARI",
  "Tennessee Titans": "TEN",
  "New York Giants": "NYG",
  "Cleveland Browns": "CLE",
  "Washington Commanders": "WSH",
  "New Orleans Saints": "NO",
  "Kansas City Chiefs": "KC",
  "Cincinnati Bengals": "CIN",
  "Miami Dolphins": "MIA",
  "Dallas Cowboys": "DAL",
  "Los Angeles Rams": "LAR",
  "Baltimore Ravens": "BAL",
  "Tampa Bay Buccaneers": "TB",
  "Detroit Lions": "DET",
  "Minnesota Vikings": "MIN",
  "Carolina Panthers": "CAR",
  "Pittsburgh Steelers": "PIT",
  "Los Angeles Chargers": "LAC",
  "Philadelphia Eagles": "PHI",
  "Chicago Bears": "CHI",
  "San Francisco 49ers": "SF",
  "Houston Texans": "HOU",
  "New England Patriots": "NE",
  "Seattle Seahawks": "SEA",
  "Buffalo Bills": "BUF",
  "Indianapolis Colts": "IND",
  "Atlanta Falcons": "ATL",
  "Denver Broncos": "DEN",
  "Green Bay Packers": "GB",
  "Jacksonville Jaguars": "JAX",
};

// Parsing Function

function parseMockDraft(rawText) {
  const lines = rawText.split(/\r?\n/);
  const picks = [];
  let currentPick = null;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) continue;

    // Match a pick header: e.g., "1. Las Vegas Raiders" or "16. New York Jets (from IND"
    const pickHeadermatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (pickHeadermatch) {
      // Save previous pick is exists
      if (currentPick && currentPick.playerName) {
        picks.push(currentPick);
      }

      const overall = parseInt(pickHeadermatch[1], 10);
      let teamRaw = pickHeadermatch[2];

      // Remove parenthetical notes like "(from IND)" or "(via trade with BUF)"
      teamRaw = teamRaw.replace(/\s*\([^)]*\)/, "").trim();

      const team = teamRaw;
      const teamAbbrev = teamAbbrMap[team] || team.slice(0, 3).toUpperCase();

      // Determine round and pick number from overall
      const round = Math.ceil(overall / 32);
      const pickInRound = overall % 32 || 32;

      currentPick = {
        overall,
        round,
        pick: pickInRound,
        playerName: null,
        team,
        teamAbbrev,
      };
      continue;
    }

    // If we are inside a pick and the line looks like player info: e.g., "Fernando Mendoza, QB, Indiana"
    if (currentPick && !currentPick.playerName) {
      // Remove extra spaces and possible trailing "The draft starts..." etc.
      // But the player line is usually a single line like "Fernando Mendoza, QB, Indiana"
      // If there are commas, assume first part is player name.
      const playerMatch = line.match(/^([^,]+),/);
      if (playerMatch) {
        currentPick.playerName = playerMatch[1].trim();
      } else {
        // Fallback: take whole line as player name (less reliable)
        currentPick.playerName = line;
      }
    }
  }

  // Push last pick
  if (currentPick && currentPick.playerName) picks.push(currentPick);
  return picks;
}

// Main

try {
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`❌ File not found: ${INPUT_FILE}`);
    process.exit(1);
  }

  const rawText = fs.readFileSync(INPUT_FILE, "utf8");
  const picks = parseMockDraft(rawText);

  // Generate JavaScript array string
  let output = `// Auto-generated from raw-data/espnMockDraft.txt\n`;
  output += `// ${picks.length} picks\n\n`;
  output += `const draftedPicks = [\n`;
  picks.forEach((pick) => {
    output += `  {\n`;
    output += `    overall: ${pick.overall},\n`;
    output += `    round: ${pick.round},\n`;
    output += `    pick: ${pick.pick},\n`;
    output += `    playerName: "${pick.playerName.replace(/"/g, '\\"')}",\n`;
    output += `    team: "${pick.team.replace(/"/g, '\\"')}",\n`;
    output += `    teamAbbrev: "${pick.teamAbbrev}"\n`;
    output += `  },\n`;
  });
  output += `];\n`;

  // Write to file
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, output);

  // Write the JSON file
  const jsonOutput = JSON.stringify(picks, null, 2);
  fs.writeFileSync(OUTPUT_JSON, jsonOutput);

  console.log(`✅ Successfully parsed ${picks.length} picks.`);
  console.log(`📄 Output written to: ${OUTPUT_FILE}`);
  console.log(`📄 JSON output: ${OUTPUT_JSON}`);
} catch (err) {
  console.error("Error:", err.message);
}
