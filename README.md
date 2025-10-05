# Malifaux Stash

A community platform for Malifaux miniature collectors to manage their collections, share painted miniatures, and discover others' work. Think Letterboxd, but for tabletop miniatures.

## Current Status: Phase 2 In Progress 🚧

**Live Development:** Local only  
**GitHub:** https://github.com/djmacbest/malifaux-stash

---

## Tech Stack

- **Frontend:** React (Vite), React-Select, React-Router-Dom, React-Masonry-CSS, Axios
- **Backend:** Node.js, Express, Multer, Sharp
- **Database:** SQLite (migrating to PostgreSQL in Phase 4)
- **Styling:** Custom CSS (Letterboxd-inspired design)
- **Version Control:** Git/GitHub

---

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

### Frontend - Phase 1 Components
- https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/frontend/src/components/AddToCollection.jsx
- https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/frontend/src/components/CollectionView.jsx
- https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/frontend/src/components/WishlistView.jsx

### Frontend - Phase 2 Components
- https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/frontend/src/components/Gallery.jsx
- https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/frontend/src/components/Gallery.css
- https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/frontend/src/components/UploadModal.jsx
- https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/frontend/src/components/UploadModal.css
- https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/frontend/src/components/UploadDetail.jsx
- https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/frontend/src/components/UploadDetail.css
- https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/frontend/src/components/CollectionEntryDetail.jsx
- https://raw.githubusercontent.com/djmacbest/malifaux-stash/main/frontend/src/components/CollectionEntryDetail.css

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
.schema uploads

# Exit
.quit
```

### AI Assistant Workflow Requirements

**MANDATORY STEPS before creating any artifacts:**

1. ✅ **Fetch ALL files listed above** - Read existing code completely
2. ✅ **Understand current state** - Verify what features exist
3. ✅ **Ask clarifying questions** - About new requirements before coding
4. ✅ **Create COMPLETE replacements** - Full file artifacts, never line-by-line edits
5. ✅ **Preserve ALL functionality** - Never remove existing features
6. ✅ **Test instructions** - Provide clear, detailed testing steps

**NEVER:**
- ❌ Create artifacts without reading existing code first
- ❌ Ask user to manually edit files ("add these lines to...")
- ❌ Assume implementation details - always verify
- ❌ Remove existing features when adding new ones
- ❌ Use localStorage/sessionStorage (not supported)

**See HANDOVER_PROMPT.md for complete workflow rules**

---

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
│   ├── uploads/            # Image storage (Phase 2)
│   │   ├── temp/           # Temporary upload processing
│   │   ├── full/           # Full-size images (WebP, max 2000px)
│   │   └── thumbs/         # Thumbnails (WebP, max 400px)
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
│       ├── App.jsx         # Main app with routing
│       ├── App.css         # Global styles
│       ├── index.css       # Base styles
│       ├── assets/
│       │   └── react.svg
│       └── components/
│           ├── AddToCollection.jsx    # Typeahead search & add
│           ├── CollectionView.jsx     # Table/Grid/Kanban views
│           ├── WishlistView.jsx       # Wishlist management
│           ├── Gallery.jsx            # Picture gallery (Phase 2)
│           ├── Gallery.css
│           ├── UploadModal.jsx        # Upload interface (Phase 2)
│           ├── UploadModal.css
│           ├── UploadDetail.jsx       # Individual upload page (Phase 2)
│           ├── UploadDetail.css
│           ├── CollectionEntryDetail.jsx  # Collection item detail (Phase 2)
│           └── CollectionEntryDetail.css
└── import-data.html        # CSV import tool
```

---

## Features by Phase

### ✅ Phase 1: Single-User Collection Management (COMPLETE)

**Master Data Management:**
- Model Profiles catalog (103 models)
- Sculpt Catalog (270 sculpts)
- CSV import tool for bulk data

**Collection Management:**
- Typeahead search to add sculpts
- **"My Collection" tab:**
  - Table view (detailed spreadsheet)
  - Grid view (card-based layout)
  - Kanban view (organized by mini status)
  - Edit and delete entries
  
- **"Wishlist" tab:**
  - Grouped by SKU
  - Shows all models in boxes containing wishlisted items
  - Quick "Wishlist Now" for unowned items

