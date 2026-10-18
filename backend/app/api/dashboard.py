"""
API router for Dashboard Analytics and administrative operations.
"""
from fastapi import APIRouter
from app.models.common import DashboardStats, MessageResponse
from app.services import dashboard_service

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=DashboardStats)
def get_dashboard_statistics():
    """Retrieve aggregate counts, status breakdowns, and recent incident logs."""
    stats = dashboard_service.get_stats()
    return stats


@router.post("/reset-demo", response_model=MessageResponse)
def reset_demo_store():
    """Reset in-memory demo data back to initial seed data."""
    res = dashboard_service.reset_demo()
    return MessageResponse(message=res["message"], mode=res["mode"])
