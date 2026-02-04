// 2026 NFL Draft Complete Order - All 7 Rounds
// Source: Updated draft order CSV

// Team name to abbreviation mapping
const teamAbbrevMap = {
  "Las Vegas Raiders": "LV",
  "New York Jets": "NYJ",
  "Arizona Cardinals": "ARI",
  "Tennessee Titans": "TEN",
  "New York Giants": "NYG",
  "Cleveland Browns": "CLE",
  "Washington Commanders": "WAS",
  "New Orleans Saints": "NO",
  "Kansas City Chiefs": "KC",
  "Cincinnati Bengals": "CIN",
  "Miami Dolphins": "MIA",
  "Dallas Cowboys": "DAL",
  "Atlanta Falcons": "ATL",
  "Baltimore Ravens": "BAL",
  "Tampa Bay Buccaneers": "TB",
  "Indianapolis Colts": "IND",
  "Detroit Lions": "DET",
  "Minnesota Vikings": "MIN",
  "Carolina Panthers": "CAR",
  "Green Bay Packers": "GB",
  "Pittsburgh Steelers": "PIT",
  "LA Chargers": "LAC",
  "Los Angeles Chargers": "LAC",
  "Philadelphia Eagles": "PHI",
  "Jacksonville Jaguars": "JAX",
  "Chicago Bears": "CHI",
  "Buffalo Bills": "BUF",
  "San Francisco 49ers": "SF",
  "Houston Texans": "HOU",
  "LA Rams": "LAR",
  "Los Angeles Rams": "LAR",
  "Denver Broncos": "DEN",
  "New England Patriots": "NE",
  "Seattle Seahawks": "SEA"
};

// Team needs for AI drafting
const teamNeeds = {
  LV: ["QB", "EDGE", "CB", "WR", "OT"],
  NYJ: ["OT", "WR", "EDGE", "CB", "S"],
  ARI: ["EDGE", "CB", "OT", "WR", "ILB"],
  TEN: ["WR", "OT", "EDGE", "CB", "S"],
  NYG: ["QB", "OT", "EDGE", "WR", "CB"],
  CLE: ["QB", "WR", "EDGE", "CB", "OT"],
  WAS: ["CB", "EDGE", "WR", "OT", "S"],
  NO: ["QB", "OT", "WR", "CB", "EDGE"],
  KC: ["WR", "CB", "EDGE", "OT", "S"],
  CIN: ["OT", "EDGE", "CB", "WR", "DL"],
  MIA: ["OT", "EDGE", "ILB", "CB", "WR"],
  DAL: ["CB", "DL", "EDGE", "OT", "S"],
  ATL: ["EDGE", "DL", "CB", "OT", "WR"],
  BAL: ["WR", "CB", "EDGE", "OT", "ILB"],
  TB: ["EDGE", "CB", "S", "OT", "WR"],
  IND: ["WR", "EDGE", "CB", "OT", "S"],
  DET: ["CB", "EDGE", "DL", "ILB", "S"],
  MIN: ["OT", "CB", "EDGE", "WR", "S"],
  CAR: ["OT", "WR", "EDGE", "CB", "QB"],
  GB: ["DL", "EDGE", "S", "CB", "WR"],
  PIT: ["OT", "WR", "CB", "EDGE", "ILB"],
  LAC: ["EDGE", "CB", "OG", "OT", "WR"],
  PHI: ["CB", "ILB", "S", "EDGE", "WR"],
  JAX: ["OT", "EDGE", "CB", "WR", "S"],
  CHI: ["CB", "WR", "EDGE", "OT", "S"],
  BUF: ["EDGE", "CB", "OT", "WR", "DL"],
  SF: ["CB", "EDGE", "S", "WR", "OT"],
  HOU: ["EDGE", "CB", "OT", "WR", "S"],
  LAR: ["EDGE", "CB", "DL", "OT", "WR"],
  DEN: ["OT", "EDGE", "WR", "CB", "S"],
  NE: ["WR", "CB", "OT", "EDGE", "S"],
  SEA: ["DL", "EDGE", "CB", "OT", "WR"]
};

