import { useState } from 'react';

function CollectionView({ collection, view, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditData({
      collectionStatus: item.collection_status,
      miniStatus: item.mini_status,
      notes: item.notes || ''
    });
  };

  const saveEdit = (id) => {
    onUpdate(id, editData.collectionStatus, editData.miniStatus, editData.notes);
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  if (collection.length === 0) {
    return (
      <div className="empty-state">
        <p>Your collection is empty. Add your first miniature above!</p>
      </div>
    );
  }

  // Table View
  if (view === 'table') {
    return (
      <div className="table-view">
        <table>
          <thead>
            <tr>
              <th>Sculpt Name</th>
              <th>Model</th>
              <th>Faction</th>
              <th>Edition</th>
              <th>Collection Status</th>
              <th>Mini Status</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {collection.map(item => (
              <tr key={item.id}>
                {editingId === item.id ? (
                  <>
                    <td>{item.sculpt_name}</td>
                    <td>{item.model_name}</td>
                    <td>{item.faction}</td>
                    <td>{item.edition}</td>
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
                      <button onClick={() => saveEdit(item.id)} className="btn-small">Save</button>
                      <button onClick={cancelEdit} className="btn-small">Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{item.sculpt_name}</td>
                    <td>{item.model_name}</td>
                    <td>{item.faction}</td>
                    <td>{item.edition}</td>
                    <td><span className="status-badge">{item.collection_status}</span></td>
                    <td><span className="status-badge">{item.mini_status}</span></td>
                    <td>{item.notes}</td>
                    <td>
                      <button onClick={() => startEdit(item)} className="btn-small">Edit</button>
                      <button onClick={() => onDelete(item.id)} className="btn-small btn-danger">Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Grid View
  if (view === 'grid') {
    return (
      <div className="grid-view">
        {collection.map(item => (
          <div key={item.id} className="grid-card">
            <h3>{item.sculpt_name}</h3>
            <p className="model-name">{item.model_name}</p>
            <p className="faction">{item.faction}</p>
            <div className="card-details">
              <div className="detail-row">
                <span className="label">Edition:</span>
                <span>{item.edition}</span>
              </div>
              <div className="detail-row">
                <span className="label">Collection:</span>
                <span className="status-badge">{item.collection_status}</span>
              </div>
              <div className="detail-row">
                <span className="label">Mini:</span>
                <span className="status-badge">{item.mini_status}</span>
              </div>
              {item.notes && (
                <div className="detail-row">
                  <span className="label">Notes:</span>
                  <span>{item.notes}</span>
                </div>
              )}
            </div>
            <div className="card-actions">
              <button onClick={() => startEdit(item)} className="btn-small">Edit</button>
              <button onClick={() => onDelete(item.id)} className="btn-small btn-danger">Delete</button>
            </div>
          </div>
        ))}

        {editingId && (
          <div className="modal-overlay" onClick={cancelEdit}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Edit Collection Entry</h2>
              <div className="form-group">
                <label>Collection Status</label>
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
              </div>
              <div className="form-group">
                <label>Mini Status</label>
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
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={editData.notes}
                  onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="modal-actions">
                <button onClick={() => saveEdit(editingId)} className="btn-primary">Save</button>
                <button onClick={cancelEdit} className="btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Kanban View
  if (view === 'kanban') {
    const columns = ['Unassembled', 'Assembled', 'Primed', 'Painting WIP', 'Painted'];
    
    return (
      <div className="kanban-view">
        {columns.map(status => (
          <div key={status} className="kanban-column">
            <h3>{status} ({collection.filter(item => item.mini_status === status).length})</h3>
            <div className="kanban-cards">
              {collection
                .filter(item => item.mini_status === status)
                .map(item => (
                  <div key={item.id} className="kanban-card">
                    <h4>{item.sculpt_name}</h4>
                    <p className="model-name">{item.model_name}</p>
                    <p className="faction">{item.faction}</p>
                    <span className="status-badge">{item.collection_status}</span>
                    {item.notes && <p className="notes">{item.notes}</p>}
                    <div className="card-actions">
                      <button onClick={() => startEdit(item)} className="btn-small">Edit</button>
                      <button onClick={() => onDelete(item.id)} className="btn-small btn-danger">Delete</button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}

        {editingId && (
          <div className="modal-overlay" onClick={cancelEdit}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Edit Collection Entry</h2>
              <div className="form-group">
                <label>Collection Status</label>
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
              </div>
              <div className="form-group">
                <label>Mini Status</label>
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
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={editData.notes}
                  onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="modal-actions">
                <button onClick={() => saveEdit(editingId)} className="btn-primary">Save</button>
                <button onClick={cancelEdit} className="btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default CollectionView;