// Module 1
// LESSON 1:

//1st attempt from memory, mind went blank could not do more than this

const base = "https://www.nflmockdraftdatabase.com/players/2026/";

let player = [];
let draftedPicks = [];
// 1st attempt at function
function loadPlayer() {

  player = 
}

//correct function

async function loadPlayers() {
  const res = await fetch('./data/players.json');
  const data = await res.json();

  players = data;
}

// dont understand
const res = await fetch('./data/players.json');
const data = await res.json();
player = data; // i get that player = data is the output from res.json, but res is ./data/player.json so data is ./data/player.json.json()?

stage 3:
const base = "https://www.espn.com/nfl/draft/bestavailable/_/position/ovr"

let players = [];
let draftedPicks = [];

//2nd attempt
async function loadPlayers() {

  const res = ("./data/espn.json/");
  const data = ("res.json");

  players = data;
}

//correct version
async function loadPlayer() {
  const res = await fetch('./data/players.json');
  const data = await res.json();

  players = data;
}

// LESSON 2:
// Stage 1: 

//challenge 1:
//1st attempt
const calculateGrades = () =>  p.combined_scores || p.rating || 0;

//corect way

const calculateGrades = () => players.forEach(p => p.combined_scores || p.rating || 0);
calculateGrades();
players[0].score

//challenge 2:
//1st attempt
function getPlayerCount() {
  return players.forEach(p => players[].length);
}

const getPlayerCount = () => players.forEach(p => players[].length);

//2nd attempt
function getPlayerCount() {
  return players.forEach(p => p.length);
}

const getPlayerCount = () => players.forEach(p => p.length);

const getPlayerCount = () => {
  return players.forEach(p => p.length);
}

//correct way:



//LESSON 1 locked in challenge:

async function loadPlayer() {
  const res = await fetch('./data/players.json');
  const data = await res.json();

  players = data;
}

async function loadPLayers() {
  const res = await fetch('./data/players.json');
  const data = await res.jason();

  players = data;
}

async function loadPlayer() {
  const res = await fetch('./data/players.json');
  const data = await res.json();
    
  players = data;
}

async function loadPlayers() {
  const res = await fetch('./data/players.json');
  const data = await res.json();

  players = data;
}

async function anyName() {
  const res = await fetch('url' || 'path');
  const data = await res.json;

  //use the data here
}

//LESSON 2 feedback:
//Correct way getPlayerCount:
function getPlayerCount() {
  return players.length;
}

const getPlayerCount = () => {
  return players.length;
}

const getPlayerCount = () => players.length;

// console.log results: 
// const getPlayerCount = () => players.forEach(p => p.length = p.index.length);
// undefined
// getPlayerCount
// () => players.forEach(p => p.length = p.index.length)
// getPlayerCount()
// VM1519:1 Uncaught ReferenceError: players is not defined
//     at getPlayerCount (<anonymous>:1:38)
//     at <anonymous>:1:1
// getPlayerCount @ VM1519:1
// (anonymous) @ VM1559:1Understand this error
// 7app.js:648 Draft not started yet
// const getPLayerCount = () => window.__app.players.length;
// undefined
// const getPLayerCount = () => players.length;
// undefined
// 2app.js:648 Draft not started yet
// window.__app.players.length;
// 556

//Lesson 2 summary
//challenge 1: One liner calculateGrades
const calculateGrades = () => window.__app.players.forEach(p => p.score = p.combined_scores || p.rating || 0);
calculateGrades();
window.__app.players[0].score

//challenge 2: getPlayerCount (3 correct versions)

function getPlayerCount() {
  return window.__app.players.length;
}

const getPlayerCount = () => {
  return window.__app.players.length;
}

const getPlayerCount = () => window.__app.players.length;

//micro challenge results from console:
window.__app.players.length
556
window.__app.players[0].name
'David Bailey'
app.js:648 Draft not started yet
window.__app.players[0].position
'EDGE'
window.__app.players[0].combined_score
92
4app.js:648 Draft not started yet
const firstTen = () => players.slice(0, 10).map(p => p.name)
undefined
const firstTen = () => window.__app.players.slice(0, 10).map(p => p.name)
undefined
app.js:648 Draft not started yet
window.__app.players.slice(0, 10).map(p => p.name)
(10) ['David Bailey', 'Jeremiyah Love', 'Rueben Bain Jr.', 'Caleb Downs', 'Fernando Mendoza', 'Francis Mauigoa', 'Sonny Styles', 'Mansoor Delane', 'Makai Lemon', 'Carnell Tate']

//LESSON 3 challenge:
window.__app.players.length
556
window.__app.players[0].name
'David Bailey'
app.js:648 Draft not started yet
window.__app.players[0].position
'EDGE'
window.__app.players[0].combined_score
92
4app.js:648 Draft not started yet
const firstTen = () => players.slice(0, 10).map(p => p.name)
undefined
const firstTen = () => window.__app.players.slice(0, 10).map(p => p.name)
undefined
app.js:648 Draft not started yet
window.__app.players.slice(0, 10).map(p => p.name)
(10) ['David Bailey', 'Jeremiyah Love', 'Rueben Bain Jr.', 'Caleb Downs', 'Fernando Mendoza', 'Francis Mauigoa', 'Sonny Styles', 'Mansoor Delane', 'Makai Lemon', 'Carnell Tate']
6app.js:648 Draft not started yet
window.__app.players[0].score
92
3app.js:648 Draft not started yet
window.__app.players.filter(p => p.position === 'QB'
VM4022:1 Uncaught SyntaxError: missing ) after argument listUnderstand this error
app.js:648 Draft not started yet
window.__app.players.filter(p => p.position === 'QB')
(28) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]0: {name: 'Fernando Mendoza', position: 'QB', school: 'Indiana', team: '', weight: 236, …}1: {name: 'Ty Simpson', position: 'QB', school: 'Alabama', team: '', weight: 211, …}2: {name: 'Garrett Nussmeier', position: 'QB', school: 'LSU', team: '', weight: 203, …}3: {name: 'Jalon Daniels', position: 'QB', school: 'Kansas', team: '', weight: 219, …}4: {name: 'Carson Beck', position: 'QB', school: 'Miami', team: '', weight: 233, …}5: {name: 'Drew Allar', position: 'QB', school: 'Penn State', team: '', weight: 228, …}6: {name: 'Taylen Green', position: 'QB', school: 'Arkansas', team: '', weight: 227, …}7: {name: 'Cole Payton', position: 'QB', school: 'North Dakota State', team: '', weight: 232, …}8: {name: 'Diego Pavia', position: 'QB', school: 'Vanderbilt', team: '', weight: 207, …}9: {name: 'Miller Moss', position: 'QB', school: 'Louisville', team: '', weight: 210, …}10: {name: 'Cade Klubnik', position: 'QB', school: 'Clemson', team: '', weight: 207, …}11: {name: 'Luke Altmyer', position: 'QB', school: 'Illinois', team: '', weight: 210, …}12: {name: 'Kyron Drones', position: 'QB', school: 'Virginia Tech', team: '', weight: 235, …}13: {name: 'Joe Fagnano', position: 'QB', school: 'Connecticut', team: '', weight: null, …}14: {name: 'Sawyer Robertson', position: 'QB', school: 'Baylor', team: '', weight: 216, …}15: {name: 'Joey Aguilar', position: 'QB', school: 'Tennessee', team: '', weight: 225, …}16: {name: 'Behren Morton', position: 'QB', school: 'Texas Tech', team: '', weight: 221, …}17: {name: 'Tyler Van Dyke', position: 'QB', school: 'SMU', team: '', weight: 230, …}18: {name: 'Preston Stone', position: 'QB', school: 'Northwestern', team: '', weight: 215, …}19: {name: 'Haynes King', position: 'QB', school: 'Georgia Tech', team: '', weight: 212, …}20: {name: 'Kaidon Salter', position: 'QB', school: 'Colorado', team: '', weight: 190, …}21: {name: 'Blake Shapen', position: 'QB', school: 'Mississippi State', team: '', weight: 210, …}22: {name: 'Joe Fagnano', position: 'QB', school: 'UConn', team: '', weight: 226, …}23: {name: 'Matthew Sluka', position: 'QB', school: 'James Madison', team: '', weight: 211, …}24: {name: 'Zach Calzada', position: 'QB', school: 'Kentucky', team: '', weight: 230, …}25: {name: 'Jeff Sims', position: 'QB', school: 'Arizona State', team: '', weight: 220, …}26: {name: 'Drew Pyne', position: 'QB', school: 'Bowling Green', team: '', weight: 200, …}27: {name: 'Dylan Morris', position: 'QB', school: 'James Madison', team: '', weight: 202, …}length: 28[[Prototype]]: Array(0)
2app.js:648 Draft not started yet
    window.__app.players.sort((a, b) b.position - a.position)
