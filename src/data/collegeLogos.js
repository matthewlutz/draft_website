// College name to ESPN Team ID mapping
// ESPN CDN provides high-quality 500x500 PNG logos
// URL pattern: https://a.espncdn.com/i/teamlogos/ncaa/500/{TEAM_ID}.png

const collegeToEspnId = {
  // A
  'Air Force': 2005,
  'Akron': 2006,
  'Alabama': 333,
  'App State': 2026,
  'Appalachian State': 2026,
  'Arizona': 12,
  'Arizona State': 9,
  'Arkansas': 8,
  'Arkansas State': 2032,
  'Army': 349,
  'Auburn': 2,

  // B
  'Ball State': 2050,
  'Baylor': 239,
  'Boise State': 68,
  'Boston College': 103,
  'Bowling Green': 189,
  'Buffalo': 2084,
  'BYU': 252,
  'Brigham Young': 252,

  // C
  'California': 25,
  'Cal': 25,
  'Central Michigan': 2117,
  'Charlotte': 2429,
  'Cincinnati': 2132,
  'Clemson': 228,
  'Coastal Carolina': 324,
  'Colorado': 38,
  'Colorado State': 36,

  // D
  'Delaware': 48,
  'Duke': 150,

  // E
  'East Carolina': 151,
  'Eastern Michigan': 2199,

  // F
  'Florida': 57,
  'Florida Atlantic': 2226,
  'FAU': 2226,
  'Florida International': 2229,
  'FIU': 2229,
  'Florida State': 52,
  'Fresno State': 278,

  // G
  'Georgia': 61,
  'Georgia Southern': 290,
  'Georgia State': 2247,
  'Georgia Tech': 59,

  // H
  'Hawaii': 62,
  "Hawai'i": 62,
  'Houston': 248,

  // I
  'Illinois': 356,
  'Indiana': 84,
  'Iowa': 2294,
  'Iowa State': 66,

  // J
  'Jacksonville State': 55,
  'James Madison': 256,

  // K
  'Kansas': 2305,
  'Kansas State': 2306,
  'Kennesaw State': 338,
  'Kent State': 2309,
  'Kentucky': 96,

  // L
  'Liberty': 2335,
  'Louisiana': 309,
  'Louisiana Tech': 2348,
  'Louisville': 97,
  'LSU': 99,
  'Louisiana State': 99,

  // M
  'Marshall': 276,
  'Maryland': 120,
  'Massachusetts': 113,
  'UMass': 113,
  'Memphis': 235,
  'Miami': 2390,
  'Miami (FL)': 2390,
  'Miami (OH)': 193,
  'Michigan': 130,
  'Michigan State': 127,
  'Middle Tennessee': 2393,
  'MTSU': 2393,
  'Minnesota': 135,
  'Mississippi State': 344,
  'Missouri': 142,
  'Missouri State': 2623,

  // N
  'Navy': 2426,
  'NC State': 152,
  'North Carolina State': 152,
  'Nebraska': 158,
  'Nevada': 2440,
  'New Mexico': 167,
  'New Mexico State': 166,
  'North Carolina': 153,
  'UNC': 153,
  'Northern Illinois': 2459,
  'NIU': 2459,
  'North Texas': 249,
  'Northwestern': 77,
  'Notre Dame': 87,

  // O
  'Ohio': 195,
  'Ohio State': 194,
  'Oklahoma': 201,
  'Oklahoma State': 197,
  'Old Dominion': 295,
  'Ole Miss': 145,
  'Mississippi': 145,
  'Oregon': 2483,
  'Oregon State': 204,

  // P
  'Penn State': 213,
  'Pittsburgh': 221,
  'Pitt': 221,
  'Purdue': 2509,

  // R
  'Rice': 242,
  'Rutgers': 164,

  // S
  'Sam Houston': 2534,
  'Sam Houston State': 2534,
  'San Diego State': 21,
  'SDSU': 21,
  'San Jose State': 23,
  'San José State': 23,
  'SJSU': 23,
  'SMU': 2567,
  'Southern Methodist': 2567,
  'South Alabama': 6,
  'South Carolina': 2579,
  'Southern Miss': 2572,
  'Southern Mississippi': 2572,
  'South Florida': 58,
  'USF': 58,
  'Stanford': 24,
  'Syracuse': 183,

  // T
  'TCU': 2628,
  'Texas Christian': 2628,
  'Temple': 218,
  'Tennessee': 2633,
  'Texas': 251,
  'Texas A&M': 245,
  'Texas State': 326,
  'Texas Tech': 2641,
  'Toledo': 2649,
  'Troy': 2653,
  'Tulane': 2655,
  'Tulsa': 202,

  // U
  'UAB': 5,
  'UCF': 2116,
  'Central Florida': 2116,
  'UCLA': 26,
  'UConn': 41,
  'Connecticut': 41,
  'UL Monroe': 2433,
  'Louisiana-Monroe': 2433,
  'UNLV': 2439,
  'Nevada-Las Vegas': 2439,
  'USC': 30,
  'Southern California': 30,
  'Utah': 254,
  'Utah State': 328,
  'UTEP': 2638,
  'Texas-El Paso': 2638,
  'UTSA': 2636,
  'Texas-San Antonio': 2636,

  // V
  'Vanderbilt': 238,
  'Virginia': 258,
  'Virginia Tech': 259,

  // W
  'Wake Forest': 154,
  'Washington': 264,
  'Washington State': 265,
  'Western Kentucky': 98,
  'WKU': 98,
  'Western Michigan': 2711,
  'West Virginia': 277,
  'Wisconsin': 275,
  'Wyoming': 2751,
};

// ESPN CDN base URL for college logos
const ESPN_LOGO_BASE = 'https://a.espncdn.com/i/teamlogos/ncaa/500';

// Get the logo URL for a college name
export function getCollegeLogo(collegeName) {
  const espnId = collegeToEspnId[collegeName];
  if (espnId) {
    return `${ESPN_LOGO_BASE}/${espnId}.png`;
  }
  // Return a placeholder or null for unknown colleges
  return null;
}

// Get dark mode logo variant
export function getCollegeLogoDark(collegeName) {
  const espnId = collegeToEspnId[collegeName];
  if (espnId) {
    return `${ESPN_LOGO_BASE}-dark/${espnId}.png`;
  }
  return null;
}

// Export the mapping for debugging
export { collegeToEspnId };
