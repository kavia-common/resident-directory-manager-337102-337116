import React, { useState, useEffect } from 'react';
import './ResidentForm.css';

const ALL_TAGS = ['pet-owner', 'parking', 'long-term', 'balcony', 'storage'];

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  unit: '',
  floor: '',
  building: '',
  email: '',
  phone: '',
  moveInDate: '',
  tags: [],
  notes: '',
};

// PUBLIC_INTERFACE
/**
 * ResidentForm - Form for adding or editing a resident's information.
 * Validates required fields and dispatches save/cancel callbacks.
 * @param {Object} [props.initialData] - Existing resident data when editing
 * @param {Function} props.onSave - Callback with form data when form is submitted
 * @param {Function} props.onCancel - Callback when form is cancelled
 * @param {boolean} [props.isEditing] - Whether the form is in edit mode
 */
function ResidentForm({ initialData, onSave, onCancel, isEditing = false }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({ ...EMPTY_FORM, ...initialData });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleTagToggle = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!form.unit.trim()) newErrors.unit = 'Unit is required';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Invalid email address';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSave({ ...form });
  };

  return (
    <form className="resident-form" onSubmit={handleSubmit} noValidate aria-label={isEditing ? 'Edit resident form' : 'Add resident form'}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName" className="form-label">
            First Name <span className="required" aria-hidden="true">*</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            className={`form-input ${errors.firstName ? 'input-error' : ''}`}
            value={form.firstName}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? 'firstName-error' : undefined}
            placeholder="e.g. Alice"
          />
          {errors.firstName && (
            <span id="firstName-error" className="error-msg" role="alert">{errors.firstName}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="lastName" className="form-label">
            Last Name <span className="required" aria-hidden="true">*</span>
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            className={`form-input ${errors.lastName ? 'input-error' : ''}`}
            value={form.lastName}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? 'lastName-error' : undefined}
            placeholder="e.g. Johnson"
          />
          {errors.lastName && (
            <span id="lastName-error" className="error-msg" role="alert">{errors.lastName}</span>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="building" className="form-label">Building</label>
          <input
            id="building"
            name="building"
            type="text"
            className="form-input"
            value={form.building}
            onChange={handleChange}
            placeholder="e.g. A"
          />
        </div>

        <div className="form-group">
          <label htmlFor="floor" className="form-label">Floor</label>
          <input
            id="floor"
            name="floor"
            type="text"
            className="form-input"
            value={form.floor}
            onChange={handleChange}
            placeholder="e.g. 3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="unit" className="form-label">
            Unit <span className="required" aria-hidden="true">*</span>
          </label>
          <input
            id="unit"
            name="unit"
            type="text"
            className={`form-input ${errors.unit ? 'input-error' : ''}`}
            value={form.unit}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={!!errors.unit}
            aria-describedby={errors.unit ? 'unit-error' : undefined}
            placeholder="e.g. 101"
          />
          {errors.unit && (
            <span id="unit-error" className="error-msg" role="alert">{errors.unit}</span>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className={`form-input ${errors.email ? 'input-error' : ''}`}
            value={form.email}
            onChange={handleChange}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            placeholder="e.g. alice@example.com"
          />
          {errors.email && (
            <span id="email-error" className="error-msg" role="alert">{errors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="phone" className="form-label">Phone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="form-input"
            value={form.phone}
            onChange={handleChange}
            placeholder="e.g. 555-0101"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="moveInDate" className="form-label">Move-in Date</label>
        <input
          id="moveInDate"
          name="moveInDate"
          type="date"
          className="form-input"
          value={form.moveInDate}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <span className="form-label" id="tags-form-label">Tags</span>
        <div className="form-tags" role="group" aria-labelledby="tags-form-label">
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`form-tag-btn ${form.tags.includes(tag) ? 'active' : ''}`}
              onClick={() => handleTagToggle(tag)}
              aria-pressed={form.tags.includes(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="notes" className="form-label">Notes</label>
        <textarea
          id="notes"
          name="notes"
          className="form-input form-textarea"
          value={form.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Any additional notes..."
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {isEditing ? 'Save Changes' : 'Add Resident'}
        </button>
      </div>
    </form>
  );
}

export default ResidentForm;
