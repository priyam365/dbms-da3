import React, { useState, useEffect, useCallback } from 'react';
import { Gavel, Plus, MapPin, Scale, UserCheck } from 'lucide-react';
import { courtsApi } from '../api';
import DataTable from '../components/DataTable';
import Modal, { ConfirmDeleteModal } from '../components/Modal';
import FormField from '../components/FormField';
import { useToast } from '../components/Toast';

const COURT_TYPES = [
  'Sessions Court',
  'High Court',
  'Magistrate Court',
  'Special NDPS Court',
  'Juvenile Justice Board',
];

export function Courts() {
  const { showToast } = useToast();
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeCourt, setActiveCourt] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    city: '',
    courtType: 'Sessions Court',
    judgeAssigned: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchCourts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await courtsApi.getAll();
      setCourts(data);
    } catch (err) {
      showToast('Failed to load courts directory', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchCourts();
  }, [fetchCourts]);

  const handleOpenAdd = () => {
    setActiveCourt(null);
    setFormData({
      name: '',
      location: '',
      city: '',
      courtType: 'Sessions Court',
      judgeAssigned: '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (court) => {
    setActiveCourt(court);
    setFormData({
      name: court.name || '',
      location: court.location || '',
      city: court.city || '',
      courtType: court.courtType || 'Sessions Court',
      judgeAssigned: court.judgeAssigned || '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenDelete = (court) => {
    setActiveCourt(court);
    setIsDeleteModalOpen(true);
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Court name is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.location.trim()) errors.location = 'Location / road is required';
    if (!formData.courtType) errors.courtType = 'Court jurisdiction type is required';
    if (!formData.judgeAssigned.trim()) errors.judgeAssigned = 'Assigned judge / magistrate is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      if (activeCourt) {
        await courtsApi.update(activeCourt.courtId, formData);
        showToast(`Court record "${formData.name}" updated`, 'success');
      } else {
        await courtsApi.create(formData);
        showToast(`Court "${formData.name}" registered`, 'success');
      }
      setIsModalOpen(false);
      fetchCourts();
    } catch (err) {
      showToast(err.friendlyMessage || 'Error saving court details', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!activeCourt) return;
    try {
      setSubmitting(true);
      await courtsApi.deleteOne(activeCourt.courtId);
      showToast(`Court record "${activeCourt.name}" deleted`, 'success');
      setIsDeleteModalOpen(false);
      fetchCourts();
    } catch (err) {
      showToast('Failed to delete court record', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Court ID',
      key: 'courtId',
      render: (val) => (
        <span style={{ fontWeight: 700, color: '#93c5fd' }}>{val}</span>
      ),
    },
    {
      header: 'Court Name',
      key: 'name',
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 600, color: '#fff' }}>{val}</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            <MapPin size={11} style={{ display: 'inline', marginRight: '3px' }} />
            {row.location}, {row.city}
          </div>
        </div>
      ),
    },
    {
      header: 'Jurisdiction Type',
      key: 'courtType',
      render: (val) => (
        <span className="badge badge-purple">{val}</span>
      ),
    },
    {
      header: 'City',
      key: 'city',
      render: (val) => (
        <span className="badge badge-blue">{val}</span>
      ),
    },
    {
      header: 'Presiding Judge / Magistrate',
      key: 'judgeAssigned',
      render: (val) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.84rem' }}>
          <Scale size={13} style={{ color: '#f59e0b' }} />
          <span>{val}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="courts-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">
            <Gavel size={26} style={{ color: '#f59e0b' }} />
            Judicial Courts Directory
          </h1>
          <p className="page-subtitle">
            Magistrate, Sessions, and Special trial benches receiving case prosecution chargesheets
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> Register Court Bench
        </button>
      </div>

      <DataTable
        columns={columns}
        data={courts}
        loading={loading}
        idField="courtId"
        emptyMessage="No judicial court benches registered"
        searchPlaceholder="Search court by name, judge, city..."
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activeCourt ? 'Edit Judicial Court Record' : 'Register New Judicial Bench'}
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
              {submitting ? 'Saving...' : activeCourt ? 'Save Changes' : 'Register Bench'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <FormField
            label="Court Name"
            name="name"
            required
            placeholder="e.g. Nagpur Sessions Court"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={formErrors.name}
          />

          <div className="form-grid" style={{ marginTop: '1rem' }}>
            <FormField
              label="Jurisdiction Type"
              name="courtType"
              type="select"
              required
              options={COURT_TYPES}
              value={formData.courtType}
              onChange={(e) => setFormData({ ...formData, courtType: e.target.value })}
              error={formErrors.courtType}
            />
            <FormField
              label="City"
              name="city"
              required
              placeholder="e.g. Nagpur"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              error={formErrors.city}
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <FormField
              label="Court Complex Location / Address"
              name="location"
              required
              placeholder="e.g. Civil Court Road, Civil Lines"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              error={formErrors.location}
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <FormField
              label="Presiding Judge / Magistrate"
              name="judgeAssigned"
              required
              placeholder="e.g. Hon. Justice R. S. Deshmukh"
              value={formData.judgeAssigned}
              onChange={(e) => setFormData({ ...formData, judgeAssigned: e.target.value })}
              error={formErrors.judgeAssigned}
            />
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Court Record"
        message={`Are you sure you want to delete court record "${activeCourt?.name}"?`}
        loading={submitting}
      />
    </div>
  );
}

export default Courts;
