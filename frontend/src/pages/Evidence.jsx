import React, { useState, useEffect, useCallback } from 'react';
import { Fingerprint, Plus, Calendar, Tag, ShieldCheck, Filter } from 'lucide-react';
import { evidenceApi, casesApi } from '../api';
import DataTable from '../components/DataTable';
import Modal, { ConfirmDeleteModal } from '../components/Modal';
import FormField from '../components/FormField';
import StatusBadge from '../components/StatusBadge';
import { useToast } from '../components/Toast';

const EVIDENCE_TYPES = [
  'CCTV Footage',
  'Digital',
  'Fingerprint',
  'Physical',
  'Witness Statement',
  'Weapon',
  'Ballistics',
  'Biological',
];

const CONDITIONS = ['Good', 'Degraded', 'Damaged'];

export function Evidence() {
  const { showToast } = useToast();
  const [evidenceList, setEvidenceList] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('All');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeEvidence, setActiveEvidence] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    evidenceType: 'CCTV Footage',
    description: '',
    collectedDate: new Date().toISOString().split('T')[0],
    caseId: '',
    condition: 'Good',
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchEvidence = useCallback(async () => {
    try {
      setLoading(true);
      const params = typeFilter !== 'All' ? { evidenceType: typeFilter } : {};
      const [evidenceData, casesData] = await Promise.all([
        evidenceApi.getAll(params),
        casesApi.getAll(),
      ]);
      setEvidenceList(evidenceData);
      setCases(casesData);
    } catch (err) {
      showToast('Failed to load forensic evidence registry', 'error');
    } finally {
      setLoading(false);
    }
  }, [typeFilter, showToast]);

  useEffect(() => {
    fetchEvidence();
  }, [fetchEvidence]);

  const handleOpenAdd = () => {
    setActiveEvidence(null);
    setFormData({
      evidenceType: 'CCTV Footage',
      description: '',
      collectedDate: new Date().toISOString().split('T')[0],
      caseId: cases[0]?.caseId || '',
      condition: 'Good',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setActiveEvidence(item);
    setFormData({
      evidenceType: item.evidenceType || 'CCTV Footage',
      description: item.description || '',
      collectedDate: item.collectedDate || '',
      caseId: item.caseId || '',
      condition: item.condition || 'Good',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenDelete = (item) => {
    setActiveEvidence(item);
    setIsDeleteModalOpen(true);
  };

  const validate = () => {
    const errors = {};
    if (!formData.evidenceType) errors.evidenceType = 'Evidence type is required';
    if (!formData.caseId) errors.caseId = 'Associated case is required';
    if (!formData.collectedDate) errors.collectedDate = 'Collection date is required';
    if (!formData.description.trim()) errors.description = 'Forensic description is required';
    if (!formData.condition) errors.condition = 'Condition status is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      if (activeEvidence) {
        await evidenceApi.update(activeEvidence.evidenceId, formData);
        showToast(`Evidence tag ${activeEvidence.evidenceId} updated`, 'success');
      } else {
        await evidenceApi.create(formData);
        showToast('New evidence item secured and tagged', 'success');
      }
      setIsModalOpen(false);
      fetchEvidence();
    } catch (err) {
      showToast(err.friendlyMessage || 'Error logging evidence item', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!activeEvidence) return;
    try {
      setSubmitting(true);
      await evidenceApi.deleteOne(activeEvidence.evidenceId);
      showToast(`Evidence tag ${activeEvidence.evidenceId} removed`, 'success');
      setIsDeleteModalOpen(false);
      fetchEvidence();
    } catch (err) {
      showToast('Failed to delete evidence item', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Exhibit Tag',
      key: 'evidenceId',
      render: (val) => (
        <span style={{ fontWeight: 700, color: '#93c5fd', fontFamily: 'monospace' }}>
          {val}
        </span>
      ),
    },
    {
      header: 'Evidence Type',
      key: 'evidenceType',
      render: (val) => (
        <span style={{ fontWeight: 600, color: '#fff' }}>{val}</span>
      ),
    },
    {
      header: 'Condition',
      key: 'condition',
      align: 'center',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      header: 'Linked Case ID',
      key: 'caseId',
      render: (val) => (
        <span style={{ color: '#60a5fa', fontWeight: 600 }}>{val}</span>
      ),
    },
    {
      header: 'Date Secured',
      key: 'collectedDate',
      render: (val) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.84rem' }}>
          <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
          {val}
        </span>
      ),
    },
    {
      header: 'Forensic Description',
      key: 'description',
      render: (val) => (
        <div style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.84rem' }}>
          {val}
        </div>
      ),
    },
  ];

  return (
    <div className="evidence-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">
            <Fingerprint size={26} style={{ color: '#a855f7' }} />
            Forensic &amp; Physical Evidence Vault
          </h1>
          <p className="page-subtitle">
            Secure custody chain, digital forensics, ballistic traces, and biometric catalog
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Filter size={14} style={{ color: 'var(--text-muted)' }} />
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.45rem 0.65rem', fontSize: '0.82rem' }}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="All">All Evidence Types</option>
              {EVIDENCE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} /> Tag New Evidence
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={evidenceList}
        loading={loading}
        idField="evidenceId"
        emptyMessage="No evidence logged in repository"
        searchPlaceholder="Search evidence by tag, type, case, description..."
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activeEvidence ? 'Edit Evidence Log' : 'Secure & Tag New Evidence Exhibit'}
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
              {submitting ? 'Saving...' : activeEvidence ? 'Save Changes' : 'Log Evidence'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <FormField
              label="Evidence Category"
              name="evidenceType"
              type="select"
              required
              options={EVIDENCE_TYPES}
              value={formData.evidenceType}
              onChange={(e) => setFormData({ ...formData, evidenceType: e.target.value })}
              error={formErrors.evidenceType}
            />
            <FormField
              label="Physical Condition"
              name="condition"
              type="select"
              required
              options={CONDITIONS}
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              error={formErrors.condition}
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
              label="Date Collected"
              name="collectedDate"
              type="date"
              required
              value={formData.collectedDate}
              onChange={(e) => setFormData({ ...formData, collectedDate: e.target.value })}
              error={formErrors.collectedDate}
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <FormField
              label="Detailed Technical Description & Chain of Custody Notes"
              name="description"
              type="textarea"
              rows={4}
              required
              placeholder="e.g. CCTV recording of entrance, latents lifted from counter, serial number markings..."
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
        title="Delete Evidence Item"
        message={`Are you sure you want to delete evidence item "${activeEvidence?.evidenceId}"? This permanently removes the chain of custody record.`}
        loading={submitting}
      />
    </div>
  );
}

export default Evidence;
