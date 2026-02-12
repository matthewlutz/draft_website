import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getNflLogo } from '../data/nflLogos';
import './TeamNeeds.css';

// Team name to abbreviation mapping for logos
const teamAbbreviations = {
  'Buffalo Bills': 'BUF',
  'Miami Dolphins': 'MIA',
  'New England Patriots': 'NE',
  'New York Jets': 'NYJ',
  'Baltimore Ravens': 'BAL',
  'Cincinnati Bengals': 'CIN',
  'Cleveland Browns': 'CLE',
  'Pittsburgh Steelers': 'PIT',
  'Houston Texans': 'HOU',
  'Indianapolis Colts': 'IND',
  'Jacksonville Jaguars': 'JAX',
  'Tennessee Titans': 'TEN',
  'Kansas City Chiefs': 'KC',
  'Las Vegas Raiders': 'LV',
  'Denver Broncos': 'DEN',
  'Los Angeles Chargers': 'LAC',
  'Dallas Cowboys': 'DAL',
  'Philadelphia Eagles': 'PHI',
  'New York Giants': 'NYG',
  'Washington Commanders': 'WAS',
  'Chicago Bears': 'CHI',
  'Detroit Lions': 'DET',
  'Green Bay Packers': 'GB',
  'Minnesota Vikings': 'MIN',
  'Atlanta Falcons': 'ATL',
  'Carolina Panthers': 'CAR',
  'New Orleans Saints': 'NO',
  'Tampa Bay Buccaneers': 'TB',
  'Arizona Cardinals': 'ARI',
  'Los Angeles Rams': 'LAR',
  'San Francisco 49ers': 'SF',
  'Seattle Seahawks': 'SEA'
};