VM4200:1 Uncaught SyntaxError: missing ) after argument listUnderstand this error
app.js:648 Draft not started yet
    window.__app.players.sort((a, b) => b.position - a.position)
(556) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, …][0 … 99]0: {name: 'David Bailey', position: 'EDGE', school: 'Texas Tech', team: '', weight: 251, …}1: {name: 'Jeremiyah Love', position: 'RB', school: 'Notre Dame', team: '', weight: 212, …}2: {name: 'Rueben Bain Jr.', position: 'EDGE', school: 'Miami', team: '', weight: 263, …}3: {name: 'Caleb Downs', position: 'S', school: 'Ohio State', team: '', weight: 206, …}4: {name: 'Fernando Mendoza', position: 'QB', school: 'Indiana', team: '', weight: 236, …}5: {name: 'Francis Mauigoa', position: 'OT', school: 'Miami', team: '', weight: 329, …}6: {name: 'Sonny Styles', position: 'LB', school: 'Ohio State', team: '', weight: 244, …}7: {name: 'Mansoor Delane', position: 'CB', school: 'LSU', team: '', weight: 187, …}8: {name: 'Makai Lemon', position: 'WR', school: 'USC', team: '', weight: 192, …}9: {name: 'Carnell Tate', position: 'WR', school: 'Ohio State', team: '', weight: 192, …}10: {name: 'Akheem Mesidor', position: 'EDGE', school: 'Miami', team: '', weight: 259, …}11: {name: 'Emmanuel McNeil-Warren', position: 'S', school: 'Toledo', team: '', weight: null, …}12: {name: 'Arvell Reese', position: 'LB', school: 'Ohio State', team: '', weight: 241, …}13: {name: 'Spencer Fano', position: 'OT', school: 'Utah', team: '', weight: 311, …}14: {name: 'Jordyn Tyson', position: 'WR', school: 'Arizona State', team: '', weight: 203, …}15: {name: 'Dillon Thieneman', position: 'S', school: 'Oregon', team: '', weight: 201, …}16: {name: 'Kadyn Proctor', position: 'OT', school: 'Alabama', team: '', weight: 352, …}17: {name: 'Jermod McCoy', position: 'CB', school: 'Tennessee', team: '', weight: 188, …}18: {name: 'Cashius Howell', position: 'EDGE', school: 'Texas A&M', team: '', weight: 253, …}19: {name: 'Olaivavega Ioane', position: 'OG', school: 'Penn State', team: '', weight: 320, …}20: {name: 'Denzel Boston', position: 'WR', school: 'Washington', team: '', weight: 212, …}21: {name: 'Zion Young', position: 'EDGE', school: 'Missouri', team: '', weight: 262, …}22: {name: 'Keldric Faulk', position: 'EDGE', school: 'Auburn', team: '', weight: 276, …}23: {name: 'Omar Cooper Jr.', position: 'WR', school: 'Indiana', team: '', weight: 199, …}24: {name: 'Chris Johnson', position: 'CB', school: 'San Diego State', team: '', weight: 193, …}25: {name: 'Avieon Terrell', position: 'CB', school: 'Clemson', team: '', weight: 186, …}26: {name: 'Kayden McDonald', position: 'DT', school: 'Ohio State', team: '', weight: 326, …}27: {name: 'Emmanuel Pregnon', position: 'OG', school: 'Oregon', team: '', weight: 314, …}28: {name: 'T.J. Parker', position: 'EDGE', school: 'Clemson', team: '', weight: 263, …}29: {name: 'Derrick Moore', position: 'EDGE', school: 'Michigan', team: '', weight: 255, …}30: {name: 'KC Concepcion', position: 'WR', school: 'Texas A&M', team: '', weight: 196, …}31: {name: 'Jacob Rodriguez', position: 'LB', school: 'Texas Tech', team: '', weight: 231, …}32: {name: "D'Angelo Ponds", position: 'CB', school: 'Indiana', team: '', weight: 182, …}33: {name: 'R Mason Thomas', position: 'EDGE', school: 'Oklahoma', team: '', weight: 241, …}34: {name: 'Gennings Dunker', position: 'OT', school: 'Iowa', team: '', weight: 319, …}35: {name: 'Gabe Jacas', position: 'EDGE', school: 'Illinois', team: '', weight: 260, …}36: {name: 'Ty Simpson', position: 'QB', school: 'Alabama', team: '', weight: 211, …}37: {name: 'Colton Hood', position: 'CB', school: 'Tennessee', team: '', weight: 193, …}38: {name: 'Kenyon Sadiq', position: 'TE', school: 'Oregon', team: '', weight: 241, …}39: {name: 'A.J. Haulcy', position: 'S', school: 'LSU', team: '', weight: 215, …}40: {name: 'Nadame Tucker', position: 'EDGE', school: 'Western Michigan', team: '', weight: 247, …}41: {name: 'Monroe Freeling', position: 'OT', school: 'Georgia', team: '', weight: 315, …}42: {name: 'Christen Miller', position: 'DT', school: 'Georgia', team: '', weight: 321, …}43: {name: 'Chris Brazzell II', position: 'WR', school: 'Tennessee', team: '', weight: 198, …}44: {name: 'Jake Golday', position: 'LB', school: 'Cincinnati', team: '', weight: 239, …}45: {name: 'Malachi Lawrence', position: 'EDGE', school: 'UCF', team: '', weight: 253, …}46: {name: 'Treydan Stukes', position: 'CB', school: 'Arizona', team: '', weight: 190, …}47: {name: 'Brian Parker II', position: 'OT', school: 'Duke', team: '', weight: 309, …}48: {name: 'Romello Height', position: 'EDGE', school: 'Texas Tech', team: '', weight: 239, …}49: {name: 'Zachariah Branch', position: 'WR', school: 'Georgia', team: '', weight: 177, …}50: {name: 'Skyler Bell', position: 'WR', school: 'Connecticut', team: '', weight: null, …}51: {name: 'Peter Woods', position: 'DT', school: 'Clemson', team: '', weight: null, …}52: {name: 'Blake Miller', position: 'OT', school: 'Clemson', team: '', weight: 317, …}53: {name: 'Skyler Bell', position: 'WR', school: 'UConn', team: '', weight: 192, …}54: {name: 'Keionte Scott', position: 'CB', school: 'Miami', team: '', weight: 193, …}55: {name: 'Jadarian Price', position: 'RB', school: 'Notre Dame', team: '', weight: 203, …}56: {name: 'Caleb Lomu', position: 'OT', school: 'Utah', team: '', weight: 313, …}57: {name: 'Eli Stowers', position: 'TE', school: 'Vanderbilt', team: '', weight: 239, …}58: {name: 'Joshua Josephs', position: 'EDGE', school: 'Tennessee', team: '', weight: 242, …}59: {name: 'Elijah Sarratt', position: 'WR', school: 'Indiana', team: '', weight: 210, …}60: {name: 'Chris Bell', position: 'WR', school: 'Louisville', team: '', weight: 222, …}61: {name: 'Zakee Wheatley', position: 'S', school: 'Penn State', team: '', weight: 203, …}62: {name: 'CJ Allen', position: 'LB', school: 'Georgia', team: '', weight: 230, …}63: {name: 'Brandon Cisse', position: 'CB', school: 'South Carolina', team: '', weight: 189, …}64: {name: 'Keith Abney II', position: 'CB', school: 'Arizona State', team: '', weight: 187, …}65: {name: 'Mike Washington Jr.', position: 'RB', school: 'Arkansas', team: '', weight: 223, …}66: {name: 'Sam Hecht', position: 'C', school: 'Kansas State', team: '', weight: 303, …}67: {name: 'Anthony Hill Jr.', position: 'LB', school: 'Texas', team: '', weight: 238, …}68: {name: 'Caleb Banks', position: 'DT', school: 'Florida', team: '', weight: 327, …}69: {name: 'Lee Hunter', position: 'DT', school: 'Texas Tech', team: '', weight: 318, …}70: {name: 'Jake Slaughter', position: 'C', school: 'Florida', team: '', weight: 303, …}71: {name: 'Malachi Fields', position: 'WR', school: 'Notre Dame', team: '', weight: 218, …}72: {name: 'Mason Reiger', position: 'EDGE', school: 'Wisconsin', team: '', weight: 251, …}73: {name: 'Bud Clark', position: 'S', school: 'TCU', team: '', weight: 188, …}74: {name: 'Keyron Crawford', position: 'EDGE', school: 'Auburn', team: '', weight: 253, …}75: {name: 'C.J. Allen', position: 'LB', school: 'Georgia', team: '', weight: null, …}76: {name: 'Ted Hurst', position: 'WR', school: 'Georgia State', team: '', weight: 206, …}77: {name: 'Keylan Rutledge', position: 'OG', school: 'Georgia Tech', team: '', weight: 316, …}78: {name: 'Max Llewellyn', position: 'EDGE', school: 'Iowa', team: '', weight: 258, …}79: {name: 'Max Iheanachor', position: 'OT', school: 'Arizona State', team: '', weight: 321, …}80: {name: 'Antonio Williams', position: 'WR', school: 'Clemson', team: '', weight: 187, …}81: {name: "De'Zhaun Stribling", position: 'WR', school: 'Mississippi', team: '', weight: null, …}82: {name: "De'Zhaun Stribling", position: 'WR', school: 'Ole Miss', team: '', weight: 207, …}83: {name: 'Davison Igbinosun', position: 'CB', school: 'Ohio State', team: '', weight: 189, …}84: {name: 'Dani Dennis-Sutton', position: 'EDGE', school: 'Penn State', team: '', weight: null, …}85: {name: 'Anthony Lucas', position: 'EDGE', school: 'USC', team: '', weight: 256, …}86: {name: 'Jaishawn Barham', position: 'EDGE', school: 'Michigan', team: '', weight: 240, …}87: {name: 'Justin Joly', position: 'TE', school: 'NC State', team: '', weight: 241, …}88: {name: 'Jalon Kilgore', position: 'S', school: 'South Carolina', team: '', weight: null, …}89: {name: 'Josiah Trotter', position: 'LB', school: 'Missouri', team: '', weight: 237, …}90: {name: 'Beau Stephens', position: 'OG', school: 'Iowa', team: '', weight: 315, …}91: {name: 'David Gusta', position: 'DT', school: 'Kentucky', team: '', weight: 308, …}92: {name: 'Malik Muhammad', position: 'CB', school: 'Texas', team: '', weight: 182, …}93: {name: 'Gracen Halton', position: 'DT', school: 'Oklahoma', team: '', weight: 293, …}94: {name: 'Germie Bernard', position: 'WR', school: 'Alabama', team: '', weight: 206, …}95: {name: 'Bryce Lance', position: 'WR', school: 'North Dakota State', team: '', weight: 204, …}96: {name: 'Trey Zuhn III', position: 'OT', school: 'Texas A&M', team: '', weight: 312, …}97: {name: 'Nyjalik Kelly', position: 'EDGE', school: 'UCF', team: '', weight: 256, …}98: {name: 'Cyrus Allen', position: 'WR', school: 'Cincinnati', team: '', weight: 180, …}99: {name: 'Peter Woods', position: 'EDGE', school: 'Clemson', team: '', weight: 298, …}[100 … 199][200 … 299][300 … 399][400 … 499][500 … 555]500: {name: 'Bram Walden', position: 'OT', school: 'Arizona State', team: '', weight: 305, …}501: {name: 'Deion Colzie', position: 'WR', school: 'Miami (OH)', team: '', weight: 211, …}502: {name: 'Raesjon Davis', position: 'LB', school: 'Oregon State', team: '', weight: 223, …}503: {name: 'Khordae Sydnor', position: 'EDGE', school: 'Vanderbilt', team: '', weight: 266, …}504: {name: 'Jeff Sims', position: 'QB', school: 'Arizona State', team: '', weight: 220, …}505: {name: 'Key Lawrence', position: 'S', school: 'UCLA', team: '', weight: 200, …}506: {name: 'DJ Graham II', position: 'CB', school: 'Kansas', team: '', weight: 200, …}507: {name: "Sam M'Pemba", position: 'EDGE', school: 'Texas A&M', team: '', weight: 252, …}508: {name: 'Jayden Ballard', position: 'WR', school: 'Wisconsin', team: '', weight: 205, …}509: {name: 'Harrison Wallace III', position: 'WR', school: 'Mississippi', team: '', weight: null, …}510: {name: 'Stefon Thompson', position: 'LB', school: 'Florida State', team: '', weight: 240, …}511: {name: 'Jalen Berger', position: 'RB', school: 'UCLA', team: '', weight: 215, …}512: {name: 'Raul Aguirre Jr.', position: 'LB', school: 'Miami', team: '', weight: 233, …}513: {name: 'Jeremiah Walker', position: 'CB', school: 'Stephen F. Austin', team: '', weight: 192, …}514: {name: 'Zion Nelson', position: 'OT', school: 'SMU', team: '', weight: 318, …}515: {name: 'Max Llewellyn', position: 'DT', school: 'Iowa', team: '', weight: null, …}516: {name: 'Jacob Thomas', position: 'S', school: 'James Madison', team: '', weight: null, …}517: {name: 'Jadon Canady', position: 'S', school: 'Oregon', team: '', weight: null, …}518: {name: 'Caullin Lacy', position: 'WR', school: 'Louisvilles', team: '', weight: null, …}519: {name: 'Jared Brown', position: 'WR', school: 'South Carolina', team: '', weight: 195, …}520: {name: 'Kelvin Gilliam Jr.', position: 'DT', school: 'Virginia Tech', team: '', weight: 295, …}521: {name: 'Elliot Donald', position: 'DT', school: 'Pittsburgh', team: '', weight: 275, …}522: {name: 'Cade Denhoff', position: 'EDGE', school: 'Clemson', team: '', weight: 260, …}523: {name: 'Ethan Calvert', position: 'LB', school: 'Cal Poly', team: '', weight: 215, …}524: {name: 'Tyren Montgomery', position: 'WR', school: 'John Carroll', team: '', weight: null, …}525: {name: 'Cole Wisniewski', position: 'S', school: 'Texas Tech', team: '', weight: null, …}526: {name: 'Tywone Malone Jr.', position: 'DT', school: 'Ohio State', team: '', weight: 309, …}527: {name: 'Alton McCaskill', position: 'RB', school: 'Sam Houston', team: '', weight: 210, …}528: {name: 'Andrew Gentry', position: 'OT', school: 'BYU', team: '', weight: 315, …}529: {name: 'Rodrick Pleasant', position: 'CB', school: 'UCLA', team: '', weight: 175, …}530: {name: 'Toriano Pride', position: 'CB', school: 'Missouri', team: '', weight: null, …}531: {name: 'Lorenzo Styles', position: 'S', school: 'Ohio State', team: '', weight: null, …}532: {name: 'Dan Villari', position: 'TE', school: 'Syracuse', team: '', weight: null, …}533: {name: 'David Daniel-Sisav...', position: 'S', school: 'Troy', team: '', weight: 190, …}534: {name: 'Damarius McGhee', position: 'CB', school: 'Florida Atlantic', team: '', weight: 175, …}535: {name: 'Caden Barnett', position: 'OG', school: 'Wyoming', team: '', weight: null, …}536: {name: 'RaRa Thomas', position: 'WR', school: 'Troy', team: '', weight: 208, …}537: {name: 'Bryce Carter', position: 'EDGE', school: 'Texas State', team: '', weight: 274, …}538: {name: 'Keelan Marion', position: 'WR', school: 'Miami', team: '', weight: null, …}539: {name: 'Keagen Trost', position: 'OG', school: 'Missouri', team: '', weight: null, …}540: {name: 'Jordan Van Den Berg', position: 'DT', school: 'Georgia Tech', team: '', weight: null, …}541: {name: 'Ryan Niblett', position: 'WR', school: 'Texas', team: '', weight: 187, …}542: {name: 'Prophet Brown', position: 'CB', school: 'USC', team: '', weight: 190, …}543: {name: 'Drew Pyne', position: 'QB', school: 'Bowling Green', team: '', weight: 200, …}544: {name: 'Madden Sanker', position: 'OG', school: 'Florida Atlantic', team: '', weight: 305, …}545: {name: 'Josh Gesky', position: 'OG', school: 'Illinois', team: '', weight: null, …}546: {name: 'Wesley Williams', position: 'DT', school: 'Duke', team: '', weight: null, …}547: {name: 'James Brockermeyer', position: 'OG', school: 'Miami', team: '', weight: null, …}548: {name: 'Mycah Pittman', position: 'WR', school: 'Utah', team: '', weight: 205, …}549: {name: 'Demorie Tate', position: 'CB', school: 'Florida A&M', team: '', weight: 195, …}550: {name: 'Dylan Morris', position: 'QB', school: 'James Madison', team: '', weight: 202, …}551: {name: 'Jalen Huskey', position: 'CB', school: 'Maryland', team: '', weight: null, …}552: {name: 'James Brockermeyer', position: 'C', school: 'Miami', team: '', weight: null, …}553: {name: 'David Blay Jr.', position: 'DT', school: 'Miami', team: '', weight: null, …}554: {name: 'Kam Dewberry', position: 'OG', school: 'Alabama', team: '', weight: null, …}555: {name: 'Jacobian Guillory II', position: 'DT', school: 'LSU', team: '', weight: null, …}length: 556[[Prototype]]: Array(0)at: ƒ at()concat: ƒ concat()constructor: ƒ Array()copyWithin: ƒ copyWithin()entries: ƒ entries()every: ƒ every()fill: ƒ fill()filter: ƒ filter()find: ƒ find()findIndex: ƒ findIndex()findLast: ƒ findLast()findLastIndex: ƒ findLastIndex()flat: ƒ flat()flatMap: ƒ flatMap()forEach: ƒ forEach()includes: ƒ includes()indexOf: ƒ indexOf()join: ƒ join()keys: ƒ keys()lastIndexOf: ƒ lastIndexOf()length: 0map: ƒ map()pop: ƒ pop()push: ƒ push()reduce: ƒ reduce()reduceRight: ƒ reduceRight()reverse: ƒ reverse()shift: ƒ shift()slice: ƒ slice()some: ƒ some()sort: ƒ sort()splice: ƒ splice()toLocaleString: ƒ toLocaleString()toReversed: ƒ toReversed()toSorted: ƒ toSorted()toSpliced: ƒ toSpliced()toString: ƒ toString()unshift: ƒ unshift()values: ƒ values()with: ƒ with()Symbol(Symbol.iterator): ƒ values()Symbol(Symbol.unscopables): {at: true, copyWithin: true, entries: true, fill: true, find: true, …}[[Prototype]]: Object
4app.js:648 Draft not started yet
window.__app.players.filter(p => p.position === 'QB')
(28) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
app.js:648 Draft not started yet
window.__app.players.filter(p => p.position === 'RB')
(34) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
2app.js:648 Draft not started yet
window.__app.players.sort((a, b) => b.combined_score - a.combined_score).slice(0, 5).map(p => p.name)
(5) ['David Bailey', 'Jeremiyah Love', 'Rueben Bain Jr.', 'Caleb Downs', 'Fernando Mendoza']
app.js:648 Draft not started yet
window.__app.players.sort((a, b) => b.position - a.position).slice(0, 5).map(p => p.name)
(5) ['David Bailey', 'Jeremiyah Love', 'Rueben Bain Jr.', 'Caleb Downs', 'Fernando Mendoza']
3app.js:648 Draft not started yet
window.__app.players.filter(p => p.position = "QB").map(p => p.name)
(556) ['David Bailey', 'Jeremiyah Love', 'Rueben Bain Jr.', 'Caleb Downs', 'Fernando Mendoza', 'Francis Mauigoa', 'Sonny Styles', 'Mansoor Delane', 'Makai Lemon', 'Carnell Tate', 'Akheem Mesidor', 'Emmanuel McNeil-Warren', 'Arvell Reese', 'Spencer Fano', 'Jordyn Tyson', 'Dillon Thieneman', 'Kadyn Proctor', 'Jermod McCoy', 'Cashius Howell', 'Olaivavega Ioane', 'Denzel Boston', 'Zion Young', 'Keldric Faulk', 'Omar Cooper Jr.', 'Chris Johnson', 'Avieon Terrell', 'Kayden McDonald', 'Emmanuel Pregnon', 'T.J. Parker', 'Derrick Moore', 'KC Concepcion', 'Jacob Rodriguez', "D'Angelo Ponds", 'R Mason Thomas', 'Gennings Dunker', 'Gabe Jacas', 'Ty Simpson', 'Colton Hood', 'Kenyon Sadiq', 'A.J. Haulcy', 'Nadame Tucker', 'Monroe Freeling', 'Christen Miller', 'Chris Brazzell II', 'Jake Golday', 'Malachi Lawrence', 'Treydan Stukes', 'Brian Parker II', 'Romello Height', 'Zachariah Branch', 'Skyler Bell', 'Peter Woods', 'Blake Miller', 'Skyler Bell', 'Keionte Scott', 'Jadarian Price', 'Caleb Lomu', 'Eli Stowers', 'Joshua Josephs', 'Elijah Sarratt', 'Chris Bell', 'Zakee Wheatley', 'CJ Allen', 'Brandon Cisse', 'Keith Abney II', 'Mike Washington Jr.', 'Sam Hecht', 'Anthony Hill Jr.', 'Caleb Banks', 'Lee Hunter', 'Jake Slaughter', 'Malachi Fields', 'Mason Reiger', 'Bud Clark', 'Keyron Crawford', 'C.J. Allen', 'Ted Hurst', 'Keylan Rutledge', 'Max Llewellyn', 'Max Iheanachor', 'Antonio Williams', "De'Zhaun Stribling", "De'Zhaun Stribling", 'Davison Igbinosun', 'Dani Dennis-Sutton', 'Anthony Lucas', 'Jaishawn Barham', 'Justin Joly', 'Jalon Kilgore', 'Josiah Trotter', 'Beau Stephens', 'David Gusta', 'Malik Muhammad', 'Gracen Halton', 'Germie Bernard', 'Bryce Lance', 'Trey Zuhn III', 'Nyjalik Kelly', 'Cyrus Allen', 'Peter Woods', …]
app.js:648 Draft not started yet
window.__app.players.filter(p => p.pos = "QB").map(p => p.name)
(556) ['David Bailey', 'Jeremiyah Love', 'Rueben Bain Jr.', 'Caleb Downs', 'Fernando Mendoza', 'Francis Mauigoa', 'Sonny Styles', 'Mansoor Delane', 'Makai Lemon', 'Carnell Tate', 'Akheem Mesidor', 'Emmanuel McNeil-Warren', 'Arvell Reese', 'Spencer Fano', 'Jordyn Tyson', 'Dillon Thieneman', 'Kadyn Proctor', 'Jermod McCoy', 'Cashius Howell', 'Olaivavega Ioane', 'Denzel Boston', 'Zion Young', 'Keldric Faulk', 'Omar Cooper Jr.', 'Chris Johnson', 'Avieon Terrell', 'Kayden McDonald', 'Emmanuel Pregnon', 'T.J. Parker', 'Derrick Moore', 'KC Concepcion', 'Jacob Rodriguez', "D'Angelo Ponds", 'R Mason Thomas', 'Gennings Dunker', 'Gabe Jacas', 'Ty Simpson', 'Colton Hood', 'Kenyon Sadiq', 'A.J. Haulcy', 'Nadame Tucker', 'Monroe Freeling', 'Christen Miller', 'Chris Brazzell II', 'Jake Golday', 'Malachi Lawrence', 'Treydan Stukes', 'Brian Parker II', 'Romello Height', 'Zachariah Branch', 'Skyler Bell', 'Peter Woods', 'Blake Miller', 'Skyler Bell', 'Keionte Scott', 'Jadarian Price', 'Caleb Lomu', 'Eli Stowers', 'Joshua Josephs', 'Elijah Sarratt', 'Chris Bell', 'Zakee Wheatley', 'CJ Allen', 'Brandon Cisse', 'Keith Abney II', 'Mike Washington Jr.', 'Sam Hecht', 'Anthony Hill Jr.', 'Caleb Banks', 'Lee Hunter', 'Jake Slaughter', 'Malachi Fields', 'Mason Reiger', 'Bud Clark', 'Keyron Crawford', 'C.J. Allen', 'Ted Hurst', 'Keylan Rutledge', 'Max Llewellyn', 'Max Iheanachor', 'Antonio Williams', "De'Zhaun Stribling", "De'Zhaun Stribling", 'Davison Igbinosun', 'Dani Dennis-Sutton', 'Anthony Lucas', 'Jaishawn Barham', 'Justin Joly', 'Jalon Kilgore', 'Josiah Trotter', 'Beau Stephens', 'David Gusta', 'Malik Muhammad', 'Gracen Halton', 'Germie Bernard', 'Bryce Lance', 'Trey Zuhn III', 'Nyjalik Kelly', 'Cyrus Allen', 'Peter Woods', …]
15app.js:648 Draft not started yet
3draftBoard2026/?dev:1 Uncaught (in promise) Error: A listener indicated an asynchronous response by returning true, but the message channel closed before a response was receivedUnderstand this error
2app.js:648 Draft not started yet
const getTopAtPosition = (position, count) => { return position = window.__app.players.filter(p => p.position === "QB"); count = window.__app.players.slice(0, 3); }
const getTopAtPosition = (position, count) => { return position = window.__app.players.filter(p => p.position); count = window.__app.players.slice(); }
undefined
app.js:648 Draft not started yet
getTopAtPosition("QB", 3)
(556) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, …]
[0 … 99]
0
: 
{name: 'David Bailey', position: 'EDGE', school: 'Texas Tech', team: '', weight: 251, …}
1
: 
{name: 'Jeremiyah Love', position: 'RB', school: 'Notre Dame', team: '', weight: 212, …}
2
: 
{name: 'Rueben Bain Jr.', position: 'EDGE', school: 'Miami', team: '', weight: 263, …}
3
: 
{name: 'Caleb Downs', position: 'S', school: 'Ohio State', team: '', weight: 206, …}
4
: 
{name: 'Fernando Mendoza', position: 'QB', school: 'Indiana', team: '', weight: 236, …}
5
: 
{name: 'Francis Mauigoa', position: 'OT', school: 'Miami', team: '', weight: 329, …}
6
: 
{name: 'Sonny Styles', position: 'LB', school: 'Ohio State', team: '', weight: 244, …}
7
: 
{name: 'Mansoor Delane', position: 'CB', school: 'LSU', team: '', weight: 187, …}
8
: 
{name: 'Makai Lemon', position: 'WR', school: 'USC', team: '', weight: 192, …}
9
: 
{name: 'Carnell Tate', position: 'WR', school: 'Ohio State', team: '', weight: 192, …}
10
: 
{name: 'Akheem Mesidor', position: 'EDGE', school: 'Miami', team: '', weight: 259, …}
11
: 
{name: 'Emmanuel McNeil-Warren', position: 'S', school: 'Toledo', team: '', weight: null, …}
12
: 
{name: 'Arvell Reese', position: 'LB', school: 'Ohio State', team: '', weight: 241, …}
13
: 
{name: 'Spencer Fano', position: 'OT', school: 'Utah', team: '', weight: 311, …}
14
: 
{name: 'Jordyn Tyson', position: 'WR', school: 'Arizona State', team: '', weight: 203, …}
15
: 
{name: 'Dillon Thieneman', position: 'S', school: 'Oregon', team: '', weight: 201, …}
16
: 
{name: 'Kadyn Proctor', position: 'OT', school: 'Alabama', team: '', weight: 352, …}
17
: 
{name: 'Jermod McCoy', position: 'CB', school: 'Tennessee', team: '', weight: 188, …}
18
: 
{name: 'Cashius Howell', position: 'EDGE', school: 'Texas A&M', team: '', weight: 253, …}
19
: 
{name: 'Olaivavega Ioane', position: 'OG', school: 'Penn State', team: '', weight: 320, …}
20
: 
{name: 'Denzel Boston', position: 'WR', school: 'Washington', team: '', weight: 212, …}
21
: 
{name: 'Zion Young', position: 'EDGE', school: 'Missouri', team: '', weight: 262, …}
22
: 
{name: 'Keldric Faulk', position: 'EDGE', school: 'Auburn', team: '', weight: 276, …}
23
: 
{name: 'Omar Cooper Jr.', position: 'WR', school: 'Indiana', team: '', weight: 199, …}
24
: 
{name: 'Chris Johnson', position: 'CB', school: 'San Diego State', team: '', weight: 193, …}
25
: 
{name: 'Avieon Terrell', position: 'CB', school: 'Clemson', team: '', weight: 186, …}
26
: 
{name: 'Kayden McDonald', position: 'DT', school: 'Ohio State', team: '', weight: 326, …}
27
: 
{name: 'Emmanuel Pregnon', position: 'OG', school: 'Oregon', team: '', weight: 314, …}
28
: 
{name: 'T.J. Parker', position: 'EDGE', school: 'Clemson', team: '', weight: 263, …}
29
: 
{name: 'Derrick Moore', position: 'EDGE', school: 'Michigan', team: '', weight: 255, …}
30
: 
{name: 'KC Concepcion', position: 'WR', school: 'Texas A&M', team: '', weight: 196, …}
31
: 
{name: 'Jacob Rodriguez', position: 'LB', school: 'Texas Tech', team: '', weight: 231, …}
32
: 
{name: "D'Angelo Ponds", position: 'CB', school: 'Indiana', team: '', weight: 182, …}
33
: 
{name: 'R Mason Thomas', position: 'EDGE', school: 'Oklahoma', team: '', weight: 241, …}
34
: 
{name: 'Gennings Dunker', position: 'OT', school: 'Iowa', team: '', weight: 319, …}
35
: 
{name: 'Gabe Jacas', position: 'EDGE', school: 'Illinois', team: '', weight: 260, …}
36
: 
{name: 'Ty Simpson', position: 'QB', school: 'Alabama', team: '', weight: 211, …}
37
: 
{name: 'Colton Hood', position: 'CB', school: 'Tennessee', team: '', weight: 193, …}
38
: 
{name: 'Kenyon Sadiq', position: 'TE', school: 'Oregon', team: '', weight: 241, …}
39
: 
{name: 'A.J. Haulcy', position: 'S', school: 'LSU', team: '', weight: 215, …}
40
: 
{name: 'Nadame Tucker', position: 'EDGE', school: 'Western Michigan', team: '', weight: 247, …}
41
: 
{name: 'Monroe Freeling', position: 'OT', school: 'Georgia', team: '', weight: 315, …}
42
: 
{name: 'Christen Miller', position: 'DT', school: 'Georgia', team: '', weight: 321, …}
43
: 
{name: 'Chris Brazzell II', position: 'WR', school: 'Tennessee', team: '', weight: 198, …}
44
: 
{name: 'Jake Golday', position: 'LB', school: 'Cincinnati', team: '', weight: 239, …}
45
: 
{name: 'Malachi Lawrence', position: 'EDGE', school: 'UCF', team: '', weight: 253, …}
46
: 
{name: 'Treydan Stukes', position: 'CB', school: 'Arizona', team: '', weight: 190, …}
47
: 
{name: 'Brian Parker II', position: 'OT', school: 'Duke', team: '', weight: 309, …}
48
: 
{name: 'Romello Height', position: 'EDGE', school: 'Texas Tech', team: '', weight: 239, …}
49
: 
{name: 'Zachariah Branch', position: 'WR', school: 'Georgia', team: '', weight: 177, …}
50
: 
{name: 'Skyler Bell', position: 'WR', school: 'Connecticut', team: '', weight: null, …}
51
: 
{name: 'Peter Woods', position: 'DT', school: 'Clemson', team: '', weight: null, …}
52
: 
{name: 'Blake Miller', position: 'OT', school: 'Clemson', team: '', weight: 317, …}
53
: 
{name: 'Skyler Bell', position: 'WR', school: 'UConn', team: '', weight: 192, …}
54
: 
{name: 'Keionte Scott', position: 'CB', school: 'Miami', team: '', weight: 193, …}
55
: 
{name: 'Jadarian Price', position: 'RB', school: 'Notre Dame', team: '', weight: 203, …}
56
: 
{name: 'Caleb Lomu', position: 'OT', school: 'Utah', team: '', weight: 313, …}
57
: 
{name: 'Eli Stowers', position: 'TE', school: 'Vanderbilt', team: '', weight: 239, …}
58
: 
{name: 'Joshua Josephs', position: 'EDGE', school: 'Tennessee', team: '', weight: 242, …}
59
: 
{name: 'Elijah Sarratt', position: 'WR', school: 'Indiana', team: '', weight: 210, …}
60
: 
{name: 'Chris Bell', position: 'WR', school: 'Louisville', team: '', weight: 222, …}
61
: 
{name: 'Zakee Wheatley', position: 'S', school: 'Penn State', team: '', weight: 203, …}
62
: 
{name: 'CJ Allen', position: 'LB', school: 'Georgia', team: '', weight: 230, …}
63
: 
{name: 'Brandon Cisse', position: 'CB', school: 'South Carolina', team: '', weight: 189, …}
64
: 
{name: 'Keith Abney II', position: 'CB', school: 'Arizona State', team: '', weight: 187, …}
65
: 
{name: 'Mike Washington Jr.', position: 'RB', school: 'Arkansas', team: '', weight: 223, …}
66
: 
{name: 'Sam Hecht', position: 'C', school: 'Kansas State', team: '', weight: 303, …}
67
: 
{name: 'Anthony Hill Jr.', position: 'LB', school: 'Texas', team: '', weight: 238, …}
68
: 
{name: 'Caleb Banks', position: 'DT', school: 'Florida', team: '', weight: 327, …}
69
: 
{name: 'Lee Hunter', position: 'DT', school: 'Texas Tech', team: '', weight: 318, …}
70
: 
{name: 'Jake Slaughter', position: 'C', school: 'Florida', team: '', weight: 303, …}
71
: 
{name: 'Malachi Fields', position: 'WR', school: 'Notre Dame', team: '', weight: 218, …}
72
: 
{name: 'Mason Reiger', position: 'EDGE', school: 'Wisconsin', team: '', weight: 251, …}
73
: 
{name: 'Bud Clark', position: 'S', school: 'TCU', team: '', weight: 188, …}
74
: 
{name: 'Keyron Crawford', position: 'EDGE', school: 'Auburn', team: '', weight: 253, …}
75
: 
{name: 'C.J. Allen', position: 'LB', school: 'Georgia', team: '', weight: null, …}
76
: 
{name: 'Ted Hurst', position: 'WR', school: 'Georgia State', team: '', weight: 206, …}
77
: 
{name: 'Keylan Rutledge', position: 'OG', school: 'Georgia Tech', team: '', weight: 316, …}
78
: 
{name: 'Max Llewellyn', position: 'EDGE', school: 'Iowa', team: '', weight: 258, …}
79
: 
{name: 'Max Iheanachor', position: 'OT', school: 'Arizona State', team: '', weight: 321, …}
80
: 
{name: 'Antonio Williams', position: 'WR', school: 'Clemson', team: '', weight: 187, …}
81
: 
{name: "De'Zhaun Stribling", position: 'WR', school: 'Mississippi', team: '', weight: null, …}
82
: 
{name: "De'Zhaun Stribling", position: 'WR', school: 'Ole Miss', team: '', weight: 207, …}
83
: 
{name: 'Davison Igbinosun', position: 'CB', school: 'Ohio State', team: '', weight: 189, …}
84
: 
{name: 'Dani Dennis-Sutton', position: 'EDGE', school: 'Penn State', team: '', weight: null, …}
85
: 
{name: 'Anthony Lucas', position: 'EDGE', school: 'USC', team: '', weight: 256, …}
86
: 
{name: 'Jaishawn Barham', position: 'EDGE', school: 'Michigan', team: '', weight: 240, …}
87
: 
{name: 'Justin Joly', position: 'TE', school: 'NC State', team: '', weight: 241, …}
88
: 
{name: 'Jalon Kilgore', position: 'S', school: 'South Carolina', team: '', weight: null, …}
89
: 
{name: 'Josiah Trotter', position: 'LB', school: 'Missouri', team: '', weight: 237, …}
90
: 
{name: 'Beau Stephens', position: 'OG', school: 'Iowa', team: '', weight: 315, …}
91
: 
{name: 'David Gusta', position: 'DT', school: 'Kentucky', team: '', weight: 308, …}
92
: 
{name: 'Malik Muhammad', position: 'CB', school: 'Texas', team: '', weight: 182, …}
93
: 
{name: 'Gracen Halton', position: 'DT', school: 'Oklahoma', team: '', weight: 293, …}
94
: 
{name: 'Germie Bernard', position: 'WR', school: 'Alabama', team: '', weight: 206, …}
95
: 
{name: 'Bryce Lance', position: 'WR', school: 'North Dakota State', team: '', weight: 204, …}
96
: 
{name: 'Trey Zuhn III', position: 'OT', school: 'Texas A&M', team: '', weight: 312, …}
97
: 
{name: 'Nyjalik Kelly', position: 'EDGE', school: 'UCF', team: '', weight: 256, …}
98
: 
{name: 'Cyrus Allen', position: 'WR', school: 'Cincinnati', team: '', weight: 180, …}
99
: 
{name: 'Peter Woods', position: 'EDGE', school: 'Clemson', team: '', weight: 298, …}
[100 … 199]
[200 … 299]
[300 … 399]
[400 … 499]
[500 … 555]
length
: 
556
[[Prototype]]
: 
Array(0)

