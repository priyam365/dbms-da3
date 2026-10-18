"""
Service layer for Evidence items.
Dispatches between demo in-memory storage and Neo4j graph database.
"""
from typing import Dict, List, Optional, Any
from app.core.config import settings
from app.core import demo_data
from app.core import neo4j_service


def get_all(case_id: Optional[str] = None, evidence_type: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieve all evidence items with optional caseId or evidenceType filtering."""
    if settings.is_demo_mode:
        return demo_data.get_all_evidence(case_id=case_id, evidence_type=evidence_type)
    return neo4j_service.get_all_evidence(case_id=case_id, evidence_type=evidence_type)


def get_by_id(evidence_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve evidence by ID."""
    if settings.is_demo_mode:
        return demo_data.get_evidence_by_id(evidence_id)
    return neo4j_service.get_evidence_by_id(evidence_id)


def create(data: Dict[str, Any]) -> Dict[str, Any]:
    """Create a new evidence record."""
    if settings.is_demo_mode:
        return demo_data.create_evidence(data)
    return neo4j_service.create_evidence(data)


def update(evidence_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update evidence record."""
    if settings.is_demo_mode:
        return demo_data.update_evidence(evidence_id, data)
    return neo4j_service.update_evidence(evidence_id, data)


def delete(evidence_id: str) -> bool:
    """Delete evidence record."""
    if settings.is_demo_mode:
        return demo_data.delete_evidence(evidence_id)
    return neo4j_service.delete_evidence(evidence_id)
