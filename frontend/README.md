# Malifaux Stash

A community platform for Malifaux miniature collectors to manage their collections, share painted miniatures, and discover others' work. Think Letterboxd, but for tabletop miniatures.

## Current Status: Phase 1 Complete ✅

**Live Development:** Local only (Phase 1)  
**GitHub:** https://github.com/djmacbest/malifaux-stash

## Tech Stack

- **Frontend:** React (Vite), React-Select for typeahead
- **Backend:** Node.js, Express
- **Database:** SQLite (migrating to PostgreSQL in Phase 4)
- **Styling:** Custom CSS (Letterboxd-inspired design)
- **Version Control:** Git/GitHub

## AI Assistant Code Access

**IMPORTANT FOR AI ASSISTANTS:** Before creating any artifacts or modifications, fetch and analyze ALL of these files first:

### Project Documentation
- https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/README.md
- https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/HANDOVER_PROMPT.md

### Frontend - Core Application Files
- https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/frontend/index.html
- https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/frontend/vite.config.js
- https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/frontend/package.json
- https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/frontend/eslint.config.js

### Frontend - Source Files
- https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/frontend/src/main.jsx
- https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/frontend/src/App.jsx
- https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/frontend/src/App.css
- https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/frontend/src/index.css

### Frontend - Components
- https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/frontend/src/components/AddToCollection.jsx
- https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/frontend/src/components/CollectionView.jsx
- https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/frontend/src/components/WishlistView.jsx

### Backend Files
- https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/backend/server.js
- https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/backend/database.js
- https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/backend/package.json

### Data Import Tool
- https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/import-data.html

### Database Schema
Check existing tables and structure:
```bash
# Connect to database
sqlite3 backend/malifaux.db

# List all tables
.tables

# Check schema for each table
.schema model_profiles
.schema sculpt_catalog
.schema user_collection

# Exit
.quit
```

### AI Assistant Workflow Requirements

**MANDATORY STEPS before creating any artifacts:**

1. ✅ **Fetch ALL files listed above** - Read existing code completely, especially:
   - All component files (AddToCollection, CollectionView, WishlistView)
   - App.jsx and all CSS files
   - Backend server.js and database.js
   - HANDOVER_PROMPT.md for project context

2. ✅ **Understand current state** - What features exist, what's the structure, what's the complete functionality

3. ✅ **Ask clarifying questions** - About new requirements before coding

4. ✅ **Create incremental updates** - EXTEND existing code, don't replace entire files unless explicitly rebuilding from scratch

5. ✅ **Preserve ALL functionality** - Never remove existing features (like Wishlist, filters, view modes, etc.)

6. ✅ **Test instructions** - Provide clear, detailed testing steps for all changes

**NEVER:**
- ❌ Create artifacts without reading existing code first
- ❌ Replace entire files when only partial updates are needed
- ❌ Assume previous functionality based on descriptions alone
- ❌ Remove existing features when adding new ones
- ❌ Guess at implementation details - always verify by reading actual code

**If you cannot fetch files:**
- Ask the user to explicitly provide the raw GitHub URLs
- Once provided, you MUST fetch and read them before proceeding
- If fetch still fails, ask user to paste file contents directly

## Project Structure

```
malifaux-stash/
├── .gitignore
├── README.md
├── HANDOVER_PROMPT.md      # AI assistant instructions
├── backend/
│   ├── server.js           # Express API server
│   ├── database.js         # SQLite database operations
│   ├── malifaux.db         # SQLite database (gitignored)
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── .gitignore
│   ├── README.md
│   ├── index.html
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── package.json
│   ├── package-lock.json
│   ├── public/
│   │   └── vite.svg
│   └── src/
│       ├── main.jsx        # React entry point
│       ├── App.jsx         # Main app component with routing
│       ├── App.css         # Main app styles
│       ├── index.css       # Global styles
│       ├── assets/
│       │   └── react.svg
│       └── components/
│           ├── AddToCollection.jsx    # Typeahead search & add
│           ├── CollectionView.jsx     # Table/Grid/Kanban views
│           └── WishlistView.jsx       # Wishlist management
└── import-data.html        # CSV import tool
```

## Phase 1: Collection Management (COMPLETE)

### Features Implemented
- ✅ Master data management (Model Profiles + Sculpt Catalog)
- ✅ CSV import tool for bulk data import
- ✅ Typeahead search to add sculpts to collection
- ✅ **"My Collection" tab** with three view modes:
  - Table view (detailed spreadsheet)
  - Grid view (card-based layout)
  - Kanban view (organized by mini status)