**Filtering:**
- Multi-select: Faction, Keywords, Edition, SKU (OR logic within type)
- Single-select: Collection Status, Mini Status
- Search filter for model/sculpt names
- Combined filters use AND logic

**Data Features:**
- Multi-value field support (keywords, edition, SKU)
- Smart sculpt display
- Semicolon-separated values in CSV, displayed as commas

### 🚧 Phase 2: Picture Gallery (IN PROGRESS - Core Complete)

**Implemented Features:**

**Upload & Management:**
- Upload painted miniature pictures (JPG, PNG, WebP → converted to WebP)
- Image processing: Max 2000×2000px, 85% quality (~200-400KB per image)
- Thumbnail generation: 400×400px, 80% quality
- Multi-sculpt tagging with typeahead search
- Scene tags: Individual Mini, Collage, Crew Picture, Battle Snapshot
- Status tags: Fully Painted, WIP (optional)
- Caption with hashtag support (#NMM #basing)
- Link uploads to collection entries
- Auto-prompt to add unowned sculpts to collection

**Gallery Views:**
- **Gallery tab** (homepage):
  - Masonry grid (Pinterest-style)
  - List view with metadata
  - Toggle between views
  
**Individual Pages:**
- Upload detail pages with shareable URLs (`/gallery/:id`)
- Collection entry detail pages (`/collection/:id`)
- Shows linked photos for each collection item

**Filtering:**
- Faction, Keyword, Edition, SKU (multi-select)
- Scene Tag (multi-select)
- Status Tag (single-select)

**Next Steps:**
- UI/UX polish
- Performance optimization
- Bug fixes

### 📋 Phase 3: Discovery (PLANNED)
- Public gallery of all uploads
- Browse by chronological or engagement
- Filter by sculpt/model/keyword/faction
- View user profiles
- Discovery feed

### 📋 Phase 4: Multi-User + Social (PLANNED)
- User authentication (sign up/login)
- Like and comment functionality
- User profiles
- Follow users
- Migrate to PostgreSQL
- Deploy to production hosting

---

## Data Model

### Model Profiles (Admin-managed master data)
- Model name, faction, keywords, base size, station
- Game stats (DF, WP, Mv, Sz, HP, STN, cost, hire limit)
- Characteristics (Living, Construct, etc.)
- Boolean flags (henchman, versatile, loyal, unique)

### Sculpt Catalog (Admin-managed master data)
- Sculpt name, edition(s), SKU/box name
- Relation to Model Profile (one sculpt = one model profile)

### User Collection (User data)
- Sculpt owned
- Collection status (Owned, Wishlist, To Sell, Sold, Other)
- Mini status (Unassembled, Assembled, Primed, Painting WIP, Painted)
- Notes
- Linked upload IDs (Phase 2)

### Uploads (User data - Phase 2)
- Image filename (WebP)
- Tagged sculpt IDs (multiple allowed)
- Scene tag (required)
- Status tag (optional)
- Caption (with hashtag support)
- Upload date, uploader

---

## CSV Data Format Rules

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

**Backend Display Conversion:**
- Keywords/Edition: `;` → `, ` (comma-space)
- SKU: `;` → ` / ` (slash)

---

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

---

## Key Technical Decisions

### Why SQLite for Phase 1-3?
- No server setup required
- Perfect for local development
- Easy migration path to PostgreSQL
- File-based (simple backup/restore)

### Why Semicolons for Multi-Value Fields?
- Avoids conflicts with commas in model/sculpt names
- Backend converts to commas for user-friendly display
- Consistent parsing across all multi-value fields

### Why Model Names Instead of IDs in Sculpts CSV?
- More maintainable for 3000+ sculpts
- No manual ID lookup required
- Backend auto-resolves to correct IDs

### Why WebP for Image Storage?
- 25-35% smaller than JPG at same quality
- Supported by all modern browsers
- Consistent format across all uploads
- Better compression for painted miniatures

---

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

### Images not uploading
- Check backend terminal for Sharp/Multer errors
- Verify `backend/uploads/full/` and `backend/uploads/thumbs/` directories exist
- Ensure images are < 5MB and JPG/PNG/WebP format

---

## Contributing

This is currently a solo project in active development. Phase 2 is in progress.

---

## License

TBD

---

## Acknowledgments

- Inspired by Letterboxd's design and UX
- Built for the Malifaux miniature gaming community
- Developed with assistance from Claude (Sonnet 4.5) by Anthropic