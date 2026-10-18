import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Briefcase,
  AlertCircle,
  UserX,
  Fingerprint,
  FileText,
  Shield,
  Building2,
  Database,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  Search,
  Gavel,
  Users,
} from 'lucide-react';
import { getDashboardStats, getDbStatus } from '../api';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';

export function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [dbInfo, setDbInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const [statsData, dbData] = await Promise.all([
          getDashboardStats(),
          getDbStatus(),
        ]);
        if (mounted) {
          setStats(statsData);
          setDbInfo(dbData);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading && !stats) {
    return <LoadingSpinner message="Loading crime statistics and network intelligence..." />;
  }

  const statusCounts = stats?.statusCounts || {
    Open: 2,
    'Under Investigation': 2,
    'Referred to Court': 1,
    Closed: 1,
  };

  const crimeCounts = stats?.crimeTypeCounts || {
    'Armed Robbery': 1,
    Cybercrime: 1,
    Murder: 1,
    'Vehicle Theft': 1,
    'Drug Trafficking': 1,
    Assault: 1,
  };

  const totalStatus = Object.values(statusCounts).reduce((a, b) => a + b, 0) || 1;
  const totalCrimes = Object.values(crimeCounts).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="dashboard-page" data-testid="dashboard-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">
            <Activity className="text-primary" size={28} style={{ color: '#3b82f6' }} />
            Crime Analytics & Operations Dashboard
          </h1>
          <p className="page-subtitle">
            Centralized graph-powered police records, suspect tracing, and investigation intelligence
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/search')}
          >
            <Search size={16} /> Global Graph Search
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/cases')}
          >
            <Briefcase size={16} /> View All Cases
          </button>
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="stat-card-grid">
        <StatCard
          icon={Briefcase}
          number={stats?.totalCases ?? 5}
          label="Total Cases"
          trend="Active investigations"
          color="#3b82f6"
          onClick={() => navigate('/cases')}
        />
        <StatCard
          icon={AlertCircle}
          number={stats?.openCases ?? 4}
          label="Open Cases"
          trend="Requires action"
          color="#f59e0b"
          onClick={() => navigate('/cases')}
        />
        <StatCard
          icon={UserX}
          number={stats?.arrestsMade ?? 4}
          label="Arrests Made"
          trend="Enforced charges"
          color="#ef4444"
          onClick={() => navigate('/arrests')}
        />
        <StatCard
          icon={Fingerprint}
          number={stats?.evidenceItems ?? 6}
          label="Evidence Items"
          trend="Forensic repository"
          color="#a855f7"
          onClick={() => navigate('/evidence')}
        />
        <StatCard
          icon={FileText}
          number={stats?.firsFiled ?? 6}
          label="FIRs Filed"
          trend="Registered complaints"
          color="#22c55e"
          onClick={() => navigate('/firs')}
        />
        <StatCard
          icon={Shield}
          number={stats?.activeOfficers ?? 8}
          label="Active Officers"
          trend="Deployed across divisions"
          color="#06b6d4"
          onClick={() => navigate('/officers')}
        />
      </div>

      {/* Analytics & DB Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem' }}>
        {/* Crime Type Breakdown */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <TrendingUp size={18} style={{ color: '#3b82f6' }} />
              Crime Categories Distribution
            </div>
            <Link to="/crimes" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              View All <ArrowRight size={13} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {Object.entries(crimeCounts).map(([type, count]) => {
              const pct = Math.round((count / totalCrimes) * 100);
              return (
                <div key={type}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600 }}>{type}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {count} incidents ({pct}%)
                    </span>
                  </div>
                  <div style={{ height: '7px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                        borderRadius: '999px',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Case Status Distribution */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Layers size={18} style={{ color: '#a855f7' }} />
              Investigation Status Breakdown
            </div>
            <Link to="/cases" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              View Pipeline <ArrowRight size={13} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {Object.entries(statusCounts).map(([status, count]) => {
              const pct = Math.round((count / totalStatus) * 100);
              return (
                <div key={status}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <StatusBadge status={status} />
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {count} cases ({pct}%)
                    </span>
                  </div>
                  <div style={{ height: '7px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        background:
                          status === 'Critical'
                            ? '#ef4444'
                            : status === 'Open'
                            ? '#3b82f6'
                            : status === 'Referred to Court'
                            ? '#a855f7'
                            : '#f59e0b',
                        borderRadius: '999px',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DB Status Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-header">
              <div className="card-title">
                <Database size={18} style={{ color: dbInfo?.connected ? '#22c55e' : '#f59e0b' }} />
                Graph Database Engine Status
              </div>
              <span
                className={`badge ${
                  dbInfo?.connected ? 'badge-green' : 'badge-amber'
                }`}
              >
                {dbInfo?.connected ? 'Neo4j AuraDB Live' : 'Demo Mode Active'}
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.5' }}>
              {dbInfo?.message ||
                'Running in resilient demo mode with full graph relationship simulation and in-memory persistence.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.82rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Database Type</span>
                <span style={{ fontWeight: 600 }}>Neo4j AuraDB Graph</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Backend API</span>
                <span style={{ fontWeight: 600 }}>FastAPI (Python 3.11)</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DBMS Academic Edition</span>
            <Link to="/about" className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}>
              Inspect Schema
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Cases Section */}
      <div className="card" style={{ marginBottom: '1.75rem' }}>
        <div className="card-header">
          <div className="card-title">
            <Briefcase size={18} style={{ color: '#3b82f6' }} />
            Recent Investigation Cases
          </div>
          <Link to="/cases" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            View All Cases <ArrowRight size={14} />
          </Link>
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Opened Date</th>
                <th>Assigned Officer</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentCases?.length > 0 ? (
                stats.recentCases.map((c) => (
                  <tr key={c.caseId}>
                    <td style={{ fontWeight: 700, color: '#93c5fd' }}>{c.caseId}</td>
                    <td style={{ fontWeight: 600 }}>{c.title}</td>
                    <td>
                      <StatusBadge status={c.priority} />
                    </td>
                    <td>
                      <StatusBadge status={c.status} />
                    </td>
                    <td>{c.openedDate}</td>
                    <td>{c.assignedOfficerName || 'Officer Assigned'}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
                        onClick={() => navigate(`/cases/${c.caseId}`)}
                      >
                        Inspect Graph
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                    No recent cases recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={18} style={{ color: '#3b82f6' }} />
          Quick Access Management Modules
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {[
            { label: 'Police Stations', path: '/stations', icon: Building2, desc: 'Manage divisions & posts', color: '#3b82f6' },
            { label: 'Officers', path: '/officers', icon: Shield, desc: 'Ranks & badge roster', color: '#06b6d4' },
            { label: 'FIR Registry', path: '/firs', icon: FileText, desc: 'First Information Reports', color: '#22c55e' },
            { label: 'Criminal Dossiers', path: '/criminals', icon: Users, desc: 'Suspects & aliases', color: '#ef4444' },
            { label: 'Evidence Vault', path: '/evidence', icon: Fingerprint, desc: 'CCTV, forensics, weapons', color: '#a855f7' },
            { label: 'Court Referrals', path: '/courts', icon: Gavel, desc: 'Trials & magistrates', color: '#f59e0b' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.path}
                className="card"
                onClick={() => navigate(item.path)}
                style={{ cursor: 'pointer', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: `${item.color}18`,
                      color: item.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <ArrowRight size={15} style={{ color: 'var(--text-muted)' }} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#fff', marginTop: '0.25rem' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{item.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