// Team needs data organized by division
const teamNeeds = {
  'AFC East': [
    {
      team: 'Buffalo Bills',
      pick: '#13',
      content: `The Bills' receiving corps remains the biggest obstacle between Josh Allen and a championship. Keon Coleman's discipline problems led to multiple healthy scratches throughout 2025, and Khalil Shakir was the only receiver on the roster to exceed a 65.0 PFF receiving grade all season. The position has been a revolving door since the Stefon Diggs era, and Allen continues to compensate for a supporting cast that doesn't match his talent level. A true alpha receiver who can win contested catches and separate against top corners is a non-negotiable need.

The defense needs reinforcement in the trenches—specifically against the run. The front seven was gashed too often in 2025, and the Bills need a defensive lineman who can anchor at the point of attack and control the line of scrimmage. Edge rusher depth and linebackers who can fill gaps and flow to the ball should also be priorities. Allen's championship window is wide open, but the roster needs immediate upgrades at the skill positions and along the defensive front.`,
      strategy: `Target a premier wide receiver in Round 1. Address defensive line and edge rusher on Day 2, with linebacker depth on Day 3. This is a win-now roster that needs immediate contributors.`,
      needs: ['WR', 'EDGE', 'DL', 'LB']
    },
    {
      team: 'Miami Dolphins',
      pick: '#8',
      content: `The Dolphins face an uncertain future on offense. Tyreek Hill, now 32, suffered a grotesque leg injury late in the season that raises serious questions about his availability and long-term viability. Miami's passing attack, once among the league's most explosive, needs fresh playmaking talent and a plan for the post-Hill era. The receiver room could use a young, dynamic weapon capable of shouldering more of the offensive burden going forward.

The interior offensive line was a persistent weakness at guard, and the secondary was too inconsistent in coverage throughout the season. Miami is unlikely to address quarterback early in this draft, making the focus squarely on rebuilding the offensive infrastructure and adding depth on defense. In a division with Josh Allen and an ascending Patriots team, the Dolphins cannot afford to stand pat. Fortifying the offensive line and adding difference-makers at skill positions should drive this offseason.`,
      strategy: `Offensive line or receiver should be the target at eight. Guard help and cornerback depth on Day 2. The Dolphins need to rebuild the supporting cast around whoever is under center.`,
      needs: ['WR', 'OG', 'CB', 'EDGE']
    },
    {
      team: 'New England Patriots',
      pick: '#27',
      content: `Drake Maye's development has been encouraging, but the Patriots must build a stronger foundation around their young franchise quarterback. The offensive line remains a work in progress—both tackle and guard need upgrades to give Maye the time he needs to operate. Protecting the investment at quarterback should be priority number one in this draft. A franchise signal-caller is only as good as the pocket in front of him.

The pass rush flashed potential in 2025, headlined by K'Lavon Chaisson's breakout campaign of 9.5 sacks and 61 pressures. However, Chaisson is an unrestricted free agent, and losing that production would leave a significant void. The team ranked 18th in PFF pass-rush grade and 21st in sack rate, showing there's room to improve even if Chaisson is retained. Maye also needs another weapon at receiver—someone who can win on the outside and take pressure off the rest of the passing game. New England has its quarterback—now it's time to build the roster around him.`,
      strategy: `Prioritize offensive line in Round 1—tackle or guard depending on the board. Receiver and edge rusher should be addressed on Day 2, especially if Chaisson departs.`,
      needs: ['OT', 'OG', 'WR', 'EDGE']
    },
    {
      team: 'New York Jets',
      pick: '#2',
      content: `The Jets' aggressive deadline trades—shipping out Sauce Gardner and Quinnen Williams—signaled a full teardown, and the on-field results confirmed it. New York's defense ranked 31st in EPA allowed per play and 31st in pressure rate at a dismal 30.9%. Most remarkably, the Jets became the only team in NFL history to go an entire season without recording a single interception. The defensive cupboard is completely bare and needs to be restocked from the ground up.

With the second overall pick in a draft class that lacks a consensus franchise quarterback, the Jets are positioned to take the best player available—and that likely means a defensive difference-maker. The offensive line is one of the few bright spots on this roster and shouldn't require early draft capital. New York's focus should be on rebuilding the front seven—particularly the interior defensive line after dealing Williams—and restocking the secondary after parting with Gardner. The remaining top-50 picks acquired from those trades should continue the defensive foundation.`,
      strategy: `Take the best defensive player available at two—likely an edge rusher or interior force. Use remaining picks to rebuild the defensive core. The offensive line is solid; invest elsewhere.`,
      needs: ['EDGE', 'DT', 'LB', 'CB']
    }
  ],
  'AFC North': [
    {
      team: 'Baltimore Ravens',
      pick: '#14',
      content: `Baltimore's pass rush fell off a cliff in 2025. The unit posted a 62.1 PFF grade with just a 32.1% pressure rate—alarming numbers for a franchise historically defined by defensive dominance. The Odafe Oweh trade left a void that Mike Green, despite being a high-upside prospect, failed to fill with a disappointing 46.3 PFF grade. Nnamdi Madubuike's season-ending injury and Travis Jones needing to take a major leap only compounded the issues along the defensive front.

Lamar Jackson continues to be one of the league's most electric players, but the offense needs help too. The receiving corps lacks a consistent outside threat, and the interior line needs competition at guard. Jackson deserves better weapons and better protection. Rebuilding the pass rush is the most urgent priority, but don't overlook the offensive deficiencies that limit the ceiling of this team.`,
      strategy: `Receiver or defensive line in Round 1 depending on the board. Guard help should be addressed early on Day 2. Baltimore must find a way to regenerate pass-rush production.`,
      needs: ['WR', 'OG', 'DL', 'EDGE']
    },
    {
      team: 'Cincinnati Bengals',
      pick: '#10',
      content: `Cincinnati's defense continues to undermine an otherwise championship-caliber roster. The Bengals were the only team in the NFL to allow 17% or more of opposing passes to gain 15-plus yards—a deep-ball vulnerability that gets brutally exposed in the postseason. The interior defensive line lacks a disruptive presence, and safety Geno Stone struggled in coverage with a 47.2 PFF grade (23rd percentile) as his contract expires.

The trenches need work on both sides of the ball. The center position requires an upgrade, and the guard spots need more consistency to keep Joe Burrow upright. Burrow and Ja'Marr Chase give this team a ceiling as high as anyone in the AFC, but the foundation must be stronger. Interior offensive line and interior defensive line are the twin priorities—this roster needs to dominate the line of scrimmage to unlock its championship potential.`,
      strategy: `Interior defensive line or center in Round 1—fix the trenches. Safety should be targeted on Day 2 if Stone departs. The Bengals need foundational players, not luxury picks.`,
      needs: ['C', 'OG', 'DT', 'S']
    },
    {
      team: 'Cleveland Browns',
      pick: '#6 & #29',
      content: `Cleveland's offensive line was a catastrophe in 2025, ranking dead last with a 49.7 PFF pass-blocking grade. The situation gets worse: six offensive linemen are headed to free agency, including stalwarts Wyatt Teller, Joel Bitonio, and Ethan Pocic. The Browns could be staring at a near-complete overhaul of their front five—a nightmare that must be addressed with urgency.

The good news is that the Browns hold two first-round picks after last year's Travis Hunter trade with Jacksonville, giving them significant capital to rebuild the trenches. The receiving corps also needs more explosive playmaking to open up the offense. Myles Garrett remains one of the game's most dominant pass rushers, but elite defensive talent is being wasted without an offense capable of sustaining drives and moving the football. Cleveland must use both premium selections wisely to transform the offensive infrastructure.`,
      strategy: `Offensive tackle and guard should be the priorities with both first-round picks. Receiver help and defensive line depth on Day 2. Use the draft capital to rebuild the trenches.`,
      needs: ['OT', 'OG', 'WR', 'DL']
    },
    {
      team: 'Pittsburgh Steelers',
      pick: '#21',
      content: `Pittsburgh finds itself at a significant inflection point. Mike Tomlin's departure ends one of the longest coaching tenures in modern NFL history, and 42-year-old Aaron Rodgers is heading to free agency after what amounted to a farewell tour. The passing game ranked just 26th in positive EPA rate on pass plays, and the receiving corps needs a genuine playmaker who can stretch the field and create separation in the intermediate game.

The next head coach will inherit a roster that's competitive but needs foundational work. Tackle is a pressing need on the offensive line, and the defensive backfield could use an injection of youth and talent. Most importantly, Pittsburgh needs a long-term answer at quarterback. Whether that means drafting one at 21 or pursuing alternatives, the franchise cannot endure another season of stopgap solutions. The Steelers' standard demands more.`,
      strategy: `If a quarterback the organization believes in falls to 21, take him without hesitation. Otherwise, prioritize offensive tackle and receiver. Defensive back depth should be addressed on Day 2.`,
      needs: ['QB', 'WR', 'OT', 'CB']
    }
  ],
  'AFC South': [
    {
      team: 'Houston Texans',
      pick: '#19',
      content: `Houston's defense was elite in 2025, allowing just 27.6% of opposing drives to result in scores—the best rate in the NFL. But sustaining that level requires investment, and the interior defensive line faces major free agency losses. Sheldon Rankins (73.5 PFF grade) and Tim Settle (71.3 PFF grade) are both headed to the open market, and losing both would gut a key piece of what made this defense dominant.

C.J. Stroud's abysmal playoff performance—where his accuracy and decision-making fell apart under postseason pressure—was a jarring contrast to his regular-season excellence. He remains the unquestioned franchise quarterback, but the supporting cast around him needs improvement. The running game needs more punch, and the interior offensive line—particularly at center—demands an upgrade. A dynamic running back would unlock the play-action concepts that make Houston's offense lethal when Stroud is at his best.`,
      strategy: `Address the interior line in Round 1—center or guard depending on the board. Running back and defensive tackle should be Day 2 priorities, especially if Rankins and Settle leave.`,
      needs: ['RB', 'C', 'OG', 'DT']
    },
    {
      team: 'Indianapolis Colts',
      pick: 'No 1st Round Pick',
      content: `The Colts' 2025 season was a story of dramatic highs and devastating lows. Daniel Jones, signed after his release from New York, put together a remarkable stretch—posting the best EPA per play (0.165) in the league through Week 10 and leading Indianapolis to an 8-2 start. Then a torn Achilles ended his season and threw the franchise's quarterback plans into chaos. His recovery timeline and contract demands make the offseason picture murky at best.

Without a first-round pick, the Colts must find value on Day 2 and beyond. The interior defensive line needs a more disruptive presence, the linebacker corps requires youth, and the safety position is thin. If Jones can't return to form, the quarterback question becomes the most urgent need. Indianapolis' scouting department will be tested—they need to find quality starters in the middle rounds while navigating a complicated quarterback situation.`,
      strategy: `Monitor Jones' recovery before committing draft capital to quarterback. Address interior defensive line and linebacker with early Day 2 picks. Safety depth on Day 3. Consider trading back into the first round if a target falls.`,
      needs: ['QB', 'DT', 'LB', 'S']
    },
    {
      team: 'Jacksonville Jaguars',
      pick: 'No 1st Round Pick',
      content: `Jacksonville's interior defensive line regressed badly in 2025, posting the second-lowest pass-rush productivity rate (6.1) in the NFL from the interior. Arik Armstead recorded a career-low 63.1 PFF pass-rush grade, and the entire unit failed to generate the disruption needed to complement the team's edge rushers. Without consistent pressure from the inside, the defense can't produce the game-changing plays necessary to compete in a loaded AFC South.

The offensive line also needs attention, particularly at center and guard, where inconsistency plagued the unit all season. Safety is another position that could use a long-term upgrade. Without a first-round selection, the Jaguars must hit on Day 2 and Day 3 picks—finding players who slipped due to injury, scheme concerns, or lack of exposure rather than lack of ability. Jacksonville has its core pieces; now it needs depth and interior firepower.`,
      strategy: `Interior defensive line should be the priority with the first available pick. Center, guard, and safety should follow. Focus on finding undervalued contributors who can play immediately.`,
      needs: ['C', 'OG', 'DT', 'S']
    },
    {
      team: 'Tennessee Titans',
      pick: '#5',
      content: `Tennessee's rebuild continues to take shape, with Cam Ward establishing himself as the franchise quarterback. But Ward needs help. Calvin Ridley's season ended after just 250 snaps due to a broken fibula, and the receiving corps ranked 27th in PFF grade—a glaring indication that the supporting cast isn't good enough. Adding a true number-one target should be the priority, whether at pick five or through aggressive maneuvering on Day 2.

The edge rush was among the league's weakest, and the interior offensive line needs a significant upgrade at both center and guard to give Ward better protection as he develops. Cornerback depth is also a concern. This is a multi-year build with the draft capital to do it right. The Titans should target the best player available early, invest in the trenches on Day 2, and trust the development process around Ward.`,
      strategy: `Best player available at five—receiver, edge rusher, or cornerback depending on who's there. Address interior offensive line on Day 2. Prioritize talent and ceiling over immediate need.`,
      needs: ['WR', 'EDGE', 'OG', 'CB']
    }
  ],
  'AFC West': [
    {
      team: 'Kansas City Chiefs',
      pick: '#9',
      content: `The Chiefs' dynasty is showing real wear. The ground game was among the league's worst—Kansas City managed just 26 runs of 10-plus yards (bottom three in the NFL) and averaged a paltry 2.5 yards after contact per rush. With both Isiah Pacheco and Kareem Hunt entering free agency, the backfield needs a complete overhaul. Patrick Mahomes has masked roster deficiencies his entire career, but even he has limits.

The receiving corps has been further complicated by Rashee Rice's ongoing legal troubles following his arrest, leaving Kansas City short on reliable targets outside of Travis Kelce. The offensive line needs reinforcement at guard, and the defensive line lost some of its edge. The Chiefs still have Mahomes, but the supporting cast has deteriorated badly. Investing in skill positions—running back, receiver, and offensive line—should drive this offseason.`,
      strategy: `Running back or receiver in Round 1 depending on the board. Guard and defensive line depth should be Day 2 priorities. The Chiefs need playmakers who can take pressure off Mahomes.`,
      needs: ['RB', 'WR', 'OG', 'DL']
    },
    {
      team: 'Las Vegas Raiders',
      pick: '#1',
      content: `The Raiders hold the first overall pick after a dismal 2025 campaign. Geno Smith was historically ineffective under center, throwing a league-high 17 interceptions with 23 turnover-worthy plays while posting a 58.2 PFF passing grade—37th among 45 qualifying quarterbacks. The answer at quarterback is clearly not on this roster.

Las Vegas appears locked in on Indiana's Fernando Mendoza as the first overall selection. Mendoza has the arm talent, processing speed, and leadership traits that franchise quarterback prospects are built on. Beyond the quarterback pick, the problems run deep—the offensive line was among the league's worst, and the receiver group, interior defensive line, and secondary all need significant investment. Take the franchise quarterback and then address the trenches aggressively on Day 2.`,
      strategy: `Fernando Mendoza at number one. Offensive line—tackle and guard—should dominate Day 2. Use remaining picks on defensive depth. Commit to the rebuild.`,
      needs: ['QB', 'OT', 'OG', 'WR']
    },
    {
      team: 'Denver Broncos',
      pick: '#30',
      content: `Denver's defense was a real strength in 2025, with the linebacker unit grading out in the top five (78.2 PFF grade). But that production faces a serious threat from free agency. Alex Singleton and Justin Strnad are both headed to the open market, and Dre Greenlaw was limited to just eight regular-season games due to durability concerns. If all three depart or remain unavailable, the second level of this defense could collapse.

The offense needs a running back upgrade to complement Bo Nix and maximize Sean Payton's scheme. Tight end and center are additional areas where Denver can improve. This is a team trending upward—smart drafting across all positions of need can push them into genuine contender territory. The key is replacing what might be lost in free agency while continuing to add offensive weapons that keep the offense evolving.`,
      strategy: `Address positions of need based on the board—linebacker, running back, and tight end are all in play. Center help should be addressed by Day 3. Denver is building something real—don't mortgage the future.`,
      needs: ['RB', 'TE', 'C', 'LB']
    },
    {
      team: 'Los Angeles Chargers',
      pick: '#22',
      content: `The Chargers' offensive line was decimated by injuries in 2025. With both Rashawn Slater and Joe Alt missing significant time, the interior collapsed to the lowest PFF pass-blocking grade in the NFL (47.6) and surrendered a league-high pressure rate above 37%. Justin Herbert was under siege all season, and until the protection is sorted out, his immense talent will continue to be squandered.

Guard and center are the most glaring needs. Even when the tackles were healthy, the interior was a persistent weak link that allowed pressure up the middle. Jim Harbaugh has instilled the right culture and physicality in this franchise—now the roster must match the coaching. Defensive line depth is also a consideration, but offensive line is the undeniable priority. Everything starts with protecting Herbert.`,
      strategy: `Interior offensive line in Round 1—guard or center. Tackle depth and defensive line help on Day 2. The Chargers' championship ceiling is directly tied to Herbert's protection.`,
      needs: ['OG', 'C', 'DL', 'OT']
    }
  ],
  'NFC East': [
    {
      team: 'Dallas Cowboys',
      pick: '#15 & #17',
      content: `Dallas allowed the worst scoring average in the NFL in 2025, and the defensive roster was gutted by departures and misfortune. The edge rush was non-existent for much of the season, and the defense needs immediate help at multiple levels. The midseason acquisition of Quinnen Williams from the Jets provided a much-needed boost along the interior defensive line, and building around his dominant presence should guide future defensive investments. Two first-round picks give the Cowboys the capital to make significant reinforcements.

DeMarvion Overshown needs a running mate at linebacker, and the safety position requires a long-term solution. Javonte Williams was effective when used, posting an 81.7 PFF rushing grade and ranking fourth in yards after contact per attempt, but his free agency status creates uncertainty in the backfield. This is a franchise in transition—two premium picks offer a real chance to accelerate the rebuild if used wisely.`,
      strategy: `Both first-round picks on defense—edge rusher and linebacker or safety. Running back and secondary depth on Day 2. Defense is the overwhelming priority.`,
      needs: ['EDGE', 'LB', 'S', 'RB']
    },
    {
      team: 'Philadelphia Eagles',
      pick: '#23',
      content: `Philadelphia's young secondary continues to develop impressively, with Quinyon Mitchell (76.9 PFF grade) and Cooper DeJean (77.5 PFF grade) establishing themselves as cornerstones. The question mark is the third corner spot, where Adoree' Jackson posted a concerning 54.1 PFF coverage grade—the highest target rate (18%) among Eagles corners—and is now heading to free agency. Addressing the position opposite the two young stars matters.

Tight end is another area worth investing in. The Eagles need a dynamic receiving weapon at the position to complement Jalen Hurts and add another dimension to a loaded offense. Guard depth and edge rusher reinforcement are on the radar as well, especially with Lane Johnson entering the later stages of his career. This is a team adding the final pieces to a championship-caliber roster. Every pick should be aimed at elevating what's already in place.`,
      strategy: `Best player available at a position of need—tight end, guard, edge rusher, or corner. The Eagles are in championship mode; every pick should serve that goal.`,
      needs: ['TE', 'OG', 'EDGE', 'CB']
    },
    {
      team: 'New York Giants',
      pick: '#4',
      content: `The Giants have a foundation worth building on. Andrew Thomas has been outstanding on the blind side (90.3 PFF grade), and Jaxson Dart is developing at quarterback. But the rest of the offensive line needs significant work—Jermaine Eluemunor is headed to free agency, and the guard spots were inconsistent throughout 2025. A young quarterback needs a clean pocket to grow, and the Giants must invest in the protection around Dart.

Receiver is the other urgent need. Malik Nabers has established himself as a legitimate star, but he needs a complementary weapon who can stretch the field and prevent defenses from bracketing him in coverage. Wan'Dale Robinson's potential departure in free agency would further thin out the pass-catching options. With the fourth overall pick, the Giants have a chance to add a game-changing talent at either receiver or along the offensive line. Cornerback depth should be addressed on Day 2.`,
      strategy: `Receiver or offensive lineman at four—take the better prospect. Address the other need early on Day 2. Cornerback depth should follow. The Giants need immediate contributors.`,
      needs: ['WR', 'OG', 'OT', 'CB']
    },
    {
      team: 'Washington Commanders',
      pick: '#18',
      content: `Washington's coverage issues were glaring in 2025. The defense ranked bottom-three in EPA allowed per dropback (0.186), passing yards per attempt allowed (8.09), and explosive pass play rate allowed (16.6%). Jayden Daniels needs a defense that can hold leads and create short fields—right now, this unit is doing the opposite. The coverage breakdowns were consistent and damaging, making defensive upgrades the clear priority.

Edge rusher and linebacker are the most immediate needs on the defensive side. The front seven needs more disruptive talent to generate pressure before receivers get open, and the second level lacks the range and athleticism to match up with modern passing attacks. Guard help on offense would also benefit Daniels as the team looks to keep him upright. The Commanders have their franchise quarterback—now it's time to build a defense worthy of complementing him.`,
      strategy: `Defense in Round 1—edge rusher or linebacker depending on the board. Guard and secondary depth on Day 2. Fix the defense to unlock Daniels' full potential.`,
      needs: ['EDGE', 'LB', 'OG', 'CB']
    }
  ],
  'NFC North': [
    {
      team: 'Chicago Bears',
      pick: '#25',
      content: `Chicago's Divisional Round appearance in 2025 validated the Caleb Williams investment, but the defense exposed critical weaknesses. The Bears allowed 804 yards before contact on designed runs—the most in the NFL—and the defensive tackle group posted a putrid 42.2 PFF grade, ranking 31st in the league. The interior of the defensive line was routinely overpowered and needs an immediate talent infusion.

The secondary and linebacker corps face significant free agency losses. Jaquan Brisker, Kevin Byard, Nahshon Wright, and C.J. Gardner-Johnson could all depart, potentially gutting the back end of the defense. Dayo Odeyingbo and Shemar Turner are also returning from season-ending injuries with uncertain availability. Williams has proven he can carry an offense—now the Bears must rebuild a defense that was exposed in the trenches and faces a potential mass exodus in the secondary.`,
      strategy: `Interior defensive line in Round 1 to shore up the league-worst run defense. Linebacker and safety on Day 2. The Bears must replace what free agency takes.`,
      needs: ['DT', 'LB', 'S', 'CB']
    },
    {
      team: 'Detroit Lions',
      pick: '#16',
      content: `Detroit's championship aspirations were undermined by unexpected offensive line regression and a secondary ravaged by injuries. Frank Ragnow's surprise retirement before the season created a massive void at center that Graham Glasgow (56.8 PFF grade, 28th among centers) couldn't adequately fill. Tackle is also a concern with Taylor Decker's future uncertain, and the instability across the line contributed to Jared Goff absorbing a career-high sack total.

Cornerback is equally pressing. Injuries decimated the position throughout 2025, and even with better health in 2026, the Lions need more depth and genuine competition in the secondary. An edge-rushing complement for Aidan Hutchinson would round out the defensive needs. Brad Holmes has built a contender—sustaining it demands replenishing the trenches and the secondary through this draft.`,
      strategy: `Center or offensive tackle in Round 1 depending on value. Cornerback and edge rusher on Day 2. This is a championship-contention roster that needs starters, not projects.`,
      needs: ['C', 'OT', 'EDGE', 'CB']
    },
    {
      team: 'Green Bay Packers',
      pick: 'No 1st Round Pick',
      content: `The Packers' defensive line was a disaster in 2025, particularly after Devonte Wyatt went down with injury. Without him, the interior was completely overmatched against the run, posting a 30.6 PFF grade (31st) and surrendering the fourth-most rushing yards between the tackles in the NFL. Defensive tackle and cornerback are equally pressing needs that must be addressed early.

Offensive line depth is also a concern across the board—not just at tackle, but throughout the interior as well. Without a first-round pick, Green Bay must find value on Day 2 and beyond. The Packers continue building around Jordan Love, and they'll need their historically strong development pipeline to produce once again. Every pick needs to be someone capable of contributing from Day 1.`,
      strategy: `Interior defensive line and cornerback with the earliest available picks. Offensive line depth should follow. Green Bay must hit on Day 2 to stay competitive in the NFC North.`,
      needs: ['DT', 'CB', 'OG', 'OT']
    },
    {
      team: 'Minnesota Vikings',
      pick: '#24',
      content: `Minnesota's defense was outstanding in 2025, with Brian Flores' aggressive scheme blitzing at a league-high 52.5% rate and creating consistent havoc. But the unit faces a monumental loss: Harrison Smith's 14-year tenure is ending. Smith was still performing at a high level, ranking in the 92nd percentile in passer rating allowed when targeted (83.7). Replacing his football IQ, leadership, and production at safety will be one of the offseason's biggest challenges.

Center is the other critical concern, and the running game needs more explosiveness to complement the defensive identity Flores has built. The Vikings have a roster capable of contending, but sustaining it requires smart reinvestment at the positions being vacated. Safety and center should be the draft priorities, with running back and defensive depth addressed throughout the remaining rounds.`,
      strategy: `Safety or center in Round 1 to replace departing production. Running back on Day 2. The Vikings need immediate starters to keep the championship window open.`,
      needs: ['RB', 'C', 'S', 'CB']
    }
  ],
  'NFC South': [
    {
      team: 'Atlanta Falcons',
      pick: 'No 1st Round Pick',
      content: `Atlanta needs to add firepower to its passing game. Drake London suffered a late-season injury, and Kyle Pitts—who earned second-team All-Pro honors—is entering free agency. Losing Pitts would leave a significant hole at tight end that must be addressed. Darnell Mooney's struggles (52.5 PFF grade, 97th among all receivers) further underscore the urgency to find playmaking talent at the skill positions.

The defensive outlook is clouded by uncertainty surrounding James Pearce Jr., who was recently arrested on domestic violence charges. His future with the franchise is very much in question, which could create a significant void at edge rusher. Without a first-round pick, Atlanta's Day 2 selections carry enormous weight. Receiver, tight end, and interior defensive line should be priorities, along with contingency planning at edge if Pearce is unavailable.`,
      strategy: `Receiver and tight end should be priorities with Atlanta's first available picks. Interior defensive line and edge depth should follow depending on the Pearce situation.`,
      needs: ['WR', 'TE', 'DT', 'EDGE']
    },
    {
      team: 'Carolina Panthers',
      pick: '#7',
      content: `Carolina's pass rush remains the biggest concern despite heavy 2025 draft investment. Nic Scourton and Princely Umanmielen were thrust into starting roles as rookies after Pat Jones II's injury, and while both showed promise, the Panthers still posted a 60.5 PFF pass-rush grade (31st) and a league-worst 15.2% pressure rate off the edge. The entire defensive front—from edge to interior—needs significantly more disruptive talent to be competitive.

The linebacker group also requires reinforcement, and defensive depth across the board is thin. With the seventh overall pick, the Panthers should target the best available defensive playmaker—whether that's an edge rusher who can transform the pass rush or an interior force who can collapse the pocket. Carolina has building blocks on offense; the defense is what needs a star-level injection.`,
      strategy: `Best defensive player available at seven—edge rusher or interior lineman. Linebacker and secondary depth on Day 2. The Panthers need a defensive game-wrecker.`,
      needs: ['EDGE', 'DL', 'LB', 'CB']
    },
    {
      team: 'New Orleans Saints',
      pick: '#11',
      content: `New Orleans is in transition, but Tyler Shough has given the franchise genuine hope. Since taking over as starter, Shough posted a 75.3 PFF grade from Week 8 onward—14th among qualifiers during that stretch. The problem is the supporting cast around him is thin. Rashid Shaheed was traded at the deadline, Chris Olave battled injuries despite a strong 79.7 PFF grade when healthy, and Devaughn Vele (74.3 PFF grade) was also limited by health issues. The offense needs more weapons across the board.

Guard help and defensive line depth are also significant needs. The Saints are building something new around their young quarterback, and the 2026 draft should focus on surrounding Shough with talent on both sides of the ball. Adding a receiver would help, but so would protecting him better and building a defense that can keep games manageable. The approach at eleven should be best player available at any position of need.`,
      strategy: `Best player available at eleven across multiple positions of need. Offensive guard and defensive line on Day 2. Build around Shough on both sides of the ball.`,
      needs: ['WR', 'OG', 'DL', 'CB']
    },
    {
      team: 'Tampa Bay Buccaneers',
      pick: '#12',
      content: `The Lavonte David era is winding down. The legendary linebacker turns 37 soon, his contract is expiring, and he played through a knee injury that contributed to a career-low 52.6 PFF grade. Beyond David, the broader linebacker unit ranked 28th in PFF defensive grade, exposing how thin the position group has become. Finding David's eventual replacement—both as a player and a leader—should be the top priority.

Edge rusher, tight end, and cornerback are secondary needs. Baker Mayfield has shown he can win games, and the offensive skill positions are largely in place. What Tampa Bay needs most is defensive reinforcement—young, athletic players who can take over as the veteran core ages out. This draft should be about building the next generation of Buccaneers defenders while the roster is still competitive enough to contend.`,
      strategy: `Linebacker in Round 1 if the right prospect is available. Edge rusher and tight end on Day 2. Plan for life after David while the window is still open.`,
      needs: ['LB', 'EDGE', 'TE', 'CB']
    }
  ],
  'NFC West': [
    {
      team: 'Arizona Cardinals',
      pick: '#3',
      content: `Arizona enters the offseason with major questions along the offensive line after a disastrous rushing attack that plummeted from seventh to 30th in EPA per rush. Jonah Williams (56.9 PFF run-blocking grade) and Kelvin Beachum (48.9 PFF grade) are both entering free agency, leaving massive holes at tackle. Rebuilding the line should be the top priority with the third overall pick—this is a roster that needs to be built from the inside out.

Beyond the offensive line, the Cardinals need a dynamic running back to inject life into the ground game. Guard help and edge rusher depth should also be on the radar. Arizona has talent at the skill positions, but nothing will work consistently until the trenches are fixed. The third pick is a premium asset—use it on the best offensive lineman available and build the foundation this team has been missing.`,
      strategy: `Offensive tackle at three. Running back and guard on Day 2. Edge rusher depth should round out the class. Fix the trenches first.`,
      needs: ['OT', 'RB', 'OG', 'EDGE']
    },
    {
      team: 'Los Angeles Rams',
      pick: '#20 & #28',
      content: `The Rams face an unavoidable question: what comes after Matthew Stafford? At 38, his timeline is finite, and Los Angeles currently lacks a viable succession plan at the position. Whether through this draft or another avenue, the Rams must begin planning for life after their franchise quarterback. Two first-round picks provide rare flexibility to address the future while competing in the present.

Tackle needs attention as the offensive line shows signs of aging, and the cornerback position could use reinforcement. Sean McVay has built a perennial contender, but sustaining that level of success requires forward planning. One first-round pick should address the quarterback question; the other should target immediate defensive or offensive line help to keep this roster competitive while the transition unfolds.`,
      strategy: `Consider a developmental quarterback with one first-round pick. Use the other on tackle or cornerback. The Rams must balance winning now with planning for the post-Stafford era.`,
      needs: ['QB', 'OT', 'CB', 'S']
    },
    {
      team: 'San Francisco 49ers',
      pick: '#26',
      content: `San Francisco's roster was devastated by injuries in 2025. Nick Bosa, first-round pick Mykel Williams, and All-Pro linebacker Fred Warner all suffered season-ending injuries, gutting both the pass rush and the defensive backbone. The 49ers finished 26th in pressure rate off the edge and 28th in yards per attempt allowed on outside runs—a far cry from the standard Kyle Shanahan teams are known for.

The receiving corps also needs an upgrade. While Bosa, Williams, and Warner are all expected back, the offense lacked a consistent playmaker at wideout throughout the season. Adding a receiver who can win on the outside would open up the entire passing game. Guard competition, edge depth, and safety help round out the needs. The championship window is still open—this draft should prioritize offensive weapons while reinforcing the defense.`,
      strategy: `Receiver or edge rusher in Round 1 depending on the board. Guard help on Day 2. Safety depth should also be addressed. The 49ers need immediate contributors.`,
      needs: ['WR', 'OG', 'EDGE', 'S']
    },
    {
      team: 'Seattle Seahawks',
      pick: '#32',
      content: `Picking last comes with the territory of a championship season, and the Seahawks must find ways to add impact talent at the bottom of every round. The interior offensive line was a persistent weakness, grading out 28th in PFF's rankings (57.3 PFF grade). First-round center Grey Zabel is still developing, and the guard spots need upgrades to better protect Sam Darnold and sustain the ground game.

Running back and cornerback are pressing needs, with both Kenneth Walker III and Riq Woolen headed to free agency. Losing either would leave significant holes at positions that powered the championship run. The defense carried this team to a title, but sustaining success requires replacing departing talent through the draft. Every pick needs to deliver an immediate contributor to keep this roster championship-caliber.`,
      strategy: `Interior offensive line, running back, or cornerback at 32 depending on who falls. Address the remaining needs on Day 2 and Day 3. Every pick must contribute.`,
      needs: ['RB', 'C', 'OG', 'CB']
    }
  ]
};

