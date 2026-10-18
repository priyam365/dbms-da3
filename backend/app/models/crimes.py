"""
Pydantic models for Crime entity.
"""
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class CrimeBase(BaseModel):
    crimeType: str = Field(..., description="Category of crime (Robbery/Cybercrime/Fraud/Theft/Assault/Homicide)", examples=["Robbery"])
    location: str = Field(..., description="Place where crime occurred", examples=["Koramangala 5th Block"])
    city: str = Field(..., description="City of incident", examples=["Bangalore"])
    date: str = Field(..., description="Incident date in YYYY-MM-DD format", examples=["2024-01-10"])
    severity: str = Field(..., description="Severity classification (Low/Medium/High)", examples=["High"])
    description: str = Field(..., description="Detailed description of the incident", examples=["Armed robbery at cooperative bank branch"])


class CrimeCreate(CrimeBase):
    crimeId: Optional[str] = Field(default=None, description="Optional custom crime ID, e.g. CR001")


class CrimeUpdate(BaseModel):
    crimeType: Optional[str] = None
    location: Optional[str] = None
    city: Optional[str] = None
    date: Optional[str] = None
    severity: Optional[str] = None
    description: Optional[str] = None


class CrimeResponse(CrimeBase):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    crimeId: str
