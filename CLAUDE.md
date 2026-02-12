# Claude Code Rules

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately - don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user: update 'tasks/lessons.md' with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes - don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests -> then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

## Task Management
1. **Plan First**: Write plan to 'tasks/todo.md' with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review to 'tasks/todo.md'
6. **Capture Lessons**: Update 'tasks/lessons.md' after corrections

## Core Principles
- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.

---

# Project Reference

## Commands
- `npm run dev` - Dev server (http://localhost:5173)
- `npm run build` - Production build to dist/
- `npm run lint` - ESLint check
- Windows environment - use forward slashes in bash paths

## Tech Stack
- React 19.2, Vite 7, React Router DOM 7
- Supabase (Auth + DB) for cloud persistence
- Dark theme only, CSS custom properties (no Tailwind)

## Architecture

### Entry Flow
`main.jsx` → `AuthProvider` (outermost) → `App.jsx` (Router + useBoard) → Pages

### Key Patterns
- **useBoard** (`src/hooks/useBoard.js`): Central board state. Abstracts localStorage (guest) vs Supabase (auth). Stores prospect IDs, resolves via `getProspectById()`. Debounced 2s auto-save.
- **AuthContext** (`src/context/AuthContext.jsx`): Supabase auth with email/password + Google OAuth. Creates user profile on signup.
- **Board data**: Normalized as ID arrays. `myBoard` prop drilled from App to pages.

### Routes
| Route | Page | Purpose |
|-------|------|---------|
| `/` | Home | Landing, top 8 prospects |
| `/prospects` | ProspectsList | Browse 500 prospects, filter/sort/paginate |
| `/player/:id` | PlayerDetail | Full player profile + stats |
| `/my-board` | MyBoard | Custom board, drag reorder, sharing |
| `/mock-draft` | MockDraft | Draft simulator with CPU AI |
| `/team-needs` | TeamNeeds | NFL team needs by division |
| `/login` | Login | Auth login |
| `/register` | Register | Signup + local board migration |
| `/shared/:slug` | SharedBoard | Public shared board |

### Data Files (`src/data/`)
- `prospects.js` - 500 prospects, `getProspectById(id)`, `positions` array, position ranks
- `draftOrder.js` - Draft order, `teamNeeds`, `teamColors`, `allTeams`, `roundInfo`
- `customBigBoard.js` - Mr Lutz's custom rankings
- `playerNotes.js` - Scouting reports by position
- `playerStats.json` - Season statistics
- `nflLogos.js` / `collegeLogos.js` - Logo mappings via `import.meta.url`
- `collegeColors.js` - College hex colors for styling

### Mock Draft Simulator
- `evaluatePick()` scores on: board position (BPA), team need fit, positional value, reach penalty
- Special cases for picks 1-6 (Raiders lock Mendoza, Jets no OL, Cardinals no RB, Browns offense-only)
- CPU sliders: Randomness (variance), Team Needs Weight (BPA vs needs)
- 3 boards: Consensus, Mr Lutz's, Custom (user's My Board)

### Components (`src/components/`)
- `Navbar` - Top nav with mobile hamburger menu
- `Hero` - Landing page hero section
- `PlayerCard` - Reusable prospect card (rank, college, position, measurables)
- `PlayerModal` - Detailed player popup with prev/next navigation
- `SearchFilter` - Search bar + position filter
- `AdvancedFilterModal` - Filter by physical attributes & stats
- `UserMenu` - Auth dropdown (profile, logout)
- `SyncStatus` - Board save status indicator

## Style Rules (see STYLE_GUIDE.md)
- Remove clutter: no unnecessary headers, titles, lines
- Color discipline: constrain colors so they carry meaning
- Dark theme only. CSS variables in `index.css`
- No emojis. Lucide icons only, sparingly
- Minimal animation. Prefer none
- Viewport is the container. Content fills it
- Code removal: remove usage first, then imports

### CSS Variables
```
--bg-primary: #060606      --text-primary: #e8e8e8
--bg-secondary: #0c0c0c    --text-secondary: #777777
--bg-card: #111111          --text-muted: #444444
--bg-card-hover: #181818    --accent-primary: #3b82f6
--border-color: #1e1e1e     --accent-gold: #e2e2e2
```
Spacing: `--spacing-xs` (4px) through `--spacing-2xl` (48px)
Radius: `--radius-sm` (4px) through `--radius-xl` (16px)
Container max: 1400px. Breakpoints: 599px, 768px, 1024px
