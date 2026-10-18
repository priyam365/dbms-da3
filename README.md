# Crime Management System

A full-stack **Police Crime Management System** built with:

- 🔷 **Neo4j AuraDB** — Graph database (nodes + relationships for all entities)
- ⚡ **FastAPI** — Python REST API backend
- ⚛️ **React + Vite** — Frontend

## Graph Schema

```
(Officer)-[:WORKS_AT]->(PoliceStation)
(Officer)-[:ASSIGNED_TO]->(InvestigationCase)
(Officer)-[:REGISTERS]->(FIR)
(FIR)-[:LINKED_TO]->(InvestigationCase)
(InvestigationCase)-[:INVOLVES_CRIME]->(Crime)
(InvestigationCase)-[:HAS_CRIMINAL {role}]->(Criminal)
(InvestigationCase)-[:HAS_VICTIM]->(Victim)
(InvestigationCase)-[:HAS_EVIDENCE]->(Evidence)
(InvestigationCase)-[:HAS_PROPERTY]->(Property)
(InvestigationCase)-[:LEADS_TO]->(Arrest)
(InvestigationCase)-[:REFERRED_TO]->(Court)
(Criminal)-[:ARRESTED_IN]->(Arrest)
(Property)-[:SUBMITTED_TO]->(Court)
(Crime)-[:REPORTED_AT]->(PoliceStation)
```

## Setup

### 1. Backend
```bash
cd backend
pip install -r requirements.txt
```

Create `backend/.env`:
```
NEO4J_URI=neo4j+s://<your-instance>.databases.neo4j.io
NEO4J_USERNAME=<username>
NEO4J_PASSWORD=<password>
NEO4J_DATABASE=neo4j
FRONTEND_URL=http://localhost:5173
```

```bash
uvicorn app.main:app --reload
```

### 2. Seed Data
```bash
python database/seed_neo4j.py
```
> Edit `seed_neo4j.py` with your own credentials before running.

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Docs
Visit `http://localhost:8000/docs` for the interactive Swagger UI.

## Entities
| Entity | Node Label |
|---|---|
| Police Station | `PoliceStation` |
| Officer | `Officer` |
| Crime | `Crime` |
| First Information Report | `FIR` |
| Investigation Case | `InvestigationCase` |
| Criminal | `Criminal` |
| Victim | `Victim` |
| Evidence | `Evidence` |
| Arrest | `Arrest` |
| Court | `Court` |
| Property | `Property` |
