import React, { useState, useEffect } from 'react';
import {
  Info,
  Database,
  RefreshCw,
  Server,
  Layers,
  Network,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Cpu,
  Shield,
  RotateCcw,
} from 'lucide-react';
import { getDbStatus, resetDemoData } from '../api';
import Modal, { ConfirmDeleteModal } from '../components/Modal';
import { useToast } from '../components/Toast';

const NODE_TYPES = [
  { label: 'PoliceStation', desc: 'Jurisdictional precinct headquarters & posts', count: 4, color: '#3b82f6' },
  { label: 'Officer', desc: 'Investigating officers, constables, and inspectors', count: 8, color: '#06b6d4' },
  { label: 'FIR', desc: 'First Information Reports & formal complaints', count: 6, color: '#22c55e' },
  { label: 'Crime', desc: 'Offense categories, severities, and timestamps', count: 6, color: '#ef4444' },
  { label: 'Criminal', desc: 'Suspect dossiers, known aliases, identifying traits', count: 5, color: '#f97316' },
  { label: 'Victim', desc: 'Victims, witnesses, statements, and contact details', count: 4, color: '#ec4899' },
  { label: 'Case', desc: 'Central investigation hub linking all evidentiary nodes', count: 5, color: '#8b5cf6' },
  { label: 'Evidence', desc: 'Physical artifacts, CCTV recordings, ballistics', count: 6, color: '#a855f7' },
  { label: 'Arrest', desc: 'Custody remands, warrant execution, statutory charges', count: 4, color: '#e11d48' },
  { label: 'Court', desc: 'Judicial trial benches and prosecution referrals', count: 3, color: '#f59e0b' },
];

const RELATIONSHIPS = [
  { edge: ':WORKS_AT', from: 'Officer', to: 'PoliceStation', desc: 'Depicts officer deployment precinct' },
  { edge: ':REPORTS', from: 'FIR', to: 'Crime', desc: 'Links registered complaint to specific crime classification' },
  { edge: ':OF_TYPE', from: 'Crime', to: 'PoliceStation', desc: 'Jurisdiction where offense occurred' },
  { edge: ':INVOLVES', from: 'Case', to: 'Criminal', desc: 'Connects investigation to primary suspects & accomplices' },
  { edge: ':HAS_VICTIM', from: 'Case', to: 'Victim', desc: 'Associates affected parties and their statements' },
  { edge: ':HAS_EVIDENCE', from: 'Case', to: 'Evidence', desc: 'Chains forensic artifacts to case docket' },
  { edge: ':LEADS_TO', from: 'Case', to: 'Arrest', desc: 'Tracks suspect apprehensions resulting from investigation' },
  { edge: ':REFERRED_TO', from: 'Case', to: 'Court', desc: 'Chargesheet submission to magistrate court' },
  { edge: ':ASSIGNED_TO', from: 'Case', to: 'Officer', desc: 'Designates lead investigator responsible for case file' },
];

