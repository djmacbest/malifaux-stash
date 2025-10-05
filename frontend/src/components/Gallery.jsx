import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import axios from 'axios';
import UploadModal from './UploadModal';
import './Gallery.css';

const API_URL = 'http://localhost:3001/api';

function Gallery({ allSculpts, userCollection, onDataChange }) {
  const [uploads, setUploads] = useState([]);
  const [filteredUploads, setFilteredUploads] = useState([]);
  const [viewMode, setViewMode] = useState('masonry');
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Filters
  const [selectedFactions, setSelectedFactions] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [selectedEditions, setSelectedEditions] = useState([]);
  const [selectedSKUs, setSelectedSKUs] = useState([]);
  const [selectedSceneTags, setSelectedSceneTags] = useState([]);
  const [selectedStatusTag, setSelectedStatusTag] = useState('');

  useEffect(() => {
    fetchUploads();
  }, [allSculpts]);

  const fetchUploads = async () => {
    try {
      const response = await axios.get(`${API_URL}/uploads`);
      
      // Enrich uploads with sculpt details
      const enrichedData = response.data.map(upload => {
        const sculptIds = upload.sculpt_ids.split(';').filter(id => id);
        const sculpts = sculptIds.map(id => 
          allSculpts.find(s => s.id === parseInt(id))
        ).filter(Boolean);
        
        return {
          ...upload,
          sculpts
        };
      });
      
      setUploads(enrichedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching uploads:', error);
      setLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    let filtered = [...uploads];

    if (selectedFactions.length > 0) {
      filtered = filtered.filter(upload => 
        upload.sculpts.some(sculpt => 
          sculpt.faction.split(', ').some(f => selectedFactions.includes(f))
        )
      );
    }

    if (selectedKeywords.length > 0) {
      filtered = filtered.filter(upload =>
        upload.sculpts.some(sculpt =>
          sculpt.keywords.split(', ').some(k => selectedKeywords.includes(k))
        )
      );
    }

    if (selectedEditions.length > 0) {
      filtered = filtered.filter(upload =>
        upload.sculpts.some(sculpt =>
          sculpt.edition.split(', ').some(e => selectedEditions.includes(e))
        )
      );
    }

    if (selectedSKUs.length > 0) {
      filtered = filtered.filter(upload =>
        upload.sculpts.some(sculpt =>
          sculpt.sku.split(' / ').some(s => selectedSKUs.includes(s))
        )
      );
    }

    if (selectedSceneTags.length > 0) {
      filtered = filtered.filter(upload => selectedSceneTags.includes(upload.scene_tag));
    }

    if (selectedStatusTag) {
      filtered = filtered.filter(upload => upload.status_tag === selectedStatusTag);
    }

    setFilteredUploads(filtered);
  }, [uploads, selectedFactions, selectedKeywords, selectedEditions, selectedSKUs, selectedSceneTags, selectedStatusTag]);

  // Prepare filter options
  const factionOptions = [...new Set(allSculpts.flatMap(s => s.faction.split(', ')))].sort();
  const keywordOptions = [...new Set(allSculpts.flatMap(s => s.keywords.split(', ')))].sort();
  const editionOptions = [...new Set(allSculpts.flatMap(s => s.edition.split(', ')))].sort();
  const skuOptions = [...new Set(allSculpts.flatMap(s => s.sku.split(' / ')))].sort();
  
  const sceneTagOptions = ['Individual Mini', 'Collage', 'Crew Picture', 'Battle Snapshot'];

  const toggleFilter = (filterType, value, setFilter) => {
    setFilter(prev => 
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const clearFilters = () => {
    setSelectedFactions([]);
    setSelectedKeywords([]);
    setSelectedEditions([]);
    setSelectedSKUs([]);
    setSelectedSceneTags([]);
    setSelectedStatusTag('');
  };

  const handleUploadSuccess = () => {
    fetchUploads();
    onDataChange?.();
  };

  const breakpointColumns = {
    default: 4,
    1400: 3,
    1000: 2,
    700: 1
  };

  if (loading) {
    return <div className="loading">Loading gallery...</div>;
  }

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h2>Gallery</h2>
        <div className="gallery-actions">
          <button onClick={() => setUploadModalOpen(true)} className="btn-primary">
            Upload Picture
          </button>
          <div className="view-toggle">
            <button
              className={viewMode === 'masonry' ? 'active' : ''}
              onClick={() => setViewMode('masonry')}
            >
              Grid
            </button>
            <button
              className={viewMode === 'list' ? 'active' : ''}
              onClick={() => setViewMode('list')}
            >
              List
            </button>
          </div>
        </div>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label>Factions:</label>
          <div className="multi-select-tags">
            {factionOptions.map(faction => (
              <button
                key={faction}
                className={`filter-tag ${selectedFactions.includes(faction) ? 'active' : ''}`}
                onClick={() => toggleFilter('factions', faction, setSelectedFactions)}
              >
                {faction}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>Keywords:</label>
          <div className="multi-select-tags">
            {keywordOptions.map(keyword => (
              <button
                key={keyword}
                className={`filter-tag ${selectedKeywords.includes(keyword) ? 'active' : ''}`}
                onClick={() => toggleFilter('keywords', keyword, setSelectedKeywords)}
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>Editions:</label>
          <div className="multi-select-tags">
            {editionOptions.map(edition => (
              <button
                key={edition}
                className={`filter-tag ${selectedEditions.includes(edition) ? 'active' : ''}`}
                onClick={() => toggleFilter('editions', edition, setSelectedEditions)}
              >
                {edition}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>SKUs:</label>
          <div className="multi-select-tags">
            {skuOptions.map(sku => (
              <button
                key={sku}
                className={`filter-tag ${selectedSKUs.includes(sku) ? 'active' : ''}`}
                onClick={() => toggleFilter('skus', sku, setSelectedSKUs)}
              >
                {sku}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>Scene Tags:</label>
          <div className="multi-select-tags">
            {sceneTagOptions.map(tag => (
              <button
                key={tag}
                className={`filter-tag ${selectedSceneTags.includes(tag) ? 'active' : ''}`}
                onClick={() => toggleFilter('sceneTags', tag, setSelectedSceneTags)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>Status:</label>
          <select
            value={selectedStatusTag}
            onChange={(e) => setSelectedStatusTag(e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="Fully Painted">Fully Painted</option>
            <option value="WIP">WIP</option>
          </select>
        </div>

        <button onClick={clearFilters} className="clear-filters">
          Clear All Filters
        </button>
      </div>

      <div className="results-count">
        Showing {filteredUploads.length} of {uploads.length} uploads
      </div>

      {viewMode === 'masonry' ? (
        <Masonry
          breakpointCols={breakpointColumns}
          className="masonry-grid"
          columnClassName="masonry-column"
        >
          {filteredUploads.map(upload => (
            <Link
              key={upload.id}
              to={`/gallery/${upload.id}`}
              className="masonry-item"
            >
              <img
                src={`${API_URL.replace('/api', '')}/uploads/thumbs/${upload.filename}`}
                alt={upload.caption || 'Miniature'}
                loading="lazy"
              />
              <div className="masonry-overlay">
                <div className="masonry-info">
                  {upload.sculpts.map(sculpt => (
                    <div key={sculpt.id} className="sculpt-name">
                      {sculpt.model_name}
                    </div>
                  ))}
                  {upload.caption && (
                    <div className="caption-preview">
                      {upload.caption.substring(0, 80)}{upload.caption.length > 80 ? '...' : ''}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </Masonry>
      ) : (
        <div className="list-view">
          {filteredUploads.map(upload => (
            <Link
              key={upload.id}
              to={`/gallery/${upload.id}`}
              className="list-item"
            >
              <img
                src={`${API_URL.replace('/api', '')}/uploads/thumbs/${upload.filename}`}
                alt={upload.caption || 'Miniature'}
                className="list-thumbnail"
              />
              <div className="list-details">
                <h3>
                  {upload.sculpts.map(s => s.model_name).join(', ')}
                </h3>
                <div className="list-meta">
                  <span className="meta-item">
                    <strong>Sculpts:</strong> {upload.sculpts.map(s => 
                      s.sculpt_name && s.sculpt_name !== s.model_name
                        ? `${s.sculpt_name} [${s.edition}]`
                        : `[${s.edition}]`
                    ).join(', ')}
                  </span>
                  <span className="meta-item">
                    <strong>Faction:</strong> {[...new Set(upload.sculpts.flatMap(s => s.faction.split(', ')))].join(', ')}
                  </span>
                  <span className="meta-item">
                    <strong>Keywords:</strong> {[...new Set(upload.sculpts.flatMap(s => s.keywords.split(', ')))].join(', ')}
                  </span>
                  <span className="meta-item">
                    <strong>Scene:</strong> {upload.scene_tag}
                  </span>
                  {upload.status_tag && (
                    <span className="meta-item">
                      <strong>Status:</strong> {upload.status_tag}
                    </span>
                  )}
                </div>
                {upload.caption && (
                  <p className="list-caption">{upload.caption}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {filteredUploads.length === 0 && (
        <div className="empty-state">
          <p>No uploads found matching your filters.</p>
        </div>
      )}

      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        allSculpts={allSculpts}
        userCollection={userCollection}
      />
    </div>
  );
}

export default Gallery;