// Parse the CSV data
const csvData = `Overall Pick,Round,Pick in Round,Team,Notes
1,1,1,Las Vegas Raiders,
2,1,2,New York Jets,
3,1,3,Arizona Cardinals,
4,1,4,Tennessee Titans,
5,1,5,New York Giants,
6,1,6,Cleveland Browns,
7,1,7,Washington Commanders,
8,1,8,New Orleans Saints,
9,1,9,Kansas City Chiefs,
10,1,10,Cincinnati Bengals,
11,1,11,Miami Dolphins,
12,1,12,Dallas Cowboys,
13,1,13,LA Rams,from Atlanta
14,1,14,Baltimore Ravens,
15,1,15,Tampa Bay Buccaneers,
16,1,16,New York Jets,from Indianapolis
17,1,17,Detroit Lions,
18,1,18,Minnesota Vikings,
19,1,19,Carolina Panthers,
20,1,20,Dallas Cowboys,from Green Bay
21,1,21,Pittsburgh Steelers,
22,1,22,LA Chargers,
23,1,23,Philadelphia Eagles,
24,1,24,Cleveland Browns,from Jacksonville
25,1,25,Chicago Bears,
26,1,26,Buffalo Bills,
27,1,27,San Francisco 49ers,
28,1,28,Houston Texans,
29,1,29,LA Rams,
30,1,30,Denver Broncos,
31,1,31,New England Patriots,
32,1,32,Seattle Seahawks,
33,2,1,New York Jets,
34,2,2,Arizona Cardinals,
35,2,3,Tennessee Titans,
36,2,4,Las Vegas Raiders,
37,2,5,New York Giants,
38,2,6,Houston Texans,from Washington
39,2,7,Cleveland Browns,
40,2,8,Kansas City Chiefs,
41,2,9,Cincinnati Bengals,
42,2,10,New Orleans Saints,
43,2,11,Miami Dolphins,
44,2,12,New York Jets,from Dallas
45,2,13,Baltimore Ravens,
46,2,14,Tampa Bay Buccaneers,
47,2,15,Indianapolis Colts,
48,2,16,Atlanta Falcons,
49,2,17,Minnesota Vikings,
50,2,18,Detroit Lions,
51,2,19,Carolina Panthers,
52,2,20,Green Bay Packers,
53,2,21,Pittsburgh Steelers,
54,2,22,Philadelphia Eagles,
55,2,23,LA Chargers,
56,2,24,Jacksonville Jaguars,
57,2,25,Chicago Bears,
58,2,26,San Francisco 49ers,
59,2,27,Houston Texans,
60,2,28,Buffalo Bills,
61,2,29,LA Rams,
62,2,30,Denver Broncos,
63,2,31,New England Patriots,
64,2,32,Seattle Seahawks,
65,3,1,Arizona Cardinals,
66,3,2,Tennessee Titans,
67,3,3,Las Vegas Raiders,
68,3,4,Philadelphia Eagles,from NY Jets
69,3,5,Houston Texans,from NY Giants
70,3,6,Cleveland Browns,
71,3,7,Washington Commanders,
72,3,8,Cincinnati Bengals,
73,3,9,New Orleans Saints,
74,3,10,Kansas City Chiefs,
75,3,11,Miami Dolphins,
76,3,12,Pittsburgh Steelers,from Dallas
77,3,13,Tampa Bay Buccaneers,
78,3,14,Indianapolis Colts,
79,3,15,Atlanta Falcons,
80,3,16,Baltimore Ravens,
81,3,17,Jacksonville Jaguars,from Detroit
82,3,18,Minnesota Vikings,
83,3,19,Carolina Panthers,
84,3,20,Green Bay Packers,
85,3,21,Pittsburgh Steelers,
86,3,22,LA Chargers,
87,3,23,Miami Dolphins,from Philadelphia
88,3,24,Jacksonville Jaguars,
89,3,25,Chicago Bears,
90,3,26,Miami Dolphins,from Houston
91,3,27,Buffalo Bills,
92,3,28,San Francisco 49ers,
93,3,29,LA Rams,
94,3,30,Denver Broncos,
95,3,31,New England Patriots,
96,3,32,Seattle Seahawks,
97,3,33,Minnesota Vikings,compensatory
98,3,34,Philadelphia Eagles,compensatory
99,3,35,Pittsburgh Steelers,compensatory
100,3,36,Jacksonville Jaguars,from Detroit - compensatory
101,4,1,Tennessee Titans,
102,4,2,Las Vegas Raiders,
103,4,3,New York Jets,
104,4,4,Arizona Cardinals,
105,4,5,New York Giants,
106,4,6,Houston Texans,from Washington
107,4,7,Cleveland Browns,
108,4,8,Denver Broncos,from New Orleans
109,4,9,Kansas City Chiefs,
110,4,10,Cincinnati Bengals,
111,4,11,Miami Dolphins,
112,4,12,Dallas Cowboys,
113,4,13,Indianapolis Colts,
114,4,14,Atlanta Falcons,
115,4,15,Baltimore Ravens,
116,4,16,Tampa Bay Buccaneers,
117,4,17,Las Vegas Raiders,from Minnesota
118,4,18,Detroit Lions,
119,4,19,Carolina Panthers,
120,4,20,Green Bay Packers,
121,4,21,Pittsburgh Steelers,
122,4,22,Philadelphia Eagles,
123,4,23,LA Chargers,
124,4,24,Jacksonville Jaguars,
125,4,25,New England Patriots,from Chicago
126,4,26,Buffalo Bills,
127,4,27,San Francisco 49ers,
128,4,28,Houston Texans,
129,4,29,Chicago Bears,from LA Rams
130,4,30,Denver Broncos,
131,4,31,New England Patriots,
132,4,32,New Orleans Saints,from Seattle
133,4,33,San Francisco 49ers,compensatory
134,4,34,Las Vegas Raiders,compensatory
135,4,35,Pittsburgh Steelers,compensatory
136,4,36,New Orleans Saints,compensatory
137,4,37,Philadelphia Eagles,compensatory
138,4,38,San Francisco 49ers,compensatory
139,5,1,Cleveland Browns,from Las Vegas
140,5,2,Tennessee Titans,from NY Jets
141,5,3,Arizona Cardinals,
142,5,4,Tennessee Titans,
143,5,5,New York Giants,
144,5,6,Cleveland Browns,
145,5,7,Washington Commanders,
146,5,8,Kansas City Chiefs,
147,5,9,Cleveland Browns,from Cincinnati
148,5,10,New Orleans Saints,
149,5,11,Miami Dolphins,
150,5,12,Dallas Cowboys,
151,5,13,Philadelphia Eagles,from Atlanta
152,5,14,Baltimore Ravens,
153,5,15,Tampa Bay Buccaneers,
154,5,16,Indianapolis Colts,
155,5,17,Detroit Lions,
156,5,18,Carolina Panthers,from Minnesota
157,5,19,Carolina Panthers,
158,5,20,Green Bay Packers,
159,5,21,Pittsburgh Steelers,
160,5,22,Baltimore Ravens,from LA Chargers
161,5,23,Minnesota Vikings,from Philadelphia
162,5,24,Jacksonville Jaguars,
163,5,25,Chicago Bears,
164,5,26,Jacksonville Jaguars,from San Francisco
165,5,27,Houston Texans,
166,5,28,Buffalo Bills,
167,5,29,LA Rams,
168,5,30,Denver Broncos,
169,5,31,New England Patriots,
170,5,32,New Orleans Saints,from Seattle
171,5,33,San Francisco 49ers,compensatory
172,5,34,Baltimore Ravens,compensatory
173,5,35,Baltimore Ravens,compensatory
174,5,36,Las Vegas Raiders,compensatory
175,5,37,New York Jets,compensatory
176,5,38,Kansas City Chiefs,compensatory
177,5,39,Dallas Cowboys,compensatory
178,5,40,New York Jets,compensatory
179,5,41,Philadelphia Eagles,compensatory
180,5,42,Detroit Lions,compensatory
181,6,1,Las Vegas Raiders,from NY Jets
182,6,2,Arizona Cardinals,
183,6,3,Tennessee Titans,
184,6,4,Las Vegas Raiders,
185,6,5,New York Giants,
186,6,6,Washington Commanders,
187,6,7,Detroit Lions,from Cleveland
188,6,8,Cincinnati Bengals,
189,6,9,New Orleans Saints,
190,6,10,New England Patriots,from Kansas City
191,6,11,New York Giants,from Miami
192,6,12,New York Giants,from Dallas
193,6,13,New York Jets,from Baltimore
194,6,14,Tampa Bay Buccaneers,
195,6,15,Minnesota Vikings,from Indianapolis
196,6,16,Atlanta Falcons,
197,6,17,Washington Commanders,from Minnesota
198,6,18,Cincinnati Bengals,from Detroit
199,6,19,Carolina Panthers,
200,6,20,Green Bay Packers,
201,6,21,New England Patriots,from Pittsburgh
202,6,22,Jacksonville Jaguars,from Philadelphia
203,6,23,LA Chargers,
204,6,24,Detroit Lions,from Jacksonville
205,6,25,Cleveland Browns,from Chicago
206,6,26,LA Rams,from Houston
207,6,27,New York Jets,from Buffalo
208,6,28,New England Patriots,from San Francisco
209,6,29,LA Rams,
210,6,30,Baltimore Ravens,from Denver
211,6,31,New England Patriots,
212,6,32,Seattle Seahawks,
213,6,33,Pittsburgh Steelers,compensatory
214,6,34,Pittsburgh Steelers,compensatory
215,6,35,Dallas Cowboys,compensatory
216,6,36,Indianapolis Colts,compensatory
217,7,1,Arizona Cardinals,
218,7,2,New York Jets,from Tennessee
219,7,3,Las Vegas Raiders,
220,7,4,Buffalo Bills,from NY Jets
221,7,5,Dallas Cowboys,from NY Giants
222,7,6,Detroit Lions,from Cleveland
223,7,7,Washington Commanders,
224,7,8,Pittsburgh Steelers,from New Orleans
225,7,9,Dallas Cowboys,from Kansas City
226,7,10,Cincinnati Bengals,
227,7,11,Miami Dolphins,
228,7,12,Buffalo Bills,from Dallas
229,7,13,Tampa Bay Buccaneers,
230,7,14,Indianapolis Colts,
231,7,15,Atlanta Falcons,
232,7,16,LA Rams,from Baltimore
233,7,17,Jacksonville Jaguars,from Detroit
234,7,18,Minnesota Vikings,
235,7,19,Carolina Panthers,
236,7,20,Green Bay Packers,
237,7,21,Pittsburgh Steelers,
238,7,22,Tennessee Titans,from LA Chargers
239,7,23,Chicago Bears,from Philadelphia
240,7,24,Minnesota Vikings,from Jacksonville
241,7,25,Chicago Bears,
242,7,26,New York Jets,from Buffalo
243,7,27,Houston Texans,from San Francisco
244,7,28,Houston Texans,
245,7,29,Jacksonville Jaguars,from LA Rams
246,7,30,Denver Broncos,
247,7,31,New England Patriots,
248,7,32,Cleveland Browns,from Seattle
249,7,33,Baltimore Ravens,compensatory
250,7,34,LA Rams,compensatory
251,7,35,Denver Broncos,compensatory
252,7,36,Baltimore Ravens,compensatory
253,7,37,Indianapolis Colts,compensatory
254,7,38,Green Bay Packers,compensatory
255,7,39,Denver Broncos,compensatory
256,7,40,LA Rams,compensatory
257,7,41,Green Bay Packers,compensatory`;

