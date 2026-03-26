import React from 'react';
import Modal from './Modal';
import './ConfirmDeleteModal.css';

// PUBLIC_INTERFACE
/**
 * ConfirmDeleteModal - Accessible confirmation dialog for deleting a resident.
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {Object} props.resident - The resident to be deleted
 * @param {Function} props.onConfirm - Called when deletion is confirmed
 * @param {Function} props.onCancel - Called when deletion is cancelled
 */
function ConfirmDeleteModal({ isOpen, resident, onConfirm, onCancel }) {
  if (!resident) return null;

  const fullName = `${resident.firstName} ${resident.lastName}`;

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Delete Resident" size="small">
      <div className="confirm-delete-content">
        <div className="confirm-icon" aria-hidden="true">⚠️</div>
        <p className="confirm-text">
          Are you sure you want to delete{' '}
          <strong>{fullName}</strong> (Unit {resident.unit})?
        </p>
        <p className="confirm-subtext">This action cannot be undone.</p>
        <div className="confirm-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm} aria-label={`Confirm delete ${fullName}`}>
            Delete Resident
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDeleteModal;
