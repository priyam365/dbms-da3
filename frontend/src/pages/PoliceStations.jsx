import React, { useState, useEffect, useCallback } from 'react';
import { Building2, Plus, Phone, MapPin, Users } from 'lucide-react';
import { policeStationsApi } from '../api';
import DataTable from '../components/DataTable';
import Modal, { ConfirmDeleteModal } from '../components/Modal';
import FormField from '../components/FormField';
import { useToast } from '../components/Toast';

export function PoliceStations() {
  const { showToast } = useToast();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeStation, setActiveStation] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    city: '',
    contactNumber: '',
    officerCount: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchStations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await policeStationsApi.getAll();
      setStations(data);
    } catch (err) {
      showToast('Failed to load police stations', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  const handleOpenAdd = () => {
    setActiveStation(null);
    setFormData({
      name: '',
      location: '',
      city: '',
      contactNumber: '',
      officerCount: '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (station) => {
    setActiveStation(station);
    setFormData({
      name: station.name || '',
      location: station.location || '',
      city: station.city || '',
      contactNumber: station.contactNumber || '',
      officerCount: station.officerCount ?? '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenDelete = (station) => {
    setActiveStation(station);
    setIsDeleteModalOpen(true);
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Station name is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.location.trim()) errors.location = 'Address/Location is required';
    if (!formData.contactNumber.trim()) errors.contactNumber = 'Contact number is required';
    if (
      formData.officerCount === '' ||
      isNaN(Number(formData.officerCount)) ||
      Number(formData.officerCount) < 0
    ) {
      errors.officerCount = 'Valid officer count is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      if (activeStation) {
        await policeStationsApi.update(activeStation.stationId, formData);
        showToast(`Police station "${formData.name}" updated successfully`, 'success');
      } else {
        await policeStationsApi.create(formData);
        showToast(`Police station "${formData.name}" created successfully`, 'success');
      }
      setIsModalOpen(false);
      fetchStations();
    } catch (err) {
      showToast(err.friendlyMessage || 'Error saving station', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!activeStation) return;
    try {
      setSubmitting(true);
      await policeStationsApi.deleteOne(activeStation.stationId);
      showToast(`Station "${activeStation.name}" deleted`, 'success');
      setIsDeleteModalOpen(false);
      fetchStations();
    } catch (err) {
      showToast('Failed to delete police station', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Station ID',
      key: 'stationId',
      render: (val) => (
        <span style={{ fontWeight: 700, color: '#93c5fd' }}>{val}</span>
      ),
    },
    {
      header: 'Station Name',
      key: 'name',
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{val}</div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            <Phone size={12} style={{ display: 'inline', marginRight: '4px' }} />
            {row.contactNumber}
          </div>
        </div>
      ),
    },
    {
      header: 'City',
      key: 'city',
      render: (val) => (
        <span className="badge badge-blue">
          <MapPin size={11} style={{ marginRight: '2px' }} />
          {val}
        </span>
      ),
    },
    {
      header: 'Location / Address',
      key: 'location',
    },
    {
      header: 'Officers',
      key: 'officerCount',
      align: 'center',
      render: (val) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
          <Users size={14} style={{ color: 'var(--accent-primary)' }} />
          {val ?? 0}
        </span>
      ),
    },
  ];

  return (
    <div className="police-stations-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">
            <Building2 size={26} style={{ color: '#3b82f6' }} />
            Police Stations Registry
          </h1>
          <p className="page-subtitle">
            Manage jurisdictional police stations, headquarters, and officer allocations
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> Add Police Station
        </button>
      </div>

      <DataTable
        columns={columns}
        data={stations}
        loading={loading}
        idField="stationId"
        emptyMessage="No police stations registered"
        searchPlaceholder="Search station by name, city, or address..."
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activeStation ? 'Edit Police Station' : 'Register New Police Station'}
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
              {submitting ? 'Saving...' : activeStation ? 'Save Changes' : 'Create Station'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <FormField
              label="Station Name"
              name="name"
              required
              placeholder="e.g. Central Police Station"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={formErrors.name}
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
              label="Address / Jurisdiction Location"
              name="location"
              required
              placeholder="e.g. 12, MG Road, Near Clocktower"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              error={formErrors.location}
            />
          </div>

          <div className="form-grid" style={{ marginTop: '1rem' }}>
            <FormField
              label="Contact Number"
              name="contactNumber"
              required
              placeholder="e.g. 0712-2560001"
              value={formData.contactNumber}
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              error={formErrors.contactNumber}
            />
            <FormField
              label="Officer Count"
              name="officerCount"
              type="number"
              min="0"
              required
              placeholder="e.g. 45"
              value={formData.officerCount}
              onChange={(e) => setFormData({ ...formData, officerCount: e.target.value })}
              error={formErrors.officerCount}
            />
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Police Station"
        message={`Are you sure you want to delete "${activeStation?.name}"? All related officer assignments may become orphaned.`}
        loading={submitting}
      />
    </div>
  );
}

export default PoliceStations;
