// 2026 NFL Draft Prospects - Top 500
// Data imported from CSV

const csvData = `Rank,Player Name,College,Position,Height,Weight
1,Arvell Reese,Ohio State,OLB,"6'4""",243
2,Rueben Bain Jr.,Miami (FL),EDGE,"6'3""",275
3,Caleb Downs,Ohio State,S,"6'0""",205
4,Fernando Mendoza,Indiana,QB,"6'5""",225
5,David Bailey,Texas Tech,EDGE,"6'3""",250
6,Francis Mauigoa,Miami (FL),OT,"6'6""",315
7,Carnell Tate,Ohio State,WR,"6'1""",191
8,Spencer Fano,Utah,OT,"6'5""",304
9,Jeremiyah Love,Notre Dame,RB,"6'0""",210
10,Jordyn Tyson,Arizona State,WR,"6'1""",195
11,Mansoor Delane,LSU,CB,"6'1""",187
12,Makai Lemon,USC,WR,"5'11""",190
13,Sonny Styles,Ohio State,OLB,"6'4""",235
14,Jermod McCoy,Tennessee,CB,"5'11""",193
15,Keldric Faulk,Auburn,DL5T,"6'5""",288
16,Peter Woods,Clemson,DL3T,"6'3""",315
17,Kenyon Sadiq,Oregon,TE,"6'3""",235
18,Olaivavega Ioane,Penn State,OG,"6'3""",348
19,Denzel Boston,Washington,WR,"6'3""",209
20,Cashius Howell,Texas A&M,EDGE,"6'4""",245
21,Avieon Terrell,Clemson,CB,"5'11""",180
22,Kadyn Proctor,Alabama,OT,"6'6""",369
23,Caleb Lomu,Utah,OT,"6'5""",302
24,C.J. Allen,Georgia,OLB,"6'1""",235
25,Kayden McDonald,Ohio State,DL1T,"6'2""",326
26,Kevin Concepcion,Texas A&M,WR,"5'11""",187
27,Ty Simpson,Alabama,QB,"6'2""",208
28,T.J. Parker,Clemson,EDGE,"6'3""",265
29,Caleb Banks,Florida,DL1T,"6'6""",325
30,Brandon Cisse,South Carolina,CB,"6'0""",190
31,Akheem Mesidor,Miami (FL),DL5T,"6'2""",280
32,Monroe Freeling,Georgia,OT,"6'6""",315
33,Colton Hood,Tennessee,CB,"5'11""",195
34,Emmanuel McNeil-Warren,Toledo,S,"6'2""",202
35,Anthony Hill Jr.,Texas,ILB,"6'3""",235
36,Emmanuel Pregnon,Oregon,OG,"6'5""",320
37,Lee Hunter,Texas Tech,DL1T,"6'4""",320
38,Dillon Thieneman,Oregon,S,"6'0""",207
39,Blake Miller,Clemson,OT,"6'5""",315
40,R Mason Thomas,Oklahoma,EDGE,"6'2""",243
41,Chris Bell,Louisville,WR,"6'2""",220
42,Christen Miller,Georgia,DL3T,"6'4""",305
43,Zion Young,Missouri,EDGE,"6'5""",265
44,Gennings Dunker,Iowa,OT,"6'5""",316
45,Chris Johnson,San Diego State,CB,"6'0""",195
46,Zachariah Branch,Georgia,WR,"5'10""",175
47,Keith Abney II,Arizona State,CB,"5'10""",195
48,D'Angelo Ponds,Indiana,CB,"5'9""",170
49,Germie Bernard,Alabama,WR,"6'0""",209
50,Max Iheanachor,Arizona State,OT,"6'5""",325
51,A.J. Haulcy,LSU,S,"5'11""",222
52,Jake Golday,Cincinnati,OLB,"6'3""",240
53,Chris Brazzell II,Tennessee,WR,"6'5""",200
54,Caleb Tiernan,Northwestern,OT,"6'6""",329
55,L.T. Overton,Alabama,DL5T,"6'4""",283
56,Keionte Scott,Miami (FL),CB,"6'0""",195
57,Jadarian Price,Notre Dame,RB,"5'11""",210
58,Kamari Ramsey,USC,S,"6'0""",204
59,Elijah Sarratt,Indiana,WR,"6'2""",209
60,Omar Cooper Jr.,Indiana,WR,"6'0""",204
61,Connor Lew,Auburn,OC,"6'3""",302
62,Chase Bisontis,Texas A&M,OG,"6'5""",320
63,Gabe Jacas,Illinois,EDGE,"6'2""",275
64,Max Klare,Ohio State,TE,"6'4""",240
65,Deontae Lawson,Alabama,ILB,"6'2""",239
66,Joshua Josephs,Tennessee,EDGE,"6'3""",245
67,Malik Muhammad,Texas,CB,"6'0""",190
68,Isaiah World,Oregon,OT,"6'8""",309
69,Josiah Trotter,Missouri,ILB,"6'2""",237
70,Domonique Orange,Iowa State,DL1T,"6'3""",325
71,Ja'Kobi Lane,USC,WR,"6'4""",195
72,Malachi Fields,Notre Dame,WR,"6'4""",220
73,Jacob Rodriguez,Texas Tech,ILB,"6'1""",230
74,Antonio Williams,Clemson,WR,"5'11""",190
75,Eli Stowers,Vanderbilt,TE,"6'4""",235
76,Derrick Moore,Michigan,EDGE,"6'3""",256
77,Romello Height,Texas Tech,EDGE,"6'3""",240
78,Trinidad Chambliss,Ole Miss,QB,"6'0""",200
79,Julian Neal,Arkansas,CB,"6'2""",208
80,Dani Dennis-Sutton,Penn State,EDGE,"6'4""",266
81,Darrell Jackson Jr.,Florida State,DL1T,"6'5""",330
82,Jonah Coleman,Washington,RB,"5'9""",229
83,Michael Trigg,Baylor,TE,"6'4""",246
84,Jake Slaughter,Florida,OC,"6'5""",308
85,Emmett Johnson,Nebraska,RB,"5'11""",200
86,Davison Igbinosun,Ohio State,CB,"6'2""",193
87,Anthony Lucas,USC,EDGE,"6'5""",285
88,Clayton Smith,Arizona State,EDGE,"6'4""",245
89,Chandler Rivers,Duke,CB,"5'10""",180
90,Deion Burks,Oklahoma,WR,"5'9""",194
91,Austin Barber,Florida,OT,"6'5""",314
92,Carson Beck,Miami (FL),QB,"6'4""",220
93,Will Lee III,Texas A&M,CB,"6'2""",190
94,Treydan Stukes,Arizona,CB,"6'2""",200
95,Devin Moore,Florida,CB,"6'3""",198
96,Taurean York,Texas A&M,ILB,"5'11""",235
97,Nick Singleton,Penn State,RB,"6'0""",226
98,Jack Endries,Texas,TE,"6'4""",236
99,Skyler Bell,Connecticut,WR,"6'0""",185
100,Dontay Corleone,Cincinnati,DL1T,"6'1""",320
101,Harold Perkins Jr.,LSU,OLB,"6'1""",225
102,Drew Shelton,Penn State,OT,"6'5""",307
103,Kaytron Allen,Penn State,RB,"5'10""",220
104,Zakee Wheatley,Penn State,S,"6'2""",198
105,Malachi Lawrence,UCF,EDGE,"6'4""",260
106,Chris McClellan,Missouri,DL1T,"6'4""",323
107,Brian Parker II,Duke,OC,"6'5""",300
108,Daylen Everette,Georgia,CB,"6'1""",190
109,Ted Hurst,Georgia State,WR,"6'2""",194
110,Lander Barton,Utah,ILB,"6'3""",236
111,Garrett Nussmeier,LSU,QB,"6'2""",200
112,Jaishawn Barham,Michigan,ILB,"6'3""",248
113,Jude Bowry,Boston College,OT,"6'5""",308
114,Gracen Halton,Oklahoma,DL3T,"6'2""",285
115,Caden Curry,Ohio State,EDGE,"6'3""",260
116,Jalon Kilgore,South Carolina,S,"6'1""",219
117,Dametrious Crownover,Texas A&M,OT,"6'6""",330
118,Mikail Kamara,Indiana,EDGE,"6'1""",265
119,Bud Clark,TCU,S,"6'2""",185
120,C.J. Daniels,Miami (FL),WR,"6'2""",205
121,Sam Hecht,Kansas State,OC,"6'4""",300
122,Justin Joly,NC State,TE,"6'3""",251
123,Keylan Rutledge,Georgia Tech,OG,"6'4""",320
124,Michael Taaffe,Texas,S,"6'0""",195
125,Ar'Maj Reed-Adams,Texas A&M,OG,"6'5""",330
126,Kyle Louis,Pittsburgh,OLB,"6'0""",224
127,Zane Durant,Penn State,DL3T,"6'1""",288
128,Tyreak Sapp,Florida,DL5T,"6'3""",275
129,Eli Raridon,Notre Dame,TE,"6'7""",252
130,Demond Claiborne,Wake Forest,RB,"5'9""",195
131,Tim Keenan III,Alabama,DL1T,"6'2""",326
132,Drew Allar,Penn State,QB,"6'5""",235
133,Sam Roush,Stanford,TE,"6'5""",260
134,Louis Moore,Indiana,S,"5'11""",200
135,Fernando Carmona Jr.,Arkansas,OG,"6'5""",322
136,Aamil Wagner,Notre Dame,OT,"6'6""",291
137,Oscar Delp,Georgia,TE,"6'5""",245
138,Xavier Scott,Illinois,CB,"5'11""",190
139,Mike Washington Jr.,Arkansas,RB,"6'2""",228
140,Tacario Davis,Washington,CB,"6'4""",200
141,Joe Royer,Cincinnati,TE,"6'4""",255
142,Skyler Gill-Howard,Texas Tech,DL5T,"6'1""",290
143,Bryce Lance,North Dakota State,WR,"6'2""",204
144,Parker Brailsford,Alabama,OC,"6'2""",290
145,Logan Jones,Iowa,OC,"6'3""",293
146,Cade Klubnik,Clemson,QB,"6'2""",210
147,Beau Stephens,Iowa,OG,"6'5""",315
148,Brenen Thompson,Mississippi State,WR,"5'9""",170
149,Albert Regis,Texas A&M,DL3T,"6'1""",310
150,Hezekiah Masses,California,CB,"6'0""",175
151,J.C. Davis,Illinois,OT,"6'5""",320
152,Kevin Coleman Jr.,Missouri,WR,"5'11""",180
153,Domani Jackson,Alabama,CB,"6'1""",201
154,D.J. Campbell,Texas,OG,"6'3""",330
155,Rayshaun Benny,Michigan,DL3T,"6'3""",296
156,Dallen Bentley,Utah,TE,"6'4""",259
157,Eric Rivers,Georgia Tech,WR,"5'11""",174
158,Josh Cameron,Baylor,WR,"6'1""",218
159,Zxavian Harris,Ole Miss,DL1T,"6'6""",320
160,Jaeden Roberts,Alabama,OG,"6'5""",310
161,Kage Casey,Boise State,OT,"6'5""",316
162,Aaron Anderson,LSU,WR,"5'8""",187
163,Aiden Fisher,Indiana,ILB,"6'1""",233
164,Eric McAlister,TCU,WR,"6'3""",205
165,John Michael Gyllenborg,Wyoming,TE,"6'5""",251
166,T.J. Hall,Iowa,CB,"6'0""",190
167,J'Mari Taylor,Virginia,RB,"5'9""",204
168,DeMonte Capehart,Clemson,DL5T,"6'5""",316
169,Sawyer Robertson,Baylor,QB,"6'4""",220
170,Max Llewellyn,Iowa,EDGE,"6'4""",263
171,Thaddeus Dixon,North Carolina,CB,"6'0""",186
172,Marlin Klein,Michigan,TE,"6'6""",250
173,Dae'Quan Wright,Ole Miss,TE,"6'4""",255
174,Bishop Fitzgerald,USC,S,"5'11""",198
175,Trey Moore,Texas,EDGE,"6'3""",245
176,Trey Zuhn III,Texas A&M,OT,"6'6""",315
177,Keyron Crawford,Auburn,EDGE,"6'4""",255
178,T.J. Guy,Michigan,EDGE,"6'4""",250
179,Jalen Huskey,Maryland,S,"6'2""",201
180,Josh Moten,Southern Miss,CB,"6'0""",174
181,Aaron Graves,Iowa,DL3T,"6'4""",300
182,Jimmy Rolder,Michigan,ILB,"6'2""",240
183,DeShon Singleton,Nebraska,S,"6'3""",210
184,Le'Veon Moss,Texas A&M,RB,"5'11""",215
185,Bryce Boettcher,Oregon,ILB,"6'2""",225
186,Taylen Green,Arkansas,QB,"6'6""",230
187,Collin Wright,Stanford,CB,"6'0""",195
188,Chase Roberts,BYU,WR,"6'4""",210
189,Roman Hemby,Indiana,RB,"6'0""",208
190,Kahlil Benson,Indiana,OT,"6'5""",319
191,Stephen Daley,Indiana,EDGE,"6'1""",273
192,Riley Nowakowski,Indiana,TE,"6'2""",249
193,Isaiah Smith,SMU,EDGE,"6'4""",248
194,Nadame Tucker,Western Michigan,EDGE,"6'3""",250
195,Keanu Tanuvasa,BYU,DL3T,"6'3""",300
196,Ephesians Prysock,Washington,CB,"6'4""",195
197,Bryce Foster,Kansas,OC,"6'4""",330
198,Seth McGowan,Kentucky,RB,"6'1""",215
199,V.J. Payne,Kansas State,S,"6'3""",208
200,Jam Miller,Alabama,RB,"5'10""",221
201,Terion Stewart,Virginia Tech,RB,"5'9""",222
202,Keagen Trost,Missouri,OT,"6'4""",316
203,Colbie Young,Georgia,WR,"6'3""",215
204,Justin Jefferson,Alabama,ILB,"6'1""",225
205,Ethan Burke,Texas,DL5T,"6'6""",259
206,Connor Tollison,Missouri,OC,"6'4""",209
207,Deven Eastern,Minnesota,DL1T,"6'6""",320
208,Noah Whittington,Oregon,RB,"5'8""",203
209,Tanner Koziol,Houston,TE,"6'6""",237
210,Bryan Thomas Jr.,South Carolina,EDGE,"6'2""",249
211,Jakobe Thomas,Miami (FL),S,"6'2""",200
212,Cam'Ron Stewart,Temple,EDGE,"6'4""",250
213,Kaleb Proctor,SE Louisiana,DL5T,"6'3""",280
214,Harrison Wallace III,Ole Miss,WR,"6'1""",200
215,Cameron Ball,Arkansas,DL1T,"6'5""",323
216,Josh Thompson,LSU,OG,"6'5""",301
217,Diego Pavia,Vanderbilt,QB,"6'0""",207
218,Barion Brown,LSU,WR,"6'1""",182
219,Kelley Jones,Mississippi State,CB,"6'4""",195
220,Peter Clarke,Temple,TE,"6'6""",265
221,Phillip Daniels,Ohio State,OT,"6'5""",315
222,O'Mega Blake,Arkansas,WR,"6'1""",187
223,Earl Little Jr.,Florida State,S,"6'1""",199
224,Niki Prongos,Stanford,OT,"6'7""",315
225,Ernest Hausmann,Michigan,ILB,"6'2""",235
226,Matt Gulbin,Michigan State,OC,"6'4""",312
227,DeAndre Moore Jr.,Texas,WR,"6'0""",195
228,Rodrick Pleasant,UCLA,CB,"5'10""",175
229,Darius Taylor,Minnesota,RB,"5'11""",215
230,Xavier Nwankpa,Iowa,S,"6'2""",215
231,Brice Pollock,Texas Tech,CB,"6'0""",195
232,Christian Gray,Notre Dame,CB,"6'0""",187
233,Tate Sandell,Oklahoma,PK,"5'9""",182
234,Isaiah Horton,Alabama,WR,"6'4""",208
235,Evan Stewart,Oregon,WR,"6'0""",175
236,Jalen Catalon,Missouri,S,"5'10""",205
237,Josh Gesky,Illinois,OG,"6'4""",335
238,Carson Hinzman,Ohio State,OC,"6'5""",300
239,Pat Coogan,Indiana,OC,"6'5""",310
240,Bryson Washington,Baylor,RB,"6'0""",203
241,Keyshaun Elliott,Arizona State,ILB,"6'2""",235
242,Anez Cooper,Miami (FL),OG,"6'5""",350
243,John Nestor,Minnesota,CB,"6'1""",205
244,West Weeks,LSU,ILB,"6'2""",235
245,Charles Demmings,Stephen F Austin,CB,"6'1""",190
246,Will Whitson,Mississippi State,EDGE,"6'5""",295
247,Kendal Daniels,Oklahoma,S,"6'5""",242
248,Logan Fano,Utah,EDGE,"6'5""",260
249,Red Murdock,Buffalo,ILB,"6'3""",235
250,Brandon Cleveland,NC State,DL1T,"6'4""",315
251,Terry Moore,Duke,S,"6'1""",200
252,Brent Austin,Cal,CB,"5'11""",180
253,Wesley Williams,Duke,EDGE,"6'3""",264
254,Jadon Canady,Oregon,CB,"5'10""",185
255,Gary Smith III,UCLA,DL1T,"6'2""",340
256,Rahsul Faison,South Carolina,RB,"6'0""",218
257,Marques White,UMass,EDGE,"6'2""",250
258,Desmond Purnell,Kansas State,ILB,"5'11""",232
259,Kwabena Asamoah,Rutgers,OG,"6'2""",311
260,Ahmari Harvey,Georgia Tech,CB,"6'0""",195
261,Cyrus Allen,Cincinnati,WR,"5'11""",180
262,Drew Bobo,Georgia,OC,"6'5""",305
263,Reggie Virgil,Texas Tech,WR,"6'3""",190
264,Drayk Bowen,Notre Dame,ILB,"6'2""",239
265,Namdi Obiazor,TCU,OLB,"6'3""",230
266,Tyler Onyedim,Texas A&M,DL5T,"6'3""",295
267,Jaren Kump,Utah,OC,"6'6""",315
268,Nate Boerkircher,Texas A&M,TE,"6'4""",250
269,Kemari Copeland,Virginia Tech,DL5T,"6'2""",280
270,Logan Taylor,Boston College,OG,"6'6""",308
271,Wes Pahl,Oklahoma State,P,"6'5""",205
272,Damari Brown,Miami (FL),CB,"6'1""",190
273,Ryan Baer,Pittsburgh,OT,"6'7""",325
274,Malik Spencer,Michigan State,S,"6'1""",192
275,George Gumbs,Florida,EDGE,"6'4""",250
276,Bryson Eason,Tennessee,DL3T,"6'3""",315
277,Enrique Cruz Jr.,Kansas,OT,"6'6""",320
278,Diego Pounds,Ole Miss,OT,"6'6""",340
279,Adam Randall,Clemson,RB,"6'2""",235
280,Nick Dawkins,Penn State,OC,"6'3""",298
281,Owen Heinecke,Oklahoma,ILB,"6'1""",227
282,Luke Montgomery,Ohio State,OG,"6'5""",312
283,James Thompson Jr.,Illinois,DL3T,"6'5""",310
284,Kody Huisman,Virginia Tech,DL1T,"6'3""",297
285,Preston Zachman,Wisconsin,S,"6'1""",212
286,Miller Moss,Louisville,QB,"6'2""",205
287,Kevin Cline,Boston College,OT,"6'6""",323
288,Eric Gentry,USC,OLB,"6'5""",215
289,James Neal,Iowa State,OT,"6'5""",325
290,Nolan Rucci,Penn State,OT,"6'7""",308
291,Tellek Lockette,Texas State,OG,"6'3""",327
292,Jack Pyburn,LSU,EDGE,"6'4""",264
293,Febechi Nwaiwu,Oklahoma,OG,"6'4""",339
294,Mason Reiger,Wisconsin,EDGE,"6'5""",248
295,Wesley Bailey,Louisville,EDGE,"6'5""",265
296,Jalen Walthall,Incarnate Word,WR,"6'2""",180
297,Jeremiah Wright,Auburn,OG,"6'4""",348
298,Kobe Baynes,Kansas,OG,"6'4""",315
299,Joey Aguilar,Tennessee,QB,"6'3""",225
300,Karon Prunty,Wake Forest,CB,"6'2""",192
301,Cian Slone,NC State,EDGE,"6'4""",252
302,Nick Barrett,South Carolina,DL1T,"6'2""",322
303,Nic Anderson,LSU,WR,"6'4""",216
304,Landon Robinson,Navy,DL5T,"6'0""",287
305,Jacob De Jesus,Cal,WR,"5'7""",170
306,Andre Fuller,Toledo,CB,"6'2""",202
307,Vincent Anthony,Duke,EDGE,"6'6""",250
308,Chris Adams,Memphis,OT,"6'5""",290
309,Jeff Caldwell,Cincinnati,WR,"6'5""",215
310,Omar Aigbedion,Baylor,OG,"6'2""",310
311,Seydou Traore,Mississippi State,TE,"6'4""",235
312,Micah Morris,Georgia,OG,"6'4""",330
313,Josh Cuevas,Alabama,TE,"6'3""",256
314,Trey Smack,Florida,PK,"6'1""",202
315,Nyjalik Kelly,UCF,EDGE,"6'5""",265
316,Dan Villari,Syracuse,TE,"6'4""",245
317,Jalon Daniels,Kansas,QB,"6'0""",220
318,Toriano Pride Jr.,Missouri,CB,"5'10""",190
319,J'Mond Tapp,Southern Mississippi,EDGE,"6'3""",275
320,Tommy Doman,Florida,P,"6'4""",215
321,Trey White,San Diego State,EDGE,"6'2""",245
322,Dillon Wade,Auburn,OG,"6'3""",315
323,Kansei Matsuzawa,Hawaii,PK,"6'2""",200
324,Chip Trayanum,Toledo,RB,"5'11""",227
325,Gafa Faga,San Jose State,DL3T,"6'2""",304
326,Rene Konga,Louisville,DL5T,"6'4""",300
327,Kam Dewberry,Alabama,OG,"6'4""",332
328,Carver Willis,Washington,OT,"6'5""",291
329,Cole Payton,North Dakota State,QB,"6'3""",233
330,Romello Brinson,SMU,WR,"6'2""",190
331,Caden Barnett,Wyoming,OG,"6'5""",320
332,Henry Lutovsky,Nebraska,OG,"6'6""",320
333,Caden Fordham,NC State,OLB,"6'1""",230
334,Jacob Thomas,James Madison,S,"6'1""",212
335,Isaiah Jatta,BYU,OT,"6'6""",315
336,Kahlil Saunders,Kentucky,DL3T,"6'4""",293
337,D.J. Rogers,TCU,TE,"6'4""",250
338,Nick Andersen,Wake Forest,S,"5'11""",197
339,Al'Zillion Hamilton,Fresno State,CB,"5'11""",185
340,Knijeah Harris,Florida,OG,"6'2""",316
341,DeCarlos Nicholson,USC,CB,"6'3""",200
342,Noah Thomas,Georgia,WR,"6'5""",200
343,Micah Davey,UTEP,ILB,"6'2""",235
344,Anthony Hankerson,Oregon State,RB,"5'8""",203
345,Caleb Douglas,Texas Tech,WR,"6'4""",205
346,Jack Kelly,BYU,OLB,"6'2""",242
347,Sebastian Harsh,NC State,EDGE,"6'3""",263
348,Caullin Lacy,Louisville,WR,"5'10""",190
349,Gunner Stockton,Georgia,QB,"6'1""",215
350,Emmanuel Henderson,Kansas,WR,"6'1""",190
351,Tyre West,Tennessee,DL5T,"6'3""",290
352,Xavian Sorey Jr.,Arkansas,OLB,"6'3""",225
353,Lake McRee,USC,TE,"6'4""",250
354,Dalton Johnson,Arizona,S,"5'11""",198
355,Damonte Smith,Middle Tennessee State,DL3T,"6'1""",301
356,Cole Wisniewski,Texas Tech,S,"6'3""",218
357,Davion Carter,Texas Tech,OG,"6'0""",295
358,Princewill Umanmielen,Ole Miss,EDGE,"6'4""",245
359,Desmond Reid,Pittsburgh,RB,"5'8""",175
360,Brylan Green,Liberty,S,"5'9""",180
361,Michael Heldman,Central Michigan,EDGE,"6'4""",260
362,Kaleb Elarms-Orr,TCU,OLB,"6'2""",230
363,David Gusta,Kentucky,DL3T,"6'3""",302
364,Joe Fagnano,UConn,QB,"6'4""",225
365,Markis Deal,TCU,DL1T,"6'4""",325
366,Malcolm DeWalt IV,Akron,CB,"6'2""",190
367,Luke Lindenmeyer,Nebraska,TE,"6'3""",250
368,Eli Heidenreich,Navy,WR,"6'0""",206
369,Geno VanDeMark,Alabama,OG,"6'5""",326
370,Clay Patterson,Stanford,EDGE,"6'3""",280
371,Star Thomas,Tennessee,RB,"6'0""",210
372,Jaylon Guilbeau,Texas,CB,"6'0""",183
373,DeVonta Smith,Notre Dame,CB,"6'0""",205
374,Jayden Bellamy,UCF,CB,"6'1""",180
375,Eddie Walls III,Houston,EDGE,"6'4""",250
376,Brett Thorson,Georgia,P,"6'2""",235
377,Nathan Voorhis,Ball State,EDGE,"6'3""",247
378,Dane Key,Nebraska,WR,"6'2""",210
379,Karson Sharar,Iowa,ILB,"6'2""",235
380,Rasheed Miller,Louisville,OT,"6'7""",310
381,Ryan Davis,Utah,WR,"5'10""",180
382,Evan Beerntsen,Northwestern,OG,"6'3""",310
383,Maverick Baranowski,Minnesota,ILB,"6'2""",230
384,Keyshawn James-Newby,New Mexico,EDGE,"6'2""",244
385,Tomas Rimac,Virginia Tech,OG,"6'6""",318
386,Skyler Thomas,Oregon State,S,"6'2""",212
387,Gabriel Benyard,Kennesaw State,WR,"5'10""",185
388,Bruno Fina,Duke,OT,"6'5""",305
389,Vinny Anthony II,Wisconsin,WR,"6'0""",190
390,Jaidyn Denis,Memphis,CB,"6'2""",191
391,Gabriel Brownlow-Dindy,South Carolina,DL1T,"6'3""",315
392,Jamal Haynes,Georgia Tech,RB,"5'9""",190
393,Cam Rice,Maryland,DL3T,"6'2""",303
394,Devin Bale,Arkansas,P,"6'3""",205
395,Christian Alliegro,Wisconsin,ILB,"6'4""",240
396,Tyler Duzansky,Penn State,LS,"6'4""",225
397,Alan Herron,Maryland,OL,"6'6""",320
398,Mohamed Toure,Miami (FL),ILB,"6'1""",236
399,Kobe Prentice,Baylor,WR,"5'10""",188
400,Kentrel Bullock,South Alabama,RB,"5'10""",205
401,Quintayvious Hutchins,Boston College,EDGE,"6'2""",242
402,Lance Heard,Tennessee,OT,"6'5""",340
403,Jayven Williams,Mississippi State,CB,"6'1""",185
404,Latrell McCutchin Sr.,Houston,CB,"6'1""",185
405,Jalen McMurray,Tennessee,CB,"6'0""",187
406,Tyreek Chappell,Texas A&M,CB,"5'10""",185
407,Robert Henry Jr.,UTSA,RB,"5'9""",205
408,Max Tomczak,Youngstown State,WR,"6'0""",195
409,Daylan Carnell,Missouri,S,"6'2""",225
410,Gus Zilinskas,Rutgers,OC,"6'2""",305
411,Wade Woodaz,Clemson,OLB,"6'3""",235
412,McKale Boley,Virginia,OT,"6'4""",302
413,Isaiah Nwokobia,SMU,S,"6'1""",202
414,Cole Maynard,Western Kentucky,P,"6'1""",180
415,Mac Harris,South Florida,OLB,"6'0""",235
416,Jeffrey M'Ba,SMU,DL3T,"6'5""",312
417,Aidan Laros,Kentucky,P,"6'2""",218
418,Jaren Kanak,Oklahoma,TE,"6'2""",233
419,Howard Sampson,Texas Tech,OT,"6'8""",325
420,Garrett DiGiorgio,UCLA,OT,"6'7""",320
421,Paul Rubelt,UCF,OT,"6'9""",330
422,Carlos Allen Jr.,Houston,DL3T,"6'1""",295
423,Josh Kattus,Kentucky,TE,"6'4""",247
424,Ryan Eckley,Michigan State,P,"6'2""",207
425,Kalil Alexander,Texas State,EDGE,"6'3""",225
426,Laith Marjan,Kansas,PK,"6'2""",210
427,Dreyden Norwood,Missouri,CB,"6'0""",187
428,Chamon Metayer,Arizona State,TE,"6'4""",255
429,Ethan Onianwa,Ohio State,OG,"6'6""",345
430,Jager Burton,Kentucky,OC,"6'3""",316
431,D.J. Harvey,USC,CB,"5'11""",174
432,Avery Smith,Toledo,CB,"5'10""",185
433,Max Bredeson,Michigan,FB,"6'1""",250
434,Ahmaad Moses,SMU,S,"5'10""",200
435,Austin Leausa,BYU,OG,"6'5""",315
436,Keeshawn Silver,USC,DL1T,"6'4""",330
437,Riley Mahlman,Wisconsin,OT,"6'7""",308
438,Davon Booth,Mississippi State,RB,"5'9""",205
439,Phillip Dunnam,UCF,S,"6'1""",195
440,De'Shawn Rucker,USF,CB,"6'0""",195
441,Jeremiah Wilson,Florida State,CB,"5'10""",185
442,Dasan McCullough,Nebraska,EDGE,"6'4""",235
443,Matthew Hibner,SMU,TE,"6'4""",252
444,Cameron Calhoun,Alabama,CB,"6'0""",177
445,Jaden Craig,Harvard,QB,"6'2""",230
446,Dominic Bailey,Tennessee,DL5T,"6'3""",292
447,Aidan Hubbard,Northwestern,EDGE,"6'4""",255
448,Tony Grimes,Purdue,CB,"6'1""",190
449,Jackson Carsello,Northwestern,OC,"6'4""",300
450,Luke Basso,Oregon,LS,"6'3""",220
451,D.J. Hicks,Texas A&M,DL3T,"6'3""",295
452,Trebor Pena,Syracuse,WR,"5'11""",184
453,Avery Johnson,Kansas State,QB,"6'2""",196
454,Jason Henderson,Old Dominion,ILB,"6'1""",225
455,Junior Vandeross III,Toledo,WR,"5'8""",182
456,Jackie Marshall,Baylor,DL5T,"6'3""",290
457,Nasir Bowers,Toledo,CB,"5'9""",182
458,Hero Kanu,Texas,DL3T,"6'4""",305
459,Gavin Gerhardt,Cincinnati,OC,"6'4""",310
460,Ben Bell,Virginia Tech,EDGE,"6'2""",255
461,Bangally Kamara,Kansas,LB,"6'2""",235`;

