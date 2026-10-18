"""
API router for Courts.
"""
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, status
from app.core.config import settings
from app.models.courts import (
    CourtCreate,
    CourtUpdate,
    CourtResponse,
)
from app.models.common import ListResponse, MessageResponse
from app.services import courts_service

router = APIRouter(prefix="/courts", tags=["Courts"])


@router.get("/", response_model=ListResponse[CourtResponse])
def list_courts(
    city: Optional[str] = Query(None, description="Filter by city"),
):
    """List all court jurisdictions with optional city filter."""
    items = courts_service.get_all(city=city)
    mode = "demo" if settings.is_demo_mode else "neo4j"
    return {"data": items, "total": len(items), "mode": mode}


@router.get("/{court_id}", response_model=CourtResponse)
def get_court(court_id: str):
    """Retrieve details of a single court record."""
    court = courts_service.get_by_id(court_id)
    if not court:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Court with ID '{court_id}' not found",
        )
    return court


@router.post("/", response_model=CourtResponse, status_code=status.HTTP_201_CREATED)
def create_court(payload: CourtCreate):
    """Register a new court record."""
    created = courts_service.create(payload.model_dump())
    return created


@router.put("/{court_id}", response_model=CourtResponse)
def update_court(court_id: str, payload: CourtUpdate):
    """Update an existing court record."""
    updated = courts_service.update(court_id, payload.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Court with ID '{court_id}' not found",
        )
    return updated


@router.delete("/{court_id}", response_model=MessageResponse)
def delete_court(court_id: str):
    """Delete a court record."""
    success = courts_service.delete(court_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Court with ID '{court_id}' not found",
        )
    mode = "demo" if settings.is_demo_mode else "neo4j"
    return MessageResponse(
        message=f"Court '{court_id}' deleted successfully",
        id=court_id,
        mode=mode,
    )
