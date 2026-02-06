# NFL Draft Guide 2026 - Project Context

## Overview
A React + Vite application for tracking and ranking 2026 NFL Draft prospects. Features a dark NFL-themed design with prospect rankings, player detail pages, mock draft simulator, and custom big board builder.

## Tech Stack
- **React 18** - Functional components with hooks (useState, useMemo, useEffect, useRef, useCallback)
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **CSS Custom Properties** - Dark theme styling with gold accent (#ffb612)
- **localStorage** - Persists user's custom board

## Project Structure
```
nfl-draft-guide/
├── src/
│   ├── components/
│   │   ├── Hero.jsx/css        # Landing page hero section
│   │   ├── Navbar.jsx/css      # Navigation bar
│   │   ├── PlayerCard.jsx/css  # Horizontal player row with college logo
│   │   └── SearchFilter.jsx/css # Search and filter controls
│   ├── pages/
│   │   ├── Home.jsx/css        # Main landing page with 4x4 position grid
│   │   ├── ProspectsList.jsx/css # Big board with board toggle
│   │   ├── PlayerDetail.jsx/css  # Individual player page with college logo
│   │   ├── MyBoard.jsx/css     # User's custom board builder
│   │   └── MockDraft.jsx/css   # 7-Round Mock Draft Simulator
│   ├── data/
│   │   ├── prospects.js        # 500 prospects with position consolidation
│   │   ├── draftOrder.js       # All 7 rounds + team needs from PFF
│   │   ├── customBigBoard.js   # Mr Lutz's custom rankings
│   │   ├── collegeLogos.js     # College name to logo mapping
│   │   └── logos/              # D1 FBS team logo PNGs
│   ├── App.jsx                 # Main app with routing
│   ├── App.css
│   ├── index.css               # Global styles and theme
│   └── main.jsx                # Entry point
├── index.html
└── package.json
```

## Key Features

### 1. Prospect Data (`src/data/prospects.js`)
- **500 prospects** compiled from NFL.com, ESPN, PFF, Tankathon
- Each player has: id, name, position, college, projectedRound, height, weight, notes, class, stats, strengths, weaknesses, summary
- **Position Consolidation:**
  - DL1T, DL3T, DL5T → DL (technique stored in `notes` field)
  - ILB, OLB → LB
  - OL → OG
- Positions dynamically extracted from data

### 2. College Logos (`src/data/collegeLogos.js` + `src/data/logos/`)
- All D1 FBS team logos included as PNGs
- `getCollegeLogo(collegeName)` function maps college names to logo files
- Handles variations (e.g., "Miami (FL)" → miami.png, "Texas A&M" → texas-a-m.png)
- Uses Vite's `import.meta.glob` for dynamic loading

### 3. Home Page (`src/pages/Home.jsx`)
- Hero section with title "NFL Draft Guide 2026"
- Quick actions section: Consensus Big Board, Build Your Board, Search Players
- Top 8 prospects preview
- **Position breakdown grid (4x4 layout)**
- Data sources links

### 4. Big Board (`src/pages/ProspectsList.jsx`)
- **Board Toggle:** "Mr Lutz's Board" (primary) vs "Consensus Board"
- Horizontal list layout (1 player per row)
- Search by name/college
- Filter by position, school, projected round
- Add/remove players from custom board
- Custom board rankings defined in `src/data/customBigBoard.js`

### 5. Player Card (`src/components/PlayerCard.jsx`)
- Horizontal layout showing: rank, **college logo**, name/college, position badge, height/weight
- **Removed:** class year column, projected round column
- **Position badges:** All use gold (#ffb612) background with black text
- Clicking card navigates to player detail page

### 6. Player Detail (`src/pages/PlayerDetail.jsx`)
- Full player profile with stats
- **College logo** displayed next to college name
- Strengths/Weaknesses sections
- Draft projection
- Add to board functionality
- Prev/Next navigation

### 7. My Board (`src/pages/MyBoard.jsx`)
- Drag-and-drop reordering
- Move up/down buttons
- Persists to localStorage
- Clear board option

### 8. Mock Draft Simulator (`src/pages/MockDraft.jsx`)
- **7-Round Draft:** Select 1-7 rounds to simulate (cumulative picks)
- **Team Selection:** Control any combination of 32 NFL teams
- **CPU Settings:**
  - **Randomness Slider (0-100%):** Controls variance in CPU picks
  - **Team Needs Weight (0-100%):** Balance between BPA and team needs
- **Auto-Simulation:** CPU picks animate with 150ms delay between picks
- **Trade System:** Swap picks between user and CPU teams
- **Player Selection:**
  - Clicking player row → opens player profile
  - "Draft" button → drafts the player
- **Layout:** Selection panel (left/main) + Draft board sidebar (right)
- **Team Colors:** Official primary/secondary colors for all 32 teams
- **Team Needs:** From PFF 2026 analysis in `draftOrder.js`

### 9. Custom Big Board (`src/data/customBigBoard.js`)
```javascript
export const customBigBoardRankings = [
  // Add player IDs in preferred order
  // 5,   // Your #1 = Consensus #5
  // 1,   // Your #2 = Consensus #1
];
export const customBoardName = "Mr Lutz's Board";
export const customPlayerNotes = {};
```

## Routes
- `/` - Home page
- `/prospects` - Big Board (all prospects)
- `/player/:id` - Individual player detail
- `/my-board` - User's custom board builder
- `/mock-draft` - Mock Draft Simulator

## Styling
- **Theme:** Dark background with gold (#ffb612) accents
- **Position Badges:** Uniform gold background (#ffb612) with black text
- **Team Colors:** Defined in `draftOrder.js` teamColors object

## Data Sources
- [NFL.com - Daniel Jeremiah's Top 50](https://www.nfl.com/news/daniel-jeremiah-s-top-50-2026-nfl-draft-prospect-rankings-1-0)
- [ESPN - Mel Kiper's Big Board](https://www.espn.com/nfl/draft2026/story/_/id/46573669/2026-nfl-draft-rankings-mel-kiper-big-board-top-prospects-players-positions)
- [PFF Big Board & Team Needs](https://www.pff.com/draft/big-board)
- [Tankathon](https://www.tankathon.com/nfl/big_board)

## Running the App
```bash
cd nfl-draft-guide
npm install
npm run dev
```

Dev server runs on http://localhost:5173 (or next available port)

## GitHub Repository
https://github.com/matthewlutz/draft_website.git

## Future Considerations
- **Database needed** for multi-user custom boards (Supabase or Firebase recommended)
- Currently localStorage only persists on single browser/device
- Mr Lutz's Board is static in code - edit `customBigBoard.js` to update rankings
