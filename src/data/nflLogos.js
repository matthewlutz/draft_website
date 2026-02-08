// NFL Team Logo Mappings
// Maps team abbreviation to logo filename

const nflLogos = {
  ARI: 'Arizona_Cardinals_logo.png',
  ATL: 'Atlanta_Falcons_logo.png',
  BAL: 'Baltimore_Ravens_logo.png',
  BUF: 'Buffalo_Bills_logo.png',
  CAR: 'Carolina_Panthers_logo.png',
  CHI: 'Chicago_Bears_logo.png',
  CIN: 'Cincinnati_Bengals_logo.png',
  CLE: 'Cleveland_Browns_logo.png',
  DAL: 'Dallas_Cowboys logo.png',
  DEN: 'Denver_Broncos_logo.png',
  DET: 'Detroit_Lions_logo.png',
  GB: 'Green_Bay_Packers_logo.png',
  HOU: 'Houston_Texans_logo.png',
  IND: 'Indianapolis_Colts_logo.png',
  JAX: 'Jacksonville_Jaguars_logo.png',
  KC: 'Kansas_City_Chiefs_logo.png',
  LV: 'Las_Vegas_Raiders_logo.png',
  LAC: 'Los_Angeles_Chargers_logo.png',
  LAR: 'Los_Angeles_Rams_logo.png',
  MIA: 'Miami_Dolphins_logo.png',
  MIN: 'Minnesota_Vikings_logo.png',
  NE: 'New_England_Patriots_logo.png',
  NO: 'New_Orleans_Saints_logo.png',
  NYG: 'New_York_Giants_logo.png',
  NYJ: 'New_York_Jets_logo.png',
  PHI: 'Philadelphia_Eagles_logo.png',
  PIT: 'Pittsburgh_Steelers_logo.png',
  SF: 'San_Francisco_49ers_logo.png',
  SEA: 'Seattle_Seahawks_logo.png',
  TB: 'Tampa_Bay_Buccaneers_logo.png',
  TEN: 'Tennessee_Titans_logo.png',
  WAS: 'Washington_Commanders_logo.png',
};

export function getNflLogo(abbrev) {
  const filename = nflLogos[abbrev];
  if (!filename) return null;
  return new URL(`./nfl_logos/${filename}`, import.meta.url).href;
}

export default nflLogos;
