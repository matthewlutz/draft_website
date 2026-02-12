// Matt's Custom Big Board Rankings
// Format: Array of player slug IDs in your preferred order
// Named picks from Big Board.md, gaps filled with best remaining consensus

export const customBigBoardRankings = [
  'francis-mauigoa',           // 1. Francis Mauigoa, Miami (FL)
  'sonny-styles',              // 2. Sonny Styles, Ohio State
  'caleb-downs',               // 3. Caleb Downs, Ohio State
  'jeremiyah-love',            // 4. Jeremiyah Love, Notre Dame
  'david-bailey',              // 5. David Bailey, Texas Tech
  'peter-woods',               // 6. Peter Woods, Clemson
  'mansoor-delane',            // 7. Mansoor Delane, LSU
  'carnell-tate',              // 8. Carnell Tate, Ohio State
  'rueben-bain-jr',            // 9. Rueben Bain Jr., Miami (FL)
  'jordyn-tyson',              // 10. Jordyn Tyson, Arizona State
  'arvell-reese',              // 11. Arvell Reese, Ohio State
  'makai-lemon',               // 12. Makai Lemon, USC
  'kenyon-sadiq',              // 13. Kenyon Sadiq, Oregon
  'fernando-mendoza',          // 14. Fernando Mendoza, Indiana
  'kevin-concepcion',          // 15. Kevin Concepcion, Texas A&M
  'keldric-faulk',             // 16. Keldric Faulk, Auburn
  'spencer-fano',              // 17. Spencer Fano, Utah
  'olaivavega-ioane',          // 18. Olaivavega Ioane, Penn State
  'tj-parker',                 // 19. T.J. Parker, Clemson
  'jermod-mccoy',              // 20. Jermod McCoy, Tennessee
  'denzel-boston',              // 21. Denzel Boston, Washington
  'kadyn-proctor',             // 22. Kadyn Proctor, Alabama
  'caleb-lomu',                // 23. Caleb Lomu, Utah
  'cj-allen',                  // 24. C.J. Allen, Georgia
  'kayden-mcdonald',           // 25. Kayden McDonald, Ohio State
  'lee-hunter',                // 26. Lee Hunter, Texas Tech
  'avieon-terrell',            // 27. Avieon Terrell, Clemson
  'ty-simpson',                // 28. Ty Simpson, Alabama
  'caleb-banks',               // 29. Caleb Banks, Florida
  'chris-johnson',             // 30. Chris Johnson, San Diego State
  'keith-abney-ii',            // 31. Keith Abney II, Arizona State
  'cashius-howell',            // 32. Cashius Howell, Texas A&M
  'brandon-cisse',             // 33. Brandon Cisse, South Carolina
  'monroe-freeling',           // 34. Monroe Freeling, Georgia
  'emmanuel-mcneil-warren',    // 35. Emmanuel McNeil-Warren, Toledo
  'colton-hood',               // 36. Colton Hood, Tennessee
  'anthony-hill-jr',           // 37. Anthony Hill Jr., Texas
  'emmanuel-pregnon',          // 38. Emmanuel Pregnon, Oregon
  'dillon-thieneman',          // 39. Dillon Thieneman, Oregon
  'akheem-mesidor',            // 40. Akheem Mesidor, Miami (FL)
  'blake-miller',              // 41. Blake Miller, Clemson
  'r-mason-thomas',            // 42. R Mason Thomas, Oklahoma
  'derrick-moore',             // 43. Derrick Moore, Michigan
  'christen-miller',           // 44. Christen Miller, Georgia
  'chris-bell',                // 45. Chris Bell, Louisville
  'zion-young',                // 46. Zion Young, Missouri
  'gennings-dunker',           // 47. Gennings Dunker, Iowa
  'zachariah-branch',          // 48. Zachariah Branch, Georgia
  'dangelo-ponds',             // 49. D'Angelo Ponds, Indiana
  'germie-bernard',            // 50. Germie Bernard, Alabama
  'max-iheanachor',            // 51. Max Iheanachor, Arizona State
  'aj-haulcy',                 // 52. A.J. Haulcy, LSU
  'jake-golday',               // 53. Jake Golday, Cincinnati
  'chris-brazzell-ii',         // 54. Chris Brazzell II, Tennessee
  'caleb-tiernan',             // 55. Caleb Tiernan, Northwestern
  'keionte-scott',             // 56. Keionte Scott, Miami (FL)
  'jadarian-price',            // 57. Jadarian Price, Notre Dame
  'kamari-ramsey',             // 58. Kamari Ramsey, USC
  'elijah-sarratt',            // 59. Elijah Sarratt, Indiana
  'omar-cooper-jr',            // 60. Omar Cooper Jr., Indiana
  'connor-lew',                // 61. Connor Lew, Auburn
  'chase-bisontis',            // 62. Chase Bisontis, Texas A&M
  'gabe-jacas',                // 63. Gabe Jacas, Illinois
  'max-klare',                 // 64. Max Klare, Ohio State
  'deontae-lawson',            // 65. Deontae Lawson, Alabama
  'joshua-josephs',            // 66. Joshua Josephs, Tennessee
  'isaiah-world',              // 67. Isaiah World, Oregon
  'josiah-trotter',            // 68. Josiah Trotter, Missouri
  'domonique-orange',          // 69. Domonique Orange, Iowa State
  'jakobi-lane',               // 70. Ja'Kobi Lane, USC
  'malachi-fields',            // 71. Malachi Fields, Notre Dame
  'jacob-rodriguez',           // 72. Jacob Rodriguez, Texas Tech
  'antonio-williams',          // 73. Antonio Williams, Clemson
  'eli-stowers',               // 74. Eli Stowers, Vanderbilt
  'romello-height',            // 75. Romello Height, Texas Tech
  'trinidad-chambliss',        // 76. Trinidad Chambliss, Ole Miss
  'julian-neal',               // 77. Julian Neal, Arkansas
  'dani-dennis-sutton',        // 78. Dani Dennis-Sutton, Penn State
  'darrell-jackson-jr',        // 79. Darrell Jackson Jr., Florida State
  'jonah-coleman',             // 80. Jonah Coleman, Washington
  'michael-trigg',             // 81. Michael Trigg, Baylor
  'jake-slaughter',            // 82. Jake Slaughter, Florida
  'emmett-johnson',            // 83. Emmett Johnson, Nebraska
  'davison-igbinosun',         // 84. Davison Igbinosun, Ohio State
  'anthony-lucas',             // 85. Anthony Lucas, USC
  'clayton-smith',             // 86. Clayton Smith, Arizona State
  'chandler-rivers',           // 87. Chandler Rivers, Duke
  'deion-burks',               // 88. Deion Burks, Oklahoma
  'austin-barber',             // 89. Austin Barber, Florida
  'malik-muhammad',            // 90. Malik Muhammad, Texas
  'carson-beck',               // 91. Carson Beck, Miami (FL)
  'will-lee-iii',              // 92. Will Lee III, Texas A&M
  'treydan-stukes',            // 93. Treydan Stukes, Arizona
  'devin-moore',               // 94. Devin Moore, Florida
  'taurean-york',              // 95. Taurean York, Texas A&M
  'nick-singleton',            // 96. Nick Singleton, Penn State
  'jack-endries',              // 97. Jack Endries, Texas
  'skyler-bell',               // 98. Skyler Bell, Connecticut
  'lt-overton',                // 99. L.T. Overton, Alabama
  'dontay-corleone',           // 100. Dontay Corleone, Cincinnati
];

// Your board name (displayed in the UI)
export const customBoardName = "Mr Lutz's Board";
