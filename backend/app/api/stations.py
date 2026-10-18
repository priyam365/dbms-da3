"""
API router for Police Stations.
"""
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, status
from app.core.config import settings
from app.models.stations import (
    PoliceStationCreate,
    PoliceStationUpdate,
    PoliceStationResponse,
)
from app.models.common import ListResponse, MessageResponse
from app.services import stations_service

router = APIRouter(prefix="/stations", tags=["Police Stations"])


@router.get("/", response_model=ListResponse[PoliceStationResponse])
def list_stations(
    city: Optional[str] = Query(None, description="Filter by city name"),
):
    """List all police stations with optional filtering."""
    items = stations_service.get_all(city=city)
    mode = "demo" if settings.is_demo_mode else "neo4j"
    return {"data": items, "total": len(items), "mode": mode}


@router.get("/{station_id}", response_model=PoliceStationResponse)
def get_station(station_id: str):
    """Retrieve details of a single police station."""
    station = stations_service.get_by_id(station_id)
    if not station:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Police station with ID '{station_id}' not found",
        )
    return station


@router.post("/", response_model=PoliceStationResponse, status_code=status.HTTP_201_CREATED)
def create_station(payload: PoliceStationCreate):
    """Create a new police station record."""
    created = stations_service.create(payload.model_dump())
    return created


@router.put("/{station_id}", response_model=PoliceStationResponse)
def update_station(station_id: str, payload: PoliceStationUpdate):
    """Update an existing police station record."""
    updated = stations_service.update(station_id, payload.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Police station with ID '{station_id}' not found",
        )
    return updated


@router.delete("/{station_id}", response_model=MessageResponse)
def delete_station(station_id: str):
    """Delete a police station record."""
    success = stations_service.delete(station_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Police station with ID '{station_id}' not found",
        )
    mode = "demo" if settings.is_demo_mode else "neo4j"
    return MessageResponse(
        message=f"Police station '{station_id}' deleted successfully",
        id=station_id,
        mode=mode,
    )
