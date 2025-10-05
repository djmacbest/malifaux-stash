import { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import axios from 'axios';
import './UploadModal.css';

const API_URL = 'http://localhost:3001/api';

function UploadModal({ isOpen, onClose, onUploadSuccess, preSelectedSculpt = null, allSculpts = [], userCollection = [] }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [caption, setCaption] = useState('');
  const [selectedSculpts, setSelectedSculpts] = useState([]);
  const [sceneTag, setSceneTag] = useState('');
  const [statusTag, setStatusTag] = useState('');
  const [collectionLinks, setCollectionLinks] = useState({}); // { sculptId: collectionId }
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showAddToCollection, setShowAddToCollection] = useState(false);
  const [unownedSculpts, setUnownedSculpts] = useState([]);
  const [currentUnownedIndex, setCurrentUnownedIndex] = useState(0);

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

  // Load sculpt options for AsyncSelect
  const loadSculptOptions = async (inputValue) => {
    if (!inputValue || inputValue.length < 2) {
      return [];
    }

    try {
      const response = await axios.get(`${API_URL}/sculpts/search`, {
        params: { q: inputValue }
      });

      return response.data.map(sculpt => {
        const isInCollection = userCollection.some(item => item.sculpt_id === sculpt.id);
        const displayName = sculpt.sculpt_name === sculpt.model_name 
          ? `${sculpt.model_name} [${sculpt.edition}]`
          : `${sculpt.sculpt_name} (${sculpt.model_name}) [${sculpt.edition}]`;
        
        return {
          value: sculpt.id,
          label: displayName,
          sculpt: sculpt,
          isInCollection
        };
      }).sort((a, b) => {
        // Prioritize collection items
        if (a.isInCollection && !b.isInCollection) return -1;
        if (!a.isInCollection && b.isInCollection) return 1;
        return a.label.localeCompare(b.label);
      });
    } catch (error) {
      console.error('Error searching sculpts:', error);
      return [];
    }
  };

  // Initialize with pre-selected sculpt if provided
  useEffect(() => {
    if (preSelectedSculpt && isOpen) {
      const displayName = preSelectedSculpt.sculpt_name === preSelectedSculpt.model_name
        ? `${preSelectedSculpt.model_name} [${preSelectedSculpt.edition}]`
        : `${preSelectedSculpt.sculpt_name} (${preSelectedSculpt.model_name}) [${preSelectedSculpt.edition}]`;
      
      const sculptOption = {
        value: preSelectedSculpt.id,
        label: displayName,
        sculpt: preSelectedSculpt,
        isInCollection: true
      };
      
      setSelectedSculpts([sculptOption]);
      
      // Auto-check collection link if sculpt is in collection
      const collectionItem = userCollection.find(item => item.sculpt_id === preSelectedSculpt.id);
      if (collectionItem) {
        setCollectionLinks({ [preSelectedSculpt.id]: collectionItem.id });
      }
    }
  }, [preSelectedSculpt, isOpen]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please select a JPG, PNG, or WebP image');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleCollectionLinkToggle = (sculptId, collectionId) => {
    setCollectionLinks(prev => {
      const newLinks = { ...prev };
      if (newLinks[sculptId]) {
        delete newLinks[sculptId];
      } else {
        newLinks[sculptId] = collectionId;
      }
      return newLinks;
    });
  };

  const handleUpload = async () => {
    // Validation
    if (!selectedFile) {
      setError('Please select an image');
      return;
    }
    if (selectedSculpts.length === 0) {
      setError('Please tag at least one sculpt');
      return;
    }
    if (!sceneTag) {
      setError('Please select a scene tag');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('caption', caption);
      formData.append('sculpt_ids', selectedSculpts.map(s => s.value).join(';'));
      formData.append('scene_tag', sceneTag);
      formData.append('status_tag', statusTag);
      
      // Add collection IDs that should be linked
      const linkedCollectionIds = Object.values(collectionLinks).join(',');
      if (linkedCollectionIds) {
        formData.append('collection_ids', linkedCollectionIds);
      }

      const response = await axios.post(`${API_URL}/uploads`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Check for unowned sculpts
      const unowned = selectedSculpts.filter(option => {
        return !userCollection.some(item => item.sculpt_id === option.value);
      });

      if (unowned.length > 0) {
        setUnownedSculpts(unowned);
        setCurrentUnownedIndex(0);
        setShowAddToCollection(true);
      } else {
        // No unowned sculpts, close immediately
        onUploadSuccess(response.data);
        resetAndClose();
      }

    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setUploading(false);
    }
  };

  const handleAddToCollection = async (add) => {
    if (add) {
      const sculptToAdd = unownedSculpts[currentUnownedIndex];
      try {
        await axios.post(`${API_URL}/collection`, {
          sculptId: sculptToAdd.value,
          collectionStatus: 'Owned',
          miniStatus: 'Unassembled',
          notes: ''
        });
      } catch (err) {
        console.error('Failed to add to collection:', err);
      }
    }

    // Move to next unowned sculpt or finish
    if (currentUnownedIndex < unownedSculpts.length - 1) {
      setCurrentUnownedIndex(currentUnownedIndex + 1);
    } else {
      onUploadSuccess();
      resetAndClose();
    }
  };

  const resetAndClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setCaption('');
    setSelectedSculpts([]);
    setSceneTag('');
    setStatusTag('');
    setCollectionLinks({});
    setError('');
    setUploading(false);
    setShowAddToCollection(false);
    setUnownedSculpts([]);
    setCurrentUnownedIndex(0);
    onClose();
  };

  if (!isOpen) return null;

  if (showAddToCollection) {
    const currentSculpt = unownedSculpts[currentUnownedIndex];
    return (
      <div className="modal-overlay" onClick={resetAndClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>Add to Collection?</h2>
          <p>
            I noticed you uploaded a picture showing <strong>{currentSculpt.label}</strong>.
            Is this your own model and do you want to add it to your collection now?
          </p>
          <div className="modal-actions">
            <button onClick={() => handleAddToCollection(true)} className="btn-primary">
              Yes, Add to Collection
            </button>
            <button onClick={() => handleAddToCollection(false)} className="btn-secondary">
              No, Skip
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={resetAndClose}>
      <div className="modal-content upload-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Upload Picture</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="upload-form">
          {/* File Selection */}
          <div className="form-group">
            <label>Image File *</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              disabled={uploading}
            />
            {previewUrl && (
              <div className="image-preview">
                <img src={previewUrl} alt="Preview" />
              </div>
            )}
          </div>

          {/* Sculpt Tags */}
          <div className="form-group">
            <label>Tag Sculpts * (collection items shown first)</label>
            <AsyncSelect
              isMulti
              cacheOptions
              value={selectedSculpts}
              onChange={setSelectedSculpts}
              loadOptions={loadSculptOptions}
              placeholder="Search and select sculpts..."
              isDisabled={uploading}
              noOptionsMessage={({ inputValue }) =>
                inputValue.length < 2 ? 'Type at least 2 characters' : 'No results found'
              }
            />
          </div>

          {/* Collection Links */}
          {selectedSculpts.length > 0 && (
            <div className="form-group collection-links">
              <label>Link to Collection Entries</label>
              {selectedSculpts.map(option => {
                const collectionItem = userCollection.find(item => item.sculpt_id === option.value);
                if (!collectionItem) return null;

                return (
                  <div key={option.value} className="collection-link-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={!!collectionLinks[option.value]}
                        onChange={() => handleCollectionLinkToggle(option.value, collectionItem.id)}
                        disabled={uploading}
                      />
                      Add to my {option.label} collection entry
                    </label>
                  </div>
                );
              })}
            </div>
          )}

          {/* Scene Tag */}
          <div className="form-group">
            <label>Scene Tag *</label>
            <select
              value={sceneTag}
              onChange={(e) => setSceneTag(e.target.value)}
              disabled={uploading}
            >
              <option value="">Select scene tag...</option>
              {sceneOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Status Tag */}
          <div className="form-group">
            <label>Status Tag</label>
            <select
              value={statusTag}
              onChange={(e) => setStatusTag(e.target.value)}
              disabled={uploading}
            >
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Caption */}
          <div className="form-group">
            <label>Caption (hashtags supported: #NMM #basing)</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Describe your work..."
              rows={3}
              disabled={uploading}
            />
          </div>
        </div>

        <div className="modal-actions">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="btn-primary"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
          <button
            onClick={resetAndClose}
            disabled={uploading}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadModal;