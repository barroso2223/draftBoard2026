// scripts/update-round1.js
// Run: node scripts/update-round1.js
// Updates players.json with Round 1 draft results

const fs = require("fs");
const path = require("path");

const ROUND1_PICKS = [
  {
    overall: 1,
    team: "Las Vegas Raiders",
    name: "Fernando Mendoza",
    position: "QB",
    school: "Indiana",
  },
  {
    overall: 2,
    team: "New York Jets",
    name: "David Bailey",
    position: "EDGE",
    school: "Texas Tech",
  },
  {
    overall: 3,
    team: "Arizona Cardinals",
    name: "Jeremiyah Love",
    position: "RB",
    school: "Notre Dame",
  },
  {
    overall: 4,
    team: "Tennessee Titans",
    name: "Darnell Vale",
    position: "WR",
    school: "Ohio State",
  },
  {
    overall: 5,
    team: "New York Giants",
    name: "Arvell Reese",
    position: "LB",
    school: "Ohio State",
  },
  {
    overall: 6,
    team: "Cleveland Browns",
    name: "Mansoor Delane",
    position: "CB",
    school: "LSU",
  },
  {
    overall: 7,
    team: "Washington Commanders",
    name: "Sonny Styles",
    position: "LB",
    school: "Ohio State",
  },
  {
    overall: 8,
    team: "New Orleans Saints",
    name: "Jordyn Tyson",
    position: "WR",
    school: "Arizona State",
  },
  {
    overall: 9,
    team: "Kansas City Chiefs",
    name: "Spencer Fano",
    position: "OT",
    school: "Utah",
  },
  {
    overall: 10,
    team: "New York Giants",
    name: "Francis Mauigoa",
    position: "OT",
    school: "Miami",
  },
  {
    overall: 11,
    team: "Miami Dolphins",
    name: "Caleb Downs",
    position: "S",
    school: "Ohio State",
  },
  {
    overall: 12,
    team: "Dallas Cowboys",
    name: "Kadyn Proctor",
    position: "OT",
    school: "Alabama",
  },
  {
    overall: 13,
    team: "Los Angeles Rams",
    name: "Ty Simpson",
    position: "QB",
    school: "Alabama",
  },
  {
    overall: 14,
    team: "Baltimore Ravens",
    name: "Dahanava Ioanes",
    position: "OG",
    school: "Penn State",
  },
  {
    overall: 15,
    team: "Tampa Bay Buccaneers",
    name: "Rueben Bain Jr.",
    position: "EDGE",
    school: "Miami",
  },
  {
    overall: 16,
    team: "New York Jets",
    name: "Kenyon Sadiq",
    position: "LB",
    school: "Oregon",
  },
  {
    overall: 17,
    team: "Detroit Lions",
    name: "Blake Miller",
    position: "DT",
    school: "Clemson",
  },
  {
    overall: 18,
    team: "Minnesota Vikings",
    name: "Caleb Banks",
    position: "DT",
    school: "Florida",
  },
  {
    overall: 19,
    team: "Carolina Panthers",
    name: "Monroe Freeling",
    position: "OT",
    school: "Georgia",
  },
  {
    overall: 20,
    team: "Dallas Cowboys",
    name: "Maikel Lemon",
    position: "WR",
    school: "USC",
  },
  {
    overall: 21,
    team: "Pittsburgh Steelers",
    name: "Max Bwannachor",
    position: "OT",
    school: "Arizona State",
  },
  {
    overall: 22,
    team: "Los Angeles Chargers",
    name: "Akheem Measidor",
    position: "EDGE",
    school: "Miami",
  },
  {
    overall: 23,
    team: "Philadelphia Eagles",
    name: "Malachi Lawrence",
    position: "EDGE",
    school: "UCI",
  },
  {
    overall: 24,
    team: "Cleveland Browns",
    name: "KC Concepcion",
    position: "WR",
    school: "Texas A&M",
  },
  {
    overall: 25,
    team: "Chicago Bears",
    name: "Dillon Thieneman",
    position: "S",
    school: "Oregon",
  },
  {
    overall: 26,
    team: "Buffalo Bills",
    name: "Keylan Rutledge",
    position: "OG",
    school: "Georgia Tech",
  },
  {
    overall: 27,
    team: "San Francisco 49ers",
    name: "Chris Johnson",
    position: "CB",
    school: "San Diego State",
  },
  {
    overall: 28,
    team: "Houston Texans",
    name: "Caleb Lohmu",
    position: "OT",
    school: "Utah",
  },
  {
    overall: 29,
    team: "Kansas City Chiefs",
    name: "Peter Woods",
    position: "DT",
    school: "Clemson",
  },
  {
    overall: 30,
    team: "Miami Dolphins",
    name: "Omar Cooper Jr.",
    position: "WR",
    school: "Indiana",
  },
  {
    overall: 31,
    team: "New England Patriots",
    name: "Keldric Faulk",
    position: "EDGE",
    school: "Auburn",
  },
  {
    overall: 32,
    team: "Seattle Seahawks",
    name: "Jadarian Price",
    position: "RB",
    school: "Notre Dame",
  },
];

// Load players.json
const playersPath = path.join(__dirname, "../data/players.json");
const players = JSON.parse(fs.readFileSync(playersPath, "utf8"));

let matched = 0;
let unmatched = [];

// For each Round 1 pick, find and update the player
ROUND1_PICKS.forEach((pick) => {
  const nameLower = pick.name.toLowerCase().trim();

  // Try exact match first
  let player = players.find(
    (p) => (p.name || "").toLowerCase().trim() === nameLower,
  );

  // Try partial match if exact fails
  if (!player) {
    player = players.find((p) => {
      const pName = (p.name || "").toLowerCase().trim();
      return pName.includes(nameLower) || nameLower.includes(pName);
    });
  }

  if (player) {
    player.drafted = true;
    player.team = pick.team;
    player.draft_round = 1;
    player.draft_pick = pick.overall;
    matched++;
    console.log(`✅ #${pick.overall} ${pick.name} → ${pick.team}`);
  } else {
    unmatched.push(pick);
    console.log(
      `⚠️  #${pick.overall} ${pick.name} — NOT FOUND in players.json`,
    );
  }
});

// Save updated players.json
fs.writeFileSync(playersPath, JSON.stringify(players, null, 2));

console.log(`\n✅ Updated ${matched}/32 Round 1 picks in players.json`);

if (unmatched.length > 0) {
  console.log(`\n⚠️  ${unmatched.length} players not found — check spelling:`);
  unmatched.forEach((p) =>
    console.log(`   - ${p.name} (${p.position}) ${p.school}`),
  );
}
