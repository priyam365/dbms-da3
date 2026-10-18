// ============================================================
// Useful Cypher Queries — Police Crime Management System
// ============================================================
// Run individual queries in Neo4j Browser.
// Parameterized versions are used in the FastAPI backend.
// ============================================================

// ------------------------------------------------------------
// QUERY 1: CREATE — Register a new FIR (parameterized form)
// ------------------------------------------------------------
// Purpose: Create a new FIR node with a stable unique ID.
// In FastAPI, $firId, $firNumber etc. are passed as parameters.

CREATE (f:FIR {
  firId: "FIR007",
  firNumber: "FIR/2024/007",
  registrationDate: "2024-07-15",
  description: "Complaint regarding house break-in during owner absence.",
  status: "Pending",
  complainantName: "Fictional Complainant Name"
})
RETURN f;

// ------------------------------------------------------------
// QUERY 2: MERGE — Idempotent station upsert
// ------------------------------------------------------------
// Purpose: Create a node only if it doesn't already exist.
// Safe to re-run.

MERGE (ps:PoliceStation {stationId: "PS006"})
SET ps.name = "South Division Police Station",
    ps.location = "14, Station Road",
    ps.city = "Nagpur",
    ps.contactNumber = "0712-XXXXXXX",
    ps.officerCount = 18
RETURN ps;

// ------------------------------------------------------------
// QUERY 3: MATCH — Get all open investigation cases
// ------------------------------------------------------------
// Purpose: View cases with Open status.

MATCH (ic:InvestigationCase)
WHERE ic.status = "Open"
RETURN ic.caseId, ic.title, ic.priority, ic.openedDate
ORDER BY ic.priority DESC, ic.openedDate ASC;

// ------------------------------------------------------------
// QUERY 4: MATCH with WHERE — Filter by priority and status
// ------------------------------------------------------------
// Purpose: Find critical cases not yet resolved.

MATCH (ic:InvestigationCase)
WHERE ic.status IN ["Open", "Under Investigation"]
  AND ic.priority = "Critical"
RETURN ic.caseId, ic.title, ic.status, ic.openedDate
ORDER BY ic.openedDate;

// ------------------------------------------------------------
// QUERY 5: SET — Update a case status
// ------------------------------------------------------------
// Purpose: Advance a case from Open to Under Investigation.
// WARNING: This modifies data. Parameterize in production.

MATCH (ic:InvestigationCase {caseId: "CASE003"})
SET ic.status = "Under Investigation"
RETURN ic.caseId, ic.title, ic.status;

// ------------------------------------------------------------
// QUERY 6: SAFE DELETE — Remove a node with no relationships
// ------------------------------------------------------------
// Purpose: Delete a node only if it has no relationships.
// CAUTION: This deletes data permanently. Always confirm first.

// Check before deleting:
MATCH (f:FIR {firId: "FIR007"})
OPTIONAL MATCH (f)-[r]-()
RETURN f.firId, count(r) AS relCount;
// Only delete if relCount = 0:
// MATCH (f:FIR {firId: "FIR007"}) WHERE NOT (f)-[]-() DELETE f;

// ------------------------------------------------------------
// QUERY 7: DETACH DELETE — Remove a node and all its relations
// ------------------------------------------------------------
// CAUTION: This permanently deletes the node and ALL its
// relationships. Use only for cleanup/testing. Always use
// parameterized IDs and confirm with user first.

// MATCH (f:FIR {firId: "FIR007"}) DETACH DELETE f;
// (Commented out for safety — uncomment only when needed)

// ------------------------------------------------------------
// QUERY 8: ORDER BY and LIMIT — Top 3 critical cases
// ------------------------------------------------------------
// Purpose: Paginated listing of high-priority cases.

MATCH (ic:InvestigationCase)
RETURN ic.caseId, ic.title, ic.status, ic.priority
ORDER BY
  CASE ic.priority
    WHEN "Critical" THEN 1
    WHEN "High" THEN 2
    WHEN "Medium" THEN 3
    ELSE 4
  END ASC,
  ic.openedDate ASC
LIMIT 3;

// ------------------------------------------------------------
// QUERY 9: COUNT and Aggregation — Cases per status
// ------------------------------------------------------------
// Purpose: Dashboard statistics — case count grouped by status.

MATCH (ic:InvestigationCase)
RETURN ic.status AS status, count(ic) AS total
ORDER BY total DESC;

// ------------------------------------------------------------
// QUERY 10: COLLECT — Officers and their assigned cases
// ------------------------------------------------------------
// Purpose: For each officer, list all their assigned cases.

MATCH (ic:InvestigationCase)-[:ASSIGNED_TO]->(o:Officer)
RETURN o.name AS officer, o.rank,
       collect(ic.caseId + ": " + ic.title) AS cases,
       count(ic) AS caseCount
ORDER BY caseCount DESC;

// ------------------------------------------------------------
// QUERY 11: OPTIONAL MATCH — Cases with or without evidence
// ------------------------------------------------------------
// Purpose: Find cases and optionally show linked evidence.
// OPTIONAL MATCH returns null for cases with no evidence.

MATCH (ic:InvestigationCase)
OPTIONAL MATCH (ic)-[:HAS_EVIDENCE]->(ev:Evidence)
RETURN ic.caseId, ic.title, ev.evidenceId, ev.evidenceType
ORDER BY ic.caseId;

// ------------------------------------------------------------
// QUERY 12: Multi-hop traversal — FIR → Case → Officer → Station
// ------------------------------------------------------------
// Purpose: Full graph path from FIR through case chain.
// Shows how graph traversal naturally follows relationships.

MATCH path =
  (fir:FIR)-[:LINKED_TO]->(ic:InvestigationCase)
            -[:ASSIGNED_TO]->(o:Officer)
            -[:WORKS_AT]->(ps:PoliceStation)
