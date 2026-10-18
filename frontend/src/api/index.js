import apiClient from './apiClient';
import {
  INITIAL_POLICE_STATIONS,
  INITIAL_OFFICERS,
  INITIAL_CRIMES,
  INITIAL_CRIMINALS,
  INITIAL_VICTIMS,
  INITIAL_FIRS,
  INITIAL_CASES,
  INITIAL_EVIDENCE,
  INITIAL_ARRESTS,
  INITIAL_COURTS,
} from './mockData';

// Local In-Memory Fallback State (persisted per session)
const mockState = {
  stations: [...INITIAL_POLICE_STATIONS],
  officers: [...INITIAL_OFFICERS],
  crimes: [...INITIAL_CRIMES],
  criminals: [...INITIAL_CRIMINALS],
  victims: [...INITIAL_VICTIMS],
  firs: [...INITIAL_FIRS],
  cases: [...INITIAL_CASES],
  evidence: [...INITIAL_EVIDENCE],
  arrests: [...INITIAL_ARRESTS],
  courts: [...INITIAL_COURTS],
};

let currentSystemMode = 'demo'; // 'neo4j' | 'demo'

// Helper for resilient fallback
async function executeWithFallback(apiFn, fallbackFn) {
  try {
    const res = await apiFn();
    // If backend returns demo mode flag, record it
    if (res.data?.mode === 'demo' || res.data?.demo_mode === true) {
      currentSystemMode = 'demo';
    } else if (res.data?.mode === 'neo4j') {
      currentSystemMode = 'neo4j';
    }
    return res.data;
  } catch (err) {
    currentSystemMode = 'demo';
    return await fallbackFn();
  }
}

// ==========================================
// DB STATUS & SYSTEM
// ==========================================
export async function getDbStatus() {
  return executeWithFallback(
    async () => {
      // Try /db-status first, then /api/db-status or /health
      try {
        return await apiClient.get('/db-status');
      } catch {
        return await apiClient.get('/health');
      }
    },
    async () => ({
      connected: false,
      mode: 'demo',
      demo_mode: true,
      message: 'Demo mode active. Connect Neo4j AuraDB for live graph persistence.',
      app_name: 'Police Crime Management System',
      version: '1.0.0',
      database: 'neo4j (aura-simulated)',
      node_counts: {
        PoliceStation: mockState.stations.length,
        Officer: mockState.officers.length,
        Crime: mockState.crimes.length,
        Criminal: mockState.criminals.length,
        Victim: mockState.victims.length,
        FIR: mockState.firs.length,
        InvestigationCase: mockState.cases.length,
        Evidence: mockState.evidence.length,
        Arrest: mockState.arrests.length,
        Court: mockState.courts.length,
      },
    })
  );
}

export async function resetDemoData() {
  return executeWithFallback(
    () => apiClient.delete('/api/demo/reset'),
    async () => {
      mockState.stations = [...INITIAL_POLICE_STATIONS];
      mockState.officers = [...INITIAL_OFFICERS];
      mockState.crimes = [...INITIAL_CRIMES];
      mockState.criminals = [...INITIAL_CRIMINALS];
      mockState.victims = [...INITIAL_VICTIMS];
      mockState.firs = [...INITIAL_FIRS];
      mockState.cases = [...INITIAL_CASES];
      mockState.evidence = [...INITIAL_EVIDENCE];
      mockState.arrests = [...INITIAL_ARRESTS];
      mockState.courts = [...INITIAL_COURTS];
      return { success: true, message: 'Sample demo dataset reset successfully' };
    }
  );
}

