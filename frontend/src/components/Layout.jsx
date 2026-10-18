import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Shield,
  FileText,
  AlertTriangle,
  Users,
  HeartHandshake,
  Briefcase,
  Fingerprint,
  UserX,
  Gavel,
  Search,
  Info,
  ChevronLeft,
  ChevronRight,
  Clock,
  Database,
  Radio,
} from 'lucide-react';
import { getDbStatus } from '../api';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, category: 'Overview' },
  { path: '/cases', label: 'Cases', icon: Briefcase, category: 'Investigations' },
  { path: '/firs', label: 'FIRs', icon: FileText, category: 'Investigations' },
  { path: '/crimes', label: 'Crimes', icon: AlertTriangle, category: 'Investigations' },
  { path: '/evidence', label: 'Evidence', icon: Fingerprint, category: 'Investigations' },
  { path: '/arrests', label: 'Arrests', icon: UserX, category: 'Enforcement' },
  { path: '/criminals', label: 'Criminals', icon: Users, category: 'Enforcement' },
  { path: '/victims', label: 'Victims', icon: HeartHandshake, category: 'Enforcement' },
  { path: '/officers', label: 'Officers', icon: Shield, category: 'Administration' },
  { path: '/stations', label: 'Police Stations', icon: Building2, category: 'Administration' },
  { path: '/courts', label: 'Courts', icon: Gavel, category: 'Administration' },
  { path: '/search', label: 'Unified Search', icon: Search, category: 'System' },
  { path: '/about', label: 'About & Status', icon: Info, category: 'System' },
];

export function Layout({ children, dbStatus }) {
  const [collapsed, setCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [liveStatus, setLiveStatus] = useState(dbStatus || { mode: 'demo', connected: false });

  // Real-time Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Poll DB status every 30 seconds if not supplied
  useEffect(() => {
    let mounted = true;
    async function checkStatus() {
      try {
        const res = await getDbStatus();
        if (mounted && res) {
          setLiveStatus(res);
        }
      } catch (err) {
        if (mounted) {
          setLiveStatus({ mode: 'demo', connected: false });
        }
      }
    }
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const formattedDate = currentTime.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const isConnected = liveStatus?.connected;
  const isDemo = liveStatus?.mode === 'demo' || liveStatus?.demo_mode;

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside
        className={`app-sidebar ${collapsed ? 'collapsed' : ''}`}
        aria-label="Main Navigation"
      >
        <div className="sidebar-brand">
          <div className="brand-icon-wrapper">
            <Shield size={22} />
          </div>
          {!collapsed && (
            <div className="brand-info">
              <span className="brand-title">POLICE CMS</span>
              <span className="brand-subtitle">Central Records</span>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item, index) => {
            const Icon = item.icon;
            const showCategory =
              !collapsed &&
              (index === 0 || item.category !== NAV_ITEMS[index - 1].category);

            return (
              <React.Fragment key={item.path}>
                {showCategory && (
                  <div className="sidebar-category-label">{item.category}</div>
                )}
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={18} className="link-icon" />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              </React.Fragment>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <Radio size={12} style={{ color: '#22c55e' }} />
              <span>AuraDB Graph v1.0</span>
            </div>
          )}
          <button
            type="button"
            className="sidebar-toggle-btn"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className={`main-wrapper ${collapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Top Header */}
        <header className="app-header">
          <div className="header-left">
            <div className="header-title-badge">
              <span>Police Crime Management System</span>
              <span className="system-tag">NEO4J GRAPH EDITION</span>
            </div>
          </div>

          <div className="header-right">
            {/* Clock */}
            <div className="clock-display" title={`${formattedDate} ${formattedTime}`}>
              <Clock size={14} />
              <span>{formattedDate}</span>
              <span>•</span>
              <span style={{ fontWeight: 600 }}>{formattedTime}</span>
            </div>

            {/* DB Status Indicator */}
            <Link to="/about" style={{ textDecoration: 'none' }}>
              <div
                className={`db-status-pill ${
                  isConnected ? 'connected' : isDemo ? 'demo' : 'disconnected'
                }`}
                title="View Database & Graph Schema Status"
              >
                <span className="status-dot" />
                <Database size={13} style={{ marginRight: '2px' }} />
                <span>
                  {isConnected
                    ? 'Neo4j AuraDB Connected'
                    : isDemo
                    ? 'Demo Mode Active'
                    : 'DB Offline'}
                </span>
              </div>
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <main className="content-area">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
