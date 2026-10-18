import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight } from 'lucide-react';

export function DemoModeBanner({ mode }) {
  if (mode !== 'demo') {
    return null;
  }

  return (
    <div className="demo-banner" role="banner" data-testid="demo-mode-banner">
      <div className="demo-banner-content">
        <AlertTriangle size={18} className="demo-banner-icon" />
        <span>
          <strong>⚠️ LOCAL DEMO MODE</strong> — Displaying sample data. Connect Neo4j AuraDB for live data.
        </span>
      </div>
      <Link to="/about" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#fff', fontSize: '0.8rem' }}>
        Database Setup <ArrowRight size={14} />
      </Link>
    </div>
  );
}

export default DemoModeBanner;
