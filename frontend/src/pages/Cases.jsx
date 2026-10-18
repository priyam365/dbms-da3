import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Plus, Filter, Calendar, Shield, Eye } from 'lucide-react';
import { casesApi, firsApi, officersApi } from '../api';
import DataTable from '../components/DataTable';
import Modal, { ConfirmDeleteModal } from '../components/Modal';
import FormField from '../components/FormField';
import StatusBadge from '../components/StatusBadge';
import { useToast } from '../components/Toast';

const STATUS_OPTIONS = [
  'Open',
  'Under Investigation',
  'Referred to Court',
  'Closed',
];

const PRIORITY_OPTIONS = ['Critical', 'High', 'Medium', 'Low'];

export function Cases() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [cases, setCases] = useState([]);
  const [firs, setFirs] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeCase, setActiveCase] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    status: 'Under Investigation',
    priority: 'High',
    openedDate: new Date().toISOString().split('T')[0],
    firId: '',
    assignedOfficerId: '',
    description: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchCases = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (priorityFilter !== 'All') params.priority = priorityFilter;

      const [casesData, firsData, officersData] = await Promise.all([
        casesApi.getAll(params),
        firsApi.getAll(),
        officersApi.getAll(),
      ]);
      setCases(casesData);
      setFirs(firsData);
      setOfficers(officersData);
    } catch (err) {
      showToast('Failed to load investigation cases', 'error');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter, showToast]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const handleOpenAdd = () => {
    setActiveCase(null);
    setFormData({
      title: '',
      status: 'Under Investigation',
      priority: 'High',
      openedDate: new Date().toISOString().split('T')[0],
      firId: firs[0]?.firId || '',
      assignedOfficerId: officers[0]?.officerId || '',
      description: '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (caseItem) => {
    setActiveCase(caseItem);
    setFormData({
      title: caseItem.title || '',
      status: caseItem.status || 'Under Investigation',
      priority: caseItem.priority || 'High',
      openedDate: caseItem.openedDate || '',
      firId: caseItem.firId || '',
      assignedOfficerId: caseItem.assignedOfficerId || '',
      description: caseItem.description || '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenDelete = (caseItem) => {
    setActiveCase(caseItem);
    setIsDeleteModalOpen(true);
  };

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Case title is required';
    if (!formData.status) errors.status = 'Case status is required';
    if (!formData.priority) errors.priority = 'Priority rating is required';
    if (!formData.openedDate) errors.openedDate = 'Case opening date is required';
    if (!formData.description.trim()) errors.description = 'Case summary/description is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      if (activeCase) {
        await casesApi.update(activeCase.caseId, formData);
        showToast(`Case "${formData.title}" updated`, 'success');
      } else {
        await casesApi.create(formData);
        showToast(`Case "${formData.title}" opened`, 'success');
      }
      setIsModalOpen(false);
      fetchCases();
    } catch (err) {
      showToast(err.friendlyMessage || 'Error saving case', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!activeCase) return;
    try {
      setSubmitting(true);
      await casesApi.deleteOne(activeCase.caseId);
      showToast(`Case "${activeCase.title}" deleted`, 'success');
      setIsDeleteModalOpen(false);
      fetchCases();
    } catch (err) {
      showToast('Failed to delete case', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Case ID',
      key: 'caseId',
      render: (val) => (
        <span style={{ fontWeight: 700, color: '#93c5fd' }}>{val}</span>
      ),
    },
    {
      header: 'Investigation Title',
      key: 'title',
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 600, color: '#fff' }}>{val}</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            FIR Link: {row.firId || 'None'}
          </div>
        </div>
      ),
    },
    {
      header: 'Priority',
      key: 'priority',
      align: 'center',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      header: 'Status',
      key: 'status',
      align: 'center',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      header: 'Opened Date',
      key: 'openedDate',
      render: (val) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.84rem' }}>
          <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
          {val}
        </span>
      ),
    },
    {
      header: 'Lead Officer',
      key: 'assignedOfficerName',
      render: (val, row) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.84rem' }}>
          <Shield size={13} style={{ color: 'var(--accent-primary)' }} />
          {val || row.assignedOfficerId || 'Assigned Officer'}
        </span>
      ),
    },
  ];

  return (
    <div className="cases-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">
            <Briefcase size={26} style={{ color: '#3b82f6' }} />
            Active Investigation Cases
          </h1>
          <p className="page-subtitle">
            Manage multi-agency crime investigations, evidence linking, and judicial trial prep
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Filter size={14} style={{ color: 'var(--text-muted)' }} />
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.45rem 0.65rem', fontSize: '0.82rem' }}
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

          {/* Priority Filter */}
          <select
            className="form-select"
            style={{ width: 'auto', padding: '0.45rem 0.65rem', fontSize: '0.82rem' }}
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="All">All Priorities</option>
            {PRIORITY_OPTIONS.map((pr) => (
              <option key={pr} value={pr}>
                {pr} Priority
              </option>
            ))}
          </select>

          <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} /> Open New Case
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={cases}
        loading={loading}
        idField="caseId"
        emptyMessage="No investigation cases match your filters"
        searchPlaceholder="Search case title, description, or officer..."
        onView={(row) => navigate(`/cases/${row.caseId}`)}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activeCase ? 'Edit Investigation Case' : 'Open Investigation Case'}
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
              {submitting ? 'Saving...' : activeCase ? 'Save Changes' : 'Open Case'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <FormField
            label="Case Title"
            name="title"
            required
            placeholder="e.g. Sitabuldi Bank Robbery"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={formErrors.title}
          />

          <div className="form-grid" style={{ marginTop: '1rem' }}>
            <FormField
              label="Priority Level"
              name="priority"
              type="select"
              required
              options={PRIORITY_OPTIONS}
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              error={formErrors.priority}
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
              label="Opened Date"
              name="openedDate"
              type="date"
              required
              value={formData.openedDate}
              onChange={(e) => setFormData({ ...formData, openedDate: e.target.value })}
              error={formErrors.openedDate}
            />
            <FormField
              label="Linked FIR"
              name="firId"
              type="select"
              options={firs.map((f) => ({ value: f.firId, label: `${f.firNumber} — ${f.complainantName}` }))}
              value={formData.firId}
              onChange={(e) => setFormData({ ...formData, firId: e.target.value })}
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <FormField
              label="Lead Investigating Officer"
              name="assignedOfficerId"
              type="select"
              options={officers.map((o) => ({ value: o.officerId, label: `${o.name} (${o.rank}) - ${o.specialization || 'Investigator'}` }))}
              value={formData.assignedOfficerId}
              onChange={(e) => setFormData({ ...formData, assignedOfficerId: e.target.value })}
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <FormField
              label="Investigation Overview & Operational Objectives"
              name="description"
              type="textarea"
              rows={4}
              required
              placeholder="State the core hypothesis, physical evidence collected, leads, and suspects being targeted..."
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
        title="Delete Investigation Case"
        message={`Are you sure you want to delete case "${activeCase?.title}"? All graph relationships (evidence, suspect links, court referrals) will be detached.`}
        loading={submitting}
      />
    </div>
  );
}

export default Cases;
