import React, { useState, useEffect, useCallback } from 'react';
import { Users, Plus, Tag, AlertOctagon, UserCheck } from 'lucide-react';
import { criminalsApi } from '../api';
import DataTable from '../components/DataTable';
import Modal, { ConfirmDeleteModal } from '../components/Modal';
import FormField from '../components/FormField';
import { useToast } from '../components/Toast';

const GENDERS = ['Male', 'Female', 'Other'];

export function Criminals() {
  const { showToast } = useToast();
  const [criminals, setCriminals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeCriminal, setActiveCriminal] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    identifyingDescription: '',
    knownAliases: '',
    criminalHistory: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchCriminals = useCallback(async () => {
    try {
      setLoading(true);
      const data = await criminalsApi.getAll();
      setCriminals(data);
    } catch (err) {
      showToast('Failed to load criminals registry', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchCriminals();
  }, [fetchCriminals]);

  const handleOpenAdd = () => {
    setActiveCriminal(null);
    setFormData({
      name: '',
      age: '',
      gender: 'Male',
      identifyingDescription: '',
      knownAliases: '',
      criminalHistory: '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (criminal) => {
    setActiveCriminal(criminal);
    setFormData({
      name: criminal.name || '',
      age: criminal.age ?? '',
      gender: criminal.gender || 'Male',
      identifyingDescription: criminal.identifyingDescription || '',
      knownAliases: criminal.knownAliases || '',
      criminalHistory: criminal.criminalHistory || '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenDelete = (criminal) => {
    setActiveCriminal(criminal);
    setIsDeleteModalOpen(true);
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (
      formData.age === '' ||
      isNaN(Number(formData.age)) ||
      Number(formData.age) < 1 ||
      Number(formData.age) > 120
    ) {
      errors.age = 'Enter a valid age (1-120)';
    }
    if (!formData.gender) errors.gender = 'Gender is required';
    if (!formData.identifyingDescription.trim())
      errors.identifyingDescription = 'Physical identifying marks are required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      if (activeCriminal) {
        await criminalsApi.update(activeCriminal.criminalId, formData);
        showToast(`Criminal profile "${formData.name}" updated`, 'success');
      } else {
        await criminalsApi.create(formData);
        showToast(`Criminal "${formData.name}" added to database`, 'success');
      }
      setIsModalOpen(false);
      fetchCriminals();
    } catch (err) {
      showToast(err.friendlyMessage || 'Error saving criminal profile', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!activeCriminal) return;
    try {
      setSubmitting(true);
      await criminalsApi.deleteOne(activeCriminal.criminalId);
      showToast(`Record for "${activeCriminal.name}" deleted`, 'success');
      setIsDeleteModalOpen(false);
      fetchCriminals();
    } catch (err) {
      showToast('Failed to delete criminal record', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Suspect / Name',
      key: 'name',
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ef4444',
              fontWeight: 700,
              fontSize: '0.8rem',
            }}
          >
            {val.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: '#fff' }}>{val}</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              ID: {row.criminalId}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Age / Gender',
      key: 'age',
      render: (val, row) => (
        <span style={{ fontSize: '0.84rem' }}>
          {val} yrs • {row.gender}
        </span>
      ),
    },
    {
      header: 'Known Aliases',
      key: 'knownAliases',
      render: (val) => (
        <span style={{ color: '#f59e0b', fontSize: '0.82rem', fontWeight: 500 }}>
          <Tag size={11} style={{ display: 'inline', marginRight: '3px' }} />
          {val || 'None recorded'}
        </span>
      ),
    },
    {
      header: 'Identifying Description',
      key: 'identifyingDescription',
      render: (val) => (
        <div style={{ maxWidth: '280px', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
          {val}
        </div>
      ),
    },
    {
      header: 'Prior Criminal History',
      key: 'criminalHistory',
      render: (val) => (
        <div style={{ maxWidth: '240px', fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {val || 'No previous convictions'}
        </div>
      ),
    },
  ];

  return (
    <div className="criminals-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">
            <Users size={26} style={{ color: '#ef4444' }} />
            Criminal & Suspect Dossiers
          </h1>
          <p className="page-subtitle">
            Comprehensive suspect profiling, physical identification traits, aliases, and offense histories
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> New Criminal Dossier
        </button>
      </div>

      <DataTable
        columns={columns}
        data={criminals}
        loading={loading}
        idField="criminalId"
        emptyMessage="No criminal profiles logged"
        searchPlaceholder="Search criminal by name, alias, history..."
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activeCriminal ? 'Edit Criminal Dossier' : 'Create Criminal Profile'}
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
              {submitting ? 'Saving...' : activeCriminal ? 'Save Changes' : 'Save Dossier'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <FormField
              label="Full Name & Nickname"
              name="name"
              required
              placeholder="e.g. Vijay alias 'Kalu' Deshpande"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={formErrors.name}
            />
            <FormField
              label="Known Aliases"
              name="knownAliases"
              placeholder="e.g. Kalu, VD, Tiger"
              value={formData.knownAliases}
              onChange={(e) => setFormData({ ...formData, knownAliases: e.target.value })}
            />
          </div>

          <div className="form-grid" style={{ marginTop: '1rem' }}>
            <FormField
              label="Age"
              name="age"
              type="number"
              min="1"
              max="120"
              required
              placeholder="e.g. 32"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              error={formErrors.age}
            />
            <FormField
              label="Gender"
              name="gender"
              type="select"
              required
              options={GENDERS}
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              error={formErrors.gender}
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <FormField
              label="Physical Identifying Marks & Traits"
              name="identifyingDescription"
              type="textarea"
              rows={3}
              required
              placeholder="e.g. Scar on left cheek, tattoo on right forearm, height 5'9, limp in left leg..."
              value={formData.identifyingDescription}
              onChange={(e) =>
                setFormData({ ...formData, identifyingDescription: e.target.value })
              }
              error={formErrors.identifyingDescription}
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <FormField
              label="Past Criminal Record & Convictions"
              name="criminalHistory"
              type="textarea"
              rows={3}
              placeholder="e.g. Arrested for armed robbery in 2019, acquitted in 2021..."
              value={formData.criminalHistory}
              onChange={(e) => setFormData({ ...formData, criminalHistory: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Criminal Record"
        message={`Are you sure you want to permanently delete the profile for "${activeCriminal?.name}"?`}
        loading={submitting}
      />
    </div>
  );
}

export default Criminals;
