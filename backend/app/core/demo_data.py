"""
In-memory fictional seed data and CRUD operations for Demo Mode.
Used when Neo4j is not configured.
All names, entities, and incidents are entirely fictional.
"""
import copy
from typing import Dict, List, Optional, Any


INITIAL_DATA: Dict[str, Any] = {
    "stations": [
        {
            "stationId": "PS001",
            "name": "Central Police Station",
            "location": "12 MG Road",
            "city": "Bangalore",
            "contactNumber": "+91-80-22220101",
            "officerCount": 45,
        },
        {
            "stationId": "PS002",
            "name": "Indiranagar Police Station",
            "location": "100 Feet Road, HAL 2nd Stage",
            "city": "Bangalore",
            "contactNumber": "+91-80-22220102",
            "officerCount": 32,
        },
        {
            "stationId": "PS003",
            "name": "Cyber Crime Police Station",
            "location": "Infotech Park, Electronic City",
            "city": "Bangalore",
            "contactNumber": "+91-80-22220103",
            "officerCount": 20,
        },
        {
            "stationId": "PS004",
            "name": "Bandra Police Station",
            "location": "Hill Road, Bandra West",
            "city": "Mumbai",
            "contactNumber": "+91-22-26400101",
            "officerCount": 50,
        },
        {
            "stationId": "PS005",
            "name": "Connaught Place Police Station",
            "location": "Radial Road 2, CP",
            "city": "New Delhi",
            "contactNumber": "+91-11-23340101",
            "officerCount": 38,
        },
    ],
    "officers": [
        {
            "officerId": "OFF001",
            "name": "Inspector Rajesh Varma",
            "rank": "Inspector",
            "badgeNumber": "KA-INSP-101",
            "stationId": "PS001",
            "specialization": "Homicide & Violent Crime",
            "yearsOfService": 15,
        },
        {
            "officerId": "OFF002",
            "name": "Sub-Inspector Ananya Sen",
            "rank": "SI",
            "badgeNumber": "KA-SI-204",
            "stationId": "PS003",
            "specialization": "Cyber Financial Fraud",
            "yearsOfService": 6,
        },
        {
            "officerId": "OFF003",
            "name": "DSP Vikram Rathore",
            "rank": "DSP",
            "badgeNumber": "KA-DSP-012",
            "stationId": "PS001",
            "specialization": "Organized Crime",
            "yearsOfService": 20,
        },
        {
            "officerId": "OFF004",
            "name": "Constable Manoj Kumar",
            "rank": "Constable",
            "badgeNumber": "KA-CON-512",
            "stationId": "PS002",
            "specialization": "Patrol & Surveillance",
            "yearsOfService": 4,
        },
        {
            "officerId": "OFF005",
            "name": "Inspector Sunita Patil",
            "rank": "Inspector",
            "badgeNumber": "MH-INSP-305",
            "stationId": "PS004",
            "specialization": "Narcotics & Forensics",
            "yearsOfService": 12,
        },
        {
            "officerId": "OFF006",
            "name": "Sub-Inspector Amit Deshmukh",
            "rank": "SI",
            "badgeNumber": "MH-SI-418",
            "stationId": "PS004",
            "specialization": "Economic Offences",
            "yearsOfService": 7,
        },
        {
            "officerId": "OFF007",
            "name": "SP Devendra Singh",
            "rank": "SP",
            "badgeNumber": "DL-SP-005",
            "stationId": "PS005",
            "specialization": "Strategic Operations",
            "yearsOfService": 24,
        },
        {
            "officerId": "OFF008",
            "name": "Constable Kavita Nair",
            "rank": "Constable",
            "badgeNumber": "KA-CON-621",
            "stationId": "PS001",
            "specialization": "Evidence Custody",
            "yearsOfService": 5,
        },
    ],
    "crimes": [
        {
            "crimeId": "CR001",
            "crimeType": "Robbery",
            "location": "Koramangala 5th Block",
            "city": "Bangalore",
            "date": "2024-01-10",
            "severity": "High",
            "description": "Armed robbery at a regional cooperative bank branch during business hours.",
        },
        {
            "crimeId": "CR002",
            "crimeType": "Cybercrime",
            "location": "Whitefield Tech Zone",
            "city": "Bangalore",
            "date": "2024-02-14",
            "severity": "Medium",
            "description": "Spear phishing syndicate compromising corporate payroll credentials and redirecting funds.",
        },
        {
            "crimeId": "CR003",
            "crimeType": "Fraud",
            "location": "Bandra Kurla Complex",
            "city": "Mumbai",
            "date": "2024-03-01",
            "severity": "High",
            "description": "Ponzi investment scheme defrauding over 120 senior citizens of life savings.",
        },
        {
            "crimeId": "CR004",
            "crimeType": "Theft",
            "location": "Indiranagar 12th Main",
            "city": "Bangalore",
            "date": "2024-03-15",
            "severity": "Low",
            "description": "Night burglary of luxury electronics and jewelry from an unoccupied villa.",
        },
        {
            "crimeId": "CR005",
            "crimeType": "Assault",
            "location": "Connaught Circle Outer",
            "city": "New Delhi",
            "date": "2024-04-02",
            "severity": "Medium",
            "description": "Physical assault and intimidation outside commercial premises resulting in injury.",
        },
        {
            "crimeId": "CR006",
            "crimeType": "Homicide",
            "location": "Hebbal Ring Road",
            "city": "Bangalore",
            "date": "2024-04-18",
            "severity": "High",
            "description": "Fatal confrontation involving contraband syndicate enforcers near industrial yard.",
        },
    ],
    "firs": [
        {
            "firId": "FIR001",
            "firNumber": "FIR/2024/BLR/0101",
            "registrationDate": "2024-01-10",
            "description": "First information report regarding armed daylight bank robbery at Koramangala.",
            "status": "Under Investigation",
            "complainantName": "Gopalakrishna Iyer",
            "stationId": "PS001",
            "officerId": "OFF001",
            "crimeId": "CR001",
        },
        {
            "firId": "FIR002",
            "firNumber": "FIR/2024/BLR/0205",
            "registrationDate": "2024-02-15",
            "description": "Report of unauthorized network intrusion and siphoning of payroll funds.",
            "status": "Under Investigation",
            "complainantName": "Pooja Hegde",
            "stationId": "PS003",
            "officerId": "OFF002",
            "crimeId": "CR002",
        },
        {
            "firId": "FIR003",
            "firNumber": "FIR/2024/MUM/0312",
            "registrationDate": "2024-03-02",
            "description": "Complaint detailing fraudulent high-yield investment scheme operations.",
            "status": "Under Investigation",
            "complainantName": "Rameshwar Kulkarni",
            "stationId": "PS004",
            "officerId": "OFF005",
            "crimeId": "CR003",
        },
        {
            "firId": "FIR004",
            "firNumber": "FIR/2024/BLR/0419",
            "registrationDate": "2024-03-16",
            "description": "Residential break-in and theft of electronic equipment and heirlooms.",
            "status": "Closed",
            "complainantName": "Dr. Arvind Swamy",
            "stationId": "PS002",
            "officerId": "OFF004",
            "crimeId": "CR004",
        },
        {
            "firId": "FIR005",
            "firNumber": "FIR/2024/DEL/0523",
            "registrationDate": "2024-04-03",
            "description": "Violent scuffle resulting in grievous hurt and property damage.",
            "status": "Pending",
            "complainantName": "Mohan Lal Gupta",
            "stationId": "PS005",
            "officerId": "OFF007",
            "crimeId": "CR005",
        },
        {
            "firId": "FIR006",
            "firNumber": "FIR/2024/BLR/0634",
            "registrationDate": "2024-04-19",
            "description": "Homicide investigation initiated following discovery of body near warehouse.",
            "status": "Under Investigation",
            "complainantName": "Suresh Gowda",
            "stationId": "PS001",
            "officerId": "OFF003",
            "crimeId": "CR006",
        },
    ],
    "criminals": [
        {
            "criminalId": "CRM001",
            "name": "Dinesh 'Ranga' Naik",
            "age": 34,
            "gender": "Male",
            "identifyingDescription": "Deep scar on left eyebrow, eagle tattoo on right forearm",
            "knownAliases": "Ranga, DK",
            "criminalHistory": "Prior convictions for armed robbery and extortion (2018, 2021).",
        },
        {
            "criminalId": "CRM002",
            "name": "Sameer 'Ghost' Merchant",
            "age": 29,
            "gender": "Male",
            "identifyingDescription": "Wears dark frame glasses, burn mark on left palm",
            "knownAliases": "Byte, Ghost",
            "criminalHistory": "Suspected in multiple SIM-swapping and malware distribution rings.",
        },
        {
            "criminalId": "CRM003",
            "name": "Kailash Chandani",
            "age": 48,
            "gender": "Male",
            "identifyingDescription": "Heavy build, balding, mole beneath lower lip",
            "knownAliases": "KC Builder, Bossman",
            "criminalHistory": "Multiple non-bailable warrants for financial fraud and chit fund scams.",
        },
        {
            "criminalId": "CRM004",
            "name": "Raju 'Chotu' Verma",
            "age": 24,
            "gender": "Male",
            "identifyingDescription": "Slender frame, noticeable limp in right leg",
            "knownAliases": "Chotu, Pocket",
            "criminalHistory": "Repeat juvenile offender, daytime burglary and vehicle theft.",
        },
        {
            "criminalId": "CRM005",
            "name": "Jagdish 'Jagga' Pehalwan",
            "age": 39,
            "gender": "Male",
            "identifyingDescription": "Broad shoulders, scarred cheek, golden front tooth",
            "knownAliases": "Jagga Don",
            "criminalHistory": "Charges for grievous assault, land-grabbing intimidation, illegal arms.",
        },
    ],
    "victims": [
        {
            "victimId": "VIC001",
            "name": "Gopalakrishna Iyer",
            "age": 52,
            "gender": "Male",
            "contactNumber": "+91-9845011223",
            "address": "Flat 4B, Shanthi Apts, Koramangala, Bangalore",
        },
        {
            "victimId": "VIC002",
            "name": "Pooja Hegde",
            "age": 36,
            "gender": "Female",
            "contactNumber": "+91-9880199887",
            "address": "Villa 14, Palm Meadows, Whitefield, Bangalore",
        },
        {
            "victimId": "VIC003",
            "name": "Rameshwar Kulkarni",
            "age": 67,
            "gender": "Male",
            "contactNumber": "+91-9820233445",
            "address": "702 Sea Breeze Towers, Bandra West, Mumbai",
        },
        {
            "victimId": "VIC004",
            "name": "Dr. Arvind Swamy",
            "age": 45,
            "gender": "Male",
            "contactNumber": "+91-9845577665",
            "address": "23 Indiranagar Double Road, Bangalore",
        },
        {
            "victimId": "VIC005",
            "name": "Mohan Lal Gupta",
            "age": 41,
            "gender": "Male",
            "contactNumber": "+91-9811233445",
            "address": "B-12 Connaught Circus, New Delhi",
        },
    ],
    "cases": [
        {
            "caseId": "CASE001",
            "title": "Koramangala Bank Robbery Investigation",
            "status": "Under Investigation",
            "priority": "High",
            "openedDate": "2024-01-11",
            "firId": "FIR001",
            "assignedOfficerId": "OFF001",
            "description": "Comprehensive probe into the armed bank robbery with multi-agency forensics.",
        },
        {
            "caseId": "CASE002",
            "title": "Operation ByteTrap - Corporate Cyber Heist",
            "status": "Under Investigation",
            "priority": "Critical",
            "openedDate": "2024-02-16",
            "firId": "FIR002",
            "assignedOfficerId": "OFF002",
            "description": "Forensic tracking of illicit overseas crypto transactions and IP server logs.",
        },
        {
            "caseId": "CASE003",
            "title": "Bandra Multi-Crore Chit Fund Fraud",
            "status": "Referred to Court",
            "priority": "High",
            "openedDate": "2024-03-03",
            "firId": "FIR003",
            "assignedOfficerId": "OFF005",
            "description": "Asset attachment and formal charge-sheeting of fraudulent investment syndicate.",
        },
        {
            "caseId": "CASE004",
            "title": "Indiranagar Night Villa Burglary",
            "status": "Closed",
            "priority": "Low",
            "openedDate": "2024-03-17",
            "firId": "FIR004",
            "assignedOfficerId": "OFF004",
            "description": "Recovery of stolen luxury goods and final closure report submission.",
        },
        {
            "caseId": "CASE005",
            "title": "Connaught Commercial Assault Probe",
            "status": "Open",
            "priority": "Medium",
            "openedDate": "2024-04-04",
            "firId": "FIR005",
            "assignedOfficerId": "OFF007",
            "description": "Interrogation of eyewitnesses and examination of nearby commercial CCTV logs.",
        },
    ],
    "evidence": [
        {
            "evidenceId": "EV001",
            "evidenceType": "CCTV",
            "description": "High-definition security footage showing 3 armed perpetrators fleeing in a silver getaway van.",
            "collectedDate": "2024-01-10",
            "caseId": "CASE001",
            "condition": "Good",
        },
        {
            "evidenceId": "EV002",
            "evidenceType": "Weapon",
            "description": "Country-made 7.65mm pistol recovered from the getaway route storm drain.",
            "collectedDate": "2024-01-14",
            "caseId": "CASE001",
            "condition": "Good",
        },
        {
            "evidenceId": "EV003",
            "evidenceType": "Digital",
            "description": "Encrypted hard drive snapshot containing phishing scripts and command-and-control logs.",
            "collectedDate": "2024-02-18",
            "caseId": "CASE002",
            "condition": "Good",
        },
        {
            "evidenceId": "EV004",
            "evidenceType": "Document",
            "description": "Forged partnership deeds and fake audited financial statements used to lure investors.",
            "collectedDate": "2024-03-05",
            "caseId": "CASE003",
            "condition": "Good",
        },
        {
            "evidenceId": "EV005",
            "evidenceType": "Fingerprint",
            "description": "Latent fingerprint lifted from master bedroom safe handle matching police records.",
            "collectedDate": "2024-03-16",
            "caseId": "CASE004",
            "condition": "Good",
        },
        {
            "evidenceId": "EV006",
            "evidenceType": "Witness Statement",
            "description": "Sworn audio-video deposition of tea vendor present during street altercation.",
            "collectedDate": "2024-04-05",
            "caseId": "CASE005",
            "condition": "Good",
        },
    ],
    "arrests": [
        {
            "arrestId": "ARR001",
            "arrestDate": "2024-01-20",
            "status": "In Custody",
            "caseId": "CASE001",
            "criminalId": "CRM001",
            "officerId": "OFF001",
            "charges": "IPC 392 (Robbery), IPC 397 (Robbery with deadly weapon), Arms Act Sec 25",
        },
        {
            "arrestId": "ARR002",
            "arrestDate": "2024-02-28",
            "status": "Produced in Court",
            "caseId": "CASE002",
            "criminalId": "CRM002",
            "officerId": "OFF002",
            "charges": "IT Act Sec 66C (Identity Theft), Sec 66D (Cheating by personation), IPC 420 (Cheating)",
        },
        {
            "arrestId": "ARR003",
            "arrestDate": "2024-03-10",
            "status": "Produced in Court",
            "caseId": "CASE003",
            "criminalId": "CRM003",
            "officerId": "OFF005",
            "charges": "IPC 406 (Criminal Breach of Trust), IPC 420 (Cheating and Dishonestly Inducing Delivery)",
        },
        {
            "arrestId": "ARR004",
            "arrestDate": "2024-03-18",
            "status": "Released on Bail",
            "caseId": "CASE004",
            "criminalId": "CRM004",
            "officerId": "OFF004",
            "charges": "IPC 380 (Theft in dwelling house), IPC 457 (Lurking house-trespass by night)",
        },
    ],
    "courts": [
        {
            "courtId": "CRT001",
            "name": "City Civil & Sessions Court Complex",
            "location": "K.G. Road",
            "city": "Bangalore",
            "courtType": "Sessions Court",
            "judgeAssigned": "Hon. Justice S. N. Hegde",
        },
        {
            "courtId": "CRT002",
            "name": "Chief Metropolitan Magistrate Court",
            "location": "Esplanade, Fort",
            "city": "Mumbai",
            "courtType": "Magistrate Court",
            "judgeAssigned": "Hon. Magistrate R. V. Kapse",
        },
        {
            "courtId": "CRT003",
            "name": "Patiala House Courts",
            "location": "India Gate",
            "city": "New Delhi",
            "courtType": "Sessions Court",
            "judgeAssigned": "Hon. Justice Anita Sharma",
        },
    ],
    # Graph relationships
    "case_criminals": [
        {"caseId": "CASE001", "criminalId": "CRM001", "role": "PrimaryAccused"},
        {"caseId": "CASE002", "criminalId": "CRM002", "role": "PrimaryAccused"},
        {"caseId": "CASE003", "criminalId": "CRM003", "role": "PrimaryAccused"},
        {"caseId": "CASE004", "criminalId": "CRM004", "role": "Suspect"},
        {"caseId": "CASE005", "criminalId": "CRM005", "role": "PrimaryAccused"},
    ],
    "case_victims": [
        {"caseId": "CASE001", "victimId": "VIC001", "role": "Direct Victim", "victimStatement": "Branch manager held at gunpoint"},
        {"caseId": "CASE002", "victimId": "VIC002", "role": "Corporate Representative", "victimStatement": "NexaSoft IT systems breached"},
        {"caseId": "CASE003", "victimId": "VIC003", "role": "Investor", "victimStatement": "Lost savings of 25 lakhs"},
        {"caseId": "CASE004", "victimId": "VIC004", "role": "Homeowner", "victimStatement": "House ransacked while traveling"},
        {"caseId": "CASE005", "victimId": "VIC005", "role": "Shop Owner", "victimStatement": "Attacked outside shop"},
    ],
    "case_courts": [
        {"caseId": "CASE003", "courtId": "CRT002", "referralDate": "2024-03-25", "hearingDate": "2024-05-10"},
        {"caseId": "CASE001", "courtId": "CRT001", "referralDate": "2024-02-10", "hearingDate": "2024-04-20"},
    ],
}

