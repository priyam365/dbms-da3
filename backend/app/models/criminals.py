"""
Pydantic models for Criminal entity.
"""
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class CriminalBase(BaseModel):
    name: str = Field(..., description="Full legal name of the individual", examples=["Dinesh Naik"])
    age: int = Field(..., ge=0, le=120, description="Age in years", examples=[34])
    gender: str = Field(..., description="Gender (Male/Female/Other)", examples=["Male"])
    identifyingDescription: str = Field(..., description="Marks, scars, tattoos, physical features", examples=["Deep scar on left eyebrow"])
    knownAliases: str = Field(..., description="Aliases or street names", examples=["Ranga, DK"])
    criminalHistory: str = Field(..., description="Summary of past charges or convictions", examples=["Prior robbery convictions (2018, 2021)"])


class CriminalCreate(CriminalBase):
    criminalId: Optional[str] = Field(default=None, description="Optional custom criminal ID, e.g. CRM001")


class CriminalUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    identifyingDescription: Optional[str] = None
    knownAliases: Optional[str] = None
    criminalHistory: Optional[str] = None


class CriminalResponse(CriminalBase):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    criminalId: str