window.__app.players.filter(p => p.position === "QB").slice(0, 3)
(3) [{…}, {…}, {…}]
0
: 
{name: 'Fernando Mendoza', position: 'QB', school: 'Indiana', team: '', weight: 236, …}
1
: 
{name: 'Ty Simpson', position: 'QB', school: 'Alabama', team: '', weight: 211, …}
2
: 
{name: 'Garrett Nussmeier', position: 'QB', school: 'LSU', team: '', weight: 203, …}
length
: 
3
[[Prototype]]
: 
Array(0)

// Correct way from LESSON 3 getTopAtPosition function;
function getTopAtPosition(position, count) {
  return window.__app.players
    .fliter(p => p.posittion === position)
    .sort((a, b) => b.combined_score - a.combined_score)
    .slice(0, count);
}

//stage 3: challenge 2: Write a formatter function

//First attempt
const formatPlayer = (player) => {
  return `"${p.name} | ${p.position} | ${p.school} | ${p.combined_score}"`
};
// undefined
// app.js:648 Draft not started yet
// formatPlayer(window.__app.players[0]);
// VM9760:2 Uncaught ReferenceError: p is not defined
//     at formatPlayer (<anonymous>:2:14)
//     at <anonymous>:1:1

//Second attempt:

const formatPlayer = (player) => {
  return `"${player.name} | ${player.position} | ${player.school} | ${player.combined_score}'`
}
undefined
formatPlayer(window.__app.players[0])
`"David Bailey | EDGE | Texas Tech | 92'`

