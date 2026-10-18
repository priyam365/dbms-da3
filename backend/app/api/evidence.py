"""
API router for Evidence items.
"""
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, status
from app.core.config import settings
from app.models.evidence import (
    EvidenceCreate,
    EvidenceUpdate,
    EvidenceResponse,
)
from app.models.common import ListResponse, MessageResponse
from app.services import evidence_service

router = APIRouter(prefix="/evidence", tags=["Evidence"])


@router.get("/", response_model=ListResponse[EvidenceResponse])
def list_evidence(
    case_id: Optional[str] = Query(None, description="Filter by case ID"),
    evidence_type: Optional[str] = Query(None, description="Filter by evidence type (CCTV/Weapon/Digital/etc.)"),
):
    """List all evidence items with optional case or type filtering."""
    items = evidence_service.get_all(case_id=case_id, evidence_type=evidence_type)
    mode = "demo" if settings.is_demo_mode else "neo4j"
    return {"data": items, "total": len(items), "mode": mode}


@router.get("/{evidence_id}", response_model=EvidenceResponse)
def get_evidence(evidence_id: str):
    """Retrieve details of a single evidence item."""
    item = evidence_service.get_by_id(evidence_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Evidence with ID '{evidence_id}' not found",
        )
    return item


@router.post("/", response_model=EvidenceResponse, status_code=status.HTTP_201_CREATED)
def create_evidence(payload: EvidenceCreate):
    """Catalog a new piece of evidence."""
    created = evidence_service.create(payload.model_dump())
    return created


@router.put("/{evidence_id}", response_model=EvidenceResponse)
def update_evidence(evidence_id: str, payload: EvidenceUpdate):
    """Update an existing evidence item."""
    updated = evidence_service.update(evidence_id, payload.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Evidence with ID '{evidence_id}' not found",
        )
    return updated


@router.delete("/{evidence_id}", response_model=MessageResponse)
def delete_evidence(evidence_id: str):
    """Delete an evidence item."""
    success = evidence_service.delete(evidence_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Evidence with ID '{evidence_id}' not found",
        )
    mode = "demo" if settings.is_demo_mode else "neo4j"
    return MessageResponse(
        message=f"Evidence '{evidence_id}' deleted successfully",
        id=evidence_id,
        mode=mode,
    )
