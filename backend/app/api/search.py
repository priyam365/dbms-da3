"""
API router for Cross-Entity and Global Search.
"""
from typing import Optional, Dict, Any
from fastapi import APIRouter, Query
from app.core.config import settings
from app.models.cases import InvestigationCaseResponse
from app.models.common import ListResponse
from app.services import cases_service, dashboard_service

router = APIRouter(prefix="/search", tags=["Search"])


@router.get("/cases", response_model=ListResponse[InvestigationCaseResponse])
def search_cases(
    q: Optional[str] = Query(None, description="Search query string matching title or description"),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by case status"),
    priority: Optional[str] = Query(None, description="Filter by priority (Low/Medium/High/Critical)"),
):
    """Cross-entity search over investigation cases."""
    results = cases_service.search(query=q, status=status_filter, priority=priority)
    mode = "demo" if settings.is_demo_mode else "neo4j"
    return {"data": results, "total": len(results), "mode": mode}


@router.get("/global", response_model=Dict[str, Any])
def search_all_entities(
    q: Optional[str] = Query("", description="Keyword to search across all system entities"),
):
    """Search across all entity types (stations, officers, cases, criminals, etc.)."""
    return dashboard_service.search_global(q)
