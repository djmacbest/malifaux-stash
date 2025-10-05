import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

function WishlistView({ onAdd, onUpdate, onDelete }) {
  const [wishlistData, setWishlistData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingItem, setAddingItem] = useState(null);
  const [notes, setNotes] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    loadWishlistData();
  }, []);

  const loadWishlistData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/wishlist`);
      setWishlistData(response.data);
    } catch (error) {
      console.error('Error loading wishlist data:', error);
    } finally {
      setLoading(false);
    }
  };

  // First, identify which SKUs actually contain wishlisted items
  const wishlistedSkus = new Set();
  wishlistData.forEach(item => {
    if (item.collection_status === 'Wishlist' && item.sku) {
      item.sku.split(' / ').forEach(sku => wishlistedSkus.add(sku.trim()));
    }
  });

  // Group data by SKU, but ONLY for SKUs that contain wishlisted items
  const groupedBySku = {};
  wishlistData.forEach(item => {
    if (!item.sku) return;
    
    // Each sculpt can be in multiple SKUs
    const skus = item.sku.split(' / ').map(s => s.trim());
    skus.forEach(sku => {
      // Only create groups for SKUs that have at least one wishlisted item
      if (wishlistedSkus.has(sku)) {
        if (!groupedBySku[sku]) {
          groupedBySku[sku] = [];
        }
        // Avoid duplicates
        if (!groupedBySku[sku].find(existing => existing.sculpt_id === item.sculpt_id)) {
          groupedBySku[sku].push(item);
        }
      }
    });
  });

  const handleQuickAdd = async () => {
    if (!addingItem) return;
    
    await onAdd(addingItem.sculpt_id, 'Wishlist', 'Unassembled', notes);
    setAddingItem(null);
    setNotes('');
    loadWishlistData();
  };

  const startEdit = (item) => {
    setEditingId(item.collection_id);
    setEditData({
      collectionStatus: item.collection_status,
      miniStatus: item.mini_status || 'Unassembled',
      notes: item.notes || ''
    });
  };

  const saveEdit = async (collectionId) => {
    await onUpdate(collectionId, editData.collectionStatus, editData.miniStatus, editData.notes);
    setEditingId(null);
    loadWishlistData();
  };

  const handleDelete = async (collectionId) => {
    await onDelete(collectionId);
    loadWishlistData();
  };

  const formatSculptDisplay = (item) => {
    const edition = item.edition ? `[${item.edition}]` : '';
    if (item.sculpt_name === item.model_name) {
      return edition;
    }
    return `${edition} ${item.sculpt_name}`.trim();
  };

  const getStatusBadgeClass = (status) => {
    if (status === 'Wishlist') return 'status-wishlist';
    if (status) return 'status-owned';
    return 'status-unowned';
  };

  if (loading) {
    return <div className="loading">Loading wishlist...</div>;
  }

  if (Object.keys(groupedBySku).length === 0) {
    return (
      <div className="empty-state">
        <p>Your wishlist is empty. Add items with "Wishlist" status from your collection!</p>
      </div>
    );
  }

  return (
    <div className="wishlist-view">
      <h2>Wishlist by SKU</h2>
      <p className="wishlist-subtitle">Showing all models in boxes that contain wishlisted items</p>

      {Object.entries(groupedBySku).sort(([a], [b]) => a.localeCompare(b)).map(([sku, items]) => (
        <div key={sku} className="sku-group">
          <h3 className="sku-header">{sku}</h3>
          <table className="wishlist-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Model</th>
                <th>Sculpt</th>
                <th>Faction</th>
                <th>Keywords</th>
                <th>Collection</th>
                <th>Mini Status</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={`${item.sculpt_id}-${item.collection_id || 'unowned'}`} className={!item.collection_id ? 'unowned-row' : ''}>
                  {editingId === item.collection_id && item.collection_id ? (
                    // Edit mode - only for items in collection
                    <>
                      <td>
                        <span className={`status-indicator ${getStatusBadgeClass(item.collection_status)}`}></span>
                      </td>
                      <td>{item.model_name}</td>
                      <td>{formatSculptDisplay(item)}</td>
                      <td>{item.faction}</td>
                      <td>{item.keywords}</td>
                      <td>
                        <select
                          value={editData.collectionStatus}
                          onChange={(e) => setEditData({ ...editData, collectionStatus: e.target.value })}
                        >
                          <option value="Owned">Owned</option>
                          <option value="Wishlist">Wishlist</option>
                          <option value="To Sell">To Sell</option>
                          <option value="Sold">Sold</option>
                          <option value="Other">Other</option>
                        </select>
                      </td>
                      <td>
                        <select
                          value={editData.miniStatus}
                          onChange={(e) => setEditData({ ...editData, miniStatus: e.target.value })}
                        >
                          <option value="Unassembled">Unassembled</option>
                          <option value="Assembled">Assembled</option>
                          <option value="Primed">Primed</option>
                          <option value="Painting WIP">Painting WIP</option>
                          <option value="Painted">Painted</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          value={editData.notes}
                          onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                        />
                      </td>
                      <td>
                        <button onClick={() => saveEdit(item.collection_id)} className="btn-small">Save</button>
                        <button onClick={() => setEditingId(null)} className="btn-small">Cancel</button>
                      </td>
                    </>
                  ) : (
                    // View mode
                    <>
                      <td>
                        <span className={`status-indicator ${getStatusBadgeClass(item.collection_status)}`}></span>
                      </td>
                      <td>{item.model_name}</td>
                      <td>{formatSculptDisplay(item)}</td>
                      <td>{item.faction}</td>
                      <td>{item.keywords}</td>
                      <td>
                        {item.collection_id ? (
                          <span className="status-badge">{item.collection_status}</span>
                        ) : (
                          <span className="status-unowned">Unowned</span>
                        )}
                      </td>
                      <td>{item.mini_status || '-'}</td>
                      <td>{item.notes || '-'}</td>
                      <td>
                        {item.collection_id ? (
                          <>
                            <button onClick={() => startEdit(item)} className="btn-small">Edit</button>
                            <button onClick={() => handleDelete(item.collection_id)} className="btn-small btn-danger">Delete</button>
                          </>
                        ) : (
                          <button onClick={() => setAddingItem(item)} className="btn-small btn-wishlist">
                            Wishlist Now
                          </button>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {addingItem && (
        <div className="modal-overlay" onClick={() => setAddingItem(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add to Wishlist</h2>
            <div className="modal-info">
              <p><strong>Model:</strong> {addingItem.model_name}</p>
              <p><strong>Sculpt:</strong> {formatSculptDisplay(addingItem)}</p>
              <p><strong>Faction:</strong> {addingItem.faction}</p>
            </div>
            <div className="form-group">
              <label>Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this wishlist item..."
                rows="3"
                autoFocus
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleQuickAdd} className="btn-primary">Add to Wishlist</button>
              <button onClick={() => { setAddingItem(null); setNotes(''); }} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WishlistView;