"""
Pydantic data models for the Police Crime Management System.
"""
from app.models.stations import (
    PoliceStationCreate,
    PoliceStationUpdate,
    PoliceStationResponse,
)
from app.models.officers import (
    OfficerCreate,
    OfficerUpdate,
    OfficerResponse,
)
from app.models.crimes import (
    CrimeCreate,
    CrimeUpdate,
    CrimeResponse,
)
from app.models.firs import (
    FIRCreate,
    FIRUpdate,
    FIRResponse,
)
from app.models.criminals import (
    CriminalCreate,
    CriminalUpdate,
    CriminalResponse,
)
from app.models.victims import (
    VictimCreate,
    VictimUpdate,
    VictimResponse,
)
from app.models.cases import (
    InvestigationCaseCreate,
    InvestigationCaseUpdate,
    InvestigationCaseResponse,
    CaseDetailResponse,
)
from app.models.evidence import (
    EvidenceCreate,
    EvidenceUpdate,
    EvidenceResponse,
)
from app.models.arrests import (
    ArrestCreate,
    ArrestUpdate,
    ArrestResponse,
)
from app.models.courts import (
    CourtCreate,
    CourtUpdate,
    CourtResponse,
)
from app.models.common import (
    ListResponse,
    MessageResponse,
    DashboardStats,
    DashboardCounts,
)

__all__ = [
    "PoliceStationCreate",
    "PoliceStationUpdate",
    "PoliceStationResponse",
    "OfficerCreate",
    "OfficerUpdate",
    "OfficerResponse",
    "CrimeCreate",
    "CrimeUpdate",
    "CrimeResponse",
    "FIRCreate",
    "FIRUpdate",
    "FIRResponse",
    "CriminalCreate",
    "CriminalUpdate",
    "CriminalResponse",
    "VictimCreate",
    "VictimUpdate",
    "VictimResponse",
    "InvestigationCaseCreate",
    "InvestigationCaseUpdate",
    "InvestigationCaseResponse",
    "CaseDetailResponse",
    "EvidenceCreate",
    "EvidenceUpdate",
    "EvidenceResponse",
    "ArrestCreate",
    "ArrestUpdate",
    "ArrestResponse",
    "CourtCreate",
    "CourtUpdate",
    "CourtResponse",
    "ListResponse",
    "MessageResponse",
    "DashboardStats",
    "DashboardCounts",
]
