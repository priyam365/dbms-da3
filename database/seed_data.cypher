// ============================================================
// Seed Data — Police Crime Management System
// ALL DATA IS ENTIRELY FICTIONAL FOR ACADEMIC USE ONLY
// ============================================================
// Prerequisites: Run schema.cypher first.
// Safe to re-run: Uses MERGE with stable IDs.
//
// HOW TO USE:
// 1. Open Neo4j AuraDB → Open with Browser
// 2. Paste each section and click Run (▶) in sequence
// ============================================================

// ============================================================
// SECTION 1: POLICE STATIONS
// ============================================================

MERGE (ps1:PoliceStation {stationId: "PS001"})
SET ps1.name = "Central Police Station",
    ps1.location = "12, MG Road, Near Clocktower",
    ps1.city = "Nagpur",
    ps1.contactNumber = "0712-XXXXXXX",
    ps1.officerCount = 45;

MERGE (ps2:PoliceStation {stationId: "PS002"})
SET ps2.name = "East Zone Police Station",
    ps2.location = "45, Subhash Nagar, Ring Road",
    ps2.city = "Nagpur",
    ps2.contactNumber = "0712-XXXXXXX",
    ps2.officerCount = 30;

MERGE (ps3:PoliceStation {stationId: "PS003"})
SET ps3.name = "West Division Police Station",
    ps3.location = "8, Gandhi Marg, Civil Lines",
    ps3.city = "Amravati",
    ps3.contactNumber = "0721-XXXXXXX",
    ps3.officerCount = 28;

MERGE (ps4:PoliceStation {stationId: "PS004"})
SET ps4.name = "Lake City Police Post",
    ps4.location = "22, Bhopal Road, Old City",
    ps4.city = "Bhopal",
    ps4.contactNumber = "0755-XXXXXXX",
    ps4.officerCount = 35;

MERGE (ps5:PoliceStation {stationId: "PS005"})
SET ps5.name = "Northern Range Station",
    ps5.location = "3, Station Road, Cantonment",
    ps5.city = "Jabalpur",
    ps5.contactNumber = "0761-XXXXXXX",
    ps5.officerCount = 22;

// ============================================================
// SECTION 2: OFFICERS
// ============================================================

MERGE (o1:Officer {officerId: "OFF001"})
SET o1.name = "Inspector Rajesh Kumar Verma",
    o1.rank = "Inspector",
    o1.badgeNumber = "BDG001",
    o1.specialization = "Homicide Investigation",
    o1.yearsOfService = 14;

MERGE (o2:Officer {officerId: "OFF002"})
SET o2.name = "Sub-Inspector Priya Sharma",
    o2.rank = "Sub-Inspector",
    o2.badgeNumber = "BDG002",
    o2.specialization = "Cybercrime",
    o2.yearsOfService = 7;

MERGE (o3:Officer {officerId: "OFF003"})
SET o3.name = "DSP Arun Mehta",
    o3.rank = "DSP",
    o3.badgeNumber = "BDG003",
    o3.specialization = "Organized Crime",
    o3.yearsOfService = 22;

MERGE (o4:Officer {officerId: "OFF004"})
SET o4.name = "Constable Suresh Patil",
    o4.rank = "Constable",
    o4.badgeNumber = "BDG004",
    o4.specialization = "General Duties",
    o4.yearsOfService = 3;

MERGE (o5:Officer {officerId: "OFF005"})
SET o5.name = "Sub-Inspector Kavitha Nair",
    o5.rank = "Sub-Inspector",
    o5.badgeNumber = "BDG005",
    o5.specialization = "Financial Fraud",
    o5.yearsOfService = 9;

MERGE (o6:Officer {officerId: "OFF006"})
SET o6.name = "Inspector Deepak Singh",
    o6.rank = "Inspector",
    o6.badgeNumber = "BDG006",
    o6.specialization = "Narcotics",
    o6.yearsOfService = 11;