RETURN fir.firNumber, ic.title, o.name, ps.name
ORDER BY fir.firNumber;

// ------------------------------------------------------------
// QUERY 13: All cases involving a specific criminal
// ------------------------------------------------------------
// Purpose: Investigate all cases tied to a criminal record.
// Replace "CRM002" with the target criminal ID.

MATCH (ic:InvestigationCase)-[:INVOLVES]->(crim:Criminal {criminalId: "CRM002"})
OPTIONAL MATCH (ic)-[:ASSIGNED_TO]->(o:Officer)
RETURN ic.caseId, ic.title, ic.status,
       crim.name AS criminal, o.name AS officer
ORDER BY ic.openedDate;

// ------------------------------------------------------------
// QUERY 14: Cases sharing a criminal (linked cases)
// ------------------------------------------------------------
// Purpose: Identify two cases connected through a shared criminal.
// Key neo4j strength: multi-hop graph pattern matching.

MATCH (ic1:InvestigationCase)-[:INVOLVES]->(crim:Criminal)
      <-[:INVOLVES]-(ic2:InvestigationCase)
WHERE ic1.caseId < ic2.caseId
RETURN ic1.title AS case1, ic2.title AS case2,
       crim.name AS sharedCriminal
ORDER BY crim.name;

// ------------------------------------------------------------
// QUERY 15: Cases sharing evidence
// ------------------------------------------------------------
// Purpose: Detect evidence used across multiple cases.

MATCH (ic1:InvestigationCase)-[:HAS_EVIDENCE]->(ev:Evidence)
      <-[:HAS_EVIDENCE]-(ic2:InvestigationCase)
WHERE ic1.caseId < ic2.caseId
RETURN ic1.title AS case1, ic2.title AS case2,
       ev.evidenceType AS sharedEvidence;

// ------------------------------------------------------------
// QUERY 16: FIRs at a station through its officers
// ------------------------------------------------------------
// Purpose: Find all FIRs connected to a station through officers.
// Demonstrates 2-hop path: Station ← Officer → FIR

MATCH (ps:PoliceStation {stationId: "PS001"})
      <-[:WORKS_AT]-(o:Officer)
      -[:REGISTERS]->(fir:FIR)
RETURN ps.name AS station, o.name AS officer,
       fir.firNumber, fir.status
ORDER BY fir.registrationDate;

// ------------------------------------------------------------
// QUERY 17: Cases referred to a specific court
// ------------------------------------------------------------
// Purpose: Court case load query.

MATCH (ic:InvestigationCase)-[r:REFERRED_TO]->(ct:Court)
RETURN ct.name AS court, ic.caseId, ic.title,
       r.referralDate, r.hearingDate
ORDER BY r.hearingDate;

// ------------------------------------------------------------
// QUERY 18: Cases by crime type and severity
// ------------------------------------------------------------
// Purpose: Filter crimes by type and severity.

MATCH (fir:FIR)-[:REPORTS]->(cr:Crime)
      <-[:REPORTS]-(fir2:FIR)-[:LINKED_TO]->(ic:InvestigationCase)
WHERE cr.severity = "High"
RETURN cr.crimeType, ic.caseId, ic.title, ic.status
ORDER BY cr.crimeType;

// Simpler version:
MATCH (fir:FIR)-[:LINKED_TO]->(ic:InvestigationCase)
MATCH (fir)-[:REPORTS]->(cr:Crime)
WHERE cr.severity IN ["High"]
RETURN cr.crimeType, cr.severity, ic.caseId, ic.title, ic.status;

// ------------------------------------------------------------
// QUERY 19: Entities with missing optional relationships
// ------------------------------------------------------------
// Purpose: Data quality check — find officers not assigned to any case.

MATCH (o:Officer)
WHERE NOT (o)<-[:ASSIGNED_TO]-(:InvestigationCase)
RETURN o.officerId, o.name, o.rank AS unassignedOfficers;

// Find victims not linked to any case:
MATCH (v:Victim)
WHERE NOT (:InvestigationCase)-[:HAS_VICTIM]->(v)
RETURN v.victimId, v.name AS orphanedVictims;

// ------------------------------------------------------------
// QUERY 20: Full case detail — all connected entities
// ------------------------------------------------------------
// Purpose: Complete case profile view for the frontend.
// Replace "CASE001" with target caseId.

MATCH (ic:InvestigationCase {caseId: "CASE001"})
OPTIONAL MATCH (ic)-[:ASSIGNED_TO]->(o:Officer)-[:WORKS_AT]->(ps:PoliceStation)
OPTIONAL MATCH (fir:FIR)-[:LINKED_TO]->(ic)
OPTIONAL MATCH (fir)-[:REPORTS]->(cr:Crime)
OPTIONAL MATCH (ic)-[:INVOLVES]->(crim:Criminal)
OPTIONAL MATCH (ic)-[:HAS_VICTIM]->(v:Victim)
OPTIONAL MATCH (ic)-[:HAS_EVIDENCE]->(ev:Evidence)
OPTIONAL MATCH (ic)-[:LEADS_TO]->(arr:Arrest)
OPTIONAL MATCH (ic)-[:REFERRED_TO]->(ct:Court)
RETURN
  ic AS investigationCase,
  o.name AS officerName,
  o.rank AS officerRank,
  ps.name AS stationName,
  fir.firNumber,
  cr.crimeType,
  collect(DISTINCT crim.name) AS criminals,
  collect(DISTINCT v.name) AS victims,
  collect(DISTINCT ev.evidenceType) AS evidence,
  collect(DISTINCT arr.status) AS arrests,
  ct.name AS court;
