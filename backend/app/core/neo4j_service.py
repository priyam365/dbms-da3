"""
Neo4j Graph Database Service Layer.
Fully implemented parameterized Cypher queries for all entities in the
Police Crime Management System.

Graph schema (mapped from relational schema):
  Nodes  : PoliceStation, Officer, Case, Crime, Criminal, Victim,
            Evidence, Property, Court, FIR, Arrest, InvestigationCase
  Relationships:
    (Officer)           -[:WORKS_AT]->           (PoliceStation)
    (Officer)           -[:ASSIGNED_TO]->         (Case/InvestigationCase)
    (Case)              -[:INVOLVES_CRIME]->       (Crime)
    (Case)              -[:HAS_CRIMINAL {role}]->  (Criminal)
    (Case)              -[:HAS_VICTIM]->           (Victim)
    (Case)              -[:HAS_EVIDENCE]->         (Evidence)
    (Case)              -[:HAS_PROPERTY]->         (Property)
    (Case)              -[:LEADS_TO]->             (Arrest)
    (Case)              -[:REFERRED_TO]->          (Court)
    (Property)          -[:SUBMITTED_TO]->         (Court)
    (Crime)             -[:REPORTED_AT]->          (PoliceStation)
    (Officer)           -[:REGISTERS]->            (FIR)
    (FIR)               -[:LINKED_TO]->            (Case/InvestigationCase)
    (InvestigationCase) -[:INVOLVES]->             (Criminal)
    (InvestigationCase) -[:HAS_VICTIM]->           (Victim)
    (InvestigationCase) -[:HAS_EVIDENCE]->         (Evidence)
"""
from typing import Dict, List, Optional, Any

from app.core.database import get_driver


# ─────────────────────────────────────────────────────────────────────────────
# Internal helpers
# ─────────────────────────────────────────────────────────────────────────────

def _run(cypher: str, params: Dict[str, Any] = None) -> List[Dict[str, Any]]:
    """Execute a Cypher query and return all records as plain Python dicts."""
    driver = get_driver()
    if driver is None:
        raise RuntimeError(
            "Neo4j driver is not available. "
            "Ensure NEO4J_URI, NEO4J_USERNAME, and NEO4J_PASSWORD are set in .env."
        )
    with driver.session() as session:
        result = session.run(cypher, parameters=params or {})
        return [record.data() for record in result]


