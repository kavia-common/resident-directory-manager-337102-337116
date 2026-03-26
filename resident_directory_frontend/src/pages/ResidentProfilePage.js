import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResidents, ACTION_TYPES } from '../context/ResidentContext';
import Modal from '../components/Modal';
import ResidentForm from '../components/ResidentForm';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import './ResidentProfilePage.css';

// Helper to generate avatar initials and color
function getInitials(firstName, lastName) {
  return `${(firstName || '').charAt(0)}${(lastName || '').charAt(0)}`.toUpperCase();
}

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

function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

// PUBLIC_INTERFACE
/**
 * ResidentProfilePage - Displays full profile details for a single resident.
 * Includes edit and delete actions and a back navigation link.
 */
function ResidentProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useResidents();
  const resident = state.residents.find((r) => r.id === id);

  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  if (!resident) {
    return (
      <div className="profile-not-found">
        <div className="not-found-icon" aria-hidden="true">🏚️</div>
        <h2>Resident Not Found</h2>
        <p>The resident you are looking for does not exist or has been removed.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Back to Directory
        </button>
      </div>
    );
  }

  const {
    firstName, lastName, unit, floor, building,
    email, phone, moveInDate, tags, notes,
  } = resident;

  const fullName = `${firstName} ${lastName}`;
  const initials = getInitials(firstName, lastName);
  const avatarColor = getAvatarColor(`${firstName}${lastName}`);

  const handleEditSave = (formData) => {
    dispatch({ type: ACTION_TYPES.UPDATE_RESIDENT, payload: formData });
    setEditOpen(false);
  };

  const handleDeleteConfirm = () => {
    dispatch({ type: ACTION_TYPES.DELETE_RESIDENT, payload: resident.id });
    navigate('/');
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Back button */}
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
          aria-label="Go back to directory"
        >
          ← Back to Directory
        </button>

        {/* Profile header card */}
        <div className="profile-header">
          <div
            className="profile-avatar"
            style={{ backgroundColor: avatarColor }}
            aria-hidden="true"
          >
            {initials}
          </div>
          <div className="profile-header-info">
            <h1 className="profile-name">{fullName}</h1>
            <div className="profile-location">
              {building && <span>Building {building}</span>}
              {floor && <span>Floor {floor}</span>}
              <span>Unit {unit}</span>
            </div>
            {tags && tags.length > 0 && (
              <div className="profile-tags" aria-label="Tags">
                {tags.map((tag) => (
                  <span key={tag} className="profile-tag">{tag}</span>
                ))}
              </div>
            )}
          </div>
          <div className="profile-header-actions">
            <button
              className="btn btn-secondary"
              onClick={() => setEditOpen(true)}
              aria-label={`Edit ${fullName}`}
            >
              ✏️ Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={() => setDeleteOpen(true)}
              aria-label={`Delete ${fullName}`}
            >
              🗑️ Delete
            </button>
          </div>
        </div>

        {/* Profile details */}
        <div className="profile-details-grid">
          <div className="profile-detail-card">
            <h2 className="detail-card-title">Contact Information</h2>
            <dl className="detail-list">
              <div className="detail-item">
                <dt>Email</dt>
                <dd>
                  {email
                    ? <a href={`mailto:${email}`} className="profile-link">{email}</a>
                    : '—'
                  }
                </dd>
              </div>
              <div className="detail-item">
                <dt>Phone</dt>
                <dd>
                  {phone
                    ? <a href={`tel:${phone}`} className="profile-link">{phone}</a>
                    : '—'
                  }
                </dd>
              </div>
            </dl>
          </div>

          <div className="profile-detail-card">
            <h2 className="detail-card-title">Residence Details</h2>
            <dl className="detail-list">
              <div className="detail-item">
                <dt>Building</dt>
                <dd>{building || '—'}</dd>
              </div>
              <div className="detail-item">
                <dt>Floor</dt>
                <dd>{floor || '—'}</dd>
              </div>
              <div className="detail-item">
                <dt>Unit</dt>
                <dd>{unit || '—'}</dd>
              </div>
              <div className="detail-item">
                <dt>Move-in Date</dt>
                <dd>{formatDate(moveInDate)}</dd>
              </div>
            </dl>
          </div>

          {notes && (
            <div className="profile-detail-card profile-notes-card">
              <h2 className="detail-card-title">Notes</h2>
              <p className="profile-notes">{notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Resident"
        size="large"
      >
        <ResidentForm
          initialData={resident}
          onSave={handleEditSave}
          onCancel={() => setEditOpen(false)}
          isEditing={true}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        resident={resident}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
}

export default ResidentProfilePage;
