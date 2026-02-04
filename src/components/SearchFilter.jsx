import { positions, colleges } from '../data/prospects';
import './SearchFilter.css';

function SearchFilter({ filters, onFilterChange }) {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      position: '',
      college: '',
      round: ''
    });
  };

  const hasFilters = filters.search || filters.position || filters.college || filters.round;

  return (
    <div className="search-filter">
      <div className="search-filter-row">
        <div className="search-input-wrapper">
          <svg
            className="search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search by name..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <select
            value={filters.position}
            onChange={(e) => handleChange('position', e.target.value)}
            className="filter-select"
          >
            <option value="">All Positions</option>
            {positions.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>

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

          <select
            value={filters.round}
            onChange={(e) => handleChange('round', e.target.value)}
            className="filter-select"
          >
            <option value="">All Rounds</option>
            <option value="1">Round 1</option>
            <option value="2">Round 2</option>
            <option value="3">Round 3</option>
            <option value="4">Round 4</option>
            <option value="5">Round 5</option>
            <option value="6">Round 6</option>
            <option value="7">Round 7</option>
            <option value="UDFA">UDFA</option>
          </select>
        </div>
      </div>

      {hasFilters && (
        <div className="active-filters">
          <span className="active-filters-label">Active filters:</span>
          {filters.search && (
            <span className="filter-tag">
              Search: "{filters.search}"
              <button onClick={() => handleChange('search', '')}>×</button>
            </span>
          )}
          {filters.position && (
            <span className="filter-tag">
              {filters.position}
              <button onClick={() => handleChange('position', '')}>×</button>
            </span>
          )}
          {filters.college && (
            <span className="filter-tag">
              {filters.college}
              <button onClick={() => handleChange('college', '')}>×</button>
            </span>
          )}
          {filters.round && (
            <span className="filter-tag">
              {filters.round === 'UDFA' ? 'UDFA' : `Round ${filters.round}`}
              <button onClick={() => handleChange('round', '')}>×</button>
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
