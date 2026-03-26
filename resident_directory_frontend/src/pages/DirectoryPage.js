import React, { useState } from 'react';
import SidebarFilters from '../components/SidebarFilters';
import SearchSort from '../components/SearchSort';
import ResidentGrid from '../components/ResidentGrid';
import Modal from '../components/Modal';
import ResidentForm from '../components/ResidentForm';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import ImportExport from '../components/ImportExport';
import { useResidents, useFilteredResidents, ACTION_TYPES } from '../context/ResidentContext';
import './DirectoryPage.css';

// PUBLIC_INTERFACE
/**
 * DirectoryPage - Main page of the Resident Directory app.
 * Displays sidebar filters, search/sort bar, resident grid, and modals for
 * add/edit, delete confirmation, and import/export.
 */
function DirectoryPage() {
  const { dispatch } = useResidents();
  const residents = useFilteredResidents();

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [editResident, setEditResident] = useState(null);
  const [deleteResident, setDeleteResident] = useState(null);
  const [isImportExportOpen, setImportExportOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // ── Add Resident ─────────────────────────────────────────────────────────
  const handleAddSave = (formData) => {
    dispatch({ type: ACTION_TYPES.ADD_RESIDENT, payload: formData });
    setAddModalOpen(false);
  };

  // ── Edit Resident ─────────────────────────────────────────────────────────
  const handleEditOpen = (resident) => {
    setEditResident(resident);
  };

  const handleEditSave = (formData) => {
    dispatch({ type: ACTION_TYPES.UPDATE_RESIDENT, payload: formData });
    setEditResident(null);
  };

  // ── Delete Resident ──────────────────────────────────────────────────────
  const handleDeleteOpen = (resident) => {
    setDeleteResident(resident);
  };

  const handleDeleteConfirm = () => {
    dispatch({ type: ACTION_TYPES.DELETE_RESIDENT, payload: deleteResident.id });
    setDeleteResident(null);
  };

  return (
    <div className="directory-page">
      {/* Mobile sidebar toggle */}
      <button
        className="sidebar-toggle-btn"
        onClick={() => setSidebarOpen((v) => !v)}
        aria-expanded={isSidebarOpen}
        aria-controls="sidebar-filters"
        aria-label="Toggle filters sidebar"
      >
        <span aria-hidden="true">☰</span> Filters
      </button>

      <div className="directory-layout">
        {/* Sidebar Filters */}
        <div
          id="sidebar-filters"
          className={`sidebar-wrapper ${isSidebarOpen ? 'sidebar-open' : ''}`}
        >
          <SidebarFilters />
        </div>

        {/* Main content area */}
        <main className="directory-main" aria-label="Resident directory">
          {/* Top bar: search + sort + import/export */}
          <div className="directory-topbar">
            <SearchSort />
            <div className="topbar-actions">
              <span className="resident-count" aria-live="polite" aria-atomic="true">
                {residents.length} resident{residents.length !== 1 ? 's' : ''}
              </span>
              <button
                className="btn-icon-text"
                onClick={() => setImportExportOpen(true)}
                aria-label="Import or export residents"
                title="Import / Export"
              >
                <span aria-hidden="true">⇅</span>
                <span className="btn-label">Import/Export</span>
              </button>
            </div>
          </div>

          {/* Resident Grid */}
          <div className="directory-scroll">
            <ResidentGrid
              residents={residents}
              onEdit={handleEditOpen}
              onDelete={handleDeleteOpen}
            />
          </div>
        </main>
      </div>

      {/* Floating Action Button - Add Resident */}
      <button
        className="fab"
        onClick={() => setAddModalOpen(true)}
        aria-label="Add new resident"
        title="Add Resident"
      >
        <span aria-hidden="true">+</span>
      </button>

      {/* Add Resident Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Resident"
        size="large"
      >
        <ResidentForm
          onSave={handleAddSave}
          onCancel={() => setAddModalOpen(false)}
          isEditing={false}
        />
      </Modal>

      {/* Edit Resident Modal */}
      <Modal
        isOpen={!!editResident}
        onClose={() => setEditResident(null)}
        title="Edit Resident"
        size="large"
      >
        <ResidentForm
          initialData={editResident}
          onSave={handleEditSave}
          onCancel={() => setEditResident(null)}
          isEditing={true}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteResident}
        resident={deleteResident}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteResident(null)}
      />

      {/* Import/Export Modal */}
      <Modal
        isOpen={isImportExportOpen}
        onClose={() => setImportExportOpen(false)}
        title="Import / Export Data"
        size="medium"
      >
        <ImportExport onClose={() => setImportExportOpen(false)} />
      </Modal>
    </div>
  );
}

export default DirectoryPage;
