"""
Pydantic models for Arrest entity.
"""
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class ArrestBase(BaseModel):
    arrestDate: str = Field(..., description="Date of arrest (YYYY-MM-DD)", examples=["2024-01-20"])
    status: str = Field(
        ...,
        description="Custodial status (Arrested/Released on Bail/In Custody/Produced in Court)",
        examples=["In Custody"],
    )
    caseId: Optional[str] = Field(default=None, description="Linked case ID", examples=["CASE001"])
    criminalId: Optional[str] = Field(default=None, description="Arrested person / criminal ID", examples=["CRM001"])
    officerId: Optional[str] = Field(default=None, description="Arresting officer ID", examples=["OFF001"])
    charges: str = Field(..., description="Statutory sections and charges filed", examples=["IPC 392, IPC 397"])


class ArrestCreate(ArrestBase):
    arrestId: Optional[str] = Field(default=None, description="Optional custom arrest ID, e.g. ARR001")


class ArrestUpdate(BaseModel):
    arrestDate: Optional[str] = None
    status: Optional[str] = None
    caseId: Optional[str] = None
    criminalId: Optional[str] = None
    officerId: Optional[str] = None
    charges: Optional[str] = None


class ArrestResponse(ArrestBase):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    arrestId: str
