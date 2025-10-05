# Malifaux Stash - AI Assistant Handover Prompt

## Quick Context
I'm building "Malifaux Stash" - a community platform for Malifaux miniature collectors to manage collections, share painted miniatures, and discover others' work. Think Letterboxd for tabletop miniatures.

**My skill level:** Complete beginner with only theoretical coding knowledge. I need very detailed step-by-step instructions with exact commands.

**Current Status:** Phase 2 in progress (core features implemented, needs polish)

**GitHub Repository:** https://github.com/djmacbest/malifaux-stash

---

## 🚨 CRITICAL WORKFLOW RULES - READ FIRST 🚨

### MANDATORY: Code Fetching Protocol

**BEFORE creating ANY artifacts or code changes, you MUST:**

1. ✅ **Fetch ALL relevant existing files from GitHub**
   - Use the file URLs listed in README.md "AI Assistant Code Access" section
   - Read EVERY file that might be affected by your changes
   - DO NOT guess at implementation details - always verify

2. ✅ **Confirm what you fetched**
   - Explicitly state which files you've read
   - Show key details proving you understand the current state
   - Ask clarifying questions AFTER reading the code

3. ✅ **Create COMPLETE replacement artifacts**
   - NEVER ask the user to "add these lines" or "append this code"
   - ALWAYS provide full file contents as artifacts
   - One complete artifact per file

4. ✅ **Verify before proceeding**
   - Confirm your understanding of current implementation
   - Get user approval before generating artifacts
   - Test incrementally, one feature at a time

### FORBIDDEN Practices

❌ **NEVER** create artifacts without fetching existing code first  
❌ **NEVER** ask user to manually edit files line-by-line  
❌ **NEVER** assume previous functionality based on descriptions alone  
❌ **NEVER** remove existing features when adding new ones  
❌ **NEVER** use localStorage or sessionStorage (not supported)  
❌ **NEVER** create partial/incomplete artifacts with TODOs  

---

## Tech Stack

