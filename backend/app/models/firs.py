"""
Pydantic models for First Information Report (FIR) entity.
"""
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class FIRBase(BaseModel):
    firNumber: Optional[str] = Field(default=None, description="Official registration number", examples=["FIR/2024/BLR/0101"])
    registrationDate: str = Field(..., description="Date registered (YYYY-MM-DD)", examples=["2024-01-10"])
    description: str = Field(..., description="FIR statement / report details", examples=["Report of daylight bank robbery"])
    status: str = Field(default="Pending", description="Status (Pending/Under Investigation/Closed)", examples=["Under Investigation"])
    complainantName: str = Field(..., description="Name of complainant", examples=["Gopalakrishna Iyer"])
    stationId: str = Field(..., description="Station where FIR is registered", examples=["PS001"])
    officerId: Optional[str] = Field(default=None, description="Registering officer ID", examples=["OFF001"])
    crimeId: Optional[str] = Field(default=None, description="Linked crime ID", examples=["CR001"])


class FIRCreate(FIRBase):
    firId: Optional[str] = Field(default=None, description="Optional custom FIR ID, e.g. FIR001")


class FIRUpdate(BaseModel):
    firNumber: Optional[str] = None
    registrationDate: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    complainantName: Optional[str] = None
    stationId: Optional[str] = None
    officerId: Optional[str] = None
    crimeId: Optional[str] = None


class FIRResponse(FIRBase):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    firId: str
