const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs').promises;
const db = require('./database');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for file uploads (temporary storage)
const upload = multer({
  dest: 'uploads/temp/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, and WebP are allowed.'));
    }
  }
});

// Ensure upload directories exist
async function ensureUploadDirs() {
  const dirs = ['uploads/temp', 'uploads/full', 'uploads/thumbs'];
  for (const dir of dirs) {
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (err) {
      console.error(`Error creating directory ${dir}:`, err);
    }
  }
}

ensureUploadDirs();

// Initialize database
db.initialize();

// ==================== PHASE 1 ROUTES (PRESERVED) ====================

// Get all model profiles
app.get('/api/models', (req, res) => {
  db.getAllModels((err, models) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(models);
  });
});

// Get all sculpts
app.get('/api/sculpts', (req, res) => {
  db.getAllSculpts((err, sculpts) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(sculpts);
  });
});

// Search sculpts (for typeahead)
app.get('/api/sculpts/search', (req, res) => {
  const query = req.query.q || '';
  db.searchSculpts(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Get user collection
app.get('/api/collection', (req, res) => {
  db.getUserCollection((err, collection) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(collection);
  });
});

// Get single collection entry
app.get('/api/collection/:id', (req, res) => {
  db.getCollectionEntry(req.params.id, (err, entry) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!entry) {
      return res.status(404).json({ error: 'Collection entry not found' });
    }
    res.json(entry);
  });
});

// Add to collection
app.post('/api/collection', (req, res) => {
  const { sculptId, collectionStatus, miniStatus, notes } = req.body;
  
  db.addToCollection(sculptId, collectionStatus, miniStatus, notes, (err, id) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id, message: 'Added to collection' });
  });
});

// Update collection entry
app.put('/api/collection/:id', (req, res) => {
  const { id } = req.params;
  const { collectionStatus, miniStatus, notes, upload_ids } = req.body;
  
  db.updateCollectionEntry(id, collectionStatus, miniStatus, notes, upload_ids, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Collection entry updated' });
  });
});

// Delete from collection
app.delete('/api/collection/:id', (req, res) => {
  const { id } = req.params;
  
  db.deleteFromCollection(id, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Removed from collection' });
  });
});

// Get wishlist data
app.get('/api/wishlist', (req, res) => {
  db.getWishlistData((err, data) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(data);
  });
});

// CSV Import endpoints
app.post('/api/import/models', express.json({ limit: '50mb' }), (req, res) => {
  const models = req.body;
  
  db.importModels(models, (err, count) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: `Imported ${count} models` });
  });
});

app.post('/api/import/sculpts', express.json({ limit: '50mb' }), (req, res) => {
  const sculpts = req.body;
  
  db.importSculpts(sculpts, (err, count) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: `Imported ${count} sculpts` });
  });
});

// ==================== PHASE 2 ROUTES (NEW) ====================

// Upload new image
app.post('/api/uploads', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { caption, sculpt_ids, scene_tag, status_tag, collection_ids } = req.body;

    // Validate required fields
    if (!sculpt_ids) {
      await fs.unlink(req.file.path);
      return res.status(400).json({ error: 'At least one sculpt must be tagged' });
    }

    if (!scene_tag) {
      await fs.unlink(req.file.path);
      return res.status(400).json({ error: 'Scene tag is required' });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}.webp`;
    const fullPath = path.join(__dirname, 'uploads', 'full', filename);
    const thumbPath = path.join(__dirname, 'uploads', 'thumbs', filename);

    // Process image: convert to WebP, resize to max 2000x2000, quality 85%
    await sharp(req.file.path)
      .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(fullPath);

    // Create thumbnail: max 400x400, quality 80%
    await sharp(req.file.path)
      .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(thumbPath);

    // Delete temporary upload
    await fs.unlink(req.file.path);

    // Insert into database
    db.addUpload(filename, req.file.originalname, caption || '', sculpt_ids, scene_tag, status_tag || null, (err, uploadId) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: err.message });
      }

      // If collection_ids provided, update those collection entries
      if (collection_ids) {
        const collectionIdArray = collection_ids.split(',').map(id => id.trim());
        
        collectionIdArray.forEach(collectionId => {
          db.addUploadToCollection(collectionId, uploadId, (err) => {
            if (err) console.error('Error linking upload to collection:', err);
          });
        });
      }

      res.json({
        id: uploadId,
        filename,
        message: 'Upload successful'
      });
    });

  } catch (error) {
    console.error('Upload error:', error);
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    res.status(500).json({ error: 'Failed to process image' });
  }
});

// Get all uploads
app.get('/api/uploads', (req, res) => {
  db.getAllUploads((err, uploads) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(uploads);
  });
});

// Get single upload
app.get('/api/uploads/:id', (req, res) => {
  db.getUpload(req.params.id, (err, upload) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!upload) {
      return res.status(404).json({ error: 'Upload not found' });
    }
    res.json(upload);
  });
});

// Update upload (edit caption, tags)
app.put('/api/uploads/:id', (req, res) => {
  const { caption, sculpt_ids, scene_tag, status_tag } = req.body;
  
  db.updateUpload(req.params.id, caption || '', sculpt_ids, scene_tag, status_tag || null, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Upload updated' });
  });
});

// Delete upload
app.delete('/api/uploads/:id', async (req, res) => {
  try {
    // Get upload details first
    db.getUpload(req.params.id, async (err, upload) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!upload) {
        return res.status(404).json({ error: 'Upload not found' });
      }

      const fullPath = path.join(__dirname, 'uploads', 'full', upload.filename);
      const thumbPath = path.join(__dirname, 'uploads', 'thumbs', upload.filename);

      // Delete files
      await fs.unlink(fullPath).catch(() => {});
      await fs.unlink(thumbPath).catch(() => {});

      // Delete from database (this also removes from collection entries via database.js)
      db.deleteUpload(req.params.id, (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Upload deleted' });
      });
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete upload' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});