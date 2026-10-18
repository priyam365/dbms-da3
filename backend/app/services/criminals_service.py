"""
Service layer for Criminals.
Dispatches between demo in-memory storage and Neo4j graph database.
"""
from typing import Dict, List, Optional, Any
from app.core.config import settings
from app.core import demo_data
from app.core import neo4j_service


def get_all(name_search: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieve all criminals, optionally filtered by name or alias."""
    if settings.is_demo_mode:
        return demo_data.get_all_criminals(name_search=name_search)
    return neo4j_service.get_all_criminals(name_search=name_search)


def get_by_id(criminal_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve criminal by ID."""
    if settings.is_demo_mode:
        return demo_data.get_criminal_by_id(criminal_id)
    return neo4j_service.get_criminal_by_id(criminal_id)


def create(data: Dict[str, Any]) -> Dict[str, Any]:
    """Create a new criminal profile."""
    if settings.is_demo_mode:
        return demo_data.create_criminal(data)
    return neo4j_service.create_criminal(data)


def update(criminal_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update criminal profile."""
    if settings.is_demo_mode:
        return demo_data.update_criminal(criminal_id, data)
    return neo4j_service.update_criminal(criminal_id, data)


def delete(criminal_id: str) -> bool:
    """Delete criminal profile."""
    if settings.is_demo_mode:
        return demo_data.delete_criminal(criminal_id)
    return neo4j_service.delete_criminal(criminal_id)


def get_criminal_cases(criminal_id: str) -> List[Dict[str, Any]]:
    """Retrieve cases associated with a criminal."""
    if settings.is_demo_mode:
        return demo_data.get_criminal_cases(criminal_id)
    return []
