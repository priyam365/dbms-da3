"""
Service layer for Arrests.
Dispatches between demo in-memory storage and Neo4j graph database.
"""
from typing import Dict, List, Optional, Any
from app.core.config import settings
from app.core import demo_data
from app.core import neo4j_service


def get_all(case_id: Optional[str] = None, criminal_id: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieve all arrests with optional caseId or criminalId filtering."""
    if settings.is_demo_mode:
        return demo_data.get_all_arrests(case_id=case_id, criminal_id=criminal_id)
    return neo4j_service.get_all_arrests(case_id=case_id, criminal_id=criminal_id)


def get_by_id(arrest_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve arrest by ID."""
    if settings.is_demo_mode:
        return demo_data.get_arrest_by_id(arrest_id)
    return neo4j_service.get_arrest_by_id(arrest_id)


def create(data: Dict[str, Any]) -> Dict[str, Any]:
    """Record a new arrest."""
    if settings.is_demo_mode:
        return demo_data.create_arrest(data)
    return neo4j_service.create_arrest(data)


def update(arrest_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update arrest record."""
    if settings.is_demo_mode:
        return demo_data.update_arrest(arrest_id, data)
    return neo4j_service.update_arrest(arrest_id, data)


def delete(arrest_id: str) -> bool:
    """Delete arrest record."""
    if settings.is_demo_mode:
        return demo_data.delete_arrest(arrest_id)
    return neo4j_service.delete_arrest(arrest_id)
