import { useState, useEffect } from 'react';
import axios from 'axios';
import AddToCollection from './components/AddToCollection';
import CollectionView from './components/CollectionView';
import './App.css';

const API_URL = 'http://localhost:3001/api';

function App() {
  const [collection, setCollection] = useState([]);
  const [view, setView] = useState('table');
  const [filters, setFilters] = useState({
    faction: '',
    keyword: '',
    collectionStatus: '',
    miniStatus: '',
    search: ''
  });

  useEffect(() => {
    loadCollection();
  }, []);

  const loadCollection = async () => {
    try {
      const response = await axios.get(`${API_URL}/collection`);
      setCollection(response.data);
    } catch (error) {
      console.error('Error loading collection:', error);
    }
  };

  const handleAdd = async (sculptId, collectionStatus, miniStatus, notes) => {
    try {
      await axios.post(`${API_URL}/collection`, {
        sculptId,
        collectionStatus,
        miniStatus,
        notes
      });
      loadCollection();
    } catch (error) {
      console.error('Error adding to collection:', error);
      alert('Error adding to collection');
    }
  };

  const handleUpdate = async (id, collectionStatus, miniStatus, notes) => {
    try {
      await axios.put(`${API_URL}/collection/${id}`, {
        collectionStatus,
        miniStatus,
        notes
      });
      loadCollection();
    } catch (error) {
      console.error('Error updating collection:', error);
      alert('Error updating collection');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this item from your collection?')) return;
    
    try {
      await axios.delete(`${API_URL}/collection/${id}`);
      loadCollection();
    } catch (error) {
      console.error('Error deleting from collection:', error);
      alert('Error removing from collection');
    }
  };

  // Filter collection
  const filteredCollection = collection.filter(item => {
    if (filters.faction && item.faction !== filters.faction) return false;
    if (filters.collectionStatus && item.collection_status !== filters.collectionStatus) return false;
    if (filters.miniStatus && item.mini_status !== filters.miniStatus) return false;
    if (filters.keyword && !item.keywords?.includes(filters.keyword)) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        item.sculpt_name?.toLowerCase().includes(searchLower) ||
        item.model_name?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  // Get unique values for filters
  const factions = [...new Set(collection.map(item => item.faction).filter(Boolean))];
  const allKeywords = collection
    .map(item => item.keywords?.split(',').map(k => k.trim()))
    .flat()
    .filter(Boolean);
  const keywords = [...new Set(allKeywords)];

  return (
    <div className="app">
      <header className="header">
        <h1>Malifaux Stash</h1>
        <p>My Collection</p>
      </header>

      <div className="container">
        <AddToCollection onAdd={handleAdd} />

        <div className="filters">
          <input
            type="text"
            placeholder="Search collection..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="search-input"
          />

          <select
            value={filters.faction}
            onChange={(e) => setFilters({ ...filters, faction: e.target.value })}
            className="filter-select"
          >
            <option value="">All Factions</option>
            {factions.map(faction => (
              <option key={faction} value={faction}>{faction}</option>
            ))}
          </select>

          <select
            value={filters.keyword}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
            className="filter-select"
          >
            <option value="">All Keywords</option>
            {keywords.map(keyword => (
              <option key={keyword} value={keyword}>{keyword}</option>
            ))}
          </select>

          <select
            value={filters.collectionStatus}
            onChange={(e) => setFilters({ ...filters, collectionStatus: e.target.value })}
            className="filter-select"
          >
            <option value="">All Collection Status</option>
            <option value="Owned">Owned</option>
            <option value="Wishlist">Wishlist</option>
            <option value="To Sell">To Sell</option>
            <option value="Sold">Sold</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={filters.miniStatus}
            onChange={(e) => setFilters({ ...filters, miniStatus: e.target.value })}
            className="filter-select"
          >
            <option value="">All Mini Status</option>
            <option value="Unassembled">Unassembled</option>
            <option value="Assembled">Assembled</option>
            <option value="Primed">Primed</option>
            <option value="Painting WIP">Painting WIP</option>
            <option value="Painted">Painted</option>
          </select>

          <button onClick={() => setFilters({
            faction: '', keyword: '', collectionStatus: '', miniStatus: '', search: ''
          })} className="clear-filters">
            Clear Filters
          </button>
        </div>

        <div className="view-controls">
          <button
            className={view === 'table' ? 'active' : ''}
            onClick={() => setView('table')}
          >
            Table View
          </button>
          <button
            className={view === 'grid' ? 'active' : ''}
            onClick={() => setView('grid')}
          >
            Grid View
          </button>
          <button
            className={view === 'kanban' ? 'active' : ''}
            onClick={() => setView('kanban')}
          >
            Kanban View
          </button>
        </div>

        <CollectionView
          collection={filteredCollection}
          view={view}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default App;