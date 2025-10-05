import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import UploadModal from './UploadModal';
import './CollectionEntryDetail.css';

const API_URL = 'http://localhost:3001/api';

function CollectionEntryDetail({ allSculpts, userCollection, onDataChange }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [collectionStatus, setCollectionStatus] = useState('');
  const [miniStatus, setMiniStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEntryDetails();
  }, [id]);

  const fetchEntryDetails = async () => {
    try {
      // Fetch collection entry
      const entryResponse = await axios.get(`${API_URL}/collection/${id}`);
      if (!entryResponse.data) {
        navigate('/collection');
        return;
      }
      const entryData = entryResponse.data;
      setEntry(entryData);
      setCollectionStatus(entryData.collection_status);
      setMiniStatus(entryData.mini_status);
      setNotes(entryData.notes || '');

      // Fetch uploads linked to this entry
      if (entryData.upload_ids) {
        const uploadIds = entryData.upload_ids.split(';').filter(id => id);
        if (uploadIds.length > 0) {
          const uploadsResponse = await axios.get(`${API_URL}/uploads`);
          const allUploads = uploadsResponse.data;
          const linkedUploads = allUploads.filter(upload => 
            uploadIds.includes(upload.id.toString())
          );
          setUploads(linkedUploads);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching entry details:', error);
      navigate('/collection');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`${API_URL}/collection/${id}`, {
        collectionStatus,
        miniStatus,
        notes,
        upload_ids: entry.upload_ids
      });

      await fetchEntryDetails();
      setEditing(false);
      onDataChange?.();
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Failed to save changes');
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to remove this entry from your collection?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/collection/${id}`);
      onDataChange?.();
      navigate('/collection');
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Failed to delete entry');
    }
  };

  const handleUploadSuccess = () => {
    fetchEntryDetails();
    onDataChange?.();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!entry) {
    return <div className="loading">Entry not found</div>;
  }

  // Find the sculpt object for this entry
  const sculpt = allSculpts.find(s => s.id === entry.sculpt_id);
  if (!sculpt) {
    return <div className="loading">Sculpt data not found</div>;
  }

  const displayName = sculpt.sculpt_name && sculpt.sculpt_name !== sculpt.model_name
    ? `${sculpt.model_name} - ${sculpt.sculpt_name}`
    : sculpt.model_name;

  return (
    <div className="collection-entry-detail">
      <div className="detail-header">
        <Link to="/collection" className="back-link">← Back to Collection</Link>
        <div className="detail-actions">
          {!editing && (
            <>
              <button onClick={() => setUploadModalOpen(true)} className="btn-primary">
                Add Picture
              </button>
              <button onClick={() => setEditing(true)} className="btn-secondary">
                Edit
              </button>
              <button onClick={handleDelete} className="btn-danger">
                Remove from Collection
              </button>
            </>
          )}
        </div>
      </div>

      <div className="entry-content">
        <div className="entry-header-section">
          <h1>{displayName}</h1>
          <div className="entry-badges">
            <span className="badge edition">{sculpt.edition}</span>
            {sculpt.faction.split(', ').map(faction => (
              <span key={faction} className="badge faction">{faction}</span>
            ))}
          </div>
        </div>

        {editing ? (
          <div className="edit-section">
            <h2>Edit Entry</h2>
            <div className="edit-form">
              <div className="form-group">
                <label>Collection Status</label>
                <select
                  value={collectionStatus}
                  onChange={(e) => setCollectionStatus(e.target.value)}
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
                  value={miniStatus}
                  onChange={(e) => setMiniStatus(e.target.value)}
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
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="3"
                  placeholder="Add any notes..."
                />
              </div>

              <div className="edit-actions">
                <button onClick={handleSave} disabled={saving} className="btn-primary">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={() => setEditing(false)} disabled={saving} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="info-grid">
            <div className="info-card">
              <h3>Collection Info</h3>
              <div className="info-item">
                <span className="info-label">Status:</span>
                <span className="info-value">{entry.collection_status}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Mini Status:</span>
                <span className="info-value">{entry.mini_status}</span>
              </div>
              {entry.notes && (
                <div className="info-item">
                  <span className="info-label">Notes:</span>
                  <span className="info-value">{entry.notes}</span>
                </div>
              )}
            </div>

            <div className="info-card">
              <h3>Model Details</h3>
              <div className="info-item">
                <span className="info-label">Keywords:</span>
                <span className="info-value">{sculpt.keywords}</span>
              </div>
              {sculpt.characteristics && (
                <div className="info-item">
                  <span className="info-label">Characteristics:</span>
                  <span className="info-value">{sculpt.characteristics}</span>
                </div>
              )}
              <div className="info-item">
                <span className="info-label">SKU:</span>
                <span className="info-value">{sculpt.sku}</span>
              </div>
            </div>
          </div>
        )}

        <div className="photos-section">
          <div className="photos-header">
            <h2>My Photos ({uploads.length})</h2>
            {!editing && uploads.length > 0 && (
              <button onClick={() => setUploadModalOpen(true)} className="btn-secondary btn-small">
                Add More
              </button>
            )}
          </div>

          {uploads.length === 0 ? (
            <div className="no-photos">
              <p>No photos yet for this model.</p>
              {!editing && (
                <button onClick={() => setUploadModalOpen(true)} className="btn-primary">
                  Upload First Photo
                </button>
              )}
            </div>
          ) : (
            <div className="photos-grid">
              {uploads.map(upload => (
                <Link
                  key={upload.id}
                  to={`/gallery/${upload.id}`}
                  className="photo-item"
                >
                  <img
                    src={`${API_URL.replace('/api', '')}/uploads/thumbs/${upload.filename}`}
                    alt={upload.caption || 'Photo'}
                  />
                  <div className="photo-overlay">
                    <div className="photo-info">
                      {upload.scene_tag && (
                        <span className="scene-badge">{upload.scene_tag}</span>
                      )}
                      {upload.status_tag && (
                        <span className="status-badge">{upload.status_tag}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        preSelectedSculpt={sculpt}
        allSculpts={allSculpts}
        userCollection={userCollection}
      />
    </div>
  );
}

export default CollectionEntryDetail;