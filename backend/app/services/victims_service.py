"""
Service layer for Victims.
Dispatches between demo in-memory storage and Neo4j graph database.
"""
from typing import Dict, List, Optional, Any
from app.core.config import settings
from app.core import demo_data
from app.core import neo4j_service


def get_all() -> List[Dict[str, Any]]:
    """Retrieve all victims."""
    if settings.is_demo_mode:
        return demo_data.get_all_victims()
    return neo4j_service.get_all_victims()


def get_by_id(victim_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve victim by ID."""
    if settings.is_demo_mode:
        return demo_data.get_victim_by_id(victim_id)
    return neo4j_service.get_victim_by_id(victim_id)


def create(data: Dict[str, Any]) -> Dict[str, Any]:
    """Create a new victim record."""
    if settings.is_demo_mode:
        return demo_data.create_victim(data)
    return neo4j_service.create_victim(data)


def update(victim_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update victim record."""
    if settings.is_demo_mode:
        return demo_data.update_victim(victim_id, data)
    return neo4j_service.update_victim(victim_id, data)


def delete(victim_id: str) -> bool:
    """Delete victim record."""
    if settings.is_demo_mode:
        return demo_data.delete_victim(victim_id)
    return neo4j_service.delete_victim(victim_id)
