import React, { useMemo } from 'react';
import { useResidents, ACTION_TYPES } from '../context/ResidentContext';
import './SidebarFilters.css';

// All available tags in the system
const ALL_TAGS = ['pet-owner', 'parking', 'long-term', 'balcony', 'storage'];

// PUBLIC_INTERFACE
/**
 * SidebarFilters - Sidebar panel for filtering residents by building, floor, unit, and tags.
 * Dispatches filter actions to the global resident state.
 */
function SidebarFilters() {
  const { state, dispatch } = useResidents();
  const { residents, filters } = state;

  // Derive unique values for filter options
  const buildings = useMemo(
    () => [...new Set(residents.map((r) => r.building).filter(Boolean))].sort(),
    [residents]
  );
  const floors = useMemo(
    () => [...new Set(residents.map((r) => r.floor).filter(Boolean))].sort((a, b) => Number(a) - Number(b)),
    [residents]
  );
  const units = useMemo(
    () => [...new Set(residents.map((r) => r.unit).filter(Boolean))].sort(),
    [residents]
  );

  const handleFilterChange = (field, value) => {
    dispatch({ type: ACTION_TYPES.SET_FILTER, payload: { [field]: value } });
  };

  const handleTagToggle = (tag) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];
    dispatch({ type: ACTION_TYPES.SET_FILTER, payload: { tags: newTags } });
  };

  const handleClear = () => {
    dispatch({ type: ACTION_TYPES.CLEAR_FILTERS });
  };

  const hasActiveFilters =
    filters.building || filters.floor || filters.unit || (filters.tags && filters.tags.length > 0);

  return (
    <aside className="sidebar-filters" aria-label="Filter residents">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Filters</h2>
        {hasActiveFilters && (
          <button
            className="clear-filters-btn"
            onClick={handleClear}
            aria-label="Clear all filters"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Building filter */}
      <div className="filter-group">
        <label htmlFor="filter-building" className="filter-label">Building</label>
        <select
          id="filter-building"
          className="filter-select"
          value={filters.building}
          onChange={(e) => handleFilterChange('building', e.target.value)}
          aria-label="Filter by building"
        >
          <option value="">All buildings</option>
          {buildings.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      {/* Floor filter */}
      <div className="filter-group">
        <label htmlFor="filter-floor" className="filter-label">Floor</label>
        <select
          id="filter-floor"
          className="filter-select"
          value={filters.floor}
          onChange={(e) => handleFilterChange('floor', e.target.value)}
          aria-label="Filter by floor"
        >
          <option value="">All floors</option>
          {floors.map((f) => (
            <option key={f} value={f}>Floor {f}</option>
          ))}
        </select>
      </div>

      {/* Unit filter */}
      <div className="filter-group">
        <label htmlFor="filter-unit" className="filter-label">Unit</label>
        <select
          id="filter-unit"
          className="filter-select"
          value={filters.unit}
          onChange={(e) => handleFilterChange('unit', e.target.value)}
          aria-label="Filter by unit"
        >
          <option value="">All units</option>
          {units.map((u) => (
            <option key={u} value={u}>Unit {u}</option>
          ))}
        </select>
      </div>

      {/* Tags filter */}
      <div className="filter-group">
        <span className="filter-label" id="tags-label">Tags</span>
        <div className="tags-list" role="group" aria-labelledby="tags-label">
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              className={`tag-filter-btn ${filters.tags && filters.tags.includes(tag) ? 'active' : ''}`}
              onClick={() => handleTagToggle(tag)}
              aria-pressed={filters.tags && filters.tags.includes(tag)}
              aria-label={`Filter by tag: ${tag}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default SidebarFilters;
