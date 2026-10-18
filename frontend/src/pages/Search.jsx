import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search as SearchIcon,
  Briefcase,
  Users,
  Shield,
  FileText,
  Building2,
  Fingerprint,
  ArrowRight,
  Filter,
  Sparkles,
  Inbox,
} from 'lucide-react';
import { globalSearch } from '../api';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const ENTITY_TABS = [
  { key: 'all', label: 'All Entities' },
  { key: 'cases', label: 'Cases' },
  { key: 'criminals', label: 'Criminals' },
  { key: 'officers', label: 'Officers' },
  { key: 'firs', label: 'FIRs' },
  { key: 'stations', label: 'Stations' },
  { key: 'evidence', label: 'Evidence' },
];

export function Search() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [cityFilter, setCityFilter] = useState('All');

  useEffect(() => {
    let mounted = true;
    const delayDebounce = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await globalSearch(searchTerm);
        if (mounted) {
          setResults(data);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }, 250);

    return () => {
      mounted = false;
      clearTimeout(delayDebounce);
    };
  }, [searchTerm]);

  // Apply secondary filters
  const filteredCases = (results?.cases || []).filter((c) => {
    if (statusFilter !== 'All' && c.status !== statusFilter) return false;
    if (priorityFilter !== 'All' && c.priority !== priorityFilter) return false;
    return true;
  });

  const filteredStations = (results?.stations || []).filter((s) => {
    if (cityFilter !== 'All' && s.city !== cityFilter) return false;
    return true;
  });

  const totalHits =
    (filteredCases.length || 0) +
    (results?.criminals?.length || 0) +
    (results?.officers?.length || 0) +
    (results?.firs?.length || 0) +
    (filteredStations.length || 0) +
    (results?.evidence?.length || 0);

  return (
    <div className="search-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">
            <SearchIcon size={26} style={{ color: '#3b82f6' }} />
            Unified Graph Intelligence Search
          </h1>
          <p className="page-subtitle">
            Search across interconnected cases, suspect dossiers, FIR reports, evidence items, and police officers
          </p>
        </div>
      </div>

      {/* Big Search Input */}
      <div
        className="card"
        style={{
          padding: '1.25rem',
          marginBottom: '1.5rem',
          background: 'rgba(30, 36, 51, 0.85)',
        }}
      >
        <div style={{ position: 'relative' }}>
          <SearchIcon
            size={22}
            style={{
              position: 'absolute',
              left: '1.1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--accent-primary)',
            }}
          />
          <input
            type="text"
            className="form-input"
            style={{
              paddingLeft: '3.2rem',
              paddingTop: '0.85rem',
              paddingBottom: '0.85rem',
              fontSize: '1.05rem',
              borderRadius: '12px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
            }}
            placeholder="Search keywords, suspect aliases, badge numbers, FIR IDs, weapon tags, cities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>

        {/* Filter Toolbar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginTop: '1rem',
            flexWrap: 'wrap',
          }}
        >
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {ENTITY_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`btn ${
                  activeTab === tab.key ? 'btn-primary' : 'btn-ghost'
                }`}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dropdown Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="Closed">Closed</option>
              <option value="Referred to Court">Referred to Court</option>
            </select>

            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            >
              <option value="All">All Cities</option>
              <option value="Nagpur">Nagpur</option>
              <option value="Bhopal">Bhopal</option>
              <option value="Jabalpur">Jabalpur</option>
              <option value="Amravati">Amravati</option>
            </select>
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner message="Searching graph nodes across all entities..." />}

      {!loading && totalHits === 0 && (
        <div className="card">
          <div className="empty-state">
            <Inbox size={40} />
            <div className="empty-state-title">No matching results found</div>
            <div className="empty-state-desc">
              No graph entities matched your search query &ldquo;{searchTerm}&rdquo;. Try using broader terms or reset your filters.
            </div>
          </div>
        </div>
      )}

      {/* Results Groups */}
      {!loading && results && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Cases Results */}
          {(activeTab === 'all' || activeTab === 'cases') && filteredCases.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <Briefcase size={18} style={{ color: '#3b82f6' }} />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                  Investigation Cases ({filteredCases.length})
                </h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                {filteredCases.map((c) => (
                  <div
                    key={c.caseId}
                    className="card"
                    style={{ cursor: 'pointer', padding: '1.1rem' }}
                    onClick={() => navigate(`/cases/${c.caseId}`)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 700, color: '#93c5fd', fontFamily: 'monospace' }}>
                        {c.caseId}
                      </span>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <StatusBadge status={c.priority} />
                        <StatusBadge status={c.status} />
                      </div>
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>
                      {c.title}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                      {c.description}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem', color: 'var(--text-muted)', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                      <span>Officer: {c.assignedOfficerName || 'Assigned'}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                        View Detail <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Criminals Results */}
          {(activeTab === 'all' || activeTab === 'criminals') && results.criminals?.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <Users size={18} style={{ color: '#ef4444' }} />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                  Criminal &amp; Suspect Records ({results.criminals.length})
                </h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                {results.criminals.map((cr) => (
                  <div
                    key={cr.criminalId}
                    className="card"
                    style={{ cursor: 'pointer', padding: '1.1rem' }}
                    onClick={() => navigate('/criminals')}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>
                        {cr.name}
                      </span>
                      <span className="badge badge-red">Suspect</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#f59e0b', marginBottom: '0.35rem' }}>
                      Aliases: {cr.knownAliases || 'None'}
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      {cr.identifyingDescription}
                    </p>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      History: {cr.criminalHistory || 'No prior record'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Officers Results */}
          {(activeTab === 'all' || activeTab === 'officers') && results.officers?.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <Shield size={18} style={{ color: '#06b6d4' }} />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                  Police Officers ({results.officers.length})
                </h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {results.officers.map((o) => (
                  <div
                    key={o.officerId}
                    className="card"
                    style={{ cursor: 'pointer', padding: '1rem' }}
                    onClick={() => navigate('/officers')}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 700, color: '#fff' }}>{o.name}</span>
                      <span className="badge badge-blue">{o.rank}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Badge #{o.badgeNumber} • {o.yearsOfService} yrs exp
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                      Spec: {o.specialization || 'General Investigation'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FIRs Results */}
          {(activeTab === 'all' || activeTab === 'firs') && results.firs?.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <FileText size={18} style={{ color: '#22c55e' }} />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                  FIR Reports ({results.firs.length})
                </h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {results.firs.map((f) => (
                  <div
                    key={f.firId}
                    className="card"
                    style={{ cursor: 'pointer', padding: '1rem' }}
                    onClick={() => navigate('/firs')}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 700, color: '#86efac', fontFamily: 'monospace' }}>
                        {f.firNumber}
                      </span>
                      <StatusBadge status={f.status} />
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                      {f.description}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      Complainant: {f.complainantName}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stations Results */}
          {(activeTab === 'all' || activeTab === 'stations') && filteredStations.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <Building2 size={18} style={{ color: '#3b82f6' }} />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                  Police Stations ({filteredStations.length})
                </h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {filteredStations.map((s) => (
                  <div
                    key={s.stationId}
                    className="card"
                    style={{ cursor: 'pointer', padding: '1rem' }}
                    onClick={() => navigate('/stations')}
                  >
                    <div style={{ fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>
                      {s.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {s.location}, {s.city}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                      Officers: {s.officerCount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Evidence Results */}
          {(activeTab === 'all' || activeTab === 'evidence') && results.evidence?.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <Fingerprint size={18} style={{ color: '#a855f7' }} />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                  Evidence Items ({results.evidence.length})
                </h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {results.evidence.map((e) => (
                  <div
                    key={e.evidenceId}
                    className="card"
                    style={{ cursor: 'pointer', padding: '1rem' }}
                    onClick={() => navigate('/evidence')}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 700, color: '#d8b4fe' }}>{e.evidenceType}</span>
                      <StatusBadge status={e.condition} />
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {e.description}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                      Tag: #{e.evidenceId} • Case: {e.caseId}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Search;
