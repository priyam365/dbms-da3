"""
Seed script — Police Crime Management System
Inserts realistic sample data directly into Neo4j AuraDB.
Run from the project root:
    python database/seed_neo4j.py
"""
from neo4j import GraphDatabase

# ── Connection ──────────────────────────────────────────────────────────────
# Replace with your own Neo4j AuraDB credentials
URI      = "bolt+ssc://<your-instance>.databases.neo4j.io:7687"
USERNAME = "<your-username>"
PASSWORD = "<your-password>"

driver = GraphDatabase.driver(URI, auth=(USERNAME, PASSWORD))

def run(cypher, params=None):
    with driver.session() as s:
        s.run(cypher, parameters=params or {})

def run_read(cypher, params=None):
    with driver.session() as s:
        return [r.data() for r in s.run(cypher, parameters=params or {})]

# ============================================================
# STEP 0: Clear existing data
# ============================================================
print("Clearing existing data...")
run("MATCH (n) DETACH DELETE n")
print("  Done.")

# ============================================================
# STEP 1: Constraints & Indexes
# ============================================================
print("Creating constraints...")
constraints = [
    "CREATE CONSTRAINT IF NOT EXISTS FOR (s:PoliceStation)     REQUIRE s.stationId   IS UNIQUE",
    "CREATE CONSTRAINT IF NOT EXISTS FOR (o:Officer)           REQUIRE o.officerId   IS UNIQUE",
    "CREATE CONSTRAINT IF NOT EXISTS FOR (c:Crime)             REQUIRE c.crimeId     IS UNIQUE",
    "CREATE CONSTRAINT IF NOT EXISTS FOR (f:FIR)               REQUIRE f.firId       IS UNIQUE",
    "CREATE CONSTRAINT IF NOT EXISTS FOR (cr:Criminal)         REQUIRE cr.criminalId IS UNIQUE",
    "CREATE CONSTRAINT IF NOT EXISTS FOR (v:Victim)            REQUIRE v.victimId    IS UNIQUE",
    "CREATE CONSTRAINT IF NOT EXISTS FOR (ic:InvestigationCase) REQUIRE ic.caseId    IS UNIQUE",
    "CREATE CONSTRAINT IF NOT EXISTS FOR (e:Evidence)          REQUIRE e.evidenceId  IS UNIQUE",
    "CREATE CONSTRAINT IF NOT EXISTS FOR (a:Arrest)            REQUIRE a.arrestId    IS UNIQUE",
    "CREATE CONSTRAINT IF NOT EXISTS FOR (ct:Court)            REQUIRE ct.courtId    IS UNIQUE",
    "CREATE CONSTRAINT IF NOT EXISTS FOR (p:Property)          REQUIRE p.propertyId  IS UNIQUE",
]
for c in constraints:
    run(c)
print("  Done.")

# ============================================================
# STEP 2: Police Stations
# ============================================================
print("Inserting Police Stations...")
stations = [
    {"stationId":"PS001","stationName":"Central Police Station","district":"Mumbai City","state":"Maharashtra","city":"Mumbai","pin":"400001","phoneNo":"022-22620111"},
    {"stationId":"PS002","stationName":"Andheri Police Station","district":"Mumbai Suburban","state":"Maharashtra","city":"Mumbai","pin":"400058","phoneNo":"022-26344433"},
    {"stationId":"PS003","stationName":"Lalbazar Police HQ","district":"Kolkata","state":"West Bengal","city":"Kolkata","pin":"700001","phoneNo":"033-22141234"},
    {"stationId":"PS004","stationName":"Connaught Place Station","district":"New Delhi","state":"Delhi","city":"New Delhi","pin":"110001","phoneNo":"011-23417400"},
    {"stationId":"PS005","stationName":"Bangalore Central Station","district":"Bengaluru Urban","state":"Karnataka","city":"Bengaluru","pin":"560001","phoneNo":"080-22942222"},
]
for s in stations:
    run("MERGE (s:PoliceStation {stationId:$stationId}) SET s += $props", {"stationId":s["stationId"],"props":s})
print(f"  {len(stations)} stations inserted.")

