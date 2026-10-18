// ============================================================
// Neo4j Schema — Police Crime Management System
// ============================================================
// Run these commands in Neo4j Browser or AuraDB Query Editor
// to set up constraints and indexes.
// Edition: Neo4j AuraDB Free (Community-compatible constraints)
//
// HOW TO USE:
// 1. Open Neo4j AuraDB console → Open with Browser
// 2. Paste each block and click Run (▶)
// ============================================================

// ============================================================
// PART 1: CONSTRAINTS (Uniqueness)
// ============================================================

CREATE CONSTRAINT station_id_unique IF NOT EXISTS
  FOR (s:PoliceStation) REQUIRE s.stationId IS UNIQUE;

CREATE CONSTRAINT officer_id_unique IF NOT EXISTS
  FOR (o:Officer) REQUIRE o.officerId IS UNIQUE;

CREATE CONSTRAINT officer_badge_unique IF NOT EXISTS
  FOR (o:Officer) REQUIRE o.badgeNumber IS UNIQUE;

CREATE CONSTRAINT fir_id_unique IF NOT EXISTS
  FOR (f:FIR) REQUIRE f.firId IS UNIQUE;

CREATE CONSTRAINT fir_number_unique IF NOT EXISTS
  FOR (f:FIR) REQUIRE f.firNumber IS UNIQUE;

CREATE CONSTRAINT crime_id_unique IF NOT EXISTS
  FOR (c:Crime) REQUIRE c.crimeId IS UNIQUE;

CREATE CONSTRAINT criminal_id_unique IF NOT EXISTS
  FOR (cr:Criminal) REQUIRE cr.criminalId IS UNIQUE;

CREATE CONSTRAINT victim_id_unique IF NOT EXISTS
  FOR (v:Victim) REQUIRE v.victimId IS UNIQUE;

CREATE CONSTRAINT case_id_unique IF NOT EXISTS
  FOR (ic:InvestigationCase) REQUIRE ic.caseId IS UNIQUE;

CREATE CONSTRAINT evidence_id_unique IF NOT EXISTS
  FOR (e:Evidence) REQUIRE e.evidenceId IS UNIQUE;

CREATE CONSTRAINT arrest_id_unique IF NOT EXISTS
  FOR (a:Arrest) REQUIRE a.arrestId IS UNIQUE;

CREATE CONSTRAINT court_id_unique IF NOT EXISTS
  FOR (ct:Court) REQUIRE ct.courtId IS UNIQUE;

// ============================================================
// PART 2: INDEXES (For Fast Lookups)
// ============================================================

CREATE INDEX fir_status_index IF NOT EXISTS
  FOR (f:FIR) ON (f.status);

CREATE INDEX case_status_index IF NOT EXISTS
  FOR (ic:InvestigationCase) ON (ic.status);

CREATE INDEX case_priority_index IF NOT EXISTS
  FOR (ic:InvestigationCase) ON (ic.priority);

CREATE INDEX officer_rank_index IF NOT EXISTS
  FOR (o:Officer) ON (o.rank);

CREATE INDEX crime_type_index IF NOT EXISTS
  FOR (c:Crime) ON (c.crimeType);

CREATE INDEX criminal_name_index IF NOT EXISTS
  FOR (cr:Criminal) ON (cr.name);

// ============================================================
// PART 3: NODE LABEL DEFINITIONS (Documentation)
// ============================================================
//
// (:PoliceStation)
//   stationId        STRING  UNIQUE  e.g. "PS001"
//   name             STRING          "Central Police Station"
//   location         STRING          Street address
//   city             STRING
//   contactNumber    STRING          Fictional contact
//   officerCount     INTEGER
//
// (:Officer)
//   officerId        STRING  UNIQUE  e.g. "OFF001"
//   name             STRING
//   rank             STRING          Constable/SI/Inspector/DSP/SP
//   badgeNumber      STRING  UNIQUE  e.g. "BDG001"
//   specialization   STRING
//   yearsOfService   INTEGER
//
// (:FIR)
//   firId            STRING  UNIQUE  e.g. "FIR001"
//   firNumber        STRING  UNIQUE  e.g. "FIR/2024/001"
//   registrationDate DATE
//   description      STRING
//   status           STRING          Pending/Under Investigation/Closed
//   complainantName  STRING
//
// (:Crime)
//   crimeId          STRING  UNIQUE  e.g. "CR001"
//   crimeType        STRING          Robbery/Murder/Fraud/Cybercrime/Assault/Theft
//   location         STRING
//   city             STRING
//   date             DATE
//   severity         STRING          Low/Medium/High
//   description      STRING
//
// (:Criminal)
//   criminalId       STRING  UNIQUE  e.g. "CRM001"
//   name             STRING
//   age              INTEGER
//   gender           STRING
//   identifyingDescription STRING
//   knownAliases     STRING
//   criminalHistory  STRING
//
// (:Victim)
//   victimId         STRING  UNIQUE  e.g. "VIC001"
//   name             STRING
//   age              INTEGER
//   gender           STRING
//   contactNumber    STRING          Fictional
//   address          STRING          Fictional
//
// (:InvestigationCase)
//   caseId           STRING  UNIQUE  e.g. "CASE001"
//   title            STRING
//   status           STRING          Open/Under Investigation/Closed/Referred to Court
//   priority         STRING          Low/Medium/High/Critical
//   openedDate       DATE
//   description      STRING
//
// (:Evidence)
//   evidenceId       STRING  UNIQUE  e.g. "EV001"
//   evidenceType     STRING          CCTV/Fingerprint/Weapon/Document/Witness Statement/Digital/Physical
//   description      STRING
//   collectedDate    DATE
//   condition        STRING          Good/Degraded/Damaged
//
// (:Arrest)
//   arrestId         STRING  UNIQUE  e.g. "ARR001"
//   arrestDate       DATE
//   status           STRING          Arrested/Released on Bail/In Custody/Produced in Court
//   charges          STRING
//
// (:Court)
//   courtId          STRING  UNIQUE  e.g. "CRT001"
//   name             STRING
//   location         STRING
//   city             STRING
//   courtType        STRING          Sessions Court/High Court/Magistrate Court
//   judgeAssigned    STRING

// ============================================================
// PART 4: RELATIONSHIP DEFINITIONS (Documentation)
// ============================================================
//
// (Officer)-[:WORKS_AT]->(PoliceStation)
//   Properties: joinedDate
//
// (Officer)-[:REGISTERS]->(FIR)
//   Properties: registeredOn
//
// (FIR)-[:REPORTS]->(Crime)
//   (The FIR documents a specific crime incident)
//
// (FIR)-[:LINKED_TO]->(InvestigationCase)
//   (A case is opened based on a FIR)
//
// (InvestigationCase)-[:ASSIGNED_TO]->(Officer)
//   Properties: assignedOn
//
// (InvestigationCase)-[:INVOLVES]->(Criminal)
//   Properties: role (PrimaryAccused/Accomplice/Suspect)
//
// (InvestigationCase)-[:HAS_VICTIM]->(Victim)
//   Properties: victimStatement (brief)
//
// (InvestigationCase)-[:HAS_EVIDENCE]->(Evidence)
//   Properties: submittedBy (officer name)
//
// (InvestigationCase)-[:LEADS_TO]->(Arrest)
//   (Investigation leads to an arrest)
//
// (InvestigationCase)-[:REFERRED_TO]->(Court)
//   Properties: referralDate, hearingDate
//
