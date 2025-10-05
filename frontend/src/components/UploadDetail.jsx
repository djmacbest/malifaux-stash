import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AsyncSelect from 'react-select/async';
import axios from 'axios';
import './UploadDetail.css';

const API_URL = 'http://localhost:3001/api';

function UploadDetail({ allSculpts }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [upload, setUpload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [caption, setCaption] = useState('');
  const [selectedSculpts, setSelectedSculpts] = useState([]);
  const [sceneTag, setSceneTag] = useState('');
  const [statusTag, setStatusTag] = useState('');
  const [saving, setSaving] = useState(false);

  const sceneOptions = [
    { value: 'Individual Mini', label: 'Individual Mini' },
    { value: 'Collage', label: 'Collage' },
    { value: 'Crew Picture', label: 'Crew Picture' },
    { value: 'Battle Snapshot', label: 'Battle Snapshot' }
  ];

  const statusOptions = [
    { value: '', label: 'Not specified' },
    { value: 'Fully Painted', label: 'Fully Painted' },
    { value: 'WIP', label: 'WIP' }
  ];

  useEffect(() => {
    fetchUpload();
  }, [id]);

  const fetchUpload = async () => {
    try {
      const response = await axios.get(`${API_URL}/uploads/${id}`);
      if (!response.data) {
        navigate('/gallery');
        return;
      }
      const data = response.data;
      
      // Enrich with sculpt details
      const sculptIds = data.sculpt_ids.split(';').filter(id => id);
      const sculpts = sculptIds.map(sid => 
        allSculpts.find(s => s.id === parseInt(sid))
      ).filter(Boolean);
      
      setUpload({ ...data, sculpts });
      setCaption(data.caption || '');
      setSceneTag(data.scene_tag);
      setStatusTag(data.status_tag || '');
      
      // Set selected sculpts for editing
      const sculptOptions = sculpts.map(s => ({
        value: s.id,
        label: s.sculpt_name && s.sculpt_name !== s.model_name
          ? `${s.sculpt_name} (${s.model_name}) [${s.edition}]`
          : `${s.model_name} [${s.edition}]`
      }));
      setSelectedSculpts(sculptOptions);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching upload:', error);
      navigate('/gallery');
    }
  };

  const loadSculptOptions = async (inputValue) => {
    if (!inputValue || inputValue.length < 2) return [];

    try {
      const response = await axios.get(`${API_URL}/sculpts/search`, {
        params: { q: inputValue }
      });

      return response.data.map(sculpt => ({
        value: sculpt.id,
        label: sculpt.sculpt_name === sculpt.model_name 
          ? `${sculpt.model_name} [${sculpt.edition}]`
          : `${sculpt.sculpt_name} (${sculpt.model_name}) [${sculpt.edition}]`
      }));
    } catch (error) {
      console.error('Error searching sculpts:', error);
      return [];
    }
  };

  const handleSave = async () => {
    if (selectedSculpts.length === 0) {
      alert('At least one sculpt must be tagged');
      return;
    }

    setSaving(true);
    try {
      await axios.put(`${API_URL}/uploads/${id}`, {
        caption,
        sculpt_ids: selectedSculpts.map(s => s.value).join(';'),
        scene_tag: sceneTag,
        status_tag: statusTag
      });

      await fetchUpload();
      setEditing(false);
    } catch (error) {
      console.error('Error saving upload:', error);
      alert('Failed to save changes');
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this upload? This cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/uploads/${id}`);
      navigate('/gallery');
    } catch (error) {
      console.error('Error deleting upload:', error);
      alert('Failed to delete upload');
    }
  };

  // Parse caption for hashtags
  const renderCaption = (text) => {
    if (!text) return null;
    const parts = text.split(/(#\w+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('#')) {
        return (
          <span key={i} className="hashtag">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!upload) {
    return <div className="loading">Upload not found</div>;
  }

  const allFactions = [...new Set(upload.sculpts.flatMap(s => s.faction.split(', ')))];
  const allKeywords = [...new Set(upload.sculpts.flatMap(s => s.keywords.split(', ')))];

  return (
    <div className="upload-detail-container">
      <div className="detail-header">
        <Link to="/gallery" className="back-link">← Back to Gallery</Link>
        <div className="detail-actions">
          {!editing && (
            <>
              <button onClick={() => setEditing(true)} className="btn-secondary">
                Edit
              </button>
              <button onClick={handleDelete} className="btn-danger">
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-image">
          <img
            src={`${API_URL.replace('/api', '')}/uploads/full/${upload.filename}`}
            alt={upload.caption || 'Miniature'}
          />
        </div>

        <div className="detail-info">
          {editing ? (
            <div className="edit-form">
              <h2>Edit Upload</h2>

              <div className="form-group">
                <label>Tagged Sculpts *</label>
                <AsyncSelect
                  isMulti
                  cacheOptions
                  value={selectedSculpts}
                  onChange={setSelectedSculpts}
                  loadOptions={loadSculptOptions}
                  placeholder="Search and select sculpts..."
                  noOptionsMessage={({ inputValue }) =>
                    inputValue.length < 2 ? 'Type at least 2 characters' : 'No results found'
                  }
                />
              </div>

              <div className="form-group">
                <label>Scene Tag *</label>
                <select
                  value={sceneTag}
                  onChange={(e) => setSceneTag(e.target.value)}
                >
                  {sceneOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Status Tag</label>
                <select
                  value={statusTag}
                  onChange={(e) => setStatusTag(e.target.value)}
                >
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Caption</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={4}
                  placeholder="Describe your work..."
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
          ) : (
            <>
              <div className="info-section">
                <h2>Models</h2>
                <div className="model-list">
                  {upload.sculpts.map(sculpt => (
                    <div key={sculpt.id} className="model-item">
                      <strong>{sculpt.model_name}</strong>
                      {sculpt.sculpt_name && sculpt.sculpt_name !== sculpt.model_name && (
                        <span className="sculpt-variant"> - {sculpt.sculpt_name}</span>
                      )}
                      <span className="edition-badge">[{sculpt.edition}]</span>
                    </div>
                  ))}
                </div>
              </div>

              {upload.caption && (
                <div className="info-section">
                  <h3>Caption</h3>
                  <p className="caption-text">{renderCaption(upload.caption)}</p>
                </div>
              )}

              <div className="info-section">
                <h3>Details</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Scene:</span>
                    <span className="detail-value">{upload.scene_tag}</span>
                  </div>
                  {upload.status_tag && (
                    <div className="detail-item">
                      <span className="detail-label">Status:</span>
                      <span className="detail-value">{upload.status_tag}</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <span className="detail-label">Uploaded:</span>
                    <span className="detail-value">
                      {new Date(upload.upload_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Uploader:</span>
                    <span className="detail-value">{upload.uploader}</span>
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h3>Factions</h3>
                <div className="tag-list">
                  {allFactions.map(faction => (
                    <span key={faction} className="tag-item">
                      {faction}
                    </span>
                  ))}
                </div>
              </div>

              <div className="info-section">
                <h3>Keywords</h3>
                <div className="tag-list">
                  {allKeywords.map(keyword => (
                    <span key={keyword} className="tag-item">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadDetail;