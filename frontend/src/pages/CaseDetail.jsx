import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Briefcase,
  Shield,
  FileText,
  Users,
  HeartHandshake,
  Fingerprint,
  UserX,
  Gavel,
  Building2,
  Calendar,
  Clock,
  MapPin,
  Camera,
  FileCode,
  Crosshair,
  FileCheck,
  AlertTriangle,
  BadgeAlert,
} from 'lucide-react';
import { getCaseDetail } from '../api';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../components/Toast';

export function CaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchDetail() {
      try {
        setLoading(true);
        const data = await getCaseDetail(id);
        if (mounted) {
          setCaseData(data);
        }
      } catch (err) {
        showToast('Failed to load case relationship detail', 'error');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchDetail();
    return () => {
      mounted = false;
    };
  }, [id, showToast]);

  if (loading) {
    return <LoadingSpinner message={`Tracing graph nodes and edges for Case #${id}...`} />;
  }

  if (!caseData) {
    return (
      <div className="empty-state">
        <AlertTriangle size={36} style={{ color: '#ef4444' }} />
        <h2>Case Not Found</h2>
        <p>No active case could be retrieved matching identifier &quot;{id}&quot;.</p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate('/cases')}
          style={{ marginTop: '1rem' }}
        >
          <ArrowLeft size={16} /> Return to Cases Roster
        </button>
      </div>
    );
  }

  const getEvidenceIcon = (type = '') => {
    const t = type.toLowerCase();
    if (t.includes('cctv') || t.includes('video')) return Camera;
    if (t.includes('digital') || t.includes('log')) return FileCode;
    if (t.includes('weapon') || t.includes('rod')) return Crosshair;
    if (t.includes('statement')) return FileCheck;
    return Fingerprint;
  };

  return (
    <div className="case-detail-page">
      {/* Top Navigation & Actions */}
      <div style={{ marginBottom: '1.25rem' }}>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => navigate('/cases')}
          style={{ padding: '0.45rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <ArrowLeft size={16} /> Back to Cases
        </button>
      </div>

      {/* Case Header Card */}
      <div
        className="card"
        style={{
          borderLeft: '4px solid var(--accent-primary)',
          marginBottom: '1.75rem',
          padding: '1.5rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#93c5fd', fontFamily: 'monospace' }}>
                {caseData.caseId}
              </span>
              <StatusBadge status={caseData.priority} />
              <StatusBadge status={caseData.status} />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
              {caseData.title}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '850px', lineHeight: '1.6' }}>
              {caseData.description}
            </p>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '0.85rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
            }}
          >
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
              Case Lifecycle
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.88rem', fontWeight: 600 }}>
              <Calendar size={15} style={{ color: '#3b82f6' }} />
              <span>Opened: {caseData.openedDate}</span>
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Graph Edge: [:LINKED_TO] &amp; [:ASSIGNED_TO]
            </div>
          </div>
        </div>
      </div>

      {/* Primary Nodes Grid: Lead Officer & Linked FIR */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem' }}>
        {/* Assigned Officer Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Shield size={18} style={{ color: '#06b6d4' }} />
              Investigating Officer [:ASSIGNED_TO]
            </div>
            <span className="badge badge-blue">Lead Detective</span>
          </div>

          {caseData.officer ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'rgba(6, 182, 212, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#06b6d4',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                  }}
                >
                  {caseData.officer.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#fff' }}>
                    {caseData.officer.name}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Rank: <strong style={{ color: '#93c5fd' }}>{caseData.officer.rank}</strong> • Badge #{caseData.officer.badgeNumber}
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.84rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Specialization: </span>
                  <span style={{ fontWeight: 600 }}>{caseData.officer.specialization || 'Criminal Investigation'}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Service Length: </span>
                  <span>{caseData.officer.yearsOfService} years on active duty</span>
                </div>
                {caseData.officer.station && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem', color: '#86efac' }}>
                    <Building2 size={14} />
                    <span>Station: {caseData.officer.station.name} ({caseData.officer.station.city})</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>No lead officer currently assigned to this case node.</p>
          )}
        </div>

        {/* Linked FIR & Crime Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <FileText size={18} style={{ color: '#22c55e' }} />
              Originated FIR [:LINKED_TO]
            </div>
            {caseData.fir && <StatusBadge status={caseData.fir.status} />}
          </div>

          {caseData.fir ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#86efac', fontSize: '1rem' }}>
                  {caseData.fir.firNumber}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Filed: {caseData.fir.registrationDate}
                </span>
              </div>

              <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {caseData.fir.description}
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.84rem' }}>
                <div style={{ marginBottom: '0.25rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Complainant: </span>
                  <strong style={{ color: '#fff' }}>{caseData.fir.complainantName}</strong>
                </div>
                {caseData.fir.crime && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fca5a5' }}>
                    <AlertTriangle size={14} />
                    <span>Reported Crime: {caseData.fir.crime.crimeType} ({caseData.fir.crime.city})</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>No formal FIR record attached to this investigation.</p>
          )}
        </div>
      </div>

      {/* Suspects & Victims Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem' }}>
        {/* Criminals / Suspects */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Users size={18} style={{ color: '#ef4444' }} />
              Accused &amp; Suspects [:INVOLVES]
            </div>
            <span className="badge badge-red">{caseData.criminals?.length || 0} Connected</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {caseData.criminals?.length > 0 ? (
              caseData.criminals.map((crim) => (
                <div
                  key={crim.criminalId}
                  style={{
                    background: 'rgba(239, 68, 68, 0.05)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    borderRadius: '10px',
                    padding: '0.85rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
                      {crim.name}
                    </div>
                    <span className="badge badge-amber">{crim.role || 'Primary Accused'}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    {crim.age} yrs • {crim.gender} • Aliases: <span style={{ color: '#fde047' }}>{crim.knownAliases || 'None'}</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {crim.identifyingDescription}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>No known suspect nodes linked to this case.</p>
            )}
          </div>
        </div>

        {/* Victims Section */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <HeartHandshake size={18} style={{ color: '#ec4899' }} />
              Victims &amp; Witnesses [:HAS_VICTIM]
            </div>
            <span className="badge badge-purple">{caseData.victims?.length || 0} Affected</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {caseData.victims?.length > 0 ? (
              caseData.victims.map((vic) => (
                <div
                  key={vic.victimId}
                  style={{
                    background: 'rgba(236, 72, 153, 0.05)',
                    border: '1px solid rgba(236, 72, 153, 0.25)',
                    borderRadius: '10px',
                    padding: '0.85rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
                      {vic.name}
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#86efac' }}>{vic.contactNumber}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    {vic.age} yrs • {vic.gender} • {vic.address}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    &ldquo;{vic.victimStatement || 'Statement recorded on file with investigating authority.'}&rdquo;
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>No victim nodes associated with this case file.</p>
            )}
          </div>
        </div>
      </div>

      {/* Forensic Evidence Vault [:HAS_EVIDENCE] */}
      <div className="card" style={{ marginBottom: '1.75rem' }}>
        <div className="card-header">
          <div className="card-title">
            <Fingerprint size={18} style={{ color: '#a855f7' }} />
            Forensic &amp; Physical Evidence Vault [:HAS_EVIDENCE]
          </div>
          <span className="badge badge-purple">{caseData.evidence?.length || 0} Exhibits</span>
        </div>

        {caseData.evidence?.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {caseData.evidence.map((ev) => {
              const EvIcon = getEvidenceIcon(ev.evidenceType);
              return (
                <div
                  key={ev.evidenceId}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: 'rgba(168, 85, 247, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#a855f7',
                        }}
                      >
                        <EvIcon size={16} />
                      </div>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>
                        {ev.evidenceType}
                      </span>
                    </div>
                    <StatusBadge status={ev.condition || 'Good'} />
                  </div>

                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.4', flex: 1 }}>
                    {ev.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: 'var(--text-muted)', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <span>Tag: #{ev.evidenceId}</span>
                    <span>Collected: {ev.collectedDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>No physical or digital evidence currently attached to this case.</p>
        )}
      </div>

      {/* Enforcement & Judicial Progression */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Arrests Timeline [:LEADS_TO] */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <UserX size={18} style={{ color: '#ef4444' }} />
              Arrests &amp; Custody Timeline [:LEADS_TO]
            </div>
            <span className="badge badge-red">{caseData.arrests?.length || 0} Detained</span>
          </div>

          {caseData.arrests?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {caseData.arrests.map((arr) => (
                <div
                  key={arr.arrestId}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    padding: '0.85rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 700, color: '#fff' }}>
                      {arr.criminalName || arr.criminalId}
                    </span>
                    <StatusBadge status={arr.status} />
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#fca5a5', marginBottom: '0.35rem' }}>
                    Charges: {arr.charges}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    <span>Date: {arr.arrestDate}</span>
                    <span>By: {arr.officerName || 'Arresting Officer'}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>No arrests have been executed yet in this investigation.</p>
          )}
        </div>

        {/* Court Referral [:REFERRED_TO] */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Gavel size={18} style={{ color: '#f59e0b' }} />
              Judicial Referral &amp; Trial [:REFERRED_TO]
            </div>
            <span className="badge badge-purple">Judiciary</span>
          </div>

          {caseData.court ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#fff' }}>
                  {caseData.court.name}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {caseData.court.courtType} • {caseData.court.city} ({caseData.court.location})
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.84rem' }}>
                <div style={{ marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Presiding: </span>
                  <strong style={{ color: '#fff' }}>{caseData.court.judgeAssigned}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fde047', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                  <span>Referral: {caseData.court.referralDate || '2024-07-01'}</span>
                  <span>Hearing: {caseData.court.hearingDate || '2024-08-15'}</span>
                </div>
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
              This case is still under active police investigation and has not yet been referred to a judicial magistrate.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CaseDetail;