// ==========================================
// DASHBOARD & STATS
// ==========================================
export async function getDashboardStats() {
  return executeWithFallback(
    () => apiClient.get('/api/dashboard/stats'),
    async () => {
      // Calculate dynamic stats from store
      const totalCases = mockState.cases.length;
      const openCases = mockState.cases.filter(
        (c) => c.status === 'Open' || c.status === 'Under Investigation'
      ).length;
      const closedCases = mockState.cases.filter((c) => c.status === 'Closed').length;
      const arrestsMade = mockState.arrests.length;
      const evidenceItems = mockState.evidence.length;
      const firsFiled = mockState.firs.length;
      const activeOfficers = mockState.officers.length;

      // Status breakdown
      const statusCounts = mockState.cases.reduce((acc, c) => {
        acc[c.status] = (acc[c.status] || 0) + 1;
        return acc;
      }, {});

      // Crime breakdown
      const crimeTypeCounts = mockState.crimes.reduce((acc, cr) => {
        acc[cr.crimeType] = (acc[cr.crimeType] || 0) + 1;
        return acc;
      }, {});

      return {
        totalCases,
        openCases,
        closedCases,
        arrestsMade,
        evidenceItems,
        firsFiled,
        activeOfficers,
        recentCases: mockState.cases.slice(0, 5),
        statusCounts,
        crimeTypeCounts,
        demo_mode: currentSystemMode === 'demo',
      };
    }
  );
}

// ==========================================
// POLICE STATIONS API
// ==========================================
export const policeStationsApi = {
  getAll: (params) =>
    executeWithFallback(
      () => apiClient.get('/api/stations', { params }),
      async () => [...mockState.stations]
    ),
  getById: (id) =>
    executeWithFallback(
      () => apiClient.get(`/api/stations/${id}`),
      async () => mockState.stations.find((s) => s.stationId === id)
    ),
  create: (data) =>
    executeWithFallback(
      () => apiClient.post('/api/stations', data),
      async () => {
        const newStation = {
          stationId: data.stationId || `PS00${mockState.stations.length + 1}`,
          ...data,
          officerCount: Number(data.officerCount) || 0,
        };
        mockState.stations.unshift(newStation);
        return newStation;
      }
    ),
  update: (id, data) =>
    executeWithFallback(
      () => apiClient.put(`/api/stations/${id}`, data),
      async () => {
        const index = mockState.stations.findIndex((s) => s.stationId === id);
        if (index !== -1) {
          mockState.stations[index] = { ...mockState.stations[index], ...data };
          return mockState.stations[index];
        }
        throw new Error('Station not found');
      }
    ),
  deleteOne: (id) =>
    executeWithFallback(
      () => apiClient.delete(`/api/stations/${id}`),
      async () => {
        mockState.stations = mockState.stations.filter((s) => s.stationId !== id);
        return { success: true, id };
      }
    ),
};

// ==========================================
// OFFICERS API
// ==========================================
export const officersApi = {
  getAll: (params) =>
    executeWithFallback(
      () => apiClient.get('/api/officers', { params }),
      async () => {
        let list = [...mockState.officers];
        if (params?.rank && params.rank !== 'All') {
          list = list.filter((o) => o.rank === params.rank);
        }
        return list;
      }
    ),
  getById: (id) =>
    executeWithFallback(
      () => apiClient.get(`/api/officers/${id}`),
      async () => mockState.officers.find((o) => o.officerId === id)
    ),
  create: (data) =>
    executeWithFallback(
      () => apiClient.post('/api/officers', data),
      async () => {
        const station = mockState.stations.find((s) => s.stationId === data.stationId);
        const newOfficer = {
          officerId: data.officerId || `OFF00${mockState.officers.length + 1}`,
          ...data,
          stationName: station ? station.name : data.stationName || 'Central Police Station',
          yearsOfService: Number(data.yearsOfService) || 0,
        };
        mockState.officers.unshift(newOfficer);
        return newOfficer;
      }
    ),
  update: (id, data) =>
    executeWithFallback(
      () => apiClient.put(`/api/officers/${id}`, data),
      async () => {
        const index = mockState.officers.findIndex((o) => o.officerId === id);
        if (index !== -1) {
          const station = mockState.stations.find((s) => s.stationId === data.stationId);
          mockState.officers[index] = {
            ...mockState.officers[index],
            ...data,
            stationName: station ? station.name : mockState.officers[index].stationName,
          };
          return mockState.officers[index];
        }
        throw new Error('Officer not found');
      }
    ),
  deleteOne: (id) =>
    executeWithFallback(
      () => apiClient.delete(`/api/officers/${id}`),
      async () => {
        mockState.officers = mockState.officers.filter((o) => o.officerId !== id);
        return { success: true, id };
      }
    ),
};