MERGE (o7:Officer {officerId: "OFF007"})
SET o7.name = "SP Lata Mishra",
    o7.rank = "SP",
    o7.badgeNumber = "BDG007",
    o7.specialization = "Administration",
    o7.yearsOfService = 25;

MERGE (o8:Officer {officerId: "OFF008"})
SET o8.name = "Constable Ravi Tiwari",
    o8.rank = "Constable",
    o8.badgeNumber = "BDG008",
    o8.specialization = "Traffic & Patrol",
    o8.yearsOfService = 5;

// ============================================================
// SECTION 3: CRIMES
// ============================================================

MERGE (cr1:Crime {crimeId: "CR001"})
SET cr1.crimeType = "Armed Robbery",
    cr1.location = "State Bank, Sitabuldi Branch",
    cr1.city = "Nagpur",
    cr1.date = "2024-02-14",
    cr1.severity = "High",
    cr1.description = "Armed robbery of a bank branch during business hours. Two armed individuals held staff and customers.";

MERGE (cr2:Crime {crimeId: "CR002"})
SET cr2.crimeType = "Cybercrime",
    cr2.location = "Online - Victim Residence",
    cr2.city = "Nagpur",
    cr2.date = "2024-03-05",
    cr2.severity = "Medium",
    cr2.description = "Online banking fraud through phishing. Victim received fake bank email and entered credentials on a fraudulent website.";

MERGE (cr3:Crime {crimeId: "CR003"})
SET cr3.crimeType = "Murder",
    cr3.location = "Wardha Road, Near Petrol Pump",
    cr3.city = "Nagpur",
    cr3.date = "2024-01-20",
    cr3.severity = "High",
    cr3.description = "Body of unidentified male found on the roadside. Suspected homicide based on injuries.";

MERGE (cr4:Crime {crimeId: "CR004"})
SET cr4.crimeType = "Vehicle Theft",
    cr4.location = "Dragon Palace Mall Parking",
    cr4.city = "Nagpur",
    cr4.date = "2024-04-10",
    cr4.severity = "Medium",
    cr4.description = "Theft of two-wheeler from a busy mall parking area during evening hours.";

MERGE (cr5:Crime {crimeId: "CR005"})
SET cr5.crimeType = "Drug Trafficking",
    cr5.location = "Railway Station, Platform 3",
    cr5.city = "Bhopal",
    cr5.date = "2024-05-18",
    cr5.severity = "High",
    cr5.description = "Interception of narcotics consignment at railway station. Suspect caught with controlled substances.";

MERGE (cr6:Crime {crimeId: "CR006"})
SET cr6.crimeType = "Assault",
    cr6.location = "Kotwali Market, Main Street",
    cr6.city = "Jabalpur",
    cr6.date = "2024-06-02",
    cr6.severity = "Medium",
    cr6.description = "Physical altercation resulting in grievous injury. Reported by victim at hospital.";

// ============================================================
// SECTION 4: CRIMINALS (ENTIRELY FICTIONAL)
// ============================================================

MERGE (crim1:Criminal {criminalId: "CRM001"})
SET crim1.name = "Vijay alias 'Kalu' Deshpande",
    crim1.age = 32,
    crim1.gender = "Male",
    crim1.identifyingDescription = "Scar on left cheek, tattooed forearm, medium build",
    crim1.knownAliases = "Kalu, VD",
    crim1.criminalHistory = "Previously arrested for theft (2019), released on bail";

MERGE (crim2:Criminal {criminalId: "CRM002"})
SET crim2.name = "Meena Bai Rathore",
    crim2.age = 27,
    crim2.gender = "Female",
    crim2.identifyingDescription = "Short height, distinctive red mole on forehead",
    crim2.knownAliases = "Meena, MR",
    crim2.criminalHistory = "First-time offender, accomplice in fraud case";

MERGE (crim3:Criminal {criminalId: "CRM003"})
SET crim3.name = "Prakash 'Tiger' Kadam",
    crim3.age = 38,
    crim3.gender = "Male",
    crim3.identifyingDescription = "Heavily built, bald, gold tooth",
    crim3.knownAliases = "Tiger, PK",
    crim3.criminalHistory = "Two prior convictions for extortion (2015, 2020)";