// Parse CSV data
function parseCSV(csv) {
  const lines = csv.trim().split('\n');
  const prospects = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // Handle CSV with quoted fields containing commas
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    if (values.length >= 6) {
      const rank = parseInt(values[0]);
      const name = values[1];
      const college = values[2];
      let position = values[3];
      const height = values[4].replace(/"/g, '');
      const weight = parseInt(values[5]);

      // Consolidate positions
      let notes = '';
      // DL positions - track technique in notes
      if (position === 'DL1T') {
        notes = '1-tech (Nose Tackle)';
        position = 'DL';
      } else if (position === 'DL3T') {
        notes = '3-tech';
        position = 'DL';
      } else if (position === 'DL5T') {
        notes = '5-tech';
        position = 'DL';
      }
      // Consolidate linebacker positions into LB
      if (position === 'ILB' || position === 'OLB') {
        position = 'LB';
      }
      // Move OL to OG
      if (position === 'OL') {
        position = 'OG';
      }

      // Determine projected round based on rank
      let projectedRound;
      if (rank <= 32) projectedRound = 1;
      else if (rank <= 64) projectedRound = 2;
      else if (rank <= 100) projectedRound = 3;
      else if (rank <= 140) projectedRound = 4;
      else if (rank <= 180) projectedRound = 5;
      else if (rank <= 224) projectedRound = 6;
      else if (rank <= 270) projectedRound = 7;
      else projectedRound = 'UDFA';

      prospects.push({
        id: rank,
        name,
        position,
        college,
        projectedRound,
        height,
        weight,
        notes,
        class: 'Senior',
        teamLogo: '',
        stats: {},
        strengths: [],
        weaknesses: [],
        summary: `${name} is a ${position} from ${college}, ranked #${rank} in the 2026 NFL Draft class.`
      });
    }
  }

  return prospects;
}

