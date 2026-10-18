import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Plus, Filter, Calendar, User, Shield } from 'lucide-react';
import { firsApi, policeStationsApi, officersApi, crimesApi } from '../api';
import DataTable from '../components/DataTable';
import Modal, { ConfirmDeleteModal } from '../components/Modal';
import FormField from '../components/FormField';
import StatusBadge from '../components/StatusBadge';
import { useToast } from '../components/Toast';

const STATUS_OPTIONS = ['Pending', 'Under Investigation', 'Closed'];

export function FIRs() {
  const { showToast } = useToast();
  const [firs, setFirs] = useState([]);
  const [stations, setStations] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [crimes, setCrimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeFir, setActiveFir] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firNumber: '',
    registrationDate: new Date().toISOString().split('T')[0],
    description: '',
    status: 'Pending',
    complainantName: '',
    stationId: '',
    officerId: '',
    crimeId: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchFirs = useCallback(async () => {
    try {
      setLoading(true);
      const params = statusFilter !== 'All' ? { status: statusFilter } : {};
      const [firsData, stationsData, officersData, crimesData] = await Promise.all([
        firsApi.getAll(params),
        policeStationsApi.getAll(),
        officersApi.getAll(),
        crimesApi.getAll(),
      ]);
      setFirs(firsData);
      setStations(stationsData);
      setOfficers(officersData);
      setCrimes(crimesData);
    } catch (err) {
      showToast('Failed to load FIRs', 'error');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, showToast]);

  useEffect(() => {
    fetchFirs();
  }, [fetchFirs]);

  const handleOpenAdd = () => {
    setActiveFir(null);
    setFormData({
      firNumber: `FIR/2024/00${firs.length + 1}`,
      registrationDate: new Date().toISOString().split('T')[0],
      description: '',
      status: 'Pending',
      complainantName: '',
      stationId: stations[0]?.stationId || '',
      officerId: officers[0]?.officerId || '',
      crimeId: crimes[0]?.crimeId || '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (fir) => {
    setActiveFir(fir);
    setFormData({
      firNumber: fir.firNumber || '',
      registrationDate: fir.registrationDate || '',
      description: fir.description || '',
      status: fir.status || 'Pending',
      complainantName: fir.complainantName || '',
      stationId: fir.stationId || '',
      officerId: fir.officerId || '',
      crimeId: fir.crimeId || '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenDelete = (fir) => {
    setActiveFir(fir);
    setIsDeleteModalOpen(true);
  };

  const validate = () => {
    const errors = {};
    if (!formData.firNumber.trim()) errors.firNumber = 'FIR Number is required';
    if (!formData.registrationDate) errors.registrationDate = 'Registration date is required';
    if (!formData.complainantName.trim()) errors.complainantName = 'Complainant name is required';
    if (!formData.description.trim()) errors.description = 'Incident description is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      if (activeFir) {
        await firsApi.update(activeFir.firId, formData);
        showToast(`FIR ${formData.firNumber} updated successfully`, 'success');
      } else {
        await firsApi.create(formData);
        showToast(`FIR ${formData.firNumber} registered successfully`, 'success');
      }
      setIsModalOpen(false);
      fetchFirs();
    } catch (err) {
      showToast(err.friendlyMessage || 'Error saving FIR', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!activeFir) return;
    try {
      setSubmitting(true);
      await firsApi.deleteOne(activeFir.firId);
      showToast(`FIR ${activeFir.firNumber} deleted`, 'success');
      setIsDeleteModalOpen(false);
      fetchFirs();
    } catch (err) {
      showToast('Failed to delete FIR', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'FIR Number',
      key: 'firNumber',
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 700, color: '#93c5fd', fontFamily: 'monospace' }}>
            {val}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            ID: {row.firId}
          </div>
        </div>
      ),
    },
    {
      header: 'Registration Date',
      key: 'registrationDate',
      render: (val) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.84rem' }}>
          <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
          {val}
        </span>
      ),
    },
    {
      header: 'Complainant',
      key: 'complainantName',
      render: (val) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
          <User size={13} style={{ color: 'var(--accent-primary)' }} />
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
    {
      header: 'Status',
      key: 'status',
      align: 'center',
      render: (val) => <StatusBadge status={val} />,
    },
  ];

  return (
    <div className="firs-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">
            <FileText size={26} style={{ color: '#22c55e' }} />
            First Information Reports (FIR)
          </h1>
          <p className="page-subtitle">
            Formal registry of cognizable crime complaints and initial incident filings
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={15} style={{ color: 'var(--text-muted)' }} />
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.82rem' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} /> File New FIR
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={firs}
        loading={loading}
        idField="firId"
        emptyMessage="No FIR records filed"
        searchPlaceholder="Search FIR by number, complainant, or details..."
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activeFir ? 'Edit FIR Complaint' : 'Register First Information Report (FIR)'}
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
              {submitting ? 'Submitting...' : activeFir ? 'Save Changes' : 'Register FIR'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <FormField
              label="FIR Number"
              name="firNumber"
              required
              placeholder="e.g. FIR/2024/007"
              value={formData.firNumber}
              onChange={(e) => setFormData({ ...formData, firNumber: e.target.value })}
              error={formErrors.firNumber}
            />
            <FormField
              label="Registration Date"
              name="registrationDate"
              type="date"
              required
              value={formData.registrationDate}
              onChange={(e) => setFormData({ ...formData, registrationDate: e.target.value })}
              error={formErrors.registrationDate}
            />
          </div>

          <div className="form-grid" style={{ marginTop: '1rem' }}>
            <FormField
              label="Complainant Name"
              name="complainantName"
              required
              placeholder="Full name of complainant / reporting officer"
              value={formData.complainantName}
              onChange={(e) => setFormData({ ...formData, complainantName: e.target.value })}
              error={formErrors.complainantName}
            />
            <FormField
              label="Investigation Status"
              name="status"
              type="select"
              required
              options={STATUS_OPTIONS}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              error={formErrors.status}
            />
          </div>

          <div className="form-grid" style={{ marginTop: '1rem' }}>
            <FormField
              label="Filing Police Station"
              name="stationId"
              type="select"
              options={stations.map((s) => ({ value: s.stationId, label: s.name }))}
              value={formData.stationId}
              onChange={(e) => setFormData({ ...formData, stationId: e.target.value })}
            />
            <FormField
              label="Registering Officer"
              name="officerId"
              type="select"
              options={officers.map((o) => ({ value: o.officerId, label: `${o.name} (${o.rank})` }))}
              value={formData.officerId}
              onChange={(e) => setFormData({ ...formData, officerId: e.target.value })}
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <FormField
              label="Linked Crime Incident Type"
              name="crimeId"
              type="select"
              options={crimes.map((c) => ({ value: c.crimeId, label: `${c.crimeType} — ${c.location}` }))}
              value={formData.crimeId}
              onChange={(e) => setFormData({ ...formData, crimeId: e.target.value })}
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <FormField
              label="Incident Description & Allegations"
              name="description"
              type="textarea"
              rows={4}
              required
              placeholder="State clear details of incident, time, location, suspect description, and lost property..."
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
        title="Delete FIR Record"
        message={`Are you sure you want to delete FIR "${activeFir?.firNumber}"? Connected investigation cases will lose this reference.`}
        loading={submitting}
      />
    </div>
  );
}

export default FIRs;