MERGE (crim4:Criminal {criminalId: "CRM004"})
SET crim4.name = "Arif Mohammad Shaikh",
    crim4.age = 29,
    crim4.gender = "Male",
    crim4.identifyingDescription = "Slim, bearded, glasses",
    crim4.knownAliases = "Arif, Hacker",
    crim4.criminalHistory = "Suspected in three cybercrime cases, no prior conviction";

MERGE (crim5:Criminal {criminalId: "CRM005"})
SET crim5.name = "Santosh Dilip Jadhav",
    crim5.age = 45,
    crim5.gender = "Male",
    crim5.identifyingDescription = "Tall, grey-haired, limp in right leg",
    crim5.knownAliases = "Seth, SJ",
    crim5.criminalHistory = "Known drug trafficker, arrested 2018, acquitted";

// ============================================================
// SECTION 5: VICTIMS (ENTIRELY FICTIONAL)
// ============================================================

MERGE (v1:Victim {victimId: "VIC001"})
SET v1.name = "Ramesh Shankar Gupta",
    v1.age = 55,
    v1.gender = "Male",
    v1.contactNumber = "98XXXXXX01",
    v1.address = "12, Dharampeth, Nagpur (Fictional)";

MERGE (v2:Victim {victimId: "VIC002"})
SET v2.name = "Sunita Ramesh Dhole",
    v2.age = 42,
    v2.gender = "Female",
    v2.contactNumber = "98XXXXXX02",
    v2.address = "5, Sakkardara, Nagpur (Fictional)";

MERGE (v3:Victim {victimId: "VIC003"})
SET v3.name = "Aditya Kumar Joshi",
    v3.age = 24,
    v3.gender = "Male",
    v3.contactNumber = "98XXXXXX03",
    v3.address = "88, Ramdaspeth, Nagpur (Fictional)";

MERGE (v4:Victim {victimId: "VIC004"})
SET v4.name = "Geeta Laxman Thakur",
    v4.age = 35,
    v4.gender = "Female",
    v4.contactNumber = "98XXXXXX04",
    v4.address = "34, Arera Colony, Bhopal (Fictional)";

MERGE (v5:Victim {victimId: "VIC005"})
SET v5.name = "Mohan Das Tiwari",
    v5.age = 60,
    v5.gender = "Male",
    v5.contactNumber = "98XXXXXX05",
    v5.address = "7, Civil Lines, Jabalpur (Fictional)";

// ============================================================
// SECTION 6: FIRs
// ============================================================

MERGE (fir1:FIR {firId: "FIR001"})
SET fir1.firNumber = "FIR/2024/001",
    fir1.registrationDate = "2024-02-14",
    fir1.description = "FIR filed by bank manager regarding armed robbery at Sitabuldi branch.",
    fir1.status = "Under Investigation",
    fir1.complainantName = "Ramesh Shankar Gupta";

MERGE (fir2:FIR {firId: "FIR002"})
SET fir2.firNumber = "FIR/2024/002",
    fir2.registrationDate = "2024-03-06",
    fir2.description = "Online banking fraud complaint. Victim reports loss of funds through phishing.",
    fir2.status = "Under Investigation",
    fir2.complainantName = "Sunita Ramesh Dhole";

MERGE (fir3:FIR {firId: "FIR003"})
SET fir3.firNumber = "FIR/2024/003",
    fir3.registrationDate = "2024-01-21",
    fir3.description = "Unnatural death case. Body found on Wardha Road.",
    fir3.status = "Under Investigation",
    fir3.complainantName = "Traffic Police Patrol";

MERGE (fir4:FIR {firId: "FIR004"})
SET fir4.firNumber = "FIR/2024/004",
    fir4.registrationDate = "2024-04-10",
    fir4.description = "Vehicle theft complaint. Honda Activa stolen from mall parking.",
    fir4.status = "Closed",
    fir4.complainantName = "Aditya Kumar Joshi";

