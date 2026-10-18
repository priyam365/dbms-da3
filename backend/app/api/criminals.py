"""
API router for Criminal records.
"""
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, Query, status
from app.core.config import settings
from app.models.criminals import (
    CriminalCreate,
    CriminalUpdate,
    CriminalResponse,
)
from app.models.common import ListResponse, MessageResponse
from app.services import criminals_service

router = APIRouter(prefix="/criminals", tags=["Criminals"])


@router.get("/", response_model=ListResponse[CriminalResponse])
def list_criminals(
    name: Optional[str] = Query(None, description="Search by name or alias"),
):
    """List all criminals, optionally filtered by name or alias."""
    items = criminals_service.get_all(name_search=name)
    mode = "demo" if settings.is_demo_mode else "neo4j"
    return {"data": items, "total": len(items), "mode": mode}


@router.get("/{criminal_id}", response_model=CriminalResponse)
def get_criminal(criminal_id: str):
    """Retrieve details of a single criminal profile."""
    criminal = criminals_service.get_by_id(criminal_id)
    if not criminal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Criminal with ID '{criminal_id}' not found",
        )
    return criminal


@router.get("/{criminal_id}/cases", response_model=ListResponse[Dict[str, Any]])
def get_criminal_cases(criminal_id: str):
    """Retrieve all cases associated with a criminal."""
    criminal = criminals_service.get_by_id(criminal_id)
    if not criminal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Criminal with ID '{criminal_id}' not found",
        )
    cases = criminals_service.get_criminal_cases(criminal_id)
    mode = "demo" if settings.is_demo_mode else "neo4j"
    return {"data": cases, "total": len(cases), "mode": mode}


@router.post("/", response_model=CriminalResponse, status_code=status.HTTP_201_CREATED)
def create_criminal(payload: CriminalCreate):
    """Create a new criminal profile."""
    created = criminals_service.create(payload.model_dump())
    return created


@router.put("/{criminal_id}", response_model=CriminalResponse)
def update_criminal(criminal_id: str, payload: CriminalUpdate):
    """Update an existing criminal profile."""
    updated = criminals_service.update(criminal_id, payload.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Criminal with ID '{criminal_id}' not found",
        )
    return updated


@router.delete("/{criminal_id}", response_model=MessageResponse)
def delete_criminal(criminal_id: str):
    """Delete a criminal record."""
    success = criminals_service.delete(criminal_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Criminal with ID '{criminal_id}' not found",
        )
    mode = "demo" if settings.is_demo_mode else "neo4j"
    return MessageResponse(
        message=f"Criminal '{criminal_id}' deleted successfully",
        id=criminal_id,
        mode=mode,
    )
