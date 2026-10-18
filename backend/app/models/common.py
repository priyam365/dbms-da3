"""
Common Pydantic models for API responses and dashboard statistics.
Adheres to Pydantic v2 syntax.
"""
from typing import Generic, TypeVar, List, Optional, Dict, Any
from pydantic import BaseModel, ConfigDict

T = TypeVar("T")


class ListResponse(BaseModel, Generic[T]):
    """Standard list response wrapper."""
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    data: List[T]
    total: int
    mode: str = "demo"


class MessageResponse(BaseModel):
    """Generic status/message response."""
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    message: str
    id: Optional[str] = None
    mode: str = "demo"


class DashboardCounts(BaseModel):
    """Counts across all primary entities."""
    stations: int = 0
    officers: int = 0
    firs: int = 0
    crimes: int = 0
    criminals: int = 0
    victims: int = 0
    cases: int = 0
    evidence: int = 0
    arrests: int = 0
    courts: int = 0


class DashboardStats(BaseModel):
    """Aggregate dashboard metrics and recent activity."""
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    counts: DashboardCounts
    cases_by_status: Dict[str, int] = {}
    cases_by_priority: Dict[str, int] = {}
    crimes_by_type: Dict[str, int] = {}
    firs_by_status: Dict[str, int] = {}
    arrests_by_status: Dict[str, int] = {}
    recent_cases: List[Dict[str, Any]] = []
    recent_firs: List[Dict[str, Any]] = []
    mode: str = "demo"