def _first(records: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """Return the first record dict or None if the list is empty."""
    return records[0] if records else None


# ─────────────────────────────────────────────────────────────────────────────
# POLICE STATIONS
# ─────────────────────────────────────────────────────────────────────────────

def get_all_stations(city: Optional[str] = None) -> List[Dict[str, Any]]:
    """Return all PoliceStation nodes, optionally filtered by city."""
    if city:
        rows = _run(
            "MATCH (s:PoliceStation) "
            "WHERE toLower(s.city) CONTAINS toLower($city) "
            "RETURN s {.*} AS station ORDER BY s.stationName",
            {"city": city},
        )
    else:
        rows = _run(
            "MATCH (s:PoliceStation) RETURN s {.*} AS station ORDER BY s.stationName"
        )
    return [r["station"] for r in rows]


def get_station_by_id(station_id: str) -> Optional[Dict[str, Any]]:
    """Return a single PoliceStation by stationId."""
    rows = _run(
        "MATCH (s:PoliceStation {stationId: $sid}) RETURN s {.*} AS station",
        {"sid": station_id},
    )
    row = _first(rows)
    return row["station"] if row else None


def create_station(data: Dict[str, Any]) -> Dict[str, Any]:
    """MERGE a PoliceStation node and set all properties."""
    rows = _run(
        "MERGE (s:PoliceStation {stationId: $stationId}) "
        "SET s += $props "
        "RETURN s {.*} AS station",
        {"stationId": data["stationId"], "props": data},
    )
    return rows[0]["station"]


def update_station(station_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update an existing PoliceStation node."""
    rows = _run(
        "MATCH (s:PoliceStation {stationId: $sid}) "
        "SET s += $props "
        "RETURN s {.*} AS station",
        {"sid": station_id, "props": data},
    )
    row = _first(rows)
    return row["station"] if row else None


def delete_station(station_id: str) -> bool:
    """Delete a PoliceStation node and all its relationships."""
    rows = _run(
        "MATCH (s:PoliceStation {stationId: $sid}) "
        "DETACH DELETE s "
        "RETURN count(s) AS deleted",
        {"sid": station_id},
    )
    return bool(rows and rows[0]["deleted"] > 0)


# ─────────────────────────────────────────────────────────────────────────────
# OFFICERS
# ─────────────────────────────────────────────────────────────────────────────

def get_all_officers(
    station_id: Optional[str] = None,
    rank: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """Return all Officer nodes with optional station / rank filters."""
    match_clause = "MATCH (o:Officer)"
    filters: List[str] = []
    params: Dict[str, Any] = {}

    if station_id:
        match_clause = (
            "MATCH (o:Officer)-[:WORKS_AT]->(s:PoliceStation {stationId: $stationId})"
        )
        params["stationId"] = station_id
    if rank:
        filters.append("o.rank = $rank")
        params["rank"] = rank

    where = (" WHERE " + " AND ".join(filters)) if filters else ""
    rows = _run(
        f"{match_clause}{where} "
        "OPTIONAL MATCH (o)-[:WORKS_AT]->(ws:PoliceStation) "
        "RETURN o {.*, stationId: ws.stationId, stationName: ws.stationName} AS officer "
        "ORDER BY o.officerName",
        params,
    )
    return [r["officer"] for r in rows]


def get_officer_by_id(officer_id: str) -> Optional[Dict[str, Any]]:
    """Return a single Officer with their station info."""
    rows = _run(
        "MATCH (o:Officer {officerId: $oid}) "
        "OPTIONAL MATCH (o)-[:WORKS_AT]->(s:PoliceStation) "
        "RETURN o {.*, stationId: s.stationId, stationName: s.stationName} AS officer",
        {"oid": officer_id},
    )
    row = _first(rows)
    return row["officer"] if row else None


def create_officer(data: Dict[str, Any]) -> Dict[str, Any]:
    """Create an Officer node and optionally link to a PoliceStation."""
    station_id = data.pop("stationId", None)
    rows = _run(
        "MERGE (o:Officer {officerId: $officerId}) "
        "SET o += $props "
        "RETURN o {.*} AS officer",
        {"officerId": data["officerId"], "props": data},
    )
    if station_id:
        _run(
            "MATCH (o:Officer {officerId: $oid}), "
            "(s:PoliceStation {stationId: $sid}) "
            "MERGE (o)-[:WORKS_AT]->(s)",
            {"oid": data["officerId"], "sid": station_id},
        )
        data["stationId"] = station_id
    return rows[0]["officer"]


def update_officer(officer_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update Officer properties."""
    rows = _run(
        "MATCH (o:Officer {officerId: $oid}) "
        "SET o += $props "
        "OPTIONAL MATCH (o)-[:WORKS_AT]->(s:PoliceStation) "
        "RETURN o {.*, stationId: s.stationId, stationName: s.stationName} AS officer",
        {"oid": officer_id, "props": data},
    )
    row = _first(rows)
    return row["officer"] if row else None


def delete_officer(officer_id: str) -> bool:
    """Delete an Officer node and all its relationships."""
    rows = _run(
        "MATCH (o:Officer {officerId: $oid}) "
        "DETACH DELETE o "
        "RETURN count(o) AS deleted",
        {"oid": officer_id},
    )
    return bool(rows and rows[0]["deleted"] > 0)


# ─────────────────────────────────────────────────────────────────────────────
# CRIMES
# ─────────────────────────────────────────────────────────────────────────────

def get_all_crimes(
    crime_type: Optional[str] = None,
    severity: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """Return all Crime nodes with optional type / severity filters."""
    filters: List[str] = []
    params: Dict[str, Any] = {}
    if crime_type:
        filters.append("toLower(c.crimeType) CONTAINS toLower($crimeType)")
        params["crimeType"] = crime_type
    if severity:
        filters.append("c.severity = $severity")
        params["severity"] = severity
    where = (" WHERE " + " AND ".join(filters)) if filters else ""
    rows = _run(
        f"MATCH (c:Crime){where} "
        "RETURN c {.*} AS crime ORDER BY c.occurrenceDate DESC",
        params,
    )
    return [r["crime"] for r in rows]


def get_crime_by_id(crime_id: str) -> Optional[Dict[str, Any]]:
    """Return a single Crime node by crimeId."""
    rows = _run(
        "MATCH (c:Crime {crimeId: $cid}) RETURN c {.*} AS crime",
        {"cid": crime_id},
    )
    row = _first(rows)
    return row["crime"] if row else None


def create_crime(data: Dict[str, Any]) -> Dict[str, Any]:
    """MERGE a Crime node."""
    rows = _run(
        "MERGE (c:Crime {crimeId: $crimeId}) "
        "SET c += $props "
        "RETURN c {.*} AS crime",
        {"crimeId": data["crimeId"], "props": data},
    )
    return rows[0]["crime"]


def update_crime(crime_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update a Crime node."""
    rows = _run(
        "MATCH (c:Crime {crimeId: $cid}) "
        "SET c += $props "
        "RETURN c {.*} AS crime",
        {"cid": crime_id, "props": data},
    )
    row = _first(rows)
    return row["crime"] if row else None


def delete_crime(crime_id: str) -> bool:
    """Delete a Crime node."""
    rows = _run(
        "MATCH (c:Crime {crimeId: $cid}) "
        "DETACH DELETE c "
        "RETURN count(c) AS deleted",
        {"cid": crime_id},
    )
    return bool(rows and rows[0]["deleted"] > 0)


# ─────────────────────────────────────────────────────────────────────────────
# FIRs  (First Information Reports)
# ─────────────────────────────────────────────────────────────────────────────

def get_all_firs(
    status: Optional[str] = None,
    station_id: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """Return all FIR nodes, optionally filtered by status or registering station."""
    filters: List[str] = []
    params: Dict[str, Any] = {}
    match_extra = ""
    if status:
        filters.append("f.status = $status")
        params["status"] = status
    if station_id:
        match_extra = "-[:REGISTERS]->(f)<-[:WORKS_AT]-(s:PoliceStation {stationId: $stationId}) WITH f"
        params["stationId"] = station_id

    where = (" WHERE " + " AND ".join(filters)) if filters else ""
    rows = _run(
        f"MATCH (f:FIR){where} "
        "OPTIONAL MATCH (o:Officer)-[:REGISTERS]->(f) "
        "RETURN f {.*, officerId: o.officerId, officerName: o.officerName} AS fir "
        "ORDER BY f.registrationDate DESC",
        params,
    )
    return [r["fir"] for r in rows]


def get_fir_by_id(fir_id: str) -> Optional[Dict[str, Any]]:
    """Return a single FIR with registering officer and linked case."""
    rows = _run(
        "MATCH (f:FIR {firId: $fid}) "
        "OPTIONAL MATCH (o:Officer)-[:REGISTERS]->(f) "
        "OPTIONAL MATCH (f)-[:LINKED_TO]->(ic) WHERE ic:InvestigationCase OR ic:Case "
        "RETURN f {.*, officerId: o.officerId, officerName: o.officerName, caseId: ic.caseId} AS fir",
        {"fid": fir_id},
    )
    row = _first(rows)
    return row["fir"] if row else None


def create_fir(data: Dict[str, Any]) -> Dict[str, Any]:
    """Create a FIR node and link to registering officer."""
    officer_id = data.pop("officerId", None)
    rows = _run(
        "MERGE (f:FIR {firId: $firId}) "
        "SET f += $props "
        "RETURN f {.*} AS fir",
        {"firId": data["firId"], "props": data},
    )
    if officer_id:
        _run(
            "MATCH (o:Officer {officerId: $oid}), (f:FIR {firId: $fid}) "
            "MERGE (o)-[:REGISTERS]->(f)",
            {"oid": officer_id, "fid": data["firId"]},
        )
    return rows[0]["fir"]


def update_fir(fir_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update a FIR node."""
    rows = _run(
        "MATCH (f:FIR {firId: $fid}) "
        "SET f += $props "
        "RETURN f {.*} AS fir",
        {"fid": fir_id, "props": data},
    )
    row = _first(rows)
    return row["fir"] if row else None


def delete_fir(fir_id: str) -> bool:
    """Delete a FIR node."""
    rows = _run(
        "MATCH (f:FIR {firId: $fid}) "
        "DETACH DELETE f "
        "RETURN count(f) AS deleted",
        {"fid": fir_id},
    )
    return bool(rows and rows[0]["deleted"] > 0)


# ─────────────────────────────────────────────────────────────────────────────
# CRIMINALS
# ─────────────────────────────────────────────────────────────────────────────

def get_all_criminals(name_search: Optional[str] = None) -> List[Dict[str, Any]]:
    """Return all Criminal nodes with optional name search."""
    if name_search:
        rows = _run(
            "MATCH (cr:Criminal) "
            "WHERE toLower(cr.name) CONTAINS toLower($name) "
            "RETURN cr {.*} AS criminal ORDER BY cr.name",
            {"name": name_search},
        )
    else:
        rows = _run("MATCH (cr:Criminal) RETURN cr {.*} AS criminal ORDER BY cr.name")
    return [r["criminal"] for r in rows]


def get_criminal_by_id(criminal_id: str) -> Optional[Dict[str, Any]]:
    """Return a single Criminal with all cases they appear in."""
    rows = _run(
        "MATCH (cr:Criminal {criminalId: $crid}) "
        "OPTIONAL MATCH (c)-[:HAS_CRIMINAL]->(cr) "
        "OPTIONAL MATCH (ic:InvestigationCase)-[:INVOLVES]->(cr) "
        "RETURN cr {.*, caseIds: collect(DISTINCT c.caseId) + collect(DISTINCT ic.caseId)} AS criminal",
        {"crid": criminal_id},
    )
    row = _first(rows)
    return row["criminal"] if row else None


def create_criminal(data: Dict[str, Any]) -> Dict[str, Any]:
    """MERGE a Criminal node."""
    rows = _run(
        "MERGE (cr:Criminal {criminalId: $criminalId}) "
        "SET cr += $props "
        "RETURN cr {.*} AS criminal",
        {"criminalId": data["criminalId"], "props": data},
    )
    return rows[0]["criminal"]


def update_criminal(criminal_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update a Criminal node."""
    rows = _run(
        "MATCH (cr:Criminal {criminalId: $crid}) "
        "SET cr += $props "
        "RETURN cr {.*} AS criminal",
        {"crid": criminal_id, "props": data},
    )
    row = _first(rows)
    return row["criminal"] if row else None


def delete_criminal(criminal_id: str) -> bool:
    """Delete a Criminal node."""
    rows = _run(
        "MATCH (cr:Criminal {criminalId: $crid}) "
        "DETACH DELETE cr "
        "RETURN count(cr) AS deleted",
        {"crid": criminal_id},
    )
    return bool(rows and rows[0]["deleted"] > 0)


# ─────────────────────────────────────────────────────────────────────────────
# VICTIMS
# ─────────────────────────────────────────────────────────────────────────────

def get_all_victims() -> List[Dict[str, Any]]:
    """Return all Victim nodes."""
    rows = _run("MATCH (v:Victim) RETURN v {.*} AS victim ORDER BY v.name")
    return [r["victim"] for r in rows]


def get_victim_by_id(victim_id: str) -> Optional[Dict[str, Any]]:
    """Return a single Victim with their linked case."""
    rows = _run(
        "MATCH (v:Victim {victimId: $vid}) "
        "OPTIONAL MATCH (c)-[:HAS_VICTIM]->(v) "
        "RETURN v {.*, caseId: c.caseId} AS victim",
        {"vid": victim_id},
    )
    row = _first(rows)
    return row["victim"] if row else None


def create_victim(data: Dict[str, Any]) -> Dict[str, Any]:
    """Create a Victim node and link to its case."""
    case_id = data.get("caseId")
    rows = _run(
        "MERGE (v:Victim {victimId: $victimId}) "
        "SET v += $props "
        "RETURN v {.*} AS victim",
        {"victimId": data["victimId"], "props": data},
    )
    if case_id:
        _run(
            "MATCH (ic) WHERE (ic:Case OR ic:InvestigationCase) AND ic.caseId = $cid "
            "MATCH (v:Victim {victimId: $vid}) "
            "MERGE (ic)-[:HAS_VICTIM]->(v)",
            {"cid": case_id, "vid": data["victimId"]},
        )
    return rows[0]["victim"]


def update_victim(victim_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update a Victim node."""
    rows = _run(
        "MATCH (v:Victim {victimId: $vid}) "
        "SET v += $props "
        "RETURN v {.*} AS victim",
        {"vid": victim_id, "props": data},
    )
    row = _first(rows)
    return row["victim"] if row else None


def delete_victim(victim_id: str) -> bool:
    """Delete a Victim node."""
    rows = _run(
        "MATCH (v:Victim {victimId: $vid}) "
        "DETACH DELETE v "
        "RETURN count(v) AS deleted",
        {"vid": victim_id},
    )
    return bool(rows and rows[0]["deleted"] > 0)


# ─────────────────────────────────────────────────────────────────────────────
# CASES  (InvestigationCase / Case — both labels are supported)
# ─────────────────────────────────────────────────────────────────────────────

def get_all_cases(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    assigned_officer_id: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """Return all case nodes with optional status, priority, or officer filters."""
    filters: List[str] = []
    params: Dict[str, Any] = {}
    if status:
        filters.append("(ic.status = $status OR ic.caseStatus = $status)")
        params["status"] = status
    if priority:
        filters.append("ic.priority = $priority")
        params["priority"] = priority
    if assigned_officer_id:
        filters.append(
            "(EXISTS { MATCH (ic)-[:ASSIGNED_TO]->(:Officer {officerId: $oid}) } "
            "OR EXISTS { MATCH (:Officer {officerId: $oid})-[:ASSIGNED_TO]->(ic) })"
        )
        params["oid"] = assigned_officer_id

    where = (" WHERE " + " AND ".join(filters)) if filters else ""
    rows = _run(
        f"MATCH (ic) WHERE (ic:InvestigationCase OR ic:Case){where} "
        "RETURN ic {.*} AS case ORDER BY ic.openedDate DESC",
        params,
    )
    return [r["case"] for r in rows]


def get_case_by_id(case_id: str) -> Optional[Dict[str, Any]]:
    """Return a single case node by caseId."""
    rows = _run(
        "MATCH (ic) "
        "WHERE (ic:InvestigationCase OR ic:Case) AND ic.caseId = $cid "
        "RETURN ic {.*} AS case",
        {"cid": case_id},
    )
    row = _first(rows)
    return row["case"] if row else None


def create_case(data: Dict[str, Any]) -> Dict[str, Any]:
    """MERGE an InvestigationCase node."""
    rows = _run(
        "MERGE (ic:InvestigationCase {caseId: $caseId}) "
        "SET ic += $props "
        "RETURN ic {.*} AS case",
        {"caseId": data["caseId"], "props": data},
    )
    return rows[0]["case"]


def update_case(case_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update a case node."""
    rows = _run(
        "MATCH (ic) "
        "WHERE (ic:InvestigationCase OR ic:Case) AND ic.caseId = $cid "
        "SET ic += $props "
        "RETURN ic {.*} AS case",
        {"cid": case_id, "props": data},
    )
    row = _first(rows)
    return row["case"] if row else None


def delete_case(case_id: str) -> bool:
    """Delete a case node and all its relationships."""
    rows = _run(
        "MATCH (ic) "
        "WHERE (ic:InvestigationCase OR ic:Case) AND ic.caseId = $cid "
        "DETACH DELETE ic "
        "RETURN count(ic) AS deleted",
        {"cid": case_id},
    )
    return bool(rows and rows[0]["deleted"] > 0)


def get_case_detail(case_id: str) -> Optional[Dict[str, Any]]:
    """
    Full graph traversal returning all nodes linked to a case:
    Officers, FIR, Crime, Criminals, Victims, Evidence, Arrests,
    Courts, and Properties.
    """
    rows = _run(
        "MATCH (ic) "
        "WHERE (ic:InvestigationCase OR ic:Case) AND ic.caseId = $cid "
        "OPTIONAL MATCH (ic)-[:ASSIGNED_TO]->(o1:Officer) "
        "OPTIONAL MATCH (o2:Officer)-[:ASSIGNED_TO]->(ic) "
        "OPTIONAL MATCH (f:FIR)-[:LINKED_TO]->(ic) "
        "OPTIONAL MATCH (ic)-[:INVOLVES_CRIME]->(cr:Crime) "
        "OPTIONAL MATCH (f)-[:REPORTS]->(cr2:Crime) "
        "OPTIONAL MATCH (ic)-[:HAS_CRIMINAL]->(crim1:Criminal) "
        "OPTIONAL MATCH (ic)-[:INVOLVES]->(crim2:Criminal) "
        "OPTIONAL MATCH (ic)-[:HAS_VICTIM]->(v:Victim) "
        "OPTIONAL MATCH (ic)-[:HAS_EVIDENCE]->(e:Evidence) "
        "OPTIONAL MATCH (ic)-[:LEADS_TO]->(a:Arrest) "
        "OPTIONAL MATCH (ic)-[:REFERRED_TO]->(ct:Court) "
        "OPTIONAL MATCH (ic)-[:HAS_PROPERTY]->(p:Property) "
        "OPTIONAL MATCH (p)-[:SUBMITTED_TO]->(pct:Court) "
        "RETURN "
        "  ic {.*} AS case, "
        "  collect(DISTINCT o1 {.*}) + collect(DISTINCT o2 {.*}) AS officers, "
        "  f {.*} AS fir, "
        "  CASE WHEN cr IS NOT NULL THEN cr {.*} ELSE cr2 {.*} END AS crime, "
        "  collect(DISTINCT crim1 {.*}) + collect(DISTINCT crim2 {.*}) AS criminals, "
        "  collect(DISTINCT v {.*}) AS victims, "
        "  collect(DISTINCT e {.*}) AS evidence, "
        "  collect(DISTINCT a {.*}) AS arrests, "
        "  collect(DISTINCT ct {.*}) + collect(DISTINCT pct {.*}) AS courts, "
        "  collect(DISTINCT p {.*}) AS properties",
        {"cid": case_id},
    )
    row = _first(rows)
    if not row or row.get("case") is None:
        return None
    return {
        "case": row["case"],
        "officers": [x for x in (row.get("officers") or []) if x],
        "fir": row.get("fir"),
        "crime": row.get("crime"),
        "criminals": [x for x in (row.get("criminals") or []) if x],
        "victims": [x for x in (row.get("victims") or []) if x],
        "evidence": [x for x in (row.get("evidence") or []) if x],
        "arrests": [x for x in (row.get("arrests") or []) if x],
        "courts": [x for x in (row.get("courts") or []) if x],
        "properties": [x for x in (row.get("properties") or []) if x],
    }


def search_cases(
    query: Optional[str] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """Full-text search across case title, description, and caseId."""
    filters: List[str] = []
    params: Dict[str, Any] = {}
    if query:
        filters.append(
            "(toLower(ic.title) CONTAINS toLower($q) "
            "OR toLower(ic.description) CONTAINS toLower($q) "
            "OR toLower(ic.caseId) CONTAINS toLower($q))"
        )
        params["q"] = query
    if status:
        filters.append("ic.status = $status")
        params["status"] = status
    if priority:
        filters.append("ic.priority = $priority")
        params["priority"] = priority
    where = (" WHERE " + " AND ".join(filters)) if filters else ""
    rows = _run(
        f"MATCH (ic) WHERE (ic:InvestigationCase OR ic:Case){where} "
        "RETURN ic {.*} AS case ORDER BY ic.openedDate DESC",
        params,
    )
    return [r["case"] for r in rows]


# ─────────────────────────────────────────────────────────────────────────────
# EVIDENCE
# ─────────────────────────────────────────────────────────────────────────────

def get_all_evidence(
    case_id: Optional[str] = None,
    evidence_type: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """Return all Evidence nodes, optionally filtered by case or type."""
    filters: List[str] = []
    params: Dict[str, Any] = {}
    if case_id:
        filters.append(
            "(e.caseId = $caseId OR "
            "EXISTS { MATCH (c)-[:HAS_EVIDENCE]->(e) WHERE c.caseId = $caseId })"
        )
        params["caseId"] = case_id
    if evidence_type:
        filters.append("toLower(e.evidenceType) CONTAINS toLower($etype)")
        params["etype"] = evidence_type
    where = (" WHERE " + " AND ".join(filters)) if filters else ""
    rows = _run(
        f"MATCH (e:Evidence){where} "
        "RETURN e {{.*}} AS evidence ORDER BY e.collectedDate DESC",
        params,
    )
    return [r["evidence"] for r in rows]


def get_evidence_by_id(evidence_id: str) -> Optional[Dict[str, Any]]:
    """Return a single Evidence item with its linked case."""
    rows = _run(
        "MATCH (e:Evidence {evidenceId: $eid}) "
        "OPTIONAL MATCH (c)-[:HAS_EVIDENCE]->(e) "
        "RETURN e {.*, caseId: c.caseId} AS evidence",
        {"eid": evidence_id},
    )
    row = _first(rows)
    return row["evidence"] if row else None


def create_evidence(data: Dict[str, Any]) -> Dict[str, Any]:
    """Create an Evidence node and link it to its case."""
    case_id = data.get("caseId")
    rows = _run(
        "MERGE (e:Evidence {evidenceId: $evidenceId}) "
        "SET e += $props "
        "RETURN e {.*} AS evidence",
        {"evidenceId": data["evidenceId"], "props": data},
    )
    if case_id:
        _run(
            "MATCH (ic) WHERE (ic:Case OR ic:InvestigationCase) AND ic.caseId = $cid "
            "MATCH (e:Evidence {evidenceId: $eid}) "
            "MERGE (ic)-[:HAS_EVIDENCE]->(e)",
            {"cid": case_id, "eid": data["evidenceId"]},
        )
    return rows[0]["evidence"]


def update_evidence(evidence_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update an Evidence node."""
    rows = _run(
        "MATCH (e:Evidence {evidenceId: $eid}) "
        "SET e += $props "
        "RETURN e {.*} AS evidence",
        {"eid": evidence_id, "props": data},
    )
    row = _first(rows)
    return row["evidence"] if row else None


def delete_evidence(evidence_id: str) -> bool:
    """Delete an Evidence node."""
    rows = _run(
        "MATCH (e:Evidence {evidenceId: $eid}) "
        "DETACH DELETE e "
        "RETURN count(e) AS deleted",
        {"eid": evidence_id},
    )
    return bool(rows and rows[0]["deleted"] > 0)


# ─────────────────────────────────────────────────────────────────────────────
# ARRESTS
# ─────────────────────────────────────────────────────────────────────────────

def get_all_arrests(
    case_id: Optional[str] = None,
    criminal_id: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """Return all Arrest nodes, optionally filtered by case or criminal."""
    filters: List[str] = []
    params: Dict[str, Any] = {}
    if case_id:
        filters.append(
            "EXISTS { MATCH (c)-[:LEADS_TO]->(a) "
            "WHERE (c:Case OR c:InvestigationCase) AND c.caseId = $caseId }"
        )
        params["caseId"] = case_id
    if criminal_id:
        filters.append(
            "EXISTS { MATCH (:Criminal {criminalId: $crimId})-[:ARRESTED_IN]->(a) }"
        )
        params["crimId"] = criminal_id
    where = (" WHERE " + " AND ".join(filters)) if filters else ""
    rows = _run(
        f"MATCH (a:Arrest){where} "
        "RETURN a {{.*}} AS arrest ORDER BY a.arrestDate DESC",
        params,
    )
    return [r["arrest"] for r in rows]


def get_arrest_by_id(arrest_id: str) -> Optional[Dict[str, Any]]:
    """Return a single Arrest node."""
    rows = _run(
        "MATCH (a:Arrest {arrestId: $aid}) RETURN a {.*} AS arrest",
        {"aid": arrest_id},
    )
    row = _first(rows)
    return row["arrest"] if row else None


def create_arrest(data: Dict[str, Any]) -> Dict[str, Any]:
    """Create an Arrest node and link it to its case."""
    case_id = data.pop("caseId", None)
    rows = _run(
        "MERGE (a:Arrest {arrestId: $arrestId}) "
        "SET a += $props "
        "RETURN a {.*} AS arrest",
        {"arrestId": data["arrestId"], "props": data},
    )
    if case_id:
        _run(
            "MATCH (ic) WHERE (ic:Case OR ic:InvestigationCase) AND ic.caseId = $cid "
            "MATCH (a:Arrest {arrestId: $aid}) "
            "MERGE (ic)-[:LEADS_TO]->(a)",
            {"cid": case_id, "aid": data["arrestId"]},
        )
    return rows[0]["arrest"]


def update_arrest(arrest_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update an Arrest node."""
    rows = _run(
        "MATCH (a:Arrest {arrestId: $aid}) "
        "SET a += $props "
        "RETURN a {.*} AS arrest",
        {"aid": arrest_id, "props": data},
    )
    row = _first(rows)
    return row["arrest"] if row else None


def delete_arrest(arrest_id: str) -> bool:
    """Delete an Arrest node."""
    rows = _run(
        "MATCH (a:Arrest {arrestId: $aid}) "
        "DETACH DELETE a "
        "RETURN count(a) AS deleted",
        {"aid": arrest_id},
    )
    return bool(rows and rows[0]["deleted"] > 0)


# ─────────────────────────────────────────────────────────────────────────────
# COURTS
# ─────────────────────────────────────────────────────────────────────────────

def get_all_courts(city: Optional[str] = None) -> List[Dict[str, Any]]:
    """Return all Court nodes, optionally filtered by city or district."""
    if city:
        rows = _run(
            "MATCH (ct:Court) "
            "WHERE toLower(ct.city) CONTAINS toLower($city) "
            "   OR toLower(ct.district) CONTAINS toLower($city) "
            "RETURN ct {.*} AS court ORDER BY ct.courtName",
            {"city": city},
        )
    else:
        rows = _run("MATCH (ct:Court) RETURN ct {.*} AS court ORDER BY ct.courtName")
    return [r["court"] for r in rows]


def get_court_by_id(court_id: str) -> Optional[Dict[str, Any]]:
    """Return a single Court node."""
    rows = _run(
        "MATCH (ct:Court {courtId: $cid}) RETURN ct {.*} AS court",
        {"cid": court_id},
    )
    row = _first(rows)
    return row["court"] if row else None


def create_court(data: Dict[str, Any]) -> Dict[str, Any]:
    """MERGE a Court node."""
    rows = _run(
        "MERGE (ct:Court {courtId: $courtId}) "
        "SET ct += $props "
        "RETURN ct {.*} AS court",
        {"courtId": data["courtId"], "props": data},
    )
    return rows[0]["court"]


def update_court(court_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update a Court node."""
    rows = _run(
        "MATCH (ct:Court {courtId: $cid}) "
        "SET ct += $props "
        "RETURN ct {.*} AS court",
        {"cid": court_id, "props": data},
    )
    row = _first(rows)
    return row["court"] if row else None


def delete_court(court_id: str) -> bool:
    """Delete a Court node."""
    rows = _run(
        "MATCH (ct:Court {courtId: $cid}) "
        "DETACH DELETE ct "
        "RETURN count(ct) AS deleted",
        {"cid": court_id},
    )
    return bool(rows and rows[0]["deleted"] > 0)


# ─────────────────────────────────────────────────────────────────────────────
# DASHBOARD ANALYTICS
# ─────────────────────────────────────────────────────────────────────────────

def get_dashboard_stats() -> Dict[str, Any]:
    """
    Return aggregated counts and breakdown charts.
    Uses a single chained Cypher for efficiency.
    """
    counts = _run(
        "MATCH (s:PoliceStation) WITH count(s) AS stations "
        "MATCH (o:Officer)       WITH stations, count(o) AS officers "
        "MATCH (f:FIR)           WITH stations, officers, count(f) AS firs "
        "MATCH (c:Crime)         WITH stations, officers, firs, count(c) AS crimes "
        "MATCH (cr:Criminal)     WITH stations, officers, firs, crimes, count(cr) AS criminals "
        "MATCH (v:Victim)        WITH stations, officers, firs, crimes, criminals, count(v) AS victims "
        "MATCH (e:Evidence)      WITH stations, officers, firs, crimes, criminals, victims, count(e) AS evidence "
        "MATCH (a:Arrest)        WITH stations, officers, firs, crimes, criminals, victims, evidence, count(a) AS arrests "
        "MATCH (ic) WHERE ic:InvestigationCase OR ic:Case "
        "RETURN stations, officers, firs, crimes, criminals, victims, "
        "       evidence, arrests, count(ic) AS cases"
    )
    crime_types = _run(
        "MATCH (c:Crime) "
        "RETURN c.crimeType AS type, count(c) AS count "
        "ORDER BY count DESC"
    )
    case_status = _run(
        "MATCH (ic) WHERE ic:InvestigationCase OR ic:Case "
        "RETURN coalesce(ic.status, ic.caseStatus, 'Unknown') AS status, "
        "       count(ic) AS count"
    )
    fir_status = _run(
        "MATCH (f:FIR) RETURN f.status AS status, count(f) AS count"
    )
    base = counts[0] if counts else {}
    return {
        "totalStations": base.get("stations", 0),
        "totalOfficers": base.get("officers", 0),
        "totalFIRs": base.get("firs", 0),
        "totalCrimes": base.get("crimes", 0),
        "totalCriminals": base.get("criminals", 0),
        "totalVictims": base.get("victims", 0),
        "totalEvidence": base.get("evidence", 0),
        "totalArrests": base.get("arrests", 0),
        "totalCases": base.get("cases", 0),
        "crimeTypeBreakdown": crime_types,
        "caseStatusBreakdown": case_status,
        "firStatusBreakdown": fir_status,
    }


# ─────────────────────────────────────────────────────────────────────────────
# GLOBAL SEARCH
# ─────────────────────────────────────────────────────────────────────────────

def search_global(query: str) -> Dict[str, Any]:
    """
    Cross-entity keyword search across Stations, Officers, Crimes,
    Criminals, Victims, and Cases. Returns up to 10 results per entity.
    """
    q = query.strip()
    stations = _run(
        "MATCH (s:PoliceStation) "
        "WHERE toLower(s.stationName) CONTAINS toLower($q) "
        "   OR toLower(s.city) CONTAINS toLower($q) "
        "   OR toLower(s.district) CONTAINS toLower($q) "
        "RETURN s {.*} AS item LIMIT 10",
        {"q": q},
    )
    officers = _run(
        "MATCH (o:Officer) "
        "WHERE toLower(o.officerName) CONTAINS toLower($q) "
        "   OR toLower(o.rank) CONTAINS toLower($q) "
        "RETURN o {.*} AS item LIMIT 10",
        {"q": q},
    )
    crimes = _run(
        "MATCH (c:Crime) "
        "WHERE toLower(c.crimeType) CONTAINS toLower($q) "
        "   OR toLower(c.location) CONTAINS toLower($q) "
        "   OR toLower(c.crimeHead) CONTAINS toLower($q) "
        "   OR toLower(c.ipcSection) CONTAINS toLower($q) "
        "RETURN c {.*} AS item LIMIT 10",
        {"q": q},
    )
    criminals = _run(
        "MATCH (cr:Criminal) "
        "WHERE toLower(cr.name) CONTAINS toLower($q) "
        "   OR toLower(cr.occupation) CONTAINS toLower($q) "
        "RETURN cr {.*} AS item LIMIT 10",
        {"q": q},
    )
    victims = _run(
        "MATCH (v:Victim) "
        "WHERE toLower(v.name) CONTAINS toLower($q) "
        "   OR toLower(v.injuryType) CONTAINS toLower($q) "
        "RETURN v {.*} AS item LIMIT 10",
        {"q": q},
    )
    cases = _run(
        "MATCH (ic) WHERE (ic:InvestigationCase OR ic:Case) "
        "AND (toLower(ic.title) CONTAINS toLower($q) "
        "  OR toLower(ic.description) CONTAINS toLower($q) "
        "  OR toLower(ic.caseId) CONTAINS toLower($q)) "
        "RETURN ic {.*} AS item LIMIT 10",
        {"q": q},
    )
    return {
        "query": q,
        "stations": [r["item"] for r in stations],
        "officers": [r["item"] for r in officers],
        "crimes": [r["item"] for r in crimes],
        "criminals": [r["item"] for r in criminals],
        "victims": [r["item"] for r in victims],
        "cases": [r["item"] for r in cases],
    }
