import React from 'react';
import { useResidents, ACTION_TYPES } from '../context/ResidentContext';
import './SearchSort.css';

const SORT_OPTIONS = [
  { value: 'lastName', label: 'Last Name' },
  { value: 'firstName', label: 'First Name' },
  { value: 'unit', label: 'Unit' },
  { value: 'floor', label: 'Floor' },
  { value: 'building', label: 'Building' },
  { value: 'moveInDate', label: 'Move-in Date' },
];

// PUBLIC_INTERFACE
/**
 * SearchSort - Component that provides search input and sort controls for the resident list.
 * Dispatches search and sort actions to the global state.
 */
function SearchSort() {
  const { state, dispatch } = useResidents();
  const { searchQuery, sortField, sortDirection } = state;

  const handleSearchChange = (e) => {
    dispatch({ type: ACTION_TYPES.SET_SEARCH, payload: e.target.value });
  };

  const handleSortFieldChange = (e) => {
    dispatch({
      type: ACTION_TYPES.SET_SORT,
      payload: { field: e.target.value, direction: sortDirection },
    });
  };

  const handleSortDirectionToggle = () => {
    dispatch({
      type: ACTION_TYPES.SET_SORT,
      payload: {
        field: sortField,
        direction: sortDirection === 'asc' ? 'desc' : 'asc',
      },
    });
  };

  return (
    <div className="search-sort-bar" role="search">
      <div className="search-input-wrapper">
        <span className="search-icon" aria-hidden="true">🔍</span>
        <input
          type="search"
          className="search-input"
          placeholder="Search by name, unit, email, tag..."
          value={searchQuery}
          onChange={handleSearchChange}
          aria-label="Search residents"
        />
        {searchQuery && (
          <button
            className="clear-search-btn"
            onClick={() => dispatch({ type: ACTION_TYPES.SET_SEARCH, payload: '' })}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <div className="sort-controls">
        <label htmlFor="sort-field" className="sort-label">Sort by:</label>
        <select
          id="sort-field"
          className="sort-select"
          value={sortField}
          onChange={handleSortFieldChange}
          aria-label="Sort residents by"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <button
          className="sort-direction-btn"
          onClick={handleSortDirectionToggle}
          aria-label={`Sort direction: ${sortDirection === 'asc' ? 'Ascending' : 'Descending'}. Click to toggle.`}
          title={sortDirection === 'asc' ? 'Ascending' : 'Descending'}
        >
          {sortDirection === 'asc' ? '↑' : '↓'}
        </button>
      </div>
    </div>
  );
}

export default SearchSort;