- ✅ **"Wishlist" tab** with dedicated wishlist management
- ✅ Multi-select filtering with smart logic:
  - Faction, Keywords, Edition, SKU filters (OR logic within each type)
  - Combined filters use AND logic (e.g., Guild AND Mercenary)
  - Search filter for sculpt/model names
  - Single-select for collection status and mini status
- ✅ Keywords, SKU, and smart sculpt display in all views
- ✅ Edit and delete collection entries
- ✅ Multi-value field support (keywords, station, characteristics, SKU, edition)

### Data Model

**Model Profiles (Admin-managed master data):**
- Model name, faction, keywords, base size, station
- Game stats (DF, WP, Mv, Sz, HP, STN, cost, hire limit)
- Characteristics (Living, Construct, etc.)
- Boolean flags (henchman, versatile, loyal, unique)

**Sculpt Catalog (Admin-managed master data):**
- Sculpt name, edition(s), SKU/box name
- Relation to Model Profile (one sculpt = one model profile)

**User Collection (User data):**
- Sculpt owned
- Collection status (Owned, Wishlist, To Sell, Sold, Other)
- Mini status (Unassembled, Assembled, Primed, Painting WIP, Painted)
- Notes

### CSV Data Format Rules

**Multi-value fields:** Use semicolon (`;`) as separator
- Keywords: `Mercenary;Minion`
- Station: `Totem;Minion`
- Edition: `M2e;M3e;M4e`
- SKU: `Box A;Box B`

**Fields with commas:** Wrap in double quotes
- Model name: `"Tara, Voidcaller"`
- SKU with comma: `"Box A;Box Name, Special Edition"`

**Sculpts CSV:** Use actual model names (not IDs) in `model_profile_id` column
- Example: `Ronin` (not `5`)
- Backend automatically looks up correct ID

## Running Locally

### Prerequisites
- Node.js (v20+)
- npm
- Git
- SQLite3 (for database management)

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/djmacbest/malifaux-stash.git
   cd malifaux-stash
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start backend (Terminal 1):**
   ```bash
   cd backend
   npm run dev
   ```
   Server runs on `http://localhost:3001`

2. **Start frontend (Terminal 2):**
   ```bash
   cd frontend
   npm run dev
   ```
   App runs on `http://localhost:5173`

### Importing Data

1. **Prepare CSV files** using the templates:
   - `models_template.csv` - Model profiles
   - `sculpts_template.csv` - Sculpt catalog

2. **Open import tool:**
   - Open `import-data.html` in your browser
   - Ensure backend is running

3. **Import in order:**
   - First: Import models CSV
   - Second: Import sculpts CSV

## Development Phases

### ✅ Phase 1: Single-User Collection Management (COMPLETE)
- Collection tracking with typeahead search
- Multiple view modes and filtering
- CSV data import
- Wishlist management

### 🚧 Phase 2: Picture Gallery (IN PROGRESS)
- Upload painted mini pictures
- Tag pictures with sculpts (multi-select)
- Gallery view with filtering
- Link pictures to collection entries

### 📋 Phase 3: Discovery (Planned)
- Public gallery of all uploads
- Browse by chronological or engagement
- Filter by sculpt/model/keyword/faction
- View user profiles

### 📋 Phase 4: Multi-User + Social (Planned)
- User authentication (sign up/login)
- Like and comment functionality
- User profiles
- Migrate to PostgreSQL
- Deploy to production

## Key Technical Decisions

### Why SQLite for Phase 1-3?
- No server setup required
- Perfect for local development
- Easy migration path to PostgreSQL
- File-based (simple backup/restore)

### Why Semicolons for Multi-Value Fields?
- Avoids conflicts with commas in model/sculpt names
- Backend converts to commas for display (user-friendly)
- Consistent parsing across all multi-value fields

### Why Model Names Instead of IDs in Sculpts CSV?
- More maintainable for 3000+ sculpts
- No manual ID lookup required
- Backend auto-resolves to correct IDs

## Troubleshooting

### Backend won't start
```bash
cd backend
rm -rf node_modules
npm install
npm run dev
```

### Frontend won't start
```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

### Import fails
- Ensure backend is running first
- Check CSV formatting (quotes for commas, semicolons for multi-values)
- Delete `backend/malifaux.db` and re-import for fresh start
- Check backend terminal for detailed error messages

### Data not appearing
- Verify import success at `http://localhost:3001/api/models`
- Check browser console (F12) for errors
- Refresh frontend application

## Contributing

This is currently a solo project in active development. Phase 1 is complete and stable.

## License

TBD

## Acknowledgments

- Inspired by Letterboxd's design and UX
- Built for the Malifaux miniature gaming community
- Developed with assistance from Claude (Sonnet 4.5) by Anthropic (even though it's tedious)