# ============================================================
# STEP 3: Courts
# ============================================================
print("Inserting Courts...")
courts = [
    {"courtId":"CT001","courtName":"City Sessions Court Mumbai","courtType":"Sessions Court","district":"Mumbai City","state":"Maharashtra"},
    {"courtId":"CT002","courtName":"Kolkata High Court","courtType":"High Court","district":"Kolkata","state":"West Bengal"},
    {"courtId":"CT003","courtName":"Patiala House Courts","courtType":"District Court","district":"New Delhi","state":"Delhi"},
    {"courtId":"CT004","courtName":"City Civil and Sessions Court Bengaluru","courtType":"Sessions Court","district":"Bengaluru Urban","state":"Karnataka"},
]
for c in courts:
    run("MERGE (ct:Court {courtId:$courtId}) SET ct += $props", {"courtId":c["courtId"],"props":c})
print(f"  {len(courts)} courts inserted.")

# ============================================================
# STEP 4: Officers
# ============================================================
print("Inserting Officers...")
officers = [
    {"officerId":"OFF001","officerName":"Suresh Kumar","rank":"Inspector","gender":"Male","joiningDate":"2010-06-15","stationId":"PS001"},
    {"officerId":"OFF002","officerName":"Priya Sharma","rank":"Sub-Inspector","gender":"Female","joiningDate":"2015-03-22","stationId":"PS001"},
    {"officerId":"OFF003","officerName":"Ramesh Patil","rank":"DSP","gender":"Male","joiningDate":"2005-11-01","stationId":"PS002"},
    {"officerId":"OFF004","officerName":"Anita Desai","rank":"Inspector","gender":"Female","joiningDate":"2012-08-10","stationId":"PS003"},
    {"officerId":"OFF005","officerName":"Vikram Singh","rank":"SP","gender":"Male","joiningDate":"2001-04-19","stationId":"PS004"},
    {"officerId":"OFF006","officerName":"Meena Nair","rank":"Constable","gender":"Female","joiningDate":"2020-01-05","stationId":"PS005"},
    {"officerId":"OFF007","officerName":"Arun Joshi","rank":"Inspector","gender":"Male","joiningDate":"2009-09-30","stationId":"PS005"},
]
for o in officers:
    sid = o.pop("stationId")
    run("MERGE (o:Officer {officerId:$officerId}) SET o += $props", {"officerId":o["officerId"],"props":o})
    run(
        "MATCH (o:Officer {officerId:$oid}), (s:PoliceStation {stationId:$sid}) MERGE (o)-[:WORKS_AT]->(s)",
        {"oid":o["officerId"],"sid":sid}
    )
    o["stationId"] = sid
print(f"  {len(officers)} officers inserted.")

# ============================================================
# STEP 5: Crimes
# ============================================================
print("Inserting Crimes...")
crimes = [
    {"crimeId":"CR001","crimeType":"Robbery","crimeHead":"Armed Robbery","ipcSection":"392","occurrenceDate":"2024-01-15","occurrenceTime":"22:30","location":"Marine Drive, Mumbai","severity":"High"},
    {"crimeId":"CR002","crimeType":"Murder","crimeHead":"Homicide","ipcSection":"302","occurrenceDate":"2024-02-20","occurrenceTime":"01:15","location":"Salt Lake, Kolkata","severity":"High"},
    {"crimeId":"CR003","crimeType":"Cybercrime","crimeHead":"Online Banking Fraud","ipcSection":"66C IT Act","occurrenceDate":"2024-03-10","occurrenceTime":"14:00","location":"Connaught Place, Delhi","severity":"Medium"},
    {"crimeId":"CR004","crimeType":"Assault","crimeHead":"Grievous Hurt","ipcSection":"325","occurrenceDate":"2024-04-05","occurrenceTime":"20:00","location":"MG Road, Bengaluru","severity":"Medium"},
    {"crimeId":"CR005","crimeType":"Theft","crimeHead":"Motor Vehicle Theft","ipcSection":"379","occurrenceDate":"2024-05-18","occurrenceTime":"03:00","location":"Andheri West, Mumbai","severity":"Low"},
    {"crimeId":"CR006","crimeType":"Kidnapping","crimeHead":"Abduction for Ransom","ipcSection":"364A","occurrenceDate":"2024-06-01","occurrenceTime":"09:45","location":"Karol Bagh, Delhi","severity":"High"},
    {"crimeId":"CR007","crimeType":"Fraud","crimeHead":"Cheque Dishonour Fraud","ipcSection":"420","occurrenceDate":"2024-07-22","occurrenceTime":"11:00","location":"Koramangala, Bengaluru","severity":"Medium"},
]
for c in crimes:
    run("MERGE (c:Crime {crimeId:$crimeId}) SET c += $props", {"crimeId":c["crimeId"],"props":c})