//Also why didn't this work before we move on.</anonymous></anonymous>

window.__app.players.forty.slice(0, 10)
VM9465:1 Uncaught TypeError: Cannot read properties of undefined (reading 'slice')
    at <anonymous>:1:28
app.js:648 Draft not started yet
2
draftBoard2026/?dev:1 Uncaught (in promise) Error: A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received
window.__app.players.name.slice(0, 10)
VM9502:1 Uncaught TypeError: Cannot read properties of undefined (reading 'slice')
    at <anonymous>:1:27
window.__app.players.name
undefined
2
app.js:648 Draft not started yet
window.__app.players.filter(p => p.forty).slice(0, 10)
(10) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
0
: 
{name: 'David Bailey', position: 'EDGE', school: 'Texas Tech', team: '', weight: 251, …}
1
: 
{name: 'Jeremiyah Love', position: 'RB', school: 'Notre Dame', team: '', weight: 212, …}
2
: 
{name: 'Rueben Bain Jr.', position: 'EDGE', school: 'Miami', team: '', weight: 263, …}
3
: 
{name: 'Caleb Downs', position: 'S', school: 'Ohio State', team: '', weight: 206, …}
4
: 
{name: 'Fernando Mendoza', position: 'QB', school: 'Indiana', team: '', weight: 236, …}
5
: 
{name: 'Francis Mauigoa', position: 'OT', school: 'Miami', team: '', weight: 329, …}
6
: 
{name: 'Sonny Styles', position: 'LB', school: 'Ohio State', team: '', weight: 244, …}
7
: 
{name: 'Mansoor Delane', position: 'CB', school: 'LSU', team: '', weight: 187, …}
8
: 
{name: 'Makai Lemon', position: 'WR', school: 'USC', team: '', weight: 192, …}
9
: 
{name: 'Carnell Tate', position: 'WR', school: 'Ohio State', team: '', weight: 192, …}
length
: 
10
[[Prototype]]
: 
Array(0)
4
app.js:648 Draft not started yet
window.__app.players.sort((a, b) => b.forty - a.forty).slice(0, 10)
(10) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
0
: 
{name: 'Chris Adams', position: 'OT', school: 'Memphis', team: '', weight: 311, …}
1
: 
{name: 'Giovanni El-Hadi', position: 'OG', school: 'Michigan', team: '', weight: 315, …}
2
: 
{name: 'Raheem Anderson II', position: 'C', school: 'Western Michigan', team: '', weight: 321, …}
3
: 
{name: 'Bryce Foster', position: 'C', school: 'Kansas', team: '', weight: 310, …}
4
: 
{name: 'Nolan Rucci', position: 'OT', school: 'Penn State', team: '', weight: 307, …}
5
: 
{name: "Fa'alili Fa'amoe", position: 'OT', school: 'Wake Forest', team: '', weight: 311, …}
6
: 
{name: 'Zxavian Harris', position: 'DT', school: 'Ole Miss', team: '', weight: 330, …}
7
: 
{name: 'Anez Cooper', position: 'OG', school: 'Miami', team: '', weight: 334, …}
8
: 
{name: 'Keagen Trost', position: 'OT', school: 'Missouri', team: '', weight: 311, …}
9
: 
{name: 'Jeremiah Wright', position: 'OG', school: 'Auburn', team: '', weight: 331, …}
length
: 
10
[[Prototype]]
: 
Array(0)
app.js:648 Draft not started yet
window.__app.players.sort((a, b) => a.forty - b.forty).slice(0, 10)
(10) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
0
: 
{name: 'Emmanuel McNeil-Warren', position: 'S', school: 'Toledo', team: '', weight: null, …}
1
: 
{name: 'Skyler Bell', position: 'WR', school: 'Connecticut', team: '', weight: null, …}
2
: 
{name: 'Peter Woods', position: 'DT', school: 'Clemson', team: '', weight: null, …}
3
: 
{name: 'C.J. Allen', position: 'LB', school: 'Georgia', team: '', weight: null, …}
4
: 
{name: "De'Zhaun Stribling", position: 'WR', school: 'Mississippi', team: '', weight: null, …}
5
: 
{name: 'Dani Dennis-Sutton', position: 'EDGE', school: 'Penn State', team: '', weight: null, …}
6
: 
{name: 'Jalon Kilgore', position: 'S', school: 'South Carolina', team: '', weight: null, …}
7
: 
{name: 'Jake Slaughter', position: 'OG', school: 'Florida', team: '', weight: null, …}
8
: 
{name: 'Sam Hecht', position: 'OG', school: 'Kansas State', team: '', weight: null, …}
9
: 
{name: 'Zxavian Harris', position: 'DT', school: 'Mississippi', team: '', weight: null, …}
length
: 
10
[[Prototype]]
: 
Array(0)