// ==========================================
// FIRS API
// ==========================================
export const firsApi = {
  getAll: (params) =>
    executeWithFallback(
      () => apiClient.get('/api/firs', { params }),
      async () => {
        let list = [...mockState.firs];
        if (params?.status && params.status !== 'All') {
          list = list.filter((f) => f.status === params.status);
        }
        return list;
      }
    ),
  getById: (id) =>
    executeWithFallback(
      () => apiClient.get(`/api/firs/${id}`),
      async () => mockState.firs.find((f) => f.firId === id || f.firNumber === id)
    ),
  create: (data) =>
    executeWithFallback(
      () => apiClient.post('/api/firs', data),
      async () => {
        const newFir = {
          firId: data.firId || `FIR00${mockState.firs.length + 1}`,
          firNumber: data.firNumber || `FIR/2024/00${mockState.firs.length + 1}`,
          ...data,
        };
        mockState.firs.unshift(newFir);
        return newFir;
      }
    ),
  update: (id, data) =>
    executeWithFallback(
      () => apiClient.put(`/api/firs/${id}`, data),
      async () => {
        const index = mockState.firs.findIndex((f) => f.firId === id || f.firNumber === id);
        if (index !== -1) {
          mockState.firs[index] = { ...mockState.firs[index], ...data };
          return mockState.firs[index];
        }
        throw new Error('FIR not found');
      }
    ),
  deleteOne: (id) =>
    executeWithFallback(
      () => apiClient.delete(`/api/firs/${id}`),
      async () => {
        mockState.firs = mockState.firs.filter((f) => f.firId !== id && f.firNumber !== id);
        return { success: true, id };
      }
    ),
};

// ==========================================
// CRIMES API
// ==========================================
export const crimesApi = {
  getAll: (params) =>
    executeWithFallback(
      () => apiClient.get('/api/crimes', { params }),
      async () => [...mockState.crimes]
    ),
  getById: (id) =>
    executeWithFallback(
      () => apiClient.get(`/api/crimes/${id}`),
      async () => mockState.crimes.find((c) => c.crimeId === id)
    ),
  create: (data) =>
    executeWithFallback(
      () => apiClient.post('/api/crimes', data),
      async () => {
        const newCrime = {
          crimeId: data.crimeId || `CR00${mockState.crimes.length + 1}`,
          ...data,
        };
        mockState.crimes.unshift(newCrime);
        return newCrime;
      }
    ),
  update: (id, data) =>
    executeWithFallback(
      () => apiClient.put(`/api/crimes/${id}`, data),
      async () => {
        const index = mockState.crimes.findIndex((c) => c.crimeId === id);
        if (index !== -1) {
          mockState.crimes[index] = { ...mockState.crimes[index], ...data };
          return mockState.crimes[index];
        }
        throw new Error('Crime record not found');
      }
    ),
  deleteOne: (id) =>
    executeWithFallback(
      () => apiClient.delete(`/api/crimes/${id}`),
      async () => {
        mockState.crimes = mockState.crimes.filter((c) => c.crimeId !== id);
        return { success: true, id };
      }
    ),
};

// ==========================================
// CRIMINALS API
// ==========================================
export const criminalsApi = {
  getAll: (params) =>
    executeWithFallback(
      () => apiClient.get('/api/criminals', { params }),
      async () => [...mockState.criminals]
    ),
  getById: (id) =>
    executeWithFallback(
      () => apiClient.get(`/api/criminals/${id}`),
      async () => mockState.criminals.find((cr) => cr.criminalId === id)
    ),
  create: (data) =>
    executeWithFallback(
      () => apiClient.post('/api/criminals', data),
      async () => {
        const newCrim = {
          criminalId: data.criminalId || `CRM00${mockState.criminals.length + 1}`,
          ...data,
          age: Number(data.age) || 0,
        };
        mockState.criminals.unshift(newCrim);
        return newCrim;
      }
    ),
  update: (id, data) =>
    executeWithFallback(
      () => apiClient.put(`/api/criminals/${id}`, data),
      async () => {
        const index = mockState.criminals.findIndex((cr) => cr.criminalId === id);
        if (index !== -1) {
          mockState.criminals[index] = { ...mockState.criminals[index], ...data };
          return mockState.criminals[index];
        }
        throw new Error('Criminal not found');
      }
    ),
  deleteOne: (id) =>
    executeWithFallback(
      () => apiClient.delete(`/api/criminals/${id}`),
      async () => {
        mockState.criminals = mockState.criminals.filter((cr) => cr.criminalId !== id);
        return { success: true, id };
      }
    ),
};