MERGE (fir5:FIR {firId: "FIR005"})
SET fir5.firNumber = "FIR/2024/005",
    fir5.registrationDate = "2024-05-18",
    fir5.description = "Narcotics case. Suspect apprehended at station with contraband.",
    fir5.status = "Closed",
    fir5.complainantName = "Officer Deepak Singh";

MERGE (fir6:FIR {firId: "FIR006"})
SET fir6.firNumber = "FIR/2024/006",
    fir6.registrationDate = "2024-06-02",
    fir6.description = "Assault complaint filed by victim at Civil Hospital.",
    fir6.status = "Pending",
    fir6.complainantName = "Mohan Das Tiwari";

// ============================================================
// SECTION 7: INVESTIGATION CASES
// ============================================================

MERGE (ic1:InvestigationCase {caseId: "CASE001"})
SET ic1.title = "Sitabuldi Bank Robbery",
    ic1.status = "Under Investigation",
    ic1.priority = "Critical",
    ic1.openedDate = "2024-02-15",
    ic1.description = "Investigation into armed robbery at State Bank Sitabuldi branch. CCTV evidence secured.";

MERGE (ic2:InvestigationCase {caseId: "CASE002"})
SET ic2.title = "Digital Banking Fraud Network",
    ic2.status = "Under Investigation",
    ic2.priority = "High",
    ic2.openedDate = "2024-03-07",
    ic2.description = "Cybercrime investigation into organized phishing operation targeting bank customers.";

MERGE (ic3:InvestigationCase {caseId: "CASE003"})
SET ic3.title = "Wardha Road Homicide",
    ic3.status = "Open",
    ic3.priority = "Critical",
    ic3.openedDate = "2024-01-22",
    ic3.description = "Homicide investigation. Victim identity unconfirmed. Forensics pending.";

MERGE (ic4:InvestigationCase {caseId: "CASE004"})
SET ic4.title = "Bhopal Railway Narcotics Seizure",
    ic4.status = "Referred to Court",
    ic4.priority = "High",
    ic4.openedDate = "2024-05-19",
    ic4.description = "Drug trafficking case. 2kg controlled substance seized. Suspect in custody.";

MERGE (ic5:InvestigationCase {caseId: "CASE005"})
SET ic5.title = "Jabalpur Market Assault",
    ic5.status = "Open",
    ic5.priority = "Medium",
    ic5.openedDate = "2024-06-03",
    ic5.description = "Assault case resulting in grievous hurt. Witnesses identified.";

// ============================================================
// SECTION 8: EVIDENCE
// ============================================================

MERGE (ev1:Evidence {evidenceId: "EV001"})
SET ev1.evidenceType = "CCTV Footage",
    ev1.description = "Bank branch CCTV recording showing two masked individuals during robbery. 45-minute clip.",
    ev1.collectedDate = "2024-02-14",
    ev1.condition = "Good";

MERGE (ev2:Evidence {evidenceId: "EV002"})
SET ev2.evidenceType = "Digital",
    ev2.description = "Phishing website server logs and IP trace records obtained from ISP.",
    ev2.collectedDate = "2024-03-10",
    ev2.condition = "Good";

MERGE (ev3:Evidence {evidenceId: "EV003"})
SET ev3.evidenceType = "Fingerprint",
    ev3.description = "Latent fingerprints lifted from bank counter. Two sets identified.",
    ev3.collectedDate = "2024-02-14",
    ev3.condition = "Good";

MERGE (ev4:Evidence {evidenceId: "EV004"})
SET ev4.evidenceType = "Physical",
    ev4.description = "2 kg of suspected controlled substance in sealed packets, tagged as EV004.",
    ev4.collectedDate = "2024-05-18",
    ev4.condition = "Good";

MERGE (ev5:Evidence {evidenceId: "EV005"})
SET ev5.evidenceType = "Witness Statement",
    ev5.description = "Written statement of two eyewitnesses who saw the assault. Signed and notarized.",
    ev5.collectedDate = "2024-06-02",
    ev5.condition = "Good";

