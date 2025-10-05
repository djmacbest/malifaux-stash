import { useState } from 'react';
import AsyncSelect from 'react-select/async';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

function AddToCollection({ onAdd }) {
  const [selectedSculpt, setSelectedSculpt] = useState(null);
  const [collectionStatus, setCollectionStatus] = useState('Owned');
  const [miniStatus, setMiniStatus] = useState('Unassembled');
  const [notes, setNotes] = useState('');
  const [showForm, setShowForm] = useState(false);

  const loadOptions = async (inputValue) => {
    if (!inputValue || inputValue.length < 2) {
      return [];
    }

    try {
      const response = await axios.get(`${API_URL}/sculpts/search`, {
        params: { q: inputValue }
      });

      return response.data.map(sculpt => ({
        value: sculpt.id,
        label: `[${sculpt.edition}] ${sculpt.sculpt_name} (${sculpt.model_name})`,
        sculpt
      }));
    } catch (error) {
      console.error('Error searching sculpts:', error);
      return [];
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSculpt) {
      alert('Please select a sculpt');
      return;
    }

    onAdd(selectedSculpt.value, collectionStatus, miniStatus, notes);
    
    // Reset form
    setSelectedSculpt(null);
    setCollectionStatus('Owned');
    setMiniStatus('Unassembled');
    setNotes('');
    setShowForm(false);
  };

  return (
    <div className="add-to-collection">
      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="btn-primary">
          + Add to Collection
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="add-form">
          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label>Search Sculpt</label>
              <AsyncSelect
                cacheOptions
                loadOptions={loadOptions}
                value={selectedSculpt}
                onChange={setSelectedSculpt}
                placeholder="Type to search sculpts, models, factions..."
                noOptionsMessage={({ inputValue }) =>
                  inputValue.length < 2 ? 'Type at least 2 characters' : 'No results found'
                }
              />
            </div>

            <div className="form-group">
              <label>Collection Status</label>
              <select
                value={collectionStatus}
                onChange={(e) => setCollectionStatus(e.target.value)}
                required
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
                required
              >
                <option value="Unassembled">Unassembled</option>
                <option value="Assembled">Assembled</option>
                <option value="Primed">Primed</option>
                <option value="Painting WIP">Painting WIP</option>
                <option value="Painted">Painted</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes..."
              rows="2"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">Add to Collection</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default AddToCollection;