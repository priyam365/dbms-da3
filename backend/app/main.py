"""
Police Crime Management System — FastAPI Application Entry Point.
Provides full RESTful API for managing crime records with Neo4j graph database
and seamless zero-configuration fallback to Demo Mode.
"""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import verify_connectivity, close_driver

# Routers
from app.api.stations import router as stations_router
from app.api.officers import router as officers_router
from app.api.crimes import router as crimes_router
from app.api.firs import router as firs_router
from app.api.criminals import router as criminals_router
from app.api.victims import router as victims_router
from app.api.cases import router as cases_router
from app.api.evidence import router as evidence_router
from app.api.arrests import router as arrests_router
from app.api.courts import router as courts_router
from app.api.dashboard import router as dashboard_router
from app.api.search import router as search_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("crime_management")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager handling startup checks and graceful shutdown."""
    mode_str = "DEMO MODE (in-memory)" if settings.is_demo_mode else "NEO4J CONNECTED"
    print("\n" + "=" * 65)
    print(f"  [POLICE] {settings.app_name} v{settings.app_version}")
    print(f"  [MODE]   Operational Mode: {mode_str}")
    print(f"  [CORS]   Allowed Origin:   {settings.frontend_url}")
    print(f"  [DOCS]   API Docs:         http://localhost:8000/docs")
    print(f"  [HEALTH] Health Check:     http://localhost:8000/health")
    print("=" * 65 + "\n")

    if not settings.is_demo_mode:
        status_info = verify_connectivity()
        logger.info("Neo4j database status: %s", status_info)

    yield

    close_driver()
    logger.info("Application shutdown completed.")


openapi_tags = [
    {"name": "System", "description": "Core system status, health checks, and database connectivity"},
    {"name": "Police Stations", "description": "Police Station jurisdictions and resource counts"},
    {"name": "Officers", "description": "Police officers, rank hierarchies, and case assignments"},
    {"name": "Crimes", "description": "Reported crime incidents and classifications"},
    {"name": "FIRs", "description": "First Information Reports registration and lifecycle management"},
    {"name": "Criminals", "description": "Criminal profiles, known aliases, and priors"},
    {"name": "Victims", "description": "Victim information and statements"},
    {"name": "Investigation Cases", "description": "Case investigations with linked graph entities"},
    {"name": "Evidence", "description": "Forensic evidence collection and custody tracking"},
    {"name": "Arrests", "description": "Arrest records, custody status, and statutory charges"},
    {"name": "Courts", "description": "Court jurisdictions and judicial referrals"},
    {"name": "Dashboard", "description": "Aggregated statistics and charts data"},
    {"name": "Search", "description": "Cross-entity keyword and global search"},
]

app = FastAPI(
    title=settings.app_name,
    description=(
        "Production-ready Police Crime Management System API with Neo4j Graph Database "
        "and zero-config Demo Mode fallback."
    ),
    version=settings.app_version,
    openapi_tags=openapi_tags,
    lifespan=lifespan,
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount entity routers with prefix /api
app.include_router(stations_router, prefix="/api")
app.include_router(officers_router, prefix="/api")
app.include_router(crimes_router, prefix="/api")
app.include_router(firs_router, prefix="/api")
app.include_router(criminals_router, prefix="/api")
app.include_router(victims_router, prefix="/api")
app.include_router(cases_router, prefix="/api")
app.include_router(evidence_router, prefix="/api")
app.include_router(arrests_router, prefix="/api")
app.include_router(courts_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(search_router, prefix="/api")


@app.get("/", tags=["System"])
def root():
    """Welcome endpoint providing service metadata and documentation links."""
    return {
        "app": settings.app_name,
        "version": settings.app_version,
        "mode": "demo" if settings.is_demo_mode else "neo4j",
        "docs_url": "/docs",
        "health_url": "/health",
        "db_status_url": "/db-status",
        "status": "running",
    }


@app.get("/health", tags=["System"])
def health():
    """Health check endpoint indicating service availability and active mode."""
    return {
        "status": "ok",
        "mode": "demo" if settings.is_demo_mode else "neo4j",
        "version": settings.app_version,
    }


@app.get("/db-status", tags=["System"])
def db_status():
    """Check Neo4j database connectivity or demo mode fallback status."""
    return verify_connectivity()
