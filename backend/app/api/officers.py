"""
API router for Police Officers.
"""
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, Query, status
from app.core.config import settings
from app.models.officers import (
    OfficerCreate,
    OfficerUpdate,
    OfficerResponse,
)
from app.models.common import ListResponse, MessageResponse
from app.services import officers_service

router = APIRouter(prefix="/officers", tags=["Officers"])


@router.get("/", response_model=ListResponse[OfficerResponse])
def list_officers(
    station_id: Optional[str] = Query(None, description="Filter by station ID"),
    rank: Optional[str] = Query(None, description="Filter by rank (Constable/SI/Inspector/DSP/SP)"),
):
    """List all police officers with optional station or rank filtering."""
    items = officers_service.get_all(station_id=station_id, rank=rank)
    mode = "demo" if settings.is_demo_mode else "neo4j"
    return {"data": items, "total": len(items), "mode": mode}


@router.get("/{officer_id}", response_model=OfficerResponse)
def get_officer(officer_id: str):
    """Retrieve details of a single police officer."""
    officer = officers_service.get_by_id(officer_id)
    if not officer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Officer with ID '{officer_id}' not found",
        )
    return officer


@router.get("/{officer_id}/cases", response_model=ListResponse[Dict[str, Any]])
def get_officer_cases(officer_id: str):
    """Retrieve all cases assigned to a specific officer."""
    officer = officers_service.get_by_id(officer_id)
    if not officer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Officer with ID '{officer_id}' not found",
        )
    cases = officers_service.get_officer_cases(officer_id)
    mode = "demo" if settings.is_demo_mode else "neo4j"
    return {"data": cases, "total": len(cases), "mode": mode}


@router.post("/", response_model=OfficerResponse, status_code=status.HTTP_201_CREATED)
def create_officer(payload: OfficerCreate):
    """Create a new police officer record."""
    created = officers_service.create(payload.model_dump())
    return created


@router.put("/{officer_id}", response_model=OfficerResponse)
def update_officer(officer_id: str, payload: OfficerUpdate):
    """Update an existing police officer record."""
    updated = officers_service.update(officer_id, payload.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Officer with ID '{officer_id}' not found",
        )
    return updated


@router.delete("/{officer_id}", response_model=MessageResponse)
def delete_officer(officer_id: str):
    """Delete a police officer record."""
    success = officers_service.delete(officer_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Officer with ID '{officer_id}' not found",
        )
    mode = "demo" if settings.is_demo_mode else "neo4j"
    return MessageResponse(
        message=f"Officer '{officer_id}' deleted successfully",
        id=officer_id,
        mode=mode,
    )