//Challenge 3 Safe property access

const getPlayerHeight = (player) => {
  return ${player.height} || "Nott available"
};
VM10165:2 Uncaught SyntaxError: Unexpected token '{'Understand this error
app.js:648 Draft not started yet
const getPlayerHeight = (player) => {
  return ${player.height} || "Nott available";
}
VM10171:2 Uncaught SyntaxError: Unexpected token '{'Understand this error
const getPlayerHeight = (player) => {
  return ${player.height} || "Nott available"
}
VM10174:2 Uncaught SyntaxError: Unexpected token '{'Understand this error
app.js:648 Draft not started yet
const getPlayerHeight = (player) => ${player.height} || "Nott available"
VM10189:1 Uncaught SyntaxError: Unexpected token '{'Understand this error
app.js:648 Draft not started yet
const getPlayerHeight = (player) => `{
  return ${player.height} || "Nott available"
};`
undefined
app.js:648 Draft not started yet
getPlayerHeight(window.__app.players[0]
                
VM10317:1 Uncaught SyntaxError: missing ) after argument listUnderstand this error
app.js:648 Draft not started yet
getPlayerHeight(window.__app.players[0])
                
'{\n  return 6-4 || "Nott available"\n};'

// attempt 3:

const getPlayerHeight = (player) => {
  return `${player.height}` || "Not available"
};
undefined
getPlayerHeight(window.__app.players[0])
                
