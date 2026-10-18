import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DemoModeBanner from './components/DemoModeBanner';
import { ToastProvider } from './components/Toast';
import { getDbStatus } from './api';

// Pages
import Dashboard from './pages/Dashboard';
import PoliceStations from './pages/PoliceStations';
import Officers from './pages/Officers';
import FIRs from './pages/FIRs';
import Crimes from './pages/Crimes';
import Criminals from './pages/Criminals';
import Victims from './pages/Victims';
import Cases from './pages/Cases';
import CaseDetail from './pages/CaseDetail';
import Evidence from './pages/Evidence';
import Arrests from './pages/Arrests';
import Courts from './pages/Courts';
import Search from './pages/Search';
import About from './pages/About';

export function App() {
  const [dbStatus, setDbStatus] = useState({ mode: 'demo', connected: false });

  useEffect(() => {
    let mounted = true;
    async function checkStatus() {
      try {
        const res = await getDbStatus();
        if (mounted && res) {
          setDbStatus(res);
        }
      } catch (err) {
        if (mounted) {
          setDbStatus({ mode: 'demo', connected: false });
        }
      }
    }
    checkStatus();
    return () => {
      mounted = false;
    };
  }, []);

  const mode = dbStatus?.demo_mode || dbStatus?.mode === 'demo' ? 'demo' : 'live';

  return (
    <ToastProvider>
      <DemoModeBanner mode={mode} />
      <Layout dbStatus={dbStatus}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/stations" element={<PoliceStations />} />
          <Route path="/officers" element={<Officers />} />
          <Route path="/firs" element={<FIRs />} />
          <Route path="/crimes" element={<Crimes />} />
          <Route path="/criminals" element={<Criminals />} />
          <Route path="/victims" element={<Victims />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/cases/:id" element={<CaseDetail />} />
          <Route path="/evidence" element={<Evidence />} />
          <Route path="/arrests" element={<Arrests />} />
          <Route path="/courts" element={<Courts />} />
          <Route path="/search" element={<Search />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </ToastProvider>
  );
}

export default App;
