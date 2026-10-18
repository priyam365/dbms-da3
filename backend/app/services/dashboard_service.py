"""
Service layer for Dashboard Analytics and Global Search.
Dispatches between demo in-memory storage and Neo4j graph database.
"""
from typing import Dict, Any
from app.core.config import settings
from app.core import demo_data
from app.core import neo4j_service


def get_stats() -> Dict[str, Any]:
    """Retrieve system aggregate statistics and breakdown charts."""
    if settings.is_demo_mode:
        stats = demo_data.get_dashboard_stats()
        stats["mode"] = "demo"
        return stats
    stats = neo4j_service.get_dashboard_stats()
    stats["mode"] = "neo4j"
    return stats


def search_global(query: str) -> Dict[str, Any]:
    """Perform global cross-entity search."""
    if settings.is_demo_mode:
        result = demo_data.search_global(query)
        result["mode"] = "demo"
        return result
    result = neo4j_service.search_global(query)
    result["mode"] = "neo4j"
    return result


def reset_demo() -> Dict[str, str]:
    """Reset demo data back to seed state."""
    demo_data.reset_demo_data()
    return {"message": "Demo data successfully reset to original seed state", "mode": "demo"}
