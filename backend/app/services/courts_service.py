"""
Service layer for Courts.
Dispatches between demo in-memory storage and Neo4j graph database.
"""
from typing import Dict, List, Optional, Any
from app.core.config import settings
from app.core import demo_data
from app.core import neo4j_service


def get_all(city: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieve all courts with optional city filtering."""
    if settings.is_demo_mode:
        return demo_data.get_all_courts(city=city)
    return neo4j_service.get_all_courts(city=city)


def get_by_id(court_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve court by ID."""
    if settings.is_demo_mode:
        return demo_data.get_court_by_id(court_id)
    return neo4j_service.get_court_by_id(court_id)


def create(data: Dict[str, Any]) -> Dict[str, Any]:
    """Create a new court record."""
    if settings.is_demo_mode:
        return demo_data.create_court(data)
    return neo4j_service.create_court(data)


def update(court_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update court record."""
    if settings.is_demo_mode:
        return demo_data.update_court(court_id, data)
    return neo4j_service.update_court(court_id, data)


def delete(court_id: str) -> bool:
    """Delete court record."""
    if settings.is_demo_mode:
        return demo_data.delete_court(court_id)
    return neo4j_service.delete_court(court_id)
