const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'malifaux.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
function initialize() {
  db.serialize(() => {
    // Model Profiles table
    db.run(`
      CREATE TABLE IF NOT EXISTS model_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        model_name TEXT NOT NULL,
        faction TEXT NOT NULL,
        keywords TEXT,
        base_size TEXT NOT NULL,
        station TEXT,
        henchman INTEGER DEFAULT 0,
        versatile INTEGER DEFAULT 0,
        loyal INTEGER DEFAULT 0,
        unique_model INTEGER DEFAULT 0,
        hire_limit INTEGER,
        cost INTEGER,
        characteristics TEXT,
        df INTEGER,
        wp INTEGER,
        mv INTEGER,
        sz INTEGER,
        hp INTEGER,
        stn INTEGER,
        card_front TEXT,
        card_back TEXT
      )
    `);

    // Sculpt Catalog table
    db.run(`
      CREATE TABLE IF NOT EXISTS sculpt_catalog (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sculpt_name TEXT NOT NULL,
        model_profile_id INTEGER NOT NULL,
        edition TEXT NOT NULL,
        sku TEXT,
        official_artwork TEXT,
        official_render TEXT,
        sprue_photo TEXT,
        build_instructions TEXT,
        FOREIGN KEY (model_profile_id) REFERENCES model_profiles(id)
      )
    `);

    // User Collection table
    db.run(`
      CREATE TABLE IF NOT EXISTS user_collection (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sculpt_id INTEGER NOT NULL,
        collection_status TEXT NOT NULL,
        mini_status TEXT NOT NULL,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sculpt_id) REFERENCES sculpt_catalog(id)
      )
    `);

    console.log('Database initialized');
  });
}

// Get all model profiles
function getAllModels(callback) {
  db.all('SELECT * FROM model_profiles ORDER BY model_name', [], callback);
}

// Get all sculpts with their model info
function getAllSculpts(callback) {
  const query = `
    SELECT 
      s.*,
      m.model_name,
      m.faction,
      m.keywords
    FROM sculpt_catalog s
    LEFT JOIN model_profiles m ON s.model_profile_id = m.id
    ORDER BY s.sculpt_name
  `;
  db.all(query, [], callback);
}

// Search sculpts for typeahead
function searchSculpts(query, callback) {
  const searchTerm = `%${query}%`;
  const sql = `
    SELECT 
      s.*,
      m.model_name,
      m.faction,
      m.keywords
    FROM sculpt_catalog s
    LEFT JOIN model_profiles m ON s.model_profile_id = m.id
    WHERE 
      s.sculpt_name LIKE ? OR
      m.model_name LIKE ? OR
      m.faction LIKE ? OR
      m.keywords LIKE ?
    ORDER BY s.sculpt_name
    LIMIT 20
  `;
  db.all(sql, [searchTerm, searchTerm, searchTerm, searchTerm], callback);
}

// Get user collection with full details
function getUserCollection(callback) {
  const query = `
    SELECT 
      uc.*,
      s.sculpt_name,
      s.edition,
      s.sku,
      m.model_name,
      m.faction,
      m.keywords,
      m.base_size
    FROM user_collection uc
    LEFT JOIN sculpt_catalog s ON uc.sculpt_id = s.id
    LEFT JOIN model_profiles m ON s.model_profile_id = m.id
    ORDER BY uc.created_at DESC
  `;
  db.all(query, [], callback);
}

// Add to collection
function addToCollection(sculptId, collectionStatus, miniStatus, notes, callback) {
  const sql = `
    INSERT INTO user_collection (sculpt_id, collection_status, mini_status, notes)
    VALUES (?, ?, ?, ?)
  `;
  db.run(sql, [sculptId, collectionStatus, miniStatus, notes], function(err) {
    callback(err, this.lastID);
  });
}

// Update collection entry
function updateCollectionEntry(id, collectionStatus, miniStatus, notes, callback) {
  const sql = `
    UPDATE user_collection
    SET collection_status = ?, mini_status = ?, notes = ?
    WHERE id = ?
  `;
  db.run(sql, [collectionStatus, miniStatus, notes, id], callback);
}

