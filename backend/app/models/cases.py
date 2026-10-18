"""
Pydantic models for Investigation Case entity.
Includes detailed graph response model with linked entities.
"""
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict, Field
from app.models.firs import FIRResponse
from app.models.crimes import CrimeResponse
from app.models.officers import OfficerResponse
from app.models.stations import PoliceStationResponse
from app.models.evidence import EvidenceResponse
from app.models.arrests import ArrestResponse


class InvestigationCaseBase(BaseModel):
    title: str = Field(..., description="Short descriptive title of investigation", examples=["Koramangala Bank Robbery Investigation"])
    status: str = Field(
        default="Open",
        description="Case lifecycle status (Open/Under Investigation/Closed/Referred to Court)",
        examples=["Under Investigation"],
    )
    priority: str = Field(
        default="Medium",
        description="Urgency/severity level (Low/Medium/High/Critical)",
        examples=["High"],
    )
    openedDate: str = Field(..., description="Date case was opened (YYYY-MM-DD)", examples=["2024-01-11"])
    firId: Optional[str] = Field(default=None, description="Linked FIR ID", examples=["FIR001"])
    assignedOfficerId: Optional[str] = Field(default=None, description="Investigating Officer ID", examples=["OFF001"])
    description: str = Field(..., description="Summary details and scope of case", examples=["Multi-agency probe into bank robbery"])


class InvestigationCaseCreate(InvestigationCaseBase):
    caseId: Optional[str] = Field(default=None, description="Optional custom case ID, e.g. CASE001")


class InvestigationCaseUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    openedDate: Optional[str] = None
    firId: Optional[str] = None
    assignedOfficerId: Optional[str] = None
    description: Optional[str] = None


class InvestigationCaseResponse(InvestigationCaseBase):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    caseId: str


class CaseDetailResponse(InvestigationCaseResponse):
    """Rich graph response with all connected entities."""
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    fir: Optional[FIRResponse] = None
    crime: Optional[CrimeResponse] = None
    officer: Optional[OfficerResponse] = None
    station: Optional[PoliceStationResponse] = None
    criminals: List[Dict[str, Any]] = Field(default_factory=list)
    victims: List[Dict[str, Any]] = Field(default_factory=list)
    evidence: List[EvidenceResponse] = Field(default_factory=list)
    arrests: List[ArrestResponse] = Field(default_factory=list)
    court: Optional[Dict[str, Any]] = None
