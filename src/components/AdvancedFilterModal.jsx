import { useState, useEffect } from 'react';
import './AdvancedFilterModal.css';

function AdvancedFilterModal({ isOpen, onClose, advancedFilters, onApply }) {
  const [localFilters, setLocalFilters] = useState({
    minHeight: '',
    maxHeight: '',
    minWeight: '',
    maxWeight: '',
    minPassingYards: '',
    minPassingTDs: '',
    minRushingYards: '',
    minRushingTDs: '',
    minYardsPerRush: '',
    minReceivingYards: '',
    minReceptions: '',
    minYardsPerReception: '',
    minTackles: '',
    minSacks: '',
    minInterceptions: '',
    minForcedFumbles: '',
    sortBy: 'rank',
    sortDirection: 'asc'
  });

  useEffect(() => {
    if (isOpen && advancedFilters) {
      setLocalFilters({
        minHeight: advancedFilters.minHeight || '',
        maxHeight: advancedFilters.maxHeight || '',
        minWeight: advancedFilters.minWeight || '',
        maxWeight: advancedFilters.maxWeight || '',
        minPassingYards: advancedFilters.minPassingYards || '',
        minPassingTDs: advancedFilters.minPassingTDs || '',
        minRushingYards: advancedFilters.minRushingYards || '',
        minRushingTDs: advancedFilters.minRushingTDs || '',
        minYardsPerRush: advancedFilters.minYardsPerRush || '',
        minReceivingYards: advancedFilters.minReceivingYards || '',
        minReceptions: advancedFilters.minReceptions || '',
        minYardsPerReception: advancedFilters.minYardsPerReception || '',
        minTackles: advancedFilters.minTackles || '',
        minSacks: advancedFilters.minSacks || '',
        minInterceptions: advancedFilters.minInterceptions || '',
        minForcedFumbles: advancedFilters.minForcedFumbles || '',
        sortBy: advancedFilters.sortBy || 'rank',
        sortDirection: advancedFilters.sortDirection || 'asc'
      });
    }
  }, [isOpen, advancedFilters]);

  const handleChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleClear = () => {
    const cleared = {
      minHeight: '',
      maxHeight: '',
      minWeight: '',
      maxWeight: '',
      minPassingYards: '',
      minPassingTDs: '',
      minRushingYards: '',
      minRushingTDs: '',
      minYardsPerRush: '',
      minReceivingYards: '',
      minReceptions: '',
      minYardsPerReception: '',
      minTackles: '',
      minSacks: '',
      minInterceptions: '',
      minForcedFumbles: '',
      sortBy: 'rank',
      sortDirection: 'asc'
    };
    setLocalFilters(cleared);
    onApply(cleared);
    onClose();
  };

  if (!isOpen) return null;

  const sortOptions = [
    { value: 'rank', label: 'Rank' },
    { value: 'name', label: 'Name' },
    { value: 'weight', label: 'Weight' },
    { value: 'height', label: 'Height' },
    { value: 'position', label: 'Position' },
    { value: 'passingYards', label: 'Passing Yards' },
    { value: 'rushingYards', label: 'Rushing Yards' },
    { value: 'receivingYards', label: 'Receiving Yards' },
    { value: 'tackles', label: 'Tackles' }
  ];

  return (
    <div className="adv-filter-backdrop" onClick={onClose}>
      <div className="adv-filter-modal" onClick={(e) => e.stopPropagation()}>
        <div className="adv-filter-header">
          <h2>Advanced Filters</h2>
          <button className="adv-filter-close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="adv-filter-body">
          {/* Physical Attributes */}
          <div className="adv-filter-section">
            <h3 className="adv-filter-label">Physical Attributes</h3>
            <div className="adv-filter-grid">
              <div className="adv-filter-input-group">
                <label>Min Height (inches)</label>
                <input
                  type="number"
                  value={localFilters.minHeight}
                  onChange={(e) => handleChange('minHeight', e.target.value)}
                />
              </div>
              <div className="adv-filter-input-group">
                <label>Max Height (inches)</label>
                <input
                  type="number"
                  value={localFilters.maxHeight}
                  onChange={(e) => handleChange('maxHeight', e.target.value)}
                />
              </div>
              <div className="adv-filter-input-group">
                <label>Min Weight (lbs)</label>
                <input
                  type="number"
                  value={localFilters.minWeight}
                  onChange={(e) => handleChange('minWeight', e.target.value)}
                />
              </div>
              <div className="adv-filter-input-group">
                <label>Max Weight (lbs)</label>
                <input
                  type="number"
                  value={localFilters.maxWeight}
                  onChange={(e) => handleChange('maxWeight', e.target.value)}
                />
              </div>
            </div>
            <p className="adv-filter-conversion">
              Height ref: 5'10" = 70", 6'0" = 72", 6'2" = 74", 6'4" = 76"
            </p>
          </div>

          {/* Offensive Stats */}
          <div className="adv-filter-section">
            <h3 className="adv-filter-label">Offensive Stats</h3>
            <p className="adv-filter-hint">2025 Season Only</p>
            <div className="adv-filter-grid">
              <div className="adv-filter-input-group">
                <label>Min Passing Yards</label>
                <input
                  type="number"
                  value={localFilters.minPassingYards}
                  onChange={(e) => handleChange('minPassingYards', e.target.value)}
                />
              </div>
              <div className="adv-filter-input-group">
                <label>Min Passing TDs</label>
                <input
                  type="number"
                  value={localFilters.minPassingTDs}
                  onChange={(e) => handleChange('minPassingTDs', e.target.value)}
                />
              </div>
              <div className="adv-filter-input-group">
                <label>Min Rushing Yards</label>
                <input
                  type="number"
                  value={localFilters.minRushingYards}
                  onChange={(e) => handleChange('minRushingYards', e.target.value)}
                />
              </div>
              <div className="adv-filter-input-group">
                <label>Min Rushing TDs</label>
                <input
                  type="number"
                  value={localFilters.minRushingTDs}
                  onChange={(e) => handleChange('minRushingTDs', e.target.value)}
                />
              </div>
              <div className="adv-filter-input-group">
                <label>Min Yards/Rush</label>
                <input
                  type="number"
                  step="0.1"
                  value={localFilters.minYardsPerRush}
                  onChange={(e) => handleChange('minYardsPerRush', e.target.value)}
                />
              </div>
              <div className="adv-filter-input-group">
                <label>Min Receiving Yards</label>
                <input
                  type="number"
                  value={localFilters.minReceivingYards}
                  onChange={(e) => handleChange('minReceivingYards', e.target.value)}
                />
              </div>
              <div className="adv-filter-input-group">
                <label>Min Receptions</label>
                <input
                  type="number"
                  value={localFilters.minReceptions}
                  onChange={(e) => handleChange('minReceptions', e.target.value)}
                />
              </div>
              <div className="adv-filter-input-group">
                <label>Min Yards/Reception</label>
                <input
                  type="number"
                  step="0.1"
                  value={localFilters.minYardsPerReception}
                  onChange={(e) => handleChange('minYardsPerReception', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Defensive Stats */}
          <div className="adv-filter-section">
            <h3 className="adv-filter-label">Defensive Stats</h3>
            <p className="adv-filter-hint">2025 Season Only</p>
            <div className="adv-filter-grid">
              <div className="adv-filter-input-group">
                <label>Min Tackles</label>
                <input
                  type="number"
                  value={localFilters.minTackles}
                  onChange={(e) => handleChange('minTackles', e.target.value)}
                />
              </div>
              <div className="adv-filter-input-group">
                <label>Min Sacks</label>
                <input
                  type="number"
                  step="0.5"
                  value={localFilters.minSacks}
                  onChange={(e) => handleChange('minSacks', e.target.value)}
                />
              </div>
              <div className="adv-filter-input-group">
                <label>Min Interceptions</label>
                <input
                  type="number"
                  value={localFilters.minInterceptions}
                  onChange={(e) => handleChange('minInterceptions', e.target.value)}
                />
              </div>
              <div className="adv-filter-input-group">
                <label>Min Forced Fumbles</label>
                <input
                  type="number"
                  value={localFilters.minForcedFumbles}
                  onChange={(e) => handleChange('minForcedFumbles', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Sort Options */}
          <div className="adv-filter-section">
            <h3 className="adv-filter-label">Sort By</h3>
            <div className="adv-filter-sort">
              <select
                value={localFilters.sortBy}
                onChange={(e) => handleChange('sortBy', e.target.value)}
                className="adv-filter-select"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <div className="adv-filter-direction">
                <button
                  type="button"
                  className={`adv-filter-dir-btn ${localFilters.sortDirection === 'asc' ? 'active' : ''}`}
                  onClick={() => handleChange('sortDirection', 'asc')}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
                  Asc
                </button>
                <button
                  type="button"
                  className={`adv-filter-dir-btn ${localFilters.sortDirection === 'desc' ? 'active' : ''}`}
                  onClick={() => handleChange('sortDirection', 'desc')}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12l7 7 7-7" />
                  </svg>
                  Desc
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="adv-filter-footer">
          <button className="adv-filter-btn-secondary" onClick={handleClear}>
            Clear All
          </button>
          <button className="adv-filter-btn-primary" onClick={handleApply}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdvancedFilterModal;
