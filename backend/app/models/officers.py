"""
Pydantic models for Officer entity.
"""
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class OfficerBase(BaseModel):
    name: str = Field(..., description="Full name of police officer", examples=["Inspector Rajesh Varma"])
    rank: str = Field(..., description="Designation / Rank (Constable/SI/Inspector/DSP/SP)", examples=["Inspector"])
    badgeNumber: str = Field(..., description="Unique police badge number", examples=["KA-INSP-101"])
    stationId: Optional[str] = Field(default=None, description="Station ID where currently posted", examples=["PS001"])
    specialization: Optional[str] = Field(default=None, description="Area of specialization", examples=["Homicide & Violent Crime"])
    yearsOfService: int = Field(default=0, ge=0, description="Completed years in service", examples=[15])


class OfficerCreate(OfficerBase):
    officerId: Optional[str] = Field(default=None, description="Optional custom officer ID, e.g. OFF001")


class OfficerUpdate(BaseModel):
    name: Optional[str] = None
    rank: Optional[str] = None
    badgeNumber: Optional[str] = None
    stationId: Optional[str] = None
    specialization: Optional[str] = None
    yearsOfService: Optional[int] = None


class OfficerResponse(OfficerBase):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    officerId: str
