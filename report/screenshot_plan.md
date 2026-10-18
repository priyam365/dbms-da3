# Screenshot Capture Plan
## Police Crime Management System — Evidence for Report

All screenshots must be captured by you using **Win+Shift+S** (Windows Snipping Tool)
or the **Snipping Tool** application.

Save all screenshots to: `C:\Users\priya\OneDrive\Desktop\Crime Management\screenshots\`

---

## How to Take a Screenshot on Windows

**Method 1 (Recommended):** Press **Win+Shift+S** → Select area → Paste into Paint → Save as PNG
**Method 2:** Press **PrtScn** → Open Paint → Ctrl+V → Save as PNG
**Method 3:** Open **Snipping Tool** from Start menu → New → Select area → Save

---

## Screenshot Checklist

### 01 — Application Dashboard
- **File:** `01_dashboard.png`
- **Application:** Browser
- **URL:** `http://localhost:5173`
- **What to show:** Full dashboard with stat cards (Total Cases, Officers, FIRs, etc.), recent cases table
- **Mode:** Local Demo Mode (works without Neo4j)
- **Report section:** Frontend Implementation, Figure 1
- **Tip:** Maximize browser, hide bookmarks bar for clean screenshot

---

### 02 — Backend Health Endpoint
- **File:** `02_backend_health.png`
- **Application:** Browser
- **URL:** `http://localhost:8000/health`
- **What to show:** JSON response: `{"status": "ok", "mode": "demo", "version": "1.0.0"}`
- **Mode:** Works without Neo4j
- **Report section:** Backend Implementation, Figure 2

---

### 03 — Database Status Endpoint
- **File:** `03_database_status.png`
- **Application:** Browser
- **URL:** `http://localhost:8000/db-status`
- **What to show:** JSON showing mode, connected/disconnected status
- **Mode:** Shows "demo" mode or real Neo4j status
- **Report section:** Backend Implementation, Figure 3

---

### 04 — Police Station Creation
- **File:** `04_station_creation.png`
- **Application:** Browser
- **URL:** `http://localhost:5173/stations`
- **What to show:** The "Add Station" modal form filled in with new station data
- **Mode:** Local Demo Mode
- **Report section:** Frontend Implementation — CRUD Operations, Figure 4

---

### 05 — Officer Management Page
- **File:** `05_officer_management.png`
- **Application:** Browser
- **URL:** `http://localhost:5173/officers`
- **What to show:** Officer list table with rank badges, all officer records visible
- **Mode:** Local Demo Mode
- **Report section:** Frontend Implementation, Figure 5

---

### 06 — FIR Registration
- **File:** `06_fir_registration.png`
- **Application:** Browser
- **URL:** `http://localhost:5173/firs`
- **What to show:** FIR list with status badges, or the FIR registration form open
- **Mode:** Local Demo Mode
- **Report section:** Frontend Implementation, Figure 6

---

### 07 — Case Relationship View
- **File:** `07_case_relationships.png`
- **Application:** Browser
- **URL:** `http://localhost:5173/cases/CASE001`
- **What to show:** Full case detail page showing officer, FIR, criminals, victims, evidence, arrests, court
- **Mode:** Local Demo Mode (this is the key graph demo screen)
- **Report section:** Graph Database — Relationship Exploration, Figure 7
- **Tip:** This is your most important screenshot — shows graph relationships visually

---

### 08 — Search and Filtering
- **File:** `08_search_results.png`
- **Application:** Browser
- **URL:** `http://localhost:5173/search`
- **What to show:** Search results for a query (e.g., "robbery" or "Nagpur") with results from multiple entities
- **Mode:** Local Demo Mode
- **Report section:** Frontend Implementation — Search, Figure 8

---

### 09 — Input Validation
- **File:** `09_validation_error.png`
- **Application:** Browser
- **URL:** Any form page (e.g., `/stations`)
- **What to show:** Form submission attempt with validation errors shown in red
- **Mode:** Local Demo Mode
- **Report section:** Testing — Input Validation, Figure 9

---

### 10 — Backend Test Results
- **File:** `10_backend_tests.png`
- **Application:** PowerShell terminal
- **Command:** `python -m pytest tests/ -v` (run from backend/ with venv active)
- **What to show:** pytest output with PASSED/FAILED/SKIPPED results
- **Mode:** Shows which tests need Neo4j (SKIPPED) vs demo tests (PASSED)
- **Report section:** Testing Methodology, Figure 10
- **Tip:** Make the terminal wide so all test names are visible