export function About() {
  const { showToast } = useToast();
  const [dbStatus, setDbStatus] = useState(null);
  const [testing, setTesting] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const fetchStatus = async () => {
    try {
      setTesting(true);
      const res = await getDbStatus();
      setDbStatus(res);
      showToast('Database connection tested', 'info');
    } catch (err) {
      setDbStatus({ connected: false, mode: 'demo' });
      showToast('Backend offline - using demo mode', 'warning');
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleResetData = async () => {
    try {
      setResetting(true);
      await resetDemoData();
      showToast('Demo dataset restored to initial seed state', 'success');
      setIsResetModalOpen(false);
      window.location.reload();
    } catch (err) {
      showToast('Failed to reset demo dataset', 'error');
    } finally {
      setResetting(false);
    }
  };

  const isConnected = dbStatus?.connected;
  const isDemo = dbStatus?.mode === 'demo' || dbStatus?.demo_mode;

  return (
    <div className="about-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">
            <Info size={26} style={{ color: '#3b82f6' }} />
            System Architecture &amp; Database Graph Status
          </h1>
          <p className="page-subtitle">
            Neo4j AuraDB graph model, node-edge ontology, REST API endpoints, and setup instructions
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={fetchStatus}
            disabled={testing}
          >
            <RefreshCw size={15} className={testing ? 'spinner' : ''} />
            {testing ? 'Testing...' : 'Test DB Connection'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.4)' }}
            onClick={() => setIsResetModalOpen(true)}
          >
            <RotateCcw size={15} /> Reset Demo Data
          </button>
        </div>
      </div>

      {/* Live Status Card */}
      <div
        className="card"
        style={{
          borderLeft: `4px solid ${isConnected ? '#22c55e' : '#f59e0b'}`,
          marginBottom: '1.75rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: isConnected ? '#22c55e' : '#f59e0b',
                  boxShadow: `0 0 10px ${isConnected ? '#22c55e' : '#f59e0b'}`,
                }}
              />
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                {isConnected ? 'Neo4j AuraDB Live Connection Established' : 'Local In-Memory Demo Mode Active'}
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '750px', lineHeight: '1.5' }}>
              {isConnected
                ? 'Your FastAPI backend is communicating directly with your cloud or local Neo4j graph cluster. Cypher queries are executing in real-time.'
                : 'The application is running in fully resilient standalone demo mode. All CRUD operations mutate the in-memory state, allowing complete functional exploration.'}
            </p>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '0.75rem 1.25rem',
              display: 'flex',
              gap: '1.5rem',
              fontSize: '0.82rem',
            }}
          >
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>Backend Host</span>
              <strong style={{ color: '#fff' }}>http://localhost:8000</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>Driver Status</span>
              <strong style={{ color: isConnected ? '#86efac' : '#fde047' }}>
                {isConnected ? 'Connected' : 'Mock Fallback'}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Graph Schema Nodes & Relationships */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Network size={20} style={{ color: '#3b82f6' }} />
          Neo4j Graph Database Model (10 Node Labels &amp; 9 Relationships)
        </h2>

        {/* 10 Node Types Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.85rem', marginBottom: '1.5rem' }}>
          {NODE_TYPES.map((node) => (
            <div
              key={node.label}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '0.85rem',
                borderTop: `3px solid ${node.color}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>
                  (:{node.label})
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '0.15rem 0.45rem',
                    background: `${node.color}22`,
                    color: node.color,
                    borderRadius: '999px',
                    fontWeight: 700,
                  }}
                >
                  ~{node.count} Nodes
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {node.desc}
              </div>
            </div>
          ))}
        </div>

        {/* 9 Graph Edges Table */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Layers size={18} style={{ color: '#a855f7' }} />
              Graph Relationships (:TYPE) &amp; Traversal Semantics
            </div>
          </div>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Relationship Edge</th>
                  <th>Source Node (From)</th>
                  <th>Target Node (To)</th>
                  <th>Semantic Meaning</th>
                </tr>
              </thead>
              <tbody>
                {RELATIONSHIPS.map((rel) => (
                  <tr key={rel.edge}>
                    <td>
                      <code style={{ color: '#a855f7', fontWeight: 700, background: 'rgba(168, 85, 247, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        {rel.edge}
                      </code>
                    </td>
                    <td style={{ fontWeight: 650, color: '#fff' }}>(:{rel.from})</td>
                    <td style={{ fontWeight: 650, color: '#fff' }}>(:{rel.to})</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.84rem' }}>{rel.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* University Project Description & AuraDB Setup Guide */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Project Overview Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Shield size={18} style={{ color: '#3b82f6' }} />
              University DBMS Project Overview
            </div>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1rem' }}>
            The <strong>Police Crime Management System</strong> is a full-stack graph-driven database application designed for modern policing intelligence, cross-jurisdictional suspect mapping, and judicial accountability.
          </p>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
            <li><strong>Graph Engine:</strong> Neo4j AuraDB (Cloud) using Cypher graph traversal algorithms.</li>
            <li><strong>Backend API:</strong> Python FastAPI asynchronous REST service with neo4j-driver connection pooling.</li>
            <li><strong>Frontend Client:</strong> React 18 SPA built on Vite, React Router, and Axios.</li>
            <li><strong>Zero-Crash Architecture:</strong> Seamlessly falls back to rich in-memory mock datasets if cloud credentials are being rotated.</li>
          </ul>
        </div>

        {/* AuraDB Cloud Setup Guide */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Server size={18} style={{ color: '#22c55e' }} />
              Connecting Live Neo4j AuraDB
            </div>
            <a
              href="https://neo4j.com/cloud/platform/aura-graph-database/"
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
            >
              Neo4j Console <ExternalLink size={13} />
            </a>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '0.75rem' }}>
            To switch this application from Demo Mode to a live cloud cluster:
          </p>
          <ol style={{ paddingLeft: '1.25rem', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            <li>Create a free Neo4j AuraDB Instance at <code>console.neo4j.io</code>.</li>
            <li>Copy your connection URI (e.g. <code>neo4j+s://xxxx.databases.neo4j.io</code>).</li>
            <li>Add credentials into <code>backend/.env</code>:
              <pre style={{ background: 'rgba(0,0,0,0.4)', padding: '0.5rem', borderRadius: '6px', marginTop: '0.35rem', fontSize: '0.76rem', color: '#86efac' }}>
NEO4J_URI=neo4j+s://your-instance.databases.neo4j.io{"\n"}
NEO4J_USERNAME=neo4j{"\n"}
NEO4J_PASSWORD=your-secure-password
              </pre>
            </li>
            <li>Execute <code>database/schema.cypher</code> and <code>database/seed_data.cypher</code> in the Neo4j query console.</li>
            <li>Restart the FastAPI backend at <code>uvicorn app.main:app --reload</code>.</li>
          </ol>
        </div>
      </div>

      {/* Confirm Reset Dialog */}
      <ConfirmDeleteModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetData}
        title="Restore Default Demo Data"
        message="Are you sure you want to restore the default sample dataset? Any unsaved edits will be replaced with clean academic demonstration records."
        loading={resetting}
      />
    </div>
  );
}

export default About;