// ==========================================
// VICTIMS API
// ==========================================
export const victimsApi = {
  getAll: (params) =>
    executeWithFallback(
      () => apiClient.get('/api/victims', { params }),
      async () => [...mockState.victims]
    ),
  getById: (id) =>
    executeWithFallback(
      () => apiClient.get(`/api/victims/${id}`),
      async () => mockState.victims.find((v) => v.victimId === id)
    ),
  create: (data) =>
    executeWithFallback(
      () => apiClient.post('/api/victims', data),
      async () => {
        const newVic = {
          victimId: data.victimId || `VIC00${mockState.victims.length + 1}`,
          ...data,
          age: Number(data.age) || 0,
        };
        mockState.victims.unshift(newVic);
        return newVic;
      }
    ),
  update: (id, data) =>
    executeWithFallback(
      () => apiClient.put(`/api/victims/${id}`, data),
      async () => {
        const index = mockState.victims.findIndex((v) => v.victimId === id);
        if (index !== -1) {
          mockState.victims[index] = { ...mockState.victims[index], ...data };
          return mockState.victims[index];
        }
        throw new Error('Victim not found');
      }
    ),
  deleteOne: (id) =>
    executeWithFallback(
      () => apiClient.delete(`/api/victims/${id}`),
      async () => {
        mockState.victims = mockState.victims.filter((v) => v.victimId !== id);
        return { success: true, id };
      }
    ),
};

// ==========================================
// CASES API
// ==========================================
export const casesApi = {
  getAll: (params) =>
    executeWithFallback(
      () => apiClient.get('/api/cases', { params }),
      async () => {
        let list = [...mockState.cases];
        if (params?.status && params.status !== 'All') {
          list = list.filter((c) => c.status === params.status);
        }
        if (params?.priority && params.priority !== 'All') {
          list = list.filter((c) => c.priority === params.priority);
        }
        return list;
      }
    ),
  getById: (id) =>
    executeWithFallback(
      () => apiClient.get(`/api/cases/${id}`),
      async () => mockState.cases.find((c) => c.caseId === id)
    ),
  create: (data) =>
    executeWithFallback(
      () => apiClient.post('/api/cases', data),
      async () => {
        const officer = mockState.officers.find((o) => o.officerId === data.assignedOfficerId);
        const newCase = {
          caseId: data.caseId || `CASE00${mockState.cases.length + 1}`,
          ...data,
          assignedOfficerName: officer ? officer.name : 'Officer Assigned',
        };
        mockState.cases.unshift(newCase);
        return newCase;
      }
    ),
  update: (id, data) =>
    executeWithFallback(
      () => apiClient.put(`/api/cases/${id}`, data),
      async () => {
        const index = mockState.cases.findIndex((c) => c.caseId === id);
        if (index !== -1) {
          const officer = mockState.officers.find((o) => o.officerId === data.assignedOfficerId);
          mockState.cases[index] = {
            ...mockState.cases[index],
            ...data,
            assignedOfficerName: officer ? officer.name : mockState.cases[index].assignedOfficerName,
          };
          return mockState.cases[index];
        }
        throw new Error('Case not found');
      }
    ),
  deleteOne: (id) =>
    executeWithFallback(
      () => apiClient.delete(`/api/cases/${id}`),
      async () => {
        mockState.cases = mockState.cases.filter((c) => c.caseId !== id);
        return { success: true, id };
      }
    ),
};