---

### 11 — Frontend Test Results
- **File:** `11_frontend_tests.png`
- **Application:** PowerShell terminal
- **Command:** `npm test` (run from frontend/ directory)
- **What to show:** Vitest output with test results
- **Mode:** No Neo4j needed
- **Report section:** Testing Methodology, Figure 11

---

### 12 — API Documentation (Swagger UI)
- **File:** `12_api_docs.png`
- **Application:** Browser
- **URL:** `http://localhost:8000/docs`
- **What to show:** Swagger UI showing all API endpoints grouped by entity
- **Mode:** Works without Neo4j
- **Report section:** Backend Implementation — API Documentation, Figure 12

---

### 13 — Neo4j Schema in Browser (Requires AuraDB connection)
- **File:** `13_neo4j_schema.png`
- **Application:** Neo4j Browser (via AuraDB console)
- **Query:** `SHOW CONSTRAINTS`
- **What to show:** List of all uniqueness constraints for each node label
- **Mode:** REQUIRES real Neo4j connection
- **Report section:** Database Design — Constraints and Indexes, Figure 13
- **Note:** Capture this after successfully running schema.cypher

---

### 14 — Neo4j Sample Data Graph (Requires AuraDB connection)
- **File:** `14_neo4j_seed_data.png`
- **Application:** Neo4j Browser
- **Query:** `MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 50`
- **What to show:** Visual graph with colored nodes and labeled relationships
- **Mode:** REQUIRES real Neo4j connection
- **Report section:** Database Design — Sample Dataset, Figure 14
- **Tip:** In Neo4j Browser, click the graph view icon (not table view) for a visual graph

---

### 15 — Cypher Graph Traversal (Requires AuraDB connection)
- **File:** `15_cypher_traversal.png`
- **Application:** Neo4j Browser
- **Query:**
  ```cypher
  MATCH path = (ps:PoliceStation)<-[:WORKS_AT]-(o:Officer)
               -[:REGISTERS]->(fir:FIR)
               -[:LINKED_TO]->(ic:InvestigationCase)
  RETURN path
  ```
- **What to show:** Multi-hop graph path visualization
- **Mode:** REQUIRES real Neo4j connection
- **Report section:** Cypher Queries — Multi-hop Traversal, Figure 15

---

### 16 — Neo4j Connectivity Test (Requires AuraDB connection)
- **File:** `16_neo4j_connection.png`
- **Application:** Browser
- **URL:** `http://localhost:8000/db-status`
- **What to show:** JSON response showing `"connected": true` and `"mode": "neo4j"`
- **Mode:** REQUIRES real Neo4j connection
- **Report section:** Neo4j Integration, Figure 16

---

### 17 — Demo Mode Banner (optional but useful)
- **File:** `17_demo_mode_banner.png`
- **Application:** Browser
- **URL:** `http://localhost:5173`
- **What to show:** The amber "LOCAL DEMO MODE" banner at the top of the application
- **Mode:** Demo mode (no .env configured)
- **Report section:** Offline Demo Mode, Figure 17

---

## Screenshots NOT Yet Captured

At time of report preparation, the following screenshots require actions from you:

| Screenshot | Reason Not Yet Captured |
|------------|------------------------|
| 01-12 | Application must be running — follow Quick Start first |
| 13-16 | Require Neo4j AuraDB connection (diagnose connection first) |

---

## Screenshot Naming Checklist

- [ ] `01_dashboard.png`
- [ ] `02_backend_health.png`
- [ ] `03_database_status.png`
- [ ] `04_station_creation.png`
- [ ] `05_officer_management.png`
- [ ] `06_fir_registration.png`
- [ ] `07_case_relationships.png`
- [ ] `08_search_results.png`
- [ ] `09_validation_error.png`
- [ ] `10_backend_tests.png`
- [ ] `11_frontend_tests.png`
- [ ] `12_api_docs.png`
- [ ] `13_neo4j_schema.png` *(requires Neo4j)*
- [ ] `14_neo4j_seed_data.png` *(requires Neo4j)*
- [ ] `15_cypher_traversal.png` *(requires Neo4j)*
- [ ] `16_neo4j_connection.png` *(requires Neo4j)*
- [ ] `17_demo_mode_banner.png`