// Parse CSV and create draft order
function parseDraftOrder(csv) {
  const lines = csv.trim().split('\n');
  const picks = [];

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',');
    const overallPick = parseInt(parts[0]);
    const round = parseInt(parts[1]);
    const pickInRound = parseInt(parts[2]);
    const team = parts[3];
    const notes = parts[4] || '';

    const abbrev = teamAbbrevMap[team];
    if (!abbrev) continue;

    picks.push({
      pick: overallPick,
      round,
      pickInRound,
      team,
      abbrev,
      notes,
      needs: teamNeeds[abbrev] || ["EDGE", "CB", "WR", "OT", "S"]
    });
  }

  return picks;
}

export const draftOrder = parseDraftOrder(csvData);

// Get picks for a specific round
export const getPicksByRound = (round) => {
  return draftOrder.filter(p => p.round === round);
};

// Get round info
export const roundInfo = {
  1: { picks: 32, start: 1, end: 32 },
  2: { picks: 32, start: 33, end: 64 },
  3: { picks: 36, start: 65, end: 100 },  // includes compensatory
  4: { picks: 38, start: 101, end: 138 }, // includes compensatory
  5: { picks: 42, start: 139, end: 180 }, // includes compensatory
  6: { picks: 36, start: 181, end: 216 }, // includes compensatory
  7: { picks: 41, start: 217, end: 257 }  // includes compensatory
};