# Link crimes to stations
crime_station = [("CR001","PS001"),("CR002","PS003"),("CR003","PS004"),("CR004","PS005"),("CR005","PS002"),("CR006","PS004"),("CR007","PS005")]
for cid, sid in crime_station:
    run("MATCH (c:Crime {crimeId:$cid}),(s:PoliceStation {stationId:$sid}) MERGE (c)-[:REPORTED_AT]->(s)", {"cid":cid,"sid":sid})
print(f"  {len(crimes)} crimes inserted.")

# ============================================================
# STEP 6: Criminals
# ============================================================
print("Inserting Criminals...")
criminals = [
    {"criminalId":"CRM001","name":"Raju Bhai","gender":"Male","ageGroup":"31-40","occupation":"Unemployed","habitualOffender":True,"arrestDate":"2024-01-20"},
    {"criminalId":"CRM002","name":"Dinesh Yadav","gender":"Male","ageGroup":"21-30","occupation":"Labourer","habitualOffender":False,"arrestDate":"2024-02-25"},
    {"criminalId":"CRM003","name":"Seema Gupta","gender":"Female","ageGroup":"31-40","occupation":"Business","habitualOffender":True,"arrestDate":"2024-03-15"},
    {"criminalId":"CRM004","name":"Mohit Verma","gender":"Male","ageGroup":"18-20","occupation":"Student","habitualOffender":False,"arrestDate":"2024-04-10"},
    {"criminalId":"CRM005","name":"Karim Sheikh","gender":"Male","ageGroup":"41-50","occupation":"Driver","habitualOffender":True,"arrestDate":"2024-06-05"},
    {"criminalId":"CRM006","name":"Pradeep Nair","gender":"Male","ageGroup":"31-40","occupation":"IT Professional","habitualOffender":False,"arrestDate":"2024-07-28"},
]
for cr in criminals:
    run("MERGE (cr:Criminal {criminalId:$criminalId}) SET cr += $props", {"criminalId":cr["criminalId"],"props":cr})
print(f"  {len(criminals)} criminals inserted.")

# ============================================================
# STEP 7: FIRs
# ============================================================
print("Inserting FIRs...")
firs = [
    {"firId":"FIR001","firNumber":"FIR/2024/001","registrationDate":"2024-01-16","description":"Armed robbery at jewellery shop on Marine Drive. Cash and gold worth 15 lakhs stolen.","status":"Under Investigation","complainantName":"Harish Mehta","officerId":"OFF001"},
    {"firId":"FIR002","firNumber":"FIR/2024/002","registrationDate":"2024-02-21","description":"Body of unknown male found in Salt Lake park. Suspected homicide.","status":"Under Investigation","complainantName":"Local Resident","officerId":"OFF004"},
    {"firId":"FIR003","firNumber":"FIR/2024/003","registrationDate":"2024-03-11","description":"Victim reports unauthorized access to bank account via phishing. Loss of 3.5 lakhs.","status":"Closed","complainantName":"Ritika Arora","officerId":"OFF005"},
    {"firId":"FIR004","firNumber":"FIR/2024/004","registrationDate":"2024-04-06","description":"Bar brawl resulting in grievous hurt. Victim hospitalised with fractures.","status":"Closed","complainantName":"Suresh Bhat","officerId":"OFF007"},
    {"firId":"FIR005","firNumber":"FIR/2024/005","registrationDate":"2024-05-19","description":"Honda City vehicle stolen from parking lot. CCTV footage available.","status":"Pending","complainantName":"Deepak Malhotra","officerId":"OFF003"},
    {"firId":"FIR006","firNumber":"FIR/2024/006","registrationDate":"2024-06-02","description":"Minor child abducted for ransom. Family received ransom call.","status":"Under Investigation","complainantName":"Rakesh Kapoor","officerId":"OFF005"},
    {"firId":"FIR007","firNumber":"FIR/2024/007","registrationDate":"2024-07-23","description":"Business partner issued fraudulent cheques worth 50 lakhs.","status":"Pending","complainantName":"Anjali Reddy","officerId":"OFF007"},
]
for f in firs:
    oid = f.pop("officerId")
    run("MERGE (f:FIR {firId:$firId}) SET f += $props", {"firId":f["firId"],"props":f})
    run("MATCH (o:Officer {officerId:$oid}),(f:FIR {firId:$fid}) MERGE (o)-[:REGISTERS]->(f)", {"oid":oid,"fid":f["firId"]})
