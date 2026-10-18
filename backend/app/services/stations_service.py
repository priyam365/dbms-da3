"""
Service layer for Police Stations.
Dispatches between demo in-memory storage and Neo4j graph database.
"""
from typing import Dict, List, Optional, Any
from app.core.config import settings
from app.core import demo_data
from app.core import neo4j_service


def get_all(city: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieve all police stations with optional city filtering."""
    if settings.is_demo_mode:
        return demo_data.get_all_stations(city=city)
    return neo4j_service.get_all_stations(city=city)


def get_by_id(station_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve a police station by ID."""
    if settings.is_demo_mode:
        return demo_data.get_station_by_id(station_id)
    return neo4j_service.get_station_by_id(station_id)


def create(data: Dict[str, Any]) -> Dict[str, Any]:
    """Create a new police station."""
    if settings.is_demo_mode:
        return demo_data.create_station(data)
    return neo4j_service.create_station(data)


def update(station_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update an existing police station."""
    if settings.is_demo_mode:
        return demo_data.update_station(station_id, data)
    return neo4j_service.update_station(station_id, data)


def delete(station_id: str) -> bool:
    """Delete a police station by ID."""
    if settings.is_demo_mode:
        return demo_data.delete_station(station_id)
    return neo4j_service.delete_station(station_id)
