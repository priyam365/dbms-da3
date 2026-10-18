"""
API router for First Information Reports (FIR).
"""
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, status
from app.core.config import settings
from app.models.firs import (
    FIRCreate,
    FIRUpdate,
    FIRResponse,
)
from app.models.common import ListResponse, MessageResponse
from app.services import firs_service

router = APIRouter(prefix="/firs", tags=["FIRs"])


@router.get("/", response_model=ListResponse[FIRResponse])
def list_firs(
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status (Pending/Under Investigation/Closed)"),
    station_id: Optional[str] = Query(None, description="Filter by police station ID"),
):
    """List all FIRs with optional status or station filtering."""
    items = firs_service.get_all(status=status_filter, station_id=station_id)
    mode = "demo" if settings.is_demo_mode else "neo4j"
    return {"data": items, "total": len(items), "mode": mode}


@router.get("/{fir_id}", response_model=FIRResponse)
def get_fir(fir_id: str):
    """Retrieve details of a single FIR."""
    fir = firs_service.get_by_id(fir_id)
    if not fir:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"FIR with ID '{fir_id}' not found",
        )
    return fir


@router.post("/", response_model=FIRResponse, status_code=status.HTTP_201_CREATED)
def create_fir(payload: FIRCreate):
    """Register a new First Information Report (FIR)."""
    created = firs_service.create(payload.model_dump())
    return created


@router.put("/{fir_id}", response_model=FIRResponse)
def update_fir(fir_id: str, payload: FIRUpdate):
    """Update an existing FIR."""
    updated = firs_service.update(fir_id, payload.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"FIR with ID '{fir_id}' not found",
        )
    return updated


@router.delete("/{fir_id}", response_model=MessageResponse)
def delete_fir(fir_id: str):
    """Delete an FIR record."""
    success = firs_service.delete(fir_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"FIR with ID '{fir_id}' not found",
        )
    mode = "demo" if settings.is_demo_mode else "neo4j"
    return MessageResponse(
        message=f"FIR '{fir_id}' deleted successfully",
        id=fir_id,
        mode=mode,
    )
