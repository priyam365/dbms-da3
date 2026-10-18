"""
Pydantic models for Victim entity.
"""
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class VictimBase(BaseModel):
    name: str = Field(..., description="Full legal name of victim", examples=["Gopalakrishna Iyer"])
    age: int = Field(..., ge=0, le=120, description="Age in years", examples=[52])
    gender: str = Field(..., description="Gender (Male/Female/Other)", examples=["Male"])
    contactNumber: str = Field(..., description="Contact telephone number", examples=["+91-9845011223"])
    address: str = Field(..., description="Residential or business address", examples=["Flat 4B, Shanthi Apts, Koramangala"])


class VictimCreate(VictimBase):
    victimId: Optional[str] = Field(default=None, description="Optional custom victim ID, e.g. VIC001")


class VictimUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    contactNumber: Optional[str] = None
    address: Optional[str] = None


class VictimResponse(VictimBase):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    victimId: str
