# Malifaux Stash - AI Assistant Handover Prompt

## Quick Context
I'm building "Malifaux Stash" - a community platform for Malifaux miniature collectors to manage collections, share painted miniatures, and discover others' work. Think Letterboxd for tabletop miniatures.

**My skill level:** Complete beginner with only theoretical coding knowledge. I need very detailed step-by-step instructions with exact commands.

**Current Status:** Phase 1 complete, ready for Phase 2

**GitHub Repository:** https://github.com/djmacbest/malifaux-stash

**Important:** Read the README.md in the GitHub repo for full technical details, data structure, and setup instructions.

## Tech Stack (Already Set Up)
- **Frontend:** React (Vite), React-Select
- **Backend:** Node.js, Express  
- **Database:** SQLite (file: `backend/malifaux.db`)
- **Styling:** Custom CSS
- **OS:** Windows
- **Editor:** VS Code

## Phase 1 Accomplishments ✅

**Master Data:**
- 103 Model Profiles imported
- 270 Sculpts imported
- CSV import tool working (`import-data.html`)

**Features Working:**
- Typeahead search to add sculpts to collection
- Three view modes: Table, Grid, Kanban
- Multi-select filtering (Faction, Keyword, Edition, SKU) with OR logic within each type
- Filter combinations use AND logic (e.g., Guild AND Mercenary keyword)
- Single-select filters for collection status and mini status
- Keywords and SKU displayed in all views
- Smart sculpt display: Shows `[edition] sculpt_name` or just `[edition]` if sculpt name matches model name
- Edit and delete collection entries
- Multi-value fields (keywords, station, edition, SKU) using semicolons in CSV

**Data Format Rules:**
- Multi-values: Use semicolon separator (e.g., `M2e;M3e;M4e`)
- Commas in names: Wrap in quotes (e.g., `"Tara, Voidcaller"`)
- Sculpts CSV uses model names, not IDs (backend auto-resolves)
- Backend converts semicolons to `, ` for keywords/edition, ` / ` for SKUs

## Current Phase: Phase 2 - Picture Gallery

**Goal:** Add ability to upload and tag painted miniature pictures (single-user, no auth yet)

**Features Needed:**
1. Upload picture interface
2. Tag pictures with sculpts (typeahead multi-select from Sculpt Catalog)
3. Optional: Link picture to a collection entry
4. Gallery view of uploaded pictures
5. Filter gallery by tagged sculpts/models/keywords/factions
6. View full image details (image, tags, caption)
7. Edit tags/caption
8. Delete uploads

**Database additions needed:**
- User Uploads table (image path, tagged sculpts, scene tag, status tag, caption, timestamp)
- File storage in `backend/uploads/` folder

**Important constraints:**
- Images stored in local file system for now (cloud storage in Phase 4)
- No authentication yet (single user)
- Must handle multiple sculpts tagged per image

## Critical Instructions for AI Assistant

### Communication Style
- **Always use artifacts for ALL code** - never paste code in chat
- Be concise but thorough - focus on technical content
- Provide exact commands with explanations
- Assume I need hand-holding through each step
- **Before generating substantial code, ask clarifying questions**
- After clarifying, immediately create code artifacts

### Code Requirements
- **Never use localStorage or sessionStorage** (not supported in Claude artifacts)
- No placeholder/TODO sections - provide complete working code
- Include error handling from the start
- Use React state for all data storage in artifacts

### When Creating Artifacts
- Create separate artifacts for each file
- Include file path in artifact title (e.g., "backend/routes.js")
- Show complete file contents, not just changes
- Explain what each part does for beginners

### Data Rules
- **Never create fictional Malifaux data** - provide empty templates only
- Multi-value fields use semicolons in CSV (backend converts to commas)
- Show exact CSV format needed for any new data structures

### Testing & Verification
- After each major change, provide testing instructions
- Include troubleshooting steps for common errors
- Show how to verify changes worked (which URL to check, what to look for)

## Project File Structure

```
malifaux-stash/
├── backend/
│   ├── server.js           # Express API server
│   ├── database.js         # SQLite operations
│   ├── malifaux.db         # SQLite database
│   ├── uploads/            # Image storage (create in Phase 2)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddToCollection.jsx
│   │   │   └── CollectionView.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── package.json
├── import-data.html
└── README.md
```

## Running the Application

Backend (Terminal 1):
```bash
cd backend
npm run dev
```
Runs on `http://localhost:3001`

Frontend (Terminal 2):
```bash
cd frontend
npm run dev
```
Runs on `http://localhost:5173`

## What I Need Help With

**Current task:** Implement Phase 2 - Picture Gallery

Please:
1. Ask any clarifying questions about Phase 2 requirements
2. Provide step-by-step implementation plan
3. Create all necessary code in artifacts
4. Show me how to test each feature
5. Help me commit to GitHub when phase is complete

**Communication preferences:**
- Be direct but beginner-friendly
- Provide exact commands I should run
- Explain what each command does
- Include troubleshooting steps preemptively
- Use artifacts for ALL code (never paste in chat)

## Reference Documents

- **Full project details:** See README.md in GitHub repo
- **Original requirements:** See project document in repo (if added)
- **Data structure:** Documented in README.md
- **CSV format rules:** Documented in README.md

## Important Notes

- I have ~300 sculpts in sample data, expect ~3000 in full dataset
- Some model names contain commas (e.g., "Tara, Voidcaller")
- Edition, keywords, station, characteristics, and SKU are multi-value fields
- Backend already handles semicolon-to-comma conversion for display
- TypeScript is not used (plain JavaScript)
- No authentication until Phase 4

---

**Ready to continue!** I'm at the start of Phase 2. Please ask clarifying questions about the picture gallery requirements before we begin implementation.