print(f"  {len(firs)} FIRs inserted.")

# ============================================================
# STEP 8: Investigation Cases
# ============================================================
print("Inserting Investigation Cases...")
cases = [
    {"caseId":"CASE001","title":"Marine Drive Jewellery Robbery","status":"Under Investigation","priority":"High","openedDate":"2024-01-17","description":"Armed robbery involving 2 assailants. CCTV footage recovered.","caseStatus":"Active","investigationStatus":"Ongoing","chargesheetDate":None,"crimeId":"CR001"},
    {"caseId":"CASE002","title":"Salt Lake Homicide","status":"Under Investigation","priority":"Critical","openedDate":"2024-02-22","description":"Unidentified victim. Forensic analysis ongoing.","caseStatus":"Active","investigationStatus":"Ongoing","chargesheetDate":None,"crimeId":"CR002"},
    {"caseId":"CASE003","title":"Delhi Phishing Fraud","status":"Closed","priority":"Medium","openedDate":"2024-03-12","description":"Online banking fraud traced to mule accounts.","caseStatus":"Closed","investigationStatus":"Completed","chargesheetDate":"2024-05-01","crimeId":"CR003"},
    {"caseId":"CASE004","title":"MG Road Assault","status":"Closed","priority":"Medium","openedDate":"2024-04-07","description":"Bar fight. Accused identified from CCTV.","caseStatus":"Closed","investigationStatus":"Completed","chargesheetDate":"2024-06-15","crimeId":"CR004"},
    {"caseId":"CASE005","title":"Andheri Vehicle Theft","status":"Open","priority":"Low","openedDate":"2024-05-20","description":"Honda City stolen. Tracking via VAHAN database.","caseStatus":"Active","investigationStatus":"Ongoing","chargesheetDate":None,"crimeId":"CR005"},
    {"caseId":"CASE006","title":"Karol Bagh Kidnapping","status":"Under Investigation","priority":"Critical","openedDate":"2024-06-03","description":"Child abduction. Ransom demands received. Special task force deployed.","caseStatus":"Active","investigationStatus":"Ongoing","chargesheetDate":None,"crimeId":"CR006"},
    {"caseId":"CASE007","title":"Bengaluru Cheque Fraud","status":"Open","priority":"Low","openedDate":"2024-07-24","description":"Fraudulent cheques. Bank records subpoenaed.","caseStatus":"Active","investigationStatus":"Ongoing","chargesheetDate":None,"crimeId":"CR007"},
]
for cs in cases:
    crime_id = cs.pop("crimeId")
    run("MERGE (ic:InvestigationCase {caseId:$caseId}) SET ic += $props", {"caseId":cs["caseId"],"props":cs})
    # Link to crime
    run("MATCH (ic:InvestigationCase {caseId:$cid}),(c:Crime {crimeId:$crid}) MERGE (ic)-[:INVOLVES_CRIME]->(c)", {"cid":cs["caseId"],"crid":crime_id})
print(f"  {len(cases)} cases inserted.")

# Link FIRs to Cases
fir_case = [("FIR001","CASE001"),("FIR002","CASE002"),("FIR003","CASE003"),("FIR004","CASE004"),("FIR005","CASE005"),("FIR006","CASE006"),("FIR007","CASE007")]
for fid, cid in fir_case:
    run("MATCH (f:FIR {firId:$fid}),(ic:InvestigationCase {caseId:$cid}) MERGE (f)-[:LINKED_TO]->(ic)", {"fid":fid,"cid":cid})