// Legacy export for compatibility - first round only
export const firstRoundOrder = draftOrder.filter(p => p.round === 1);

// Team colors for styling
export const teamColors = {
  LV: { primary: "#000000", secondary: "#A5ACAF" },
  NYJ: { primary: "#125740", secondary: "#FFFFFF" },
  ARI: { primary: "#97233F", secondary: "#000000" },
  TEN: { primary: "#4B92DB", secondary: "#0C2340" },
  NYG: { primary: "#0B2265", secondary: "#A71930" },
  CLE: { primary: "#311D00", secondary: "#FF3C00" },
  WAS: { primary: "#5A1414", secondary: "#FFB612" },
  NO: { primary: "#D3BC8D", secondary: "#101820" },
  KC: { primary: "#E31837", secondary: "#FFB81C" },
  CIN: { primary: "#FB4F14", secondary: "#000000" },
  MIA: { primary: "#008E97", secondary: "#FC4C02" },
  DAL: { primary: "#003594", secondary: "#869397" },
  ATL: { primary: "#A71930", secondary: "#000000" },
  BAL: { primary: "#241773", secondary: "#000000" },
  TB: { primary: "#D50A0A", secondary: "#34302B" },
  IND: { primary: "#002C5F", secondary: "#A2AAAD" },
  DET: { primary: "#0076B6", secondary: "#B0B7BC" },
  MIN: { primary: "#4F2683", secondary: "#FFC62F" },
  CAR: { primary: "#0085CA", secondary: "#101820" },
  GB: { primary: "#203731", secondary: "#FFB612" },
  PIT: { primary: "#FFB612", secondary: "#101820" },
  LAC: { primary: "#0080C6", secondary: "#FFC20E" },
  PHI: { primary: "#004C54", secondary: "#A5ACAF" },
  JAX: { primary: "#006778", secondary: "#D7A22A" },
  CHI: { primary: "#0B162A", secondary: "#C83803" },
  BUF: { primary: "#00338D", secondary: "#C60C30" },
  SF: { primary: "#AA0000", secondary: "#B3995D" },
  HOU: { primary: "#03202F", secondary: "#A71930" },
  LAR: { primary: "#003594", secondary: "#FFA300" },
  DEN: { primary: "#FB4F14", secondary: "#002244" },
  NE: { primary: "#002244", secondary: "#C60C30" },
  SEA: { primary: "#002244", secondary: "#69BE28" }
};

// Get all unique teams
export const allTeams = [...new Set(draftOrder.map(p => p.abbrev))].sort();