'6-4'
getPlayerHeight(window.__app.players[1000])
                
VM10490:2 Uncaught TypeError: Cannot read properties of undefined (reading 'height')
    // at getPlayerHeight (<anonymous>:2:20)
    // at <>:1:1

// Quick Check

window.__app.players[5].name
'Francis Mauigoa'

window.__app.players[5].height
'6-6'

const getPlayerHeight = (player) => {
  if (!player) return "No player found";
  return `${player.height}` || "Not available";
};

async function loadPlayer() {
  const res = await fetch('./data/players.json');
  const data = await res.json();
  player = data;
}

const res = await fetch('./data/players.json');
undefined
console.log(res)
VM11584:1 Response {type: 'basic', url: 'https://barroso2223.github.io/draftBoard2026/data/players.json', redirected: false, status: 200, ok: true, …}
undefined
app.js:648 Draft not started yet
const data = await res.json();
undefined
console.log(data[0].length);
VM11765:1 undefined
undefined
app.js:648 Draft not started yet
console.log(data.length);
VM11771:1 556
undefined
console.log(data[0].name);
VM11806:1 David Bailey
undefined

const fetchJSON = async (url) => {
  const res = await fetch('./data/players.json');
  const data = await res.json();

  player = data;
}

const fetchJSON = async (url) => {
  const res = await fetch('./data/players.json');
  const data = await res.json();

  player = data;
}
undefined
app.js:648 Draft not started yet
const players = await fetchJSON('./data/players.json');
undefined
console.log(players.length);
VM12194:1 Uncaught TypeError: Cannot read properties of undefined (reading 'length')
    at <anonymous>:1:21
