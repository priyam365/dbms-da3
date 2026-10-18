"""
Service layer for First Information Reports (FIR).
Dispatches between demo in-memory storage and Neo4j graph database.
"""
from typing import Dict, List, Optional, Any
from app.core.config import settings
from app.core import demo_data
from app.core import neo4j_service


def get_all(status: Optional[str] = None, station_id: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieve all FIRs with optional status or station filtering."""
    if settings.is_demo_mode:
        return demo_data.get_all_firs(status=status, station_id=station_id)
    return neo4j_service.get_all_firs(status=status, station_id=station_id)


def get_by_id(fir_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve FIR by ID."""
    if settings.is_demo_mode:
        return demo_data.get_fir_by_id(fir_id)
    return neo4j_service.get_fir_by_id(fir_id)


def create(data: Dict[str, Any]) -> Dict[str, Any]:
    """Create a new FIR."""
    if settings.is_demo_mode:
        return demo_data.create_fir(data)
    return neo4j_service.create_fir(data)


def update(fir_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update FIR."""
    if settings.is_demo_mode:
        return demo_data.update_fir(fir_id, data)
    return neo4j_service.update_fir(fir_id, data)


def delete(fir_id: str) -> bool:
    """Delete FIR."""
    if settings.is_demo_mode:
        return demo_data.delete_fir(fir_id)
    return neo4j_service.delete_fir(fir_id)
