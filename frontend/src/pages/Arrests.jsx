import React, { useState, useEffect, useCallback } from 'react';
import { UserX, Plus, Calendar, Shield, Gavel, FileCheck } from 'lucide-react';
import { arrestsApi, casesApi, criminalsApi, officersApi } from '../api';
import DataTable from '../components/DataTable';
import Modal, { ConfirmDeleteModal } from '../components/Modal';
import FormField from '../components/FormField';
import StatusBadge from '../components/StatusBadge';
import { useToast } from '../components/Toast';

const ARREST_STATUSES = [
  'In Custody',
  'Released on Bail',
  'Produced in Court',
  'Arrested',
];

export function Arrests() {
  const { showToast } = useToast();
  const [arrests, setArrests] = useState([]);
  const [cases, setCases] = useState([]);
  const [criminals, setCriminals] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeArrest, setActiveArrest] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    arrestDate: new Date().toISOString().split('T')[0],
    status: 'In Custody',
    charges: '',
    caseId: '',
    criminalId: '',
    officerId: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchArrests = useCallback(async () => {
    try {
      setLoading(true);
      const [arrestsData, casesData, criminalsData, officersData] = await Promise.all([
        arrestsApi.getAll(),
        casesApi.getAll(),
        criminalsApi.getAll(),
        officersApi.getAll(),
      ]);
      setArrests(arrestsData);
      setCases(casesData);
      setCriminals(criminalsData);
      setOfficers(officersData);
    } catch (err) {
      showToast('Failed to load arrest records', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchArrests();
  }, [fetchArrests]);

  const handleOpenAdd = () => {
    setActiveArrest(null);
    setFormData({
      arrestDate: new Date().toISOString().split('T')[0],
      status: 'In Custody',
      charges: '',
      caseId: cases[0]?.caseId || '',
      criminalId: criminals[0]?.criminalId || '',
      officerId: officers[0]?.officerId || '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (arrest) => {
    setActiveArrest(arrest);
    setFormData({
      arrestDate: arrest.arrestDate || '',
      status: arrest.status || 'In Custody',
      charges: arrest.charges || '',
      caseId: arrest.caseId || '',
      criminalId: arrest.criminalId || '',
      officerId: arrest.officerId || '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenDelete = (arrest) => {
    setActiveArrest(arrest);
    setIsDeleteModalOpen(true);
  };

  const validate = () => {
    const errors = {};
    if (!formData.arrestDate) errors.arrestDate = 'Arrest date is required';
    if (!formData.status) errors.status = 'Custody status is required';
    if (!formData.charges.trim()) errors.charges = 'Legal charges/sections are required';
    if (!formData.caseId) errors.caseId = 'Associated case is required';
    if (!formData.criminalId) errors.criminalId = 'Suspect/Criminal is required';
    if (!formData.officerId) errors.officerId = 'Executing officer is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      if (activeArrest) {
        await arrestsApi.update(activeArrest.arrestId, formData);
        showToast('Arrest record updated', 'success');
      } else {
        await arrestsApi.create(formData);
        showToast('Arrest record filed and suspect booked', 'success');
      }
      setIsModalOpen(false);
      fetchArrests();
    } catch (err) {
      showToast(err.friendlyMessage || 'Error logging arrest', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!activeArrest) return;
    try {
      setSubmitting(true);
      await arrestsApi.deleteOne(activeArrest.arrestId);
      showToast('Arrest record deleted', 'success');
      setIsDeleteModalOpen(false);
      fetchArrests();
    } catch (err) {
      showToast('Failed to delete arrest record', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Arrest ID',
      key: 'arrestId',
      render: (val) => (
        <span style={{ fontWeight: 700, color: '#93c5fd' }}>{val}</span>
      ),
    },
    {
      header: 'Suspect Apprehended',
      key: 'criminalName',
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 700, color: '#fff' }}>{val || row.criminalId}</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Case: {row.caseId}
          </div>
        </div>
      ),
    },
    {
      header: 'Custody Status',
      key: 'status',
      align: 'center',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      header: 'Booking Date',
      key: 'arrestDate',
      render: (val) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.84rem' }}>
          <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
          {val}
        </span>
      ),
    },
    {
      header: 'Charges & Sections',
      key: 'charges',
      render: (val) => (
        <div style={{ maxWidth: '280px', fontSize: '0.84rem', color: '#fca5a5' }}>
          {val}
        </div>
      ),
    },
    {
      header: 'Arresting Officer',
      key: 'officerName',
      render: (val, row) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem' }}>
          <Shield size={13} style={{ color: 'var(--accent-primary)' }} />
          {val || row.officerId}
        </span>
      ),
    },
  ];

  return (
    <div className="arrests-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">
            <UserX size={26} style={{ color: '#ef4444' }} />
            Arrests &amp; Custody Bookings
          </h1>
          <p className="page-subtitle">
            Log warrant executions, statutory charges, bail remands, and magistrate productions
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> Book New Arrest
        </button>
      </div>

      <DataTable
        columns={columns}
        data={arrests}
        loading={loading}
        idField="arrestId"
        emptyMessage="No arrest records logged"
        searchPlaceholder="Search arrest by suspect, charges, officer..."
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activeArrest ? 'Edit Arrest Booking' : 'Log Suspect Arrest & Detention'}
        size="large"
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
              {submitting ? 'Saving...' : activeArrest ? 'Save Changes' : 'Execute Booking'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <FormField
              label="Suspect / Criminal"
              name="criminalId"
              type="select"
              required
              options={criminals.map((c) => ({ value: c.criminalId, label: `${c.name} (${c.criminalId})` }))}
              value={formData.criminalId}
              onChange={(e) => setFormData({ ...formData, criminalId: e.target.value })}
              error={formErrors.criminalId}
            />
            <FormField
              label="Custody Status"
              name="status"
              type="select"
              required
              options={ARREST_STATUSES}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              error={formErrors.status}
            />
          </div>

          <div className="form-grid" style={{ marginTop: '1rem' }}>
            <FormField
              label="Associated Case"
              name="caseId"
              type="select"
              required
              options={cases.map((c) => ({ value: c.caseId, label: `${c.caseId} — ${c.title}` }))}
              value={formData.caseId}
              onChange={(e) => setFormData({ ...formData, caseId: e.target.value })}
              error={formErrors.caseId}
            />
            <FormField
              label="Arresting Officer"
              name="officerId"
              type="select"
              required
              options={officers.map((o) => ({ value: o.officerId, label: `${o.name} (${o.rank})` }))}
              value={formData.officerId}
              onChange={(e) => setFormData({ ...formData, officerId: e.target.value })}
              error={formErrors.officerId}
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <FormField
              label="Arrest Date & Time"
              name="arrestDate"
              type="date"
              required
              value={formData.arrestDate}
              onChange={(e) => setFormData({ ...formData, arrestDate: e.target.value })}
              error={formErrors.arrestDate}
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <FormField
              label="Legal Charges & Penal Code Sections"
              name="charges"
              type="textarea"
              rows={3}
              required
              placeholder="e.g. Armed Robbery under IPC Section 392, 397; IT Act Section 66C..."
              value={formData.charges}
              onChange={(e) => setFormData({ ...formData, charges: e.target.value })}
              error={formErrors.charges}
            />
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Arrest Record"
        message={`Are you sure you want to delete arrest record "${activeArrest?.arrestId}"?`}
        loading={submitting}
      />
    </div>
  );
}

export default Arrests;