(anonymous) @ VM12194:1Understand this error
app.js:648 Draft not started yet
console.log(window.__app.players.length);
VM12215:1 556
undefined

// math.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
default const multiply = (a, b) => a * b;

import { createElement } from "react";
// main.js
import multiply { add, subtract} from './math';

console.log(add(5, 3));
console.log(subtract(5, 3));
console.log(multiply(5, 3));

// Get element
const container = document.getElementById('top25List');
// Read its content
console.log(container.innerHTML);
// Change its content
container.innerHTML = '<div>New Content</div>';

// $ step render pattern
// 1. GET the container
const container = document.getElementById('top25List');
// 2. Clear it
container.innerHTML = '';
// 3. Build new HTML
const html = players.map(p => `<div>${p.name}</div>`).join('');
// 4. Write it
container.innerHTML = html;

// Event Delegation
// BAD - one listener per player (400 listeners!)
players.forEach(p => {
  document.getElementById('players-${p.id}').addEventListener('click', handler);
});

// Good - one listener on the parent (1 listener!)
document.getElementById('top25List').addEventListener('click', (e) => {
  const playerElement = e.target.closest('.player-row');
  if (!playerElement) return;
  const playerId = playerElement.dataset.id;
  handlePlayerClick(playerId);
});

// Stage 2 - Connect to your app

// renderDraftBoard
function renderDraftBoard() {
  const container = document.getElementById('draftBoard');
  container.innerHTML = draftedPicks
    .map(pick => `<div class="pick-row">#${pick.overall} ${pick.playerName}</div>`)
    .join('');
}

// Stage 3: Build from scratch
// Challenge 1: Create and render list

const renderList() {
  const container = document.getElementById('testList');
  container.innerHTML = list
    .slice(0, 5);
  const html = `<div>${p.name} ($p.position)</div>`;
  return html;
}

// correct version
const renderList = (players) => {
  const container = document.getElementById('testList');
  if (!container) {
    // Create the container if it doesn't exist
    const div = document.createElement('div');
    div.id = 'testList';
    document.body.appendChild(div);
  }

  const top5 = players.slice(0, 5);
  const html = top5.map(p => `<div class="player-row">${p.name} (${p.potistion})</div>`).join('');
  container.innerHTML = html;
};

renderList(window.__app.players);

//Challenge 2: event delegation
function clickListener() {
  document.getElementById('testList').addEventListener('click', (e) => {
    const player = e.target.closest('.player-row');
    if (!player) return;

    // Blank!!!
    console.log()
  })
}

// Fixed
const setupClickListener = () => {
  const container = document.getElementById('testList');
  if (!container) return;

  container.addEventListener('click', (e) => {
    const playerRow = e.target.closest('.player-row');
    if (!playerRow) return;

    // Get the player name from the div's text content
    const name = playerRow.textContent.split('(')[0].trim();
    console.log(`Clicked on: ${name}`);
  });
};

// Call it after rendering
renderList(window.__app.players);
setupClickListener();

// FINAL CHALLENGE combined "Mini-App"
async function getPlayer() {
  const res = await fetch('./data/players.json');
  const data = await res.json();
  player = data;
}

const renderTop10 = () => players.sort((a, b) => b.combined_score - a.combined_score).slice(0, 10);