# Assign officers to cases
case_officer = [
    ("CASE001","OFF001"),("CASE001","OFF002"),
    ("CASE002","OFF004"),
    ("CASE003","OFF005"),
    ("CASE004","OFF007"),
    ("CASE005","OFF003"),
    ("CASE006","OFF005"),("CASE006","OFF001"),
    ("CASE007","OFF007"),
]
for cid, oid in case_officer:
    run(
        "MATCH (ic:InvestigationCase {caseId:$cid}),(o:Officer {officerId:$oid}) MERGE (o)-[:ASSIGNED_TO]->(ic)",
        {"cid":cid,"oid":oid}
    )
print("  Cases linked to FIRs and officers.")

# ============================================================
# STEP 9: Case — Criminal links
# ============================================================
print("Linking Criminals to Cases...")
case_criminal = [
    ("CASE001","CRM001","Primary Accused"),
    ("CASE001","CRM002","Accomplice"),
    ("CASE002","CRM001","Suspect"),
    ("CASE003","CRM003","Primary Accused"),
    ("CASE004","CRM004","Primary Accused"),
    ("CASE005","CRM002","Suspect"),
    ("CASE006","CRM005","Primary Accused"),
    ("CASE007","CRM006","Primary Accused"),
    ("CASE007","CRM003","Accomplice"),
]
for cid, crid, role in case_criminal:
    run(
        "MATCH (ic:InvestigationCase {caseId:$cid}),(cr:Criminal {criminalId:$crid}) "
        "MERGE (ic)-[:HAS_CRIMINAL {role:$role}]->(cr)",
        {"cid":cid,"crid":crid,"role":role}
    )
print(f"  {len(case_criminal)} criminal links created.")

# ============================================================
# STEP 10: Victims
# ============================================================
print("Inserting Victims...")
victims = [
    {"victimId":"VIC001","name":"Harish Mehta","gender":"Male","ageGroup":"41-50","injuryType":"Minor Injury","caseId":"CASE001"},
    {"victimId":"VIC002","name":"Unknown Male","gender":"Male","ageGroup":"31-40","injuryType":"Fatal","caseId":"CASE002"},
    {"victimId":"VIC003","name":"Ritika Arora","gender":"Female","ageGroup":"21-30","injuryType":"No Physical Injury","caseId":"CASE003"},
    {"victimId":"VIC004","name":"Suresh Bhat","gender":"Male","ageGroup":"31-40","injuryType":"Grievous Hurt","caseId":"CASE004"},
    {"victimId":"VIC005","name":"Deepak Malhotra","gender":"Male","ageGroup":"41-50","injuryType":"No Physical Injury","caseId":"CASE005"},
    {"victimId":"VIC006","name":"Aryan Kapoor","gender":"Male","ageGroup":"Under 18","injuryType":"Psychological Trauma","caseId":"CASE006"},
    {"victimId":"VIC007","name":"Anjali Reddy","gender":"Female","ageGroup":"31-40","injuryType":"No Physical Injury","caseId":"CASE007"},
]
for v in victims:
    cid = v.pop("caseId")
    run("MERGE (v:Victim {victimId:$victimId}) SET v += $props", {"victimId":v["victimId"],"props":v})
    run(
        "MATCH (ic:InvestigationCase {caseId:$cid}),(v:Victim {victimId:$vid}) MERGE (ic)-[:HAS_VICTIM]->(v)",
        {"cid":cid,"vid":v["victimId"]}
    )
print(f"  {len(victims)} victims inserted.")