// ==========================================
// EVIDENCE API
// ==========================================
export const evidenceApi = {
  getAll: (params) =>
    executeWithFallback(
      () => apiClient.get('/api/evidence', { params }),
      async () => {
        let list = [...mockState.evidence];
        if (params?.caseId) {
          list = list.filter((e) => e.caseId === params.caseId);
        }
        return list;
      }
    ),
  getById: (id) =>
    executeWithFallback(
      () => apiClient.get(`/api/evidence/${id}`),
      async () => mockState.evidence.find((e) => e.evidenceId === id)
    ),
  create: (data) =>
    executeWithFallback(
      () => apiClient.post('/api/evidence', data),
      async () => {
        const newEvidence = {
          evidenceId: data.evidenceId || `EV00${mockState.evidence.length + 1}`,
          ...data,
        };
        mockState.evidence.unshift(newEvidence);
        return newEvidence;
      }
    ),
  update: (id, data) =>
    executeWithFallback(
      () => apiClient.put(`/api/evidence/${id}`, data),
      async () => {
        const index = mockState.evidence.findIndex((e) => e.evidenceId === id);
        if (index !== -1) {
          mockState.evidence[index] = { ...mockState.evidence[index], ...data };
          return mockState.evidence[index];
        }
        throw new Error('Evidence item not found');
      }
    ),
  deleteOne: (id) =>
    executeWithFallback(
      () => apiClient.delete(`/api/evidence/${id}`),
      async () => {
        mockState.evidence = mockState.evidence.filter((e) => e.evidenceId !== id);
        return { success: true, id };
      }
    ),
};

// ==========================================
// ARRESTS API
// ==========================================
export const arrestsApi = {
  getAll: (params) =>
    executeWithFallback(
      () => apiClient.get('/api/arrests', { params }),
      async () => [...mockState.arrests]
    ),
  getById: (id) =>
    executeWithFallback(
      () => apiClient.get(`/api/arrests/${id}`),
      async () => mockState.arrests.find((a) => a.arrestId === id)
    ),
  create: (data) =>
    executeWithFallback(
      () => apiClient.post('/api/arrests', data),
      async () => {
        const crim = mockState.criminals.find((c) => c.criminalId === data.criminalId);
        const off = mockState.officers.find((o) => o.officerId === data.officerId);
        const newArrest = {
          arrestId: data.arrestId || `ARR00${mockState.arrests.length + 1}`,
          ...data,
          criminalName: crim ? crim.name : 'Suspect',
          officerName: off ? off.name : 'Arresting Officer',
        };
        mockState.arrests.unshift(newArrest);
        return newArrest;
      }
    ),
  update: (id, data) =>
    executeWithFallback(
      () => apiClient.put(`/api/arrests/${id}`, data),
      async () => {
        const index = mockState.arrests.findIndex((a) => a.arrestId === id);
        if (index !== -1) {
          const crim = mockState.criminals.find((c) => c.criminalId === data.criminalId);
          const off = mockState.officers.find((o) => o.officerId === data.officerId);
          mockState.arrests[index] = {
            ...mockState.arrests[index],
            ...data,
            criminalName: crim ? crim.name : mockState.arrests[index].criminalName,
            officerName: off ? off.name : mockState.arrests[index].officerName,
          };
          return mockState.arrests[index];
        }
        throw new Error('Arrest record not found');
      }
    ),
  deleteOne: (id) =>
    executeWithFallback(
      () => apiClient.delete(`/api/arrests/${id}`),
      async () => {
        mockState.arrests = mockState.arrests.filter((a) => a.arrestId !== id);
        return { success: true, id };
      }
    ),
};

// ==========================================
// COURTS API
// ==========================================
export const courtsApi = {
  getAll: (params) =>
    executeWithFallback(
      () => apiClient.get('/api/courts', { params }),
      async () => [...mockState.courts]
    ),
  getById: (id) =>
    executeWithFallback(
      () => apiClient.get(`/api/courts/${id}`),
      async () => mockState.courts.find((c) => c.courtId === id)
    ),
  create: (data) =>
    executeWithFallback(
      () => apiClient.post('/api/courts', data),
      async () => {
        const newCourt = {
          courtId: data.courtId || `CRT00${mockState.courts.length + 1}`,
          ...data,
        };
        mockState.courts.unshift(newCourt);
        return newCourt;
      }
    ),
  update: (id, data) =>
    executeWithFallback(
      () => apiClient.put(`/api/courts/${id}`, data),
      async () => {
        const index = mockState.courts.findIndex((c) => c.courtId === id);
        if (index !== -1) {
          mockState.courts[index] = { ...mockState.courts[index], ...data };
          return mockState.courts[index];
        }
        throw new Error('Court record not found');
      }
    ),
  deleteOne: (id) =>
    executeWithFallback(
      () => apiClient.delete(`/api/courts/${id}`),
      async () => {
        mockState.courts = mockState.courts.filter((c) => c.courtId !== id);
        return { success: true, id };
      }
    ),
};