MERGE (ev6:Evidence {evidenceId: "EV006"})
SET ev6.evidenceType = "Weapon",
    ev6.description = "Iron rod recovered from scene, suspected assault weapon. Tagged EV006.",
    ev6.collectedDate = "2024-06-03",
    ev6.condition = "Degraded";

// ============================================================
// SECTION 9: ARRESTS
// ============================================================

MERGE (arr1:Arrest {arrestId: "ARR001"})
SET arr1.arrestDate = "2024-02-20",
    arr1.status = "In Custody",
    arr1.charges = "Armed Robbery under IPC Section 392, 397";

MERGE (arr2:Arrest {arrestId: "ARR002"})
SET arr2.arrestDate = "2024-03-15",
    arr2.status = "Released on Bail",
    arr2.charges = "Cybercrime under IT Act 2000, Section 66C, 66D";

MERGE (arr3:Arrest {arrestId: "ARR003"})
SET arr3.arrestDate = "2024-05-18",
    arr3.status = "Produced in Court",
    arr3.charges = "NDPS Act 1985, Section 20 - Commercial Quantity";

MERGE (arr4:Arrest {arrestId: "ARR004"})
SET arr4.arrestDate = "2024-02-21",
    arr4.status = "Released on Bail",
    arr4.charges = "Armed Robbery under IPC Section 392 (Accomplice)";

// ============================================================
// SECTION 10: COURTS
// ============================================================

MERGE (ct1:Court {courtId: "CRT001"})
SET ct1.name = "Nagpur Sessions Court",
    ct1.location = "Civil Court Road",
    ct1.city = "Nagpur",
    ct1.courtType = "Sessions Court",
    ct1.judgeAssigned = "Hon. Justice [Fictional]";

MERGE (ct2:Court {courtId: "CRT002"})
SET ct2.name = "Bhopal Special NDPS Court",
    ct2.location = "Shyamla Hills",
    ct2.city = "Bhopal",
    ct2.courtType = "Sessions Court",
    ct2.judgeAssigned = "Hon. Justice [Fictional]";

MERGE (ct3:Court {courtId: "CRT003"})
SET ct3.name = "Jabalpur Chief Judicial Magistrate",
    ct3.location = "Napier Town",
    ct3.city = "Jabalpur",
    ct3.courtType = "Magistrate Court",
    ct3.judgeAssigned = "Hon. CJM [Fictional]";

// ============================================================
// SECTION 11: RELATIONSHIPS
// ============================================================

// Officers work at stations
MATCH (o1:Officer {officerId:"OFF001"}), (ps1:PoliceStation {stationId:"PS001"})
MERGE (o1)-[:WORKS_AT {joinedDate:"2010-06-15"}]->(ps1);

MATCH (o2:Officer {officerId:"OFF002"}), (ps1:PoliceStation {stationId:"PS001"})
MERGE (o2)-[:WORKS_AT {joinedDate:"2017-03-01"}]->(ps1);

MATCH (o3:Officer {officerId:"OFF003"}), (ps2:PoliceStation {stationId:"PS002"})
MERGE (o3)-[:WORKS_AT {joinedDate:"2002-11-20"}]->(ps2);

MATCH (o4:Officer {officerId:"OFF004"}), (ps2:PoliceStation {stationId:"PS002"})
MERGE (o4)-[:WORKS_AT {joinedDate:"2021-08-10"}]->(ps2);

MATCH (o5:Officer {officerId:"OFF005"}), (ps3:PoliceStation {stationId:"PS003"})
MERGE (o5)-[:WORKS_AT {joinedDate:"2015-01-05"}]->(ps3);

MATCH (o6:Officer {officerId:"OFF006"}), (ps4:PoliceStation {stationId:"PS004"})
MERGE (o6)-[:WORKS_AT {joinedDate:"2013-07-22"}]->(ps4);

MATCH (o7:Officer {officerId:"OFF007"}), (ps1:PoliceStation {stationId:"PS001"})
MERGE (o7)-[:WORKS_AT {joinedDate:"2001-04-12"}]->(ps1);

