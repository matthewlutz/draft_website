-- =============================================
-- NFL Draft Guide Admin System - Database Migration
-- Run this in your Supabase SQL Editor
-- =============================================

-- Step 1: Add role and status columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'USER';
ALTER TABLE users ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_active timestamptz;

-- Step 2: Set your account to SUPER_ADMIN (update the email)
UPDATE users SET role = 'SUPER_ADMIN' WHERE email = 'YOUR_EMAIL_HERE';

-- Step 3: Create admin_big_board table
CREATE TABLE IF NOT EXISTS admin_big_board (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  board_name text NOT NULL DEFAULT 'Mr Lutz''s Board',
  prospect_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

ALTER TABLE admin_big_board ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_big_board_select" ON admin_big_board
  FOR SELECT USING (true);

CREATE POLICY "admin_big_board_insert" ON admin_big_board
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN'))
  );

CREATE POLICY "admin_big_board_update" ON admin_big_board
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN'))
  );

CREATE POLICY "admin_big_board_delete" ON admin_big_board
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN'))
  );

-- Step 4: Create admin_player_notes table
CREATE TABLE IF NOT EXISTS admin_player_notes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  prospect_id integer NOT NULL UNIQUE,
  pros jsonb NOT NULL DEFAULT '[]'::jsonb,
  cons jsonb NOT NULL DEFAULT '[]'::jsonb,
  comparisons text,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

ALTER TABLE admin_player_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_player_notes_select" ON admin_player_notes
  FOR SELECT USING (true);

CREATE POLICY "admin_player_notes_insert" ON admin_player_notes
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN'))
  );

CREATE POLICY "admin_player_notes_update" ON admin_player_notes
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN'))
  );

CREATE POLICY "admin_player_notes_delete" ON admin_player_notes
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN'))
  );

-- Step 5: Create audit_log table
CREATE TABLE IF NOT EXISTS audit_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id uuid NOT NULL REFERENCES auth.users(id),
  action text NOT NULL,
  target_type text,
  target_id text,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_log_admin_select" ON audit_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN'))
  );

CREATE POLICY "audit_log_admin_insert" ON audit_log
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN'))
  );

-- Step 6: Create job_runs table
CREATE TABLE IF NOT EXISTS job_runs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  job_name text NOT NULL,
  status text NOT NULL DEFAULT 'PENDING',
  priority text DEFAULT 'medium',
  processed integer DEFAULT 0,
  errors integer DEFAULT 0,
  error_message text,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  duration_ms integer,
  attempt integer DEFAULT 1,
  max_retries integer DEFAULT 3
);

ALTER TABLE job_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "job_runs_admin_all" ON job_runs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN'))
  );