# Working in-memory copy
_data: Dict[str, Any] = copy.deepcopy(INITIAL_DATA)


def reset_demo_data() -> None:
    """Reset the in-memory data store to original seed data."""
    global _data
    _data = copy.deepcopy(INITIAL_DATA)


# Generic Helper Functions
def _get_entity_list(entity_type: str) -> List[Dict[str, Any]]:
    return _data.get(entity_type, [])


def _get_id_key(entity_type: str) -> str:
    mapping = {
        "stations": "stationId",
        "officers": "officerId",
        "crimes": "crimeId",
        "firs": "firId",
        "criminals": "criminalId",
        "victims": "victimId",
        "cases": "caseId",
        "evidence": "evidenceId",
        "arrests": "arrestId",
        "courts": "courtId",
    }
    return mapping.get(entity_type, "id")


def _generate_id(entity_type: str, prefix: str) -> str:
    items = _get_entity_list(entity_type)
    id_key = _get_id_key(entity_type)
    existing_nums = []
    for item in items:
        val = str(item.get(id_key, ""))
        if val.startswith(prefix):
            num_part = val[len(prefix):]
            if num_part.isdigit():
                existing_nums.append(int(num_part))
    next_num = max(existing_nums, default=0) + 1
    return f"{prefix}{next_num:03d}"


