"""
Service layer for Crimes.
Dispatches between demo in-memory storage and Neo4j graph database.
"""
from typing import Dict, List, Optional, Any
from app.core.config import settings
from app.core import demo_data
from app.core import neo4j_service


def get_all(crime_type: Optional[str] = None, severity: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieve all crimes with optional crimeType or severity filtering."""
    if settings.is_demo_mode:
        return demo_data.get_all_crimes(crime_type=crime_type, severity=severity)
    return neo4j_service.get_all_crimes(crime_type=crime_type, severity=severity)


def get_by_id(crime_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve crime by ID."""
    if settings.is_demo_mode:
        return demo_data.get_crime_by_id(crime_id)
    return neo4j_service.get_crime_by_id(crime_id)


def create(data: Dict[str, Any]) -> Dict[str, Any]:
    """Create a new crime record."""
    if settings.is_demo_mode:
        return demo_data.create_crime(data)
    return neo4j_service.create_crime(data)


def update(crime_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update crime record."""
    if settings.is_demo_mode:
        return demo_data.update_crime(crime_id, data)
    return neo4j_service.update_crime(crime_id, data)


def delete(crime_id: str) -> bool:
    """Delete crime record."""
    if settings.is_demo_mode:
        return demo_data.delete_crime(crime_id)
    return neo4j_service.delete_crime(crime_id)
