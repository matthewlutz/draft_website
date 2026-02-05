# NFL Draft Guide 2026 - Project Context

## Overview
A React + Vite application for tracking and ranking 2026 NFL Draft prospects. Features a dark NFL-themed design with prospect rankings, player detail pages, and a custom big board builder.

## Tech Stack
- **React 18** - Functional components with hooks
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **CSS Custom Properties** - Dark theme styling
- **localStorage** - Persists user's custom board

## Project Structure
```
nfl-draft-guide/
├── src/
│   ├── components/
│   │   ├── Hero.jsx/css        # Landing page hero section
│   │   ├── Navbar.jsx/css      # Navigation bar
│   │   ├── PlayerCard.jsx/css  # Horizontal player row component (PFF-style)
│   │   └── SearchFilter.jsx/css # Search and filter controls
│   ├── pages/
│   │   ├── Home.jsx/css        # Main landing page
│   │   ├── ProspectsList.jsx/css # Big board list view
│   │   ├── PlayerDetail.jsx/css  # Individual player page
│   │   ├── MyBoard.jsx/css     # User's custom board builder
│   │   └── MockDraft.jsx/css   # Mock Draft Simulator
│   ├── data/
│   │   ├── prospects.js        # Prospects with stats
│   │   └── draftOrder.js       # 2026 first round order + team colors
│   ├── App.jsx                 # Main app with routing
│   ├── App.css
│   ├── index.css               # Global styles and theme
│   └── main.jsx                # Entry point
├── index.html
└── package.json
```

## Key Features

### 1. Prospect Data (`src/data/prospects.js`)
- 100 prospects compiled from NFL.com, ESPN, PFF, Tankathon
- Each player has: id, name, position, college, projectedRound, height, weight, class, stats, strengths (empty), weaknesses (empty), summary, **teamLogo** (empty)
- No player comparisons - these were removed

### 2. Home Page (`src/pages/Home.jsx`)
- Hero section with title "NFL Draft Guide 2026"
- **Quick actions section (FIRST after hero)**: Consensus Big Board, Build Your Board, Search Players
- Top 8 prospects preview (horizontal list layout)
- Position breakdown grid
- Data sources links

### 3. Big Board (`src/pages/ProspectsList.jsx`)
- **Horizontal list layout** (1 player per row, PFF-style)
- Search by name/college
- Filter by position, school, projected round
- Add/remove players from custom board

### 4. Player Card (`src/components/PlayerCard.jsx`)
- **Horizontal layout** showing: rank, team logo placeholder, name/college, position badge, height/weight, class, projected round, add button
- Team logo area included (shows placeholder icon when empty)
- Mobile responsive - hides some columns on smaller screens

### 5. Player Detail (`src/pages/PlayerDetail.jsx`)
- Full player profile with stats
- Strengths/Weaknesses sections (empty for manual entry)
- Draft projection
- Add to board functionality
- Prev/Next navigation
- **No player comparison field**

### 6. My Board (`src/pages/MyBoard.jsx`)
- Drag-and-drop reordering
- Move up/down buttons
- Persists to localStorage
- Clear board option
- **No comparison display**

### 7. Mock Draft Simulator (`src/pages/MockDraft.jsx`)
- **Team Selection**: Users can select any of the 32 NFL teams to control (1-32 teams)
- **First Round Order**: 32 picks based on 2026 draft order from Tankathon/ESPN
- **Sorting**: Players sorted by user's custom board (if exists) or consensus big board
- **Search/Filter**: Search by player name, filter by position
- **CPU Auto-Pick**: AI drafts based on team needs (from `draftOrder.js`)
- **Sim to My Pick**: Fast-forward through CPU picks to next user-controlled pick
- **Team Colors**: Each team styled with official primary/secondary colors
- **Data Source**: `src/data/draftOrder.js` contains `firstRoundOrder` array and `teamColors` object

## Recent Changes (Latest Session)
1. Moved quick actions section above top prospects on home page
2. Removed "scroll to explore" indicator from hero
3. **Removed all player comparisons** from data and UI
4. **Changed player cards from grid (4 per row) to horizontal rows (1 per row)** - PFF style
5. Added `teamLogo` field to all prospects (empty placeholder)
6. Added team logo display area in player cards (shows placeholder SVG when empty)
7. **Built Mock Draft Simulator** (`/mock-draft` route):
   - Team selection grid with Select All / Clear All buttons
   - First round order with all 32 picks and team needs
   - User-controlled picks with player search and position filter
   - CPU auto-pick based on team needs
   - "Sim to My Pick" to fast-forward CPU picks
   - Team colors for styling throughout
   - Created `src/data/draftOrder.js` with draft order and team colors

## Data Sources
- [NFL.com - Daniel Jeremiah's Top 50](https://www.nfl.com/news/daniel-jeremiah-s-top-50-2026-nfl-draft-prospect-rankings-1-0)
- [ESPN - Mel Kiper's Big Board](https://www.espn.com/nfl/draft2026/story/_/id/46573669/2026-nfl-draft-rankings-mel-kiper-big-board-top-prospects-players-positions)
- [PFF Big Board](https://www.pff.com/draft/big-board)
- [Tankathon](https://www.tankathon.com/nfl/big_board)

## Routes
- `/` - Home page
- `/prospects` - Big Board (all prospects)
- `/player/:id` - Individual player detail
- `/my-board` - User's custom board builder
- `/mock-draft` - Mock Draft Simulator

## TODO / Empty Fields to Fill
- `strengths` array for each prospect in `src/data/prospects.js`
- `weaknesses` array for each prospect in `src/data/prospects.js`
- `teamLogo` path for each prospect - add images to `public/` folder and set path like `/logos/ohio-state.png`

## Running the App
```bash
cd nfl-draft-guide
npm install
npm run dev
```

Dev server runs on http://localhost:5173 (or next available port)

## Adding Team Logos
1. Add logo images to `public/logos/` folder (e.g., `ohio-state.png`, `alabama.png`)
2. Update player's `teamLogo` field in `src/data/prospects.js` to the path (e.g., `/logos/ohio-state.png`)
3. The PlayerCard component will automatically display the image instead of the placeholder