MATCH (o8:Officer {officerId:"OFF008"}), (ps5:PoliceStation {stationId:"PS005"})
MERGE (o8)-[:WORKS_AT {joinedDate:"2021-09-01"}]->(ps5);

// Officers register FIRs
MATCH (o1:Officer {officerId:"OFF001"}), (fir1:FIR {firId:"FIR001"})
MERGE (o1)-[:REGISTERS {registeredOn:"2024-02-14"}]->(fir1);

MATCH (o2:Officer {officerId:"OFF002"}), (fir2:FIR {firId:"FIR002"})
MERGE (o2)-[:REGISTERS {registeredOn:"2024-03-06"}]->(fir2);

MATCH (o1:Officer {officerId:"OFF001"}), (fir3:FIR {firId:"FIR003"})
MERGE (o1)-[:REGISTERS {registeredOn:"2024-01-21"}]->(fir3);

MATCH (o4:Officer {officerId:"OFF004"}), (fir4:FIR {firId:"FIR004"})
MERGE (o4)-[:REGISTERS {registeredOn:"2024-04-10"}]->(fir4);

MATCH (o6:Officer {officerId:"OFF006"}), (fir5:FIR {firId:"FIR005"})
MERGE (o6)-[:REGISTERS {registeredOn:"2024-05-18"}]->(fir5);

MATCH (o8:Officer {officerId:"OFF008"}), (fir6:FIR {firId:"FIR006"})
MERGE (o8)-[:REGISTERS {registeredOn:"2024-06-02"}]->(fir6);

// FIRs report crimes
MATCH (fir1:FIR {firId:"FIR001"}), (cr1:Crime {crimeId:"CR001"})
MERGE (fir1)-[:REPORTS]->(cr1);

MATCH (fir2:FIR {firId:"FIR002"}), (cr2:Crime {crimeId:"CR002"})
MERGE (fir2)-[:REPORTS]->(cr2);

MATCH (fir3:FIR {firId:"FIR003"}), (cr3:Crime {crimeId:"CR003"})
MERGE (fir3)-[:REPORTS]->(cr3);

MATCH (fir4:FIR {firId:"FIR004"}), (cr4:Crime {crimeId:"CR004"})
MERGE (fir4)-[:REPORTS]->(cr4);

MATCH (fir5:FIR {firId:"FIR005"}), (cr5:Crime {crimeId:"CR005"})
MERGE (fir5)-[:REPORTS]->(cr5);

MATCH (fir6:FIR {firId:"FIR006"}), (cr6:Crime {crimeId:"CR006"})
MERGE (fir6)-[:REPORTS]->(cr6);

// FIRs linked to cases
MATCH (fir1:FIR {firId:"FIR001"}), (ic1:InvestigationCase {caseId:"CASE001"})
MERGE (fir1)-[:LINKED_TO]->(ic1);

MATCH (fir2:FIR {firId:"FIR002"}), (ic2:InvestigationCase {caseId:"CASE002"})
MERGE (fir2)-[:LINKED_TO]->(ic2);

MATCH (fir3:FIR {firId:"FIR003"}), (ic3:InvestigationCase {caseId:"CASE003"})
MERGE (fir3)-[:LINKED_TO]->(ic3);

MATCH (fir5:FIR {firId:"FIR005"}), (ic4:InvestigationCase {caseId:"CASE004"})
MERGE (fir5)-[:LINKED_TO]->(ic4);

MATCH (fir6:FIR {firId:"FIR006"}), (ic5:InvestigationCase {caseId:"CASE005"})
MERGE (fir6)-[:LINKED_TO]->(ic5);

// Cases assigned to officers
MATCH (ic1:InvestigationCase {caseId:"CASE001"}), (o1:Officer {officerId:"OFF001"})
MERGE (ic1)-[:ASSIGNED_TO {assignedOn:"2024-02-15"}]->(o1);

