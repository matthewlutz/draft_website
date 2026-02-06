// 2026 NFL Draft Prospects - Top 500
// Data imported from CSV

const csvData = `Rank,Player Name,College,Position,Height,Weight
1,Fernando Mendoza,Indiana,QB,"6'5""",225
2,Caleb Downs,Ohio State,S,"6'0""",205
3,Rueben Bain Jr.,Miami (FL),EDGE,"6'3""",275
4,Arvell Reese,Ohio State,OLB,"6'4""",243
5,Peter Woods,Clemson,DL3T,"6'3""",315
6,Francis Mauigoa,Miami (FL),OT,"6'6""",315
7,Keldric Faulk,Auburn,DL5T,"6'5""",288
8,Spencer Fano,Utah,OT,"6'5""",304
9,Jordyn Tyson,Arizona State,WR,"6'1""",195
10,Jeremiyah Love,Notre Dame,RB,"6'0""",210
11,Jermod McCoy,Tennessee,CB,"5'11""",193
12,Carnell Tate,Ohio State,WR,"6'1""",191
13,Mansoor Delane,LSU,CB,"6'1""",187
14,Makai Lemon,USC,WR,"5'11""",190
15,Avieon Terrell,Clemson,CB,"5'11""",180
16,T.J. Parker,Clemson,EDGE,"6'3""",265
17,Cashius Howell,Texas A&M,EDGE,"6'4""",245
18,David Bailey,Texas Tech,EDGE,"6'3""",250
19,Denzel Boston,Washington,WR,"6'3""",209
20,Kevin Concepcion,Texas A&M,WR,"5'11""",187
21,Kadyn Proctor,Alabama,OT,"6'6""",369
22,Olaivavega Ioane,Penn State,OG,"6'3""",348
23,C.J. Allen,Georgia,OLB,"6'1""",235
24,Kenyon Sadiq,Oregon,TE,"6'3""",235
25,Ty Simpson,Alabama,QB,"6'2""",208
26,L.T. Overton,Alabama,DL5T,"6'4""",283
27,Christen Miller,Georgia,DL3T,"6'4""",305
28,Sonny Styles,Ohio State,OLB,"6'4""",235
29,Caleb Lomu,Utah,OT,"6'5""",302
30,Colton Hood,Tennessee,CB,"5'11""",195
31,Romello Height,Texas Tech,EDGE,"6'3""",240
32,Dani Dennis-Sutton,Penn State,EDGE,"6'4""",266
33,Gabe Jacas,Illinois,EDGE,"6'2""",275
34,Chris Bell,Louisville,WR,"6'2""",220
35,Anthony Hill Jr.,Texas,ILB,"6'3""",235
36,Caleb Banks,Florida,DL1T,"6'6""",325
37,Brandon Cisse,South Carolina,CB,"6'0""",190
38,Kayden McDonald,Ohio State,DL1T,"6'2""",326
39,Dillon Thieneman,Oregon,S,"6'0""",207
40,Isaiah World,Oregon,OT,"6'8""",309
41,Zachariah Branch,Georgia,WR,"5'10""",175
42,Domonique Orange,Iowa State,DL1T,"6'3""",325
43,Eli Stowers,Vanderbilt,TE,"6'4""",235
44,Lee Hunter,Texas Tech,DL1T,"6'4""",320
45,Monroe Freeling,Georgia,OT,"6'6""",315
46,D'Angelo Ponds,Indiana,CB,"5'9""",170
47,Joshua Josephs,Tennessee,EDGE,"6'3""",245
48,Kamari Ramsey,USC,S,"6'0""",204
49,Gennings Dunker,Iowa,OT,"6'5""",316
50,Deontae Lawson,Alabama,ILB,"6'2""",239
51,R Mason Thomas,Oklahoma,EDGE,"6'2""",243
52,Akheem Mesidor,Miami (FL),DL5T,"6'2""",280
53,Harold Perkins Jr.,LSU,OLB,"6'1""",225
54,Emmanuel McNeil-Warren,Toledo,S,"6'2""",202
55,Taurean York,Texas A&M,ILB,"5'11""",235
56,Ja'Kobi Lane,USC,WR,"6'4""",195
57,Emmanuel Pregnon,Oregon,OG,"6'5""",320
58,Davison Igbinosun,Ohio State,CB,"6'2""",193
59,Keith Abney II,Arizona State,CB,"5'10""",195
60,Zion Young,Missouri,EDGE,"6'5""",265
61,Tyreak Sapp,Florida,DL5T,"6'3""",275
62,Malik Muhammad,Texas,CB,"6'0""",190
63,Elijah Sarratt,Indiana,WR,"6'2""",209
64,Zxavian Harris,Ole Miss,DL1T,"6'6""",320
65,Connor Lew,Auburn,OC,"6'3""",302
66,Derrick Moore,Michigan,EDGE,"6'3""",256
67,Domani Jackson,Alabama,CB,"6'1""",201
68,Jake Slaughter,Florida,OC,"6'5""",308
69,Germie Bernard,Alabama,WR,"6'0""",209
70,Jonah Coleman,Washington,RB,"5'9""",229
71,Carson Beck,Miami (FL),QB,"6'4""",220
72,Chris Johnson,San Diego State,CB,"6'0""",195
73,Malachi Fields,Notre Dame,WR,"6'4""",220
74,Jacob Rodriguez,Texas Tech,ILB,"6'1""",230
75,Caleb Tiernan,Northwestern,OT,"6'6""",329
76,Blake Miller,Clemson,OT,"6'5""",315
77,Daylen Everette,Georgia,CB,"6'1""",190
78,Garrett Nussmeier,LSU,QB,"6'2""",200
79,Michael Taaffe,Texas,S,"6'0""",195
80,Bud Clark,TCU,S,"6'2""",185
81,Max Klare,Ohio State,TE,"6'4""",240
82,Julian Neal,Arkansas,CB,"6'2""",208
83,Kyle Louis,Pittsburgh,OLB,"6'0""",224
84,Kaytron Allen,Penn State,RB,"5'10""",220
85,Chris Brazzell II,Tennessee,WR,"6'5""",200
86,Austin Barber,Florida,OT,"6'5""",314
87,Antonio Williams,Clemson,WR,"5'11""",190
88,Chase Bisontis,Texas A&M,OG,"6'5""",320
89,Drew Allar,Penn State,QB,"6'5""",235
90,Kevin Coleman Jr.,Missouri,WR,"5'11""",180
91,A.J. Haulcy,LSU,S,"5'11""",222
92,Michael Trigg,Baylor,TE,"6'4""",246
93,Jake Golday,Cincinnati,OLB,"6'3""",240
94,Deion Burks,Oklahoma,WR,"5'9""",194
95,Brian Parker II,Duke,OC,"6'5""",300
96,Max Iheanachor,Arizona State,OT,"6'5""",325
97,Zane Durant,Penn State,DL3T,"6'1""",288
98,Darrell Jackson Jr.,Florida State,DL1T,"6'5""",330
99,Josiah Trotter,Missouri,ILB,"6'2""",237
100,Dontay Corleone,Cincinnati,DL1T,"6'1""",320
101,Trinidad Chambliss,Ole Miss,QB,"6'0""",200
102,Rayshaun Benny,Michigan,DL3T,"6'3""",296
103,Lander Barton,Utah,ILB,"6'3""",236
104,Omar Cooper Jr.,Indiana,WR,"6'0""",204
105,Jadarian Price,Notre Dame,RB,"5'11""",210
106,Tim Keenan III,Alabama,DL1T,"6'2""",326
107,Kevin Coleman Jr.,Missouri,WR,"5'11""",180
108,Brian Parker II,Duke,OT,"6'5""",300
109,Max Llewellyn,Iowa,EDGE,"6'4""",263
110,Cade Klubnik,Clemson,QB,"6'2""",210
111,Nick Singleton,Penn State,RB,"6'0""",226
112,Demond Claiborne,Wake Forest,RB,"5'9""",195
113,Logan Jones,Iowa,OC,"6'3""",293
114,Chase Bisontis,Texas A&M,OG,"6'5""",320
115,Chandler Rivers,Duke,CB,"5'10""",180
116,Malachi Fields,Notre Dame,WR,"6'4""",220
117,Jacob Rodriguez,Texas Tech,ILB,"6'1""",230
118,Ar'Maj Reed-Adams,Texas A&M,OG,"6'5""",330
119,T.J. Hall,Iowa,CB,"6'0""",190
120,Blake Miller,Clemson,OT,"6'5""",315
121,T.J. Guy,Michigan,EDGE,"6'4""",250
122,Kage Casey,Boise State,OT,"6'5""",316
123,Parker Brailsford,Alabama,OC,"6'2""",290
124,Aaron Anderson,LSU,WR,"5'8""",187
125,Beau Stephens,Iowa,OG,"6'5""",315
126,Jalen Huskey,Maryland,S,"6'2""",201
127,Bishop Fitzgerald,USC,S,"5'11""",198
128,Trey Moore,Texas,EDGE,"6'3""",245
129,Oscar Delp,Georgia,TE,"6'5""",245
130,D.J. Campbell,Texas,OG,"6'3""",330
131,Jude Bowry,Boston College,OT,"6'5""",308
132,Josh Moten,Southern Miss,CB,"6'0""",174
133,Eric Rivers,Georgia Tech,WR,"5'11""",174
134,Emmett Johnson,Nebraska,RB,"5'11""",200
135,Drew Shelton,Penn State,OT,"6'5""",307
136,Dae'Quan Wright,Ole Miss,TE,"6'4""",255
137,Jaishawn Barham,Michigan,ILB,"6'3""",248
138,Albert Regis,Texas A&M,DL3T,"6'1""",310
139,J'Mari Taylor,Virginia,RB,"5'9""",204
140,J.C. Davis,Illinois,OT,"6'5""",320
141,C.J. Daniels,Miami (FL),WR,"6'2""",205
142,Aaron Graves,Iowa,DL3T,"6'4""",300
143,Jimmy Rolder,Michigan,ILB,"6'2""",240
144,Jaeden Roberts,Alabama,OG,"6'5""",310
145,DeShon Singleton,Nebraska,S,"6'3""",210
146,Will Lee III,Texas A&M,CB,"6'2""",190
147,Le'Veon Moss,Texas A&M,RB,"5'11""",215
148,Bryce Boettcher,Oregon,ILB,"6'2""",225
149,Taylen Green,Arkansas,QB,"6'6""",230
150,Louis Moore,Indiana,S,"5'11""",200
151,Trey Zuhn III,Texas A&M,OT,"6'6""",315
152,Aiden Fisher,Indiana,ILB,"6'1""",233
153,Collin Wright,Stanford,CB,"6'0""",195
154,Malachi Lawrence,UCF,EDGE,"6'4""",260
155,Ted Hurst,Georgia State,WR,"6'2""",194
156,Chase Roberts,BYU,WR,"6'4""",210
157,Roman Hemby,Indiana,RB,"6'0""",208
158,Kahlil Benson,Indiana,OT,"6'5""",319
159,Justin Joly,NC State,TE,"6'3""",251
160,Stephen Daley,Indiana,EDGE,"6'1""",273
161,Thaddeus Dixon,North Carolina,CB,"6'0""",186
162,Riley Nowakowski,Indiana,TE,"6'2""",249
163,Hezekiah Masses,California,CB,"6'0""",175
164,Isaiah Smith,SMU,EDGE,"6'4""",248
165,Skyler Bell,Connecticut,WR,"6'0""",185
166,Nadame Tucker,Western Michigan,EDGE,"6'3""",250
167,Keanu Tanuvasa,BYU,DL3T,"6'3""",300
168,Ephesians Prysock,Washington,CB,"6'4""",195
169,Josh Cameron,Baylor,WR,"6'1""",218
170,Joe Royer,Cincinnati,TE,"6'4""",255
171,Sawyer Robertson,Baylor,QB,"6'4""",220
172,Bryce Foster,Kansas,OC,"6'4""",330
173,Kyle Louis,Pittsburgh,OLB,"5'11""",225
174,Seth McGowan,Kentucky,RB,"6'1""",215
175,V.J. Payne,Kansas State,S,"6'3""",208
176,Jam Miller,Alabama,RB,"5'10""",221
177,Keylan Rutledge,Georgia Tech,OG,"6'4""",320
178,Terion Stewart,Virginia Tech,RB,"5'9""",222
179,Keyron Crawford,Auburn,EDGE,"6'4""",255
180,Keagen Trost,Missouri,OT,"6'4""",316
181,Colbie Young,Georgia,WR,"6'3""",215
182,Justin Jefferson,Alabama,ILB,"6'1""",225
183,Ethan Burke,Texas,DL5T,"6'6""",259
184,Connor Tollison,Missouri,OC,"6'4""",209
185,Max Iheanachor,Arizona State,OT,"6'5""",325
186,Deven Eastern,Minnesota,DL1T,"6'6""",320
187,Noah Whittington,Oregon,RB,"5'8""",203
188,Zakee Wheatley,Penn State,S,"6'2""",198
189,Tanner Koziol,Houston,TE,"6'6""",237
190,Bryan Thomas Jr.,South Carolina,EDGE,"6'2""",249
191,Jakobe Thomas,Miami (FL),S,"6'2""",200
192,Cam'Ron Stewart,Temple,EDGE,"6'4""",250
193,Chris McClellan,Missouri,DL1T,"6'4""",323
194,Skyler Gill-Howard,Texas Tech,DL5T,"6'1""",290
195,Kaleb Proctor,SE Louisiana,DL5T,"6'3""",280
196,Harrison Wallace III,Ole Miss,WR,"6'1""",200
197,Cameron Ball,Arkansas,DL1T,"6'5""",323
198,Josh Thompson,LSU,OG,"6'5""",301
199,Diego Pavia,Vanderbilt,QB,"6'0""",207
200,Barion Brown,LSU,WR,"6'1""",182
201,Hezekiah Masses,California,CB,"6'0""",175
202,Kelley Jones,Mississippi State,CB,"6'4""",195
203,Trinidad Chambliss,Ole Miss,QB,"6'0""",200
204,Peter Clarke,Temple,TE,"6'6""",265
205,Isaiah Smith,SMU,EDGE,"6'4""",248
206,Skyler Bell,Connecticut,WR,"6'0""",185
207,Nadame Tucker,Western Michigan,EDGE,"6'3""",250
208,Keanu Tanuvasa,BYU,DL3T,"6'3""",300
209,Phillip Daniels,Ohio State,OT,"6'5""",315
210,Ephesians Prysock,Washington,CB,"6'4""",195
211,O'Mega Blake,Arkansas,WR,"6'1""",187
212,Josh Cameron,Baylor,WR,"6'1""",218
213,Joe Royer,Cincinnati,TE,"6'4""",255
214,Earl Little Jr.,Florida State,S,"6'1""",199
215,Sawyer Robertson,Baylor,QB,"6'4""",220
216,Niki Prongos,Stanford,OT,"6'7""",315
217,Ernest Hausmann,Michigan,ILB,"6'2""",235
218,Bryce Foster,Kansas,OC,"6'4""",330
219,Kyle Louis,Pittsburgh,OLB,"5'11""",225
220,C.J. Daniels,Miami (FL),WR,"6'2""",205
221,V.J. Payne,Kansas State,S,"6'3""",208
222,Jam Miller,Alabama,RB,"5'10""",221
223,Matt Gulbin,Michigan State,OC,"6'4""",312
224,Keylan Rutledge,Georgia Tech,OG,"6'4""",320
225,DeAndre Moore Jr.,Texas,WR,"6'0""",195
226,Rodrick Pleasant,UCLA,CB,"5'10""",175
227,Darius Taylor,Minnesota,RB,"5'11""",215
228,Xavier Nwankpa,Iowa,S,"6'2""",215
229,Terion Stewart,Virginia Tech,RB,"5'9""",222
230,Brice Pollock,Texas Tech,CB,"6'0""",195
231,Keyron Crawford,Auburn,EDGE,"6'4""",255
232,Keagen Trost,Missouri,OT,"6'4""",316
233,Colbie Young,Georgia,WR,"6'3""",215
234,Christian Gray,Notre Dame,CB,"6'0""",187
235,Tate Sandell,Oklahoma,PK,"5'9""",182
236,Justin Jefferson,Alabama,ILB,"6'1""",225
237,Isaiah Horton,Alabama,WR,"6'4""",208
238,Ethan Burke,Texas,DL5T,"6'6""",259
239,Evan Stewart,Oregon,WR,"6'0""",175
240,Connor Tollison,Missouri,OC,"6'4""",209
241,Max Iheanachor,Arizona State,OT,"6'5""",325
242,Deven Eastern,Minnesota,DL1T,"6'6""",320
243,Noah Whittington,Oregon,RB,"5'8""",203
244,Zakee Wheatley,Penn State,S,"6'2""",198
245,Tanner Koziol,Houston,TE,"6'6""",237
246,Bryan Thomas Jr.,South Carolina,EDGE,"6'2""",249
247,Jakobe Thomas,Miami (FL),S,"6'2""",200
248,Cam'Ron Stewart,Temple,EDGE,"6'4""",250
249,Chris McClellan,Missouri,DL1T,"6'4""",323
250,Skyler Gill-Howard,Texas Tech,DL5T,"6'1""",290
251,Jalen Catalon,Missouri,S,"5'10""",205
252,Kaleb Proctor,SE Louisiana,DL5T,"6'3""",280
253,Harrison Wallace III,Ole Miss,WR,"6'1""",200
254,Cameron Ball,Arkansas,DL1T,"6'5""",323
255,Josh Gesky,Illinois,OG,"6'4""",335
256,Diego Pavia,Vanderbilt,QB,"6'0""",207
257,Carson Hinzman,Ohio State,OC,"6'5""",300
258,Barion Brown,LSU,WR,"6'1""",182
259,Pat Coogan,Indiana,OC,"6'5""",310
260,Bryson Washington,Baylor,RB,"6'0""",203
261,Keyshaun Elliott,Arizona State,ILB,"6'2""",235
262,Anez Cooper,Miami (FL),OG,"6'5""",350
263,John Nestor,Minnesota,CB,"6'1""",205
264,West Weeks,LSU,ILB,"6'2""",235
265,Charles Demmings,Stephen F Austin,CB,"6'1""",190
266,Will Whitson,Mississippi State,EDGE,"6'5""",295
267,Jalon Kilgore,South Carolina,S,"6'1""",219
268,Kendal Daniels,Oklahoma,S,"6'5""",242
269,Bud Clark,TCU,S,"6'2""",185
270,Logan Fano,Utah,EDGE,"6'5""",260
271,Red Murdock,Buffalo,ILB,"6'3""",235
272,Brandon Cleveland,NC State,DL1T,"6'4""",315
273,Terry Moore,Duke,S,"6'1""",200
274,Brent Austin,Cal,CB,"5'11""",180
275,Dametrious Crownover,Texas A&M,OT,"6'6""",330
276,Wesley Williams,Duke,EDGE,"6'3""",264
277,Jadon Canady,Oregon,CB,"5'10""",185
278,Gary Smith III,UCLA,DL1T,"6'2""",340
279,Rahsul Faison,South Carolina,RB,"6'0""",218
280,Marques White,UMass,EDGE,"6'2""",250
281,Desmond Purnell,Kansas State,ILB,"5'11""",232
282,Kwabena Asamoah,Rutgers,OG,"6'2""",311
283,Ahmari Harvey,Georgia Tech,CB,"6'0""",195
284,Sam Roush,Stanford,TE,"6'5""",260
285,Cyrus Allen,Cincinnati,WR,"5'11""",180
286,Drew Bobo,Georgia,OC,"6'5""",305
287,Mike Washington Jr.,Arkansas,RB,"6'2""",228
288,Reggie Virgil,Texas Tech,WR,"6'3""",190
289,Drayk Bowen,Notre Dame,ILB,"6'2""",239
290,Namdi Obiazor,TCU,OLB,"6'3""",230
291,Sam Hecht,Kansas State,OC,"6'4""",300
292,Tyler Onyedim,Texas A&M,DL5T,"6'3""",295
293,Jaren Kump,Utah,OC,"6'6""",315
294,Nate Boerkircher,Texas A&M,TE,"6'4""",250
295,Kemari Copeland,Virginia Tech,DL5T,"6'2""",280
296,Logan Taylor,Boston College,OG,"6'6""",308
297,Wes Pahl,Oklahoma State,P,"6'5""",205
298,Damari Brown,Miami (FL),CB,"6'1""",190
299,Ryan Baer,Pittsburgh,OT,"6'7""",325
300,Malik Spencer,Michigan State,S,"6'1""",192
301,George Gumbs,Florida,EDGE,"6'4""",250
302,Bryson Eason,Tennessee,DL3T,"6'3""",315
303,Gracen Halton,Oklahoma,DL3T,"6'2""",285
304,Enrique Cruz Jr.,Kansas,OT,"6'6""",320
305,Diego Pounds,Ole Miss,OT,"6'6""",340
306,Adam Randall,Clemson,RB,"6'2""",235
307,Nick Dawkins,Penn State,OC,"6'3""",298
308,Owen Heinecke,Oklahoma,ILB,"6'1""",227
309,Luke Montgomery,Ohio State,OG,"6'5""",312
310,James Thompson Jr.,Illinois,DL3T,"6'5""",310
311,Kody Huisman,Virginia Tech,DL1T,"6'3""",297
312,Preston Zachman,Wisconsin,S,"6'1""",212
313,Miller Moss,Louisville,QB,"6'2""",205
314,Kevin Cline,Boston College,OT,"6'6""",323
315,Eric Gentry,USC,OLB,"6'5""",215
316,James Neal,Iowa State,OT,"6'5""",325
317,Nolan Rucci,Penn State,OT,"6'7""",308
318,Tellek Lockette,Texas State,OG,"6'3""",327
319,Jack Pyburn,LSU,EDGE,"6'4""",264
320,Dallen Bentley,Utah,TE,"6'4""",259
321,Febechi Nwaiwu,Oklahoma,OG,"6'4""",339
322,Mason Reiger,Wisconsin,EDGE,"6'5""",248
323,Wesley Bailey,Louisville,EDGE,"6'5""",265
324,Jalen Walthall,Incarnate Word,WR,"6'2""",180
325,Jeremiah Wright,Auburn,OG,"6'4""",348
326,Bryce Lance,North Dakota State,WR,"6'2""",204
327,Kobe Baynes,Kansas,OG,"6'4""",315
328,Joey Aguilar,Tennessee,QB,"6'3""",225
329,Karon Prunty,Wake Forest,CB,"6'2""",192
330,Cian Slone,NC State,EDGE,"6'4""",252
331,Nick Barrett,South Carolina,DL1T,"6'2""",322
332,Nic Anderson,LSU,WR,"6'4""",216
333,Landon Robinson,Navy,DL5T,"6'0""",287
334,Jacob De Jesus,Cal,WR,"5'7""",170
335,Andre Fuller,Toledo,CB,"6'2""",202
336,Vincent Anthony,Duke,EDGE,"6'6""",250
337,Chris Adams,Memphis,OT,"6'5""",290
338,Jeff Caldwell,Cincinnati,WR,"6'5""",215
339,Omar Aigbedion,Baylor,OG,"6'2""",310
340,Seydou Traore,Mississippi State,TE,"6'4""",235
341,Micah Morris,Georgia,OG,"6'4""",330
342,Josh Cuevas,Alabama,TE,"6'3""",256
343,Trey Smack,Florida,PK,"6'1""",202
344,Nyjalik Kelly,UCF,EDGE,"6'5""",265
345,Dan Villari,Syracuse,TE,"6'4""",245
346,Jalon Daniels,Kansas,QB,"6'0""",220
347,Toriano Pride Jr.,Missouri,CB,"5'10""",190
348,J'Mond Tapp,Southern Mississippi,EDGE,"6'3""",275
349,Tommy Doman,Florida,P,"6'4""",215
350,Trey White,San Diego State,EDGE,"6'2""",245
351,Dillon Wade,Auburn,OG,"6'3""",315
352,Kansei Matsuzawa,Hawaii,PK,"6'2""",200
353,Chip Trayanum,Toledo,RB,"5'11""",227
354,Gafa Faga,San Jose State,DL3T,"6'2""",304
355,Rene Konga,Louisville,DL5T,"6'4""",300
356,Kam Dewberry,Alabama,OG,"6'4""",332
357,Carver Willis,Washington,OT,"6'5""",291
358,Cole Payton,North Dakota State,QB,"6'3""",233
359,Romello Brinson,SMU,WR,"6'2""",190
360,Caden Barnett,Wyoming,OG,"6'5""",320
361,Fernando Carmona Jr.,Arkansas,OG,"6'5""",322
362,Henry Lutovsky,Nebraska,OG,"6'6""",320
363,Malachi Lawrence,UCF,EDGE,"6'4""",260
364,Caden Fordham,NC State,OLB,"6'1""",230
365,Treydan Stukes,Arizona,CB,"6'2""",200
366,Seth McGowan,Kentucky,RB,"6'1""",215
367,Jacob Thomas,James Madison,S,"6'1""",212
368,Isaiah Jatta,BYU,OT,"6'6""",315
369,Kahlil Saunders,Kentucky,DL3T,"6'4""",293
370,Aamil Wagner,Notre Dame,OT,"6'6""",291
371,D.J. Rogers,TCU,TE,"6'4""",250
372,Nick Andersen,Wake Forest,S,"5'11""",197
373,Al'Zillion Hamilton,Fresno State,CB,"5'11""",185
374,Knijeah Harris,Florida,OG,"6'2""",316
375,DeCarlos Nicholson,USC,CB,"6'3""",200
376,Noah Thomas,Georgia,WR,"6'5""",200
377,Micah Davey,UTEP,ILB,"6'2""",235
378,Anthony Hankerson,Oregon State,RB,"5'8""",203
379,Caleb Douglas,Texas Tech,WR,"6'4""",205
380,Jack Kelly,BYU,OLB,"6'2""",242
381,Sebastian Harsh,NC State,EDGE,"6'3""",263
382,Caullin Lacy,Louisville,WR,"5'10""",190
383,Gunner Stockton,Georgia,QB,"6'1""",215
384,Emmanuel Henderson,Kansas,WR,"6'1""",190
385,Tyre West,Tennessee,DL5T,"6'3""",290
386,Xavian Sorey Jr.,Arkansas,OLB,"6'3""",225
387,Lake McRee,USC,TE,"6'4""",250
388,Dalton Johnson,Arizona,S,"5'11""",198
389,Damonte Smith,Middle Tennessee State,DL3T,"6'1""",301
390,Eli Raridon,Notre Dame,TE,"6'7""",252
391,John Michael Gyllenborg,Wyoming,TE,"6'5""",251
392,Cole Wisniewski,Texas Tech,S,"6'3""",218
393,Davion Carter,Texas Tech,OG,"6'0""",295
394,Princewill Umanmielen,Ole Miss,EDGE,"6'4""",245
395,Desmond Reid,Pittsburgh,RB,"5'8""",175
396,Brylan Green,Liberty,S,"5'9""",180
397,Michael Heldman,Central Michigan,EDGE,"6'4""",260
398,Kaleb Elarms-Orr,TCU,OLB,"6'2""",230
399,Clayton Smith,Arizona State,EDGE,"6'4""",245
400,David Gusta,Kentucky,DL3T,"6'3""",302
401,Joe Fagnano,UConn,QB,"6'4""",225
402,Markis Deal,TCU,DL1T,"6'4""",325
403,Malcolm DeWalt IV,Akron,CB,"6'2""",190
404,Luke Lindenmeyer,Nebraska,TE,"6'3""",250
405,Eli Heidenreich,Navy,WR,"6'0""",206
406,Geno VanDeMark,Alabama,OG,"6'5""",326
407,Clay Patterson,Stanford,EDGE,"6'3""",280
408,Star Thomas,Tennessee,RB,"6'0""",210
409,Jaylon Guilbeau,Texas,CB,"6'0""",183
410,DeVonta Smith,Notre Dame,CB,"6'0""",205
411,Jayden Bellamy,UCF,CB,"6'1""",180
412,Eddie Walls III,Houston,EDGE,"6'4""",250
413,Brett Thorson,Georgia,P,"6'2""",235
414,Nathan Voorhis,Ball State,EDGE,"6'3""",247
415,Dane Key,Nebraska,WR,"6'2""",210
416,Karson Sharar,Iowa,ILB,"6'2""",235
417,Rasheed Miller,Louisville,OT,"6'7""",310
418,Ryan Davis,Utah,WR,"5'10""",180
419,Evan Beerntsen,Northwestern,OG,"6'3""",310
420,Maverick Baranowski,Minnesota,ILB,"6'2""",230
421,Keyshawn James-Newby,New Mexico,EDGE,"6'2""",244
422,Tomas Rimac,Virginia Tech,OG,"6'6""",318
423,Skyler Thomas,Oregon State,S,"6'2""",212
424,Gabriel Benyard,Kennesaw State,WR,"5'10""",185
425,Bruno Fina,Duke,OT,"6'5""",305
426,Vinny Anthony II,Wisconsin,WR,"6'0""",190
427,Jaidyn Denis,Memphis,CB,"6'2""",191
428,Gabriel Brownlow-Dindy,South Carolina,DL1T,"6'3""",315
429,Jamal Haynes,Georgia Tech,RB,"5'9""",190
430,Cam Rice,Maryland,DL3T,"6'2""",303
431,Devin Bale,Arkansas,P,"6'3""",205
432,Christian Alliegro,Wisconsin,ILB,"6'4""",240
433,Tyler Duzansky,Penn State,LS,"6'4""",225
434,Alan Herron,Maryland,OL,"6'6""",320
435,Mohamed Toure,Miami (FL),ILB,"6'1""",236
436,Kobe Prentice,Baylor,WR,"5'10""",188
437,Kentrel Bullock,South Alabama,RB,"5'10""",205
438,Quintayvious Hutchins,Boston College,EDGE,"6'2""",242
439,Lance Heard,Tennessee,OT,"6'5""",340
440,Jayven Williams,Mississippi State,CB,"6'1""",185
441,Latrell McCutchin Sr.,Houston,CB,"6'1""",185
442,Brenen Thompson,Mississippi State,WR,"5'9""",170
443,Jalen McMurray,Tennessee,CB,"6'0""",187
444,Tyreek Chappell,Texas A&M,CB,"5'10""",185
445,Robert Henry Jr.,UTSA,RB,"5'9""",205
446,Max Tomczak,Youngstown State,WR,"6'0""",195
447,Daylan Carnell,Missouri,S,"6'2""",225
448,Gus Zilinskas,Rutgers,OC,"6'2""",305
449,Wade Woodaz,Clemson,OLB,"6'3""",235
450,McKale Boley,Virginia,OT,"6'4""",302
451,Isaiah Nwokobia,SMU,S,"6'1""",202
452,Cole Maynard,Western Kentucky,P,"6'1""",180
453,Mac Harris,South Florida,OLB,"6'0""",235
454,Jeffrey M'Ba,SMU,DL3T,"6'5""",312
455,Aidan Laros,Kentucky,P,"6'2""",218
456,Jaren Kanak,Oklahoma,TE,"6'2""",233
457,Howard Sampson,Texas Tech,OT,"6'8""",325
458,Garrett DiGiorgio,UCLA,OT,"6'7""",320
459,Paul Rubelt,UCF,OT,"6'9""",330
460,Carlos Allen Jr.,Houston,DL3T,"6'1""",295
461,Josh Kattus,Kentucky,TE,"6'4""",247
462,Ryan Eckley,Michigan State,P,"6'2""",207
463,Kalil Alexander,Texas State,EDGE,"6'3""",225
464,Laith Marjan,Kansas,PK,"6'2""",210
465,Dreyden Norwood,Missouri,CB,"6'0""",187
466,Eric McAlister,TCU,WR,"6'3""",205
467,Chamon Metayer,Arizona State,TE,"6'4""",255
468,Ethan Onianwa,Ohio State,OG,"6'6""",345
469,Jager Burton,Kentucky,OC,"6'3""",316
470,D.J. Harvey,USC,CB,"5'11""",174
471,Avery Smith,Toledo,CB,"5'10""",185
472,Max Bredeson,Michigan,FB,"6'1""",250
473,Ahmaad Moses,SMU,S,"5'10""",200
474,Austin Leausa,BYU,OG,"6'5""",315
475,Keeshawn Silver,USC,DL1T,"6'4""",330
476,Riley Mahlman,Wisconsin,OT,"6'7""",308
477,Davon Booth,Mississippi State,RB,"5'9""",205
478,Phillip Dunnam,UCF,S,"6'1""",195
479,De'Shawn Rucker,USF,CB,"6'0""",195
480,Jeremiah Wilson,Florida State,CB,"5'10""",185
481,Dasan McCullough,Nebraska,EDGE,"6'4""",235
482,Matthew Hibner,SMU,TE,"6'4""",252
483,Cameron Calhoun,Alabama,CB,"6'0""",177
484,Jaden Craig,Harvard,QB,"6'2""",230
485,Dominic Bailey,Tennessee,DL5T,"6'3""",292
486,Aidan Hubbard,Northwestern,EDGE,"6'4""",255
487,Tony Grimes,Purdue,CB,"6'1""",190
488,Jackson Carsello,Northwestern,OC,"6'4""",300
489,Luke Basso,Oregon,LS,"6'3""",220
490,D.J. Hicks,Texas A&M,DL3T,"6'3""",295
491,Trebor Pena,Syracuse,WR,"5'11""",184
492,Avery Johnson,Kansas State,QB,"6'2""",196
493,Jason Henderson,Old Dominion,ILB,"6'1""",225
494,Junior Vandeross III,Toledo,WR,"5'8""",182
495,Jackie Marshall,Baylor,DL5T,"6'3""",290
496,Nasir Bowers,Toledo,CB,"5'9""",182
497,Hero Kanu,Texas,DL3T,"6'4""",305
498,Gavin Gerhardt,Cincinnati,OC,"6'4""",310
499,Ben Bell,Virginia Tech,EDGE,"6'2""",255
500,Bangally Kamara,Kansas,LB,"6'2""",235`;

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