# ============================================================
# STEP 11: Evidence
# ============================================================
print("Inserting Evidence...")
evidence = [
    {"evidenceId":"EV001","evidenceNo":"E001","evidenceType":"CCTV Footage","description":"CCTV recording from nearby ATM showing suspects","collectedDate":"2024-01-17","condition":"Good","caseId":"CASE001"},
    {"evidenceId":"EV002","evidenceNo":"E002","evidenceType":"Weapon","description":"Iron rod used in robbery, blood stained","collectedDate":"2024-01-18","condition":"Good","caseId":"CASE001"},
    {"evidenceId":"EV003","evidenceNo":"E003","evidenceType":"Forensic","description":"Fingerprints lifted from crime scene","collectedDate":"2024-02-22","condition":"Good","caseId":"CASE002"},
    {"evidenceId":"EV004","evidenceNo":"E004","evidenceType":"Digital","description":"Phishing email headers and IP logs","collectedDate":"2024-03-12","condition":"Good","caseId":"CASE003"},
    {"evidenceId":"EV005","evidenceNo":"E005","evidenceType":"Witness Statement","description":"Three witnesses corroborate the assault","collectedDate":"2024-04-07","condition":"Good","caseId":"CASE004"},
    {"evidenceId":"EV006","evidenceNo":"E006","evidenceType":"CCTV Footage","description":"Parking lot CCTV showing vehicle being driven away","collectedDate":"2024-05-20","condition":"Good","caseId":"CASE005"},
    {"evidenceId":"EV007","evidenceNo":"E007","evidenceType":"Digital","description":"Ransom call recording, voice sample","collectedDate":"2024-06-04","condition":"Good","caseId":"CASE006"},
    {"evidenceId":"EV008","evidenceNo":"E008","evidenceType":"Document","description":"Dishonoured cheques with forged signatures","collectedDate":"2024-07-25","condition":"Good","caseId":"CASE007"},
]
for e in evidence:
    cid = e.pop("caseId")
    run("MERGE (e:Evidence {evidenceId:$evidenceId}) SET e += $props", {"evidenceId":e["evidenceId"],"props":e})
    run(
        "MATCH (ic:InvestigationCase {caseId:$cid}),(e:Evidence {evidenceId:$eid}) MERGE (ic)-[:HAS_EVIDENCE]->(e)",
        {"cid":cid,"eid":e["evidenceId"]}
    )
print(f"  {len(evidence)} evidence items inserted.")

# ============================================================
# STEP 12: Property
# ============================================================
print("Inserting Property...")
properties = [
    {"propertyId":"PROP001","propertyType":"Jewellery","propertyStatus":"Stolen","estimatedValue":1500000,"recoveryStatus":"Partially Recovered","caseId":"CASE001","courtId":"CT001"},
    {"propertyId":"PROP002","propertyType":"Weapon","propertyStatus":"Recovered","estimatedValue":500,"recoveryStatus":"Recovered","caseId":"CASE002","courtId":"CT002"},
    {"propertyId":"PROP003","propertyType":"Motor Vehicle","propertyStatus":"Stolen","estimatedValue":850000,"recoveryStatus":"Not Recovered","caseId":"CASE005","courtId":None},
    {"propertyId":"PROP004","propertyType":"Cheque","propertyStatus":"Seized","estimatedValue":5000000,"recoveryStatus":"Seized","caseId":"CASE007","courtId":"CT004"},
]
for p in properties:
    cid = p.pop("caseId")
    court_id = p.pop("courtId")
    run("MERGE (p:Property {propertyId:$propertyId}) SET p += $props", {"propertyId":p["propertyId"],"props":p})
    run(
        "MATCH (ic:InvestigationCase {caseId:$cid}),(p:Property {propertyId:$pid}) MERGE (ic)-[:HAS_PROPERTY]->(p)",
        {"cid":cid,"pid":p["propertyId"]}
    )
    if court_id:
        run(
            "MATCH (p:Property {propertyId:$pid}),(ct:Court {courtId:$cid}) MERGE (p)-[:SUBMITTED_TO]->(ct)",
            {"pid":p["propertyId"],"cid":court_id}
        )
print(f"  {len(properties)} properties inserted.")

