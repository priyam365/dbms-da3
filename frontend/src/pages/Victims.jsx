import React, { useState, useEffect, useCallback } from 'react';
import { HeartHandshake, Plus, Phone, MapPin, User } from 'lucide-react';
import { victimsApi } from '../api';
import DataTable from '../components/DataTable';
import Modal, { ConfirmDeleteModal } from '../components/Modal';
import FormField from '../components/FormField';
import { useToast } from '../components/Toast';

const GENDERS = ['Male', 'Female', 'Other'];

export function Victims() {
  const { showToast } = useToast();
  const [victims, setVictims] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeVictim, setActiveVictim] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    contactNumber: '',
    address: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchVictims = useCallback(async () => {
    try {
      setLoading(true);
      const data = await victimsApi.getAll();
      setVictims(data);
    } catch (err) {
      showToast('Failed to load victims registry', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchVictims();
  }, [fetchVictims]);

  const handleOpenAdd = () => {
    setActiveVictim(null);
    setFormData({
      name: '',
      age: '',
      gender: 'Male',
      contactNumber: '',
      address: '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (victim) => {
    setActiveVictim(victim);
    setFormData({
      name: victim.name || '',
      age: victim.age ?? '',
      gender: victim.gender || 'Male',
      contactNumber: victim.contactNumber || '',
      address: victim.address || '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenDelete = (victim) => {
    setActiveVictim(victim);
    setIsDeleteModalOpen(true);
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Victim name is required';
    if (
      formData.age === '' ||
      isNaN(Number(formData.age)) ||
      Number(formData.age) < 1 ||
      Number(formData.age) > 120
    ) {
      errors.age = 'Enter a valid age (1-120)';
    }
    if (!formData.gender) errors.gender = 'Gender is required';
    if (!formData.contactNumber.trim()) errors.contactNumber = 'Contact number is required';
    if (!formData.address.trim()) errors.address = 'Residential address is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      if (activeVictim) {
        await victimsApi.update(activeVictim.victimId, formData);
        showToast(`Victim record "${formData.name}" updated`, 'success');
      } else {
        await victimsApi.create(formData);
        showToast(`Victim "${formData.name}" registered`, 'success');
      }
      setIsModalOpen(false);
      fetchVictims();
    } catch (err) {
      showToast(err.friendlyMessage || 'Error saving victim record', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!activeVictim) return;
    try {
      setSubmitting(true);
      await victimsApi.deleteOne(activeVictim.victimId);
      showToast(`Victim record "${activeVictim.name}" deleted`, 'success');
      setIsDeleteModalOpen(false);
      fetchVictims();
    } catch (err) {
      showToast('Failed to delete victim record', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Victim ID',
      key: 'victimId',
      render: (val) => (
        <span style={{ fontWeight: 700, color: '#93c5fd' }}>{val}</span>
      ),
    },
    {
      header: 'Name',
      key: 'name',
      render: (val) => (
        <span style={{ fontWeight: 600, color: '#fff' }}>{val}</span>
      ),
    },
    {
      header: 'Demographics',
      key: 'age',
      render: (val, row) => (
        <span style={{ fontSize: '0.84rem' }}>
          {val} yrs • {row.gender}
        </span>
      ),
    },
    {
      header: 'Contact Number',
      key: 'contactNumber',
      render: (val) => (
        <span style={{ fontSize: '0.84rem', color: '#86efac' }}>
          <Phone size={12} style={{ display: 'inline', marginRight: '4px' }} />
          {val}
        </span>
      ),
    },
    {
      header: 'Address',
      key: 'address',
      render: (val) => (
        <div style={{ maxWidth: '320px', fontSize: '0.84rem' }}>
          <MapPin size={12} style={{ display: 'inline', marginRight: '4px', color: 'var(--text-muted)' }} />
          {val}
        </div>
      ),
    },
  ];

  return (
    <div className="victims-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">
            <HeartHandshake size={26} style={{ color: '#ec4899' }} />
            Victims & Complainants Registry
          </h1>
          <p className="page-subtitle">
            Confidential records of affected parties, statements, and witness assistance contacts
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> Register Victim Record
        </button>
      </div>

      <DataTable
        columns={columns}
        data={victims}
        loading={loading}
        idField="victimId"
        emptyMessage="No victim records filed"
        searchPlaceholder="Search victim by name, address, contact..."
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activeVictim ? 'Edit Victim Information' : 'Register New Victim Record'}
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
              {submitting ? 'Saving...' : activeVictim ? 'Save Changes' : 'Register Victim'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <FormField
            label="Full Name"
            name="name"
            required
            placeholder="e.g. Ramesh Shankar Gupta"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={formErrors.name}
          />

          <div className="form-grid" style={{ marginTop: '1rem' }}>
            <FormField
              label="Age"
              name="age"
              type="number"
              min="1"
              max="120"
              required
              placeholder="e.g. 55"
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
              label="Contact Phone Number"
              name="contactNumber"
              required
              placeholder="e.g. 9823000001"
              value={formData.contactNumber}
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              error={formErrors.contactNumber}
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <FormField
              label="Residential Address"
              name="address"
              type="textarea"
              rows={3}
              required
              placeholder="e.g. 12, Dharampeth, Nagpur"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              error={formErrors.address}
            />
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Victim Record"
        message={`Are you sure you want to delete the record for "${activeVictim?.name}"?`}
        loading={submitting}
      />
    </div>
  );
}

export default Victims;