// ==========================================
// CASE DETAIL (GRAPH RELATIONAL VIEW)
// ==========================================
export async function getCaseDetail(id) {
  return executeWithFallback(
    () => apiClient.get(`/api/cases/${id}/detail`),
    async () => {
      const caseItem = mockState.cases.find((c) => c.caseId === id) || mockState.cases[0];
      const officer = mockState.officers.find((o) => o.officerId === caseItem.assignedOfficerId);
      const station = officer
        ? mockState.stations.find((s) => s.stationId === officer.stationId)
        : mockState.stations[0];
      const fir = mockState.firs.find((f) => f.firId === caseItem.firId);
      const crime = fir ? mockState.crimes.find((c) => c.crimeId === fir.crimeId) : null;

      // Related evidence
      const evidence = mockState.evidence.filter((e) => e.caseId === caseItem.caseId);

      // Related arrests
      const arrests = mockState.arrests.filter((a) => a.caseId === caseItem.caseId);

      // Relational mock matching Cypher seed relationships
      let criminals = [];
      let victims = [];
      let court = null;

      if (caseItem.caseId === 'CASE001') {
        criminals = [
          { ...mockState.criminals[0], role: 'Primary Accused' },
          { ...mockState.criminals[1], role: 'Accomplice' },
        ];
        victims = [mockState.victims[0]];
        court = {
          ...mockState.courts[0],
          referralDate: '2024-09-01',
          hearingDate: '2024-10-10',
        };
      } else if (caseItem.caseId === 'CASE002') {
        criminals = [
          { ...mockState.criminals[3], role: 'Primary Accused' },
          { ...mockState.criminals[1], role: 'Accomplice' },
        ];
        victims = [mockState.victims[1]];
      } else if (caseItem.caseId === 'CASE003') {
        criminals = [{ ...mockState.criminals[2], role: 'Suspect' }];
        victims = [mockState.victims[2]];
      } else if (caseItem.caseId === 'CASE004') {
        criminals = [{ ...mockState.criminals[4], role: 'Primary Accused' }];
        victims = [mockState.victims[3]];
        court = {
          ...mockState.courts[1],
          referralDate: '2024-07-01',
          hearingDate: '2024-08-15',
        };
      } else {
        criminals = [mockState.criminals[0]];
        victims = [mockState.victims[4] || mockState.victims[0]];
      }

      return {
        ...caseItem,
        officer: officer
          ? {
              ...officer,
              station,
            }
          : null,
        fir: fir
          ? {
              ...fir,
              crime,
            }
          : null,
        criminals,
        victims,
        evidence,
        arrests,
        court,
      };
    }
  );
}

// ==========================================
// SEARCH APIS
// ==========================================
export async function searchCases(params) {
  return casesApi.getAll(params);
}

export async function globalSearch(q = '') {
  return executeWithFallback(
    () => apiClient.get('/api/search', { params: { q } }),
    async () => {
      const query = (q || '').toLowerCase().trim();
      if (!query) {
        return {
          cases: mockState.cases.slice(0, 5),
          criminals: mockState.criminals.slice(0, 5),
          officers: mockState.officers.slice(0, 5),
          firs: mockState.firs.slice(0, 5),
          stations: mockState.stations.slice(0, 5),
          evidence: mockState.evidence.slice(0, 5),
        };
      }

      const match = (item, fields) =>
        fields.some((f) => String(item[f] || '').toLowerCase().includes(query));

      return {
        cases: mockState.cases.filter((c) =>
          match(c, ['caseId', 'title', 'description', 'status', 'priority'])
        ),
        criminals: mockState.criminals.filter((cr) =>
          match(cr, ['criminalId', 'name', 'knownAliases', 'identifyingDescription'])
        ),
        officers: mockState.officers.filter((o) =>
          match(o, ['officerId', 'name', 'rank', 'badgeNumber', 'specialization'])
        ),
        firs: mockState.firs.filter((f) =>
          match(f, ['firId', 'firNumber', 'description', 'complainantName'])
        ),
        stations: mockState.stations.filter((s) =>
          match(s, ['stationId', 'name', 'city', 'location'])
        ),
        evidence: mockState.evidence.filter((e) =>
          match(e, ['evidenceId', 'evidenceType', 'description', 'caseId'])
        ),
      };
    }
  );
}
