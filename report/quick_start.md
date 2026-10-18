# Quick Start Guide — Police Crime Management System
## Windows PowerShell Instructions

---

## Prerequisites Checklist

Before starting, verify these are installed:

```powershell
# Check Python version (need 3.11+)
python --version

# Check Node.js version (need 18+)
node --version
npm --version

# Check Git
git --version
```

---

## Step 1: Open the Project Folder

```powershell
cd "C:\Users\priya\OneDrive\Desktop\Crime Management"
```

---

## Step 2: Set Up the Backend

### 2a. Create virtual environment
```powershell
cd backend
python -m venv venv
```

### 2b. Activate virtual environment
```powershell
venv\Scripts\Activate.ps1
```
> If you get an error about execution policy, run this first:
> `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

### 2c. Install packages
```powershell
pip install -r requirements.txt
```

### 2d. Configure environment (optional — needed for real Neo4j)
```powershell
# Copy the template
copy ..\env.example .env
# Edit .env with your Neo4j credentials using Notepad:
notepad .env
```

### 2e. Start the backend server
```powershell
uvicorn app.main:app --reload
```

✅ You should see:
```
🚔 Police Crime Management System v1.0.0
Mode: LOCAL DEMO MODE
API:  http://127.0.0.1:8000
Docs: http://127.0.0.1:8000/docs
```

Leave this terminal open.

---

## Step 3: Set Up the Frontend

Open a **new** PowerShell window:

```powershell
cd "C:\Users\priya\OneDrive\Desktop\Crime Management\frontend"
npm install
npm run dev
```

✅ You should see:
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

Open http://localhost:5173 in your browser.

---

## Step 4: Run the Tests

### Backend tests
```powershell
cd "C:\Users\priya\OneDrive\Desktop\Crime Management\backend"
venv\Scripts\Activate.ps1
python -m pytest tests/ -v --cov=app
```

### Frontend tests
```powershell
cd "C:\Users\priya\OneDrive\Desktop\Crime Management\frontend"
npm test
```

---

## Step 5: Load Neo4j Schema and Data (when connected)

1. Open https://console.neo4j.io
2. Click your AuraDB instance → **Open with Neo4j Browser**
3. In the Neo4j Browser query box, paste and run:
   - Contents of `database/schema.cypher` (run first)
   - Contents of `database/seed_data.cypher` (run second)
4. Verify with `database/queries/verification_queries.cypher`

---

## Important URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| Health Check | http://localhost:8000/health |
| DB Status | http://localhost:8000/db-status |

---

## Stopping the Application

- Press `Ctrl+C` in each terminal to stop backend and frontend
- Deactivate Python environment: `deactivate`

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `uvicorn: command not found` | Make sure venv is activated |
| `npm: command not found` | Install Node.js from nodejs.org |
| Frontend shows connection error | Make sure backend is running on port 8000 |
| Demo mode shows even with .env | Check .env has correct NEO4J_URI format |
| Python execution policy error | Run `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` |

---

## Project Structure Reference

```
Crime Management/
├── backend/           ← FastAPI Python API
│   ├── app/main.py   ← Entry point
│   ├── requirements.txt
│   └── venv/          ← Created by you (not in Git)
├── frontend/          ← React + Vite UI
│   └── src/
├── database/          ← Cypher scripts for Neo4j
├── tests/             ← Automated tests
├── report/            ← Project report and docs
└── screenshots/       ← Your captured screenshots
```
