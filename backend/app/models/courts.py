"""
Pydantic models for Court entity.
"""
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class CourtBase(BaseModel):
    name: str = Field(..., description="Court name", examples=["City Civil & Sessions Court Complex"])
    location: str = Field(..., description="Court physical area or street", examples=["K.G. Road"])
    city: str = Field(..., description="Court city jurisdiction", examples=["Bangalore"])
    courtType: str = Field(
        ...,
        description="Type of court (Sessions Court/High Court/Magistrate Court)",
        examples=["Sessions Court"],
    )
    judgeAssigned: str = Field(..., description="Presiding judge name", examples=["Hon. Justice S. N. Hegde"])


class CourtCreate(CourtBase):
    courtId: Optional[str] = Field(default=None, description="Optional custom court ID, e.g. CRT001")


class CourtUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    city: Optional[str] = None
    courtType: Optional[str] = None
    judgeAssigned: Optional[str] = None


class CourtResponse(CourtBase):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    courtId: str
