import React, { useState, useEffect, useCallback } from 'react';
import { Shield, Plus, Award, Filter, Building2 } from 'lucide-react';
import { officersApi, policeStationsApi } from '../api';
import DataTable from '../components/DataTable';
import Modal, { ConfirmDeleteModal } from '../components/Modal';
import FormField from '../components/FormField';
import { useToast } from '../components/Toast';

const RANKS = [
  'Constable',
  'Sub-Inspector',
  'Inspector',
  'DSP',
  'SP',
];

export function Officers() {
  const { showToast } = useToast();
  const [officers, setOfficers] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rankFilter, setRankFilter] = useState('All');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeOfficer, setActiveOfficer] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    rank: 'Sub-Inspector',
    badgeNumber: '',
    stationId: '',
    specialization: '',
    yearsOfService: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchOfficers = useCallback(async () => {
    try {
      setLoading(true);
      const params = rankFilter !== 'All' ? { rank: rankFilter } : {};
      const [officersData, stationsData] = await Promise.all([
        officersApi.getAll(params),
        policeStationsApi.getAll(),
      ]);
      setOfficers(officersData);
      setStations(stationsData);
    } catch (err) {
      showToast('Failed to load officers', 'error');
    } finally {
      setLoading(false);
    }
  }, [rankFilter, showToast]);

  useEffect(() => {
    fetchOfficers();
  }, [fetchOfficers]);

  const handleOpenAdd = () => {
    setActiveOfficer(null);
    setFormData({
      name: '',
      rank: 'Sub-Inspector',
      badgeNumber: '',
      stationId: stations[0]?.stationId || '',
      specialization: '',
      yearsOfService: '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (officer) => {
    setActiveOfficer(officer);
    setFormData({
      name: officer.name || '',
      rank: officer.rank || 'Sub-Inspector',
      badgeNumber: officer.badgeNumber || '',
      stationId: officer.stationId || '',
      specialization: officer.specialization || '',
      yearsOfService: officer.yearsOfService ?? '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenDelete = (officer) => {
    setActiveOfficer(officer);
    setIsDeleteModalOpen(true);
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Officer name is required';
    if (!formData.badgeNumber.trim()) errors.badgeNumber = 'Badge number is required';
    if (!formData.rank) errors.rank = 'Rank is required';
    if (!formData.stationId) errors.stationId = 'Police station assignment is required';
    if (
      formData.yearsOfService === '' ||
      isNaN(Number(formData.yearsOfService)) ||
      Number(formData.yearsOfService) < 0
    ) {
      errors.yearsOfService = 'Valid years of service required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      if (activeOfficer) {
        await officersApi.update(activeOfficer.officerId, formData);
        showToast(`Officer "${formData.name}" updated successfully`, 'success');
      } else {
        await officersApi.create(formData);
        showToast(`Officer "${formData.name}" added to roster`, 'success');
      }
      setIsModalOpen(false);
      fetchOfficers();
    } catch (err) {
      showToast(err.friendlyMessage || 'Error saving officer details', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!activeOfficer) return;
    try {
      setSubmitting(true);
      await officersApi.deleteOne(activeOfficer.officerId);
      showToast(`Officer "${activeOfficer.name}" removed`, 'success');
      setIsDeleteModalOpen(false);
      fetchOfficers();
    } catch (err) {
      showToast('Failed to delete officer', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const stationOptions = stations.map((s) => ({
    value: s.stationId,
    label: `${s.name} (${s.city})`,
  }));

  const columns = [
    {
      header: 'Officer / Name',
      key: 'name',
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(59, 130, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3b82f6',
              fontWeight: 700,
              fontSize: '0.8rem',
            }}
          >
            {val.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{val}</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              ID: {row.officerId}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Rank',
      key: 'rank',
      render: (val) => {
        let badgeType = 'badge-blue';
        if (val === 'SP' || val === 'DSP') badgeType = 'badge-purple';
        else if (val === 'Inspector') badgeType = 'badge-amber';
        return <span className={`badge ${badgeType}`}>{val}</span>;
      },
    },
    {
      header: 'Badge No.',
      key: 'badgeNumber',
      render: (val) => (
        <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#f59e0b' }}>
          {val}
        </span>
      ),
    },
    {
      header: 'Specialization',
      key: 'specialization',
      render: (val) => (
        <span style={{ fontSize: '0.84rem' }}>{val || 'General Policing'}</span>
      ),
    },
    {
      header: 'Experience',
      key: 'yearsOfService',
      align: 'center',
      render: (val) => `${val} yrs`,
    },
    {
      header: 'Station',
      key: 'stationName',
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.84rem' }}>
          <Building2 size={13} style={{ color: 'var(--text-muted)' }} />
          <span>{val || row.stationId || 'Central Station'}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="officers-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">
            <Shield size={26} style={{ color: '#06b6d4' }} />
            Police Officers Roster
          </h1>
          <p className="page-subtitle">
            Directory of active investigation officers, ranks, and specialized task forces
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {/* Rank Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={15} style={{ color: 'var(--text-muted)' }} />
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.82rem' }}
              value={rankFilter}
              onChange={(e) => setRankFilter(e.target.value)}
            >
              <option value="All">All Ranks</option>
              {RANKS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} /> Add Officer
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={officers}
        loading={loading}
        idField="officerId"
        emptyMessage="No police officers found"
        searchPlaceholder="Search officer by name, badge, specialization..."
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activeOfficer ? 'Edit Officer Record' : 'Register New Officer'}
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
              {submitting ? 'Saving...' : activeOfficer ? 'Save Changes' : 'Enroll Officer'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <FormField
              label="Full Officer Name"
              name="name"
              required
              placeholder="e.g. Inspector Rajesh Kumar Verma"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={formErrors.name}
            />
            <FormField
              label="Badge Number"
              name="badgeNumber"
              required
              placeholder="e.g. BDG001"
              value={formData.badgeNumber}
              onChange={(e) => setFormData({ ...formData, badgeNumber: e.target.value })}
              error={formErrors.badgeNumber}
            />
          </div>

          <div className="form-grid" style={{ marginTop: '1rem' }}>
            <FormField
              label="Rank"
              name="rank"
              type="select"
              required
              options={RANKS}
              value={formData.rank}
              onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
              error={formErrors.rank}
            />
            <FormField
              label="Assigned Police Station"
              name="stationId"
              type="select"
              required
              options={stationOptions}
              value={formData.stationId}
              onChange={(e) => setFormData({ ...formData, stationId: e.target.value })}
              error={formErrors.stationId}
            />
          </div>

          <div className="form-grid" style={{ marginTop: '1rem' }}>
            <FormField
              label="Specialization"
              name="specialization"
              placeholder="e.g. Homicide Investigation, Cybercrime"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              error={formErrors.specialization}
            />
            <FormField
              label="Years of Service"
              name="yearsOfService"
              type="number"
              min="0"
              required
              placeholder="e.g. 14"
              value={formData.yearsOfService}
              onChange={(e) => setFormData({ ...formData, yearsOfService: e.target.value })}
              error={formErrors.yearsOfService}
            />
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Remove Officer"
        message={`Are you sure you want to remove ${activeOfficer?.name}? Any active assigned cases will need to be re-assigned.`}
        loading={submitting}
      />
    </div>
  );
}

export default Officers;
