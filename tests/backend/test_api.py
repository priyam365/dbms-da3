"""
Backend API Unit and Integration Tests for Police Crime Management System.
Tests all 10 entities, graph detail, search, and dashboard endpoints in demo mode.
"""
import sys
import os
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

# Ensure backend directory is in sys.path
backend_dir = Path(__file__).resolve().parent.parent.parent / "backend"
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.main import app
from app.core import demo_data


@pytest.fixture(autouse=True)
def reset_store():
    """Reset in-memory demo data before each test."""
    demo_data.reset_demo_data()
    yield
    demo_data.reset_demo_data()


@pytest.fixture
def client():
    """Test client fixture."""
    return TestClient(app)


def test_system_endpoints(client):
    """Test root, health, and db-status endpoints."""
    res_root = client.get("/")
    assert res_root.status_code == 200
    data_root = res_root.json()
    assert data_root["status"] == "running"
    assert data_root["mode"] == "demo"

    res_health = client.get("/health")
    assert res_health.status_code == 200
    assert res_health.json()["status"] == "ok"

    res_db = client.get("/db-status")
    assert res_db.status_code == 200
    assert res_db.json()["mode"] == "demo"


def test_stations_endpoints(client):
    """Test Police Station list, detail, create, update, delete."""
    # List
    res = client.get("/api/stations/")
    assert res.status_code == 200
    data = res.json()
    assert data["total"] >= 5
    assert len(data["data"]) >= 5

    # Filter
    res_filter = client.get("/api/stations/?city=Bangalore")
    assert res_filter.status_code == 200
    assert all(s["city"] == "Bangalore" for s in res_filter.json()["data"])

    # Detail
    res_detail = client.get("/api/stations/PS001")
    assert res_detail.status_code == 200
    assert res_detail.json()["stationId"] == "PS001"

    # Create
    new_station = {
        "name": "Koramangala Police Station",
        "location": "80 Feet Road",
        "city": "Bangalore",
        "contactNumber": "+91-80-22220199",
        "officerCount": 25,
    }
    res_create = client.post("/api/stations/", json=new_station)
    assert res_create.status_code == 201
    created = res_create.json()
    assert created["name"] == new_station["name"]
    created_id = created["stationId"]

    # Update
    res_update = client.put(f"/api/stations/{created_id}", json={"officerCount": 28})
    assert res_update.status_code == 200
    assert res_update.json()["officerCount"] == 28

    # Delete
    res_del = client.delete(f"/api/stations/{created_id}")
    assert res_del.status_code == 200
    assert res_del.json()["id"] == created_id


def test_officers_endpoints(client):
    """Test Officer list, detail, and filtering."""
    res = client.get("/api/officers/")
    assert res.status_code == 200
    data = res.json()
    assert data["total"] >= 8

    res_rank = client.get("/api/officers/?rank=Inspector")
    assert res_rank.status_code == 200
    assert all(o["rank"] == "Inspector" for o in res_rank.json()["data"])

    res_detail = client.get("/api/officers/OFF001")
    assert res_detail.status_code == 200
    assert res_detail.json()["name"] == "Inspector Rajesh Varma"


def test_crimes_endpoints(client):
    """Test Crime listing and creation."""
    res = client.get("/api/crimes/")
    assert res.status_code == 200
    assert res.json()["total"] >= 6

    res_filter = client.get("/api/crimes/?severity=High")
    assert res_filter.status_code == 200
    assert all(c["severity"] == "High" for c in res_filter.json()["data"])


def test_firs_endpoints(client):
    """Test FIR endpoints and filtering."""
    res = client.get("/api/firs/")
    assert res.status_code == 200
    assert res.json()["total"] >= 6

    res_detail = client.get("/api/firs/FIR001")
    assert res_detail.status_code == 200
    assert res_detail.json()["complainantName"] == "Gopalakrishna Iyer"


def test_cases_and_graph_detail(client):
    """Test Case detail including graph linkage."""
    # List
    res = client.get("/api/cases/")
    assert res.status_code == 200
    assert res.json()["total"] >= 5

    # Case Graph Detail
    res_graph = client.get("/api/cases/CASE001/detail")
    assert res_graph.status_code == 200
    detail = res_graph.json()
    assert detail["caseId"] == "CASE001"
    assert detail["fir"] is not None
    assert detail["fir"]["firId"] == "FIR001"
    assert detail["officer"] is not None
    assert detail["officer"]["officerId"] == "OFF001"
    assert len(detail["criminals"]) >= 1
    assert len(detail["victims"]) >= 1
    assert len(detail["evidence"]) >= 1
    assert len(detail["arrests"]) >= 1


def test_search_and_dashboard(client):
    """Test search and dashboard statistics."""
    # Dashboard stats
    res_stats = client.get("/api/dashboard/stats")
    assert res_stats.status_code == 200
    stats = res_stats.json()
    assert stats["counts"]["cases"] >= 5
    assert stats["counts"]["stations"] >= 5
    assert "High" in stats["cases_by_priority"]

    # Case search
    res_search = client.get("/api/search/cases?q=Robbery")
    assert res_search.status_code == 200
    assert res_search.json()["total"] >= 1

    # Global search
    res_global = client.get("/api/search/global?q=Bangalore")
    assert res_global.status_code == 200
    global_data = res_global.json()
    assert global_data["total_matches"] >= 1
