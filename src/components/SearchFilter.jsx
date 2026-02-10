import { useState, useRef, useEffect } from 'react';
import { colleges } from '../data/prospects';
import AdvancedFilterModal from './AdvancedFilterModal';
import './SearchFilter.css';

// Position groups and individual positions for the filter
const positionGroups = {
  offense: ['QB', 'RB', 'FB', 'WR', 'TE', 'OT', 'OG', 'C'],
  defense: ['DE', 'DT', 'LB', 'CB', 'S']
};

const filterPositions = [
  { value: 'offense', label: 'Offense', isGroup: true },
  { value: 'defense', label: 'Defense', isGroup: true },
  { value: 'QB', label: 'QB' },
  { value: 'RB', label: 'RB' },
  { value: 'FB', label: 'FB' },
  { value: 'WR', label: 'WR' },
  { value: 'TE', label: 'TE' },
  { value: 'OT', label: 'OT' },
  { value: 'OG', label: 'OG' },
  { value: 'C', label: 'C' },
  { value: 'DE', label: 'DE' },
  { value: 'DT', label: 'DT' },
  { value: 'LB', label: 'LB' },
  { value: 'CB', label: 'CB' },
  { value: 'S', label: 'S' }
];

function SearchFilter({ filters, onFilterChange, advancedFilters, onAdvancedFilterChange }) {
  const [positionDropdownOpen, setPositionDropdownOpen] = useState(false);
  const [advancedModalOpen, setAdvancedModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  const hasAdvancedFilters = advancedFilters && (
    advancedFilters.minHeight ||
    advancedFilters.maxHeight ||
    advancedFilters.minWeight ||
    advancedFilters.maxWeight ||
    advancedFilters.minPassingYards ||
    advancedFilters.minPassingTDs ||
    advancedFilters.minRushingYards ||
    advancedFilters.minRushingTDs ||
    advancedFilters.minYardsPerRush ||
    advancedFilters.minReceivingYards ||
    advancedFilters.minReceptions ||
    advancedFilters.minYardsPerReception ||
    advancedFilters.minTackles ||
    advancedFilters.minSacks ||
    advancedFilters.minInterceptions ||
    advancedFilters.minForcedFumbles ||
    advancedFilters.sortBy !== 'rank' ||
    advancedFilters.sortDirection !== 'asc'
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setPositionDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      positions: [],
      college: ''
    });
  };

  const togglePosition = (pos) => {
    const currentPositions = filters.positions || [];
    let newPositions;

    // Handle group toggles
    if (pos === 'offense') {
      const offensePositions = positionGroups.offense;
      const allOffenseSelected = offensePositions.every(p => currentPositions.includes(p));
      if (allOffenseSelected) {
        newPositions = currentPositions.filter(p => !offensePositions.includes(p));
      } else {
        newPositions = [...new Set([...currentPositions, ...offensePositions])];
      }
    } else if (pos === 'defense') {
      const defensePositions = positionGroups.defense;
      const allDefenseSelected = defensePositions.every(p => currentPositions.includes(p));
      if (allDefenseSelected) {
        newPositions = currentPositions.filter(p => !defensePositions.includes(p));
      } else {
        newPositions = [...new Set([...currentPositions, ...defensePositions])];
      }
    } else {
      // Individual position toggle
      if (currentPositions.includes(pos)) {
        newPositions = currentPositions.filter(p => p !== pos);
      } else {
        newPositions = [...currentPositions, pos];
      }
    }

    handleChange('positions', newPositions);
  };

  const clearPositions = () => {
    handleChange('positions', []);
  };

  const isPositionSelected = (pos) => {
    const currentPositions = filters.positions || [];
    if (pos === 'offense') {
      return positionGroups.offense.every(p => currentPositions.includes(p));
    }
    if (pos === 'defense') {
      return positionGroups.defense.every(p => currentPositions.includes(p));
    }
    return currentPositions.includes(pos);
  };

  const isGroupPartiallySelected = (group) => {
    if (!positionGroups[group]) return false;
    const currentPositions = filters.positions || [];
    const groupPositions = positionGroups[group];
    const selectedCount = groupPositions.filter(p => currentPositions.includes(p)).length;
    return selectedCount > 0 && selectedCount < groupPositions.length;
  };

  const getPositionButtonLabel = () => {
    const currentPositions = filters.positions || [];
    if (currentPositions.length === 0) return 'All Positions';
    if (currentPositions.length === 1) return currentPositions[0];
    if (currentPositions.length <= 3) return currentPositions.join(', ');
    return `${currentPositions.length} positions`;
  };

  const hasFilters = filters.search || (filters.positions && filters.positions.length > 0) || filters.college;

  return (
    <div className="search-filter">
      <div className="search-filter-row">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Search by name or school..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          {/* Position Multi-Select Dropdown */}
          <div className="position-dropdown" ref={dropdownRef}>
            <button
              type="button"
              className={`filter-select position-dropdown-trigger ${positionDropdownOpen ? 'open' : ''}`}
              onClick={() => setPositionDropdownOpen(!positionDropdownOpen)}
            >
              <span>{getPositionButtonLabel()}</span>
              <svg className="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {positionDropdownOpen && (
              <div className="position-dropdown-menu">
                <button
                  type="button"
                  className="position-clear-btn"
                  onClick={clearPositions}
                >
                  Clear All
                </button>

                <div className="position-dropdown-divider" />

                {filterPositions.map((pos) => (
                  <label
                    key={pos.value}
                    className={`position-checkbox-label ${pos.isGroup ? 'is-group' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={isPositionSelected(pos.value)}
                      onChange={() => togglePosition(pos.value)}
                      className={isGroupPartiallySelected(pos.value) ? 'partial' : ''}
                    />
                    <span className="checkbox-custom">
                      {isPositionSelected(pos.value) && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M5 12l5 5L20 7" />
                        </svg>
                      )}
                      {isGroupPartiallySelected(pos.value) && (
                        <span className="checkbox-partial">−</span>
                      )}
                    </span>
                    <span className="checkbox-label-text">{pos.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <select
            value={filters.college}
            onChange={(e) => handleChange('college', e.target.value)}
            className="filter-select"
          >
            <option value="">All Schools</option>
            {colleges.map((school) => (
              <option key={school} value={school}>
                {school}
              </option>
            ))}
          </select>

          <button
            type="button"
            className={`advanced-filter-btn ${hasAdvancedFilters ? 'has-filters' : ''}`}
            onClick={() => setAdvancedModalOpen(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
            </svg>
            <span>Advanced</span>
            {hasAdvancedFilters && <span className="advanced-filter-indicator" />}
          </button>
        </div>
      </div>

      <AdvancedFilterModal
        isOpen={advancedModalOpen}
        onClose={() => setAdvancedModalOpen(false)}
        advancedFilters={advancedFilters}
        onApply={onAdvancedFilterChange}
      />

      {hasFilters && (
        <div className="active-filters">
          <span className="active-filters-label">Active filters:</span>
          {filters.search && (
            <span className="filter-tag">
              Search: "{filters.search}"
              <button onClick={() => handleChange('search', '')}>×</button>
            </span>
          )}
          {filters.positions && filters.positions.map((pos) => (
            <span key={pos} className="filter-tag">
              {pos}
              <button onClick={() => togglePosition(pos)}>×</button>
            </span>
          ))}
          {filters.college && (
            <span className="filter-tag">
              {filters.college}
              <button onClick={() => handleChange('college', '')}>×</button>
            </span>
          )}
          <button className="clear-all-btn" onClick={clearFilters}>
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

export default SearchFilter;
