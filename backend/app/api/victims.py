"""
API router for Victims.
"""
from fastapi import APIRouter, HTTPException, status
from app.core.config import settings
from app.models.victims import (
    VictimCreate,
    VictimUpdate,
    VictimResponse,
)
from app.models.common import ListResponse, MessageResponse
from app.services import victims_service

router = APIRouter(prefix="/victims", tags=["Victims"])


@router.get("/", response_model=ListResponse[VictimResponse])
def list_victims():
    """List all recorded victims."""
    items = victims_service.get_all()
    mode = "demo" if settings.is_demo_mode else "neo4j"
    return {"data": items, "total": len(items), "mode": mode}


@router.get("/{victim_id}", response_model=VictimResponse)
def get_victim(victim_id: str):
    """Retrieve details of a single victim."""
    victim = victims_service.get_by_id(victim_id)
    if not victim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Victim with ID '{victim_id}' not found",
        )
    return victim


@router.post("/", response_model=VictimResponse, status_code=status.HTTP_201_CREATED)
def create_victim(payload: VictimCreate):
    """Create a new victim record."""
    created = victims_service.create(payload.model_dump())
    return created


@router.put("/{victim_id}", response_model=VictimResponse)
def update_victim(victim_id: str, payload: VictimUpdate):
    """Update an existing victim record."""
    updated = victims_service.update(victim_id, payload.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Victim with ID '{victim_id}' not found",
        )
    return updated


@router.delete("/{victim_id}", response_model=MessageResponse)
def delete_victim(victim_id: str):
    """Delete a victim record."""
    success = victims_service.delete(victim_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Victim with ID '{victim_id}' not found",
        )
    mode = "demo" if settings.is_demo_mode else "neo4j"
    return MessageResponse(
        message=f"Victim '{victim_id}' deleted successfully",
        id=victim_id,
        mode=mode,
    )