const divisions = [
  'AFC East', 'AFC North', 'AFC South', 'AFC West',
  'NFC East', 'NFC North', 'NFC South', 'NFC West'
];

function TeamNeeds() {
  const [selectedDivision, setSelectedDivision] = useState('AFC East');
  const [expandedTeam, setExpandedTeam] = useState(null);

  const toggleTeam = (teamName) => {
    setExpandedTeam(expandedTeam === teamName ? null : teamName);
  };

  const getTeamLogo = (teamName) => {
    const abbrev = teamAbbreviations[teamName];
    return abbrev ? getNflLogo(abbrev) : null;
  };

  return (
    <div className="team-needs-page">
      <div className="container">
        <div className="team-needs-header">
          <h1 className="team-needs-title">2026 NFL Draft Team Needs</h1>
          <p className="team-needs-subtitle">
            Comprehensive analysis of every team's draft strategy and position priorities
          </p>
        </div>

        <div className="division-tabs">
          <div className="division-col">
            {divisions.filter(d => d.startsWith('AFC')).map((division) => (
              <button
                key={division}
                className={`division-tab ${selectedDivision === division ? 'active' : ''}`}
                onClick={() => {
                  setSelectedDivision(division);
                  setExpandedTeam(null);
                }}
              >
                {division}
              </button>
            ))}
          </div>
          <div className="division-col">
            {divisions.filter(d => d.startsWith('NFC')).map((division) => (
              <button
                key={division}
                className={`division-tab ${selectedDivision === division ? 'active' : ''}`}
                onClick={() => {
                  setSelectedDivision(division);
                  setExpandedTeam(null);
                }}
              >
                {division}
              </button>
            ))}
          </div>
        </div>

        <div className="teams-list">
          {teamNeeds[selectedDivision]?.map((team) => (
            <div
              key={team.team}
              className={`team-card ${expandedTeam === team.team ? 'expanded' : ''}`}
            >
              <div
                className="team-card-header"
                onClick={() => toggleTeam(team.team)}
              >
                <div className="team-info">
                  <h2 className="team-name">{team.team}</h2>
                  <span className="team-pick">
                    {team.pick.startsWith('#') ? `Pick: ${team.pick}` : team.pick}
                  </span>
                </div>
                <div className="team-logo">
                  {getTeamLogo(team.team) && (
                    <img
                      src={getTeamLogo(team.team)}
                      alt={`${team.team} logo`}
                      className="team-logo-img"
                    />
                  )}
                </div>
                <div className="team-needs-links">
                  <span className="needs-label">Needs: </span>
                  {team.needs.map((need, idx) => (
                    <span key={idx}>
                      <Link
                        to={`/prospects?positions=${need}`}
                        className="need-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {need}
                      </Link>
                      {idx < team.needs.length - 1 && ', '}
                    </span>
                  ))}
                </div>
                <svg
                  className={`expand-icon ${expandedTeam === team.team ? 'rotated' : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>

              {expandedTeam === team.team && (
                <div className="team-card-content">
                  <div className="team-analysis">
                    {team.content.split('\n\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TeamNeeds;
