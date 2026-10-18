"""
Application configuration loaded from environment or .env file.
Supports seamless fallback to demo mode when Neo4j is not configured.
"""
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings with environment variable support."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "Police Crime Management System"
    app_version: str = "1.0.0"
    debug: bool = True

    # Neo4j configuration (optional - app runs in demo mode without credentials)
    neo4j_uri: Optional[str] = None
    neo4j_username: Optional[str] = None
    neo4j_password: Optional[str] = None
    neo4j_database: str = "neo4j"

    # Security
    secret_key: str = "dev-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # CORS
    frontend_url: str = "http://localhost:5173"

    @property
    def is_demo_mode(self) -> bool:
        """Return True if Neo4j is not configured (demo mode active)."""
        return not bool(self.neo4j_uri and self.neo4j_uri.strip())

    @property
    def demo_mode(self) -> bool:
        """Alias for is_demo_mode."""
        return self.is_demo_mode


settings = Settings()
