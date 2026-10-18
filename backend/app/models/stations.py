"""
Pydantic models for Police Station entity.
"""
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class PoliceStationBase(BaseModel):
    name: str = Field(..., description="Name of the police station", examples=["Central Police Station"])
    location: str = Field(..., description="Street location / area", examples=["12 MG Road"])
    city: str = Field(..., description="City where station is located", examples=["Bangalore"])
    contactNumber: str = Field(..., description="Station official contact number", examples=["+91-80-22220101"])
    officerCount: int = Field(default=0, description="Total active officers posted", examples=[45])


class PoliceStationCreate(PoliceStationBase):
    stationId: Optional[str] = Field(default=None, description="Optional custom station ID, e.g. PS001")


class PoliceStationUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    city: Optional[str] = None
    contactNumber: Optional[str] = None
    officerCount: Optional[int] = None


class PoliceStationResponse(PoliceStationBase):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    stationId: str
