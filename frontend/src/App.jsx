import { useState, useEffect } from 'react';
import axios from 'axios';
import AddToCollection from './components/AddToCollection';
import CollectionView from './components/CollectionView';
import WishlistView from './components/WishlistView';
import './App.css';

const API_URL = 'http://localhost:3001/api';

function App() {
  const [collection, setCollection] = useState([]);
  const [page, setPage] = useState('collection');
  const [view, setView] = useState('table');
  const [filters, setFilters] = useState({
    factions: [],
    keywords: [],
    editions: [],
    skus: [],
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
    if (filters.factions.length > 0 && !filters.factions.includes(item.faction)) return false;
    
    if (filters.keywords.length > 0) {
      const itemKeywords = item.keywords ? item.keywords.split(',').map(k => k.trim()) : [];
      const hasMatchingKeyword = filters.keywords.some(filterKeyword => 
        itemKeywords.includes(filterKeyword)
      );
      if (!hasMatchingKeyword) return false;
    }
    
    if (filters.editions.length > 0) {
      const itemEditions = item.edition ? item.edition.split(',').map(e => e.trim()) : [];
      const hasMatchingEdition = filters.editions.some(filterEdition => 
        itemEditions.includes(filterEdition)
      );
      if (!hasMatchingEdition) return false;
    }
    
    if (filters.skus.length > 0) {
      const itemSkus = item.sku ? item.sku.split(' / ').map(s => s.trim()) : [];
      const hasMatchingSku = filters.skus.some(filterSku => 
        itemSkus.includes(filterSku)
      );
      if (!hasMatchingSku) return false;
    }
    
    if (filters.collectionStatus && item.collection_status !== filters.collectionStatus) return false;
    if (filters.miniStatus && item.mini_status !== filters.miniStatus) return false;
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        item.sculpt_name?.toLowerCase().includes(searchLower) ||
        item.model_name?.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  const allFactions = [...new Set(collection.map(item => item.faction).filter(Boolean))].sort();
  
  const allKeywords = collection
    .map(item => item.keywords?.split(',').map(k => k.trim()))
    .flat()
    .filter(Boolean);
  const uniqueKeywords = [...new Set(allKeywords)].sort();
  
  const allEditions = collection
    .map(item => item.edition?.split(',').map(e => e.trim()))
    .flat()
    .filter(Boolean);
  const uniqueEditions = [...new Set(allEditions)].sort();
  
  const allSkus = collection
    .map(item => item.sku?.split(' / ').map(s => s.trim()))
    .flat()
    .filter(Boolean);
  const uniqueSkus = [...new Set(allSkus)].sort();

  const toggleFilter = (filterType, value) => {
    setFilters(prev => {
      const currentValues = prev[filterType];
      if (currentValues.includes(value)) {
        return { ...prev, [filterType]: currentValues.filter(v => v !== value) };
      } else {
        return { ...prev, [filterType]: [...currentValues, value] };
      }
    });
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Malifaux Stash</h1>
        <nav className="main-nav">
          <button 
            className={page === 'collection' ? 'active' : ''}
            onClick={() => setPage('collection')}
          >
            My Collection
          </button>
          <button 
            className={page === 'wishlist' ? 'active' : ''}
            onClick={() => setPage('wishlist')}
          >
            Wishlist
          </button>
        </nav>
      </header>

      <div className="container">
        {page === 'collection' ? (
          <>
            <AddToCollection onAdd={handleAdd} />

            <div className="filters">
              <input
                type="text"
                placeholder="Search collection..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="search-input"
              />

              <div className="filter-group">
                <label>Factions:</label>
                <div className="multi-select-tags">
                  {allFactions.map(faction => (
                    <button
                      key={faction}
                      className={`filter-tag ${filters.factions.includes(faction) ? 'active' : ''}`}
                      onClick={() => toggleFilter('factions', faction)}
                    >
                      {faction}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <label>Keywords:</label>
                <div className="multi-select-tags">
                  {uniqueKeywords.map(keyword => (
                    <button
                      key={keyword}
                      className={`filter-tag ${filters.keywords.includes(keyword) ? 'active' : ''}`}
                      onClick={() => toggleFilter('keywords', keyword)}
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <label>Editions:</label>
                <div className="multi-select-tags">
                  {uniqueEditions.map(edition => (
                    <button
                      key={edition}
                      className={`filter-tag ${filters.editions.includes(edition) ? 'active' : ''}`}
                      onClick={() => toggleFilter('editions', edition)}
                    >
                      {edition}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <label>SKUs:</label>
                <div className="multi-select-tags">
                  {uniqueSkus.map(sku => (
                    <button
                      key={sku}
                      className={`filter-tag ${filters.skus.includes(sku) ? 'active' : ''}`}
                      onClick={() => toggleFilter('skus', sku)}
                    >
                      {sku}
                    </button>
                  ))}
                </div>
              </div>

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
                factions: [], keywords: [], editions: [], skus: [],
                collectionStatus: '', miniStatus: '', search: ''
              })} className="clear-filters">
                Clear All Filters
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
          </>
        ) : (
          <WishlistView onAdd={handleAdd} onUpdate={handleUpdate} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}

export default App;