- **Frontend:** React (Vite), React-Select, React-Router-Dom, React-Masonry-CSS, Axios
- **Backend:** Node.js, Express, Multer (file uploads), Sharp (image processing)
- **Database:** SQLite (`backend/malifaux.db`)
- **Styling:** Custom CSS (purple gradient theme: #667eea to #764ba2)
- **OS:** Windows
- **Editor:** VS Code

---

## Current Phase Status

### ✅ Phase 1: Collection Management (COMPLETE)
- Master data (Model Profiles + Sculpt Catalog)
- CSV import tool
- Typeahead search to add sculpts
- "My Collection" tab with Table/Grid/Kanban views
- "Wishlist" tab with SKU grouping
- Multi-select filtering (Faction, Keyword, Edition, SKU)
- Edit and delete collection entries

### 🚧 Phase 2: Picture Gallery (IN PROGRESS - Core Complete, Needs Polish)

**Implemented:**
- ✅ Gallery tab (homepage) with masonry/list views
- ✅ Upload modal (accessible from Gallery + Collection entries)
- ✅ Image processing (WebP conversion, 2000px max, thumbnails)
- ✅ Multi-sculpt tagging with typeahead
- ✅ Scene tags (Individual Mini, Collage, Crew Picture, Battle Snapshot)
- ✅ Status tags (Fully Painted, WIP)
- ✅ Collection linking (uploads linked to collection entries)
- ✅ Individual upload detail pages (shareable URLs: `/gallery/:id`)
- ✅ Collection entry detail pages (show photos, `/collection/:id`)
- ✅ Hashtag support in captions
- ✅ Full CRUD operations on uploads
- ✅ Gallery filtering (faction, keyword, edition, SKU, scene, status)
- ✅ Automatic "add to collection" prompt for unowned sculpts

**Needs Polish (Next Tasks):**
- UI/UX improvements
- Additional filtering options
- Performance optimization
- Bug fixes as discovered

### 📋 Phase 3: Discovery (PLANNED)
- Public discovery feed
- Browse other users' uploads
- Advanced search and filtering

### 📋 Phase 4: Multi-User + Social (PLANNED)
- User authentication
- Likes and comments
- User profiles
- PostgreSQL migration
- Production deployment

---

## Database Schema

### Tables
- **model_profiles** - Master data for models
- **sculpt_catalog** - Master data for sculpts
- **user_collection** - User's owned/wishlisted items (includes `upload_ids` column)
- **uploads** - User's uploaded pictures

### Key Relationships
- Collection entries link to sculpts via `sculpt_id`
- Uploads link to sculpts via `sculpt_ids` (semicolon-separated)
- Collection entries link to uploads via `upload_ids` (semicolon-separated)

---

## File Access URLs

**ALL files are listed in README.md under "AI Assistant Code Access"**

Before making changes, fetch these URLs:

### Frontend Core
- `https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/frontend/src/App.jsx`
- `https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/frontend/src/App.css`
- `https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/frontend/src/index.css`
- `https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/frontend/package.json`

### Frontend Components
- `https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/frontend/src/components/AddToCollection.jsx`
- `https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/frontend/src/components/CollectionView.jsx`
- `https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/frontend/src/components/WishlistView.jsx`
- `https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/frontend/src/components/Gallery.jsx`
- `https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/frontend/src/components/UploadModal.jsx`
- `https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/frontend/src/components/UploadDetail.jsx`
- `https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/frontend/src/components/CollectionEntryDetail.jsx`

### Backend
- `https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/backend/server.js`
- `https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/backend/database.js`
- `https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/backend/package.json`

---

## Development Workflow

### Starting a New Task

1. **User provides clear requirements**
2. **AI fetches ALL relevant code** (see URLs above)
3. **AI confirms understanding** of current state
4. **AI asks clarifying questions** about new requirements
5. **User approves approach**
6. **AI creates complete replacement artifacts**
7. **User tests incrementally**

### Git Workflow

Before major changes:
```bash
git checkout -b feature-name
```

After testing:
```bash
git add .
git commit -m "Descriptive message"
git push origin feature-name
```

---

## Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Runs on `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Runs on `http://localhost:5173`

---

## Data Format Rules

### Multi-Value Fields
- **Input (CSV):** Use semicolon separator
  - Example: `M2e;M3e;M4e`
- **Storage (DB):** Semicolon-separated strings
- **Display (Frontend):** Backend converts to `, ` (keywords/edition) or ` / ` (SKUs)

### Names with Commas
- **CSV:** Wrap in double quotes
  - Example: `"Tara, Voidcaller"`

### Sculpt References
- **CSV:** Use model names, not IDs
  - Example: `Ronin` (not `5`)
- **Backend:** Auto-resolves to IDs

---

## Communication Preferences

- **Be direct but beginner-friendly**
- **Provide exact commands** with explanations
- **Use artifacts for ALL code** (never paste in chat)
- **Test incrementally** - one feature at a time
- **Include troubleshooting steps** preemptively
- **Assume zero prior context** - always verify current state

---

## Common Issues & Solutions

### "I forgot to fetch existing code"
**STOP.** Fetch all relevant files first, then restart.

### "Should I append these lines?"
**NO.** Create complete replacement artifact instead.

### "The user's code might look like X"
**DON'T GUESS.** Fetch the actual file and verify.

### "This file is too long for one artifact"
**Plan ahead.** Break into logical chunks or prioritize essential changes.

---

## Example Correct Workflow

```
User: "Add a delete button to the gallery"

AI: "I'll help with that. Let me first fetch the current Gallery.jsx 
to see the existing implementation."

[Fetches Gallery.jsx]

AI: "I can see the gallery currently has [describes current state]. 
To add a delete button, I need to:
1. Add delete handler
2. Add button to UI
3. Update API call

Should I proceed with creating the updated Gallery.jsx artifact?"

User: "Yes"

AI: [Creates COMPLETE Gallery.jsx artifact with all changes]
```

---

## Example INCORRECT Workflow ❌

```
User: "Add a delete button to the gallery"

AI: "Sure! Add this code to your Gallery.jsx file:
```javascript
const handleDelete = () => { ... }
```
Then add this button..."

[WRONG - Should fetch file first, create complete artifact]
```

---

**Ready to help!** Remember: FETCH → CONFIRM → CREATE COMPLETE ARTIFACTS