export const prospects = parseCSV(csvData);

// Helper function to get a prospect by ID
export const getProspectById = (id) => {
  return prospects.find(p => p.id === parseInt(id));
};

// Extract unique positions from the data
const positionSet = new Set(prospects.map(p => p.position));
export const positions = Array.from(positionSet).sort();

// Extract unique colleges from the data
const collegeSet = new Set(prospects.map(p => p.college));
export const colleges = Array.from(collegeSet).sort();

// Position groups for filtering
export const positionGroups = {
  'Offense': ['QB', 'RB', 'FB', 'WR', 'TE', 'OT', 'OG', 'OC', 'OL'],
  'Defense': ['EDGE', 'DL', 'ILB', 'OLB', 'LB', 'CB', 'S'],
  'Special Teams': ['PK', 'P', 'LS']
};

// Calculate position ranks (e.g., QB1, WR3) from an ordered list
export const getPositionRanks = (orderedProspects) => {
  const counters = {};
  const ranks = {};
  orderedProspects.forEach(p => {
    counters[p.position] = (counters[p.position] || 0) + 1;
    ranks[p.id] = `${p.position}${counters[p.position]}`;
  });
  return ranks;
};

// Get position display name (maps technical positions to readable names)
export const positionDisplayNames = {
  'QB': 'Quarterback',
  'RB': 'Running Back',
  'FB': 'Fullback',
  'WR': 'Wide Receiver',
  'TE': 'Tight End',
  'OT': 'Offensive Tackle',
  'OG': 'Offensive Guard',
  'OC': 'Center',
  'OL': 'Offensive Line',
  'EDGE': 'Edge Rusher',
  'DL': 'Defensive Line',
  'ILB': 'Inside Linebacker',
  'OLB': 'Outside Linebacker',
  'LB': 'Linebacker',
  'CB': 'Cornerback',
  'S': 'Safety',
  'PK': 'Kicker',
  'P': 'Punter',
  'LS': 'Long Snapper'
};