-- Step 7: Create indexes
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_admin ON audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_job_runs_name_started ON job_runs(job_name, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_player_notes_prospect ON admin_player_notes(prospect_id);

-- Step 8: Seed admin_big_board with current static data
INSERT INTO admin_big_board (board_name, prospect_ids)
VALUES (
  'Mr Lutz''s Board',
  '[6,28,2,10,18,5,13,12,3,9,4,14,24,1,20,7,8,19,16,11,21,22,23,25,27,44,15,29,30,72,59,17,31,32,54,33,35,36,37,52,38,39,66,40,34,41,42,43,45,46,47,48,49,50,51,53,55,56,57,58,60,61,63,64,65,67,68,69,70,71,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,62,90,91,92,93,94,95,96,97,26,98]'::jsonb
);

-- Step 9: Seed admin_player_notes with current static data
INSERT INTO admin_player_notes (prospect_id, pros, cons) VALUES
(1, '["Mature leader","Pretty good accuracy","Good deep ball","Good throwing towards the boundary","8 TD to 5 incompletions in CFBP","Good enough mobility","Great backshoulder and fade throw","Good straight-line speed","Great timing on layered throws"]'::jsonb, '["Arm talent is good enough, but won''t blow you away","Almost EVERYTHING at Indiana was RPO, play-action, or designed short pass","Indiana runs a ton of RPOs - not very translatable to NFL","Not accustomed to playing under center","First/Second read QB","Gets happy feet when pressure is coming","Not good at avoiding sacks, needs to throw the ball away more","Weak arm evident in first Oregon game (pick-6 on underthrown ball)"]'::jsonb);

INSERT INTO admin_player_notes (prospect_id, pros, cons) VALUES
(2, '["21 years old","3 year high end contributor","Plays very physical","Anticipation skills are out of this world","Exceptional football IQ","Good tackler","Very versatile, can play all over the field","Manipulates quarterbacks","ELITE run support","Great at timing the ball when it''s in the air","Very fluid","Takes great angles in run support","Attacks the ball like it owes him money","Disciplined eyes"]'::jsonb, '["Subpar size","Limited experience as a true 1-high safety"]'::jsonb);

INSERT INTO admin_player_notes (prospect_id, pros, cons) VALUES
(3, '["21 years old","6''3 270 - great size","24% pass rush win rate (PFF)","Great bend","Rushes with a plan","Great spin move","Knockout power like Mike Tyson","Relentless motor","Good instincts","Can play in the interior","Low center of gravity","Great at using his hands","Great at anchoring","Great at crossing tackles faces and rushing B gap","Great at blowing up blocks and tackling through blockers"]'::jsonb, '["Historically short arms for a top 10 prospect","Lower body injury history","Not the greatest open field tackler","Not a true burner off the edge","Gets neutralized when tackles get hands on him first","No NFL EDGE with arms his size have ever had 10+ sack season or made Pro Bowl"]'::jsonb);

INSERT INTO admin_player_notes (prospect_id, pros, cons) VALUES
(4, '["20 years old","4.5 speed","Exceptional size and length","Great stacking/shedding in the run game","VERY sound tackler","Great lateral speed","Strength at the point of attack","Good first step when playing on the edge","Excellent playing spy role","Meets pulling blockers and attacks them","Fantastic when blitzing from LB","Power rush is very promising","Very versatile - can play iLB, EDGE, and some slot"]'::jsonb, '["Still very raw, especially on the edge","Struggles in coverage","Bites hard on play-action","Very limited experience at both LB and EDGE","Over aggressiveness filling gaps sometimes forgoing contain responsibility","Very quiet end of 2025 (15 tackles in final 6 games vs 41 in first 6)","Got washed playing on the edge a lot the second half of the year"]'::jsonb);

INSERT INTO admin_player_notes (prospect_id, pros, cons) VALUES
(5, '["EXTREMELY explosive","Very fluid as an athlete","Violent heavy hands","Great at anchoring and shedding","Wins in both run defense and pass rush","Refined pass rush arsenal","Rare combination of power and speed for a DT","So explosive Clemson plays him on the edge sometimes","Scheme versatility (can play 3-4 DE/DT or 4-3 DT)","Can make plays in open field due to athleticism"]'::jsonb, '["Sack production","Not the tallest at 6''3","Not the greatest tackler (18% missed tackle rate in 2025)","Shorter length/frame"]'::jsonb);

INSERT INTO admin_player_notes (prospect_id, pros, cons) VALUES
(6, '["20 years old","Absolute BEAST in run-blocking","Great strike timing and hand technique","Freak athlete (Feldman''s freak list)","Great movement skills, hits second level with quickness","Violent hands","Great strength when anchoring","Has significantly improved year after year","Great anchoring strength","Low center of gravity"]'::jsonb, '["Against complex blitz packages, processing speed is a work in progress","Short arms for a tackle","When he gets beat it''s often to the inside","Miami runs almost no zone runs","Lunges forward in pass protection occasionally","Would like to see blocks get finished more consistently"]'::jsonb);

INSERT INTO admin_player_notes (prospect_id, pros, cons) VALUES
(7, '["Huge size","Very versatile player, can play all over the line, even over center","High level run defender","Wins with power","Long arms","Great setting the edge","Amazing anchoring technique","Sheds blockers with ease against the run","Great at chasing down outside runs from backside","Implemented hand usage when pass rushing in 2025","Very good motor for a player his size"]'::jsonb, '["Naturally plays with high pad level","Sack production","Doesn''t have dangerous countermoves yet","Not very twitched up","Lacks bend and speed on the edge","Only 9.5% PRWR against P4 schools in 2025"]'::jsonb);

INSERT INTO admin_player_notes (prospect_id, pros, cons) VALUES
(8, '["Gave up 0 sacks and only 5 hurries in 2025","Only gave up 1 sack in 2024","Fantastic in the run","Played LT his freshman year","3 years of production","Great movement skills","Quick feet","Slides effortlessly with pass rushers","Gets up to second level with ease","Elite recovery skills"]'::jsonb, '["Very weak anchor against bull rushes","Could add more mass to his frame","5 penalties in 2025","Sub 33 inch arms","Initial strike doesn''t generate very much knockback"]'::jsonb);

INSERT INTO admin_player_notes (prospect_id, pros, cons, comparisons) VALUES
(9, '["Strong hands, doesn''t drop a lot","Almost always makes first tackler miss","Very effective with screens","Very polished route runner","Great tracking skills while maintaining speed","Runs angry after the catch","High end speed","Shows up in the clutch"]'::jsonb, '["Subpar contested catcher","Runs east/west too much","Injury history","Runs backwards a lot trying to make plays happen","Mistimes jumps sometimes","Needs to use blockers better while running"]'::jsonb, 'Jerry Jeudy, Stefon Diggs, Golden Tate, Ceedee Lamb, Cooper Kupp');

INSERT INTO admin_player_notes (prospect_id, pros, cons) VALUES
(10, '["4.5 yards after contact, best in country for RBs > 120 attempts (PFF)","39 runs of 10+ yards, led the country (PFF)","ELITE contact balance","Explosive as hell","Regularly jumps over human beings","Great build","1 career fumble (recovered by ND)","Great (not elite) breakaway speed","Very good vision and patience","Elite acceleration running through holes","Solid hands for a RB"]'::jsonb, '["Slightly underweight to be a true bellcow","Tries dangerous hurdles that put him in vulnerable position too often","Limited catching passes downfield","Pass pro technique needs tweaking"]'::jsonb);

INSERT INTO admin_player_notes (prospect_id, pros, cons) VALUES
(11, '["Twitched up athlete","ELITE hip flexibility, can quickly adjust to sharpest angles","Extremely instinctive player","Great tackler, plays really physical","Elite deceleration skills showcased on comebacks/stops","Great speed to keep up with vertical routes","Eraser in press man","Disciplined feet in press","Good ball skills, very physical at catch point"]'::jsonb, '["Needs to get his head turned around on fades earlier/more often","Want to see more aggressiveness with hands at LOS","Missed all of 2025 recovering from ACL tear","Struggled against Jeremiah Smith","Height limits effectiveness against big body X''s"]'::jsonb);

INSERT INTO admin_player_notes (prospect_id, pros, cons, comparisons) VALUES
(12, '["Tall physical receiver","Amazing hands with absurd contested catch rate","0 drops","Can win downfield","Polished route runner","Exceptional body control","Can sell deep and sink hips with purpose on comebacks","High IQ","Plucks balls away out of his frame (George Pickens)","High level ball tracking","Goes North/South with purpose and falls forward consistently"]'::jsonb, '["Not a big YAC threat","Run blocking technique","High end breakaway speed is adequate, but not elite","Gets redirected at LOS too much, needs to add strength"]'::jsonb, 'Tee Higgins, Chris Godwin, Davante Adams, Calvin Ridley');

INSERT INTO admin_player_notes (prospect_id, pros, cons) VALUES
(13, '["22 years old - 4.44 40","Great football IQ","26.2 passer rating allowed in 2025 (PFF)","37.1% completion percentage allowed (PFF)","11 forced incompletions in 2025 (PFF)","Prototype height and length","Elite fluidity","High level run defender","Displays ability to anticipate routes before they happen","Couples prototypical length with elite technique to be truly sticky in man","Excelled at VT in zone scheme, as well as LSU in man scheme"]'::jsonb, '["5 missed tackles in 2025","Shows some over aggressiveness jumping routes","A bit on the slender side","Eyes sometimes wander in zone coverage"]'::jsonb);

INSERT INTO admin_player_notes (prospect_id, pros, cons) VALUES
(15, '["Extremely fluid hips","Great long speed","Very disciplined eyes in man coverage","Well developed peanut punch (8 forced fumbles last 2 years, 5 in 2025)","Great acceleration after opening hips up","Very good zone coverage in the flat","Regularly gets head turned around to make play on ball","Can play inside and outside"]'::jsonb, '["Very undersized","Struggles against quick releases across his face","Hand skills not good enough to make up for size","Below average deceleration","Struggles breaking up contested catches against bigger receivers","Tackling technique needs refinement"]'::jsonb);

INSERT INTO admin_player_notes (prospect_id, pros, cons) VALUES
(16, '["Fantastic at setting the edge","6 forced fumbles in 2024","Plays with VIOLENT and HEAVY hands","Great bull rush","High level run defender","Versatile defender (can play 3-4 or 4-3)","Great long arm move"]'::jsonb, '["Subpar bend","Inconsistent motor","Needs more countermoves","Not very explosive, first step is average"]'::jsonb);

INSERT INTO admin_player_notes (prospect_id, pros, cons) VALUES
(17, '["Good production","28.8% true pass set win rate","Very good at winning with speed outside","Threatens edge to set up tackles, then wins inside when they overset","Diverse pass rush skill set","Amazing ghost move","Elite bend","Lightning quick first step","Nonstop motor","Elite backend pursuit","Very disciplined in RPOs"]'::jsonb, '["Struggles anchoring against the run","Struggles shedding blocks against the run","0 sacks vs Notre Dame, Miami, and Texas","Struggles disengaging from blocks","Very poor run defender (3.1% stop-rate via PFF - lowest in class)","Extraordinarily short arms (sub 31 inch, 1st percentile)","0th percentile wingspan"]'::jsonb);

INSERT INTO admin_player_notes (prospect_id, pros, cons, comparisons) VALUES
(18, '["Best pure pass rusher in class - not close","Very explosive first step","Strong hands","Elite bend","Great ghost move","Can drop into zone with great coverage instincts","Good spin move","Full pass rush bag","Extremely athletic","Wins with speed","Great range and pursuit","Can accelerate as he bends","Good long-arm move"]'::jsonb, '["Very weak in run defense","Small frame","Struggles setting the edge in run defense","Times where he overpursues and leaves cutback lanes NFL RBs will expose","Benefits from playing with best DLine in college"]'::jsonb, 'Micah Parsons, Chop Robinson');

INSERT INTO admin_player_notes (prospect_id, pros, cons) VALUES
(20, '["Very flexible hips allow him to break at sharp angles","Absolutely ELECTRIC after the catch","Press man burner","Very polished route runner","Catches with hands outside of his frame","Great football IQ, finds soft spots in zone with ease","Very savvy route runner with head fakes and body leans","Maintains speed at top of route"]'::jsonb, '["10.3% drop rate in 2025","Average catch radius","Size/length","Subpar run blocker","Does not possess home run speed at next level"]'::jsonb);

INSERT INTO admin_player_notes (prospect_id, pros, cons) VALUES
(23, '["8 TFLs in 2025","Green dot at Georgia","Exceptional burst and play speed","EXTREMELY reliable tackler - 6% missed tackle rate over last two years","Makes people feel him when tackling","Great speed","Incredible lateral quickness","High level run defender","Flies downhill with decisiveness","Good anchor against pulling blockers"]'::jsonb, '["Mediocre size","Arm length","Not very many splash plays (INTs, FFs, sacks)","Struggles in coverage (TBF assignments were very tough at UGA)","Bites easily on play action","Trouble stacking and shedding blockers"]'::jsonb);

INSERT INTO admin_player_notes (prospect_id, pros, cons) VALUES
(24, '["20 years old","Incredibly athletic (Feldman''s freaks list)","41.5in vertical jump","Clocked at 23mph","435 bench press","Very willing blocker","Great blocking technique","Very good after the catch","Extremely quick first step/acceleration","Regularly jumping over grown men","140 passer rating when targeted","Dangerous seam route","Versatile - can play in-line, slot, backfield, and out wide","Strong contested catcher"]'::jsonb, '["Lack of production","10% drop percentage (PFF)","Still raw as a route runner","Can struggle with physical DBs at LOS","Needs to learn how to find windows in zone better"]'::jsonb);

INSERT INTO admin_player_notes (prospect_id, pros, cons) VALUES
(26, '["Relentless pursuit to the football","9.7% stop rate is among highest at position in 2025","Good bull rush","Can rush from the inside","Versatility across the line"]'::jsonb, '["Sack production","Trouble finishing plays/tackles","Doesn''t rush with a plan"]'::jsonb);

INSERT INTO admin_player_notes (prospect_id, pros, cons) VALUES
(28, '["4.48 40","Violent hands","Natural leverage","Played Safety his first 2 years","Stacks and sheds blocks with ease","Great football instincts","ELITE cover skills in zone","Amazing length and frame for LB","Great play recognition","Arrives with violence","Sideline to sideline range","Can affect passing lanes with long arms","Ascending prospect - 14 missed tackles in 2024, 2 in 2025 (PFF)"]'::jsonb, '["Struggles in man coverage","Would like to see improved pad level","Only a 2 year starter at Linebacker","Overaggressive on play action and RPOs"]'::jsonb);

INSERT INTO admin_player_notes (prospect_id, pros, cons) VALUES
(30, '["Good length","Plays with fluid hips","Good lateral mover","Can play both man and zone at high level","Good short and long speed","Plays with patience at LOS","Press jam regularly disrupts receivers timing and get-off","Attacks the ball at catch point","Doesn''t bite on double moves, good eye discipline","Not afraid to get active in run game","Very bad tackler in 2024, drastically improved in 2025"]'::jsonb, '["Limited experience","Mirroring skills are eh","Arm tackler in open space","Doesn''t have true ''second gear'' for fastest receivers","Grabby when he gets beat (needs to trust his speed more)"]'::jsonb);

INSERT INTO admin_player_notes (prospect_id, pros, cons, comparisons) VALUES
(34, '["Great recognition sitting in zones","Need multiple people to tackle him in open field","Back-shoulder beast","Great YAC","Maintains speed throughout the catch","Accelerates quickly","50/50 balls are 70/30"]'::jsonb, '["Route running needs refinement","Want to see more subtleties selling routes","Want to see him use his hands more when catching","Struggles against physical corners"]'::jsonb, 'DK Metcalf, AJ Brown, Xavier Legette');

INSERT INTO admin_player_notes (prospect_id, pros, cons) VALUES
(39, '[]'::jsonb, '[]'::jsonb);

INSERT INTO admin_player_notes (prospect_id, pros, cons, comparisons) VALUES
(41, '["Very elusive","Fastest player on the field","Quick twitch","Can stop on a dime"]'::jsonb, '["Size","Route running lacks nuances","Poor run blocker (effort is there though)"]'::jsonb, 'Rondale Moore');

INSERT INTO admin_player_notes (prospect_id, pros, cons) VALUES
(44, '["Incredible size","Good first step for his size","Really good lateral quickness makes zone runs ineffective","Good against run and pass","Plays with VIOLENT hands and great anchoring strength","3 years of good production","11.9% run-stop rate - second in country only behind Kayden McDonald","10.6% PRWR - 3rd in country for DT","17.5% true pass rush set win-rate - 3rd in country for DT","2.9% missed tackle rate against the run"]'::jsonb, '["Limited pass rush arsenal - only wins with bull rush or swipe","Motor is inconsistent - too many plays where he isn''t trying","Plays with inconsistent pad level and stiff lower half","Will be 24 by first NFL snap"]'::jsonb);

INSERT INTO admin_player_notes (prospect_id, pros, cons) VALUES
(52, '["20.6% PRWR","17.5 TFLs in 2025","4 forced fumbles in 2025","Explosive first step","Versatility inside or outside","Great motor","Great lateral movement","Great inside move","Really good 2-hand swipe","Good bend and mobility for his size"]'::jsonb, '["Will be 25 before ever playing NFL snap","Benefits from playing on amazing D-Line","Season ending injury in 2023","Arms likely on shorter side","Not a ton of countermoves"]'::jsonb);

INSERT INTO admin_player_notes (prospect_id, pros, cons) VALUES
(54, '["33.3% forced interception rate (PFF)","3 year contributor","11 career forced fumbles","Great at triggering downhill","Great build and length","Uses length to disrupt passing lanes he shouldn''t be able to","Cleanly punishes receivers across MOF","Suffocates receivers in press man","Reads screen plays well"]'::jsonb, '["15.5% missed tackle rate","Level of competition","Lacks elite long speed","Lacks explosive first step/acceleration","Hip fluidity is a concern"]'::jsonb);

INSERT INTO admin_player_notes (prospect_id, pros, cons) VALUES
(59, '["46.1 passer rating when targeted (PFF)","44.4% completion percentage when targeted","Career 6.7% missed tackle rate","Very fluid hips (was an inline skier as a kid)","Disciplined eyes","Great anticipatory skills","Naturally sticky","Does great job getting chest to chest","Good ball skills","Great break on the ball"]'::jsonb, '["Struggles getting off blocks","Not an out of this world athlete","Plays very handsy - 13 penalties in 2 years"]'::jsonb);

INSERT INTO admin_player_notes (prospect_id, pros, cons) VALUES
(62, '["3 year contributor","Position versatility (can play slot and box)","Fluid hips","Great footwork","Disciplined eyes","Physical at catch point","Not scared to get involved in run game","Good understanding of when to pass off routes in zone","Allowed 3 touchdowns in college career (1 per year)"]'::jsonb, '["Could add weight to frame","Tackling form needs improvement","18.5% missed tackle rate in coverage (2025)","Not a huge playmaker","Very physical player, will need to clean it up at next level"]'::jsonb);

INSERT INTO admin_player_notes (prospect_id, pros, cons) VALUES
(66, '["Good production","AMAZING power","34 inch arms","19.8% PRWR (PFF)","36% true pass set win rate","Explosive get off","Great speed to power","Decent hip flexibility and bend","Great motor, relentless on backside pursuits"]'::jsonb, '["Needs a better pass rush plan","Hand fighting needs improvement","Pad level needs improvement","Limited array of moves"]'::jsonb);

INSERT INTO admin_player_notes (prospect_id, pros, cons) VALUES
(72, '["Great anticipatory skills + great reaction time","Great ball skills","4 INTs, 5 PIs in 2025","92.8 coverage grade in 2025 (PFF)","0 TDs allowed in 2025","Great in run support","Amazing technique in zone, press-man, off-man (versatile)"]'::jsonb, '["Size is questionable","Play strength at catch point","Overall long speed against top NFL burners"]'::jsonb);

INSERT INTO admin_player_notes (prospect_id, pros, cons) VALUES
(98, '["7''2 (86\") wingspan - 99th percentile","11\" hands - 97th percentile","6''5 1/8 - 92nd percentile","328lbs - 88th percentile","35\" arms - 94th percentile","4.1% missed tackle rate in 2025"]'::jsonb, '["Plays with high pad level","Limited moves rushing"]'::jsonb);

-- Done! Verify by running:
-- SELECT * FROM admin_big_board;
-- SELECT count(*) FROM admin_player_notes;
-- SELECT * FROM users WHERE role = 'SUPER_ADMIN';