# Police Stations CRUD
def get_all_stations(city: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieve all police stations, optionally filtered by city."""
    stations = _data["stations"]
    if city:
        return [s for s in stations if s.get("city", "").lower() == city.lower()]
    return list(stations)


def get_station_by_id(station_id: str) -> Optional[Dict[str, Any]]:
    """Get a police station by its ID."""
    for s in _data["stations"]:
        if s["stationId"] == station_id:
            return copy.deepcopy(s)
    return None


def create_station(station_dict: Dict[str, Any]) -> Dict[str, Any]:
    """Create a new police station."""
    data = copy.deepcopy(station_dict)
    if not data.get("stationId"):
        data["stationId"] = _generate_id("stations", "PS")
    _data["stations"].append(data)
    return copy.deepcopy(data)


def update_station(station_id: str, update_dict: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update an existing police station."""
    for i, s in enumerate(_data["stations"]):
        if s["stationId"] == station_id:
            for k, v in update_dict.items():
                if v is not None and k != "stationId":
                    s[k] = v
            _data["stations"][i] = s
            return copy.deepcopy(s)
    return None


def delete_station(station_id: str) -> bool:
    """Delete a police station by ID."""
    initial_len = len(_data["stations"])
    _data["stations"] = [s for s in _data["stations"] if s["stationId"] != station_id]
    return len(_data["stations"]) < initial_len


# Officers CRUD
def get_all_officers(station_id: Optional[str] = None, rank: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieve all police officers with optional station or rank filtering."""
    officers = _data["officers"]
    result = list(officers)
    if station_id:
        result = [o for o in result if o.get("stationId") == station_id]
    if rank:
        result = [o for o in result if o.get("rank", "").lower() == rank.lower()]
    return result


def get_officer_by_id(officer_id: str) -> Optional[Dict[str, Any]]:
    """Get officer by ID."""
    for o in _data["officers"]:
        if o["officerId"] == officer_id:
            return copy.deepcopy(o)
    return None


def create_officer(officer_dict: Dict[str, Any]) -> Dict[str, Any]:
    """Create an officer."""
    data = copy.deepcopy(officer_dict)
    if not data.get("officerId"):
        data["officerId"] = _generate_id("officers", "OFF")
    _data["officers"].append(data)
    return copy.deepcopy(data)


def update_officer(officer_id: str, update_dict: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update officer by ID."""
    for i, o in enumerate(_data["officers"]):
        if o["officerId"] == officer_id:
            for k, v in update_dict.items():
                if v is not None and k != "officerId":
                    o[k] = v
            _data["officers"][i] = o
            return copy.deepcopy(o)
    return None


def delete_officer(officer_id: str) -> bool:
    """Delete officer by ID."""
    initial_len = len(_data["officers"])
    _data["officers"] = [o for o in _data["officers"] if o["officerId"] != officer_id]
    return len(_data["officers"]) < initial_len


# Crimes CRUD
def get_all_crimes(crime_type: Optional[str] = None, severity: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieve all crimes with optional crimeType or severity filtering."""
    crimes = _data["crimes"]
    result = list(crimes)
    if crime_type:
        result = [c for c in result if c.get("crimeType", "").lower() == crime_type.lower()]
    if severity:
        result = [c for c in result if c.get("severity", "").lower() == severity.lower()]
    return result


def get_crime_by_id(crime_id: str) -> Optional[Dict[str, Any]]:
    """Get crime by ID."""
    for c in _data["crimes"]:
        if c["crimeId"] == crime_id:
            return copy.deepcopy(c)
    return None


def create_crime(crime_dict: Dict[str, Any]) -> Dict[str, Any]:
    """Create a crime record."""
    data = copy.deepcopy(crime_dict)
    if not data.get("crimeId"):
        data["crimeId"] = _generate_id("crimes", "CR")
    _data["crimes"].append(data)
    return copy.deepcopy(data)


def update_crime(crime_id: str, update_dict: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update crime record."""
    for i, c in enumerate(_data["crimes"]):
        if c["crimeId"] == crime_id:
            for k, v in update_dict.items():
                if v is not None and k != "crimeId":
                    c[k] = v
            _data["crimes"][i] = c
            return copy.deepcopy(c)
    return None


def delete_crime(crime_id: str) -> bool:
    """Delete crime record."""
    initial_len = len(_data["crimes"])
    _data["crimes"] = [c for c in _data["crimes"] if c["crimeId"] != crime_id]
    return len(_data["crimes"]) < initial_len


# FIRs CRUD
def get_all_firs(status: Optional[str] = None, station_id: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieve all FIRs with optional status or station filtering."""
    firs = _data["firs"]
    result = list(firs)
    if status:
        result = [f for f in result if f.get("status", "").lower() == status.lower()]
    if station_id:
        result = [f for f in result if f.get("stationId") == station_id]
    return result


def get_fir_by_id(fir_id: str) -> Optional[Dict[str, Any]]:
    """Get FIR by ID."""
    for f in _data["firs"]:
        if f["firId"] == fir_id:
            return copy.deepcopy(f)
    return None


def create_fir(fir_dict: Dict[str, Any]) -> Dict[str, Any]:
    """Create a new FIR."""
    data = copy.deepcopy(fir_dict)
    if not data.get("firId"):
        data["firId"] = _generate_id("firs", "FIR")
    if not data.get("firNumber"):
        data["firNumber"] = f"FIR/2024/GEN/{data['firId']}"
    _data["firs"].append(data)
    return copy.deepcopy(data)


def update_fir(fir_id: str, update_dict: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update FIR."""
    for i, f in enumerate(_data["firs"]):
        if f["firId"] == fir_id:
            for k, v in update_dict.items():
                if v is not None and k != "firId":
                    f[k] = v
            _data["firs"][i] = f
            return copy.deepcopy(f)
    return None


def delete_fir(fir_id: str) -> bool:
    """Delete FIR."""
    initial_len = len(_data["firs"])
    _data["firs"] = [f for f in _data["firs"] if f["firId"] != fir_id]
    return len(_data["firs"]) < initial_len


# Criminals CRUD
def get_all_criminals(name_search: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieve all criminals, optionally filtered by name or alias."""
    criminals = _data["criminals"]
    if name_search:
        q = name_search.lower()
        return [
            c for c in criminals
            if q in c.get("name", "").lower() or q in c.get("knownAliases", "").lower()
        ]
    return list(criminals)


def get_criminal_by_id(criminal_id: str) -> Optional[Dict[str, Any]]:
    """Get criminal by ID."""
    for c in _data["criminals"]:
        if c["criminalId"] == criminal_id:
            return copy.deepcopy(c)
    return None


def create_criminal(criminal_dict: Dict[str, Any]) -> Dict[str, Any]:
    """Create a new criminal profile."""
    data = copy.deepcopy(criminal_dict)
    if not data.get("criminalId"):
        data["criminalId"] = _generate_id("criminals", "CRM")
    _data["criminals"].append(data)
    return copy.deepcopy(data)


def update_criminal(criminal_id: str, update_dict: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update criminal profile."""
    for i, c in enumerate(_data["criminals"]):
        if c["criminalId"] == criminal_id:
            for k, v in update_dict.items():
                if v is not None and k != "criminalId":
                    c[k] = v
            _data["criminals"][i] = c
            return copy.deepcopy(c)
    return None


def delete_criminal(criminal_id: str) -> bool:
    """Delete criminal profile."""
    initial_len = len(_data["criminals"])
    _data["criminals"] = [c for c in _data["criminals"] if c["criminalId"] != criminal_id]
    return len(_data["criminals"]) < initial_len


# Victims CRUD
def get_all_victims() -> List[Dict[str, Any]]:
    """Retrieve all victims."""
    return list(_data["victims"])


def get_victim_by_id(victim_id: str) -> Optional[Dict[str, Any]]:
    """Get victim by ID."""
    for v in _data["victims"]:
        if v["victimId"] == victim_id:
            return copy.deepcopy(v)
    return None


def create_victim(victim_dict: Dict[str, Any]) -> Dict[str, Any]:
    """Create a new victim record."""
    data = copy.deepcopy(victim_dict)
    if not data.get("victimId"):
        data["victimId"] = _generate_id("victims", "VIC")
    _data["victims"].append(data)
    return copy.deepcopy(data)


def update_victim(victim_id: str, update_dict: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update victim record."""
    for i, v in enumerate(_data["victims"]):
        if v["victimId"] == victim_id:
            for k, v_val in update_dict.items():
                if v_val is not None and k != "victimId":
                    v[k] = v_val
            _data["victims"][i] = v
            return copy.deepcopy(v)
    return None


def delete_victim(victim_id: str) -> bool:
    """Delete victim record."""
    initial_len = len(_data["victims"])
    _data["victims"] = [v for v in _data["victims"] if v["victimId"] != victim_id]
    return len(_data["victims"]) < initial_len


# Investigation Cases CRUD
def get_all_cases(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    assigned_officer_id: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """Retrieve all investigation cases with optional filters."""
    cases = _data["cases"]
    result = list(cases)
    if status:
        result = [c for c in result if c.get("status", "").lower() == status.lower()]
    if priority:
        result = [c for c in result if c.get("priority", "").lower() == priority.lower()]
    if assigned_officer_id:
        result = [c for c in result if c.get("assignedOfficerId") == assigned_officer_id]
    return result


def get_case_by_id(case_id: str) -> Optional[Dict[str, Any]]:
    """Get case by ID."""
    for c in _data["cases"]:
        if c["caseId"] == case_id:
            return copy.deepcopy(c)
    return None


def create_case(case_dict: Dict[str, Any]) -> Dict[str, Any]:
    """Create a new investigation case."""
    data = copy.deepcopy(case_dict)
    if not data.get("caseId"):
        data["caseId"] = _generate_id("cases", "CASE")
    _data["cases"].append(data)
    return copy.deepcopy(data)


def update_case(case_id: str, update_dict: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update investigation case."""
    for i, c in enumerate(_data["cases"]):
        if c["caseId"] == case_id:
            for k, v in update_dict.items():
                if v is not None and k != "caseId":
                    c[k] = v
            _data["cases"][i] = c
            return copy.deepcopy(c)
    return None


def delete_case(case_id: str) -> bool:
    """Delete investigation case."""
    initial_len = len(_data["cases"])
    _data["cases"] = [c for c in _data["cases"] if c["caseId"] != case_id]
    return len(_data["cases"]) < initial_len


# Evidence CRUD
def get_all_evidence(case_id: Optional[str] = None, evidence_type: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieve all evidence records, optionally filtered by caseId or evidenceType."""
    evidence = _data["evidence"]
    result = list(evidence)
    if case_id:
        result = [e for e in result if e.get("caseId") == case_id]
    if evidence_type:
        result = [e for e in result if e.get("evidenceType", "").lower() == evidence_type.lower()]
    return result


def get_evidence_by_id(evidence_id: str) -> Optional[Dict[str, Any]]:
    """Get evidence by ID."""
    for e in _data["evidence"]:
        if e["evidenceId"] == evidence_id:
            return copy.deepcopy(e)
    return None


def create_evidence(evidence_dict: Dict[str, Any]) -> Dict[str, Any]:
    """Create a new evidence item."""
    data = copy.deepcopy(evidence_dict)
    if not data.get("evidenceId"):
        data["evidenceId"] = _generate_id("evidence", "EV")
    _data["evidence"].append(data)
    return copy.deepcopy(data)


def update_evidence(evidence_id: str, update_dict: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update evidence item."""
    for i, e in enumerate(_data["evidence"]):
        if e["evidenceId"] == evidence_id:
            for k, v in update_dict.items():
                if v is not None and k != "evidenceId":
                    e[k] = v
            _data["evidence"][i] = e
            return copy.deepcopy(e)
    return None


def delete_evidence(evidence_id: str) -> bool:
    """Delete evidence item."""
    initial_len = len(_data["evidence"])
    _data["evidence"] = [e for e in _data["evidence"] if e["evidenceId"] != evidence_id]
    return len(_data["evidence"]) < initial_len


# Arrests CRUD
def get_all_arrests(case_id: Optional[str] = None, criminal_id: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieve all arrests, optionally filtered by caseId or criminalId."""
    arrests = _data["arrests"]
    result = list(arrests)
    if case_id:
        result = [a for a in result if a.get("caseId") == case_id]
    if criminal_id:
        result = [a for a in result if a.get("criminalId") == criminal_id]
    return result


def get_arrest_by_id(arrest_id: str) -> Optional[Dict[str, Any]]:
    """Get arrest by ID."""
    for a in _data["arrests"]:
        if a["arrestId"] == arrest_id:
            return copy.deepcopy(a)
    return None


def create_arrest(arrest_dict: Dict[str, Any]) -> Dict[str, Any]:
    """Record an arrest."""
    data = copy.deepcopy(arrest_dict)
    if not data.get("arrestId"):
        data["arrestId"] = _generate_id("arrests", "ARR")
    _data["arrests"].append(data)
    return copy.deepcopy(data)


def update_arrest(arrest_id: str, update_dict: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update arrest record."""
    for i, a in enumerate(_data["arrests"]):
        if a["arrestId"] == arrest_id:
            for k, v in update_dict.items():
                if v is not None and k != "arrestId":
                    a[k] = v
            _data["arrests"][i] = a
            return copy.deepcopy(a)
    return None


def delete_arrest(arrest_id: str) -> bool:
    """Delete arrest record."""
    initial_len = len(_data["arrests"])
    _data["arrests"] = [a for a in _data["arrests"] if a["arrestId"] != arrest_id]
    return len(_data["arrests"]) < initial_len


# Courts CRUD
def get_all_courts(city: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieve all courts, optionally filtered by city."""
    courts = _data["courts"]
    if city:
        return [c for c in courts if c.get("city", "").lower() == city.lower()]
    return list(courts)


def get_court_by_id(court_id: str) -> Optional[Dict[str, Any]]:
    """Get court by ID."""
    for c in _data["courts"]:
        if c["courtId"] == court_id:
            return copy.deepcopy(c)
    return None


def create_court(court_dict: Dict[str, Any]) -> Dict[str, Any]:
    """Create a new court record."""
    data = copy.deepcopy(court_dict)
    if not data.get("courtId"):
        data["courtId"] = _generate_id("courts", "CRT")
    _data["courts"].append(data)
    return copy.deepcopy(data)


def update_court(court_id: str, update_dict: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update court record."""
    for i, c in enumerate(_data["courts"]):
        if c["courtId"] == court_id:
            for k, v in update_dict.items():
                if v is not None and k != "courtId":
                    c[k] = v
            _data["courts"][i] = c
            return copy.deepcopy(c)
    return None


def delete_court(court_id: str) -> bool:
    """Delete court record."""
    initial_len = len(_data["courts"])
    _data["courts"] = [c for c in _data["courts"] if c["courtId"] != court_id]
    return len(_data["courts"]) < initial_len


# Advanced Search and Graph Linkage
def search_cases(
    query: Optional[str] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """Search investigation cases by keyword, status, and priority."""
    results = list(_data["cases"])
    if query:
        q = query.lower()
        results = [
            c for c in results
            if q in c.get("title", "").lower()
            or q in c.get("description", "").lower()
            or q in c.get("caseId", "").lower()
        ]
    if status:
        results = [c for c in results if c.get("status", "").lower() == status.lower()]
    if priority:
        results = [c for c in results if c.get("priority", "").lower() == priority.lower()]
    return results


def get_case_detail(case_id: str) -> Optional[Dict[str, Any]]:
    """
    Get full case graph details with linked FIR, Officer, Station,
    Criminals, Victims, Evidence, Arrests, and Court.
    """
    case = get_case_by_id(case_id)
    if not case:
        return None

    detail = copy.deepcopy(case)

    # Linked FIR and Crime
    fir = None
    crime = None
    if case.get("firId"):
        fir = get_fir_by_id(case["firId"])
        if fir and fir.get("crimeId"):
            crime = get_crime_by_id(fir["crimeId"])
    detail["fir"] = fir
    detail["crime"] = crime

    # Assigned Officer & Station
    officer = None
    station = None
    if case.get("assignedOfficerId"):
        officer = get_officer_by_id(case["assignedOfficerId"])
        if officer and officer.get("stationId"):
            station = get_station_by_id(officer["stationId"])
    elif fir and fir.get("stationId"):
        station = get_station_by_id(fir["stationId"])
    detail["officer"] = officer
    detail["station"] = station

    # Linked Criminals with roles
    linked_criminals = []
    crm_roles = {
        item["criminalId"]: item.get("role", "Suspect")
        for item in _data.get("case_criminals", [])
        if item.get("caseId") == case_id
    }
    for crm_id, role in crm_roles.items():
        crm = get_criminal_by_id(crm_id)
        if crm:
            crm_copy = copy.deepcopy(crm)
            crm_copy["role"] = role
            linked_criminals.append(crm_copy)
    detail["criminals"] = linked_criminals

    # Linked Victims
    linked_victims = []
    vic_entries = [
        item for item in _data.get("case_victims", [])
        if item.get("caseId") == case_id
    ]
    for item in vic_entries:
        vic = get_victim_by_id(item["victimId"])
        if vic:
            vic_copy = copy.deepcopy(vic)
            vic_copy["role"] = item.get("role", "Victim")
            vic_copy["statement"] = item.get("victimStatement", "")
            linked_victims.append(vic_copy)
    detail["victims"] = linked_victims

    # Linked Evidence
    detail["evidence"] = [
        e for e in _data["evidence"] if e.get("caseId") == case_id
    ]

    # Linked Arrests
    detail["arrests"] = [
        a for a in _data["arrests"] if a.get("caseId") == case_id
    ]

    # Linked Court
    linked_court = None
    court_entry = next(
        (c for c in _data.get("case_courts", []) if c.get("caseId") == case_id),
        None,
    )
    if court_entry and court_entry.get("courtId"):
        court_obj = get_court_by_id(court_entry["courtId"])
        if court_obj:
            linked_court = copy.deepcopy(court_obj)
            linked_court["referralDate"] = court_entry.get("referralDate")
            linked_court["hearingDate"] = court_entry.get("hearingDate")
    detail["court"] = linked_court

    return detail


def get_officer_cases(officer_id: str) -> List[Dict[str, Any]]:
    """Retrieve all cases assigned to a specific officer."""
    return [c for c in _data["cases"] if c.get("assignedOfficerId") == officer_id]


def get_criminal_cases(criminal_id: str) -> List[Dict[str, Any]]:
    """Retrieve all cases associated with a criminal."""
    case_ids = {
        item["caseId"]
        for item in _data.get("case_criminals", [])
        if item.get("criminalId") == criminal_id
    }
    # Also include cases from arrest records
    for arrest in _data.get("arrests", []):
        if arrest.get("criminalId") == criminal_id and arrest.get("caseId"):
            case_ids.add(arrest["caseId"])

    return [c for c in _data["cases"] if c.get("caseId") in case_ids]


def search_global(query: str) -> Dict[str, Any]:
    """Search across all entity types in demo mode."""
    q = (query or "").lower().strip()
    if not q:
        return {
            "query": query,
            "total_matches": 0,
            "results": {
                "stations": [],
                "officers": [],
                "crimes": [],
                "firs": [],
                "criminals": [],
                "victims": [],
                "cases": [],
                "evidence": [],
                "arrests": [],
                "courts": [],
            },
        }

    stations_match = [
        s for s in _data["stations"]
        if q in s.get("name", "").lower()
        or q in s.get("city", "").lower()
        or q in s.get("stationId", "").lower()
    ]

    officers_match = [
        o for o in _data["officers"]
        if q in o.get("name", "").lower()
        or q in o.get("badgeNumber", "").lower()
        or q in o.get("specialization", "").lower()
        or q in o.get("officerId", "").lower()
    ]

    crimes_match = [
        c for c in _data["crimes"]
        if q in c.get("crimeType", "").lower()
        or q in c.get("description", "").lower()
        or q in c.get("city", "").lower()
        or q in c.get("crimeId", "").lower()
    ]

    firs_match = [
        f for f in _data["firs"]
        if q in f.get("firNumber", "").lower()
        or q in f.get("description", "").lower()
        or q in f.get("complainantName", "").lower()
        or q in f.get("firId", "").lower()
    ]

    criminals_match = [
        crm for crm in _data["criminals"]
        if q in crm.get("name", "").lower()
        or q in crm.get("knownAliases", "").lower()
        or q in crm.get("criminalHistory", "").lower()
        or q in crm.get("criminalId", "").lower()
    ]

    victims_match = [
        v for v in _data["victims"]
        if q in v.get("name", "").lower()
        or q in v.get("address", "").lower()
        or q in v.get("victimId", "").lower()
    ]

    cases_match = [
        c for c in _data["cases"]
        if q in c.get("title", "").lower()
        or q in c.get("description", "").lower()
        or q in c.get("caseId", "").lower()
    ]

    evidence_match = [
        e for e in _data["evidence"]
        if q in e.get("evidenceType", "").lower()
        or q in e.get("description", "").lower()
        or q in e.get("evidenceId", "").lower()
    ]

    arrests_match = [
        a for a in _data["arrests"]
        if q in a.get("charges", "").lower()
        or q in a.get("status", "").lower()
        or q in a.get("arrestId", "").lower()
    ]

    courts_match = [
        crt for crt in _data["courts"]
        if q in crt.get("name", "").lower()
        or q in crt.get("judgeAssigned", "").lower()
        or q in crt.get("city", "").lower()
        or q in crt.get("courtId", "").lower()
    ]

    total_matches = (
        len(stations_match)
        + len(officers_match)
        + len(crimes_match)
        + len(firs_match)
        + len(criminals_match)
        + len(victims_match)
        + len(cases_match)
        + len(evidence_match)
        + len(arrests_match)
        + len(courts_match)
    )

    return {
        "query": query,
        "total_matches": total_matches,
        "results": {
            "stations": stations_match,
            "officers": officers_match,
            "crimes": crimes_match,
            "firs": firs_match,
            "criminals": criminals_match,
            "victims": victims_match,
            "cases": cases_match,
            "evidence": evidence_match,
            "arrests": arrests_match,
            "courts": courts_match,
        },
    }


def get_dashboard_stats() -> Dict[str, Any]:
    """Calculate and return aggregate crime management statistics."""
    cases = _data["cases"]
    crimes = _data["crimes"]
    firs = _data["firs"]
    arrests = _data["arrests"]

    # Cases breakdown
    cases_by_status: Dict[str, int] = {}
    for c in cases:
        st = c.get("status", "Unknown")
        cases_by_status[st] = cases_by_status.get(st, 0) + 1

    cases_by_priority: Dict[str, int] = {}
    for c in cases:
        p = c.get("priority", "Normal")
        cases_by_priority[p] = cases_by_priority.get(p, 0) + 1

    # Crimes breakdown
    crimes_by_type: Dict[str, int] = {}
    for cr in crimes:
        t = cr.get("crimeType", "Other")
        crimes_by_type[t] = crimes_by_type.get(t, 0) + 1

    # FIRs breakdown
    firs_by_status: Dict[str, int] = {}
    for f in firs:
        st = f.get("status", "Unknown")
        firs_by_status[st] = firs_by_status.get(st, 0) + 1

    # Arrests breakdown
    arrests_by_status: Dict[str, int] = {}
    for a in arrests:
        st = a.get("status", "Unknown")
        arrests_by_status[st] = arrests_by_status.get(st, 0) + 1

    return {
        "counts": {
            "stations": len(_data["stations"]),
            "officers": len(_data["officers"]),
            "firs": len(_data["firs"]),
            "crimes": len(_data["crimes"]),
            "criminals": len(_data["criminals"]),
            "victims": len(_data["victims"]),
            "cases": len(_data["cases"]),
            "evidence": len(_data["evidence"]),
            "arrests": len(_data["arrests"]),
            "courts": len(_data["courts"]),
        },
        "cases_by_status": cases_by_status,
        "cases_by_priority": cases_by_priority,
        "crimes_by_type": crimes_by_type,
        "firs_by_status": firs_by_status,
        "arrests_by_status": arrests_by_status,
        "recent_cases": cases[:5],
        "recent_firs": firs[:5],
    }