MATCH (ic2:InvestigationCase {caseId:"CASE002"}), (o2:Officer {officerId:"OFF002"})
MERGE (ic2)-[:ASSIGNED_TO {assignedOn:"2024-03-07"}]->(o2);

MATCH (ic3:InvestigationCase {caseId:"CASE003"}), (o3:Officer {officerId:"OFF003"})
MERGE (ic3)-[:ASSIGNED_TO {assignedOn:"2024-01-22"}]->(o3);

MATCH (ic4:InvestigationCase {caseId:"CASE004"}), (o6:Officer {officerId:"OFF006"})
MERGE (ic4)-[:ASSIGNED_TO {assignedOn:"2024-05-19"}]->(o6);

MATCH (ic5:InvestigationCase {caseId:"CASE005"}), (o8:Officer {officerId:"OFF008"})
MERGE (ic5)-[:ASSIGNED_TO {assignedOn:"2024-06-03"}]->(o8);

// Cases involve criminals
MATCH (ic1:InvestigationCase {caseId:"CASE001"}), (crim1:Criminal {criminalId:"CRM001"})
MERGE (ic1)-[:INVOLVES {role:"Primary Accused"}]->(crim1);

MATCH (ic1:InvestigationCase {caseId:"CASE001"}), (crim2:Criminal {criminalId:"CRM002"})
MERGE (ic1)-[:INVOLVES {role:"Accomplice"}]->(crim2);

MATCH (ic2:InvestigationCase {caseId:"CASE002"}), (crim4:Criminal {criminalId:"CRM004"})
MERGE (ic2)-[:INVOLVES {role:"Primary Accused"}]->(crim4);

MATCH (ic2:InvestigationCase {caseId:"CASE002"}), (crim2:Criminal {criminalId:"CRM002"})
MERGE (ic2)-[:INVOLVES {role:"Accomplice"}]->(crim2);

MATCH (ic3:InvestigationCase {caseId:"CASE003"}), (crim3:Criminal {criminalId:"CRM003"})
MERGE (ic3)-[:INVOLVES {role:"Suspect"}]->(crim3);

MATCH (ic4:InvestigationCase {caseId:"CASE004"}), (crim5:Criminal {criminalId:"CRM005"})
MERGE (ic4)-[:INVOLVES {role:"Primary Accused"}]->(crim5);

// Cases have victims
MATCH (ic1:InvestigationCase {caseId:"CASE001"}), (v1:Victim {victimId:"VIC001"})
MERGE (ic1)-[:HAS_VICTIM {victimStatement:"Bank staff member, present during robbery"}]->(v1);

MATCH (ic2:InvestigationCase {caseId:"CASE002"}), (v2:Victim {victimId:"VIC002"})
MERGE (ic2)-[:HAS_VICTIM {victimStatement:"Received phishing email, lost savings"}]->(v2);

MATCH (ic3:InvestigationCase {caseId:"CASE003"}), (v3:Victim {victimId:"VIC003"})
MERGE (ic3)-[:HAS_VICTIM {victimStatement:"Victim identity pending confirmation"}]->(v3);

MATCH (ic4:InvestigationCase {caseId:"CASE004"}), (v4:Victim {victimId:"VIC004"})
MERGE (ic4)-[:HAS_VICTIM {victimStatement:"Reported suspicious activity at station"}]->(v4);

MATCH (ic5:InvestigationCase {caseId:"CASE005"}), (v5:Victim {victimId:"VIC005"})
MERGE (ic5)-[:HAS_VICTIM {victimStatement:"Victim suffered injuries, admitted to hospital"}]->(v5);

// Cases have evidence
MATCH (ic1:InvestigationCase {caseId:"CASE001"}), (ev1:Evidence {evidenceId:"EV001"})
MERGE (ic1)-[:HAS_EVIDENCE {submittedBy:"Inspector Rajesh Kumar Verma"}]->(ev1);

MATCH (ic1:InvestigationCase {caseId:"CASE001"}), (ev3:Evidence {evidenceId:"EV003"})
MERGE (ic1)-[:HAS_EVIDENCE {submittedBy:"Inspector Rajesh Kumar Verma"}]->(ev3);

