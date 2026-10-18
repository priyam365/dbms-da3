"""
API router for Arrests.
"""
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, status
from app.core.config import settings
from app.models.arrests import (
    ArrestCreate,
    ArrestUpdate,
    ArrestResponse,
)
from app.models.common import ListResponse, MessageResponse
from app.services import arrests_service

router = APIRouter(prefix="/arrests", tags=["Arrests"])


@router.get("/", response_model=ListResponse[ArrestResponse])
def list_arrests(
    case_id: Optional[str] = Query(None, description="Filter by case ID"),
    criminal_id: Optional[str] = Query(None, description="Filter by criminal ID"),
):
    """List all arrests with optional case or criminal filters."""
    items = arrests_service.get_all(case_id=case_id, criminal_id=criminal_id)
    mode = "demo" if settings.is_demo_mode else "neo4j"
    return {"data": items, "total": len(items), "mode": mode}


@router.get("/{arrest_id}", response_model=ArrestResponse)
def get_arrest(arrest_id: str):
    """Retrieve details of a single arrest record."""
    arrest = arrests_service.get_by_id(arrest_id)
    if not arrest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Arrest record with ID '{arrest_id}' not found",
        )
    return arrest


@router.post("/", response_model=ArrestResponse, status_code=status.HTTP_201_CREATED)
def create_arrest(payload: ArrestCreate):
    """Log a new arrest."""
    created = arrests_service.create(payload.model_dump())
    return created


@router.put("/{arrest_id}", response_model=ArrestResponse)
def update_arrest(arrest_id: str, payload: ArrestUpdate):
    """Update an existing arrest record."""
    updated = arrests_service.update(arrest_id, payload.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Arrest record with ID '{arrest_id}' not found",
        )
    return updated


@router.delete("/{arrest_id}", response_model=MessageResponse)
def delete_arrest(arrest_id: str):
    """Delete an arrest record."""
    success = arrests_service.delete(arrest_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Arrest record with ID '{arrest_id}' not found",
        )
    mode = "demo" if settings.is_demo_mode else "neo4j"
    return MessageResponse(
        message=f"Arrest '{arrest_id}' deleted successfully",
        id=arrest_id,
        mode=mode,
    )