// Delete from collection
function deleteFromCollection(id, callback) {
  db.run('DELETE FROM user_collection WHERE id = ?', [id], callback);
}

// Import models from CSV data
function importModels(models, callback) {
  const stmt = db.prepare(`
    INSERT INTO model_profiles (
      model_name, faction, keywords, base_size, station, henchman,
      versatile, loyal, unique_model, hire_limit, cost, characteristics,
      df, wp, mv, sz, hp, stn
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let count = 0;
  let errors = [];
  
  models.forEach((model, index) => {
    // Convert semicolon-separated values to comma-separated for storage
    // Handle null/undefined values properly
    const keywords = model.keywords ? String(model.keywords).replace(/;/g, ', ') : '';
    const station = model.station ? String(model.station).replace(/;/g, ', ') : '';
    const characteristics = model.characteristics ? String(model.characteristics).replace(/;/g, ', ') : '';
    
    stmt.run(
      model.model_name,
      model.faction,
      keywords,
      model.base_size,
      station,
      model.henchman ? 1 : 0,
      model.versatile ? 1 : 0,
      model.loyal ? 1 : 0,
      model.unique ? 1 : 0,
      model.hire_limit || null,
      model.cost,
      characteristics,
      model.df || null,
      model.wp || null,
      model.mv || null,
      model.sz || null,
      model.hp || null,
      model.stn || null,
      (err) => {
        if (err) {
          errors.push(`Row ${index + 2} (${model.model_name}): ${err.message}`);
          console.error(`Import error on row ${index + 2}:`, model.model_name, err.message);
        } else {
          count++;
        }
      }
    );
  });

  stmt.finalize((err) => {
    if (errors.length > 0) {
      console.error('Import errors:', errors);
      callback(new Error(`Imported ${count}/${models.length}. Errors: ${errors.join('; ')}`), count);
    } else {
      callback(err, count);
    }
  });
}

// Import sculpts from CSV data
function importSculpts(sculpts, callback) {
  let count = 0;
  let errors = [];
  let processed = 0;

  sculpts.forEach((sculpt, index) => {
    // Check if model_profile_id is a number or a model name
    const modelRef = sculpt.model_profile_id;
    
    if (typeof modelRef === 'number') {
      // It's already an ID, use it directly
      insertSculpt(sculpt, modelRef, index);
    } else {
      // It's a model name, look up the ID
      db.get('SELECT id FROM model_profiles WHERE model_name = ?', [modelRef], (err, row) => {
        if (err || !row) {
          errors.push(`Row ${index + 2} (${sculpt.sculpt_name}): Model "${modelRef}" not found`);
          console.error(`Import error on row ${index + 2}:`, sculpt.sculpt_name, `Model "${modelRef}" not found`);
          processed++;
          checkComplete();
        } else {
          insertSculpt(sculpt, row.id, index);
        }
      });
    }
  });

  function insertSculpt(sculpt, modelId, index) {
    const sku = sculpt.sku ? String(sculpt.sku).replace(/;/g, ' / ') : '';
    const edition = sculpt.edition ? String(sculpt.edition).replace(/;/g, ', ') : '';
    
    db.run(
      'INSERT INTO sculpt_catalog (sculpt_name, model_profile_id, edition, sku) VALUES (?, ?, ?, ?)',
      [sculpt.sculpt_name, modelId, edition, sku],
      (err) => {
        if (err) {
          errors.push(`Row ${index + 2} (${sculpt.sculpt_name}): ${err.message}`);
          console.error(`Import error on row ${index + 2}:`, sculpt.sculpt_name, err.message);
        } else {
          count++;
        }
        processed++;
        checkComplete();
      }
    );
  }

  function checkComplete() {
    if (processed === sculpts.length) {
      if (errors.length > 0) {
        console.error('Import errors:', errors);
        callback(new Error(`Imported ${count}/${sculpts.length}. Errors: ${errors.join('; ')}`), count);
      } else {
        callback(null, count);
      }
    }
  }
}

module.exports = {
  initialize,
  getAllModels,
  getAllSculpts,
  searchSculpts,
  getUserCollection,
  addToCollection,
  updateCollectionEntry,
  deleteFromCollection,
  importModels,
  importSculpts
};