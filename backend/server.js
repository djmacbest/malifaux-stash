const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize database
db.initialize();

// API Routes

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
  const { collectionStatus, miniStatus, notes } = req.body;
  
  db.updateCollectionEntry(id, collectionStatus, miniStatus, notes, (err) => {
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

// CSV Import endpoint
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});