# ============================================================
# STEP 13: Arrests
# ============================================================
print("Inserting Arrests...")
arrests = [
    {"arrestId":"ARR001","arrestDate":"2024-01-20","status":"In Custody","charges":"IPC 392 - Robbery","caseId":"CASE001","criminalId":"CRM001"},
    {"arrestId":"ARR002","arrestDate":"2024-01-21","status":"Released on Bail","charges":"IPC 392 - Robbery (Accomplice)","caseId":"CASE001","criminalId":"CRM002"},
    {"arrestId":"ARR003","arrestDate":"2024-03-15","status":"Produced in Court","charges":"Section 66C IT Act - Identity Theft","caseId":"CASE003","criminalId":"CRM003"},
    {"arrestId":"ARR004","arrestDate":"2024-04-10","status":"Released on Bail","charges":"IPC 325 - Grievous Hurt","caseId":"CASE004","criminalId":"CRM004"},
    {"arrestId":"ARR005","arrestDate":"2024-06-05","status":"In Custody","charges":"IPC 364A - Kidnapping for Ransom","caseId":"CASE006","criminalId":"CRM005"},
]
for a in arrests:
    cid = a.pop("caseId")
    crid = a.pop("criminalId")
    run("MERGE (a:Arrest {arrestId:$arrestId}) SET a += $props", {"arrestId":a["arrestId"],"props":a})
    run(
        "MATCH (ic:InvestigationCase {caseId:$cid}),(a:Arrest {arrestId:$aid}) MERGE (ic)-[:LEADS_TO]->(a)",
        {"cid":cid,"aid":a["arrestId"]}
    )
    run(
        "MATCH (cr:Criminal {criminalId:$crid}),(a:Arrest {arrestId:$aid}) MERGE (cr)-[:ARRESTED_IN]->(a)",
        {"crid":crid,"aid":a["arrestId"]}
    )
print(f"  {len(arrests)} arrests inserted.")

# ============================================================
# STEP 14: Court Referrals
# ============================================================
print("Linking Cases to Courts...")
referrals = [
    ("CASE003","CT003","2024-05-01","2024-07-10"),
    ("CASE004","CT004","2024-06-15","2024-08-20"),
    ("CASE001","CT001","2024-08-01","2024-10-05"),
]
for cid, court_id, ref_date, hearing_date in referrals:
    run(
        "MATCH (ic:InvestigationCase {caseId:$cid}),(ct:Court {courtId:$ctid}) "
        "MERGE (ic)-[:REFERRED_TO {referralDate:$ref, hearingDate:$hear}]->(ct)",
        {"cid":cid,"ctid":court_id,"ref":ref_date,"hear":hearing_date}
    )
print(f"  {len(referrals)} court referrals created.")

# ============================================================
# STEP 15: Verify
# ============================================================
print("\n=== VERIFICATION ===")
counts = run_read(
    "MATCH (s:PoliceStation) WITH count(s) AS stations "
    "MATCH (o:Officer)       WITH stations, count(o) AS officers "
    "MATCH (f:FIR)           WITH stations, officers, count(f) AS firs "
    "MATCH (c:Crime)         WITH stations, officers, firs, count(c) AS crimes "
    "MATCH (cr:Criminal)     WITH stations, officers, firs, crimes, count(cr) AS criminals "
    "MATCH (v:Victim)        WITH stations, officers, firs, crimes, criminals, count(v) AS victims "
    "MATCH (e:Evidence)      WITH stations, officers, firs, crimes, criminals, victims, count(e) AS evidence "
    "MATCH (a:Arrest)        WITH stations, officers, firs, crimes, criminals, victims, evidence, count(a) AS arrests "
    "MATCH (ic:InvestigationCase) WITH stations, officers, firs, crimes, criminals, victims, evidence, arrests, count(ic) AS cases "
    "MATCH (ct:Court)        WITH stations, officers, firs, crimes, criminals, victims, evidence, arrests, cases, count(ct) AS courts "
    "MATCH (p:Property)      RETURN stations, officers, firs, crimes, criminals, victims, evidence, arrests, cases, courts, count(p) AS properties"
)
if counts:
    r = counts[0]
    print(f"  PoliceStations : {r['stations']}")
    print(f"  Officers       : {r['officers']}")
    print(f"  Crimes         : {r['crimes']}")
    print(f"  FIRs           : {r['firs']}")
    print(f"  Cases          : {r['cases']}")
    print(f"  Criminals      : {r['criminals']}")
    print(f"  Victims        : {r['victims']}")
    print(f"  Evidence items : {r['evidence']}")
    print(f"  Arrests        : {r['arrests']}")
    print(f"  Courts         : {r['courts']}")
    print(f"  Properties     : {r['properties']}")

rels = run_read("MATCH ()-[r]->() RETURN type(r) AS rel, count(r) AS count ORDER BY count DESC")
print("\n  Relationships:")
for r in rels:
    print(f"    [{r['rel']}]  x{r['count']}")

driver.close()
print("\nSeed complete! Open Neo4j Browser and run: MATCH (n) RETURN n")