function clickListener() {
  document.getElementById('testList').addEventListener('click', (e) => {
    const player = e.target.closest('.player-row');
    if (!player) return;
    //blank!!
  })

}

// FIXED MINI APP

// Module 1: Fetch Data
async function  fetchPlayer() {
  const res = await fetch('./data.players.json');
  const data = await res.json();
  return data;
}

// Module 2: Render Logic
const renderTop10 = (players) => {
  const container = document.getElementById('testList');
  if (!container) {
    const div = document.createElement('div');
    div.id = 'top10Container';
    document.body.appendChild(div);
  }

  const top10 = players
    .sort((a, b) => b.combined_score - a.combined_score)
    .slice(0, 10);

  const html = top10.map(=> `<div class="player-row"> data-name:"${p.name}">${p.name} (${p.position}) - Score: ${p.combined_score}</div>`).join('');

  document.getElementById('top10Container').addEventListener('click', (e) => {
    const row = e.target.closest('.player-row');
    if (!row) return;
    const name = row.dataset.name;
    console.log(`Player selected: ${p.name}`);
    alert(`You clicked on ${name}`);
  });
};

// Module 4: main app
async function initApp() {
  const players = await fetchPlayer();
  renderTop10(players);
  setupClickListener();
}

// Run it
initApp();

// DRILLS

//Step 1 Get the parent container
const container = document.getElementById('someId');
//Step 2 Add one click listener to the parent
container.addEventListener('click', (event) => {
  // Step 3 Find the actual clicked element using closest()
  const item = event.target.closest('.item-class');

  // Step 4 If nothing was clicked, ignore
  if (!item) return;

  // Step 5 Do something with the item
  console.log(item.dataset.id);
});

// Excercise write 5 times
//Exercise 1: Write an event listener that logs clicks on .player-card elements
const container = document.getElementById('someId');
container.addEventListener('click', (e) => {
  const item = e.target.closest('.player-card');
  if (!item) return;
  console.log(item.dataset.id);
});

// Exercise 2: Write an event listener that alerts the data-name when clicking .product-row
const container = document.getElementById('someId');
container.addEventListener('click', (e) => {
  const item = e.target.clolsest('.product-row');
  if (!item) return;
  console.log(item.dataset.data-name);
});

//Exercise 3: Write an event listener that changes the background color of clicked .todo-item to yellow
const container = document.getElementById('someId');
container = addEventListener('click', (e) => {
  const item = e.target.closest('.todo-list');
  if (!item) return;
  const background = `<div class="todo-list" style:"background-color: yellow;"</div>`;
  console.log("background color changed to yellow");
});

//Exercise 4: Write an event listener that removes the clicked .notification from the DOM
const container = document.getElementById('someId');
container = addEventListener('click', (e) => {
  const item = e.target.closest('.notification');
  if (!item) return;

});

// Exercise 5: Write an event listener that logs the text content of clicked .message
const container = document.getElementById('someId');
container = addEventListener('click', (e) => {
  const item = e.target.closest('.message');
  if (!item) return;
  const message = document.getElementsByClassName('message').innerHTML;
  console.log(`${message}`);
});

//DRILL 2: Map + Join to Render HTML (From Scratch)
//Pattern to memorize

// Step 1: Start with array
const items = [{ name: 'David', score: 92}, {name: 'Jeremiyah', score: 91}];

// Step 2: Map to html strings
const htmlArray = items.map(item => `<div class="player">${item.name} - ${item.score}</div>`);

// Step 3: Join into one string
const htmlString = htmlArray.join('');

// Step 4: Insert into DOM
container.innerHTML = htmlString;

// All in one line:
container.innerHTML = items.map(item => `<div>${item.name}</div>`).join('');

// 5 times from memory

//Exercise 1: Render an array of names as <li> tags inside a <ul>
const names = ['Alice', 'Bob', 'Charlie'];
const container = document.getElementById('myList');
container.innerHTML = names.map(name => `<ul><li>${names}</li></ul>`).join('');

//Exercise 2: Render players as <div class="player-card">Name: NAME (POSITION)</div>
const players = [{ name: 'Tom', position: 'QB' }, { name: 'Jerry', position: 'RB'}];
const container = document.getElementById('playerContainer');
container.innerHTML = players.map(player => `<div class="player-card">Name: ${player.name} (${player.position})</div>`);

// Exercise 3: Render products as <button data-id="ID">NAME - $PRICE</button>
const products = [{id: 1, name: 'Laptop', price: 999 }, {id: 2, name: 'Mouse', price: 25 }];
const container = document.getElementById('productContainer');
container.innerHTML = products.map(product => `<button data-id="${product.id}">${product.name} - $${product.price}</button>`);

//Exercise 4: Render a list of todos with checkboxes
const todos = [{ task: 'Learn JS', done: false }, {task: 'Build App', done: true}];
const container = document.getElementById('todoContainer');
container.innerHTML = todos.map(todo => `<div><input type="checkbox" ${done ? 'checked' : ''}> ${todo.task}</div>`);

//Exercise 5: Render a table rows from data
const data = [{ name: 'David', score: 92, rank: 1 }, { name: 'Caleb', score: 88, rank: 2 }];
const container = document.getElementByI('tableBody');
container.innerHTML = data.map(d => `<tr><td>${d.rank}</td><td>${d.name}</td><td>${d.score}</td></tr>`);

//DRILL 3: Combined Challenge (Putting It Together)
//Build a complete mini-app from scratch WITHOUT looking:

// Step 1: Sample data
const team = [
  {id: 1, name: 'David Bailey', position: 'EDGE', score: 92},
  {id: 2, name: 'Jeremiyah Love', position: 'RB', score: 91},
  {id: 3, name: 'Caleb Downs', position: 'S', score: 90}
];

// Step 2: Get or create a container div with id="teamContainer"
const container = document.getElementById('teamContainer');
if (!teamContainer) {
  const div = createElement('div');
  div.innerHTML = div.map(d => `<div id="teamContainer"></div>`);

}

// Step 3: Render the players as divs with class="player-card" and data-id attribute
container.innerHTML = team.map(p => `<div class="player-card" data-id="$p.id>Name: ${p.name} (${p.position}) Score: ${p.score}</div>`);

// Step 4: Add event delegation to log "You clicked PLAYER_NAME" when any player is clicked
container.addEventListener('click', (e) => {
  const item = e.target.closest('.player-card');
  if (!item) return;

  console.log(`You clicked ${team.name}`);
  // Step 5: (Bonus) When clicked, also highlight the clicked card with a yellow background
  container.innerHTML = `<div class="player-card" style="background-color: yellow"></div>`;
});


// Drill 1: Create a div, add it to body, set innerHTML to "Hello World"
function createDiv() {
  const container = document.getElementById('someId');
  container.addEventListener('click', (e) => {
    const item = e.target.closest('.someClass');
    if (!item) => {
      let div = createElement('div');
      div.body.appendChild = `<div class="someClass">Hello World</div>`;
    }
    item.innerHTML = `<div class="someClass">Hello World</div>`;
  });
};

//Correct Answer
// That's it. Three lines.
const div = document.createElement('div');
document.body.appendChild(div);
div.innerHTML = 'Hello World';

// Drill 2: Add a click listener to that div that logs "Clicked!"
const clickedDiv = () => {
  const container = document.getElementById('someId');
  container.addEventListener('click', (e) => {
    const item = e.target.clolsest('.someClass');
    if (!item) return;
  });
  console.log('Clicked!');
};

//Correct Answer
// div already exists from Drill 1
div.addEventListener('click', () => {
  console.log('Clicked!');
});

// Drill 3: Array of 3 names → render as <button>Name</button>

const arrayButton = () => {
  const names = ['David', 'Jeremiyah', 'Fernando'];

  const container = document.getElementById('someId');
  container.addEventListener('click', (e) => {
    const item = e.target.closest('.someClass');
    if (!item) return;

    item.body.appendChild = `<button>${names}</button>`;
  });
  console.log('You Clicked on Player');
};

// Correct Answer
const names = ['David', 'Jeremiyah', 'Fernando'];
div.innerHTML = names.map(name => `<button>${name}</button>`).join('');


// Now Write Each One From Scratch
const div = document.createElement('div');
document.body.appendChild(div);
div.innerHTML = 'Hello World';

div.addEventListener('click', () => {
  console.log('Clicked!');
});

const names = ['David', 'Jeremiyah', 'Fernando'];
div.innerHTML = names.map(name => `<button>${name}</button>`).join('');


// PYTHON COURSE
// test.py


