"""
Service layer for Investigation Cases.
Dispatches between demo in-memory storage and Neo4j graph database.
Includes graph traversal for detailed case inspection.
"""
from typing import Dict, List, Optional, Any
from app.core.config import settings
from app.core import demo_data
from app.core import neo4j_service


def get_all(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    assigned_officer_id: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """Retrieve all investigation cases with optional filtering."""
    if settings.is_demo_mode:
        return demo_data.get_all_cases(
            status=status,
            priority=priority,
            assigned_officer_id=assigned_officer_id,
        )
    return neo4j_service.get_all_cases(
        status=status,
        priority=priority,
        assigned_officer_id=assigned_officer_id,
    )


def get_by_id(case_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve investigation case by ID."""
    if settings.is_demo_mode:
        return demo_data.get_case_by_id(case_id)
    return neo4j_service.get_case_by_id(case_id)


def create(data: Dict[str, Any]) -> Dict[str, Any]:
    """Create a new investigation case."""
    if settings.is_demo_mode:
        return demo_data.create_case(data)
    return neo4j_service.create_case(data)


def update(case_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update investigation case."""
    if settings.is_demo_mode:
        return demo_data.update_case(case_id, data)
    return neo4j_service.update_case(case_id, data)


def delete(case_id: str) -> bool:
    """Delete investigation case."""
    if settings.is_demo_mode:
        return demo_data.delete_case(case_id)
    return neo4j_service.delete_case(case_id)


def get_detail(case_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve complete graph case detail including linked nodes."""
    if settings.is_demo_mode:
        return demo_data.get_case_detail(case_id)
    return neo4j_service.get_case_detail(case_id)


def search(
    query: Optional[str] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """Search cases matching keyword, status, or priority."""
    if settings.is_demo_mode:
        return demo_data.search_cases(query=query, status=status, priority=priority)
    return neo4j_service.search_cases(query=query, status=status, priority=priority)
