"""
API router for Crimes.
"""
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, status
from app.core.config import settings
from app.models.crimes import (
    CrimeCreate,
    CrimeUpdate,
    CrimeResponse,
)
from app.models.common import ListResponse, MessageResponse
from app.services import crimes_service

router = APIRouter(prefix="/crimes", tags=["Crimes"])


@router.get("/", response_model=ListResponse[CrimeResponse])
def list_crimes(
    crime_type: Optional[str] = Query(None, description="Filter by crime category"),
    severity: Optional[str] = Query(None, description="Filter by severity (Low/Medium/High)"),
):
    """List all crimes with optional crimeType or severity filtering."""
    items = crimes_service.get_all(crime_type=crime_type, severity=severity)
    mode = "demo" if settings.is_demo_mode else "neo4j"
    return {"data": items, "total": len(items), "mode": mode}


@router.get("/{crime_id}", response_model=CrimeResponse)
def get_crime(crime_id: str):
    """Retrieve details of a single crime record."""
    crime = crimes_service.get_by_id(crime_id)
    if not crime:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Crime with ID '{crime_id}' not found",
        )
    return crime


@router.post("/", response_model=CrimeResponse, status_code=status.HTTP_201_CREATED)
def create_crime(payload: CrimeCreate):
    """Create a new crime record."""
    created = crimes_service.create(payload.model_dump())
    return created


@router.put("/{crime_id}", response_model=CrimeResponse)
def update_crime(crime_id: str, payload: CrimeUpdate):
    """Update an existing crime record."""
    updated = crimes_service.update(crime_id, payload.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Crime with ID '{crime_id}' not found",
        )
    return updated


@router.delete("/{crime_id}", response_model=MessageResponse)
def delete_crime(crime_id: str):
    """Delete a crime record."""
    success = crimes_service.delete(crime_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Crime with ID '{crime_id}' not found",
        )
    mode = "demo" if settings.is_demo_mode else "neo4j"
    return MessageResponse(
        message=f"Crime '{crime_id}' deleted successfully",
        id=crime_id,
        mode=mode,
    )
