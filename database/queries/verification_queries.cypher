// ============================================================
// Verification Queries — Police Crime Management System
// ============================================================
// Run these AFTER seed_data.cypher to verify data integrity.
// ============================================================

// ------------------------------------------------------------
// V1: Node counts per label
// ------------------------------------------------------------
MATCH (n)
RETURN labels(n)[0] AS nodeType, count(n) AS count
ORDER BY nodeType;

// Expected result:
// Arrest             | 4
// Court              | 3
// Crime              | 6
// Criminal           | 5
// Evidence           | 6
// FIR                | 6
// InvestigationCase  | 5
// Officer            | 8
// PoliceStation      | 5
// Victim             | 5

// ------------------------------------------------------------
// V2: Total relationship count
// ------------------------------------------------------------
MATCH ()-[r]->()
RETURN type(r) AS relType, count(r) AS count
ORDER BY relType;

// Expected relationship types:
// ARRESTED, ASSIGNED_TO, HAS_EVIDENCE, HAS_VICTIM,
// INVOLVES, LEADS_TO, LINKED_TO, MADE_BY,
// REFERRED_TO, REGISTERS, REPORTS, WORKS_AT

// ------------------------------------------------------------
// V3: Constraint check — verify uniqueness
// ------------------------------------------------------------
SHOW CONSTRAINTS;

// Should list constraints for all 12 unique fields.

// ------------------------------------------------------------
// V4: Index check
// ------------------------------------------------------------
SHOW INDEXES;

// Should list indexes for status, priority, rank, crimeType, name.

// ------------------------------------------------------------
// V5: Sample connected record — Case 1 full graph
// ------------------------------------------------------------
MATCH (ic:InvestigationCase {caseId: "CASE001"})
OPTIONAL MATCH (ic)-[:ASSIGNED_TO]->(o:Officer)
OPTIONAL MATCH (fir:FIR)-[:LINKED_TO]->(ic)
OPTIONAL MATCH (ic)-[:INVOLVES]->(crim:Criminal)
OPTIONAL MATCH (ic)-[:HAS_VICTIM]->(v:Victim)
OPTIONAL MATCH (ic)-[:HAS_EVIDENCE]->(ev:Evidence)
RETURN ic.title, o.name AS officer,
       fir.firNumber AS fir,
       collect(DISTINCT crim.name) AS criminals,
       collect(DISTINCT v.name) AS victims,
       collect(DISTINCT ev.evidenceType) AS evidence;

// Expected: Sitabuldi Bank Robbery case with Inspector Rajesh,
// FIR/2024/001, two criminals (Vijay, Meena), one victim (Ramesh),
// two evidence items (CCTV Footage, Fingerprint).

// ------------------------------------------------------------
// V6: Orphan check — nodes without any relationships
// ------------------------------------------------------------
MATCH (n)
WHERE NOT (n)-[]-()
RETURN labels(n)[0] AS label, n AS orphanNode;

// Should return empty. All seed nodes have at least one relationship.

// ------------------------------------------------------------
// V7: Officer to station mapping
// ------------------------------------------------------------
MATCH (o:Officer)-[:WORKS_AT]->(ps:PoliceStation)
RETURN o.name, o.rank, ps.name AS station
ORDER BY ps.name, o.rank;

// Should show all 8 officers assigned to stations.

// ------------------------------------------------------------
// V8: Multi-hop path verification (3 hops)
// ------------------------------------------------------------
MATCH path =
  (ps:PoliceStation)<-[:WORKS_AT]-(o:Officer)
  -[:REGISTERS]->(fir:FIR)
  -[:LINKED_TO]->(ic:InvestigationCase)
RETURN ps.name, o.name, fir.firNumber, ic.title
ORDER BY ps.name;

// Should show connected chains for all linked FIRs.

// ------------------------------------------------------------
// V9: Criminal involvement count
// ------------------------------------------------------------
MATCH (crim:Criminal)
OPTIONAL MATCH (ic:InvestigationCase)-[:INVOLVES]->(crim)
RETURN crim.name AS criminal,
       count(ic) AS caseCount
ORDER BY caseCount DESC;

// CRM002 (Meena Bai) should appear in 2 cases.

// ------------------------------------------------------------
// V10: Data quality — FIRs without linked cases
// ------------------------------------------------------------
MATCH (fir:FIR)
WHERE NOT (fir)-[:LINKED_TO]->(:InvestigationCase)
RETURN fir.firId, fir.firNumber AS unlinkedFIRs;

// FIR004 (vehicle theft) should appear — it was closed without a case.

// ============================================================
// END OF VERIFICATION QUERIES
// ============================================================
