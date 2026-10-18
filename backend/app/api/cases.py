"""
API router for Investigation Cases.
Includes detailed graph view endpoint.
"""
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, status
from app.core.config import settings
from app.models.cases import (
    InvestigationCaseCreate,
    InvestigationCaseUpdate,
    InvestigationCaseResponse,
    CaseDetailResponse,
)
from app.models.common import ListResponse, MessageResponse
from app.services import cases_service

router = APIRouter(prefix="/cases", tags=["Investigation Cases"])


@router.get("/", response_model=ListResponse[InvestigationCaseResponse])
def list_cases(
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by case status"),
    priority: Optional[str] = Query(None, description="Filter by priority (Low/Medium/High/Critical)"),
    officer_id: Optional[str] = Query(None, description="Filter by assigned officer ID"),
):
    """List all investigation cases with optional status, priority, or officer filters."""
    items = cases_service.get_all(
        status=status_filter,
        priority=priority,
        assigned_officer_id=officer_id,
    )
    mode = "demo" if settings.is_demo_mode else "neo4j"
    return {"data": items, "total": len(items), "mode": mode}


@router.get("/{case_id}/detail", response_model=CaseDetailResponse)
def get_case_graph_detail(case_id: str):
    """
    Retrieve comprehensive graph inspection of an investigation case.
    Includes connected FIR, Crime, Officer, Station, Criminals, Victims,
    Evidence items, Arrests, and Court records.
    """
    detail = cases_service.get_detail(case_id)
    if not detail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Investigation case with ID '{case_id}' not found",
        )
    return detail


@router.get("/{case_id}", response_model=InvestigationCaseResponse)
def get_case(case_id: str):
    """Retrieve details of a single investigation case."""
    case = cases_service.get_by_id(case_id)
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Investigation case with ID '{case_id}' not found",
        )
    return case


@router.post("/", response_model=InvestigationCaseResponse, status_code=status.HTTP_201_CREATED)
def create_case(payload: InvestigationCaseCreate):
    """Create a new investigation case."""
    created = cases_service.create(payload.model_dump())
    return created


@router.put("/{case_id}", response_model=InvestigationCaseResponse)
def update_case(case_id: str, payload: InvestigationCaseUpdate):
    """Update an existing investigation case."""
    updated = cases_service.update(case_id, payload.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Investigation case with ID '{case_id}' not found",
        )
    return updated


@router.delete("/{case_id}", response_model=MessageResponse)
def delete_case(case_id: str):
    """Delete an investigation case."""
    success = cases_service.delete(case_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Investigation case with ID '{case_id}' not found",
        )
    mode = "demo" if settings.is_demo_mode else "neo4j"
    return MessageResponse(
        message=f"Case '{case_id}' deleted successfully",
        id=case_id,
        mode=mode,
    )
