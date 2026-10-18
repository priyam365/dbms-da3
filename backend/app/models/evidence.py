"""
Pydantic models for Evidence entity.
"""
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class EvidenceBase(BaseModel):
    evidenceType: str = Field(
        ...,
        description="Type of evidence (CCTV/Fingerprint/Weapon/Document/Witness Statement/Digital/Physical)",
        examples=["CCTV"],
    )
    description: str = Field(..., description="Details and condition observations", examples=["High-definition surveillance footage"])
    collectedDate: str = Field(..., description="Date evidence was acquired (YYYY-MM-DD)", examples=["2024-01-10"])
    caseId: Optional[str] = Field(default=None, description="Linked Investigation Case ID", examples=["CASE001"])
    condition: str = Field(default="Good", description="Condition (Good/Degraded/Damaged)", examples=["Good"])


class EvidenceCreate(EvidenceBase):
    evidenceId: Optional[str] = Field(default=None, description="Optional custom evidence ID, e.g. EV001")


class EvidenceUpdate(BaseModel):
    evidenceType: Optional[str] = None
    description: Optional[str] = None
    collectedDate: Optional[str] = None
    caseId: Optional[str] = None
    condition: Optional[str] = None


class EvidenceResponse(EvidenceBase):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    evidenceId: str
