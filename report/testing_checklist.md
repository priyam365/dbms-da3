# Testing Checklist
## Police Crime Management System

---

## Backend Tests (pytest)

### Unit Tests — Always Run (No Neo4j Required)

| Test | File | Description | Status |
|------|------|-------------|--------|
| App starts | test_health.py | Server starts and returns 200 | ⬜ Not yet run |
| /health endpoint | test_health.py | Returns correct JSON | ⬜ Not yet run |
| /db-status endpoint | test_health.py | Returns mode and status | ⬜ Not yet run |
| Settings load | test_config.py | Optional Neo4j fields default to None | ⬜ Not yet run |
| Demo mode active | test_config.py | is_demo_mode=True when no URI | ⬜ Not yet run |
| Create station | test_demo_mode.py | POST /api/stations creates record | ⬜ Not yet run |
| List stations | test_demo_mode.py | GET /api/stations returns list | ⬜ Not yet run |
| Get station by ID | test_demo_mode.py | GET /api/stations/PS001 returns record | ⬜ Not yet run |
| Update station | test_demo_mode.py | PUT /api/stations/PS001 updates name | ⬜ Not yet run |
| Delete station | test_demo_mode.py | DELETE /api/stations/PS001 removes record | ⬜ Not yet run |
| Create officer | test_demo_mode.py | POST /api/officers creates record | ⬜ Not yet run |
| List officers | test_demo_mode.py | GET /api/officers returns all | ⬜ Not yet run |
| Create FIR | test_demo_mode.py | POST /api/firs creates record | ⬜ Not yet run |
| Create case | test_demo_mode.py | POST /api/cases creates record | ⬜ Not yet run |
| Get case detail | test_demo_mode.py | GET /api/cases/CASE001/detail returns relationships | ⬜ Not yet run |
| Dashboard stats | test_demo_mode.py | GET /api/dashboard/stats returns counts | ⬜ Not yet run |
| Search cases | test_demo_mode.py | GET /search/cases?q=robbery finds records | ⬜ Not yet run |
| Validation error | test_demo_mode.py | POST with empty name returns 422 | ⬜ Not yet run |
| 404 handling | test_demo_mode.py | GET /api/stations/INVALID returns 404 | ⬜ Not yet run |
| Reset demo data | test_demo_mode.py | DELETE /api/demo/reset restores seed data | ⬜ Not yet run |

### Integration Tests — Require Live Neo4j (Skipped if no .env)

| Test | File | Description | Status |
|------|------|-------------|--------|
| Neo4j connectivity | test_neo4j_live.py | verify_connectivity() returns connected=True | ⬜ SKIP (no creds) |
| Neo4j station CRUD | test_neo4j_live.py | Create and delete a test station | ⬜ SKIP (no creds) |
| Cypher constraint | test_neo4j_live.py | Duplicate stationId raises error | ⬜ SKIP (no creds) |
| Multi-hop query | test_neo4j_live.py | Station→Officer→FIR→Case traversal returns results | ⬜ SKIP (no creds) |

---

## Frontend Tests (Vitest)

| Test | File | Description | Status |
|------|------|-------------|--------|
| App renders | App.test.jsx | Application renders without crashing | ⬜ Not yet run |
| Dashboard renders | Dashboard.test.jsx | Stat cards render with API mock | ⬜ Not yet run |
| StatusBadge Open | StatusBadge.test.jsx | Renders "Open" with blue style | ⬜ Not yet run |
| StatusBadge Critical | StatusBadge.test.jsx | Renders "Critical" with red style | ⬜ Not yet run |

---

## Manual Tests

| Test | Method | Status |
|------|--------|--------|
| Backend starts without .env | Run uvicorn without .env | ⬜ Not yet run |
| Frontend loads dashboard | Open http://localhost:5173 | ⬜ Not yet run |
| Demo mode banner visible | Check orange banner shows | ⬜ Not yet run |
| Create a station in UI | Use Add Station form | ⬜ Not yet run |
| Edit a station in UI | Use Edit modal | ⬜ Not yet run |
| Delete with confirmation | Click Delete, confirm | ⬜ Not yet run |
| Search returns results | Type "robbery" in search | ⬜ Not yet run |
| Case detail shows relationships | Open CASE001 detail page | ⬜ Not yet run |
| Form validation fires | Submit empty form | ⬜ Not yet run |
| API docs load | Open /docs | ⬜ Not yet run |
| Neo4j schema loads | Run schema.cypher in AuraDB Browser | ⬜ Blocked by connection issue |
| Seed data loads | Run seed_data.cypher in AuraDB Browser | ⬜ Blocked by connection issue |
| Verification queries pass | Run verification_queries.cypher | ⬜ Blocked by connection issue |

---

## Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Passed / Confirmed |
| ❌ | Failed |
| ⬜ | Not yet run |
| ⚠️ | Partial / Issues |
| 🔵 | Skipped (intentional) |

Update this checklist after running the tests and capturing screenshots.
