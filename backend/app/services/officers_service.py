"""
Service layer for Police Officers.
Dispatches between demo in-memory storage and Neo4j graph database.
"""
from typing import Dict, List, Optional, Any
from app.core.config import settings
from app.core import demo_data
from app.core import neo4j_service


def get_all(station_id: Optional[str] = None, rank: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieve all police officers with optional station or rank filtering."""
    if settings.is_demo_mode:
        return demo_data.get_all_officers(station_id=station_id, rank=rank)
    return neo4j_service.get_all_officers(station_id=station_id, rank=rank)


def get_by_id(officer_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve a police officer by ID."""
    if settings.is_demo_mode:
        return demo_data.get_officer_by_id(officer_id)
    return neo4j_service.get_officer_by_id(officer_id)


def create(data: Dict[str, Any]) -> Dict[str, Any]:
    """Create a new police officer."""
    if settings.is_demo_mode:
        return demo_data.create_officer(data)
    return neo4j_service.create_officer(data)


def update(officer_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update a police officer."""
    if settings.is_demo_mode:
        return demo_data.update_officer(officer_id, data)
    return neo4j_service.update_officer(officer_id, data)


def delete(officer_id: str) -> bool:
    """Delete a police officer by ID."""
    if settings.is_demo_mode:
        return demo_data.delete_officer(officer_id)
    return neo4j_service.delete_officer(officer_id)


def get_officer_cases(officer_id: str) -> List[Dict[str, Any]]:
    """Retrieve cases assigned to an officer."""
    if settings.is_demo_mode:
        return demo_data.get_officer_cases(officer_id)
    return []