MATCH (ic2:InvestigationCase {caseId:"CASE002"}), (ev2:Evidence {evidenceId:"EV002"})
MERGE (ic2)-[:HAS_EVIDENCE {submittedBy:"SI Priya Sharma"}]->(ev2);

MATCH (ic4:InvestigationCase {caseId:"CASE004"}), (ev4:Evidence {evidenceId:"EV004"})
MERGE (ic4)-[:HAS_EVIDENCE {submittedBy:"Inspector Deepak Singh"}]->(ev4);

MATCH (ic5:InvestigationCase {caseId:"CASE005"}), (ev5:Evidence {evidenceId:"EV005"})
MERGE (ic5)-[:HAS_EVIDENCE {submittedBy:"Constable Ravi Tiwari"}]->(ev5);

MATCH (ic5:InvestigationCase {caseId:"CASE005"}), (ev6:Evidence {evidenceId:"EV006"})
MERGE (ic5)-[:HAS_EVIDENCE {submittedBy:"Constable Ravi Tiwari"}]->(ev6);

// Cases lead to arrests
MATCH (ic1:InvestigationCase {caseId:"CASE001"}), (arr1:Arrest {arrestId:"ARR001"})
MERGE (ic1)-[:LEADS_TO]->(arr1);

MATCH (ic1:InvestigationCase {caseId:"CASE001"}), (arr4:Arrest {arrestId:"ARR004"})
MERGE (ic1)-[:LEADS_TO]->(arr4);

MATCH (ic2:InvestigationCase {caseId:"CASE002"}), (arr2:Arrest {arrestId:"ARR002"})
MERGE (ic2)-[:LEADS_TO]->(arr2);

MATCH (ic4:InvestigationCase {caseId:"CASE004"}), (arr3:Arrest {arrestId:"ARR003"})
MERGE (ic4)-[:LEADS_TO]->(arr3);

// Arrests involve criminals and officers
MATCH (arr1:Arrest {arrestId:"ARR001"}), (crim1:Criminal {criminalId:"CRM001"})
MERGE (arr1)-[:ARRESTED]->(crim1);

MATCH (arr2:Arrest {arrestId:"ARR002"}), (crim4:Criminal {criminalId:"CRM004"})
MERGE (arr2)-[:ARRESTED]->(crim4);

MATCH (arr3:Arrest {arrestId:"ARR003"}), (crim5:Criminal {criminalId:"CRM005"})
MERGE (arr3)-[:ARRESTED]->(crim5);

MATCH (arr4:Arrest {arrestId:"ARR004"}), (crim2:Criminal {criminalId:"CRM002"})
MERGE (arr4)-[:ARRESTED]->(crim2);

MATCH (arr1:Arrest {arrestId:"ARR001"}), (o1:Officer {officerId:"OFF001"})
MERGE (arr1)-[:MADE_BY]->(o1);

MATCH (arr2:Arrest {arrestId:"ARR002"}), (o2:Officer {officerId:"OFF002"})
MERGE (arr2)-[:MADE_BY]->(o2);

MATCH (arr3:Arrest {arrestId:"ARR003"}), (o6:Officer {officerId:"OFF006"})
MERGE (arr3)-[:MADE_BY]->(o6);

// Cases referred to courts
MATCH (ic4:InvestigationCase {caseId:"CASE004"}), (ct2:Court {courtId:"CRT002"})
MERGE (ic4)-[:REFERRED_TO {referralDate:"2024-07-01", hearingDate:"2024-08-15"}]->(ct2);

MATCH (ic1:InvestigationCase {caseId:"CASE001"}), (ct1:Court {courtId:"CRT001"})
MERGE (ic1)-[:REFERRED_TO {referralDate:"2024-09-01", hearingDate:"2024-10-10"}]->(ct1);

// ============================================================
// END OF SEED DATA
// To verify: run verification_queries.cypher
// ============================================================
