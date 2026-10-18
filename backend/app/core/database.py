"""
Neo4j database connection manager.
Provides lazy driver initialization, connectivity verification, and safe shutdown.
Runs seamlessly in demo mode when Neo4j credentials are not provided.
"""
import logging
from typing import Optional, Dict, Any

try:
    from neo4j import GraphDatabase, Driver
except ImportError:
    GraphDatabase = None
    Driver = None

from app.core.config import settings

logger = logging.getLogger(__name__)

_driver: Optional[Any] = None


def get_driver() -> Optional[Any]:
    """
    Return a singleton Neo4j driver instance.
    Returns None if the application is running in demo mode or driver init fails.
    """
    global _driver

    if settings.is_demo_mode:
        return None

    if GraphDatabase is None:
        logger.warning("neo4j library is not installed. Driver unavailable.")
        return None

    if _driver is None:
        try:
            auth = None
            if settings.neo4j_username and settings.neo4j_password:
                auth = (settings.neo4j_username, settings.neo4j_password)

            _driver = GraphDatabase.driver(
                settings.neo4j_uri,
                auth=auth,
            )
            logger.info("Initialized Neo4j driver for %s", settings.neo4j_uri)
        except Exception as exc:
            logger.error("Failed to initialize Neo4j driver: %s", exc)
            _driver = None

    return _driver


def verify_connectivity() -> Dict[str, Any]:
    """
    Verify connection to Neo4j instance.
    Returns a dictionary indicating connection status, message, and current mode.
    """
    if settings.is_demo_mode:
        return {
            "connected": False,
            "message": "Demo mode active (Neo4j not configured). Using in-memory data store.",
            "mode": "demo",
        }

    driver = get_driver()
    if driver is None:
        return {
            "connected": False,
            "message": "Neo4j driver could not be created with current configuration.",
            "mode": "neo4j",
        }

    try:
        driver.verify_connectivity()
        return {
            "connected": True,
            "message": "Successfully connected to Neo4j graph database.",
            "mode": "neo4j",
        }
    except Exception as exc:
        logger.warning("Neo4j connectivity check failed: %s", exc)
        return {
            "connected": False,
            "message": f"Neo4j connection error: {str(exc)}",
            "mode": "neo4j",
        }


def close_driver() -> None:
    """
    Safely close the Neo4j driver singleton on application shutdown.
    """
    global _driver
    if _driver is not None:
        try:
            _driver.close()
            logger.info("Neo4j driver closed successfully.")
        except Exception as exc:
            logger.warning("Error while closing Neo4j driver: %s", exc)
        finally:
            _driver = None
