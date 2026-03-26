import React, { useRef, useState } from 'react';
import Papa from 'papaparse';
import { useResidents, ACTION_TYPES } from '../context/ResidentContext';
import './ImportExport.css';

// PUBLIC_INTERFACE
/**
 * ImportExport - Provides buttons to export resident data as JSON or CSV,
 * and to import data from JSON or CSV files.
 * @param {Function} props.onClose - Callback to close the parent modal
 */
function ImportExport({ onClose }) {
  const { state, dispatch } = useResidents();
  const jsonInputRef = useRef(null);
  const csvInputRef = useRef(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' | 'error'

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 4000);
  };

  // ── Export JSON ──────────────────────────────────────────────────────────
  const handleExportJSON = () => {
    const json = JSON.stringify(state.residents, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'residents.json';
    a.click();
    URL.revokeObjectURL(url);
    showMessage('Exported residents as JSON.', 'success');
  };

  // ── Export CSV ───────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    const csvData = state.residents.map((r) => ({
      id: r.id,
      firstName: r.firstName,
      lastName: r.lastName,
      unit: r.unit,
      floor: r.floor,
      building: r.building,
      email: r.email,
      phone: r.phone,
      moveInDate: r.moveInDate,
      tags: (r.tags || []).join(';'),
      notes: r.notes,
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'residents.csv';
    a.click();
    URL.revokeObjectURL(url);
    showMessage('Exported residents as CSV.', 'success');
  };

  // ── Import JSON ──────────────────────────────────────────────────────────
  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target.result);
        if (!Array.isArray(data)) throw new Error('File must be a JSON array of residents.');
        // Validate each entry has minimal required fields
        const validated = data.map((r, idx) => ({
          id: r.id || Date.now().toString() + idx,
          firstName: r.firstName || '',
          lastName: r.lastName || '',
          unit: r.unit || '',
          floor: r.floor || '',
          building: r.building || '',
          email: r.email || '',
          phone: r.phone || '',
          moveInDate: r.moveInDate || '',
          tags: Array.isArray(r.tags) ? r.tags : [],
          notes: r.notes || '',
          avatar: r.avatar || '',
        }));
        dispatch({ type: ACTION_TYPES.IMPORT_RESIDENTS, payload: validated });
        showMessage(`Imported ${validated.length} residents from JSON.`, 'success');
      } catch (err) {
        showMessage(`Import failed: ${err.message}`, 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // ── Import CSV ───────────────────────────────────────────────────────────
  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const validated = results.data.map((r, idx) => ({
            id: r.id || Date.now().toString() + idx,
            firstName: r.firstName || '',
            lastName: r.lastName || '',
            unit: r.unit || '',
            floor: r.floor || '',
            building: r.building || '',
            email: r.email || '',
            phone: r.phone || '',
            moveInDate: r.moveInDate || '',
            tags: r.tags ? r.tags.split(';').filter(Boolean) : [],
            notes: r.notes || '',
            avatar: r.avatar || '',
          }));
          dispatch({ type: ACTION_TYPES.IMPORT_RESIDENTS, payload: validated });
          showMessage(`Imported ${validated.length} residents from CSV.`, 'success');
        } catch (err) {
          showMessage(`Import failed: ${err.message}`, 'error');
        }
      },
      error: (err) => {
        showMessage(`CSV parse error: ${err.message}`, 'error');
      },
    });
    e.target.value = '';
  };

  return (
    <div className="import-export">
      {message && (
        <div className={`ie-message ie-message-${messageType}`} role="status" aria-live="polite">
          {message}
        </div>
      )}

      <section className="ie-section">
        <h3 className="ie-section-title">Export Data</h3>
        <p className="ie-description">Download all resident data as a file.</p>
        <div className="ie-buttons">
          <button className="ie-btn ie-btn-export" onClick={handleExportJSON}>
            <span aria-hidden="true">📄</span> Export JSON
          </button>
          <button className="ie-btn ie-btn-export" onClick={handleExportCSV}>
            <span aria-hidden="true">📊</span> Export CSV
          </button>
        </div>
      </section>

      <hr className="ie-divider" />

      <section className="ie-section">
        <h3 className="ie-section-title">Import Data</h3>
        <p className="ie-description">
          Import replaces all current residents with data from the file.
          <br />
          <strong>CSV format:</strong> columns: id, firstName, lastName, unit, floor, building, email, phone, moveInDate, tags (semicolon-separated), notes.
        </p>
        <div className="ie-buttons">
          <button className="ie-btn ie-btn-import" onClick={() => jsonInputRef.current.click()}>
            <span aria-hidden="true">📂</span> Import JSON
          </button>
          <button className="ie-btn ie-btn-import" onClick={() => csvInputRef.current.click()}>
            <span aria-hidden="true">📋</span> Import CSV
          </button>
        </div>
        <input
          ref={jsonInputRef}
          type="file"
          accept=".json"
          onChange={handleImportJSON}
          aria-label="Import JSON file"
          style={{ display: 'none' }}
        />
        <input
          ref={csvInputRef}
          type="file"
          accept=".csv"
          onChange={handleImportCSV}
          aria-label="Import CSV file"
          style={{ display: 'none' }}
        />
      </section>

      <div className="ie-footer">
        <button className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default ImportExport;
