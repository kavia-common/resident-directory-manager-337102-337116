import React from 'react';
import ResidentCard from './ResidentCard';
import './ResidentGrid.css';

// PUBLIC_INTERFACE
/**
 * ResidentGrid - Displays a grid of ResidentCard components.
 * Shows an empty state if no residents match the current filters.
 * @param {Array} props.residents - Array of resident objects to display
 * @param {Function} props.onEdit - Callback to open the edit modal for a resident
 * @param {Function} props.onDelete - Callback to initiate deletion of a resident
 */
function ResidentGrid({ residents, onEdit, onDelete }) {
  if (residents.length === 0) {
    return (
      <div className="empty-state" role="status" aria-live="polite">
        <div className="empty-icon" aria-hidden="true">🏘️</div>
        <h3 className="empty-title">No residents found</h3>
        <p className="empty-subtitle">
          Try adjusting your search or filters, or add a new resident.
        </p>
      </div>
    );
  }

  return (
    <div
      className="resident-grid"
      role="list"
      aria-label={`${residents.length} resident${residents.length !== 1 ? 's' : ''} found`}
    >
      {residents.map((resident) => (
        <div key={resident.id} role="listitem">
          <ResidentCard
            resident={resident}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
}

export default ResidentGrid;
