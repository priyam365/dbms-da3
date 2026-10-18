import React, { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, Plus, MapPin, Calendar, ShieldAlert } from 'lucide-react';
import { crimesApi } from '../api';
import DataTable from '../components/DataTable';
import Modal, { ConfirmDeleteModal } from '../components/Modal';
import FormField from '../components/FormField';
import StatusBadge from '../components/StatusBadge';
import { useToast } from '../components/Toast';

const SEVERITY_LEVELS = ['Low', 'Medium', 'High'];
const CRIME_TYPES = [
  'Armed Robbery',
  'Cybercrime',
  'Murder',
  'Vehicle Theft',
  'Drug Trafficking',
  'Assault',
  'Extortion',
  'Fraud',
  'Burglary',
];

export function Crimes() {
  const { showToast } = useToast();
  const [crimes, setCrimes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeCrime, setActiveCrime] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    crimeType: 'Armed Robbery',
    location: '',
    city: '',
    date: new Date().toISOString().split('T')[0],
    severity: 'Medium',
    description: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchCrimes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await crimesApi.getAll();
      setCrimes(data);
    } catch (err) {
      showToast('Failed to load crime records', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchCrimes();
  }, [fetchCrimes]);

  const handleOpenAdd = () => {
    setActiveCrime(null);
    setFormData({
      crimeType: 'Armed Robbery',
      location: '',
      city: '',
      date: new Date().toISOString().split('T')[0],
      severity: 'Medium',
      description: '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (crime) => {
    setActiveCrime(crime);
    setFormData({
      crimeType: crime.crimeType || 'Armed Robbery',
      location: crime.location || '',
      city: crime.city || '',
      date: crime.date || '',
      severity: crime.severity || 'Medium',
      description: crime.description || '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenDelete = (crime) => {
    setActiveCrime(crime);
    setIsDeleteModalOpen(true);
  };

  const validate = () => {
    const errors = {};
    if (!formData.crimeType.trim()) errors.crimeType = 'Crime type is required';
    if (!formData.location.trim()) errors.location = 'Specific location is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.date) errors.date = 'Incident date is required';
    if (!formData.description.trim()) errors.description = 'Incident description is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      if (activeCrime) {
        await crimesApi.update(activeCrime.crimeId, formData);
        showToast(`Crime incident "${formData.crimeType}" updated`, 'success');
      } else {
        await crimesApi.create(formData);
        showToast(`New crime incident "${formData.crimeType}" logged`, 'success');
      }
      setIsModalOpen(false);
      fetchCrimes();
    } catch (err) {
      showToast(err.friendlyMessage || 'Error saving crime record', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!activeCrime) return;
    try {
      setSubmitting(true);
      await crimesApi.deleteOne(activeCrime.crimeId);
      showToast('Crime record deleted', 'success');
      setIsDeleteModalOpen(false);
      fetchCrimes();
    } catch (err) {
      showToast('Failed to delete crime incident', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Crime ID',
      key: 'crimeId',
      render: (val) => (
        <span style={{ fontWeight: 700, color: '#93c5fd' }}>{val}</span>
      ),
    },
    {
      header: 'Crime Type',
      key: 'crimeType',
      render: (val) => (
        <span style={{ fontWeight: 600, color: '#fff' }}>{val}</span>
      ),
    },
    {
      header: 'Severity',
      key: 'severity',
      align: 'center',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      header: 'City / Location',
      key: 'location',
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 500 }}>{val}</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            <MapPin size={11} style={{ display: 'inline', marginRight: '3px' }} />
            {row.city}
          </div>
        </div>
      ),
    },
    {
      header: 'Incident Date',
      key: 'date',
      render: (val) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.84rem' }}>
          <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
          {val}
        </span>
      ),
    },
    {
      header: 'Description',
      key: 'description',
      render: (val) => (
        <div style={{ maxWidth: '320px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.84rem' }}>
          {val}
        </div>
      ),
    },
  ];

  return (
    <div className="crimes-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">
            <AlertTriangle size={26} style={{ color: '#ef4444' }} />
            Crime Incidents Registry
          </h1>
          <p className="page-subtitle">
            Classify and track offenses, locations, severity ratings, and incident timelines
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> Log Crime Incident
        </button>
      </div>

      <DataTable
        columns={columns}
        data={crimes}
        loading={loading}
        idField="crimeId"
        emptyMessage="No crime incidents registered"
        searchPlaceholder="Search crime by category, location, city..."
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activeCrime ? 'Edit Crime Record' : 'Record New Crime Incident'}
        size="medium"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Saving...' : activeCrime ? 'Save Changes' : 'Record Incident'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <FormField
              label="Crime Type / Category"
              name="crimeType"
              type="select"
              required
              options={CRIME_TYPES}
              value={formData.crimeType}
              onChange={(e) => setFormData({ ...formData, crimeType: e.target.value })}
              error={formErrors.crimeType}
            />
            <FormField
              label="Severity Level"
              name="severity"
              type="select"
              required
              options={SEVERITY_LEVELS}
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
              error={formErrors.severity}
            />
          </div>

          <div className="form-grid" style={{ marginTop: '1rem' }}>
            <FormField
              label="City"
              name="city"
              required
              placeholder="e.g. Nagpur"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              error={formErrors.city}
            />
            <FormField
              label="Incident Date"
              name="date"
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              error={formErrors.date}
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <FormField
              label="Specific Location / Landmark"
              name="location"
              required
              placeholder="e.g. State Bank, Sitabuldi Branch"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              error={formErrors.location}
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <FormField
              label="Incident Narrative & Circumstances"
              name="description"
              type="textarea"
              rows={4}
              required
              placeholder="Provide complete facts regarding weapon used, manner of entry, damage caused, etc."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              error={formErrors.description}
            />
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Crime Incident"
        message={`Are you sure you want to delete this ${activeCrime?.crimeType} incident? This will remove related graph edges.`}
        loading={submitting}
      />
    </div>
  );
}

export default Crimes;
