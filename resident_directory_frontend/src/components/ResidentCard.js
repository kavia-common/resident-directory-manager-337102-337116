import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ResidentCard.css';

// Helper to generate avatar initials
function getInitials(firstName, lastName) {
  return `${(firstName || '').charAt(0)}${(lastName || '').charAt(0)}`.toUpperCase();
}

// Helper to generate a deterministic color based on name
function getAvatarColor(name) {
  const colors = [
    '#065F46', '#059669', '#10B981', '#047857',
    '#0D9488', '#0891B2', '#1D4ED8', '#7C3AED',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// PUBLIC_INTERFACE
/**
 * ResidentCard - Displays a single resident's summary information as a card.
 * Clicking the card navigates to the resident's profile page.
 * @param {Object} props.resident - The resident data object
 * @param {Function} props.onEdit - Callback to open edit modal
 * @param {Function} props.onDelete - Callback to initiate deletion
 */
function ResidentCard({ resident, onEdit, onDelete }) {
  const navigate = useNavigate();
  const { id, firstName, lastName, unit, floor, building, email, phone, tags } = resident;
  const initials = getInitials(firstName, lastName);
  const avatarColor = getAvatarColor(`${firstName}${lastName}`);
  const fullName = `${firstName} ${lastName}`;

  const handleCardClick = () => {
    navigate(`/resident/${id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(resident);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(resident);
  };

  return (
    <article
      className="resident-card"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View profile of ${fullName}, Unit ${unit}`}
    >
      <div className="card-avatar" style={{ backgroundColor: avatarColor }} aria-hidden="true">
        {initials}
      </div>
      <div className="card-body">
        <h3 className="card-name">{fullName}</h3>
        <div className="card-details">
          <span className="card-detail" aria-label="Unit">
            <span className="detail-icon" aria-hidden="true">🏠</span>
            {building ? `Building ${building}, ` : ''}Unit {unit}
            {floor ? `, Floor ${floor}` : ''}
          </span>
          {email && (
            <span className="card-detail card-email" aria-label="Email">
              <span className="detail-icon" aria-hidden="true">✉️</span>
              <span className="truncate">{email}</span>
            </span>
          )}
          {phone && (
            <span className="card-detail" aria-label="Phone">
              <span className="detail-icon" aria-hidden="true">📞</span>
              {phone}
            </span>
          )}
        </div>
        {tags && tags.length > 0 && (
          <div className="card-tags" aria-label="Tags">
            {tags.map((tag) => (
              <span key={tag} className="card-tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
      <div className="card-actions" role="group" aria-label="Resident actions">
        <button
          className="card-action-btn edit-btn"
          onClick={handleEdit}
          aria-label={`Edit ${fullName}`}
          title="Edit resident"
        >
          ✏️
        </button>
        <button
          className="card-action-btn delete-btn"
          onClick={handleDelete}
          aria-label={`Delete ${fullName}`}
          title="Delete resident"
        >
          🗑️
        </button>
      </div>
    </article>
  );
}

export default ResidentCard;
